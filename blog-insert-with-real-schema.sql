-- 博客数据插入脚本（基于实际表结构）
-- 使用实际的列名插入测试数据

-- ============================================
-- 步骤1: 删除可能存在的测试数据
-- ============================================

DELETE FROM blog_posts WHERE slug = 'welcome-to-atz-rfid';

-- ============================================
-- 步骤2: 插入测试数据（使用实际列名）
-- ============================================

INSERT INTO blog_posts (
  id,
  slug,
  title,
  excerpt,
  content,
  category,
  author,
  featuredimage,
  ispublished,
  tags,
  seokeywords,
  read_time,
  image,
  language,
  seo_keywords
) VALUES (
  gen_random_uuid(),
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
  '/blog/blog-1.jpg',
  true,
  ARRAY['RFID', 'Company', 'News'],
  ARRAY['ATZ RFID', 'RFID solutions', 'RFID products'],
  '5 min read',
  '/blog/blog-1.jpg',
  'en',
  ARRAY['ATZ RFID', 'RFID solutions']
);

-- ============================================
-- 步骤3: 验证
-- ============================================

-- 显示插入的数据
SELECT
  id,
  slug,
  title,
  category,
  ispublished,
  published,
  read_time,
  created_at
FROM blog_posts
WHERE slug = 'welcome-to-atz-rfid';

-- 显示总数量
SELECT COUNT(*) AS total_blogs FROM blog_posts;

-- 显示已发布的数量
SELECT COUNT(*) AS published_blogs FROM blog_posts WHERE ispublished = true;

-- 显示所有博客
SELECT
  id,
  slug,
  title,
  ispublished
FROM blog_posts
ORDER BY created_at DESC;
