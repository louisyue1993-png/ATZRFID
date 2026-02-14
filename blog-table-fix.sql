-- 博客表结构修复脚本
-- 这个脚本会检查 blog_posts 表的所有列，并添加缺失的列

-- ============================================
-- 步骤1: 检查并添加所有缺失的列
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
        RAISE NOTICE '✓ Added read_time column';
    ELSE
        RAISE NOTICE '✓ read_time column already exists';
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
        RAISE NOTICE '✓ Added image column';
    ELSE
        RAISE NOTICE '✓ image column already exists';
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
        RAISE NOTICE '✓ Added language column';
    ELSE
        RAISE NOTICE '✓ language column already exists';
    END IF;
END $$;

-- 检查并添加 tags 列（如果需要）
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'blog_posts'
        AND column_name = 'tags'
    ) THEN
        ALTER TABLE blog_posts ADD COLUMN tags JSONB NOT NULL DEFAULT '[]';
        RAISE NOTICE '✓ Added tags column';
    ELSE
        RAISE NOTICE '✓ tags column already exists';
    END IF;
END $$;

-- 检查并添加 seo_keywords 列（如果需要）
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'blog_posts'
        AND column_name = 'seo_keywords'
    ) THEN
        ALTER TABLE blog_posts ADD COLUMN seo_keywords JSONB NOT NULL DEFAULT '[]';
        RAISE NOTICE '✓ Added seo_keywords column';
    ELSE
        RAISE NOTICE '✓ seo_keywords column already exists';
    END IF;
END $$;

-- ============================================
-- 步骤2: 显示当前表结构
-- ============================================

SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'blog_posts'
ORDER BY ordinal_position;

RAISE NOTICE '✓ Table structure updated successfully';
