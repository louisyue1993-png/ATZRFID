// Single Product Management API
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

// PUT /api/admin/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication
  const isValidSession = getSessionFromCookies(request.cookies) || getSessionFromRequest(request.headers);
  
  if (!isValidSession) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
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
      updated_at: new Date().toISOString(),
    };

    const client = getSupabaseAdminClient();
    let data: any = null;
    let error: any = null;
    let updateData = { ...productData };

    for (let attempt = 0; attempt < 12; attempt++) {
      const result = await client
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      data = result.data;
      error = result.error;

      if (!error) {
        break;
      }

      const missingColumn = getMissingColumnName(error);
      if (!missingColumn || !(missingColumn in updateData)) {
        break;
      }

      updateData = removeColumn(updateData, missingColumn);
    }

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      product: formatAdminProduct(data),
      message: 'Product updated successfully',
    });
  } catch (error: any) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id] - Delete single product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication
  const isValidSession = getSessionFromCookies(request.cookies) || getSessionFromRequest(request.headers);
  
  if (!isValidSession) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    
    const client = getSupabaseAdminClient();
    const { error } = await client
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}
