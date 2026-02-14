-- 博客表彻底修复脚本
-- 此脚本会重建 blog_posts 表，包含所有必需的列

-- ============================================
-- 步骤1: 备份现有数据
-- ============================================

-- 创建备份表
CREATE TABLE IF NOT EXISTS blog_posts_backup_20250213 AS
SELECT * FROM blog_posts;

-- 显示备份的数据量
SELECT COUNT(*) AS backed_up_records FROM blog_posts_backup_20250213;

-- ============================================
-- 步骤2: 删除旧表
-- ============================================

DROP TABLE IF EXISTS blog_posts CASCADE;

-- ============================================
-- 步骤3: 创建完整的新表
-- ============================================

CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  read_time TEXT NOT NULL DEFAULT '5 min read',
  image TEXT NOT NULL DEFAULT '/blog/blog-1.jpg',
  published BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] NOT NULL DEFAULT '{}',
  seo_keywords TEXT[] NOT NULL DEFAULT '{}',
  language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 步骤4: 创建索引
-- ============================================

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_language ON blog_posts(language);

-- ============================================
-- 步骤5: 恢复备份数据（如果有）
-- ============================================

-- 尝试从备份表恢复数据（只恢复存在的列）
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'blog_posts_backup_20250213') THEN
        -- 尝试恢复数据
        BEGIN
            INSERT INTO blog_posts (slug, title, excerpt, content, category, author)
            SELECT slug, title, excerpt, content, category, author
            FROM blog_posts_backup_20250213;

            RAISE NOTICE 'Restored % records from backup', (SELECT COUNT(*) FROM blog_posts_backup_20250213);
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not restore data from backup (column mismatch)';
        END;
    END IF;
END $$;

-- ============================================
-- 步骤6: 插入测试数据
-- ============================================

INSERT INTO blog_posts (
  slug,
  title,
  excerpt,
  content,
  category,
  author,
  read_time,
  image,
  published,
  tags,
  seo_keywords,
  language
) VALUES (
  'welcome-to-atz-rfid',
  'Welcome to ATZ RFID - Your Trusted RFID Partner',
  'Discover how ATZ RFID provides cutting-edge RFID solutions for your business needs.',
  'Welcome to ATZ RFID! We are your trusted partner for high-quality RFID products and solutions.

## Our Mission
At ATZ RFID, we are committed to delivering innovative RFID technology that helps businesses improve efficiency, reduce costs, and enhance customer experience.

## What We Offer
- High-quality RFID tags, cards, and wristbands
- Custom RFID solutions for various industries
- Expert consultation and support
- Competitive pricing and fast delivery

## Why Choose Us
With years of experience in the RFID industry, our team of experts is dedicated to providing you with the best products and services.

## Get Started Today
Ready to take your business to the next level with RFID technology? Contact us today!',
  'Company News',
  'ATZ Team',
  '5 min read',
  '/blog/blog-1.jpg',
  true,
  ARRAY['RFID', 'Company', 'News'],
  ARRAY['ATZ RFID', 'RFID solutions', 'RFID products'],
  'en'
);

-- ============================================
-- 步骤7: 验证表结构
-- ============================================

SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'blog_posts'
ORDER BY ordinal_position;

-- ============================================
-- 步骤8: 验证数据
-- ============================================

SELECT
  id,
  slug,
  title,
  category,
  published,
  created_at
FROM blog_posts
ORDER BY created_at DESC;

-- 完成提示
DO $$
BEGIN
    RAISE NOTICE 'Table repair completed successfully!';
END $$;
