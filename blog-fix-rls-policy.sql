-- 修复 RLS 策略，允许匿名用户查询已发布的博客

-- ============================================
-- 步骤1: 启用 RLS（如果未启用）
-- ============================================

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 步骤2: 删除旧的策略（如果存在）
-- ============================================

DROP POLICY IF EXISTS "Published blog posts are viewable by everyone" ON blog_posts;
DROP POLICY IF EXISTS "Enable read access for all users" ON blog_posts;

-- ============================================
-- 步骤3: 创建新的 RLS 策略
-- ============================================

-- 策略1: 允许所有人查看已发布的博客（SELECT）
CREATE POLICY "Published blog posts are viewable by everyone"
ON blog_posts
FOR SELECT
USING (published = true);

-- ============================================
-- 步骤4: 验证策略
-- ============================================

-- 查看所有策略
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'blog_posts';

-- ============================================
-- 步骤5: 测试策略
-- ============================================

-- 使用 anon 角色测试
SET role anon;

SELECT
  id,
  slug,
  title,
  published
FROM blog_posts
WHERE published = true;

-- 恢复默认角色
SET role postgres;
