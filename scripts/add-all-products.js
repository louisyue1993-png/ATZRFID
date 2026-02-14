const { createClient } = require('@supabase/supabase-js');
const { execSync } = require('child_process');
const { randomUUID } = require('crypto');

// Load environment variables from Python
function loadEnv() {
  try {
    const pythonCode = `
import os
import sys
try:
    from coze_workload_identity import Client
    client = Client()
    env_vars = client.get_project_env_vars()
    client.close()
    for env_var in env_vars:
        print(f"{env_var.key}={env_var.value}")
except Exception as e:
    print(f"# Error: {e}", file=sys.stderr)
`;
    const output = execSync(`python3 -c '${pythonCode.replace(/'/g, "'\"'\"'")}'`, {
      encoding: 'utf-8',
      timeout: 10000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    const lines = output.trim().split('\n');
    for (const line of lines) {
      if (line.startsWith('#')) continue;
      const eqIndex = line.indexOf('=');
      if (eqIndex > 0) {
        const key = line.substring(0, eqIndex);
        let value = line.substring(eqIndex + 1);
        if ((value.startsWith("'") && value.endsWith("'")) ||
            (value.startsWith('"') && value.endsWith('"'))) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    }
  } catch (e) {
    console.error('Error loading environment variables:', e.message);
  }
}

loadEnv();

const supabaseUrl = process.env.COZE_SUPABASE_URL;
const supabaseKey = process.env.COZE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Products to add for empty subcategories
const productsToAdd = [
  // UHF Tags - Flexible Anti-Metal
  {
    name: 'Flexible Anti-Metal Tag',
    title: 'Flexible UHF RFID Anti-Metal Tag - 860-960MHz',
    description: 'Flexible UHF RFID anti-metal tag with ferrite layer for metal surface applications.',
    short_description: 'Flexible tag for metal surfaces',
    full_description: 'Flexible UHF RFID anti-metal tag with ferrite layer for metal surface applications. Can be bent and adhered to curved metal surfaces.',
    price: 0.65,
    price_range: '$0.55 - $0.80',
    frequency: '860-960 MHz',
    chip: 'Impinj Monza R6',
    memory: '96 bits',
    read_range: '3-5 m',
    protocol: 'EPC Class 1 Gen 2',
    category: 'uhf-tags',
    sub_category: 'flexible-anti-metal',
    badge: 'Flexible',
    moq: '100',
    delivery_time: '3-5 business days',
    specifications: {
      Frequency: '860-960 MHz',
      Protocol: 'EPC Class 1 Gen 2',
      Chip: 'Impinj Monza R6',
      Memory: '96 bits',
      ReadRange: '3-5 m',
      Size: '100 x 25 mm',
      Material: 'PVC + Ferrite'
    },
    features: ['Flexible design', 'Ferrite layer', 'Strong adhesive', 'Bendable'],
    applications: ['Metal containers', 'Cylindrical objects', 'Industrial equipment', 'Metal shelves'],
    keywords: ['UHF anti-metal', 'flexible tag', 'metal RFID', 'ferrite tag'],
    seo_keywords: ['flexible anti-metal tag', 'UHF metal tag', 'ferrite RFID', 'bendable tag'],
    stock_status: 'InStock',
    rating: 4.3,
    review_count: 56,
    image: '/products/product-11.jpg'
  },
  
  // UHF Tags - ABS Anti-Metal
  {
    name: 'ABS Anti-Metal Tag',
    title: 'ABS UHF RFID Anti-Metal Tag - 860-960MHz',
    description: 'ABS plastic UHF RFID anti-metal tag with rugged design for harsh industrial environments.',
    short_description: 'Rugged anti-metal tag for industry',
    full_description: 'ABS plastic UHF RFID anti-metal tag with rugged design for harsh industrial environments. Features IP68 protection and excellent durability.',
    price: 0.85,
    price_range: '$0.70 - $1.00',
    frequency: '860-960 MHz',
    chip: 'Alien Higgs-3',
    memory: '512 bits',
    read_range: '4-6 m',
    protocol: 'EPC Class 1 Gen 2',
    category: 'uhf-tags',
    sub_category: 'abs-anti-metal',
    badge: 'IP68',
    moq: '100',
    delivery_time: '3-5 business days',
    specifications: {
      Frequency: '860-960 MHz',
      Protocol: 'EPC Class 1 Gen 2',
      Chip: 'Alien Higgs-3',
      Memory: '512 bits',
      ReadRange: '4-6 m',
      Size: '80 x 25 x 12 mm',
      Material: 'ABS Plastic'
    },
    features: ['IP68 waterproof', 'Impact resistant', 'UV resistant', 'Screw mounting'],
    applications: ['Industrial equipment', 'Metal assets', 'Outdoor tracking', 'Oil & gas'],
    keywords: ['UHF anti-metal', 'ABS tag', 'IP68 RFID', 'industrial tag'],
    seo_keywords: ['ABS anti-metal tag', 'IP68 RFID tag', 'industrial UHF tag', 'rugged RFID'],
    stock_status: 'InStock',
    rating: 4.5,
    review_count: 89,
    image: '/products/product-12.jpg'
  },
  
  // UHF Tags - PCB Anti-Metal
  {
    name: 'PCB Anti-Metal Tag',
    title: 'PCB UHF RFID Anti-Metal Tag - 860-960MHz',
    description: 'PCB UHF RFID anti-metal tag for high-performance applications with excellent read range.',
    short_description: 'High-performance PCB anti-metal tag',
    full_description: 'PCB UHF RFID anti-metal tag for high-performance applications with excellent read range. Perfect for asset tracking in metal-rich environments.',
    price: 1.20,
    price_range: '$1.00 - $1.50',
    frequency: '860-960 MHz',
    chip: 'NXP UCODE 8',
    memory: '128 bits',
    read_range: '5-8 m',
    protocol: 'EPC Class 1 Gen 2',
    category: 'uhf-tags',
    sub_category: 'pcb-anti-metal',
    badge: 'High Performance',
    moq: '100',
    delivery_time: '3-5 business days',
    specifications: {
      Frequency: '860-960 MHz',
      Protocol: 'EPC Class 1 Gen 2',
      Chip: 'NXP UCODE 8',
      Memory: '128 bits',
      ReadRange: '5-8 m',
      Size: '60 x 20 x 5 mm',
      Material: 'FR4 PCB'
    },
    features: ['Long read range', 'High performance', 'Compact design', 'Screw mount'],
    applications: ['IT assets', 'Server tracking', 'Medical equipment', 'High-value assets'],
    keywords: ['UHF anti-metal', 'PCB tag', 'high-performance RFID', 'NXP UCODE'],
    seo_keywords: ['PCB anti-metal tag', 'high-performance UHF tag', 'NXP UCODE 8', 'long range tag'],
    stock_status: 'InStock',
    rating: 4.7,
    review_count: 123,
    image: '/products/product-13.jpg'
  },
  
  // UHF Tags - Laundry Tags
  {
    name: 'Laundry RFID Tag',
    title: 'UHF RFID Laundry Tag - Heat Resistant',
    description: 'UHF RFID laundry tag for textile and garment tracking with heat and water resistance.',
    short_description: 'Heat-resistant laundry tag',
    full_description: 'UHF RFID laundry tag for textile and garment tracking with heat and water resistance. Can withstand industrial laundry processes.',
    price: 0.55,
    price_range: '$0.45 - $0.70',
    frequency: '860-960 MHz',
    chip: 'Impinj Monza R6',
    memory: '96 bits',
    read_range: '1-2 m',
    protocol: 'EPC Class 1 Gen 2',
    category: 'uhf-tags',
    sub_category: 'laundry-tags',
    badge: 'Heat Resistant',
    moq: '100',
    delivery_time: '3-5 business days',
    specifications: {
      Frequency: '860-960 MHz',
      Protocol: 'EPC Class 1 Gen 2',
      Chip: 'Impinj Monza R6',
      Memory: '96 bits',
      ReadRange: '1-2 m',
      Size: '65 x 15 x 2.5 mm',
      Material: 'PES + Ceramic'
    },
    features: ['Heat resistant', 'Waterproof', 'Washable', 'Sewable'],
    applications: ['Commercial laundry', 'Hotels', 'Hospitals', 'Uniform tracking'],
    keywords: ['UHF laundry', 'heat-resistant tag', 'washable RFID', 'textile tracking'],
    seo_keywords: ['UHF laundry tag', 'washable RFID', 'textile tracking', 'heat-resistant RFID'],
    stock_status: 'InStock',
    rating: 4.4,
    review_count: 78,
    image: '/products/product-14.jpg'
  },
  
  // UHF Tags - Other UHF Tags
  {
    name: 'UHF Metal Tag',
    title: 'UHF RFID Metal Tag - 860-960MHz',
    description: 'General purpose UHF RFID metal tag for various industrial applications.',
    short_description: 'Versatile UHF metal tag',
    full_description: 'General purpose UHF RFID metal tag for various industrial applications. Features good read range and durability.',
    price: 0.75,
    price_range: '$0.60 - $0.90',
    frequency: '860-960 MHz',
    chip: 'Impinj M700',
    memory: '128 bits',
    read_range: '3-5 m',
    protocol: 'EPC Class 1 Gen 2',
    category: 'uhf-tags',
    sub_category: 'other-uhf-tags',
    badge: 'Versatile',
    moq: '100',
    delivery_time: '3-5 business days',
    specifications: {
      Frequency: '860-960 MHz',
      Protocol: 'EPC Class 1 Gen 2',
      Chip: 'Impinj M700',
      Memory: '128 bits',
      ReadRange: '3-5 m',
      Size: '85 x 35 x 8 mm',
      Material: 'ABS + Metal'
    },
    features: ['Good read range', 'Durable', 'Easy mounting', 'Cost-effective'],
    applications: ['Asset tracking', 'Inventory management', 'Warehouse', 'Industrial'],
    keywords: ['UHF tag', 'metal tag', 'asset tracking', 'inventory RFID'],
    seo_keywords: ['UHF metal tag', 'RFID asset tracking', 'inventory tag', 'warehouse RFID'],
    stock_status: 'InStock',
    rating: 4.5,
    review_count: 156,
    image: '/products/product-15.jpg'
  },
  
  // HF/NFC Tags - PPS HF Tags
  {
    name: 'PPS HF Tag',
    title: 'PPS HF RFID Tag - 13.56MHz',
    description: 'PPS plastic HF RFID tag for high-temperature environments up to 200°C.',
    short_description: 'High-temperature PPS tag',
    full_description: 'PPS plastic HF RFID tag for high-temperature environments up to 200°C. Ideal for industrial applications with extreme temperatures.',
    price: 0.85,
    price_range: '$0.70 - $1.00',
    frequency: '13.56 MHz',
    chip: 'NTAG216',
    memory: '888 bytes',
    read_range: '2-4 cm',
    protocol: 'ISO 14443A',
    category: 'hf-nfc-tags',
    sub_category: 'pps-hf-tags',
    badge: '200°C',
    moq: '100',
    delivery_time: '3-5 business days',
    specifications: {
      Frequency: '13.56 MHz',
      Protocol: 'ISO 14443A',
      Chip: 'NTAG216',
      Memory: '888 bytes',
      ReadRange: '2-4 cm',
      Size: '35 x 35 x 3 mm',
      Material: 'PPS Plastic'
    },
    features: ['Heat resistant', 'Chemical resistant', 'Durable', 'Compact'],
    applications: ['Automotive', 'Industrial', 'High-temp environments', 'Manufacturing'],
    keywords: ['HF tag', 'PPS tag', 'high-temperature RFID', 'heat-resistant'],
    seo_keywords: ['PPS HF tag', 'high-temperature RFID', 'heat-resistant tag', 'automotive RFID'],
    stock_status: 'InStock',
    rating: 4.6,
    review_count: 67,
    image: '/products/product-16.jpg'
  },
  
  // HF/NFC Tags - FPC HF Tags
  {
    name: 'FPC HF Tag',
    title: 'FPC Flexible HF RFID Tag - 13.56MHz',
    description: 'FPC flexible HF RFID tag for curved surfaces and embedded applications.',
    short_description: 'Flexible FPC tag',
    full_description: 'FPC flexible HF RFID tag for curved surfaces and embedded applications. Ultra-thin design for space-constrained applications.',
    price: 0.58,
    price_range: '$0.50 - $0.70',
    frequency: '13.56 MHz',
    chip: 'MIFARE DESFire EV1',
    memory: '2KB',
    read_range: '2-4 cm',
    protocol: 'ISO 14443A',
    category: 'hf-nfc-tags',
    sub_category: 'fpc-hf-tags',
    badge: 'Ultra-thin',
    moq: '100',
    delivery_time: '3-5 business days',
    specifications: {
      Frequency: '13.56 MHz',
      Protocol: 'ISO 14443A',
      Chip: 'MIFARE DESFire EV1',
      Memory: '2KB',
      ReadRange: '2-4 cm',
      Size: '30 x 15 x 0.3 mm',
      Material: 'FPC'
    },
    features: ['Ultra-thin', 'Flexible', 'Curved surface compatible', 'Embedded'],
    applications: ['Smart cards', 'Wearables', 'Embedded systems', 'Curved surfaces'],
    keywords: ['HF tag', 'FPC tag', 'flexible RFID', 'thin tag'],
    seo_keywords: ['FPC HF tag', 'flexible RFID tag', 'ultra-thin tag', 'curved surface tag'],
    stock_status: 'InStock',
    rating: 4.4,
    review_count: 54,
    image: '/products/product-17.jpg'
  },
  
  // HF/NFC Tags - Tamper-Evident Tags
  {
    name: 'Tamper-Evident Tag',
    title: 'Tamper-Evident HF RFID Tag - 13.56MHz',
    description: 'Tamper-evident HF RFID tag for anti-counterfeiting and security applications.',
    short_description: 'Security tamper-evident tag',
    full_description: 'Tamper-evident HF RFID tag for anti-counterfeiting and security applications. Tag becomes invalid if tampered with.',
    price: 0.72,
    price_range: '$0.60 - $0.85',
    frequency: '13.56 MHz',
    chip: 'NTAG213',
    memory: '144 bytes',
    read_range: '1-3 cm',
    protocol: 'ISO 14443A',
    category: 'hf-nfc-tags',
    sub_category: 'fragile-tags',
    badge: 'Security',
    moq: '100',
    delivery_time: '3-5 business days',
    specifications: {
      Frequency: '13.56 MHz',
      Protocol: 'ISO 14443A',
      Chip: 'NTAG213',
      Memory: '144 bytes',
      ReadRange: '1-3 cm',
      Size: '40 x 25 mm',
      Material: 'PVC + Tamper Layer'
    },
    features: ['Tamper detection', 'Anti-counterfeiting', 'Security', 'Void pattern'],
    applications: ['Brand protection', 'Security seals', 'Authenticity verification', 'Anti-counterfeit'],
    keywords: ['HF tag', 'tamper-evident', 'security RFID', 'anti-counterfeit'],
    seo_keywords: ['tamper-evident tag', 'security RFID', 'anti-counterfeit tag', 'brand protection'],
    stock_status: 'InStock',
    rating: 4.5,
    review_count: 89,
    image: '/products/product-18.jpg'
  },
  
  // RFID Cards - Special Shaped Cards
  {
    name: 'Keychain Card',
    title: 'RFID Keychain Card - 13.56MHz',
    description: 'Compact RFID keychain card for easy carrying and access control.',
    short_description: 'Portable RFID keychain',
    full_description: 'Compact RFID keychain card for easy carrying and access control. Durable design with keyring attachment.',
    price: 0.35,
    price_range: '$0.30 - $0.45',
    frequency: '13.56 MHz',
    chip: 'MIFARE Classic 1K',
    memory: '1KB',
    read_range: '2-5 cm',
    protocol: 'ISO 14443A',
    category: 'rfid-cards',
    sub_category: 'special-shape-cards',
    badge: 'Portable',
    moq: '100',
    delivery_time: '3-5 business days',
    specifications: {
      Frequency: '13.56 MHz',
      Protocol: 'ISO 14443A',
      Chip: 'MIFARE Classic 1K',
      Memory: '1KB',
      ReadRange: '2-5 cm',
      Size: '50 x 30 mm',
      Material: 'PVC'
    },
    features: ['Keychain design', 'Compact', 'Durable', 'Portable'],
    applications: ['Access control', 'Key management', 'Identification', 'Membership'],
    keywords: ['RFID keychain', 'key card', 'access control', 'portable RFID'],
    seo_keywords: ['RFID keychain card', 'key card RFID', 'portable RFID', 'access control key'],
    stock_status: 'InStock',
    rating: 4.3,
    review_count: 45,
    image: '/products/product-19.jpg'
  },
  
  // RFID Hardware - RFID Readers
  {
    name: 'UHF RFID Reader',
    title: 'UHF RFID Reader - 860-960MHz',
    description: 'High-performance UHF RFID reader for inventory management and asset tracking.',
    short_description: 'Professional UHF RFID reader',
    full_description: 'High-performance UHF RFID reader for inventory management and asset tracking. Supports RS232, TCP/IP, and USB interfaces.',
    price: 299.00,
    price_range: '$250 - $350',
    frequency: '860-960 MHz',
    chip: 'Impinj R2000',
    memory: '-',
    read_range: 'Up to 15 m',
    protocol: 'EPC Class 1 Gen 2',
    category: 'rfid-hardware',
    sub_category: 'rfid-readers',
    badge: 'Professional',
    moq: '1',
    delivery_time: '5-7 business days',
    specifications: {
      Frequency: '860-960 MHz',
      Protocol: 'EPC Class 1 Gen 2',
      Chipset: 'Impinj R2000',
      ReadRange: 'Up to 15 m',
      Interface: 'RS232, TCP/IP, USB',
      Power: '12V DC'
    },
    features: ['High performance', 'Multiple interfaces', 'Easy integration', 'SDK available'],
    applications: ['Warehouse', 'Retail', 'Asset tracking', 'Inventory management'],
    keywords: ['UHF reader', 'RFID reader', 'inventory reader', 'asset tracking reader'],
    seo_keywords: ['UHF RFID reader', 'RFID reader 860-960MHz', 'inventory RFID reader', 'professional RFID reader'],
    stock_status: 'InStock',
    rating: 4.8,
    review_count: 234,
    image: '/products/product-20.jpg'
  },
  
  // RFID Hardware - RFID Printers
  {
    name: 'RFID Label Printer',
    title: 'RFID Thermal Transfer Printer',
    description: 'RFID thermal transfer printer for on-demand tag and label printing.',
    short_description: 'Professional RFID printer',
    full_description: 'RFID thermal transfer printer for on-demand tag and label printing. Supports encoding and printing in one step.',
    price: 1499.00,
    price_range: '$1200 - $1800',
    frequency: '-',
    chip: 'Multiple',
    memory: '-',
    read_range: '-',
    protocol: 'EPC Class 1 Gen 2',
    category: 'rfid-hardware',
    sub_category: 'rfid-printers',
    badge: 'Professional',
    moq: '1',
    delivery_time: '5-7 business days',
    specifications: {
      PrintResolution: '203 dpi / 300 dpi',
      PrintWidth: '104 mm',
      RFIDEncoding: 'UHF/HF',
      Interface: 'USB, Ethernet, Wi-Fi',
      PrintSpeed: '152 mm/s'
    },
    features: ['Encode and print', 'High resolution', 'Easy operation', 'Multiple protocols'],
    applications: ['Label printing', 'Tag encoding', 'Inventory', 'Asset tracking'],
    keywords: ['RFID printer', 'thermal printer', 'label printer', 'RFID encoding'],
    seo_keywords: ['RFID thermal printer', 'RFID label printer', 'RFID encoding printer', 'on-demand printing'],
    stock_status: 'InStock',
    rating: 4.7,
    review_count: 178,
    image: '/products/product-21.jpg'
  },
  
  // RFID Hardware - RFID Antennas
  {
    name: 'UHF Circular Antenna',
    title: 'UHF RFID Circular Antenna - 860-960MHz',
    description: 'Circularly polarized UHF RFID antenna for multi-directional reading.',
    short_description: 'Circular polarized UHF antenna',
    full_description: 'Circularly polarized UHF RFID antenna for multi-directional reading. Ideal for item-level tracking and conveyor applications.',
    price: 189.00,
    price_range: '$150 - $220',
    frequency: '860-960 MHz',
    chip: '-',
    memory: '-',
    read_range: 'Up to 8 m',
    protocol: '-',
    category: 'rfid-hardware',
    sub_category: 'rfid-antennas',
    badge: 'High Gain',
    moq: '1',
    delivery_time: '5-7 business days',
    specifications: {
      Frequency: '860-960 MHz',
      Polarization: 'Circular',
      Gain: '8.5 dBi',
      VSWR: '< 1.5',
      Connector: 'SMA Female'
    },
    features: ['Circular polarization', 'High gain', 'Wide coverage', 'Durable'],
    applications: ['Conveyor', 'Item tracking', 'Inventory', 'Retail'],
    keywords: ['UHF antenna', 'RFID antenna', 'circular antenna', 'high-gain antenna'],
    seo_keywords: ['UHF RFID antenna', 'circular polarized antenna', 'RFID reader antenna', 'high-gain RFID'],
    stock_status: 'InStock',
    rating: 4.6,
    review_count: 145,
    image: '/products/product-22.jpg'
  },
  
  // RFID Keyfobs
  {
    name: 'RFID Keyfob',
    title: 'RFID Keyfob - 13.56MHz',
    description: 'Durable RFID keyfob for access control and identification.',
    short_description: 'Compact RFID keyfob',
    full_description: 'Durable RFID keyfob for access control and identification. Waterproof and shock-resistant design.',
    price: 0.45,
    price_range: '$0.40 - $0.55',
    frequency: '13.56 MHz',
    chip: 'MIFARE Classic 1K',
    memory: '1KB',
    read_range: '2-5 cm',
    protocol: 'ISO 14443A',
    category: 'others',
    sub_category: 'rfid-keyfobs',
    badge: 'Durable',
    moq: '100',
    delivery_time: '3-5 business days',
    specifications: {
      Frequency: '13.56 MHz',
      Protocol: 'ISO 14443A',
      Chip: 'MIFARE Classic 1K',
      Memory: '1KB',
      ReadRange: '2-5 cm',
      Size: '58 x 32 x 9 mm',
      Material: 'ABS'
    },
    features: ['Waterproof', 'Shock resistant', 'Durable', 'Portable'],
    applications: ['Access control', 'Key management', 'Identification', 'Membership'],
    keywords: ['RFID keyfob', 'key chain', 'access control', 'portable RFID'],
    seo_keywords: ['RFID keyfob', 'RFID key chain', 'access control keyfob', 'durable RFID'],
    stock_status: 'InStock',
    rating: 4.5,
    review_count: 234,
    image: '/products/product-23.jpg'
  },
  
  // RFID Wristbands - Paper
  {
    name: 'Paper NFC Wristband',
    title: 'Paper NFC Wristband - 13.56MHz',
    description: 'Disposable paper NFC wristband for short-term events and festivals.',
    short_description: 'Eco-friendly paper wristband',
    full_description: 'Disposable paper NFC wristband for short-term events and festivals. Eco-friendly and cost-effective solution.',
    price: 0.15,
    price_range: '$0.10 - $0.20',
    frequency: '13.56 MHz',
    chip: 'NTAG213',
    memory: '144 bytes',
    read_range: '1-3 cm',
    protocol: 'ISO 14443A',
    category: 'rfid-wristbands',
    sub_category: 'paper-wristbands',
    badge: 'Eco-friendly',
    moq: '500',
    delivery_time: '2-3 business days',
    specifications: {
      Frequency: '13.56 MHz',
      Protocol: 'ISO 14443A',
      Chip: 'NTAG213',
      Memory: '144 bytes',
      ReadRange: '1-3 cm',
      Size: '250 x 25 mm',
      Material: 'Paper'
    },
    features: ['Eco-friendly', 'Disposable', 'Printable', 'Cost-effective'],
    applications: ['Events', 'Festivals', 'Concerts', 'Short-term access'],
    keywords: ['NFC wristband', 'paper wristband', 'event wristband', 'disposable NFC'],
    seo_keywords: ['paper NFC wristband', 'eco-friendly wristband', 'event NFC band', 'festival wristband'],
    stock_status: 'InStock',
    rating: 4.3,
    review_count: 123,
    image: '/products/product-24.jpg'
  },
  
  // RFID Wristbands - Fabric
  {
    name: 'Fabric NFC Wristband',
    title: 'Fabric NFC Wristband - 13.56MHz',
    description: 'Comfortable fabric NFC wristband for multi-day events and conferences.',
    short_description: 'Soft fabric wristband',
    full_description: 'Comfortable fabric NFC wristband for multi-day events and conferences. Soft and breathable design for all-day wear.',
    price: 0.55,
    price_range: '$0.45 - $0.70',
    frequency: '13.56 MHz',
    chip: 'NTAG216',
    memory: '888 bytes',
    read_range: '2-4 cm',
    protocol: 'ISO 14443A',
    category: 'rfid-wristbands',
    sub_category: 'fabric-wristbands',
    badge: 'Comfortable',
    moq: '100',
    delivery_time: '3-5 business days',
    specifications: {
      Frequency: '13.56 MHz',
      Protocol: 'ISO 14443A',
      Chip: 'NTAG216',
      Memory: '888 bytes',
      ReadRange: '2-4 cm',
      Size: '260 x 25 mm',
      Material: 'Nylon + PVC'
    },
    features: ['Comfortable', 'Breathable', 'Adjustable', 'Washable'],
    applications: ['Conferences', 'Multi-day events', 'Festivals', 'Hotels'],
    keywords: ['NFC wristband', 'fabric wristband', 'soft wristband', 'conference band'],
    seo_keywords: ['fabric NFC wristband', 'soft wristband', 'conference wristband', 'multi-day NFC band'],
    stock_status: 'InStock',
    rating: 4.6,
    review_count: 167,
    image: '/products/product-25.jpg'
  },
  
  // RFID Wristbands - PVC
  {
    name: 'PVC RFID Wristband',
    title: 'PVC RFID Wristband - 13.56MHz',
    description: 'Durable PVC RFID wristband for various applications including water parks and pools.',
    short_description: 'Waterproof PVC wristband',
    full_description: 'Durable PVC RFID wristband for various applications including water parks and pools. Waterproof and long-lasting.',
    price: 0.38,
    price_range: '$0.30 - $0.50',
    frequency: '13.56 MHz',
    chip: 'MIFARE Classic 1K',
    memory: '1KB',
    read_range: '2-5 cm',
    protocol: 'ISO 14443A',
    category: 'rfid-wristbands',
    sub_category: 'pvc-wristbands',
    badge: 'Waterproof',
    moq: '100',
    delivery_time: '3-5 business days',
    specifications: {
      Frequency: '13.56 MHz',
      Protocol: 'ISO 14443A',
      Chip: 'MIFARE Classic 1K',
      Memory: '1KB',
      ReadRange: '2-5 cm',
      Size: '250 x 25 x 1.5 mm',
      Material: 'PVC'
    },
    features: ['Waterproof', 'Durable', 'Adjustable', 'Colorful'],
    applications: ['Water parks', 'Pools', 'Events', 'Access control'],
    keywords: ['RFID wristband', 'PVC wristband', 'waterproof band', 'pool wristband'],
    seo_keywords: ['PVC RFID wristband', 'waterproof wristband', 'pool RFID band', 'water park wristband'],
    stock_status: 'InStock',
    rating: 4.5,
    review_count: 189,
    image: '/products/product-26.jpg'
  }
];

async function addProducts() {
  console.log('Adding products to database...');
  
  let successCount = 0;
  let errorCount = 0;

  for (const product of productsToAdd) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          id: randomUUID(),
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
        console.error(`✗ Error adding ${product.name}:`, error.message);
        errorCount++;
      } else {
        console.log(`✓ Added: ${product.name} (${product.category}/${product.sub_category})`);
        successCount++;
      }
    } catch (error) {
      console.error(`✗ Error adding ${product.name}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`✓ Successfully added: ${successCount} products`);
  console.log(`✗ Failed to add: ${errorCount} products`);
  console.log('Finished!');
}

addProducts();
