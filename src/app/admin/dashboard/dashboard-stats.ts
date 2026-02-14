import { getSupabaseClient } from '@/storage/database/supabase-client';

export interface DashboardStats {
  products: number;
  recentProducts: Array<{
    id: string;
    name: string;
    category: string;
    image: string;
  }>;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const client = getSupabaseClient();

    // Get total products count
    const { count: productsCount, error: productsError } = await client
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (productsError) {
      console.error('Error fetching products count:', productsError);
    }

    // Get recent products
    const { data: recentProducts, error: recentError } = await client
      .from('products')
      .select('id, name, category, image')
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentError) {
      console.error('Error fetching recent products:', recentError);
    }

    return {
      products: productsCount || 0,
      recentProducts: recentProducts || [],
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      products: 0,
      recentProducts: [],
    };
  }
}
