import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://xywxyowxqgcvxqfwgldg.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

const hfNfcProducts = [
  {
    name: 'HF PCB Tag',
    title: 'HF PCB RFID Tag - 13.56MHz',
    description: 'High frequency PCB RFID tag operating at 13.56MHz for embedded applications and industrial use.',
    short_description: 'Durable HF PCB tag for embedded applications',
    full_description: 'High frequency PCB RFID tag operating at 13.56MHz for embedded applications and industrial use. Features excellent read range and durability for harsh environments.',
    price: 0.45,
    price_range: '$0.40 - $0.60',
    frequency: '13.56 MHz',
    chip: 'NTAG216',
    memory: '888 bytes',
    'read_range': '2-5 cm',
    protocol: 'ISO 14443A',
    category: 'hf-nfc-tags',
    sub_category: 'pcb-hf-tags',
    badge: 'Durable',
    moq: '100',
    delivery_time: '3-5 business days',
    specifications: {
      Frequency: '13.56 MHz',
      Protocol: 'ISO 14443A',
      Chip: 'NTAG216',
      Memory: '888 bytes',
      Read Range: '2-5 cm',
      Size: '50 x 50 mm',
      Material: 'FR4 PCB'
    },
    features: [
      'PCB embedded design',
      'High temperature resistant',
      'Waterproof',
      'Durable construction'
    ],
    applications: [
      'Industrial equipment',
      'Embedded systems',
      'Asset tracking',
      'Access control'
    ],
    keywords: ['HF tag', 'PCB tag', '13.56MHz', 'embedded'],
    seo_keywords: ['HF RFID tag', 'PCB RFID tag', '13.56MHz tag', 'embedded RFID'],
    stock_status: 'InStock',
    rating: 4.4,
    review_count: 45,
    image: '/products/product-8.jpg'
  },
  {
    name: 'ABS HF Tag',
    title: 'ABS HF RFID Tag - 13.56MHz',
    description: 'ABS plastic HF RFID tag operating at 13.56MHz for outdoor and industrial applications.',
    short_description: 'Weather-resistant ABS HF tag',
    full_description: 'ABS plastic HF RFID tag operating at 13.56MHz for outdoor and industrial applications. Features IP67 protection and excellent durability.',
    price: 0.52,
    price_range: '$0.45 - $0.70',
    frequency: '13.56 MHz',
    chip: 'MIFARE DESFire EV3',
    memory: '2KB',
    read_range: '3-6 cm',
    protocol: 'ISO 14443A',
    category: 'hf-nfc-tags',
    sub_category: 'abs-hf-tags',
    badge: 'IP67',
    moq: '100',
    delivery_time: '3-5 business days',
    specifications: {
      Frequency: '13.56 MHz',
      Protocol: 'ISO 14443A',
      Chip: 'MIFARE DESFire EV3',
      Memory: '2KB',
      Read Range: '3-6 cm',
      Size: '30 x 30 mm',
      Material: 'ABS Plastic'
    },
    features: [
      'IP67 waterproof',
      'Impact resistant',
      'UV resistant',
      'Multiple mounting options'
    ],
    applications: [
      'Outdoor tracking',
      'Industrial assets',
      'Vehicle tracking',
      'Supply chain'
    ],
    keywords: ['HF tag', 'ABS tag', 'waterproof', 'outdoor'],
    seo_keywords: ['ABS HF tag', 'waterproof RFID tag', 'outdoor RFID', 'IP67 tag'],
    stock_status: 'InStock',
    rating: 4.6,
    review_count: 78,
    image: '/products/product-9.jpg'
  },
  {
    name: 'NFC Sticker',
    title: 'NFC Adhesive Sticker - 13.56MHz',
    description: 'Thin NFC adhesive sticker for smartphones, tablets, and smart devices.',
    short_description: 'Easy-to-use NFC adhesive sticker',
    full_description: 'Thin NFC adhesive sticker for smartphones, tablets, and smart devices. Perfect for marketing campaigns, smart posters, and automation.',
    price: 0.15,
    price_range: '$0.10 - $0.25',
    frequency: '13.56 MHz',
    chip: 'NTAG213',
    memory: '144 bytes',
    read_range: '1-3 cm',
    protocol: 'ISO 14443A',
    category: 'hf-nfc-tags',
    sub_category: 'other-hf-tags',
    badge: 'Best Seller',
    moq: '500',
    delivery_time: '2-3 business days',
    specifications: {
      Frequency: '13.56 MHz',
      Protocol: 'ISO 14443A',
      Chip: 'NTAG213',
      Memory: '144 bytes',
      Read Range: '1-3 cm',
      Size: '25 x 25 mm',
      Material: 'PVC + Adhesive'
    },
    features: [
      'Ultra-thin design',
      'Strong adhesive',
      'Smartphone compatible',
      'Printable surface'
    ],
    applications: [
      'Smart posters',
      'Business cards',
      'Product packaging',
      'Mobile payments'
    ],
    keywords: ['NFC sticker', 'adhesive NFC', 'smart tag'],
    seo_keywords: ['NFC adhesive sticker', 'smart tag', 'NFC marketing', 'mobile NFC'],
    stock_status: 'InStock',
    rating: 4.7,
    review_count: 234,
    image: '/products/product-10.jpg'
  }
];

async function addProducts() {
  console.log('Adding HF/NFC products to database...');

  for (const product of hfNfcProducts) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: product.name,
          title: product.title,
          description: product.description,
          short_description: product.short_description,
          full_description: product.full_description,
          price: product.price,
          price_range: product.price_range,
          frequency: product.frequency,
          chip: product.chip,
          memory: product.memory,
          read_range: product.read_range,
          protocol: product.protocol,
          category: product.category,
          sub_category: product.sub_category,
          badge: product.badge,
          moq: product.moq,
          delivery_time: product.delivery_time,
          specifications: product.specifications,
          features: product.features,
          applications: product.applications,
          keywords: product.keywords,
          seo_keywords: product.seo_keywords,
          stock_status: product.stock_status,
          rating: product.rating,
          review_count: product.review_count,
          image: product.image
        }])
        .select();

      if (error) {
        console.error(`Error adding ${product.name}:`, error);
      } else {
        console.log(`✓ Added: ${product.name} (${product.category}/${product.sub_category})`);
      }
    } catch (error) {
      console.error(`Error adding ${product.name}:`, error);
    }
  }

  console.log('\nFinished adding products!');
}

addProducts();
