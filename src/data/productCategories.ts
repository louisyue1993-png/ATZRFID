// Product Categories Structure for RFID Solutions
// 7 Main Categories with Subcategories for Easy Navigation

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  subCategories: SubCategory[];
  order: number;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
}

// 7 Main Categories with Subcategories
export const productCategories: ProductCategory[] = [
  {
    id: 'uhf-tags',
    name: 'UHF Tags',
    slug: 'uhf-tags',
    description: 'UHF RFID tags (860-960MHz) for long-range applications and inventory management',
    icon: '📡',
    order: 1,
    subCategories: [
      {
        id: 'adhesive-labels',
        name: 'Adhesive Labels',
        slug: 'adhesive-labels',
        description: 'Standard UHF RFID adhesive labels for general applications',
        order: 1,
      },
      {
        id: 'flexible-anti-metal',
        name: 'Flexible Anti-Metal Tags',
        slug: 'flexible-anti-metal',
        description: 'Flexible UHF RFID anti-metal tags for metal surface applications',
        order: 2,
      },
      {
        id: 'abs-anti-metal',
        name: 'ABS Anti-Metal Tags',
        slug: 'abs-anti-metal',
        description: 'ABS plastic UHF RFID anti-metal tags for industrial use',
        order: 3,
      },
      {
        id: 'pcb-anti-metal',
        name: 'PCB Anti-Metal Tags',
        slug: 'pcb-anti-metal',
        description: 'PCB UHF RFID anti-metal tags for high-performance applications',
        order: 4,
      },
      {
        id: 'laundry-tags',
        name: 'Laundry Tags',
        slug: 'laundry-tags',
        description: 'UHF RFID laundry tags for textile and garment tracking',
        order: 5,
      },
      {
        id: 'other-uhf-tags',
        name: 'Other UHF Tags',
        slug: 'other-uhf-tags',
        description: 'Other specialized UHF RFID tags for unique applications',
        order: 6,
      },
    ],
  },
  {
    id: 'hf-nfc-tags',
    name: 'HF/NFC Tags',
    slug: 'hf-nfc-tags',
    description: 'High frequency (13.56MHz) and NFC tags for payment, access control, and data transfer',
    icon: '📱',
    order: 2,
    subCategories: [
      {
        id: 'abs-hf-tags',
        name: 'ABS HF Tags',
        slug: 'abs-hf-tags',
        description: 'ABS plastic HF/NFC RFID tags for durable applications',
        order: 1,
      },
      {
        id: 'pcb-hf-tags',
        name: 'PCB HF Tags',
        slug: 'pcb-hf-tags',
        description: 'PCB HF/NFC RFID tags for embedded applications',
        order: 2,
      },
      {
        id: 'pps-hf-tags',
        name: 'PPS HF Tags',
        slug: 'pps-hf-tags',
        description: 'PPS plastic HF/NFC RFID tags for high-temperature environments',
        order: 3,
      },
      {
        id: 'fpc-hf-tags',
        name: 'FPC HF Tags',
        slug: 'fpc-hf-tags',
        description: 'FPC flexible HF/NFC RFID tags for curved surfaces',
        order: 4,
      },
      {
        id: 'fragile-tags',
        name: 'Tamper-Evident Tags',
        slug: 'fragile-tags',
        description: 'Tamper-evident HF/NFC RFID tags for anti-counterfeiting',
        order: 5,
      },
      {
        id: 'other-hf-tags',
        name: 'Other HF Tags',
        slug: 'other-hf-tags',
        description: 'Other specialized HF/NFC RFID tags',
        order: 6,
      },
    ],
  },
  {
    id: 'industry-segments',
    name: 'Industry Segments RFID Tags+',
    slug: 'industry-segments',
    description: 'Specialized RFID tags for specific industry applications',
    icon: '🏭',
    order: 3,
    subCategories: [
      {
        id: 'apparel-tags',
        name: 'RFID Tags For Apparel',
        slug: 'apparel-tags',
        description: 'RFID tags for clothing and garment tracking',
        order: 1,
      },
      {
        id: 'asset-tags',
        name: 'RFID Tags For Assets',
        slug: 'asset-tags',
        description: 'RFID tags for asset management and tracking',
        order: 2,
      },
      {
        id: 'warehouse-tags',
        name: 'RFID Tags For Warehouse',
        slug: 'warehouse-tags',
        description: 'RFID tags for warehouse and logistics management',
        order: 3,
      },
      {
        id: 'laundry-tags-industry',
        name: 'RFID Tags For Laundry',
        slug: 'laundry-tags-industry',
        description: 'RFID tags for commercial laundry and textile management',
        order: 4,
      },
      {
        id: 'book-tags',
        name: 'RFID Tags For Books',
        slug: 'book-tags',
        description: 'RFID tags for library and book management',
        order: 5,
      },
      {
        id: 'patrol-tags',
        name: 'RFID Tags For Patrol',
        slug: 'patrol-tags',
        description: 'RFID tags for security patrol and inspection',
        order: 6,
      },
      {
        id: 'animal-tags',
        name: 'RFID Tags For Animals',
        slug: 'animal-tags',
        description: 'RFID tags for animal identification and tracking',
        order: 7,
      },
      {
        id: 'jewelry-tags',
        name: 'RFID Tags For Jewelry',
        slug: 'jewelry-tags',
        description: 'Small RFID tags for jewelry and precious item tracking',
        order: 8,
      },
    ],
  },
  {
    id: 'rfid-wristbands',
    name: 'RFID Wristbands',
    slug: 'rfid-wristbands',
    description: 'RFID wristbands for events, healthcare, and access control',
    icon: '⌚',
    order: 4,
    subCategories: [
      {
        id: 'paper-wristbands',
        name: 'Paper NFC Wristbands',
        slug: 'paper-wristbands',
        description: 'Disposable paper NFC wristbands for short-term events',
        order: 1,
      },
      {
        id: 'fabric-wristbands',
        name: 'Fabric NFC Wristbands',
        slug: 'fabric-wristbands',
        description: 'Comfortable fabric NFC wristbands for multi-day events',
        order: 2,
      },
      {
        id: 'silicone-wristbands',
        name: 'Silicone NFC Wristbands',
        slug: 'silicone-wristbands',
        description: 'Durable silicone NFC wristbands for long-term use',
        order: 3,
      },
      {
        id: 'pvc-wristbands',
        name: 'RFID PVC Wristbands',
        slug: 'pvc-wristbands',
        description: 'PVC RFID wristbands for various applications',
        order: 4,
      },
    ],
  },
  {
    id: 'rfid-cards',
    name: 'RFID Cards',
    slug: 'rfid-cards',
    description: 'RFID cards for access control, identification, and payment',
    icon: '💳',
    order: 5,
    subCategories: [
      {
        id: 'standard-cards',
        name: 'Standard CR80 Cards',
        slug: 'standard-cards',
        description: 'ISO standard size RFID cards (85.5 x 54 x 0.84mm)',
        order: 1,
      },
      {
        id: 'special-shape-cards',
        name: 'Custom Shaped Cards',
        slug: 'special-shape-cards',
        description: 'Custom shaped RFID cards for unique applications',
        order: 2,
      },
    ],
  },
  {
    id: 'rfid-hardware',
    name: 'RFID Hardware',
    slug: 'rfid-hardware',
    description: 'RFID readers, printers, and antennas for complete RFID solutions',
    icon: '🔧',
    order: 6,
    subCategories: [
      {
        id: 'rfid-readers',
        name: 'RFID Readers',
        slug: 'rfid-readers',
        description: 'RFID readers for various frequencies and applications',
        order: 1,
      },
      {
        id: 'rfid-printers',
        name: 'RFID Printers',
        slug: 'rfid-printers',
        description: 'RFID printers for on-demand tag and card printing',
        order: 2,
      },
      {
        id: 'rfid-antennas',
        name: 'RFID Reader Antennas',
        slug: 'rfid-antennas',
        description: 'RFID antennas for readers and custom installations',
        order: 3,
      },
    ],
  },
  {
    id: 'others',
    name: 'Others',
    slug: 'others',
    description: 'Other RFID products and accessories',
    icon: '📦',
    order: 7,
    subCategories: [
      {
        id: 'rfid-keyfobs',
        name: 'RFID Keyfobs',
        slug: 'rfid-keyfobs',
        description: 'RFID keychains and key fobs for access control',
        order: 1,
      },
      {
        id: 'rfid-discs',
        name: 'RFID Discs',
        slug: 'rfid-discs',
        description: 'Small RFID disc tags for various applications',
        order: 2,
      },
      {
        id: 'rfid-buttons',
        name: 'RFID Buttons',
        slug: 'rfid-buttons',
        description: 'Button-shaped RFID tags for garment and textile tagging',
        order: 3,
      },
      {
        id: 'rfid-locks',
        name: 'RFID Locks',
        slug: 'rfid-locks',
        description: 'RFID electronic locks for secure access control',
        order: 4,
      },
      {
        id: 'rfid-cables',
        name: 'RFID Cables',
        slug: 'rfid-cables',
        description: 'RFID cables and connectors for reader installations',
        order: 5,
      },
    ],
  },
];

// Helper functions
export function getCategoryBySlug(slug: string): ProductCategory | undefined {
  return productCategories.find(cat => cat.slug === slug);
}

export function getSubCategoryBySlug(categorySlug: string, subCategorySlug: string): SubCategory | undefined {
  const category = getCategoryBySlug(categorySlug);
  return category?.subCategories.find(sub => sub.slug === subCategorySlug);
}

export function getAllSubCategories(): (SubCategory & { categoryId: string; categoryName: string })[] {
  const allSubCategories: (SubCategory & { categoryId: string; categoryName: string })[] = [];
  productCategories.forEach(category => {
    category.subCategories.forEach(sub => {
      allSubCategories.push({
        ...sub,
        categoryId: category.id,
        categoryName: category.name,
      });
    });
  });
  return allSubCategories.sort((a, b) => a.order - b.order);
}
