-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  category TEXT,
  price NUMERIC,
  image TEXT,
  description TEXT,
  shortDescription TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  specifications JSONB DEFAULT '{}'::jsonb,
  applications TEXT[] DEFAULT ARRAY[]::TEXT[],
  seoTitle TEXT,
  seoDescription TEXT,
  seoKeywords TEXT[] DEFAULT ARRAY[]::TEXT[],
  isPublished BOOLEAN DEFAULT TRUE,
  sortOrder INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  content TEXT,
  excerpt TEXT,
  featuredImage TEXT,
  author TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  category TEXT,
  isPublished BOOLEAN DEFAULT TRUE,
  seoTitle TEXT,
  seoDescription TEXT,
  seoKeywords TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Page Contents Table
CREATE TABLE IF NOT EXISTS page_contents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pageName TEXT UNIQUE NOT NULL,
  language TEXT DEFAULT 'en',
  title TEXT,
  content TEXT,
  metaTitle TEXT,
  metaDescription TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_page_contents_page_name ON page_contents(pageName);

-- Insert sample product data
INSERT INTO products (name, slug, category, price, image, description, shortDescription, features, specifications, applications, seoKeywords) VALUES
  ('UHF RFID Tag', 'uhf-rfid-tag', 'uhf-tags', 0.15, '/images/uhf-tag.jpg', 'High-performance UHF RFID tag for inventory management', 'UHF RFID tag for inventory tracking', 
   ARRAY['Long read range', 'High durability', 'Easy installation'], 
   '{"Frequency": "860-960 MHz", "Protocol": "ISO 18000-6C", "Chip": "Impinj M700"}'::jsonb,
   ARRAY['Inventory management', 'Asset tracking', 'Retail'],
   ARRAY['UHF RFID', 'RFID tag', 'inventory tracking', 'asset management']),
  
  ('HF RFID Card', 'hf-rfid-card', 'hf-cards', 0.25, '/images/hf-card.jpg', 'Premium HF RFID card for access control', 'HF RFID card for access control',
   ARRAY['High security', 'Durable', 'Custom printing'],
   '{"Frequency": "13.56 MHz", "Protocol": "ISO 14443A", "Chip": "MIFARE DESFire"}'::jsonb,
   ARRAY['Access control', 'Payment systems', 'Identity cards'],
   ARRAY['HF RFID', 'RFID card', 'access control', 'MIFARE']),
  
  ('NFC Sticker', 'nfc-sticker', 'nfc-tags', 0.10, '/images/nfc-sticker.jpg', 'Compact NFC sticker for mobile interaction', 'NFC sticker for mobile apps',
   ARRAY['Compact size', 'Easy to apply', 'Mobile compatible'],
   '{"Frequency": "13.56 MHz", "Protocol": "ISO 14443A", "Chip": "NTAG213"}'::jsonb,
   ARRAY['Mobile payments', 'Smart packaging', 'Marketing'],
   ARRAY['NFC', 'NFC sticker', 'mobile tag', 'smart packaging']);
