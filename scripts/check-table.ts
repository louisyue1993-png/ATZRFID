import { getSupabaseClient } from '@/storage/database/supabase-client';

async function checkTableStructure() {
  try {
    const client = getSupabaseClient();

    // Try to select one product to see its structure
    const { data: products, error } = await client
      .from('products')
      .select('*')
      .limit(1);

    if (error) {
      if (error.code === '42P01') {
        console.log('Error: products table does not exist');
      } else {
        console.log('Error querying products:', error);
      }
      return;
    }

    if (products && products.length > 0) {
      console.log('Products table exists with the following columns:');
      console.log(Object.keys(products[0]));
      console.log('\nSample product:');
      console.log(JSON.stringify(products[0], null, 2));
    } else {
      console.log('Products table exists but is empty');
      // Try to get table info
      const { data: tableInfo } = await client.rpc('get_table_columns', { table_name: 'products' });
      console.log('Table info:', tableInfo);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

checkTableStructure()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
