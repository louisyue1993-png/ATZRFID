import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { normalizeCategory, normalizeSubCategory, subCategoryMapping } from '@/lib/categoryMapping';

function formatPrice(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return 'Contact for pricing';
  }

  const text = String(value).trim();
  if (!text) {
    return 'Contact for pricing';
  }

  return text.startsWith('$') ? text : `$${text}`;
}

// GET /api/products - Get all products with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');  // Support single product lookup by ID
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    console.log('[API Products] Received filters:', {
      id,
      category,
      subcategory,
      limit,
      offset
    });

    // Normalize category and subcategory to slug format
    const normalizedCategory = normalizeCategory(category);
    const normalizedSubCategory = normalizeSubCategory(subcategory);

    console.log('[API Products] Normalized filters:', {
      normalizedCategory,
      normalizedSubCategory
    });

    // Debug: Check if subcategory exists in mapping
    if (subcategory) {
      console.log('[API Products] Debug - subcategory mapping check:', {
        input: subcategory,
        trimmed: subcategory.trim(),
        mappingExists: subcategory.trim() in subCategoryMapping,
        mappingValue: subCategoryMapping[subcategory.trim()]
      });
    }

    const client = getSupabaseClient();

    let query = client
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    // If ID is provided, filter by ID
    if (id) {
      query = query.eq('id', id);
    }

    if (normalizedCategory) {
      query = query.eq('category', normalizedCategory);
    }

    if (normalizedSubCategory) {
      query = query.eq('sub_category', normalizedSubCategory);
    }

    const { data: products, error } = await query.range(offset, offset + limit - 1);

    if (error) throw error;

    // Transform database format to frontend format
    const formattedProducts = products.map(p => {
      // Parse JSON fields
      let specifications = {};
      let features = [];
      let applications = [];
      let keywords = [];
      let seoKeywords = [];

      try {
        if (typeof p.specifications === 'string') {
          specifications = JSON.parse(p.specifications);
        } else if (p.specifications) {
          specifications = p.specifications;
        }
      } catch {}

      try {
        if (typeof p.features === 'string') {
          features = JSON.parse(p.features);
        } else if (Array.isArray(p.features)) {
          features = p.features;
        }
      } catch {}

      try {
        if (typeof p.applications === 'string') {
          applications = JSON.parse(p.applications);
        } else if (Array.isArray(p.applications)) {
          applications = p.applications;
        }
      } catch {}

      try {
        if (typeof p.keywords === 'string') {
          keywords = JSON.parse(p.keywords);
        } else if (Array.isArray(p.keywords)) {
          keywords = p.keywords;
        }
      } catch {}

      try {
        if (typeof p.seo_keywords === 'string') {
          seoKeywords = JSON.parse(p.seo_keywords);
        } else if (Array.isArray(p.seo_keywords)) {
          seoKeywords = p.seo_keywords;
        }
      } catch {}

      return {
        id: p.id,
        name: p.name,
        title: p.title || p.name,
        description: p.description || '',
        shortDescription: p.short_description || p.shortDescription || '',
        fullDescription: p.full_description || p.fullDescription || '',
        price: formatPrice(p.price),
        priceRange: p.price_range || p.priceRange || 'Contact for pricing',
        frequency: p.frequency || '',
        chip: p.chip || '',
        memory: p.memory || '',
        readRange: p.read_range || p.readRange || '',
        protocol: p.protocol || '',
        category: p.category || '',
        subCategory: p.sub_category || p.subCategory || '',
        badge: p.badge || '',
        moq: p.moq || '1',
        deliveryTime: p.delivery_time || p.deliveryTime || '3-5 business days',
        specifications,
        features,
        applications,
        keywords,
        seoKeywords,
        stockStatus: p.stock_status || p.stockStatus || 'InStock',
        rating: p.rating || 4.5,
        reviewCount: p.review_count || p.reviewCount || 0,
        image: p.image || '',
        created_at: p.created_at,
        updated_at: p.updated_at,
      };
    });

    return NextResponse.json({
      success: true,
      products: formattedProducts,
      count: formattedProducts.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
