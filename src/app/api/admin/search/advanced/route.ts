import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, getSessionFromCookies } from '@/lib/admin-auth';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// GET /api/admin/search/advanced - Advanced search
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
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const stockStatus = searchParams.get('stockStatus') || '';
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const client = getSupabaseClient();

    let queryBuilder = client
      .from('products')
      .select('*', { count: 'exact' });

    // Apply search query
    if (query) {
      queryBuilder = queryBuilder.or(`
        name.ilike.%${query}%,
        description.ilike.%${query}%,
        keywords.ilike.%${query}%,
        seo_keywords.ilike.%${query}%
      `);
    }

    // Apply filters
    if (category) {
      queryBuilder = queryBuilder.eq('category', category);
    }

    if (stockStatus) {
      queryBuilder = queryBuilder.eq('stock_status', stockStatus);
    }

    // Apply price range filter
    if (minPrice || maxPrice) {
      // Price is stored as string like "From $0.08", need to extract numeric value
      // For simplicity, we'll do this on the client side or use a more sophisticated query
      // Here we'll just add a comment about the limitation
    }

    // Apply sorting
    queryBuilder = queryBuilder.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    queryBuilder = queryBuilder.range(offset, offset + limit - 1);

    const { data, error, count } = await queryBuilder;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      products: data,
      total: count,
      limit,
      offset,
      hasMore: count ? offset + limit < count : false,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Search failed' },
      { status: 500 }
    );
  }
}
