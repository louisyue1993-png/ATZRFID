import { getSupabaseClient } from '@/storage/database/supabase-client';
import { randomUUID } from 'crypto';

async function addMoreProducts() {
  try {
    const client = getSupabaseClient();

    // Check existing products
    const { data: existingProducts, error: checkError } = await client
      .from('products')
      .select('id, category, sub_category');

    if (checkError) {
      console.error('Error checking existing products:', checkError);
      return;
    }

    console.log('Existing products:', existingProducts?.length || 0);
    console.log('Existing categories:', [...new Set(existingProducts?.map(p => p.category))]);
    console.log('Existing subcategories:', [...new Set(existingProducts?.map(p => p.sub_category))]);

    // Add new products for rfid-cards category
    const newProducts = [
      {
        id: randomUUID(),
        name: 'RFID ISO Card',
        title: 'RFID ISO Card - Standard Size',
        description: 'Standard ISO 7810 size RFID card for access control and identification. Compatible with most RFID readers.',
        short_description: 'Standard RFID card for access control',
        full_description: 'Standard ISO 7810 size RFID card for access control and identification. Compatible with most RFID readers and access control systems.',
        price: '0.18',
        price_range: '$0.15 - $0.30',
        frequency: '13.56 MHz',
        chip: 'MIFARE Classic 1K',
        memory: '1KB',
        read_range: '5-10 cm',
        protocol: 'ISO 14443A',
        category: 'rfid-cards',
        sub_category: 'standard-cards',
        badge: 'Popular',
        moq: '50',
        delivery_time: '3-5 business days',
        specifications: JSON.stringify({
          'Frequency': '13.56 MHz',
          'Protocol': 'ISO 14443A',
          'Chip': 'MIFARE Classic 1K',
          'Memory': '1KB',
          'Read Range': '5-10 cm',
          'Size': '85.6 x 54 mm',
        }),
        features: JSON.stringify(['ISO standard size', 'Multiple colors', 'Custom printing', 'Durable']),
        applications: JSON.stringify(['Access control', 'Time attendance', 'Membership', 'Library']),
        keywords: JSON.stringify(['RFID card', 'ISO card', 'access control', 'MIFARE']),
        seo_keywords: JSON.stringify(['RFID ISO card', 'RFID standard card', 'access control card', 'RFID 13.56 MHz']),
        stock_status: 'InStock',
        rating: 4.6,
        review_count: 89,
        image: '/products/product-6.jpg',
      },
      {
        id: randomUUID(),
        name: 'RFID Proximity Card',
        title: 'RFID Proximity Card - 125kHz',
        description: '125kHz RFID proximity card for long-range access control and parking management systems.',
        short_description: 'Long-range RFID proximity card',
        full_description: '125kHz RFID proximity card for long-range access control and parking management systems. Features excellent read range and durability.',
        price: '0.25',
        price_range: '$0.20 - $0.40',
        frequency: '125kHz',
        chip: 'EM4200',
        memory: '64-bit',
        read_range: '10-20 cm',
        protocol: 'EM4100',
        category: 'rfid-cards',
        sub_category: 'standard-cards',
        badge: 'Long Range',
        moq: '50',
        delivery_time: '3-5 business days',
        specifications: JSON.stringify({
          'Frequency': '125kHz',
          'Protocol': 'EM4100',
          'Chip': 'EM4200',
          'Memory': '64-bit',
          'Read Range': '10-20 cm',
          'Size': '85.6 x 54 mm',
        }),
        features: JSON.stringify(['Long read range', 'Waterproof', 'Durable', 'Easy to use']),
        applications: JSON.stringify(['Parking management', 'Access control', 'Time attendance', 'Security']),
        keywords: JSON.stringify(['Proximity card', '125kHz RFID', 'EM card', 'long range']),
        seo_keywords: JSON.stringify(['125kHz RFID card', 'EM4100 card', 'RFID proximity card', 'parking card']),
        stock_status: 'InStock',
        rating: 4.5,
        review_count: 67,
        image: '/products/product-7.jpg',
      },
      {
        id: randomUUID(),
        name: 'UHF RFID Metal Tag',
        title: 'UHF RFID Metal Tag - Industrial',
        description: 'Rugged UHF RFID tag designed for metal surfaces and harsh industrial environments.',
        short_description: 'UHF RFID tag for metal surfaces',
        full_description: 'Rugged UHF RFID tag designed for metal surfaces and harsh industrial environments. Features IP68 rating and ferrite shielding.',
        price: '0.55',
        price_range: '$0.45 - $0.75',
        frequency: '860-960 MHz',
        chip: 'Impinj M700',
        memory: '96-bit EPC',
        read_range: '2-5 meters',
        protocol: 'ISO 18000-6C',
        category: 'rfid-cards',
        sub_category: 'metal-cards',
        badge: 'Industrial',
        moq: '50',
        delivery_time: '5-7 business days',
        specifications: JSON.stringify({
          'Frequency': '860-960 MHz',
          'Protocol': 'ISO 18000-6C',
          'Chip': 'Impinj M700',
          'Memory': '96-bit EPC',
          'Read Range': '2-5 meters',
          'IP Rating': 'IP68',
        }),
        features: JSON.stringify(['Anti-metal', 'IP68 waterproof', 'High temperature resistant', 'Durable']),
        applications: JSON.stringify(['Industrial tracking', 'Metal assets', 'Warehouse', 'Manufacturing']),
        keywords: JSON.stringify(['UHF metal tag', 'industrial RFID', 'asset tracking', 'metal surface']),
        seo_keywords: JSON.stringify(['UHF RFID metal tag', 'industrial RFID tag', 'metal asset tracking', 'IP68 RFID']),
        stock_status: 'InStock',
        rating: 4.8,
        review_count: 112,
        image: '/products/product-8.jpg',
      },
      {
        id: randomUUID(),
        name: 'NFC Card',
        title: 'NFC Card - Mobile Compatible',
        description: 'NFC-enabled card compatible with smartphones and mobile payment systems.',
        short_description: 'NFC card for mobile applications',
        full_description: 'NFC-enabled card compatible with smartphones and mobile payment systems. Works with most NFC-enabled devices.',
        price: '0.22',
        price_range: '$0.18 - $0.35',
        frequency: '13.56 MHz',
        chip: 'NTAG216',
        memory: '888 bytes',
        read_range: '3-8 cm',
        protocol: 'ISO 14443A',
        category: 'rfid-cards',
        sub_category: 'nfc-cards',
        badge: 'Mobile Ready',
        moq: '50',
        delivery_time: '3-5 business days',
        specifications: JSON.stringify({
          'Frequency': '13.56 MHz',
          'Protocol': 'ISO 14443A',
          'Chip': 'NTAG216',
          'Memory': '888 bytes',
          'Read Range': '3-8 cm',
          'Mobile Compatible': 'Yes',
        }),
        features: JSON.stringify(['Mobile compatible', 'Fast read/write', 'High compatibility', 'Customizable']),
        applications: JSON.stringify(['Mobile payments', 'Social media', 'Authentication', 'Smart packaging']),
        keywords: JSON.stringify(['NFC card', 'mobile card', 'smartphone tag', 'NTAG']),
        seo_keywords: JSON.stringify(['NFC card', 'mobile NFC card', 'NFC tag card', 'smartphone NFC']),
        stock_status: 'InStock',
        rating: 4.7,
        review_count: 95,
        image: '/products/product-9.jpg',
      },
      {
        id: randomUUID(),
        name: 'UHF RFID Label',
        title: 'UHF RFID Label - Adhesive',
        description: 'Self-adhesive UHF RFID label for inventory tracking and retail applications.',
        short_description: 'Adhesive UHF RFID label',
        full_description: 'Self-adhesive UHF RFID label for inventory tracking and retail applications. Easy to apply and durable.',
        price: '0.12',
        price_range: '$0.08 - $0.20',
        frequency: '860-960 MHz',
        chip: 'Impinj M700',
        memory: '96-bit EPC',
        read_range: '2-5 meters',
        protocol: 'ISO 18000-6C',
        category: 'rfid-tags',
        sub_category: 'adhesive',
        badge: 'Best Seller',
        moq: '200',
        delivery_time: '3-5 business days',
        specifications: JSON.stringify({
          'Frequency': '860-960 MHz',
          'Protocol': 'ISO 18000-6C',
          'Chip': 'Impinj M700',
          'Memory': '96-bit EPC',
          'Read Range': '2-5 meters',
        }),
        features: JSON.stringify(['Self-adhesive', 'Easy to apply', 'Durable', 'Customizable']),
        applications: JSON.stringify(['Inventory', 'Retail', 'Asset tracking', 'Logistics']),
        keywords: JSON.stringify(['UHF label', 'RFID label', 'adhesive tag', 'inventory']),
        seo_keywords: JSON.stringify(['UHF RFID label', 'adhesive RFID tag', 'inventory label', 'RFID sticker']),
        stock_status: 'InStock',
        rating: 4.6,
        review_count: 145,
        image: '/products/product-10.jpg',
      },
    ];

    console.log('Inserting new products...');
    const { data: insertedProducts, error: insertError } = await client
      .from('products')
      .insert(newProducts)
      .select();

    if (insertError) {
      console.error('Error inserting products:', insertError);
      return;
    }

    console.log('✅ Successfully inserted', insertedProducts?.length, 'new products');
    console.log('\nNew products:');
    insertedProducts?.forEach(p => console.log(`  - ${p.name} (${p.category}/${p.sub_category})`));

    // Check final product count
    const { data: allProducts, error: finalError } = await client
      .from('products')
      .select('category, sub_category');

    if (!finalError && allProducts) {
      console.log('\n✅ Total products:', allProducts.length);
      console.log('Categories:', [...new Set(allProducts.map(p => p.category))]);
      console.log('Subcategories:', [...new Set(allProducts.map(p => p.sub_category))]);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

addMoreProducts()
  .then(() => {
    console.log('✅ Product addition completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Product addition failed:', error);
    process.exit(1);
  });
