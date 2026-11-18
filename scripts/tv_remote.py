"""Local control for the paired JVC Android TV pilot.

The pairing certificate stays in .local/tv-remote/jvc, which is git-ignored.
This tool never opens a listening port or exposes the TV to the internet.
"""

import argparse
import asyncio
import json
import os
import re
import sys
from pathlib import Path

from androidtvremote2 import AndroidTVRemote, InvalidAuth


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_HOST = "Android-3.local"
PLAYER_PACKAGE = "com.yugo.signage.tvplayer"
PLAYER_LINK = "yugosignage://player"


def state(remote: AndroidTVRemote) -> dict:
    return {
        "device": remote.device_info,
        "power": "on" if remote.is_on else "off" if remote.is_on is False else "unknown",
        "app": remote.current_app,
        "volume": remote.volume_info,
    }


async def wait_for(predicate, seconds: float) -> bool:
    deadline = asyncio.get_running_loop().time() + seconds
    while asyncio.get_running_loop().time() < deadline:
        if predicate():
            return True
        await asyncio.sleep(0.1)
    return predicate()


async def pair(remote: AndroidTVRemote, cert_dir: Path) -> None:
    cert_dir.mkdir(mode=0o700, parents=True, exist_ok=True)
    os.chmod(cert_dir, 0o700)
    await remote.async_generate_cert_if_missing()
    for filename in ("cert.pem", "key.pem"):
        os.chmod(cert_dir / filename, 0o600)

    await remote.async_start_pairing()
    code = input("Code shown on the TV: ").strip().upper()
    if len(code) != 6:
        raise ValueError("The pairing code must have six characters")
    await remote.async_finish_pairing(code)
    await remote.async_connect()
    print(json.dumps(state(remote)))


async def command(remote: AndroidTVRemote, action: str, level: int | None) -> None:
    if action == "status":
        print(json.dumps(state(remote)))
        return

    if action in ("on", "off"):
        desired = action == "on"
        if remote.is_on is None:
            raise RuntimeError("TV power state is unknown; no command sent")
        if remote.is_on != desired:
            remote.send_key_command("POWER")
            if not await wait_for(lambda: remote.is_on == desired, 10):
                raise RuntimeError("POWER was sent, but the TV did not confirm the new state")

    elif action in ("volume-up", "volume-down"):
        if remote.volume_info is None:
            raise RuntimeError("TV volume is unknown; no command sent")
        old = remote.volume_info["level"]
        at_limit = (action == "volume-up" and old >= remote.volume_info["max"]) or (action == "volume-down" and old <= 0)
        if not at_limit:
            remote.send_key_command("VOLUME_UP" if action == "volume-up" else "VOLUME_DOWN")
            if not await wait_for(lambda: remote.volume_info is not None and remote.volume_info["level"] != old, 3):
                raise RuntimeError("Volume key was sent, but the TV did not confirm a change")

    elif action in ("mute", "unmute"):
        desired = action == "mute"
        if remote.volume_info is None:
            raise RuntimeError("TV mute state is unknown; no command sent")
        if remote.volume_info["muted"] != desired:
            remote.send_key_command("VOLUME_MUTE")
            if not await wait_for(lambda: remote.volume_info is not None and remote.volume_info["muted"] == desired, 3):
                raise RuntimeError("Mute key was sent, but the TV did not confirm the new state")

    elif action == "volume":
        if remote.volume_info is None or level is None:
            raise RuntimeError("TV volume is unknown; no command sent")
        maximum = remote.volume_info["max"]
        if not 0 <= level <= maximum:
            raise ValueError(f"Volume must be between 0 and {maximum}")
        for _ in range(maximum + 1):
            current = remote.volume_info["level"]
            if current == level:
                break
            key = "VOLUME_UP" if current < level else "VOLUME_DOWN"
            remote.send_key_command(key)
            if not await wait_for(lambda: remote.volume_info is not None and remote.volume_info["level"] != current, 3):
                raise RuntimeError("Volume key was sent, but the TV stopped reporting changes")
        if remote.volume_info["level"] != level:
            raise RuntimeError("TV did not reach the requested volume")

    elif action == "launch-player":
        if remote.is_on is not True:
            raise RuntimeError("TV must be on before launching the player")
        if remote.current_app != PLAYER_PACKAGE:
            remote.send_launch_app_command(PLAYER_LINK)
            if not await wait_for(lambda: remote.current_app == PLAYER_PACKAGE, 12):
                raise RuntimeError("Player launch was sent, but the TV did not confirm it; install the app first")

    print(json.dumps(state(remote)))


async def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=("pair", "status", "on", "off", "volume-up", "volume-down", "mute", "unmute", "volume", "launch-player"))
    parser.add_argument("level", nargs="?", type=int, help="Target level for the volume action")
    parser.add_argument("--device", default="jvc", help="Local device ID for its separate pairing certificate")
    parser.add_argument("--host", default=os.environ.get("TV_HOST", DEFAULT_HOST), help="TV hostname or IP address")
    args = parser.parse_args()
    if not re.fullmatch(r"[a-z0-9-]{1,32}", args.device):
        parser.error("device ID must contain lowercase letters, digits or hyphens")
    cert_dir = PROJECT_ROOT / ".local" / "tv-remote" / args.device
    if args.action == "volume" and args.level is None:
        parser.error("volume requires a target level")
    if args.action != "volume" and args.level is not None:
        parser.error("a level is only accepted with volume")

    if args.action != "pair" and not all((cert_dir / name).exists() for name in ("cert.pem", "key.pem")):
        parser.error("TV is not paired on this Mac; run the pair action first")

    remote = AndroidTVRemote(
        client_name="Yugo Signage Pilot" if args.device == "jvc" else f"Yugo Signage {args.device}",
        certfile=str(cert_dir / "cert.pem"),
        keyfile=str(cert_dir / "key.pem"),
        host=args.host,
    )
    try:
        if args.action == "pair":
            await pair(remote, cert_dir)
        else:
            try:
                await remote.async_connect()
            except InvalidAuth as exc:
                raise RuntimeError("TV rejected this pairing; run the pair action again") from exc
            await asyncio.sleep(0.3)
            await command(remote, args.action, args.level)
    finally:
        remote.disconnect()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (OSError, RuntimeError, ValueError) as exc:
        print(f"TV control failed: {exc}", file=sys.stderr)
        sys.exit(1)
