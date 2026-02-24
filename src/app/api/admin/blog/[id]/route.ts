// Single Blog Post Management API
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, getSessionFromCookies } from '@/lib/admin-auth';
import { getSupabaseAdminClient } from '@/storage/database/supabase-client';
import { revalidateTag } from 'next/cache';

function toReadTimeText(value: unknown): string {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? `${numeric} min read` : '5 min read';
}

function looksLikeMissingColumnError(error: any): boolean {
  const message = String(error?.message || '');
  return error?.code === '42703' || /column .* does not exist/i.test(message);
}

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
    const readTime = toReadTimeText(body.read_time);
    const tags = Array.isArray(body.tags) ? body.tags : [];

    // Prepare update data
    const updateData: any = {
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt || '',
      category: body.category || 'RFID',
      author: body.author || 'Admin',
      image: body.featured_image || '',
      tags,
      language: body.language || 'en',
      read_time: readTime,
      seo_keywords: tags,
      updated_at: new Date().toISOString(),
    };

    // Handle published status
    if (body.published !== undefined) {
      updateData.published = body.published;
    }

    const client = getSupabaseAdminClient();
    let { data, error } = await client
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error && looksLikeMissingColumnError(error)) {
      const legacyUpdateData: any = {
        title: body.title,
        slug: body.slug,
        content: body.content,
        excerpt: body.excerpt || '',
        category: body.category || 'RFID',
        author: body.author || 'Admin',
        featuredImage: body.featured_image || '',
        tags,
        readTime,
        seoKeywords: tags,
        updated_at: new Date().toISOString(),
      };

      if (body.published !== undefined) {
        legacyUpdateData.isPublished = body.published;
      }

      ({ data, error } = await client
        .from('blog_posts')
        .update(legacyUpdateData)
        .eq('id', id)
        .select()
        .single());
    }

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

    revalidateTag('blog-posts', 'max');

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

    const client = getSupabaseAdminClient();
    const { error } = await client
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Blog post not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    revalidateTag('blog-posts', 'max');

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
