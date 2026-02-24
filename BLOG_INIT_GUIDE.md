# 博客数据初始化指南

> 📦 归档说明：此文档属于历史排障记录。当前请按 [DEPLOYMENT_SUPABASE_VERCEL.md](./DEPLOYMENT_SUPABASE_VERCEL.md) 的初始化顺序执行。

## 🔧 问题说明

在运行 `database-init.sql` 时遇到错误：
```
ERROR: 42703: column "read_time" of relation "blog_posts" does not exist
```

这是因为 Supabase 数据库中的 `blog_posts` 表缺少 `read_time` 和 `language` 列。

---

## ✅ 解决方案

我已经创建了两个修复版的初始化脚本，会自动检查并添加缺失的列。

### 方案1：快速测试（推荐）

**使用场景**：快速验证博客功能是否正常

**步骤**：
1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 点击 **SQL Editor**（左侧菜单）
4. 点击 **New Query**
5. 复制并粘贴 `blog-init-quick.sql` 的内容
6. 点击 **Run** 执行

**结果**：插入1条测试博客文章

### 方案2：完整初始化

**使用场景**：需要完整的博客内容（5篇文章）

**步骤**：
1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 点击 **SQL Editor**（左侧菜单）
4. 点击 **New Query**
5. 复制并粘贴 `blog-init-fixed.sql` 的内容
6. 点击 **Run** 执行

**结果**：插入5篇示例博客文章

---

## 📋 脚本说明

### blog-init-quick.sql（快速测试）

这个脚本会：
- ✅ 检查并添加 `read_time` 列（如果不存在）
- ✅ 检查并添加 `language` 列（如果不存在）
- ✅ 插入1条测试博客："Welcome to ATZ RFID"
- ✅ 显示插入结果验证

**适合**：快速测试博客API和前端页面是否正常工作

### blog-init-fixed.sql（完整初始化）

这个脚本会：
- ✅ 检查并添加 `read_time` 列（如果不存在）
- ✅ 检查并添加 `language` 列（如果不存在）
- ✅ 插入5篇示例博客文章：
  1. The Future of RFID Technology: Trends to Watch in 2025
  2. RFID vs Barcodes: A Comprehensive Comparison
  3. Implementing RFID in Retail: A Complete Guide
  4. RFID in Healthcare: Transforming Patient Care
  5. RFID for Supply Chain Optimization: A Strategic Approach
- ✅ 显示所有博客文章验证

**适合**：生产环境或需要完整内容的情况

---

## 🧪 验证数据

执行完脚本后，可以通过以下方式验证：

### 方法1：在 Supabase SQL Editor 中查询

```sql
-- 查看所有博客文章
SELECT id, slug, title, category, published
FROM blog_posts
ORDER BY created_at DESC;
```

### 方法2：使用 API 测试

```bash
# 测试博客API
curl https://bgt9w5rb76.coze.site/api/blog?limit=5 | jq '.'

# 预期结果：
{
  "success": true,
  "posts": [...],
  "count": 5  # 或 1（如果是快速测试）
}
```

### 方法3：访问前端页面

在浏览器中访问：
```
https://bgt9w5rb76.coze.site/blog
```

**预期结果**：显示博客文章列表

---

## 🛠️ 故障排查

### 问题1：脚本执行失败

**错误**：
```
relation "blog_posts" does not exist
```

**解决**：需要先创建 `blog_posts` 表。在 Supabase SQL Editor 中运行：

```sql
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  read_time TEXT NOT NULL DEFAULT '5 min read',
  image TEXT NOT NULL,
  published BOOLEAN NOT NULL DEFAULT false,
  tags JSONB NOT NULL DEFAULT '[]',
  seo_keywords JSONB NOT NULL DEFAULT '[]',
  language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

然后再运行初始化脚本。

### 问题2：插入失败 - slug 重复

**错误**：
```
duplicate key value violates unique constraint "blog_posts_slug_key"
```

**原因**：该 slug 的博客文章已存在

**解决**：
- 脚本中已使用 `ON CONFLICT (slug) DO NOTHING` 自动处理
- 如果需要更新现有文章，可以修改为 `ON CONFLICT (slug) DO UPDATE SET ...`

### 问题3：数据插入成功但前端不显示

**可能原因**：
1. `published` 字段为 `false`
2. 图片路径不正确
3. API 缓存问题

**解决**：
```sql
-- 检查 published 状态
SELECT slug, title, published FROM blog_posts;

-- 更新为已发布
UPDATE blog_posts SET published = true WHERE published = false;

-- 清除缓存（重新部署应用）
```

---

## 📊 完整的部署流程

1. ✅ 配置环境变量（已完成）
2. ✅ 创建 Supabase 项目（已完成）
3. ✅ 部署应用到生产环境（已完成）
4. ⏳ 运行博客初始化脚本（进行中）
5. ⏳ 验证博客功能（待完成）
6. ⏳ 完成！🎉

---

## 🎯 推荐操作步骤

### 立即执行（1分钟）

1. 打开 Supabase SQL Editor
2. 运行 `blog-init-quick.sql`
3. 验证结果：访问 https://bgt9w5rb76.coze.site/blog

### 后续完善（5分钟）

1. 运行 `blog-init-fixed.sql`（插入5篇完整文章）
2. 测试博客分类筛选
3. 测试博客详情页面
4. 根据需要修改博客内容

---

## 📞 需要帮助？

如果遇到问题：

1. **查看详细测试指南**：[TESTING_GUIDE.md](./TESTING_GUIDE.md)
2. **查看部署文档**：[DEPLOYMENT.md](./DEPLOYMENT.md)
3. **检查 Supabase 日志**：在 Supabase Dashboard 中查看数据库日志
4. **检查应用日志**：在部署平台查看运行日志

---

**祝你博客初始化顺利！** 🚀
