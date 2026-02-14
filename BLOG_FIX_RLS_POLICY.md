# 修复 RLS 策略 - 允许匿名用户查询博客

## 🔴 问题根源

**RLS (Row Level Security) 策略阻止了 anon 角色的查询！**

### 诊断结果

| 测试 | 角色 | 结果 |
|------|------|------|
| 测试1 | postgres | ✅ 可以查询 |
| 测试2 | postgres | ✅ 可以查询 |
| 测试3 | **anon** | ❌ **查询不到** |

**原因**：API 使用 anon key（公开密钥），anon key 使用 anon 角色，但 RLS 策略没有允许 anon 角色查询博客文章！

---

## ✅ 解决方案

运行 `blog-fix-rls-policy.sql` 脚本，它会：

1. 启用 RLS（如果未启用）
2. 删除旧的策略（如果存在）
3. 创建新的 RLS 策略：允许所有人查看已发布的博客
4. 验证策略创建成功
5. 使用 anon 角色测试策略

---

## 🚀 立即执行（1分钟）

### 步骤1：运行修复脚本

1. **登录 Supabase Dashboard**
   ```
   https://supabase.com/dashboard
   ```

2. **打开 SQL Editor**
   - 点击左侧菜单的 **SQL Editor**
   - 点击 **New Query**

3. **复制并粘贴** `blog-fix-rls-policy.sql` 的完整内容

4. **点击 Run** 执行

### 步骤2：验证结果

```bash
# 测试 API
curl https://bgt9w5rb76.coze.site/api/blog?limit=1
```

**预期输出**：
```json
{
  "success": true,
  "posts": [{
    "id": "...",
    "slug": "welcome-to-atz-rfid",
    "title": "Welcome to ATZ RFID - Your Trusted RFID Partner",
    ...
  }],
  "count": 1
}
```

---

## 📋 脚本说明

### blog-fix-rls-policy.sql 会做什么？

1. **启用 RLS**
   ```sql
   ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
   ```

2. **删除旧策略**
   ```sql
   DROP POLICY IF EXISTS "Published blog posts are viewable by everyone" ON blog_posts;
   ```

3. **创建新策略**
   ```sql
   CREATE POLICY "Published blog posts are viewable by everyone"
   ON blog_posts
   FOR SELECT
   USING (published = true);
   ```

   **这个策略的意思**：
   - 允许所有角色（包括 anon）
   - 执行 SELECT 查询
   - 条件是 `published = true`

4. **验证策略**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'blog_posts';
   ```

5. **测试策略**
   ```sql
   SET role anon;
   SELECT * FROM blog_posts WHERE published = true;
   SET role postgres;
   ```

---

## ✅ 执行后的预期结果

### SQL 输出

```
ALTER TABLE

DROP POLICY

CREATE POLICY

policyname                                      | cmd
------------------------------------------------|-----
Published blog posts are viewable by everyone   | SELECT
```

**测试结果**：
```json
[{
  "id": "a0c6eac7-8861-46f1-98fa-cfe2c9027678",
  "slug": "welcome-to-atz-rfid",
  "title": "Welcome to ATZ RFID - Your Trusted RFID Partner",
  "published": true
}]
```

### API 响应

```bash
$ curl https://bgt9w5rb76.coze.site/api/blog?limit=1
{
  "success": true,
  "posts": [{
    "id": "a0c6eac7-8861-46f1-98fa-cfe2c9027678",
    "slug": "welcome-to-atz-rfid",
    "title": "Welcome to ATZ RFID - Your Trusted RFID Partner",
    "excerpt": "Discover how ATZ RFID provides cutting-edge RFID solutions...",
    "category": "Company News",
    "author": "ATZ Team",
    "readTime": "5 min read",
    "image": "/blog/blog-1.jpg",
    "published": true,
    "tags": ["RFID", "Company", "News"],
    "seoKeywords": ["ATZ RFID", "RFID solutions", "RFID products"],
    "createdAt": "2026-02-14T01:50:01.557352+00:00"
  }],
  "count": 1
}
```

---

## 🧪 验证步骤

### 1. 验证 RLS 策略

在 Supabase SQL Editor 中运行：

```sql
-- 查看策略
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'blog_posts';

-- 期望结果：
-- policyname: Published blog posts are viewable by everyone
-- cmd: SELECT
-- qual: (published = true)
```

### 2. 验证 API

```bash
curl https://bgt9w5rb76.coze.site/api/blog?limit=1
```

**期望输出**：`"count": 1`

### 3. 验证前端

访问：
```
https://bgt9w5rb76.coze.site/blog
```

**期望结果**：显示博客文章列表

---

## 🎯 为什么需要 RLS 策略？

### RLS (Row Level Security) 作用

RLS 是 PostgreSQL 的安全特性，用于控制不同角色对表的访问权限。

### 在这个项目中

- **anon 角色**：代表公开用户（网站访客）
- **authenticated 角色**：代表已登录用户（管理员）
- **postgres 角色**：代表数据库管理员

### 为什么需要策略？

没有策略时：
- ❌ anon 角色无法查询任何数据（默认行为）
- ❌ 即使有数据，API 也无法访问

有策略后：
- ✅ anon 角色可以查询 `published = true` 的博客
- ✅ API 可以正常返回数据
- ✅ 前端可以正常显示博客

---

## 📊 RLS 策略最佳实践

### 只读策略（推荐）

```sql
-- 允许所有人读取已发布的内容
CREATE POLICY "Published posts are viewable by everyone"
ON blog_posts
FOR SELECT
USING (published = true);
```

### 管理员完全访问

```sql
-- 允许管理员访问所有数据
CREATE POLICY "Admins can do everything"
ON blog_posts
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
```

### 组合使用

```sql
-- 公开用户：只能读取已发布的
CREATE POLICY "Public read access"
ON blog_posts
FOR SELECT
USING (published = true);

-- 管理员：可以读取所有数据
CREATE POLICY "Admin read access"
ON blog_posts
FOR SELECT
TO authenticated
USING (true);
```

---

## ✅ 成功标志

- ✅ SQL 执行成功，策略创建成功
- ✅ anon 角色可以查询到数据
- ✅ API 返回数据：`"count": 1`
- ✅ 前端显示博客文章
- ✅ 策略列表中显示新策略

---

## 🔄 如果还是不行

### 检查 RLS 是否启用

```sql
-- 查看表的 RLS 状态
SELECT relname, relrowsecurity
FROM pg_class
WHERE relname = 'blog_posts';

-- 期望：relrowsecurity = true
```

### 检查策略是否生效

```sql
-- 使用 anon 角色测试
SET role anon;
SELECT COUNT(*) FROM blog_posts WHERE published = true;
SET role postgres;
```

### 查看所有策略

```sql
-- 查看所有策略
SELECT * FROM pg_policies WHERE tablename = 'blog_posts';
```

---

## 📞 需要帮助？

如果执行后仍然没有数据：

1. 检查 SQL 执行是否有错误
2. 验证策略是否创建成功
3. 使用 anon 角色测试查询
4. 检查 API 响应的错误信息

复制完整的错误信息告诉我，我会帮你解决！

---

**现在就运行 blog-fix-rls-policy.sql 吧！** 🚀

这个脚本会解决 RLS 策略阻止查询的问题！
