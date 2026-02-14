-- 博客文章初始化脚本（最小化版本）
-- 只使用最基本的列，避免依赖不存在的列

-- ============================================
-- 步骤1: 检查并添加缺失的列
-- ============================================

-- 检查并添加 read_time 列
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'blog_posts'
        AND column_name = 'read_time'
    ) THEN
        ALTER TABLE blog_posts ADD COLUMN read_time TEXT NOT NULL DEFAULT '5 min read';
    END IF;
END $$;

-- 检查并添加 image 列
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'blog_posts'
        AND column_name = 'image'
    ) THEN
        ALTER TABLE blog_posts ADD COLUMN image TEXT NOT NULL DEFAULT '/blog/blog-1.jpg';
    END IF;
END $$;

-- 检查并添加 language 列
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'blog_posts'
        AND column_name = 'language'
    ) THEN
        ALTER TABLE blog_posts ADD COLUMN language TEXT NOT NULL DEFAULT 'en';
    END IF;
END $$;

-- 检查并添加 tags 列
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'blog_posts'
        AND column_name = 'tags'
    ) THEN
        ALTER TABLE blog_posts ADD COLUMN tags JSONB NOT NULL DEFAULT '[]';
    END IF;
END $$;

-- 检查并添加 seo_keywords 列
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'blog_posts'
        AND column_name = 'seo_keywords'
    ) THEN
        ALTER TABLE blog_posts ADD COLUMN seo_keywords JSONB NOT NULL DEFAULT '[]';
    END IF;
END $$;

-- ============================================
-- 步骤2: 插入测试博客文章
-- ============================================

-- 先删除可能存在的测试数据
DELETE FROM blog_posts WHERE slug = 'welcome-to-atz-rfid';

-- 插入测试博客（使用基本列）
INSERT INTO blog_posts (
  slug,
  title,
  excerpt,
  content,
  category,
  author,
  published
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
  true
);

-- ============================================
-- 步骤3: 更新可选字段（如果列存在）
-- ============================================

-- 更新 read_time（如果列存在）
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'blog_posts'
        AND column_name = 'read_time'
    ) THEN
        UPDATE blog_posts SET read_time = '5 min read' WHERE slug = 'welcome-to-atz-rfid';
    END IF;
END $$;

-- 更新 image（如果列存在）
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'blog_posts'
        AND column_name = 'image'
    ) THEN
        UPDATE blog_posts SET image = '/blog/blog-1.jpg' WHERE slug = 'welcome-to-atz-rfid';
    END IF;
END $$;

-- 更新 language（如果列存在）
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'blog_posts'
        AND column_name = 'language'
    ) THEN
        UPDATE blog_posts SET language = 'en' WHERE slug = 'welcome-to-atz-rfid';
    END IF;
END $$;

-- 更新 tags（如果列存在）
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'blog_posts'
        AND column_name = 'tags'
    ) THEN
        UPDATE blog_posts SET tags = '["RFID", "Company", "News"]'::jsonb WHERE slug = 'welcome-to-atz-rfid';
    END IF;
END $$;

-- 更新 seo_keywords（如果列存在）
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'blog_posts'
        AND column_name = 'seo_keywords'
    ) THEN
        UPDATE blog_posts SET seo_keywords = '["ATZ RFID", "RFID solutions", "RFID products"]'::jsonb WHERE slug = 'welcome-to-atz-rfid';
    END IF;
END $$;

-- ============================================
-- 步骤4: 验证
-- ============================================

-- 显示插入的博客文章
SELECT
  id,
  slug,
  title,
  category,
  published,
  created_at
FROM blog_posts
WHERE slug = 'welcome-to-atz-rfid';

-- 显示总数量
SELECT
  COUNT(*) AS total_blogs,
  SUM(CASE WHEN published = true THEN 1 ELSE 0 END) AS published_blogs
FROM blog_posts;
