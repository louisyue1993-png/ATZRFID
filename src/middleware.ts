import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromNextRequest } from '@/lib/admin-auth';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if the request is for admin routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const isAuthenticated = getSessionFromNextRequest(request);
    
    if (!isAuthenticated) {
      console.log('[Middleware] User not authenticated, redirecting to login');
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    console.log('[Middleware] User authenticated, allowing access to:', pathname);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
