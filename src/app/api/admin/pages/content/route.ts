// Page Content API
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, getSessionFromCookies } from '@/lib/admin-auth';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// GET /api/admin/pages/content - Get page content
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
    const pageKey = searchParams.get('pageKey');
    const language = searchParams.get('language') || 'en';

    if (!pageKey) {
      return NextResponse.json(
        { error: 'Page key is required' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();
    const { data, error } = await client
      .from('page_contents')
      .select('*')
      .eq('page', pageKey)
      .eq('language', language)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Page content doesn't exist, return default content
        return NextResponse.json({
          success: true,
          content: getDefaultContent(pageKey),
          isNew: true,
        });
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      content: data.content,
      meta: data.meta,
      isNew: false,
    });
  } catch (error: any) {
    console.error('Get page content error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch page content' },
      { status: 500 }
    );
  }
}

// POST /api/admin/pages/content - Save page content
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
    const { pageKey, language, content, meta } = body;

    if (!pageKey || !language || !content) {
      return NextResponse.json(
        { error: 'Page key, language, and content are required' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();

    // Check if content already exists
    const { data: existing } = await client
      .from('page_contents')
      .select('id')
      .eq('page', pageKey)
      .eq('language', language)
      .single();

    let result;

    if (existing) {
      // Update existing content
      const { data, error } = await client
        .from('page_contents')
        .update({
          content,
          meta: meta || {},
          updated_at: new Date().toISOString(),
          updated_by: 'Admin',
        })
        .eq('page', pageKey)
        .eq('language', language)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new content
      const id = Date.now().toString();
      const { data, error } = await client
        .from('page_contents')
        .insert([{
          id: parseInt(id),
          page: pageKey,
          language,
          content,
          meta: meta || {},
          updated_by: 'Admin',
        }])
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json({
      success: true,
      message: 'Page content saved successfully',
      content: result,
    });
  } catch (error: any) {
    console.error('Save page content error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save page content' },
      { status: 500 }
    );
  }
}

// Helper function to get default content
function getDefaultContent(pageKey: string) {
  const defaults: Record<string, any> = {
    home: {
      heroTitle: 'Premium RFID Cards, Tags & Wristbands',
      heroDescription: 'Premium UHF tags, HF/NFC labels, wristbands & cards. Custom RFID solutions for apparel, warehouse, healthcare & retail. Featuring Impinj, NXP, Alien chips.',
      features: [
        'ISO 9001 Certified',
        'Quality assured products meeting international standards',
      ],
      stats: [
        { label: 'Years Experience', value: '10+' },
        { label: 'Products', value: '500+' },
        { label: 'Clients', value: '1000+' },
        { label: 'Countries', value: '50+' },
      ],
    },
    products: {
      pageTitle: 'RFID Products',
      pageDescription: 'Discover our complete RFID product portfolio featuring UHF (860-960MHz) and HF/NFC (13.56MHz) solutions',
      featuredCategories: ['UHF Tags', 'HF/NFC Labels', 'Wristbands', 'Cards'],
    },
    blog: {
      pageTitle: 'RFID Insights & News',
      pageDescription: 'Stay informed about the latest RFID technology trends, applications, and industry developments',
      featuredTopics: ['RFID Technology', 'Industry News', 'Use Cases', 'Tutorials'],
    },
  };

  return defaults[pageKey] || {};
}
