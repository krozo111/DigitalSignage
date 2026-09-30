import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const SESSION_COOKIE_NAME = "admin-session";
const SESSION_DURATION_MS = 60 * 60 * 8 * 1000; // 8 hours

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

    // Reject very stale idTokens (>10 min since auth_time) to limit replay window
    const authTimeMs = decodedToken.auth_time * 1000;
    if (Date.now() - authTimeMs > 10 * 60 * 1000) {
      return NextResponse.json({ error: "Session expired. Sign in again." }, { status: 401 });
    }

    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION_MS,
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // 'lax' (not 'strict') so the cookie is sent on top-level navigations
      // into /admin (bookmarks, external links, new tabs). 'strict' withheld
      // it on cross-site-initiated GETs, which surfaced as random logouts.
      sameSite: "lax",
      maxAge: SESSION_DURATION_MS / 1000,
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

export async function DELETE(request: NextRequest) {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (cookie) {
    try {
      const [{ adminApp }, { getAuth }] = await Promise.all([
        import("@/lib/firebase-admin.config"),
        import("firebase-admin/auth"),
      ]);
      const auth = getAuth(adminApp);
      const decoded = await auth.verifySessionCookie(cookie);
      await auth.revokeRefreshTokens(decoded.sub);
    } catch {
      // Invalid or expired cookie; there is no valid session to revoke.
    }
  }

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
