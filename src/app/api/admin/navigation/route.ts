// Navigation Menu Management API
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, getSessionFromCookies } from '@/lib/admin-auth';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// GET /api/admin/navigation - Get all navigation menus
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
    const language = searchParams.get('language') || 'en';

    const client = getSupabaseClient();
    const { data, error } = await client
      .from('navigation_menus')
      .select('*')
      .eq('language', language)
      .order('order', { ascending: true });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      menus: data || [],
    });
  } catch (error: any) {
    console.error('Get navigation menus error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch navigation menus' },
      { status: 500 }
    );
  }
}

// POST /api/admin/navigation - Create new navigation menu
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

    const menuData = {
      title: body.title,
      title_zh: body.titleZh || '',
      slug: body.slug,
      url: body.url,
      parent_id: body.parentId || null,
      order: body.order || 0,
      language: 'en',
      published: body.published !== undefined ? body.published : true,
      icon: body.icon || '',
      open_in_new_tab: body.openInNewTab || false,
    };

    const client = getSupabaseClient();
    const { data, error } = await client
      .from('navigation_menus')
      .insert([menuData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      menu: data,
      message: 'Navigation menu created successfully',
    });
  } catch (error: any) {
    console.error('Create navigation menu error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create navigation menu' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/navigation - Update multiple navigation menus
export async function PUT(request: NextRequest) {
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
    const { menus } = body;

    if (!menus || !Array.isArray(menus)) {
      return NextResponse.json(
        { error: 'Menus array is required' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();
    const results = [];

    for (const menu of menus) {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (menu.published !== undefined) updateData.published = menu.published;
      if (menu.order !== undefined) updateData.order = menu.order;

      const { data, error } = await client
        .from('navigation_menus')
        .update(updateData)
        .eq('id', menu.id)
        .select()
        .single();

      if (error) {
        throw error;
      }
      results.push(data);
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${results.length} menu items`,
      menus: results,
    });
  } catch (error: any) {
    console.error('Update navigation menus error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update navigation menus' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/navigation - Delete multiple navigation menus
export async function DELETE(request: NextRequest) {
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
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Menu IDs are required' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();
    const { error } = await client
      .from('navigation_menus')
      .delete()
      .in('id', ids);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${ids.length} menu item(s)`,
    });
  } catch (error: any) {
    console.error('Delete navigation menus error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete navigation menus' },
      { status: 500 }
    );
  }
}
