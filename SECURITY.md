# Security

This document records the security model and the operational steps required to
keep it sound. Read it before changing auth, Firestore/Storage rules, or the
deployment flow.

## Authorization model

- **Admin** authenticates with email/password (Firebase Auth) and gets an
  `admin-session` HTTP-only cookie via `POST /api/auth/session`. The server
  pins the account to `ADMIN_EMAIL` before issuing the cookie. Firebase cookies
  last up to 14 days and are renewed on startup, when returning to the app, and
  at least every seven days while that device's persisted Firebase login is
  valid. The original sign-in has a 30-day maximum age, after which that device
  must authenticate again. Logging out clears only the current device's cookie
  and Firebase login; it does not sign out other devices.
- **Data access is authorized by the security rules, not by the Next.js
  server.** The browser Firestore/Storage SDKs (and the raw REST API) talk
  directly to Firebase, so the rules are the real gate. `isAdmin()` requires the
  `admin: true` custom claim — being merely authenticated is **not** enough.
- **`POST /api/auth/session` also requires the `admin: true` claim** before
  issuing the cookie. This makes a missing claim fail loudly at login (clear
  error) instead of silently — a logged-in admin whose every read/write is
  denied by the rules. If login is rejected for the right account, run step 1.
- **Players** are anonymous. They self-register a `screens/{id}` doc and read
  screen, playlist, and media documents by ID. These public paths are meant to
  be gated by **App Check** (see pending item below); reads are not scoped to
  the player's own screen.

## Required operational steps

### 1. Grant the admin custom claim, then deploy rules (in this order)

The rules check `request.auth.token.admin == true`. Deploying them before the
admin account carries the claim will lock the admin out of Firestore until the
ID token refreshes (~1h). Always run:

```bash
# 1. Set the claim on the ADMIN_EMAIL account (reads creds from .env.local)
node --env-file=.env.local scripts/set-admin-claim.mjs

# 2. Sign out and back in on the admin panel so the new ID token carries the claim

# 3. Only now deploy the rules
firebase deploy --only firestore:rules,storage
```

Run step 1 once per admin account. New admins must repeat it.

### 2. Enforce App Check in Firebase Console

The public player paths are intended to be protected by App Check. Firestore
Security Rules do not expose an App Check claim as a rule variable, so the
enforcement boundary is the Firebase product configuration, not a rule helper.
To enable it safely:

1. Register the web app under Firebase Console → App Check → reCAPTCHA v3 and
   set `NEXT_PUBLIC_APP_CHECK_SITE_KEY` in each production build environment.
   Production builds now fail if it is missing.
2. Watch App Check request metrics while TVs are running; confirm real players
   are receiving valid tokens and identify any older TV clients first.
3. Turn on **enforcement** for Firestore **and** Storage in the console, then
   verify a real player can register, pair, and play assigned media.
4. Deploy the rules after the admin claim is present and keep this operational
   check in the release checklist.

Until this is done, clients without a valid App Check token can spam-create
`screens` documents (billing/DoS) and read screen/playlist/media documents by ID.
App Check proves that a request came from an attested app; it is not per-screen
authorization or rate limiting. A client with a valid token can still read a
known document ID or submit heartbeats for another screen under these rules.

### 3. Nonce-based Content Security Policy

`src/proxy.ts` now creates a fresh nonce for each request, forwards it to Next.js,
and sends a nonce-based CSP. Production scripts no longer allow
`'unsafe-inline'`; `'unsafe-eval'` is limited to development. This requires
dynamic rendering and may need a CSP allowlist update if new external services
are added. Confirm the production build environment carries the App Check key.
Inline style attributes remain enabled for dynamic player/layout transforms;
style elements still require a nonce in browsers that support the specific
style directives.

### 4. Revoke a former admin claim

The login route and session-cookie verifier both require the configured
`ADMIN_EMAIL` and the `admin: true` custom claim. To revoke an old account, set
`ADMIN_EMAIL_TO_REVOKE` to the former admin's address and run
`scripts/revoke-admin-claim.mjs`. The script protects the currently configured
admin, preserves other custom claims, and revokes refresh tokens. Existing ID
tokens can remain valid until expiry, so wait for token expiry during handover.

## Known accepted risks

- **Sign-out is device-local**: clearing a cookie does not revoke a copied
  Firebase session cookie before its natural expiry (up to 14 days). Firebase's
  refresh-token revocation affects every session for the account, so reserve it
  for account recovery or suspected compromise.
- **Storage objects are publicly readable** (`allow read: if true`) so players
  can render media via `getDownloadURL()`. Objects are referenced by
  non-guessable tokens ("anyone with the link"). Writes require the admin claim.
- **Player heartbeats are not screen-scoped**: with App Check on, any client
  with a valid token can update `status`/`lastSeen` on any screen ID. This is
  inherent to the anonymous-player design.
- **Player reads are ID-based, not ownership-based**. Any client with a valid
  App Check token that learns a screen, playlist, or media document ID can read
  that document.
- **Public player operations have no server-side rate limit**. The player writes
  directly to Firestore, so per-IP throttling would need a trusted server/API
  boundary or a Firebase-side abuse control. App Check alone does not limit
  valid-token clients.
- **Media signature validation is client-side** (`mediaService.ts`). Storage
  rules also check declared MIME type, size, admin claim, and the admin's uid
  path, but do not inspect file bytes or scan for malware. Only trusted admins
  should be allowed to upload media.
- **Offline playback does not cache media bytes**. The player can restore its
  playlist metadata, but media still needs network access unless the TV/browser
  has already cached it. Reliable offline support needs Storage CORS setup and
  byte-range-aware caching for video, then verification on the target TV models.

## Checklist before deploy

- [ ] `ADMIN_EMAIL`, `FIREBASE_ADMIN_*`, and `NEXT_PUBLIC_FIREBASE_*` set in the
      target environment.
- [ ] Self-signup disabled in Firebase Console → Authentication (only the admin
      account should exist).
- [ ] Admin claim granted (step 1) and admin re-authenticated.
- [ ] App Check enforcement is enabled for Firestore and Storage after reviewing
      real-player metrics.
- [ ] `NEXT_PUBLIC_APP_CHECK_SITE_KEY` is set in the production build environment.
- [ ] `npm audit` clean.
- [ ] `npx tsc --noEmit` and `npx eslint` clean (0 errors).
- [ ] `npm run verify` passes on the same Node 24 runtime used by deployment.
