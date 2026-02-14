import { getSupabaseClient } from '@/storage/database/supabase-client';

// Force dynamic rendering to prevent build-time errors when environment variables are not set
export const dynamic = 'force-dynamic';

export default async function ServerProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; subcategory?: string };
}) {
  const { category, subcategory } = searchParams;
  const client = getSupabaseClient();

  let query = client.from('products').select('*');

  if (category) {
    query = query.eq('category', category);
  }

  if (subcategory) {
    query = query.eq('sub_category', subcategory);
  }

  const { data: products, error } = await query;

  if (error) {
    return <div className="p-8 text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Products ({products.length})
        {category && <> - Category: {category}</>}
        {subcategory && <> - Subcategory: {subcategory}</>}
      </h1>
      
      {products.length === 0 ? (
        <div className="text-gray-500">No products found</div>
      ) : (
        <div className="space-y-4">
          {products.map((product: any) => (
            <div key={product.id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p>Category: {product.category}</p>
              <p>Subcategory: {product.sub_category}</p>
              <p>Price: {product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
