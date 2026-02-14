// Blog Management API
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, getSessionFromCookies } from '@/lib/admin-auth';
import { getSupabaseClient } from '@/storage/database/supabase-client';

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

    const client = getSupabaseClient();
    let query = client
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    // Filter by published status
    if (published !== null) {
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
      id: post.id.toString(),
      slug: post.slug,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      category: post.category || 'RFID',
      author: post.author || 'Admin',
      featured_image: post.featured_image || post.image || '',
      tags: Array.isArray(post.tags) ? post.tags : [],
      published: post.published || false,
      language: post.language || 'en',
      meta_title: post.meta_title || post.title,
      meta_description: post.meta_description || post.excerpt || '',
      read_time: parseInt(post.read_time) || 5,
      view_count: post.view_count || 0,
      date: new Date(post.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      published_at: post.published_at,
      created_at: post.created_at,
      updated_at: post.updated_at,
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

    // Generate ID
    const id = Date.now().toString() + '-' + Math.random().toString(36).substring(2, 9);

    const client = getSupabaseClient();
    const { data, error } = await client
      .from('blog_posts')
      .insert([{
        id: parseInt(id),
        slug: body.slug,
        title: body.title,
        content: body.content,
        excerpt: body.excerpt || '',
        category: body.category || 'RFID',
        author: body.author || 'Admin',
        image: body.featured_image || '',
        featured_image: body.featured_image || '',
        tags: Array.isArray(body.tags) ? body.tags : [],
        published: body.published || false,
        language: body.language || 'en',
        meta_title: body.meta_title || body.title,
        meta_description: body.meta_description || body.excerpt || '',
        read_time: body.read_time || 5,
        published_at: body.published ? new Date().toISOString() : null,
      }])
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
      throw error;
    }

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
