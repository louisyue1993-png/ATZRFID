import { getSupabaseClient } from '@/storage/database/supabase-client';
import { randomUUID } from 'crypto';

async function testMinimalInsert() {
  try {
    const client = getSupabaseClient();

    const testProduct = {
      id: randomUUID(),
      name: 'Test UHF RFID Tag',
      title: 'Test UHF RFID Tag',
      description: 'Test description',
      shortDescription: 'Test short description',
      price: '0.15',
      priceRange: '$0.10 - $0.20',
      frequency: '860-960 MHz',
      chip: 'Impinj M700',
      memory: '96-bit EPC',
      readRange: '3-8 meters',
      protocol: 'ISO 18000-6C',
      category: 'uhf-tags',
      subCategory: 'adhesive',
      badge: 'Test',
      moq: '100',
      specifications: JSON.stringify({ test: 'value' }),
      features: JSON.stringify(['feature1', 'feature2']),
      applications: JSON.stringify(['app1', 'app2']),
      keywords: JSON.stringify(['keyword1', 'keyword2']),
      seoKeywords: JSON.stringify(['seo1', 'seo2']),
      stockStatus: 'InStock',
      rating: 4.5,
      reviewCount: 0,
      image: '/test.jpg',
    };

    console.log('Attempting to insert product...');
    const { data, error } = await client
      .from('products')
      .insert(testProduct)
      .select();

    if (error) {
      console.error('Insert error:', error);
      return;
    }

    console.log('✅ Success! Inserted product:', data);

    // Now query the product to see its actual structure
    const { data: product } = await client
      .from('products')
      .select('*')
      .eq('id', testProduct.id)
      .single();

    if (product) {
      console.log('\nActual columns in products table:');
      console.log(Object.keys(product).join(', '));
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

testMinimalInsert()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
