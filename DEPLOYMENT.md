# 部署环境变量配置指南

> ⚠️ 本文档已降级为补充说明，标准部署请以 [DEPLOYMENT_SUPABASE_VERCEL.md](./DEPLOYMENT_SUPABASE_VERCEL.md) 为准。

> 📘 **详细配置指南**：查看 [ENV_CONFIG_GUIDE.md](./ENV_CONFIG_GUIDE.md) 获取各平台的详细配置说明
> ⚡ **快速参考**：查看 [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) 获取快速配置卡片
> 🧪 **测试验证**：查看 [TESTING_GUIDE.md](./TESTING_GUIDE.md) 获取完整的测试方法

## 问题描述

在部署到生产环境后，可能会出现产品和博客无法显示的问题，主要原因包括：

1. **环境变量未配置**：生产环境缺少必要的数据库连接凭据
2. **数据库为空**：博客表中没有数据
3. **API认证问题**：某些API需要认证但未正确处理

## 解决方案

### 1. 环境变量配置

在部署平台（如 Vercel、Netlify、Railway 等）中，必须配置以下环境变量：

```bash
# Supabase 数据库连接
COZE_SUPABASE_URL=https://your-project.supabase.co
COZE_SUPABASE_ANON_KEY=your-anon-key-here

# 管理员账号（可选）
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-password
```

**获取 Supabase 凭据**：
1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** → **API**
4. 复制以下信息：
   - Project URL → `COZE_SUPABASE_URL`
   - anon public key → `COZE_SUPABASE_ANON_KEY`

**快速配置参考**：

| 平台 | 配置步骤 | 详细文档 |
|------|---------|---------|
| Vercel | Settings → Environment Variables → Add New | [查看详情](./ENV_CONFIG_GUIDE.md#🚀-vercel-配置) |
| Netlify | Site settings → Build & deploy → Environment variables | [查看详情](./ENV_CONFIG_GUIDE.md#🔷-netlify-配置) |
| Railway | Dashboard → Variables → + New Variable | [查看详情](./ENV_CONFIG_GUIDE.md#🚂-railway-配置) |
| Render | Settings → Environment → Add Environment Variable | [查看详情](./ENV_CONFIG_GUIDE.md#🔧-render-配置) |

### 2. 数据库数据初始化

部署后，需要确保数据库中有初始数据。推荐先运行 `blog-table-quick-fix.sql`，再运行 `blog-init-fixed.sql`。

也可以直接执行以下示例 SQL 插入博客数据：

```sql
-- 插入示例博客文章
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
) VALUES
(
  'future-of-rfid-technology-2025',
  'The Future of RFID Technology: Trends to Watch in 2025',
  'Explore the emerging trends and innovations that will shape the RFID industry...',
  'The RFID industry is evolving rapidly...',
  'Technology',
  'ATZ Team',
  '8 min read',
  '/blog/blog-1.jpg',
  true,
  '["RFID", "IoT", "Security", "Technology"]',
  '["RFID technology", "RFID trends 2025"]',
  'en'
);

-- 检查数据
SELECT id, title, category, published FROM blog_posts;
```

### 3. 验证部署

部署后，访问以下端点验证配置：

```bash
# 测试产品API
curl https://your-domain.com/api/products?limit=5

# 测试博客API
curl https://your-domain.com/api/blog?limit=5

# 访问前端页面
https://your-domain.com/products
https://your-domain.com/blog
```

> 💡 **详细测试指南**：查看 [TESTING_GUIDE.md](./TESTING_GUIDE.md) 获取完整的测试方法，包括：
> - 使用 curl、浏览器、Postman 等多种测试工具
> - 错误诊断和解决方案
> - 性能基准测试
> - 自动化测试脚本

### 4. 常见问题排查

#### 问题1：API返回404或500错误

**原因**：环境变量未配置或数据库连接失败

**解决方案**：
1. 检查部署平台的环境变量配置
2. 验证Supabase项目是否正常运行
3. 查看部署日志获取详细错误信息

#### 问题2：博客页面显示"No blog posts available"

**原因**：blog_posts表为空或所有文章都未发布

**解决方案**：
1. 在后台管理系统中创建并发布博客文章
2. 或运行上面的SQL脚本插入示例数据
3. 确保`published`字段为`true`

#### 问题3：产品页面显示"Failed to load products"

**原因**：数据库连接问题或products表为空

**解决方案**：
1. 检查`COZE_SUPABASE_URL`和`COZE_SUPABASE_ANON_KEY`是否正确
2. 验证Supabase项目状态
3. 检查products表是否有数据：`SELECT COUNT(*) FROM products;`

### 5. 各平台部署配置示例

#### Vercel

1. 进入项目设置 → **Environment Variables**
2. 添加以下变量：
   ```
   COZE_SUPABASE_URL = https://your-project.supabase.co
   COZE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. 重新部署项目

#### Netlify

1. 进入 **Site settings** → **Environment variables**
2. 添加环境变量
3. 在 **Build & deploy** → **Edit settings** 中添加：
   ```bash
   COZE_SUPABASE_URL=https://your-project.supabase.co
   COZE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

#### Railway

1. 在项目设置中添加环境变量
2. Railway会自动识别并应用环境变量

### 6. 生产环境检查清单

部署前确认以下事项：

- [ ] Supabase项目已创建并正常运行
- [ ] `COZE_SUPABASE_URL`已配置
- [ ] `COZE_SUPABASE_ANON_KEY`已配置
- [ ] 数据库表已创建（products, blog_posts等）
- [ ] 博客文章已创建并发布（至少1篇）
- [ ] 产品数据已导入（至少10个产品）
- [ ] 本地测试通过，无编译错误
- [ ] API端点响应正常
- [ ] 前端页面加载正常

### 7. 联系支持

如果问题仍未解决，请检查：

1. **部署日志**：查看详细错误信息
2. **浏览器控制台**：检查前端错误
3. **网络标签**：查看API请求响应
4. **Supabase Logs**：检查数据库查询错误

---

**注意**：`.env.local` 文件仅在本地开发环境使用，不会部署到生产环境。必须在部署平台中手动配置环境变量。
