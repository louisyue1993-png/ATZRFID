import { getSupabaseClient } from '@/storage/database/supabase-client';

async function checkProducts() {
  try {
    const client = getSupabaseClient();

    // Get all products with their category and sub_category
    const { data: products, error } = await client
      .from('products')
      .select('id, name, category, sub_category')
      .order('category');

    if (error) {
      console.error('Error fetching products:', error);
      return;
    }

    console.log(`\n=== Total Products: ${products.length} ===\n`);

    // Group by category
    const categories: Record<string, Record<string, number>> = {};

    products.forEach(p => {
      if (!categories[p.category]) {
        categories[p.category] = {};
      }
      if (!categories[p.category][p.sub_category]) {
        categories[p.category][p.sub_category] = 0;
      }
      categories[p.category][p.sub_category]++;
    });

    // Print categories
    for (const [category, subCategories] of Object.entries(categories)) {
      console.log(`Category: ${category}`);
      for (const [subCategory, count] of Object.entries(subCategories)) {
        console.log(`  - ${subCategory}: ${count} products`);
      }
      console.log('');
    }

    // Check specific category
    console.log('\n=== Check hf-nfc-tags/pcb-hf-tags ===\n');
    const { data: specificProducts } = await client
      .from('products')
      .select('*')
      .eq('category', 'hf-nfc-tags')
      .eq('sub_category', 'pcb-hf-tags');

    if (specificProducts && specificProducts.length > 0) {
      console.log(`Found ${specificProducts.length} products with category=hf-nfc-tags and sub_category=pcb-hf-tags:`);
      specificProducts.forEach(p => {
        console.log(`  - ${p.name} (id: ${p.id})`);
      });
    } else {
      console.log('No products found with category=hf-nfc-tags and sub_category=pcb-hf-tags');
    }

    // List all hf-nfc-tags products
    console.log('\n=== All hf-nfc-tags products ===\n');
    const { data: hfProducts } = await client
      .from('products')
      .select('*')
      .eq('category', 'hf-nfc-tags');

    if (hfProducts && hfProducts.length > 0) {
      console.log(`Found ${hfProducts.length} products with category=hf-nfc-tags:`);
      hfProducts.forEach(p => {
        console.log(`  - ${p.name} (sub_category: ${p.sub_category})`);
      });
    } else {
      console.log('No products found with category=hf-nfc-tags');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

checkProducts();
