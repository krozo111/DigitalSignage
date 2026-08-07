# Yugo Signage

Yugo Signage is a self-hosted digital signage admin for five Smart TVs. It manages media, playlists, screen pairing, and playback with Firebase and a Next.js App Router frontend.

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
