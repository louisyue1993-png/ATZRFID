async function testClientFlow() {
  try {
    // Simulate what the client does
    console.log('\n=== Simulating Client Flow ===\n');
    
    // Step 1: Fetch all products
    console.log('Step 1: Fetching all products from API...');
    const response = await fetch('http://localhost:5000/api/products?limit=100');
    const data = await response.json();
    
    if (!data.success) {
      console.error('API returned success=false');
      return;
    }
    
    console.log(`  Fetched ${data.products.length} products`);
    
    // Step 2: Filter products (simulating client-side filter)
    console.log('\nStep 2: Filtering products...');
    const category = 'hf-nfc-tags';
    const subcategory = 'pcb-hf-tags';
    
    let filtered = [...data.products];
    
    console.log(`  Category filter: ${category}`);
    filtered = filtered.filter(p => p.category === category);
    console.log(`  After category filter: ${filtered.length} products`);
    
    if (filtered.length > 0) {
      console.log('  Products after category filter:');
      filtered.forEach((p: any) => {
        console.log(`    - ${p.name} (subCategory: ${p.subCategory})`);
      });
    }
    
    console.log(`  Subcategory filter: ${subcategory}`);
    filtered = filtered.filter(p => p.subCategory === subcategory);
    console.log(`  After subcategory filter: ${filtered.length} products`);
    
    if (filtered.length > 0) {
      console.log('  Final filtered products:');
      filtered.forEach((p: any) => {
        console.log(`    - ${p.name}`);
        console.log(`      category: ${p.category}`);
        console.log(`      subCategory: ${p.subCategory}`);
      });
    }
    
    // Check what the API would return with filters
    console.log('\nStep 3: Checking what API returns with filters...');
    const apiFiltered = await fetch(`http://localhost:5000/api/products?category=${category}&subcategory=${subcategory}&limit=100`);
    const apiData = await apiFiltered.json();
    console.log(`  API returned: ${apiData.count} products`);
    if (apiData.products) {
      apiData.products.forEach((p: any) => {
        console.log(`    - ${p.name} (subCategory: ${p.subCategory})`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testClientFlow();
