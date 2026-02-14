-- 博客表极速修复脚本
-- 只添加必需的列，不重建表

-- ============================================
-- 步骤1: 检查并添加 published 列（最关键）
-- ============================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'blog_posts'
        AND column_name = 'published'
    ) THEN
        ALTER TABLE blog_posts ADD COLUMN published BOOLEAN NOT NULL DEFAULT false;
        RAISE NOTICE 'Added published column';
    ELSE
        RAISE NOTICE 'published column already exists';
    END IF;
END $$;

-- ============================================
-- 步骤2: 检查并添加其他必需的列
-- ============================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'blog_posts'
        AND column_name = 'read_time'
    ) THEN
        ALTER TABLE blog_posts ADD COLUMN read_time TEXT NOT NULL DEFAULT '5 min read';
        RAISE NOTICE 'Added read_time column';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'blog_posts'
        AND column_name = 'image'
    ) THEN
        ALTER TABLE blog_posts ADD COLUMN image TEXT NOT NULL DEFAULT '/blog/blog-1.jpg';
        RAISE NOTICE 'Added image column';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'blog_posts'
        AND column_name = 'language'
    ) THEN
        ALTER TABLE blog_posts ADD COLUMN language TEXT NOT NULL DEFAULT 'en';
        RAISE NOTICE 'Added language column';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'blog_posts'
        AND column_name = 'tags'
    ) THEN
        -- 检查列的类型，如果不存在则添加
        ALTER TABLE blog_posts ADD COLUMN tags TEXT[] NOT NULL DEFAULT '{}';
        RAISE NOTICE 'Added tags column';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'blog_posts'
        AND column_name = 'seo_keywords'
    ) THEN
        ALTER TABLE blog_posts ADD COLUMN seo_keywords TEXT[] NOT NULL DEFAULT '{}';
        RAISE NOTICE 'Added seo_keywords column';
    END IF;
END $$;

-- ============================================
-- 步骤3: 插入测试数据（使用基本列）
-- ============================================

-- 先删除可能存在的测试数据
DELETE FROM blog_posts WHERE slug = 'welcome-to-atz-rfid';

-- 插入测试数据（只使用基本列）
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
  'Welcome to ATZ RFID',
  'Your trusted RFID partner',
  'Welcome to ATZ RFID! We provide high-quality RFID products and solutions.',
  'Company News',
  'ATZ Team',
  true
);

-- ============================================
-- 步骤4: 更新可选字段（如果列存在）
-- ============================================

-- 更新 read_time
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'blog_posts'
        AND column_name = 'read_time'
    ) THEN
        UPDATE blog_posts SET read_time = '5 min read' WHERE slug = 'welcome-to-atz-rfid';
        RAISE NOTICE 'Updated read_time';
    END IF;
END $$;

-- 更新 image
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'blog_posts'
        AND column_name = 'image'
    ) THEN
        UPDATE blog_posts SET image = '/blog/blog-1.jpg' WHERE slug = 'welcome-to-atz-rfid';
        RAISE NOTICE 'Updated image';
    END IF;
END $$;

-- 更新 language
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'blog_posts'
        AND column_name = 'language'
    ) THEN
        UPDATE blog_posts SET language = 'en' WHERE slug = 'welcome-to-atz-rfid';
        RAISE NOTICE 'Updated language';
    END IF;
END $$;

-- 更新 tags（使用 TEXT[] 类型）
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'blog_posts'
        AND column_name = 'tags'
    ) THEN
        UPDATE blog_posts SET tags = ARRAY['RFID', 'Company', 'News'] WHERE slug = 'welcome-to-atz-rfid';
        RAISE NOTICE 'Updated tags';
    END IF;
END $$;

-- 更新 seo_keywords（使用 TEXT[] 类型）
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'blog_posts'
        AND column_name = 'seo_keywords'
    ) THEN
        UPDATE blog_posts SET seo_keywords = ARRAY['ATZ RFID', 'RFID solutions'] WHERE slug = 'welcome-to-atz-rfid';
        RAISE NOTICE 'Updated seo_keywords';
    END IF;
END $$;

-- ============================================
-- 步骤5: 验证
-- ============================================

-- 显示当前列
SELECT
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'blog_posts'
ORDER BY ordinal_position;

-- 显示数据
SELECT
  id,
  slug,
  title,
  category,
  published
FROM blog_posts
WHERE slug = 'welcome-to-atz-rfid';

-- 完成提示
DO $$
BEGIN
    RAISE NOTICE 'Complete! Table structure and test data ready';
END $$;
