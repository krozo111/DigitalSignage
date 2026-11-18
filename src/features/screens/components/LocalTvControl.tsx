"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { StatusDot } from "@/components/ui/StatusDot";

interface TvStatus {
  device: { manufacturer?: string; model?: string; sw_version?: string } | null;
  power: "on" | "off" | "unknown";
  app: string;
  volume: { level: number; max: number; muted: boolean } | null;
}

type TvAction = "on" | "off" | "volume-up" | "volume-down" | "mute" | "unmute" | "launch-player";

export function LocalTvControl({ deviceId, label }: { deviceId: "jvc" | "foyer" | "lvl35"; label: string }) {
  const [status, setStatus] = useState<TvStatus | null>(null);
  const [targetVolume, setTargetVolume] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const readStatus = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await fetch(`/api/local-tv?device=${deviceId}`, { cache: "no-store", signal });
      if (response.status === 404) {
        setStatus(null);
        setError(null);
        setUnavailable(true);
        return;
      }
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "TV status unavailable.");
      setStatus(payload as TvStatus);
      setTargetVolume(payload.volume?.level ?? null);
      setError(null);
      setUnavailable(false);
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "AbortError") return;
      setUnavailable(false);
      setError(cause instanceof Error ? cause.message : "TV status unavailable.");
    }
  }, [deviceId]);

  useEffect(() => {
    const controller = new AbortController();
    void readStatus(controller.signal);
    return () => controller.abort();
  }, [readStatus]);

  const send = async (action: TvAction | "volume", level?: number) => {
    setBusy(action);
    setError(null);
    try {
      const response = await fetch("/api/local-tv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device: deviceId, action, ...(level === undefined ? {} : { level }) }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "The TV did not confirm the action.");
      setStatus(payload as TvStatus);
      setTargetVolume(payload.volume?.level ?? null);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "The TV did not confirm the action.";
      await readStatus();
      setError(message);
    } finally {
      setBusy(null);
    }
  };

  const powerLabel = status?.power === "on" ? "Online" : status?.power === "off" ? "Standby" : "Unknown";
  const title = status?.device?.model || label;
  const canControlPower = deviceId !== "foyer";
  const headingId = `local-tv-heading-${deviceId}`;
  const volumeId = `local-tv-volume-${deviceId}`;

  return (
    <section className="overflow-hidden rounded-lg border border-surface-border bg-surface-card" aria-labelledby={headingId}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-surface-border px-4 py-4 sm:px-5">
        <div>
          <p className="text-eyebrow text-ink-soft">On this Mac and Wi-Fi</p>
          <h2 id={headingId} className="mt-1 text-label text-ink">{label}</h2>
          <p className="mt-1 text-meta text-ink-muted">{title}{status?.app ? ` · ${status.app}` : ""}</p>
        </div>
        <span className={`flex items-center gap-2 rounded-full border border-surface-border px-3 py-1.5 text-meta font-semibold ${status?.power === "on" ? "text-cleared-green" : status?.power === "off" ? "text-pending-amber" : "text-ink-muted"}`}>
          <StatusDot online={status?.power === "on"} />
          {unavailable ? "Local service off" : status ? powerLabel : error ? "Unavailable" : "Connecting"}
        </span>
      </div>

      <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[1fr_1fr] lg:items-center">
        {unavailable ? (
          <div className="space-y-1 text-meta text-ink-muted">
            <p>Local TV controls work from the development server on this Mac.</p>
            <p>Set <code className="font-mono text-ink">LOCAL_TV_CONTROL_ENABLED=true</code> in the local environment and open the admin on this Mac.</p>
          </div>
        ) : error ? (
          <div className="space-y-2 text-meta text-pending-amber" role="alert">
            <p>{error}</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" disabled={busy !== null} onClick={() => void readStatus()}>Retry connection</Button>
              {canControlPower && <Button variant="affirm" size="sm" disabled={busy !== null} loading={busy === "on"} onClick={() => void send("on")}>Turn on</Button>}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {canControlPower && <Button variant="affirm" size="md" disabled={!status || busy !== null || status.power === "on"} loading={busy === "on"} onClick={() => void send("on")}>Turn on</Button>}
            {canControlPower && <Button variant="secondary" size="md" disabled={!status || busy !== null || status.power !== "on"} loading={busy === "off"} onClick={() => void send("off")}>Standby</Button>}
            <Button variant="secondary" size="md" disabled={!status || busy !== null || status.power !== "on"} loading={busy === "launch-player"} onClick={() => void send("launch-player")}>Open signage app</Button>
            <Button variant="secondary" size="md" disabled={!status?.volume || busy !== null} loading={busy === "volume-down"} onClick={() => void send("volume-down")}>Volume −</Button>
            <Button variant="secondary" size="md" disabled={!status?.volume || busy !== null} loading={busy === "volume-up"} onClick={() => void send("volume-up")}>Volume +</Button>
            <Button variant="ghost" size="md" disabled={!status?.volume || busy !== null} loading={busy === "mute" || busy === "unmute"} onClick={() => void send(status?.volume?.muted ? "unmute" : "mute")}>
              {status?.volume?.muted ? "Unmute" : "Mute"}
            </Button>
          </div>
        )}

        {!unavailable && !error && status?.volume && (
          <div className="rounded-md bg-surface-sunken px-4 py-3">
            <div className="flex items-baseline justify-between gap-3">
              <label htmlFor={volumeId} className="text-meta font-semibold text-ink">Volume</label>
              <span className="font-mono text-meta text-ink-soft tnum">{targetVolume ?? status.volume.level} / {status.volume.max}{status.volume.muted ? " · muted" : ""}</span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <input
                id={volumeId}
                type="range"
                min={0}
                max={status.volume.max}
                value={targetVolume ?? status.volume.level}
                onChange={(event) => setTargetVolume(Number(event.target.value))}
                className="min-w-0 flex-1 accent-signal-mint"
                disabled={busy !== null || status.power !== "on"}
              />
              <Button variant="secondary" size="sm" disabled={busy !== null || status.power !== "on" || targetVolume === status.volume.level} loading={busy === "volume"} onClick={() => targetVolume !== null && void send("volume", targetVolume)}>
                Apply
              </Button>
            </div>
          </div>
        )}
      </div>

      <p className="border-t border-surface-border px-4 py-3 text-meta text-ink-muted sm:px-5">
        {deviceId === "foyer"
          ? "Power controls are unavailable for this TV until wake from standby is verified. Volume and app launch require the TV to be awake and reachable from this Mac."
          : deviceId === "lvl35"
            ? "Power controls are enabled for testing. If the TV drops off Wi-Fi in standby, use its physical remote to turn it back on. This Mac must stay connected to the same network."
            : "Local access only. The Mac must stay connected to this network; the cloud admin does not directly reach the TV."}
      </p>
    </section>
  );
}
