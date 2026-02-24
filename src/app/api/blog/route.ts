// Public Blog API - Fetch blog posts for the website
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/storage/database/supabase-client';
import { blogPosts as staticBlogPosts } from '@/lib/blog-data';

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

function normalizeText(value: unknown): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function slugify(value: unknown): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function blogDedupeKeys(post: Record<string, any>): string[] {
  const keys: string[] = [];
  const explicitSlug = slugify(post.slug);
  const titleSlug = slugify(post.title);
  const titleKey = normalizeText(post.title);

  if (explicitSlug) keys.push(`slug:${explicitSlug}`);
  if (titleSlug) keys.push(`slug:${titleSlug}`);
  if (titleKey) keys.push(`title:${titleKey}`);

  return keys;
}

// GET /api/blog - Get published blog posts
export async function GET(request: NextRequest) {
  const isDebugEnabled = process.env.NODE_ENV !== 'production';
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

    // Fetch a larger window and apply pagination after merge with static data
    const { data, error } = await query.range(0, 499);

    if (error) {
      console.error('[Public Blog API] Database error:', error);
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

    const fallbackPosts = staticBlogPosts
      .filter(post => post.published)
      .filter(post => !slug || post.slug === slug)
      .filter(post => !category || String(post.category || '').toLowerCase() === category.toLowerCase())
      .map(post => ({
        id: String(post.id),
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt || '',
        ...(includeContent ? { content: post.content || '' } : {}),
        category: post.category || 'RFID',
        author: post.author || 'ATZ Team',
        readTime: post.readTime || '5 min read',
        image: post.image || '/blog/default-blog.jpg',
        published: post.published,
        tags: Array.isArray(post.tags) ? post.tags : [],
        seoKeywords: Array.isArray(post.seoKeywords) ? post.seoKeywords : [],
        createdAt: new Date(post.date).toISOString(),
        updatedAt: new Date(post.date).toISOString(),
      }));

    const seenSlugs = new Set<string>();
    for (const post of transformedPosts) {
      for (const key of blogDedupeKeys(post)) {
        seenSlugs.add(key);
      }
    }
    const mergedPosts = [...transformedPosts];
    let dedupeHits = 0;

    for (const post of fallbackPosts) {
      const keys = blogDedupeKeys(post);
      const isDuplicate = keys.some(key => seenSlugs.has(key));

      if (!isDuplicate) {
        mergedPosts.push(post);
        for (const key of keys) {
          seenSlugs.add(key);
        }
      } else {
        dedupeHits += 1;
      }
    }

    const pagedPosts = mergedPosts.slice(offset, offset + limit);

    const responseBody: Record<string, any> = {
      success: true,
      posts: pagedPosts,
      count: pagedPosts.length,
    };

    if (isDebugEnabled) {
      responseBody.debug = {
        dedupe: {
          enabled: true,
          dbRows: transformedPosts.length,
          staticRows: fallbackPosts.length,
          dedupeHits,
          mergedRows: mergedPosts.length,
          returnedRows: pagedPosts.length,
        },
      };
    }

    return NextResponse.json(responseBody);
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
