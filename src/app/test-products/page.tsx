// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic';

export default async function TestProductsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';
  
  // Test API calls
  const allProductsRes = await fetch(`${baseUrl}/api/products?limit=100`);
  const allProductsData = await allProductsRes.json();
  
  const filteredRes = await fetch(`${baseUrl}/api/products?category=rfid-cards&subcategory=standard-cards`);
  const filteredData = await filteredRes.json();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Products Test Page</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">All Products ({allProductsData.count})</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(allProductsData, null, 2)}
          </pre>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Filtered Products - rfid-cards/standard-cards ({filteredData.count})</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(filteredData, null, 2)}
          </pre>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Standard Cards Details</h2>
          <ul className="space-y-2">
            {filteredData.products.map((product: any) => (
              <li key={product.id} className="bg-white p-4 rounded shadow">
                <h3 className="font-bold">{product.name}</h3>
                <p>Category: {product.category}</p>
                <p>SubCategory: {product.subCategory}</p>
                <p>Price: {product.price}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
