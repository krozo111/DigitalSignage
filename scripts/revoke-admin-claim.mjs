/**
 * Remove the admin claim from a former admin without changing their other claims.
 * This also revokes their refresh tokens. Existing ID tokens can remain usable
 * until they expire, so retire old admin access during a controlled handover.
 *
 * Required environment:
 *   - ADMIN_EMAIL (current allowed admin; this account is protected)
 *   - ADMIN_EMAIL_TO_REVOKE (the former admin)
 *   - FIREBASE_ADMIN_CLIENT_EMAIL
 *   - FIREBASE_ADMIN_PRIVATE_KEY
 *   - NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *
 * Usage:
 *   ADMIN_EMAIL_TO_REVOKE=former@example.com node --env-file=.env.local scripts/revoke-admin-claim.mjs
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const {
  ADMIN_EMAIL,
  ADMIN_EMAIL_TO_REVOKE,
  FIREBASE_ADMIN_CLIENT_EMAIL,
  FIREBASE_ADMIN_PRIVATE_KEY,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID,
} = process.env;

if (!ADMIN_EMAIL || !ADMIN_EMAIL_TO_REVOKE) {
  console.error("ADMIN_EMAIL and ADMIN_EMAIL_TO_REVOKE are required. Aborting.");
  process.exit(1);
}
if (ADMIN_EMAIL_TO_REVOKE.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
  console.error("Refusing to revoke the currently configured ADMIN_EMAIL. Aborting.");
  process.exit(1);
}
if (!FIREBASE_ADMIN_CLIENT_EMAIL || !FIREBASE_ADMIN_PRIVATE_KEY || !NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  console.error("Firebase Admin credentials and NEXT_PUBLIC_FIREBASE_PROJECT_ID are required. Aborting.");
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
  const user = await auth.getUserByEmail(ADMIN_EMAIL_TO_REVOKE);
  const remainingClaims = { ...user.customClaims };
  delete remainingClaims.admin;

  if (user.customClaims?.admin !== true) {
    console.log(`${ADMIN_EMAIL_TO_REVOKE} does not have the admin claim. Nothing to do.`);
  } else {
    await auth.setCustomUserClaims(user.uid, Object.keys(remainingClaims).length ? remainingClaims : null);
    await auth.revokeRefreshTokens(user.uid);
    console.log(`Removed the admin claim and revoked refresh tokens for ${ADMIN_EMAIL_TO_REVOKE}.`);
    console.log("Existing ID tokens may remain usable until they expire (usually within one hour).");
  }
  process.exit(0);
} catch (err) {
  console.error(`Failed to revoke the admin claim for ${ADMIN_EMAIL_TO_REVOKE}:`, err.message);
  process.exit(1);
}
