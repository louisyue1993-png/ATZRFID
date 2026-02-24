import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { normalizeCategory, normalizeSubCategory, subCategoryMapping } from '@/lib/categoryMapping';
import { products as staticProducts } from '@/data/products';

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

function normalizeText(value: unknown): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function slugify(value: unknown): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function productDedupeKeys(product: Record<string, any>): string[] {
  const keys: string[] = [];
  const nameKey = normalizeText(product.name);
  const slugFromName = slugify(product.name || product.title);
  const slugFromId = slugify(product.id);

  if (nameKey) keys.push(`name:${nameKey}`);
  if (slugFromName) keys.push(`slug:${slugFromName}`);
  if (slugFromId) keys.push(`slug:${slugFromId}`);

  return keys;
}

function buildStaticProducts(id: string | null, category: string | null, subCategory: string | null) {
  return staticProducts
    .filter(p => !id || p.id === id)
    .filter(p => !category || p.category === category)
    .filter(p => !subCategory || p.subCategory === subCategory)
    .map(p => ({
      ...p,
      created_at: undefined,
      updated_at: undefined,
    }));
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

    const { data: products, error } = await query.range(0, 1999);

    if (error) {
      console.error('[API Products] Database query failed, fallback to static products:', error.message);
    }

    // Transform database format to frontend format
    const formattedProducts = (products || []).map(p => {
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

    const fallbackProducts = buildStaticProducts(id, normalizedCategory, normalizedSubCategory);

    const seenKeys = new Set<string>();
    for (const item of formattedProducts) {
      for (const key of productDedupeKeys(item)) {
        seenKeys.add(key);
      }
    }

    const mergedProducts: Array<Record<string, any>> = [...formattedProducts];
    for (const item of fallbackProducts) {
      const keys = productDedupeKeys(item as Record<string, any>);
      const isDuplicate = keys.some(key => seenKeys.has(key));

      if (!isDuplicate) {
        mergedProducts.push(item);
        for (const key of keys) {
          seenKeys.add(key);
        }
      }
    }

    const pagedProducts = mergedProducts.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      products: pagedProducts,
      count: pagedProducts.length,
    });
  } catch (error: any) {
    console.error('[API Products] Unexpected error, fallback to static products:', error);

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const category = normalizeCategory(searchParams.get('category'));
    const subCategory = normalizeSubCategory(searchParams.get('subcategory'));
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const fallbackProducts = buildStaticProducts(id, category, subCategory).slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      products: fallbackProducts,
      count: fallbackProducts.length,
      fallback: true,
    });
  }
}
