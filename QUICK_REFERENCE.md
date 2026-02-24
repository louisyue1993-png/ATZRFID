# 环境变量快速参考卡片

> ⚠️ 若你是首次部署，请先读 [DEPLOYMENT_SUPABASE_VERCEL.md](./DEPLOYMENT_SUPABASE_VERCEL.md) 再使用本卡片。

## ⚡ 快速配置步骤

### 第一步：获取 Supabase 凭据

```
1. 访问：https://supabase.com/dashboard
2. 选择你的项目
3. 进入 Settings → API
4. 复制：
   - Project URL → COZE_SUPABASE_URL
   - anon public key → COZE_SUPABASE_ANON_KEY
```

### 第二步：在部署平台配置

| 平台 | 配置路径 |
|------|---------|
| **Vercel** | Dashboard → Settings → Environment Variables → Add New |
| **Netlify** | Site settings → Build & deploy → Environment variables → Add variable |
| **Railway** | Dashboard → Variables → + New Variable |
| **Render** | Settings → Environment → Add Environment Variable |
| **Cloudflare** | Settings → Functions → Add variable |

### 第三步：重新部署

配置环境变量后，平台会自动触发重新部署，或手动点击部署按钮。

---

## 📋 必需的环境变量

```bash
# 数据库连接
COZE_SUPABASE_URL=https://your-project.supabase.co
COZE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 管理员账号（可选）
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-password
```

---

## 🎯 配置示例

### Vercel 示例

```
Name: COZE_SUPABASE_URL
Value: https://fqmkwlcgtfzcblueplrm.supabase.co
Environments: ✅ Production ✅ Preview ✅ Development
```

### Netlify 示例

```
Key: COZE_SUPABASE_URL
Value: https://fqmkwlcgtfzcblueplrm.supabase.co
```

### Railway 示例

```
Variable: COZE_SUPABASE_URL
Value: https://fqmkwlcgtfzcblueplrm.supabase.co
```

---

## ✅ 验证配置

部署后访问这些URL验证：

```bash
# 测试产品API
https://your-domain.com/api/products?limit=1

# 测试博客API
https://your-domain.com/api/blog?limit=1

# 访问前端页面
https://your-domain.com/products
https://your-domain.com/blog
```

**期望结果**：返回JSON数据，而不是错误。

> 💡 **详细测试方法**：查看 [TESTING_GUIDE.md](./TESTING_GUIDE.md) 获取：
> - 使用 curl 命令测试（含格式化输出）
> - 浏览器开发者工具测试方法
> - Postman 等API测试工具使用
> - 自动化测试脚本
> - 错误诊断和解决方案

---

## 🚨 常见错误

### 错误1：COZE_SUPABASE_URL is not set

**原因**：环境变量未配置

**解决**：在部署平台中添加环境变量，然后重新部署

### 错误2：401 Unauthorized

**原因**：COZE_SUPABASE_ANON_KEY 不正确

**解决**：重新从 Supabase Dashboard 获取正确的 anon key

### 错误3：Database connection failed

**原因**：Supabase URL 格式错误或项目不存在

**解决**：检查URL格式，确保 Supabase 项目正常运行

### 错误4：500 Internal Server Error

**原因**：数据库查询失败或表不存在

**解决**：在 Supabase SQL Editor 依次运行 `blog-table-quick-fix.sql` 和 `blog-init-fixed.sql`

---

## 📞 获取帮助

- 详细文档：[ENV_CONFIG_GUIDE.md](./ENV_CONFIG_GUIDE.md)
- 部署指南：[DEPLOYMENT.md](./DEPLOYMENT.md)
- Supabase 文档：https://supabase.com/docs

---

## 💡 提示

⚠️ **重要提示**：
- `.env.local` 文件只在本地开发使用，不会部署
- 必须在部署平台中手动配置环境变量
- 部署后要运行数据库初始化脚本
- 生产环境使用独立的 Supabase 项目

🔒 **安全提示**：
- 不要将 `.env` 文件提交到 Git
- 不要在代码中硬编码凭据
- 定期轮换 API 密钥
- 为不同环境使用不同的数据库

📌 **快速记忆**：
```
Supabase → Dashboard → API → 复制 URL 和 Key
部署平台 → Settings → Environment → 添加变量
重新部署 → 验证配置 → 完成！
```
