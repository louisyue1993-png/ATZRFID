/**
 * Category Name to Slug Mapping
 * Maps human-readable category names (display names) to their URL-friendly slug format
 * This allows the API to accept both formats for better UX and backward compatibility
 */

export interface CategoryMapping {
  // Display name (human-readable) → Slug (URL-friendly)
  [key: string]: string;
}

/**
 * Primary category mapping: Display Name → Slug
 */
export const categoryMapping: CategoryMapping = {
  // UHF Tags
  'UHF Tags': 'uhf-tags',
  'UHF RFID Tags': 'uhf-tags',
  'Ultra High Frequency Tags': 'uhf-tags',

  // HF/NFC Tags
  'HF/NFC Tags': 'hf-nfc-tags',
  'HF Tags': 'hf-nfc-tags',
  'NFC Tags': 'hf-nfc-tags',
  'High Frequency Tags': 'hf-nfc-tags',
  'High Frequency/NFC Tags': 'hf-nfc-tags',
  'RFID Tags': 'hf-nfc-tags',

  // Industry Segments
  'Industry Segments RFID Tags+': 'industry-segments',
  'Industry Segments': 'industry-segments',
  'Industry RFID Tags': 'industry-segments',
  'Specialized RFID Tags': 'industry-segments',

  // RFID Wristbands
  'RFID Wristbands': 'rfid-wristbands',
  'Wristbands': 'rfid-wristbands',
  'RFID Bands': 'rfid-wristbands',

  // NFC Products
  'NFC Products': 'nfc-tags',
  'NFC Stickers': 'nfc-tags',
  'NFC Cards': 'nfc-tags',

  // HF Cards
  'HF Cards': 'hf-cards',
  'High Frequency Cards': 'hf-cards',
  'MIFARE Cards': 'hf-cards',

  // Others
  'Others': 'others',
  'Other Products': 'others',
  'Accessories': 'others',
};

/**
 * Subcategory mapping: Display Name → Slug
 */
export const subCategoryMapping: CategoryMapping = {
  // UHF Tags Subcategories
  'Adhesive Labels': 'adhesive-labels',
  'Adhesive': 'adhesive-labels',
  'Flexible Anti-Metal Tags': 'flexible-anti-metal',
  'Flexible Anti-Metal': 'flexible-anti-metal',
  'ABS Anti-Metal Tags': 'abs-anti-metal',
  'ABS Anti-Metal': 'abs-anti-metal',
  'PCB Anti-Metal Tags': 'pcb-anti-metal',
  'PCB Anti-Metal': 'pcb-anti-metal',
  'Laundry Tags': 'laundry-tags',
  'Other UHF Tags': 'other-uhf-tags',

  // HF/NFC Tags Subcategories
  'ABS HF Tags': 'abs-hf-tags',
  'PCB HF Tags': 'pcb-hf-tags',
  'PPS HF Tags': 'pps-hf-tags',
  'FPC HF Tags': 'fpc-hf-tags',
  'Tamper-Evident Tags': 'fragile-tags',
  'Fragile Tags': 'fragile-tags',
  'Other HF Tags': 'other-hf-tags',

  // Industry Segments Subcategories
  'RFID Tags For Apparel': 'apparel-tags',
  'Apparel Tags': 'apparel-tags',
  'RFID Tags For Assets': 'asset-tags',
  'Asset Tags': 'asset-tags',
  'RFID Tags For Warehouse': 'warehouse-tags',
  'Warehouse Tags': 'warehouse-tags',
  'RFID Tags For Laundry': 'laundry-tags-industry',
  'Laundry Tags Industry': 'laundry-tags-industry',
  'RFID Tags For Books': 'book-tags',
  'Book Tags': 'book-tags',
  'RFID Tags For Patrol': 'patrol-tags',
  'Patrol Tags': 'patrol-tags',
  'RFID Tags For Animals': 'animal-tags',
  'Animal Tags': 'animal-tags',
  'RFID Tags For Jewelry': 'jewelry-tags',
  'Jewelry Tags': 'jewelry-tags',

  // RFID Wristbands Subcategories
  'PVC Wristbands': 'pvc-wristbands',
  'Fabric Wristbands': 'fabric-wristbands',
  'Paper Wristbands': 'paper-wristbands',
  'Silicone Wristbands': 'silicone-wristbands',
  'Tyvek Wristbands': 'tyvek-wristbands',
  'Other Wristbands': 'other-wristbands',

  // NFC Products Subcategories
  'Sticker': 'sticker',
  'NFC Stickers': 'sticker',
  'NFC Card': 'nfc-card',
  'NFC Cards': 'nfc-card',
  'Smart Card': 'smart-card',
  'Keychain': 'keychain',
  'NFC Keychain': 'keychain',
  'Other NFC': 'other-nfc',

  // HF Cards Subcategories
  'MIFARE Classic': 'mifare-classic',
  'MIFARE DESFire': 'mifare-desfire',
  'MIFARE Ultralight': 'mifare-ultralight',
  'Standard HF Card': 'standard-hf-card',
  'Custom HF Card': 'custom-hf-card',
  'Other HF Cards': 'other-hf-cards',

  // Others Subcategories
  'RFID Keyfobs': 'rfid-keyfobs',
  'Keyfobs': 'rfid-keyfobs',
  'Access Control': 'access-control',
  'Accessories': 'accessories',
  'Others': 'others',
};

