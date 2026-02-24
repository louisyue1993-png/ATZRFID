// Blog Management API
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, getSessionFromCookies } from '@/lib/admin-auth';
import { getSupabaseAdminClient } from '@/storage/database/supabase-client';
import { revalidateTag } from 'next/cache';

function parseTags(value: unknown): string[] {
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
      return value.split(',').map(item => item.trim()).filter(Boolean);
    }
  }
  return [];
}

function toReadTimeText(value: unknown): string {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? `${numeric} min read` : '5 min read';
}

function looksLikeMissingColumnError(error: any): boolean {
  const message = String(error?.message || '');
  return error?.code === '42703' || /column .* does not exist/i.test(message);
}

// GET /api/admin/blog - Get all blog posts
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
    const published = searchParams.get('published');
    const language = searchParams.get('language');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');

    const client = getSupabaseAdminClient();
    let query = client
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    // Filter by published status
    if (published === 'true' || published === 'false') {
      query = query.eq('published', published === 'true');
    }

    // Filter by language
    if (language) {
      query = query.eq('language', language);
    }

    // Filter by category
    if (category) {
      query = query.eq('category', category);
    }

    const { data: posts, error } = await query.limit(limit);

    if (error) throw error;

    // Transform database format to frontend format
    const formattedPosts = posts.map(post => ({
      id: String(post.id),
      slug: post.slug,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      category: post.category || 'RFID',
      author: post.author || 'Admin',
      featured_image: post.featured_image || post.featuredImage || post.image || '',
      tags: parseTags(post.tags),
      published: typeof post.published === 'boolean' ? post.published : Boolean(post.isPublished),
      language: post.language || 'en',
      meta_title: post.meta_title || post.metaTitle || post.title,
      meta_description: post.meta_description || post.metaDescription || post.excerpt || '',
      read_time: parseInt(String(post.read_time || '').replace(/[^\d]/g, ''), 10) || 5,
      view_count: post.view_count || 0,
      date: new Date(post.created_at || post.createdAt || Date.now()).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      published_at: post.published_at || post.publishedAt || null,
      created_at: post.created_at || post.createdAt,
      updated_at: post.updated_at || post.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      posts: formattedPosts,
      count: formattedPosts.length,
    });
  } catch (error: any) {
    console.error('Get blog posts error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// POST /api/admin/blog - Create new blog post
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

    // Validate required fields
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      );
    }

    const readTime = toReadTimeText(body.read_time);
    const tags = Array.isArray(body.tags) ? body.tags : [];

    const client = getSupabaseAdminClient();
    let { data, error } = await client
      .from('blog_posts')
      .insert([{
        slug: body.slug,
        title: body.title,
        content: body.content,
        excerpt: body.excerpt || '',
        category: body.category || 'RFID',
        author: body.author || 'Admin',
        image: body.featured_image || '',
        tags,
        published: body.published || false,
        language: body.language || 'en',
        read_time: readTime,
        seo_keywords: tags,
      }])
      .select()
      .single();

    if (error && looksLikeMissingColumnError(error)) {
      ({ data, error } = await client
        .from('blog_posts')
        .insert([{
          slug: body.slug,
          title: body.title,
          content: body.content,
          excerpt: body.excerpt || '',
          category: body.category || 'RFID',
          author: body.author || 'Admin',
          featuredImage: body.featured_image || '',
          tags,
          isPublished: body.published || false,
          readTime,
          seoKeywords: tags,
        }])
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
      throw error;
    }

    revalidateTag('blog-posts', 'max');

    return NextResponse.json({
      success: true,
      post: data,
      message: 'Blog post created successfully',
    });
  } catch (error: any) {
    console.error('Create blog post error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
