import { NextRequest, NextResponse } from "next/server";
import { adminApp } from "@/lib/firebase-admin.config";
import { getAuth } from "firebase-admin/auth";

export const runtime = "nodejs";

const SESSION_COOKIE_NAME = "admin-session";
const SESSION_DURATION_MS = 60 * 60 * 24 * 5 * 1000; // 5 days

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ error: "Token requerido" }, { status: 400 });
    }

    const auth = getAuth(adminApp);

    const decodedToken = await auth.verifyIdToken(idToken, true);

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      return NextResponse.json({ error: "Configuración del servidor incorrecta" }, { status: 500 });
    }

    if (decodedToken.email !== adminEmail) {
      return NextResponse.json({ error: "Acceso denegado: email no autorizado" }, { status: 403 });
    }

    // For email/password sign-in, Firebase doesn't auto-verify the email.
    // Since this is a hard-coded single-admin model, identity is already pinned
    // by the email match above — we don't require email_verified.

    // Reject very stale idTokens (>10 min since auth_time) to limit replay window
    const authTimeMs = decodedToken.auth_time * 1000;
    if (Date.now() - authTimeMs > 10 * 60 * 1000) {
      return NextResponse.json({ error: "Token expirado, vuelve a iniciar sesión" }, { status: 401 });
    }

    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION_MS,
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: SESSION_DURATION_MS / 1000,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}

export async function DELETE(request: NextRequest) {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (cookie) {
    try {
      const auth = getAuth(adminApp);
      const decoded = await auth.verifySessionCookie(cookie);
      await auth.revokeRefreshTokens(decoded.sub);
    } catch {
      // Cookie inválida o expirada — no hace falta revocar
    }
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
  return response;
}
