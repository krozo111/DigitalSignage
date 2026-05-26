import { NextRequest, NextResponse } from "next/server";
import { adminApp } from "@/lib/firebase-admin.config";
import { getAuth } from "firebase-admin/auth";

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "Token requerido" }, { status: 400 });
    }

    const auth = getAuth(adminApp);
    const decodedToken = await auth.verifyIdToken(idToken);

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      return NextResponse.json({ error: "Configuración del servidor incorrecta" }, { status: 500 });
    }

    if (decodedToken.email !== adminEmail) {
      return NextResponse.json({ error: "Acceso denegado: no eres administrador" }, { status: 403 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin-session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("admin-session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
  return response;
}
