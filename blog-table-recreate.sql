-- 博客文章表重建脚本
-- 如果当前表结构问题较多，可以使用这个脚本重新创建表

-- ============================================
-- 警告：此脚本会删除现有数据！
-- ============================================

-- 先备份现有数据（如果有）
CREATE TABLE IF NOT EXISTS blog_posts_backup AS
SELECT * FROM blog_posts;

-- 删除现有表
DROP TABLE IF EXISTS blog_posts;

-- 重新创建完整的表结构
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
  tags JSONB NOT NULL DEFAULT '[]',
  seo_keywords JSONB NOT NULL DEFAULT '[]',
  language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);

-- 恢复备份数据（如果需要，手动执行）
-- INSERT INTO blog_posts SELECT * FROM blog_posts_backup;

-- 验证表结构
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'blog_posts'
ORDER BY ordinal_position;
