import { getSupabaseClient } from '@/storage/database/supabase-client';
import { randomUUID } from 'crypto';

async function initializeDatabase() {
  try {
    const client = getSupabaseClient();

    // Check if products already exist
    const { data: existingProducts, error: checkError } = await client
      .from('products')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('Error checking existing products:', checkError);
      return;
    }

    if (existingProducts && existingProducts.length > 0) {
      console.log('✅ Products already exist. Skipping initialization.');
      return;
    }

    // Insert sample products with correct snake_case column names
    const sampleProducts = [
      {
        id: randomUUID(),
        name: 'UHF RFID Tag',
        title: 'UHF RFID Tag - High Performance',
        description: 'High-performance UHF RFID tag for inventory management and asset tracking. Features long read range and excellent durability.',
        short_description: 'UHF RFID tag for inventory tracking',
        full_description: 'High-performance UHF RFID tag for inventory management and asset tracking. Features long read range and excellent durability.',
        price: '0.15',
        price_range: '$0.10 - $0.25',
        frequency: '860-960 MHz',
        chip: 'Impinj M700',
        memory: '96-bit EPC',
        read_range: '3-8 meters',
        protocol: 'ISO 18000-6C',
        category: 'uhf-tags',
        sub_category: 'adhesive',
        badge: 'Popular',
        moq: '100',
        delivery_time: '3-5 business days',
        specifications: JSON.stringify({
          'Frequency': '860-960 MHz',
          'Protocol': 'ISO 18000-6C',
          'Chip': 'Impinj M700',
          'Memory': '96-bit EPC',
          'Read Range': '3-8 meters',
        }),
        features: JSON.stringify(['Long read range', 'High durability', 'Easy installation', 'IP67 waterproof']),
        applications: JSON.stringify(['Inventory management', 'Asset tracking', 'Retail', 'Warehouse']),
        keywords: JSON.stringify(['UHF RFID', 'RFID tag', 'inventory', 'tracking']),
        seo_keywords: JSON.stringify(['UHF RFID', 'RFID tag', 'inventory tracking', 'asset management', 'warehouse RFID']),
        stock_status: 'InStock',
        rating: 4.7,
        review_count: 125,
        image: '/products/product-1.jpg',
      },
      {
        id: randomUUID(),
        name: 'HF RFID Card',
        title: 'HF RFID Card - Premium Access Control',
        description: 'Premium HF RFID card for access control and payment systems. Offers high security and custom printing options.',
        short_description: 'HF RFID card for access control',
        full_description: 'Premium HF RFID card for access control and payment systems. Offers high security and custom printing options.',
        price: '0.25',
        price_range: '$0.20 - $0.40',
        frequency: '13.56 MHz',
        chip: 'MIFARE DESFire EV3',
        memory: '8KB',
        read_range: '5-10 cm',
        protocol: 'ISO 14443A',
        category: 'hf-cards',
        sub_category: 'standard',
        badge: 'Premium',
        moq: '50',
        delivery_time: '5-7 business days',
        specifications: JSON.stringify({
          'Frequency': '13.56 MHz',
          'Protocol': 'ISO 14443A',
          'Chip': 'MIFARE DESFire EV3',
          'Memory': '8KB',
          'Read Range': '5-10 cm',
        }),
        features: JSON.stringify(['High security', 'Durable', 'Custom printing', 'Multiple formats']),
        applications: JSON.stringify(['Access control', 'Payment systems', 'Identity cards', 'Membership']),
        keywords: JSON.stringify(['HF RFID', 'RFID card', 'access', 'control']),
        seo_keywords: JSON.stringify(['HF RFID', 'RFID card', 'access control', 'MIFARE', 'payment card']),
        stock_status: 'InStock',
        rating: 4.8,
        review_count: 98,
        image: '/products/product-2.jpg',
      },
      {
        id: randomUUID(),
        name: 'NFC Sticker',
        title: 'NFC Sticker - Mobile Interaction',
        description: 'Compact NFC sticker for mobile interaction and smart packaging. Easy to apply and compatible with most smartphones.',
        short_description: 'NFC sticker for mobile apps',
        full_description: 'Compact NFC sticker for mobile interaction and smart packaging. Easy to apply and compatible with most smartphones.',
        price: '0.10',
        price_range: '$0.05 - $0.15',
        frequency: '13.56 MHz',
        chip: 'NTAG213',
        memory: '144 bytes',
        read_range: '2-5 cm',
        protocol: 'ISO 14443A',
        category: 'nfc-tags',
        sub_category: 'sticker',
        badge: 'Budget Friendly',
        moq: '200',
        delivery_time: '2-4 business days',
        specifications: JSON.stringify({
          'Frequency': '13.56 MHz',
          'Protocol': 'ISO 14443A',
          'Chip': 'NTAG213',
          'Memory': '144 bytes',
          'Read Range': '2-5 cm',
        }),
        features: JSON.stringify(['Compact size', 'Easy to apply', 'Mobile compatible', 'Customizable']),
        applications: JSON.stringify(['Mobile payments', 'Smart packaging', 'Marketing', 'Product authentication']),
        keywords: JSON.stringify(['NFC', 'sticker', 'mobile', 'tag']),
        seo_keywords: JSON.stringify(['NFC', 'NFC sticker', 'mobile tag', 'smart packaging', 'NTAG']),
        stock_status: 'InStock',
        rating: 4.6,
        review_count: 76,
        image: '/products/product-3.jpg',
      },
      {
        id: randomUUID(),
        name: 'UHF RFID Anti-Metal Tag',
        title: 'UHF RFID Anti-Metal Tag - Industrial Grade',
        description: 'Specialized UHF RFID tag designed for metal surfaces. Features ferrite shielding for optimal performance on metal assets.',
        short_description: 'UHF RFID tag for metal surfaces',
        full_description: 'Specialized UHF RFID tag designed for metal surfaces. Features ferrite shielding for optimal performance on metal assets.',
        price: '0.45',
        price_range: '$0.35 - $0.65',
        frequency: '860-960 MHz',
        chip: 'Impinj Monza R6',
        memory: '96-bit EPC',
        read_range: '1-3 meters (on metal)',
        protocol: 'ISO 18000-6C',
        category: 'uhf-tags',
        sub_category: 'anti-metal',
        badge: 'Industrial',
        moq: '100',
        delivery_time: '5-7 business days',
        specifications: JSON.stringify({
          'Frequency': '860-960 MHz',
          'Protocol': 'ISO 18000-6C',
          'Chip': 'Impinj Monza R6',
          'Memory': '96-bit EPC',
          'Read Range': '1-3 meters (on metal)',
        }),
        features: JSON.stringify(['Anti-metal design', 'Ferrite shield', 'Strong adhesive', 'IP68 waterproof']),
        applications: JSON.stringify(['IT asset tracking', 'Metal containers', 'Industrial equipment', 'Server racks']),
        keywords: JSON.stringify(['anti-metal', 'RFID', 'tag', 'metal']),
        seo_keywords: JSON.stringify(['anti-metal RFID', 'RFID metal tag', 'UHF metal tag', 'IT asset tracking']),
        stock_status: 'InStock',
        rating: 4.9,
        review_count: 143,
        image: '/products/product-4.jpg',
      },
      {
        id: randomUUID(),
        name: 'RFID Wristband',
        title: 'RFID Wristband - Events & Access Control',
        description: 'Comfortable RFID wristband for events, access control, and cashless payments. Available in various colors and materials.',
        short_description: 'RFID wristband for events and access',
        full_description: 'Comfortable RFID wristband for events, access control, and cashless payments. Available in various colors and materials.',
        price: '0.35',
        price_range: '$0.25 - $0.50',
        frequency: '13.56 MHz',
        chip: 'MIFARE Classic 1K',
        memory: '1KB',
        read_range: '3-8 cm',
        protocol: 'ISO 14443A',
        category: 'rfid-wristbands',
        sub_category: 'silicone',
        badge: 'Event Ready',
        moq: '50',
        delivery_time: '3-5 business days',
        specifications: JSON.stringify({
          'Frequency': '13.56 MHz',
          'Protocol': 'ISO 14443A',
          'Chip': 'MIFARE Classic 1K',
          'Memory': '1KB',
          'Read Range': '3-8 cm',
        }),
        features: JSON.stringify(['Comfortable', 'Waterproof', 'Reusable', 'Customizable']),
        applications: JSON.stringify(['Events', 'Concerts', 'Festivals', 'Theme parks', 'Hospitals']),
        keywords: JSON.stringify(['RFID', 'wristband', 'event', 'access']),
        seo_keywords: JSON.stringify(['RFID wristband', 'event wristband', 'access control wristband', 'cashless payment']),
        stock_status: 'InStock',
        rating: 4.8,
        review_count: 167,
        image: '/products/product-5.jpg',
      },
    ];

    console.log('Inserting sample products...');
    const { data: insertedProducts, error: insertError } = await client
      .from('products')
      .insert(sampleProducts)
      .select();

    if (insertError) {
      console.error('Error inserting products:', insertError);
      return;
    }

    console.log('✅ Successfully inserted', insertedProducts?.length, 'sample products');
    console.log('\nProducts:');
    insertedProducts?.forEach(p => console.log(`  - ${p.name}`));

  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Run the initialization
initializeDatabase()
  .then(() => {
    console.log('✅ Database initialization completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  });
