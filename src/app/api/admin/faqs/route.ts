// FAQ Management API
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, getSessionFromCookies } from '@/lib/admin-auth';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// GET /api/admin/faqs - Get all FAQs with filters
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
    const category = searchParams.get('category');
    const language = searchParams.get('language') || 'en';
    const published = searchParams.get('published');

    const client = getSupabaseClient();
    let query = client.from('faqs').select('*').order('order', { ascending: true });

    // Apply filters
    if (category) {
      query = query.eq('category', category);
    }
    if (language) {
      query = query.eq('language', language);
    }
    if (published !== null && published !== undefined) {
      query = query.eq('published', published === 'true');
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      faqs: data || [],
    });
  } catch (error: any) {
    console.error('Get FAQs error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}

// POST /api/admin/faqs - Create new FAQ
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

    const faqData = {
      question: body.question,
      question_zh: body.questionZh || '',
      answer: body.answer,
      answer_zh: body.answerZh || '',
      category: body.category,
      language: body.language || 'en',
      order: body.order || 0,
      published: body.published !== undefined ? body.published : true,
    };

    const client = getSupabaseClient();
    const { data, error } = await client
      .from('faqs')
      .insert([faqData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      faq: data,
      message: 'FAQ created successfully',
    });
  } catch (error: any) {
    console.error('Create FAQ error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create FAQ' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/faqs - Update multiple FAQs
export async function PUT(request: NextRequest) {
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
    const { faqs } = body;

    if (!faqs || !Array.isArray(faqs)) {
      return NextResponse.json(
        { error: 'FAQs array is required' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();
    const results = [];

    for (const faq of faqs) {
      const { data, error } = await client
        .from('faqs')
        .update({
          ...faq,
          updated_at: new Date().toISOString(),
        })
        .eq('id', faq.id)
        .select()
        .single();

      if (error) {
        throw error;
      }
      results.push(data);
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${results.length} FAQs`,
      faqs: results,
    });
  } catch (error: any) {
    console.error('Update FAQs error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update FAQs' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/faqs - Delete multiple FAQs
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
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'FAQ IDs are required' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();
    const { error } = await client
      .from('faqs')
      .delete()
      .in('id', ids);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${ids.length} FAQ(s)`,
    });
  } catch (error: any) {
    console.error('Delete FAQs error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete FAQs' },
      { status: 500 }
    );
  }
}
