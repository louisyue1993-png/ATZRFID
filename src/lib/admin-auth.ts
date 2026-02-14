// Admin Authentication Utilities
import { NextRequest } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const SESSION_COOKIE_NAME = 'admin_session';

console.log('[Admin Auth] Initialized with ADMIN_PASSWORD set:', !!process.env.ADMIN_PASSWORD);
console.log('[Admin Auth] Using password length:', ADMIN_PASSWORD.length);

export interface AdminSession {
  isAuthenticated: boolean;
  loginTime: number;
}

export function verifyAdminPassword(password: string): boolean {
  const isValid = password === ADMIN_PASSWORD;
  console.log('[Admin Auth] verifyAdminPassword called, result:', isValid);
  return isValid;
}

export function createSession(): string {
  const sessionData: AdminSession = {
    isAuthenticated: true,
    loginTime: Date.now(),
  };
  
  // Create a simple session token (in production, use proper JWT)
  const token = Buffer.from(JSON.stringify(sessionData)).toString('base64');
  console.log('[Admin Auth] Session created');
  return token;
}

export function verifySession(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const session: AdminSession = JSON.parse(decoded);
    
    // Check if session is valid and not expired (24 hours)
    const isValid = session.isAuthenticated && 
                   (Date.now() - session.loginTime) < 24 * 60 * 60 * 1000;
    
    console.log('[Admin Auth] Session verified, valid:', isValid);
    return isValid;
  } catch (error) {
    console.error('[Admin Auth] Session verification error:', error);
    return false;
  }
}

/**
 * Get session from Headers object (for API routes)
 */
export function getSessionFromRequest(headers: Headers): boolean {
  // Try to get from headers
  const cookie = headers.get('cookie');
  if (!cookie) {
    console.log('[Admin Auth] No cookie found in headers');
    return false;
  }
  
  const match = cookie.match(new RegExp(`${SESSION_COOKIE_NAME}=([^;]+)`));
  if (!match) {
    console.log('[Admin Auth] No admin_session cookie found');
    return false;
  }
  
  return verifySession(match[1]);
}

/**
 * Get session from NextRequest object (for middleware)
 * This is the recommended method for Next.js middleware
 */
export function getSessionFromNextRequest(request: NextRequest): boolean {
  // Try to get from cookies (recommended for Next.js middleware)
  const token = request.cookies.get('admin_session')?.value;
  
  if (token) {
    console.log('[Admin Auth] Session token found in request.cookies');
    return verifySession(token);
  }
  
  // Fallback: try to get from headers
  const cookie = request.headers.get('cookie');
  if (!cookie) {
    console.log('[Admin Auth] No cookie found in headers');
    return false;
  }
  
  const match = cookie.match(new RegExp(`${SESSION_COOKIE_NAME}=([^;]+)`));
  if (!match) {
    console.log('[Admin Auth] No admin_session cookie found in headers');
    return false;
  }
  
  console.log('[Admin Auth] Session token found in headers');
  return verifySession(match[1]);
}

export function getSessionFromCookies(cookies: any): boolean {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    console.log('[Admin Auth] No admin_session cookie found in cookies object');
    return false;
  }
  
  return verifySession(token);
}
