// Single Product Management API
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, getSessionFromCookies } from '@/lib/admin-auth';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { normalizeCategory, normalizeSubCategory } from '@/lib/categoryMapping';

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
      updated_at: new Date().toISOString(),
    };

    const client = getSupabaseClient();
    const { data, error } = await client
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();

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
      product: data,
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
    
    const client = getSupabaseClient();
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
