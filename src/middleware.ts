import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromNextRequest } from '@/lib/admin-auth';
import {
  defaultLocale,
  getLocaleFromPathname,
  isSupportedLocale,
  stripLocaleFromPathname,
  type Locale,
} from '@/lib/i18n';

function detectLocale(request: NextRequest): Locale {
  const localeInPath = getLocaleFromPathname(request.nextUrl.pathname);
  if (localeInPath) {
    return localeInPath;
  }

  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && isSupportedLocale(cookieLocale)) {
    return cookieLocale;
  }

  const acceptedLanguage = request.headers.get('accept-language');
  if (acceptedLanguage) {
    const languages = acceptedLanguage.split(',').map(item => item.split(';')[0].trim().toLowerCase());
    for (const language of languages) {
      const short = language.slice(0, 2);
      if (isSupportedLocale(short)) {
        return short;
      }
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const localeInPath = getLocaleFromPathname(pathname);
  const normalizedPath = localeInPath ? stripLocaleFromPathname(pathname) : pathname;
  const locale = detectLocale(request);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-locale', locale);

  // Check if the request is for admin routes
  if (normalizedPath.startsWith('/admin') && normalizedPath !== '/admin/login') {
    const isAuthenticated = getSessionFromNextRequest(request);

    if (!isAuthenticated) {
      console.log('[Middleware] User not authenticated, redirecting to login');
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', normalizedPath);
      return NextResponse.redirect(loginUrl);
    }

    console.log('[Middleware] User authenticated, allowing access to:', normalizedPath);
  }

  if (localeInPath) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = normalizedPath;
    const response = NextResponse.rewrite(rewriteUrl, {
      request: { headers: requestHeaders },
    });
    response.cookies.set('NEXT_LOCALE', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
    return response;
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|manifest.json|sitemap.xml|.*\\..*).*)'],
};
