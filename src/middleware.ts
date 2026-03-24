import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
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

  // De lo contrario, permite la navegación normal (por ejemplo a /player)
  return NextResponse.next();
}

// Esto determina sobre qué rutas debe ejecutarse este middleware para optimizar el rendimiento
export const config = {
  matcher: ['/admin/:path*'],
};
