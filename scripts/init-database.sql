-- 后台管理系统数据库初始化脚本
-- 在 Supabase SQL Editor 中运行此脚本

-- ============================================
-- Products 表
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT,
  description TEXT,
  shortDescription TEXT,
  fullDescription TEXT,
  price TEXT,
  priceRange TEXT,
  frequency TEXT,
  chip TEXT,
  memory TEXT,
  readRange TEXT,
  protocol TEXT,
  category TEXT,
  subCategory TEXT,
  badge TEXT,
  moq TEXT,
  deliveryTime TEXT,
  specifications JSONB DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  applications TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',
  seoKeywords TEXT[] DEFAULT '{}',
  stockStatus TEXT DEFAULT 'InStock',
  rating NUMERIC DEFAULT 0,
  reviewCount INTEGER DEFAULT 0,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subCategory);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_name_search ON products USING gin(to_tsvector('english', name));

-- ============================================
-- Blog Posts 表
-- ============================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  author TEXT DEFAULT 'ATZ RFID Team',
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  coverImage TEXT,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);

-- ============================================
-- 自动更新 updated_at 触发器
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Products 表触发器
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Blog Posts 表触发器
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Row Level Security (RLS) 策略
-- ============================================

-- 启用 RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Products 表策略
-- 允许所有人读取产品
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- 允许管理员通过 API 创建产品
CREATE POLICY "Admins can create products"
  ON products FOR INSERT
  WITH CHECK (true);

-- 允许管理员通过 API 更新产品
CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  USING (true);

-- 允许管理员通过 API 删除产品
CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  USING (true);

-- Blog Posts 表策略
-- 允许所有人阅读已发布的博客
CREATE POLICY "Published blog posts are viewable by everyone"
  ON blog_posts FOR SELECT
  USING (published = true);

-- 允许管理员阅读所有博客（包括草稿）
CREATE POLICY "Admins can view all blog posts"
  ON blog_posts FOR SELECT
  USING (true);

-- 允许管理员通过 API 创建博客
CREATE POLICY "Admins can create blog posts"
  ON blog_posts FOR INSERT
  WITH CHECK (true);

-- 允许管理员通过 API 更新博客
CREATE POLICY "Admins can update blog posts"
  ON blog_posts FOR UPDATE
  USING (true);

-- 允许管理员通过 API 删除博客
CREATE POLICY "Admins can delete blog posts"
  ON blog_posts FOR DELETE
  USING (true);

-- ============================================
-- 验证表是否创建成功
-- ============================================
SELECT
  'products' as table_name,
  COUNT(*) as record_count
FROM products
UNION ALL
SELECT
  'blog_posts' as table_name,
  COUNT(*) as record_count
FROM blog_posts;

-- ============================================
-- 完成
-- ============================================
-- 执行此脚本后，数据库表就初始化完成了
-- 您可以使用后台管理系统开始管理产品和博客
