import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { products as staticProducts } from '@/data/products';

// Convert snake_case to camelCase and parse JSON fields
function formatProduct(product: any): any {
  const result: any = {};
  
  for (const key in product) {
    if (product.hasOwnProperty(key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = product[key];
    }
  }
  
  // Parse JSON fields
  try {
    if (typeof result.specifications === 'string') {
      result.specifications = JSON.parse(result.specifications);
    }
  } catch (e) {
    result.specifications = {};
  }
  
  try {
    if (typeof result.features === 'string') {
      result.features = JSON.parse(result.features);
    }
  } catch (e) {
    result.features = [];
  }
  
  try {
    if (typeof result.applications === 'string') {
      result.applications = JSON.parse(result.applications);
    }
  } catch (e) {
    result.applications = [];
  }
  
  try {
    if (typeof result.keywords === 'string') {
      result.keywords = JSON.parse(result.keywords);
    }
  } catch (e) {
    result.keywords = [];
  }
  
  try {
    if (typeof result.seoKeywords === 'string') {
      result.seoKeywords = JSON.parse(result.seoKeywords);
    }
  } catch (e) {
    result.seoKeywords = [];
  }
  
  // Format price
  if (result.price && !result.price.startsWith('$')) {
    result.price = `$${result.price}`;
  }
  
  return result;
}

// GET /api/products/[id] - Get a single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();
    
    const { data: product, error } = await client
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !product) {
      const fallbackProduct = staticProducts.find(p => p.id === id);
      if (fallbackProduct) {
        return NextResponse.json({ product: fallbackProduct });
      }

      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Format product data
    const formattedProduct = formatProduct(product);

    return NextResponse.json({ product: formattedProduct });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
