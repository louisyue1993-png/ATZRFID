// Public Blog API - Fetch blog posts for the website
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// GET /api/blog - Get published blog posts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');

    console.log('[Public Blog API] Fetching blogs with params:', {
      limit,
      offset,
      category,
      slug
    });

    const client = getSupabaseClient();

    let query = client
      .from('blog_posts')
      .select('*')
      .eq('published', true)
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

    // Transform data format
    const transformedPosts = data.map(post => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      author: post.author,
      readTime: post.read_time,
      image: post.image,
      published: post.published,
      tags: typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags,
      seoKeywords: typeof post.seo_keywords === 'string' ? JSON.parse(post.seo_keywords) : post.seo_keywords,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
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
