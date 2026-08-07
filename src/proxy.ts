import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "admin-session";

function buildCsp(): string {
  // NOTE: 'unsafe-inline' on script-src is required by Next.js' runtime in dev
  // and for inline boot scripts in prod. Nonce-based CSP is tracked separately.
  // We still drop 'unsafe-eval' in production.
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    process.env.NODE_ENV === "production" ? "" : "'unsafe-eval'",
    "https://apis.google.com",
    "https://www.gstatic.com",
    "https://www.googleapis.com",
    "https://www.google.com",
    "https://www.recaptcha.net",
  ]
    .filter(Boolean)
    .join(" ");

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "media-src 'self' https: blob:",
    `connect-src 'self' ${process.env.NODE_ENV === "production" ? "" : "ws: wss:"} https://*.googleapis.com https://*.firebaseio.com wss://*.googleapis.com wss://*.firebaseio.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firebaseappcheck.googleapis.com https://content-firebaseappcheck.googleapis.com https://www.google.com https://www.recaptcha.net https://www.gstatic.com`,
    "font-src 'self' data:",
    "frame-src 'self' https://*.firebaseapp.com https://apis.google.com https://accounts.google.com https://www.google.com https://www.recaptcha.net",
    "form-action 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
  ].join("; ");
}

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
  );
  response.headers.set("Content-Security-Policy", buildCsp());
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }

  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value);
  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  if (request.nextUrl.pathname.startsWith("/admin")) {
    // UX-only redirect — the cryptographic check happens in the admin layout.
    if (!isLoginPage && !hasSession) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (isLoginPage && hasSession) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|otf|css|js|map)$).*)",
  ],
};
