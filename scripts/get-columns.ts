import { getSupabaseClient } from '@/storage/database/supabase-client';

async function getTableColumns() {
  try {
    const client = getSupabaseClient();

    // Use SQL to get column information
    const { data, error } = await client.rpc('get_table_columns', {
      table_name: 'products'
    });

    if (error) {
      console.error('Error getting table columns:', error);
      
      // Try a different approach - query with minimal data
      const { data: testInsert } = await client
        .from('products')
        .insert({
          id: crypto.randomUUID(),
          name: 'temp-test-product',
          title: 'temp',
          description: 'temp',
          shortDescription: 'temp',
          price: '0',
          frequency: 'temp',
          chip: 'temp',
          memory: 'temp',
          protocol: 'temp',
          category: 'temp',
          specifications: '{}',
          features: '[]',
          applications: '[]',
          keywords: '[]',
          seoKeywords: '[]',
          stockStatus: 'InStock',
          image: 'temp.jpg',
        })
        .select()
        .single();

      if (testInsert) {
        console.log('✅ Found columns by test insert:');
        console.log(Object.keys(testInsert).join('\n'));
      }
      return;
    }

    console.log('Table columns:', data);

  } catch (error) {
    console.error('Error:', error);
  }
}

getTableColumns()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
