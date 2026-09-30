import "server-only";

import { cookies } from "next/headers";
import { getAuth } from "firebase-admin/auth";
import { adminApp } from "../firebase-admin.config";

export const SESSION_COOKIE_NAME = "admin-session";

export interface AdminSession {
  uid: string;
  email: string;
}

const REVOKE_CHECK_INTERVAL_MS = 5 * 60 * 1000;
const lastRevokeCheck = new Map<string, number>();

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) return null;

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return null;

  try {
    const auth = getAuth(adminApp);
    const decoded = await auth.verifySessionCookie(sessionCookie, false);

    if (decoded.email?.toLowerCase() !== adminEmail.toLowerCase()) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[auth] email mismatch:", decoded.email, "vs", adminEmail);
      }
      return null;
    }

    if (decoded.admin !== true) return null;

    const now = Date.now();
    const last = lastRevokeCheck.get(decoded.sub) ?? 0;
    if (now - last > REVOKE_CHECK_INTERVAL_MS) {
      try {
        await auth.verifySessionCookie(sessionCookie, true);
        lastRevokeCheck.set(decoded.sub, now);
      } catch (revokeErr) {
        // Only genuine revocation/expiry should end the session. A transient
        // network error talking to Firebase must NOT log the admin out — the
        // base verify above already succeeded. We retry the revoke check on
        // the next interval. (The in-memory throttle map doesn't survive
        // serverless cold starts, so this call runs on most requests.)
        const code = (revokeErr as { code?: string }).code;
        if (
          code === "auth/session-cookie-revoked" ||
          code === "auth/session-cookie-expired" ||
          code === "auth/user-disabled"
        ) {
          return null;
        }
      }
    }

    return { uid: decoded.uid, email: decoded.email };
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[auth] verifySessionCookie failed:", (err as Error).message);
    }
    return null;
  }
}
