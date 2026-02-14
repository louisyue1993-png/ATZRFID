# 🚀 部署配置文档中心

欢迎来到ATZ RFID网站的部署配置中心！本中心提供完整的部署和环境变量配置指南。

## 📚 文档导航

### 快速开始
如果你是第一次部署，建议按以下顺序阅读：

1. **[⚡ 快速参考卡片](./QUICK_REFERENCE.md)** - 5分钟快速配置指南
2. **[📘 详细配置指南](./ENV_CONFIG_GUIDE.md)** - 各平台完整配置说明
3. **[🔧 部署问题排查](./DEPLOYMENT.md)** - 常见问题解决方案

### 按平台查看

| 平台 | 文档链接 | 配置时间 | 难度 |
|------|---------|---------|------|
| **Vercel** | [查看配置](./ENV_CONFIG_GUIDE.md#🚀-vercel-配置) | 5分钟 | ⭐ 简单 |
| **Netlify** | [查看配置](./ENV_CONFIG_GUIDE.md#🔷-netlify-配置) | 5分钟 | ⭐ 简单 |
| **Railway** | [查看配置](./ENV_CONFIG_GUIDE.md#🚂-railway-配置) | 3分钟 | ⭐ 简单 |
| **Render** | [查看配置](./ENV_CONFIG_GUIDE.md#🔧-render-配置) | 5分钟 | ⭐ 简单 |
| **Cloudflare Pages** | [查看配置](./ENV_CONFIG_GUIDE.md#☁️-cloudflare-pages-配置) | 5分钟 | ⭐⭐ 中等 |
| **Docker** | [查看配置](./ENV_CONFIG_GUIDE.md#🐳-docker-配置) | 10分钟 | ⭐⭐⭐ 较难 |

### 配置文件模板

| 平台 | 配置文件 | 说明 |
|------|---------|------|
| **Vercel** | [vercel.json.example](./vercel.json.example) | Vercel配置模板 |
| **Netlify** | [netlify.toml.example](./netlify.toml.example) | Netlify配置模板 |
| **Docker** | [创建你的Dockerfile](./ENV_CONFIG_GUIDE.md#🐳-docker-配置) | Docker配置示例 |

### 部署与测试

| 文档 | 说明 | 适用场景 |
|------|------|---------|
| **[部署问题排查指南](./DEPLOYMENT.md)** | 常见部署问题解决方案 | 部署后遇到问题时 |
| **[部署验证测试指南](./TESTING_GUIDE.md)** | API和前端页面测试方法 | 部署后验证功能 |

### 数据库初始化

| 文件 | 用途 | 使用场景 |
|------|------|---------|
| **[database-init.sql](./database-init.sql)** | 数据库初始化脚本 | 首次部署或数据库为空时使用 |

## 🎯 快速开始（3步完成部署）

### Step 1: 获取 Supabase 凭据

```
1. 访问：https://supabase.com/dashboard
2. 选择项目 → Settings → API
3. 复制：
   - Project URL
   - anon public key
```

### Step 2: 配置环境变量

在你的部署平台（Vercel/Netlify/Railway等）中添加：

```bash
COZE_SUPABASE_URL=https://your-project.supabase.co
COZE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 3: 初始化数据库

在 Supabase SQL Editor 中运行 `database-init.sql` 文件，插入示例数据。

## ✅ 验证部署

部署完成后，访问以下URL验证配置：

```bash
# API 测试
https://your-domain.com/api/products?limit=1
https://your-domain.com/api/blog?limit=1

# 前端页面
https://your-domain.com/products
https://your-domain.com/blog
https://your-domain.com/admin/login
```

**期望结果**：
- API 返回 JSON 数据（不是错误）
- 产品页面显示产品列表
- 博客页面显示博客文章

## 🚨 常见问题

### 问题1：产品和博客无法显示

**原因**：环境变量未配置或数据库为空

**解决**：
1. 检查环境变量是否正确配置
2. 运行 `database-init.sql` 初始化数据
3. 重新部署应用

**相关文档**：[DEPLOYMENT.md](./DEPLOYMENT.md)

### 问题2：API返回500错误

**原因**：数据库连接失败

**解决**：
1. 验证 `COZE_SUPABASE_URL` 格式正确
2. 确认 `COZE_SUPABASE_ANON_KEY` 有效
3. 检查 Supabase 项目状态

**相关文档**：[ENV_CONFIG_GUIDE.md](./ENV_CONFIG_GUIDE.md#4-故障排查)

### 问题3：编译错误

**原因**：依赖安装失败

**解决**：
1. 清理缓存：`pnpm store prune`
2. 重新安装：`pnpm install`
3. 本地测试：`pnpm run build`

### 问题4：环境变量未生效

**原因**：配置后未重新部署

**解决**：
1. 确认环境变量已保存
2. 触发重新部署
3. 查看部署日志确认变量已加载

## 🔐 安全建议

✅ **推荐做法**：
- 为不同环境使用独立的 Supabase 项目
- 定期轮换 API 密钥
- 启用 Supabase RLS (Row Level Security)
- 监控数据库访问日志
- 使用强密码和安全的 API 密钥

❌ **避免做法**：
- 将 `.env` 文件提交到 Git
- 在代码中硬编码凭据
- 在前端代码中暴露密钥
- 共享你的 API 密钥
- 使用默认密码

## 📞 获取帮助

如果遇到问题，按以下步骤排查：

1. **查看日志**：在部署平台查看构建和运行日志
2. **阅读文档**：查阅相关配置文档
3. **检查配置**：使用快速参考卡片验证配置
4. **测试连接**：在 Supabase Dashboard 测试 API
5. **联系支持**：各平台都提供技术支持

**外部资源**：
- [Supabase 文档](https://supabase.com/docs)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [Vercel 文档](https://vercel.com/docs)
- [Netlify 文档](https://docs.netlify.com)

## 📋 部署检查清单

### 部署前检查

- [ ] Supabase 项目已创建并运行正常
- [ ] 已获取 Supabase URL 和 Anon Key
- [ ] 已创建部署项目并连接到 Git 仓库
- [ ] 代码已提交到 Git 仓库
- [ ] 本地构建测试通过 (`pnpm run build`)
- [ ] 无 TypeScript 编译错误

### 配置检查

- [ ] COZE_SUPABASE_URL 已配置
- [ ] COZE_SUPABASE_ANON_KEY 已配置
- [ ] 环境变量已应用到生产环境
- [ ] 已触发重新部署

### 数据库检查

- [ ] 数据库表已创建
- [ ] 已运行 `database-init.sql`
- [ ] products 表有数据（至少10个）
- [ ] blog_posts 表有数据（至少1篇）

### 验证检查

- [ ] 网站可以正常访问
- [ ] `/api/products` 返回数据
- [ ] `/api/blog` 返回数据
- [ ] 产品页面显示产品列表
- [ ] 博客页面显示博客列表
- [ ] 浏览器控制台无错误
- [ ] 移动端显示正常

💡 **详细测试方法**：请参考 [部署验证测试指南](./TESTING_GUIDE.md)，包含多种测试方法和自动化测试脚本。

## 🎓 学习资源

### 初学者
- [环境变量是什么](https://www.vercel.com/docs/concepts/projects/environment-variables)
- [Next.js 环境变量](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase 快速开始](https://supabase.com/docs/guides/getting-started)

### 进阶
- [Vercel 环境变量最佳实践](https://vercel.com/guides/environment-variables)
- [Netlify 环境变量安全](https://docs.netlify.com/configure-builds/environment-variables#security)
- [Supabase 安全指南](https://supabase.com/docs/guides/platform/security)

### DevOps
- [CI/CD 环境变量管理](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Docker 环境变量](https://docs.docker.com/engine/reference/commandline/run/#set-environment-variables--e---env---env-file)
- [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)

## 📝 更新日志

- **2025-02-13**: 创建部署配置中心
- **2025-02-13**: 添加所有主要平台的配置指南
- **2025-02-13**: 添加快速参考卡片
- **2025-02-13**: 添加配置文件模板
- **2025-02-13**: 添加数据库初始化脚本
- **2025-02-13**: 添加部署验证测试指南

## 🤝 贡献

如果你发现文档有错误或需要补充，欢迎提交改进建议！

---

**祝你部署顺利！** 🎉

如有问题，请查阅相关文档或联系技术支持。
