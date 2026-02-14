import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, getSessionFromCookies } from '@/lib/admin-auth';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// GET /api/admin/seo/analyze - Analyze SEO
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
    const type = searchParams.get('type') || 'products'; // products, blog
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();
    let item: any;

    if (type === 'products') {
      const { data, error } = await client
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      item = data;
    } else if (type === 'blog') {
      const { data, error } = await client
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      item = data;
    }

    // Analyze SEO
    const analysis = {
      title: {
        status: 'ok',
        length: item.title?.length || 0,
        optimal: { min: 30, max: 60 },
        message: item.title?.length >= 30 && item.title?.length <= 60 
          ? 'Title length is optimal'
          : item.title?.length < 30 
            ? 'Title is too short' 
            : 'Title is too long',
      },
      description: {
        status: 'ok',
        length: item.shortDescription?.length || item.excerpt?.length || 0,
        optimal: { min: 120, max: 160 },
        message: (item.shortDescription?.length || item.excerpt?.length) >= 120 && 
                 (item.shortDescription?.length || item.excerpt?.length) <= 160
          ? 'Description length is optimal'
          : (item.shortDescription?.length || item.excerpt?.length) < 120
            ? 'Description is too short'
            : 'Description is too long',
      },
      keywords: {
        status: 'ok',
        count: (item.seoKeywords?.length || 0),
        optimal: { min: 3, max: 10 },
        keywords: item.seoKeywords || [],
        message: (item.seoKeywords?.length || 0) >= 3 && (item.seoKeywords?.length || 0) <= 10
          ? 'Keywords count is optimal'
          : (item.seoKeywords?.length || 0) < 3
            ? 'Too few keywords'
            : 'Too many keywords',
      },
      image: {
        status: item.image ? 'ok' : 'warning',
        hasImage: !!item.image,
        message: item.image ? 'Image is set' : 'Missing featured image',
      },
      overallScore: 0,
    };

    // Calculate overall score
    let score = 0;
    let maxScore = 0;

    Object.keys(analysis).forEach(key => {
      if (key === 'overallScore') return;
      const section = analysis[key as keyof typeof analysis] as any;
      maxScore += 25; // Each section is worth 25 points
      
      if (section.status === 'ok') {
        score += 25;
      } else if (section.status === 'warning') {
        score += 15;
      }
    });

    analysis.overallScore = Math.round((score / maxScore) * 100);

    return NextResponse.json({
      success: true,
      analysis,
      item: {
        id: item.id,
        title: item.title || item.name,
        description: item.shortDescription || item.excerpt,
        keywords: item.seoKeywords || [],
        image: item.image,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'SEO analysis failed' },
      { status: 500 }
    );
  }
}
