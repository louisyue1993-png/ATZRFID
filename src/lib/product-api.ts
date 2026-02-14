import { Product } from '@/data/products';

/**
 * Fetch products from the database via API
 */
export async function fetchProducts(options?: {
  category?: string;
  limit?: number;
  offset?: number;
  published?: boolean;
}): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    if (options?.category) params.append('category', options.category);
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());
    if (options?.published !== undefined) params.append('published', options.published.toString());

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5000'}/api/products?${params.toString()}`,
      { 
        cache: 'no-store', // Always fetch fresh data
        next: { revalidate: 0 }
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch products:', response.statusText);
      return [];
    }

    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Fetch a single product by ID from the database
 */
export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5000'}/api/products/${id}`,
      { 
        cache: 'no-store',
        next: { revalidate: 0 }
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      console.error('Failed to fetch product:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data.product || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

/**
 * Get related products by category
 */
export async function fetchRelatedProducts(currentProductId: string, limit: number = 4): Promise<Product[]> {
  try {
    // First get the current product to find its category
    const currentProduct = await fetchProductById(currentProductId);
    if (!currentProduct || !currentProduct.category) {
      return [];
    }

    // Fetch products in the same category, excluding the current one
    const allCategoryProducts = await fetchProducts({
      category: currentProduct.category,
      limit: 100,
    });

    // Filter out the current product and limit results
    return allCategoryProducts
      .filter(p => p.id !== currentProductId)
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}
