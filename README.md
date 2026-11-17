# Yugo Signage

Yugo Signage is a self-hosted digital signage admin for multiple Smart TVs. It manages media, playlists, screen pairing, and playback with Firebase and a Next.js App Router frontend.

The product and visual decisions live in:

- [`PRODUCT.md`](./PRODUCT.md): users, scope, voice, and product principles.
- [`DESIGN.md`](./DESIGN.md): tokens, layout, component states, responsive rules, and accessibility requirements.
- [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md): architecture, data model, pairing, and playback constraints.

## Development

Use Node 24 LTS. Install dependencies and start the development server:

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. The admin is at `/admin`; the player runs at `/` and `/player` redirects there for compatibility.

## Verification

```bash
npm run lint
npm run typecheck
npm run build
npm run verify
npm run audit
# With the dev or production server running:
npm run smoke
```

Firebase client values belong in `.env.local`. Server-only Firebase Admin credentials and `ADMIN_EMAIL` must never be exposed to the browser or committed. See `.env.example` for the required variables.

## Deployment

Netlify uses `npm run build` and the official Next.js plugin. The deployment runtime is pinned to Node 24 in `netlify.toml` and should match local development.

## Local JVC TV control pilot

The paired JVC Android TV can be controlled from this Mac while both are on the same network. The pairing certificate is stored only in `.local/tv-remote/jvc/` and is ignored by Git. Local controls are also available in **Admin → Screens** while the local development server is running. The API requires the signed-in admin session, same-origin requests, and `LOCAL_TV_CONTROL_ENABLED=true`; it is disabled in production.

```bash
python3 -m venv .local/tv-remote-venv
.local/tv-remote-venv/bin/python -m pip install -r scripts/requirements-tv-remote.txt
.local/tv-remote-venv/bin/python scripts/tv_remote.py status
.local/tv-remote-venv/bin/python scripts/tv_remote.py on
.local/tv-remote-venv/bin/python scripts/tv_remote.py off
.local/tv-remote-venv/bin/python scripts/tv_remote.py volume 25
```

Add `LOCAL_TV_CONTROL_ENABLED=true` to `.env.local`, then run `npm run dev` on this Mac and sign in to the local admin URL. Keep the JVC and this Mac on the same network. The hosted Netlify admin cannot directly reach the TV.

To open this local admin from another device on the same Wi-Fi, keep the development server running on the Mac and visit `http://<MAC-LAN-IP>:3000/admin` from that device. Next.js listens on all network interfaces by default. Sign in from that LAN address; the TV control requests then run on the Mac, which must remain awake and connected to the Wi-Fi. The hosted admin can also send cloud playback and volume commands to an online TV running Yugo Player 0.2 or later. Local power control still needs the Mac and the same network.

If the TV's hostname changes, pass `--host <IP-address>` after the action. Run `pair` if the TV revokes the pairing certificate. Power control uses the TV's standby state; it cannot restore a TV disconnected from mains power. The tool accepts only local commands and opens no network port.

## Android TV player pilot

`android-tv-player/` contains a small Android TV app for the JVC pilot. It opens the existing web player at `/` in a full-screen WebView, keeps the display awake while the app is open, allows video autoplay, saves the player site address on the TV, and shows a retry screen if the page cannot load. Press **Back** on the TV remote to change the address. This app uses the same Firebase playlists and screen pairing as the web player.

Build the debug APK with Android Studio (open `android-tv-player/`) or with JDK 17 and Android SDK Platform 35 installed:

```bash
cd android-tv-player
./gradlew :app:assembleDebug
```

The APK is generated at `android-tv-player/app/build/outputs/apk/debug/app-debug.apk`. Install it on the JVC with Android Studio/ADB or copy the APK to a USB drive and use the TV's installer. On first launch, enter the HTTPS site address currently used by Fully Kiosk; the app loads its root player route. Because this app has its own WebView storage, it will show a new pairing code. Add that code in **Admin → Screens**, assign the same playlist, and confirm images and videos play before removing Fully Kiosk. The old screen record can be deleted after the pilot succeeds.

Once installed, **Open signage app** in the local JVC controls opens the app through its `yugosignage://player` link. This pilot still requires network access for web content and media. It does not yet cache media files or guarantee automatic launch after a full TV reboot; those behaviors need on-device testing before relying on it for unattended signage.

In **Admin → Screens**, select a paired screen to use **Cloud controls**. Play, pause, next item and reload run in the web player; volume up/down and mute require Yugo Player 0.2+ with its native bridge. Commands expire after 90 seconds and the TV acknowledges applied, unsupported or failed commands in Firestore. Deploy `firestore.rules` to allow acknowledgements. The controls need the TV powered on, connected to the internet and running the player. Android may suspend the app in standby, so cloud commands cannot reliably wake the TV. Videos in the playlist are currently muted by the web player; changing the TV volume affects other TV audio but does not unmute those videos.

On the JVC Android 11 pilot, the app was installed and paired as **JVC 40 Android TV** with the **Posters** playlist. Image and video playback, launching from the local remote, and returning to playback after standby were verified. The APK is a debug build for this pilot; use a stable release signing key before rolling it out to the rest of the TVs.