/**
 * Normalize category name to slug
 * Converts display name to slug if a mapping exists
 * @param category - Category name or slug
 * @returns Normalized slug
 */
export function normalizeCategory(category: string | null | undefined): string {
  if (!category || category === 'all' || category === '') {
    return '';
  }

  const trimmedCategory = category.trim();
  
  // If it's already a slug (contains hyphens and is all lowercase), return as-is
  if (trimmedCategory.includes('-') && trimmedCategory === trimmedCategory.toLowerCase()) {
    return trimmedCategory;
  }

  // Try to find a mapping
  const normalized = categoryMapping[trimmedCategory];
  if (normalized) {
    console.log(`[CategoryMapping] Mapped category "${trimmedCategory}" → "${normalized}"`);
    return normalized;
  }

  // If no mapping found, try kebab-case conversion
  const kebabCase = trimmedCategory
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
  
  console.log(`[CategoryMapping] Converted to kebab-case: "${trimmedCategory}" → "${kebabCase}"`);
  return kebabCase;
}

/**
 * Normalize subcategory name to slug
 * Converts display name to slug if a mapping exists
 * @param subcategory - Subcategory name or slug
 * @returns Normalized slug
 */
export function normalizeSubCategory(subcategory: string | null | undefined): string {
  console.log(`[CategoryMapping] normalizeSubCategory called with: "${subcategory}"`);
  
  if (!subcategory || subcategory === 'all' || subcategory === '') {
    console.log('[CategoryMapping] Returning empty string (null/all/empty)');
    return '';
  }

  const trimmedSubCategory = subcategory.trim();
  console.log(`[CategoryMapping] Trimmed value: "${trimmedSubCategory}"`);
  
  // If it's already a slug (contains hyphens and is all lowercase), return as-is
  // Check if it looks like a slug: has hyphens and is mostly lowercase
  if (trimmedSubCategory.includes('-') && trimmedSubCategory === trimmedSubCategory.toLowerCase()) {
    console.log(`[CategoryMapping] Already a slug, returning: "${trimmedSubCategory}"`);
    return trimmedSubCategory;
  }

  // Try to find a mapping
  const normalized = subCategoryMapping[trimmedSubCategory];
  console.log(`[CategoryMapping] Looking for mapping of "${trimmedSubCategory}", found: "${normalized}"`);
  
  if (normalized) {
    console.log(`[CategoryMapping] Mapped subcategory "${trimmedSubCategory}" → "${normalized}"`);
    return normalized;
  }

  // If no mapping found, try kebab-case conversion
  const kebabCase = trimmedSubCategory
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
  
  console.log(`[CategoryMapping] Converted to kebab-case: "${trimmedSubCategory}" → "${kebabCase}"`);
  return kebabCase;
}
