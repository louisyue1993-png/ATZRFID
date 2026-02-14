-- 更新 published 列，使其与 ispublished 同步
-- 解决 API 查询不到数据的问题

-- ============================================
-- 步骤1: 同步 published 列
-- ============================================

-- 更新所有已发布的文章
UPDATE blog_posts
SET published = ispublished
WHERE ispublished = true AND published IS NULL;

-- ============================================
-- 步骤2: 插入测试数据（如果还没有）
-- ============================================

-- 先删除可能存在的测试数据
DELETE FROM blog_posts WHERE slug = 'welcome-to-atz-rfid';

-- 插入测试数据（同时设置 ispublished 和 published）
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
  published,
  tags,
  seokeywords,
  read_time,
  image,
  language
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
  true,
  ARRAY['RFID', 'Company', 'News'],
  ARRAY['ATZ RFID', 'RFID solutions', 'RFID products'],
  '5 min read',
  '/blog/blog-1.jpg',
  'en'
);

-- ============================================
-- 步骤3: 验证
-- ============================================

-- 显示所有博客的 published 状态
SELECT
  id,
  slug,
  title,
  ispublished,
  published,
  created_at
FROM blog_posts
ORDER BY created_at DESC;

-- 显示总数量
SELECT COUNT(*) AS total_blogs FROM blog_posts;

-- 显示已发布的数量（两种方式）
SELECT
  COUNT(*) AS total,
  SUM(CASE WHEN ispublished = true THEN 1 ELSE 0 END) AS is_published_count,
  SUM(CASE WHEN published = true THEN 1 ELSE 0 END) AS published_count
FROM blog_posts;
