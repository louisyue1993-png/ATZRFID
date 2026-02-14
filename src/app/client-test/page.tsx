'use client';

import { useState, useEffect } from 'react';

export default function ClientTestPage() {
  const [status, setStatus] = useState('Initializing...');
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function testFetch() {
      setStatus('Starting fetch...');
      console.log('Starting fetch');

      try {
        setStatus('Fetching from API...');
        const response = await fetch('/api/products?category=rfid-cards&subcategory=standard-cards');
        console.log('Response received:', response.status);

        setStatus('Parsing JSON...');
        const data = await response.json();
        console.log('Data parsed:', data);

        if (data.success) {
          setStatus(`Success! Found ${data.products.length} products`);
          setProducts(data.products);
          console.log('Products set:', data.products.length);
        } else {
          setStatus('API returned success=false');
        }
      } catch (error) {
        console.error('Error:', error);
        setStatus(`Error: ${error}`);
      }
    }

    testFetch();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Client Test Page</h1>
      <div className="mb-4 p-4 bg-blue-100 rounded">
        <p className="font-semibold">Status: {status}</p>
      </div>

      {products.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Products ({products.length})</h2>
          <div className="space-y-2">
            {products.map(product => (
              <div key={product.id} className="p-2 bg-gray-100 rounded">
                {product.name} - {product.price}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
