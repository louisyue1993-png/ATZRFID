// Single Blog Post Management API
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, getSessionFromCookies } from '@/lib/admin-auth';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// PUT /api/admin/blog/[id] - Update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication
  const isValidSession = getSessionFromCookies(request.cookies) || getSessionFromRequest(request.headers);

  if (!isValidSession) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Prepare update data
    const updateData: any = {
      title: body.title,
      content: body.content,
      excerpt: body.excerpt || '',
      category: body.category || 'RFID',
      author: body.author || 'Admin',
      image: body.featured_image || '',
      featured_image: body.featured_image || '',
      tags: Array.isArray(body.tags) ? body.tags : [],
      language: body.language || 'en',
      meta_title: body.meta_title || body.title,
      meta_description: body.meta_description || body.excerpt || '',
      read_time: body.read_time || 5,
      updated_at: new Date().toISOString(),
    };

    // Handle published status
    if (body.published !== undefined) {
      updateData.published = body.published;
      if (body.published && !body.published_at) {
        updateData.published_at = new Date().toISOString();
      }
    }

    // Handle slug change
    if (body.slug) {
      updateData.slug = body.slug;
    }

    const client = getSupabaseClient();
    const { data, error } = await client
      .from('blog_posts')
      .update(updateData)
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) {
      // Check if slug already exists
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'A post with this slug already exists' },
          { status: 409 }
        );
      }
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Blog post not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      post: data,
      message: 'Blog post updated successfully',
    });
  } catch (error: any) {
    console.error('Update blog post error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/blog/[id] - Delete blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication
  const isValidSession = getSessionFromCookies(request.cookies) || getSessionFromRequest(request.headers);

  if (!isValidSession) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;

    const client = getSupabaseClient();
    const { error } = await client
      .from('blog_posts')
      .delete()
      .eq('id', parseInt(id));

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Blog post not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete blog post error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
