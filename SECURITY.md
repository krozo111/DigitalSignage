# Security

This document records the security model and the operational steps required to
keep it sound. Read it before changing auth, Firestore/Storage rules, or the
deployment flow.

## Authorization model

- **Admin** authenticates with email/password (Firebase Auth) and gets an
  `admin-session` HTTP-only cookie via `POST /api/auth/session`. The server
  pins the account to `ADMIN_EMAIL` before issuing the cookie.
- **Data access is authorized by the security rules, not by the Next.js
  server.** The browser Firestore/Storage SDKs (and the raw REST API) talk
  directly to Firebase, so the rules are the real gate. `isAdmin()` requires the
  `admin: true` custom claim — being merely authenticated is **not** enough.
- **`POST /api/auth/session` also requires the `admin: true` claim** before
  issuing the cookie. This makes a missing claim fail loudly at login (clear
  error) instead of silently — a logged-in admin whose every read/write is
  denied by the rules. If login is rejected for the right account, run step 1.
- **Players** are anonymous. They self-register a `screens/{id}` doc, read their
  own doc, their playlist, and the referenced media. These public paths are
  meant to be gated by **App Check** (see pending item below).

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
   confirm `NEXT_PUBLIC_APP_CHECK_SITE_KEY` is set in all environments.
2. Turn on **enforcement** for Firestore **and** Storage in the console.
3. Verify a real player obtains an App Check token and still works.
4. Deploy the rules after the admin claim is present and keep this operational
   check in the release checklist.

Until this is done, anonymous clients can spam-create `screens` documents
(billing/DoS) and read any screen/playlist/media doc by ID.

### 3. CSP: remove `script-src 'unsafe-inline'`

`src/proxy.ts` ships `'unsafe-inline'` on `script-src`, which weakens XSS
mitigation. Moving to a nonce-based CSP is the fix, but it risks breaking
Next.js hydration and must be done and tested deliberately — not as a one-liner.

## Known accepted risks

- **Storage objects are publicly readable** (`allow read: if true`) so players
  can render media via `getDownloadURL()`. Objects are referenced by
  non-guessable tokens ("anyone with the link"). Writes require the admin claim.
- **Player heartbeats are not screen-scoped**: with App Check on, any client
  with a valid token can update `status`/`lastSeen` on any screen ID. This is
  inherent to the anonymous-player design.
- **File-type magic-byte validation is client-side** (`mediaService.ts`); the
  Storage rule's `contentType` check is the server-side backstop, and writes are
  restricted to the admin's own uid path.

## Checklist before deploy

- [ ] `ADMIN_EMAIL`, `FIREBASE_ADMIN_*`, and `NEXT_PUBLIC_FIREBASE_*` set in the
      target environment.
- [ ] Self-signup disabled in Firebase Console → Authentication (only the admin
      account should exist).
- [ ] Admin claim granted (step 1) and admin re-authenticated.
- [ ] `npm audit` clean.
- [ ] `npx tsc --noEmit` and `npx eslint` clean (0 errors).
- [ ] `npm run verify` passes on the same Node 24 runtime used by deployment.
