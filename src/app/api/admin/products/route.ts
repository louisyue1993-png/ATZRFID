// Product Management API
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, getSessionFromCookies } from '@/lib/admin-auth';
import { getSupabaseAdminClient } from '@/storage/database/supabase-client';
import { normalizeCategory, normalizeSubCategory } from '@/lib/categoryMapping';

function normalizePrice(value: unknown): string {
  if (typeof value === 'number') {
    return String(value);
  }
  if (typeof value !== 'string') {
    return '0';
  }

  const cleaned = value.replace(/[^\d.]/g, '');
  return cleaned || '0';
}

function parseMaybeArray(value: unknown): string[] {
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

function parseMaybeObject(value: unknown): Record<string, string> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const entries = Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, String(item)]);
    return Object.fromEntries(entries);
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const entries = Object.entries(parsed as Record<string, unknown>).map(([key, item]) => [key, String(item)]);
        return Object.fromEntries(entries);
      }
    } catch {
      return {};
    }
  }
  return {};
}

function getMissingColumnName(error: any): string | null {
  const message = typeof error?.message === 'string' ? error.message : '';
  const match = message.match(/Could not find the '([^']+)' column/i);
  return match?.[1] || null;
}

function removeColumn<T extends Record<string, any>>(data: T, column: string): T {
  const nextData = { ...data };
  delete nextData[column];
  return nextData;
}

function formatAdminProduct(product: any) {
  return {
    id: String(product.id),
    name: product.name || '',
    title: product.title || product.name || '',
    description: product.description || '',
    shortDescription: product.short_description || '',
    fullDescription: product.full_description || product.description || '',
    price: product.price ? `$${String(product.price).replace(/^\$/, '')}` : '$0',
    priceRange: product.price_range || '',
    frequency: product.frequency || '',
    chip: product.chip || '',
    memory: product.memory || '',
    readRange: product.read_range || '',
    protocol: product.protocol || '',
    category: product.category || '',
    subCategory: product.sub_category || '',
    badge: product.badge || '',
    moq: product.moq || '1',
    deliveryTime: product.delivery_time || '3-5 business days',
    specifications: parseMaybeObject(product.specifications),
    features: parseMaybeArray(product.features),
    applications: parseMaybeArray(product.applications),
    keywords: parseMaybeArray(product.keywords),
    seoKeywords: parseMaybeArray(product.seo_keywords),
    stockStatus: product.stock_status || 'InStock',
    rating: Number(product.rating) || 4.5,
    reviewCount: Number(product.review_count) || 0,
    image: product.image || '',
    created_at: product.created_at,
    updated_at: product.updated_at,
  };
}

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
    const id = searchParams.get('id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const client = getSupabaseAdminClient();
    let query = client.from('products').select('*', { count: 'exact' });

    // Apply filters
    if (id) {
      query = query.eq('id', id);
    }
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
      products: (data || []).map(formatAdminProduct),
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
      name: body.name,
      description: body.description || body.fullDescription || '',
      category: normalizedCategory || '',
      sub_category: normalizedSubCategory || '',
      price: normalizePrice(body.price),
      image: body.image || '',
      specifications: parseMaybeObject(body.specifications),
      features: parseMaybeArray(body.features),
      applications: parseMaybeArray(body.applications),
      stock_status: body.stockStatus || 'InStock',
    };

    const client = getSupabaseAdminClient();
    let data: any = null;
    let error: any = null;
    let insertData = { ...productData };

    for (let attempt = 0; attempt < 12; attempt++) {
      const result = await client
        .from('products')
        .insert([insertData])
        .select()
        .single();

      data = result.data;
      error = result.error;

      if (!error) {
        break;
      }

      const missingColumn = getMissingColumnName(error);
      if (!missingColumn || !(missingColumn in insertData)) {
        break;
      }

      insertData = removeColumn(insertData, missingColumn);
    }

    if (error) throw error;

    return NextResponse.json({
      success: true,
      product: formatAdminProduct(data),
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

    const client = getSupabaseAdminClient();
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
