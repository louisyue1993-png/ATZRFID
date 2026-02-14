// Product Management API
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, getSessionFromCookies } from '@/lib/admin-auth';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { normalizeCategory, normalizeSubCategory } from '@/lib/categoryMapping';

// GET /api/admin/products - Get all products with filters
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const client = getSupabaseClient();
    let query = client.from('products').select('*', { count: 'exact' });

    // Apply filters
    if (category) {
      query = query.eq('category', category);
    }
    if (status) {
      query = query.eq('stock_status', status);
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      products: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error: any) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/admin/products - Create new product
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
    
    // Normalize category and subcategory
    const normalizedCategory = normalizeCategory(body.category);
    const normalizedSubCategory = normalizeSubCategory(body.subCategory);
    
    // Prepare product data
    const productData = {
      id: body.id,
      name: body.name,
      title: body.title || body.name,
      description: body.description || body.fullDescription || '',
      short_description: body.shortDescription || '',
      full_description: body.fullDescription || body.description || '',
      price: body.price || '0',
      price_range: body.priceRange || '',
      frequency: body.frequency || '',
      chip: body.chip || '',
      memory: body.memory || '',
      read_range: body.readRange || '',
      protocol: body.protocol || '',
      category: normalizedCategory || '',
      sub_category: normalizedSubCategory || '',
      badge: body.badge || '',
      moq: body.moq || '1',
      delivery_time: body.deliveryTime || '3-5 business days',
      specifications: JSON.stringify(body.specifications || {}),
      features: JSON.stringify(body.features || []),
      applications: JSON.stringify(body.applications || []),
      keywords: JSON.stringify(body.keywords || []),
      seo_keywords: JSON.stringify(body.seoKeywords || []),
      stock_status: body.stockStatus || 'InStock',
      rating: body.rating || 4.5,
      review_count: body.reviewCount || 0,
      image: body.image || '',
    };

    const client = getSupabaseClient();
    const { data, error } = await client
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      product: data,
      message: 'Product created successfully',
    });
  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products - Batch delete products
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
        { error: 'Product IDs are required' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();
    const { error } = await client
      .from('products')
      .delete()
      .in('id', ids);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${ids.length} product(s)`,
    });
  } catch (error: any) {
    console.error('Batch delete error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete products' },
      { status: 500 }
    );
  }
}
