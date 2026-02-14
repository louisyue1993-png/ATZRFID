// Database utility functions for server-side components
import { getSupabaseClient } from '@/storage/database/supabase-client';
import type { Product } from '@/data/products';

// Format product data from database format to frontend format
function formatProduct(product: any): Product {
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
  
  // Ensure required fields have default values
  result.title = result.title || result.name;
  result.description = result.description || '';
  result.shortDescription = result.shortDescription || '';
  result.fullDescription = result.fullDescription || result.description || '';
  result.priceRange = result.priceRange || result.price || 'Contact for pricing';
  result.category = result.category || '';
  result.subCategory = result.subCategory || '';
  result.stockStatus = result.stockStatus || 'InStock';
  result.rating = result.rating || 4.5;
  result.reviewCount = result.reviewCount || 0;
  
  return result as Product;
}

// Get product by ID from database (server-side only)
export async function getProductByIdFromDB(id: string): Promise<Product | null> {
  try {
    const client = getSupabaseClient();
    
    const { data: product, error } = await client
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return null;
    }

    if (!product) {
      return null;
    }

    return formatProduct(product);
  } catch (error) {
    console.error('Error fetching product from database:', error);
    return null;
  }
}

// Get related products from database (server-side only)
export async function getRelatedProductsFromDB(category: string, excludeId: string, limit: number = 4): Promise<Product[]> {
  try {
    const client = getSupabaseClient();
    
    const { data: products, error } = await client
      .from('products')
      .select('*')
      .eq('category', category)
      .neq('id', excludeId)
      .limit(limit + 10); // Get more to filter

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }

    const formattedProducts = (products || []).map(formatProduct);
    return formattedProducts.slice(0, limit);
  } catch (error) {
    console.error('Error fetching related products from database:', error);
    return [];
  }
}
