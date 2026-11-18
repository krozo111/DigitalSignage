import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_MAX_AGE_MS,
  FIREBASE_SESSION_COOKIE_DURATION_MS,
  SESSION_COOKIE_NAME,
  SESSION_ID_TOKEN_MAX_AGE_MS,
} from "@/lib/auth/session-constants";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ error: "Token is required." }, { status: 400 });
    }

    const [{ adminApp }, { getAuth }] = await Promise.all([
      import("@/lib/firebase-admin.config"),
      import("firebase-admin/auth"),
    ]);
    const auth = getAuth(adminApp);

    const decodedToken = await auth.verifyIdToken(idToken, true);

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      return NextResponse.json({ error: "Server authentication is not configured." }, { status: 500 });
    }

    if (decodedToken.email?.toLowerCase() !== adminEmail.toLowerCase()) {
      return NextResponse.json({ error: "Access denied: this email is not authorized." }, { status: 403 });
    }

    // The email match pins identity, but Firestore rules authorize by the
    // `admin: true` custom claim (see firestore.rules / scripts/set-admin-claim.mjs).
    // Reject here if the claim is missing — otherwise login "succeeds" while every
    // panel read/write is silently denied by the rules.
    if (decodedToken.admin !== true) {
      return NextResponse.json(
        {
          error:
            "This account does not have admin access. Run scripts/set-admin-claim.mjs for this account.",
        },
        { status: 403 }
      );
    }

    // For email/password sign-in, Firebase doesn't auto-verify the email.
    // Since this is a hard-coded single-admin model, identity is already pinned
    // by the email match above — we don't require email_verified.

    // Require a fresh ID token to limit replay while allowing a persisted
    // Firebase login to restore this device's server cookie for up to 30 days.
    const authTimeMs = decodedToken.auth_time * 1000;
    const issuedAtMs = decodedToken.iat * 1000;
    const now = Date.now();
    if (
      !Number.isFinite(authTimeMs) ||
      now - authTimeMs >= ADMIN_SESSION_MAX_AGE_MS ||
      authTimeMs > now + 60_000 ||
      !Number.isFinite(issuedAtMs) ||
      now - issuedAtMs > SESSION_ID_TOKEN_MAX_AGE_MS ||
      issuedAtMs > now + 60_000
    ) {
      return NextResponse.json(
        { error: "Session expired. Please sign in again." },
        { status: 401 }
      );
    }

    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: FIREBASE_SESSION_COOKIE_DURATION_MS,
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // 'lax' (not 'strict') so the cookie is sent on top-level navigations
      // into /admin (bookmarks, external links, new tabs). 'strict' withheld
      // it on cross-site-initiated GETs, which surfaced as random logouts.
      sameSite: "lax",
      maxAge: FIREBASE_SESSION_COOKIE_DURATION_MS / 1000,
      path: "/",
    });

    return response;
  } catch (err) {
    const code = (err as { code?: string }).code ?? "";
    if (code.startsWith("auth/")) {
      return NextResponse.json({ error: "Invalid token." }, { status: 401 });
    }
    console.error("[auth] session creation failed:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Authentication is temporarily unavailable." }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
