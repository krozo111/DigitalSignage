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

The admin is a single Firebase Auth account with an `admin: true` custom claim. Players use App Check and restricted public document operations; admin reads and writes require the custom claim.

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
- A service-worker/Cache API layer is planned for actual offline asset availability; `localStorage` alone is metadata resilience, not media caching.
- The player performs a guarded daily reload to limit long-lived Smart TV browser memory growth.

## 6. Constraints

- Maximum upload size: 50 MB per file, validated client-side and in Storage rules.
- Supported media: JPEG, PNG, GIF, WebP, MP4, QuickTime, and WebM.
- Admin security: one allow-listed admin identity, server-verified session cookie, custom claim, App Check enforcement.
- UI: the visual source of truth is `DESIGN.md`; light and dark themes are both first-class.
- Runtime: Node 24 LTS, Next.js 16 App Router, React 19, TypeScript strict mode.
