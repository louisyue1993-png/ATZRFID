'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const url = `/api/products?category=${category}&subcategory=${subcategory}`;
        console.log('Fetching from:', url);
        const response = await fetch(url);
        const data = await response.json();
        console.log('Response:', data);
        if (data.success) {
          setProducts(data.products);
        } else {
          setError('Failed to fetch products');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category, subcategory]);

  if (loading) {
    return <div className="p-8">Loading... (Category: {category}, Subcategory: {subcategory})</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
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
          {products.map(product => (
            <div key={product.id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p>Category: {product.category}</p>
              <p>Subcategory: {product.subCategory}</p>
              <p>Price: {product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SimpleProductsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
