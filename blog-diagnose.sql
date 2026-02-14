-- 博客表诊断脚本
-- 先查看当前表的实际结构，然后决定如何修复

-- ============================================
-- 步骤1: 查看当前表结构
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
-- 步骤2: 查看表是否有数据
-- ============================================

SELECT COUNT(*) AS total_records FROM blog_posts;

-- ============================================
-- 步骤3: 查看所有表的列表
-- ============================================

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE '%blog%'
ORDER BY table_name;
