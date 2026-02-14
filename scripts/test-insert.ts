import { getSupabaseClient } from '@/storage/database/supabase-client';

async function testInsert() {
  try {
    const client = getSupabaseClient();

    // Test inserting a minimal product
    const { data, error } = await client
      .from('products')
      .insert({
        name: 'Test Product',
        slug: 'test-product',
        category: 'test',
      })
      .select();

    if (error) {
      console.log('Insert error:', error);
      return;
    }

    console.log('Success! Inserted product:', data);

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
