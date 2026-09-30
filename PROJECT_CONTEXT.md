# PROJECT_CONTEXT: Yugo Signage

## 1. Vision and objectives

Yugo Signage is a self-hosted digital signage framework for managing five Smart TVs centrally.

- **No subscription:** Firebase Spark and Netlify/Vercel free tiers.
- **Clear boundaries:** Media → Playlists → Screens.
- **Stable playback:** Designed for resource-constrained Smart TV browsers.
- **Short admin sessions:** Desktop for composition, mobile for on-site operations.

## 2. Architecture

The application is a Next.js App Router project in `mi-signage/`.

- `src/app/admin`: authenticated admin routes for Dashboard, Media, Playlists, and Screens.
- `src/app/player`: full-screen player route, currently exposed at `/` with `/player` redirecting to it.
- `src/features`: domain-specific UI and hooks.
- `src/lib/services`: Firebase data and Storage services.
- `src/lib`: Firebase configuration, auth session verification, cache, and shared domain helpers.
- `src/components`: shared shell and UI primitives.

## 3. Firestore entities

- **`media`**: `{ id, name, url, type, size, storagePath, createdAt }`
- **`playlists`**: `{ id, name, items: [{ mediaId, duration, order }], createdAt, updatedAt }`
- **`screens`**: `{ id, pairingCode, pairingCodeExpiresAt, name, playlistId, lastSeen, status }`
- **`settings`**: reserved for admin configuration such as the global refresh time.

The admin is a single Firebase Auth account with an `admin: true` custom claim and an eight-hour server-verified session cookie. The browser initializes Firebase App Check; production builds require the reCAPTCHA site key. Firestore and Storage enforcement still has to be enabled and confirmed in Firebase Console before public player operations are protected by App Check.

## 4. Pairing flow

1. A player without a stored `screenId` creates a screen document.
2. The player generates a six-character pairing code with a short expiry and displays it with a QR code.
3. The admin enters the code, names the screen, and optionally assigns a playlist.
4. The player observes its screen document and switches to the assigned playlist.

## 5. Playback resilience

- Images advance on their configured duration.
- Videos start muted and inline, and advance on `ended`.
- The next asset is prefetched to avoid black frames.
- Playlist metadata is cached locally for reconnects.
- Media bytes are not cached by this app for offline playback; the player shows an offline warning when it detects a disconnected browser.
- A service-worker/Cache API layer is still needed for actual offline asset availability. Reliable video support also needs Storage CORS and byte-range-aware caching, verified on target TVs.
- The player performs a guarded daily reload to limit long-lived Smart TV browser memory growth.

## 6. Constraints

- Maximum upload size: 50 MB per file, checked client-side and restricted in Storage rules. File signatures are validated in the browser; Storage rules only inspect declared MIME type, size, admin claim, and uid path.
- Supported media: JPEG, PNG, GIF, WebP, MP4, QuickTime, and WebM.
- Admin security: one allow-listed admin identity, eight-hour server-verified session cookie, and custom claim. App Check enforcement status must be confirmed in Firebase Console.
- UI: the visual source of truth is `DESIGN.md`; light and dark themes are both first-class.
- Runtime: Node 24 LTS, Next.js 16 App Router, React 19, TypeScript strict mode.
