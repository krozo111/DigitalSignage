import "server-only";

import { cookies } from "next/headers";
import { getAuth } from "firebase-admin/auth";
import { adminApp } from "../firebase-admin.config";

export const SESSION_COOKIE_NAME = "admin-session";

export interface AdminSession {
  uid: string;
  email: string;
}

/**
 * Verifies the admin session cookie cryptographically.
 * Returns the decoded session if valid AND the email matches ADMIN_EMAIL.
 * Returns null otherwise. Checks revocation on every call.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) return null;

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return null;

  try {
    const decoded = await getAuth(adminApp).verifySessionCookie(sessionCookie, true);

    if (decoded.email !== adminEmail || decoded.email_verified === false) {
      return null;
    }

    return { uid: decoded.uid, email: decoded.email };
  } catch {
    return null;
  }
}
