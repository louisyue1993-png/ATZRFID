# 后台管理系统部署指南

> ⚠️ 部署总流程请先执行 [DEPLOYMENT_SUPABASE_VERCEL.md](./DEPLOYMENT_SUPABASE_VERCEL.md)。本文重点是后台功能使用。

## 概述

本系统包含完整的后台管理功能，允许管理员登录后台修改产品、博客等内容。修改后的内容会实时保存到 Supabase 数据库，并在前端页面显示。

## 功能特性

### ✅ 已实现的功能

1. **产品管理**
   - 创建、编辑、删除产品
   - 批量导入/导出产品
   - 高级搜索功能
   - 图片上传（支持对象存储）
   - SEO 优化工具

2. **博客管理**
   - 创建、编辑、删除博客文章
   - 富文本编辑
   - 分类管理
   - 图片上传

3. **用户认证**
   - 基于密码的登录系统
   - 会话管理（24小时有效期）
   - 安全的 Cookie 验证

4. **数据管理**
   - Supabase 数据库集成
   - 实时数据同步
   - 批量操作支持

## 环境变量配置

在部署前，需要配置以下环境变量：

### 必需的环境变量

```bash
# Supabase 数据库配置
COZE_SUPABASE_URL=your_supabase_url
COZE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 管理员密码（登录后台使用）
ADMIN_PASSWORD=your_admin_password
```

### 如何获取 Supabase 凭证

1. 访问 [Supabase 官网](https://supabase.com) 并创建项目
2. 进入项目设置 → API
3. 复制以下信息：
   - **Project URL**: 对应 `COZE_SUPABASE_URL`
   - **anon public**: 对应 `COZE_SUPABASE_ANON_KEY`

### 如何设置管理员密码

选择一个强密码作为 `ADMIN_PASSWORD`，例如：
```bash
ADMIN_PASSWORD=MySecureP@ssw0rd123
```

## 后台登录流程

### 1. 访问登录页面

在浏览器中访问：
```
https://yourdomain.com/admin/login
```

### 2. 输入管理员密码

使用环境变量中设置的 `ADMIN_PASSWORD` 登录

### 3. 进入后台管理

登录成功后，可以访问以下页面：

- **仪表板**: `/admin/dashboard`
- **产品管理**: `/admin/products`
- **博客管理**: `/admin/blog`
- **设置**: `/admin/settings`

## 数据库初始化

首次部署前，需要在 Supabase 中创建以下数据表：

### Products 表

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT,
  description TEXT,
  shortDescription TEXT,
  fullDescription TEXT,
  price TEXT,
  priceRange TEXT,
  frequency TEXT,
  chip TEXT,
  memory TEXT,
  readRange TEXT,
  protocol TEXT,
  category TEXT,
  subCategory TEXT,
  badge TEXT,
  moq TEXT,
  deliveryTime TEXT,
  specifications JSONB,
  features TEXT[],
  applications TEXT[],
  keywords TEXT[],
  seoKeywords TEXT[],
  stockStatus TEXT,
  rating NUMERIC,
  reviewCount INTEGER,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Blog Posts 表

```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  author TEXT,
  category TEXT,
  tags TEXT[],
  coverImage TEXT,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 导入初始产品数据

如果需要在数据库中导入初始产品数据，可以使用提供的脚本：

```bash
# 从静态文件导入到数据库
node scripts/import-products-to-db.js
```

## 产品管理操作

### 添加新产品

1. 访问 `/admin/products/new`
2. 填写产品信息：
   - 基本信息（名称、价格等）
   - 规格参数
   - 产品描述
   - SEO 信息
3. 上传产品图片
4. 点击保存

### 编辑产品

1. 访问 `/admin/products`
2. 找到要编辑的产品
3. 点击编辑按钮
4. 修改信息后保存

### 删除产品

1. 访问 `/admin/products`
2. 选择要删除的产品
3. 点击删除按钮并确认

### 批量操作

支持批量导入/导出产品：

```bash
# 导出所有产品
curl -H "Cookie: admin_session=your_session" \
  https://yourdomain.com/api/admin/export

# 批量导入产品
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Cookie: admin_session=your_session" \
  -d '{"products": [...]}' \
  https://yourdomain.com/api/admin/products/bulk
```

## 前端数据同步

### 数据流

```
后台管理 → Supabase 数据库 → API → 前端页面
```

1. **后台管理**: 管理员在后台修改产品
2. **数据库**: 数据实时保存到 Supabase
3. **API**: `/api/products` 从数据库读取数据
4. **前端**: 产品页面通过 API 获取最新数据

### 自动刷新

前端页面每次访问时都会从 API 获取最新数据，无需手动刷新缓存。

## 安全注意事项

1. **保护管理员密码**
   - 不要在代码中硬编码密码
   - 使用环境变量存储
   - 定期更换密码

2. **HTTPS 部署**
   - 生产环境必须使用 HTTPS
   - 确保 Cookie 使用 `secure` 标志

3. **会话管理**
   - 默认会话有效期为 24 小时
   - 退出登录后清除 Cookie

4. **数据库权限**
   - 使用 Supabase RLS (Row Level Security)
   - 限制匿名用户的写入权限

## 常见问题

### Q: 忘记管理员密码怎么办？

A: 需要重新设置 `ADMIN_PASSWORD` 环境变量并重启服务。

### Q: 修改产品后前端不显示？

A: 检查以下几点：
1. 确认数据已保存到数据库
2. 检查 API 是否正常工作：`/api/products`
3. 清除浏览器缓存

### Q: 如何备份产品数据？

A: 可以通过导出功能或直接访问 Supabase 控制台进行备份。

### Q: 支持多管理员吗？

A: 当前版本支持单管理员，使用共享密码登录。如需多管理员权限管理，需要扩展认证系统。

## 部署检查清单

- [ ] 配置 `COZE_SUPABASE_URL`
- [ ] 配置 `COZE_SUPABASE_ANON_KEY`
- [ ] 设置 `ADMIN_PASSWORD`
- [ ] 创建 Supabase 数据表
- [ ] 导入初始产品数据（可选）
- [ ] 测试后台登录功能
- [ ] 测试产品 CRUD 操作
- [ ] 验证前端数据显示
- [ ] 启用 HTTPS（生产环境）

## 技术支持

如遇到问题，请检查：
1. 浏览器控制台日志
2. 服务器日志（`/app/work/logs/bypass/`）
3. Supabase 控制台
