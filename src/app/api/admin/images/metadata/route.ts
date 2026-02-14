// Image Metadata API
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, getSessionFromCookies } from '@/lib/admin-auth';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// GET /api/admin/images/metadata - Get image metadata
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
    const filename = searchParams.get('filename');
    const category = searchParams.get('category');
    const language = searchParams.get('language');
    const limit = parseInt(searchParams.get('limit') || '50');

    const client = getSupabaseClient();
    let query = client
      .from('image_metadata')
      .select('*')
      .order('created_at', { ascending: false });

    if (filename) {
      query = query.eq('filename', filename);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (language) {
      query = query.eq('language', language);
    }

    const { data: metadata, error } = await query.limit(limit);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      metadata: metadata || [],
      count: metadata?.length || 0,
    });
  } catch (error: any) {
    console.error('Get image metadata error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch image metadata' },
      { status: 500 }
    );
  }
}

// POST /api/admin/images/metadata - Create or update image metadata
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

    if (!body.filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();

    // Check if metadata already exists
    const { data: existing } = await client
      .from('image_metadata')
      .select('*')
      .eq('filename', body.filename)
      .single();

    let result;

    if (existing) {
      // Update existing metadata
      const updateData: any = {
        category: body.category || existing.category,
        tags: body.tags || existing.tags,
        alt_text: body.alt_text || existing.alt_text,
        description: body.description || existing.description,
        language: body.language || existing.language,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await client
        .from('image_metadata')
        .update(updateData)
        .eq('filename', body.filename)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new metadata
      const id = Date.now().toString() + '-' + Math.random().toString(36).substring(2, 9);

      const { data, error } = await client
        .from('image_metadata')
        .insert([{
          id,
          filename: body.filename,
          url: body.url || `/${body.folder || 'uploads'}/${body.filename}`,
          original_filename: body.original_filename || body.filename,
          size: body.size || 0,
          width: body.width || 0,
          height: body.height || 0,
          mime_type: body.mime_type || 'image/jpeg',
          category: body.category || 'general',
          tags: body.tags || [],
          alt_text: body.alt_text || '',
          description: body.description || '',
          language: body.language || 'en',
          usage_count: 0,
          folder: body.folder || 'uploads',
        }])
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json({
      success: true,
      metadata: result,
      message: existing ? 'Image metadata updated' : 'Image metadata created',
    });
  } catch (error: any) {
    console.error('Save image metadata error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save image metadata' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/images/metadata - Delete image metadata
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
    const searchParams = request.nextUrl.searchParams;
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();
    const { error } = await client
      .from('image_metadata')
      .delete()
      .eq('filename', filename);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Image metadata deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete image metadata error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete image metadata' },
      { status: 500 }
    );
  }
}
