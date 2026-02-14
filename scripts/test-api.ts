async function testAPI() {
  try {
    // Test 1: Get all products
    console.log('\n=== Test 1: Get all products ===');
    const allRes = await fetch('http://localhost:5000/api/products?limit=100');
    const allData = await allRes.json();
    console.log(`Status: ${allRes.status}`);
    console.log(`Success: ${allData.success}`);
    console.log(`Total products: ${allData.count}`);

    // Test 2: Filter by category
    console.log('\n=== Test 2: Filter by category=hf-nfc-tags ===');
    const catRes = await fetch('http://localhost:5000/api/products?category=hf-nfc-tags&limit=100');
    const catData = await catRes.json();
    console.log(`Status: ${catRes.status}`);
    console.log(`Success: ${catData.success}`);
    console.log(`Products found: ${catData.count}`);
    if (catData.products) {
      catData.products.forEach((p: any) => {
        console.log(`  - ${p.name} (category: ${p.category}, subCategory: ${p.subCategory})`);
      });
    }

    // Test 3: Filter by category and subcategory
    console.log('\n=== Test 3: Filter by category=hf-nfc-tags&subcategory=pcb-hf-tags ===');
    const subRes = await fetch('http://localhost:5000/api/products?category=hf-nfc-tags&subcategory=pcb-hf-tags&limit=100');
    const subData = await subRes.json();
    console.log(`Status: ${subRes.status}`);
    console.log(`Success: ${subData.success}`);
    console.log(`Products found: ${subData.count}`);
    if (subData.products) {
      subData.products.forEach((p: any) => {
        console.log(`  - ${p.name} (category: ${p.category}, subCategory: ${p.subCategory})`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

testAPI();
