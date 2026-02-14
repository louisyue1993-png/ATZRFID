-- 快速测试：插入一条测试博客文章
-- 这个脚本会在数据库中添加一条示例博客文章

-- ============================================
-- 步骤1: 检查并添加缺失的列（如果需要）
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

-- ============================================
-- 步骤2: 插入一条测试博客
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
With years of experience in the RFID industry, our team of experts is dedicated to providing you with the best products and services. We understand that every business has unique needs, and we work closely with you to deliver customized solutions.

## Get Started Today
Ready to take your business to the next level with RFID technology? Contact us today to learn more about our products and how we can help you achieve your goals.',
  'Company News',
  'ATZ Team',
  '5 min read',
  '/blog/blog-1.jpg',
  true,
  '["RFID", "Company", "News"]',
  '["ATZ RFID", "RFID solutions", "RFID products"]',
  'en'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  category = EXCLUDED.category,
  published = EXCLUDED.published;

-- ============================================
-- 步骤3: 验证
-- ============================================

-- 显示刚插入的博客文章
SELECT
  id,
  slug,
  title,
  category,
  published,
  read_time,
  created_at
FROM blog_posts
WHERE slug = 'welcome-to-atz-rfid';

-- 显示总数量
SELECT
  COUNT(*) AS total_blogs,
  SUM(CASE WHEN published = true THEN 1 ELSE 0 END) AS published_blogs
FROM blog_posts;
