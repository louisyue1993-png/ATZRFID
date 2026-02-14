// System Settings API
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, getSessionFromCookies } from '@/lib/admin-auth';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// GET /api/admin/settings - Get all system settings
export async function GET(request: NextRequest) {
  // Check authentication
  const isValidSession = getSessionFromCookies(request.cookies) || getSessionFromRequest(request.headers);

  if (!isValidSession) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    const client = getSupabaseClient();
    let query = client
      .from('system_settings')
      .select('*')
      .order('category', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const { data: settings, error } = await query;

    if (error) throw error;

    // Transform to key-value object
    const settingsObject: Record<string, any> = {};
    const settingsArray: any[] = [];

    settings.forEach(setting => {
      // Add to array with category info
      settingsArray.push({
        id: setting.id,
        key: setting.key,
        value: setting.value,
        category: setting.category,
        description: setting.description,
        is_sensitive: setting.is_sensitive,
      });

      // Add to object (skip sensitive values)
      if (!setting.is_sensitive) {
        settingsObject[setting.key] = setting.value;
      } else {
        settingsObject[setting.key] = '***';
      }
    });

    return NextResponse.json({
      success: true,
      settings: settingsArray,
      settingsObject,
    });
  } catch (error: any) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// POST /api/admin/settings - Update system settings
export async function POST(request: NextRequest) {
  // Check authentication
  const isValidSession = getSessionFromCookies(request.cookies) || getSessionFromRequest(request.headers);

  if (!isValidSession) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { updates } = body;

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { error: 'Updates object is required' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();
    const updatePromises = [];

    for (const [key, value] of Object.entries(updates)) {
      // Verify password change
      if (key === 'admin_password') {
        // Validate password strength
        const password = typeof value === 'string' ? value : '';
        if (password.length < 6) {
          return NextResponse.json(
            { error: 'Password must be at least 6 characters long' },
            { status: 400 }
          );
        }

        // Verify current password if provided
        if (body.currentPassword) {
          const { verifyAdminPassword } = await import('@/lib/admin-auth');
          if (!verifyAdminPassword(body.currentPassword)) {
            return NextResponse.json(
              { error: 'Current password is incorrect' },
              { status: 401 }
            );
          }
        }
      }

      updatePromises.push(
        client
          .from('system_settings')
          .update({
            value: typeof value === 'string' ? value : JSON.stringify(value),
            updated_at: new Date().toISOString(),
            updated_by: 'Admin',
          })
          .eq('key', key)
      );
    }

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
    });
  } catch (error: any) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update settings' },
      { status: 500 }
    );
  }
}
