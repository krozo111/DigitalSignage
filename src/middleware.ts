import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; media-src 'self' https: blob:; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.googleapis.com wss://*.firebaseio.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com; font-src 'self' data:; frame-src 'self'; form-action 'self'; base-uri 'self'"
  );

  const adminSession = request.cookies.get('admin-session')?.value;
  const isLoginPage = request.nextUrl.pathname === '/admin/login';

  // Si estamos en cualquier ruta bajo /admin/...
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Si NO hay sesión y NO estás en la página de login, redirige a login
    if (!isLoginPage && !adminSession) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Si HAY sesión y estás visitando intencionadamente /admin/login, redirige al dashboard /admin
    if (isLoginPage && adminSession) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return response;
}

// Esto determina sobre qué rutas debe ejecutarse este middleware para optimizar el rendimiento
export const config = {
  matcher: ['/:path*'],
};
