import { getSupabaseClient } from '@/storage/database/supabase-client';

async function testInsert() {
  try {
    const client = getSupabaseClient();

    // Test inserting with only name
    const { data, error } = await client
      .from('products')
      .insert({
        name: 'Test Product',
      })
      .select();

    if (error) {
      console.log('Insert error with name only:', error);
      
      // Try to query existing products to see structure
      const { data: existingProducts } = await client
        .from('products')
        .select('*')
        .limit(1);
      
      if (existingProducts && existingProducts.length > 0) {
        console.log('\nExisting product columns:', Object.keys(existingProducts[0]));
      }
      return;
    }

    console.log('Success! Inserted product:', data);

    // Now try to get the inserted product to see its structure
    const { data: inserted } = await client
      .from('products')
      .select('*')
      .eq('name', 'Test Product')
      .single();

    if (inserted) {
      console.log('\nInserted product structure:', Object.keys(inserted));
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

testInsert()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
