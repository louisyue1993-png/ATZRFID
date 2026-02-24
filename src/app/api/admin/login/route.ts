import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, createSession } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'production' && !process.env.ADMIN_PASSWORD?.trim()) {
      return NextResponse.json(
        { error: 'ADMIN_PASSWORD is not configured' },
        { status: 500 }
      );
    }

    const { password } = await request.json();

    // Debug logging
    console.log('[Admin Login] Attempt login with password:', password ? '****' : '(empty)');
    console.log('[Admin Login] NODE_ENV:', process.env.NODE_ENV);
    console.log('[Admin Login] ADMIN_PASSWORD set:', !!process.env.ADMIN_PASSWORD);

    if (!password) {
      console.log('[Admin Login] No password provided');
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    const isValid = verifyAdminPassword(password);
    console.log('[Admin Login] Password valid:', isValid);

    if (!isValid) {
      console.log('[Admin Login] Invalid password attempt');
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    const sessionToken = createSession();
    console.log('[Admin Login] Session token created:', sessionToken.substring(0, 20) + '...');

    const response = NextResponse.json({ success: true });
    
    // Set session cookie
    // Check for HTTPS protocol via X-Forwarded-Proto header (for reverse proxy setups)
    const forwardedProto = request.headers.get('x-forwarded-proto');
    const protocol = forwardedProto || request.nextUrl.protocol.replace(':', '');
    const isSecure = protocol === 'https';
    
    console.log('[Admin Login] Protocol detection:', {
      forwardedProto,
      nextUrlProtocol: request.nextUrl.protocol,
      finalProtocol: protocol,
      isSecure
    });

    response.cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    console.log('[Admin Login] Login successful');
    return response;
  } catch (error) {
    console.error('[Admin Login] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
