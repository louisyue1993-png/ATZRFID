// Public Blog API - Fetch blog posts for the website
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/storage/database/supabase-client';

function parseJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(item => String(item));
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map(item => String(item));
      }
    } catch {
      return value
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);
    }
  }

  return [];
}

function isPostPublished(post: Record<string, any>): boolean {
  if (typeof post.published === 'boolean') {
    return post.published;
  }
  if (typeof post.isPublished === 'boolean') {
    return post.isPublished;
  }
  if (typeof post.ispublished === 'boolean') {
    return post.ispublished;
  }
  return false;
}

// GET /api/blog - Get published blog posts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = parseInt(searchParams.get('offset') || '0');
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');
    const includeContent = searchParams.get('includeContent') === 'true';

    console.log('[Public Blog API] Fetching blogs with params:', {
      limit,
      offset,
      category,
      slug
    });

    const client = getSupabaseAdminClient();

    let query = client
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    // Filter by slug if provided
    if (slug) {
      query = query.eq('slug', slug);
    }

    // Filter by category if provided
    if (category) {
      query = query.eq('category', category);
    }

    // Apply pagination
    const { data, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      console.error('[Public Blog API] Database error:', error);
      throw error;
    }

    console.log('[Public Blog API] Fetched blogs:', data?.length || 0);

    // Transform data format and handle both snake_case and camelCase schemas
    const transformedPosts = (data || [])
      .filter(post => isPostPublished(post))
      .filter(post => !category || String(post.category || '').toLowerCase() === category.toLowerCase())
      .map(post => ({
        id: String(post.id),
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt || '',
        ...(includeContent ? { content: post.content || '' } : {}),
        category: post.category || 'RFID',
        author: post.author || 'ATZ Team',
        readTime: post.read_time || post.readTime || '5 min read',
        image: post.image || post.featured_image || post.featuredImage || '/blog/default-blog.jpg',
        published: isPostPublished(post),
        tags: parseJsonArray(post.tags),
        seoKeywords: parseJsonArray(post.seo_keywords || post.seoKeywords),
        createdAt: post.created_at || post.createdAt || new Date().toISOString(),
        updatedAt: post.updated_at || post.updatedAt || post.created_at || new Date().toISOString(),
      }));

    return NextResponse.json({
      success: true,
      posts: transformedPosts,
      count: transformedPosts.length,
    });
  } catch (error: any) {
    console.error('[Public Blog API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch blog posts',
        posts: [],
        count: 0,
      },
      { status: 500 }
    );
  }
}
