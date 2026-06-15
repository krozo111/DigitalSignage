/**
 * Grants the `admin: true` custom claim to the single allowed admin account.
 *
 * This claim is what the Firestore/Storage security rules check (isAdmin()).
 * Without it, no account — even an authenticated one — can read or write app
 * data. Run this ONCE per admin account, then have the admin sign out and back
 * in so the refreshed ID token carries the claim BEFORE deploying the new rules.
 *
 * Requirements (already used by the app — see .env.local / .env.example):
 *   - ADMIN_EMAIL
 *   - FIREBASE_ADMIN_CLIENT_EMAIL
 *   - FIREBASE_ADMIN_PRIVATE_KEY
 *   - NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *
 * Usage:
 *   node --env-file=.env.local scripts/set-admin-claim.mjs
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const {
  ADMIN_EMAIL,
  FIREBASE_ADMIN_CLIENT_EMAIL,
  FIREBASE_ADMIN_PRIVATE_KEY,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID,
} = process.env;

if (!ADMIN_EMAIL) {
  console.error("✗ ADMIN_EMAIL is not set. Aborting.");
  process.exit(1);
}
if (!FIREBASE_ADMIN_CLIENT_EMAIL || !FIREBASE_ADMIN_PRIVATE_KEY) {
  console.error(
    "✗ FIREBASE_ADMIN_CLIENT_EMAIL / FIREBASE_ADMIN_PRIVATE_KEY are required to set claims. Aborting."
  );
  process.exit(1);
}

initializeApp({
  projectId: NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  credential: cert({
    projectId: NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

const auth = getAuth();

try {
  const user = await auth.getUserByEmail(ADMIN_EMAIL);

  if (user.customClaims?.admin === true) {
    console.log(`✓ ${ADMIN_EMAIL} already has the admin claim. Nothing to do.`);
  } else {
    await auth.setCustomUserClaims(user.uid, { ...user.customClaims, admin: true });
    console.log(`✓ Granted admin claim to ${ADMIN_EMAIL} (uid: ${user.uid}).`);
    console.log("  → Sign out and back in on the admin panel so the new token picks up the claim.");
  }
  process.exit(0);
} catch (err) {
  console.error(`✗ Failed to set admin claim for ${ADMIN_EMAIL}:`, err.message);
  process.exit(1);
}
