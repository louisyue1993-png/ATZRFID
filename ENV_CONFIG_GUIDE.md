# 环境变量配置指南

> ⚠️ 统一部署流程请先看 [DEPLOYMENT_SUPABASE_VERCEL.md](./DEPLOYMENT_SUPABASE_VERCEL.md)。本文仅提供平台操作细节。

本文档详细说明如何在各个主流部署平台中配置环境变量，确保你的RFID网站能够正确连接到Supabase数据库。

## 📋 必需的环境变量

在部署之前，请准备好以下环境变量：

```bash
COZE_SUPABASE_URL=https://your-project.supabase.co
COZE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-password
```

**获取 Supabase 凭据**：
1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** → **API**
4. 复制以下信息：
   - **Project URL** → `COZE_SUPABASE_URL`
   - **anon public key** → `COZE_SUPABASE_ANON_KEY`

---

## 🚀 Vercel 配置

### 方法一：通过 Dashboard 配置

1. **登录 Vercel Dashboard**
   ```
   https://vercel.com/dashboard
   ```

2. **选择你的项目**

3. **进入 Settings**
   - 点击项目名称进入项目概览
   - 点击 **Settings** 标签

4. **添加环境变量**
   - 点击左侧菜单的 **Environment Variables**
   - 点击 **Add New** 按钮
   - 输入环境变量：
     ```
     Name: COZE_SUPABASE_URL
     Value: https://your-project.supabase.co
     ```
   - 选择环境：
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - 点击 **Save**
   - 重复以上步骤添加其他环境变量

5. **重新部署**
   - 环境变量添加后会自动触发重新部署
   - 或手动点击 **Redeploy** 按钮

### 方法二：通过 Vercel CLI 配置

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 进入项目目录
cd /path/to/your/project

# 添加环境变量
vercel env add COZE_SUPABASE_URL production
# 输入：https://your-project.supabase.co

vercel env add COZE_SUPABASE_ANON_KEY production
# 输入：你的 anon key

# 查看所有环境变量
vercel env ls

# 重新部署
vercel --prod
```

### 方法三：通过 vercel.json 配置

创建或编辑 `vercel.json` 文件：

```json
{
  "env": {
    "COZE_SUPABASE_URL": "https://your-project.supabase.co",
    "COZE_SUPABASE_ANON_KEY": "your-anon-key-here"
  },
  "build": {
    "env": {
      "COZE_SUPABASE_URL": "https://your-project.supabase.co"
    }
  }
}
```

---

## 🔷 Netlify 配置

### 方法一：通过 Dashboard 配置

1. **登录 Netlify**
   ```
   https://app.netlify.com
   ```

2. **选择你的项目**

3. **进入 Site settings**
   - 点击项目名称
   - 选择 **Site configuration** → **Build & deploy**

4. **添加环境变量**
   - 滚动到 **Environment variables** 部分
   - 点击 **Add variable** 按钮
   - 输入：
     ```
     Key: COZE_SUPABASE_URL
     Value: https://your-project.supabase.co
     ```
   - 点击 **Save**
   - 重复添加其他环境变量

5. **重新部署**
   - 点击 **Trigger deploy** → **Deploy site**

### 方法二：通过 Netlify CLI 配置

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 进入项目目录
cd /path/to/your/project

# 添加环境变量
netlify env:set COZE_SUPABASE_URL "https://your-project.supabase.co"

netlify env:set COZE_SUPABASE_ANON_KEY "your-anon-key-here"

# 查看所有环境变量
netlify env:list

# 重新部署
netlify deploy --prod
```

### 方法三：通过 netlify.toml 配置

创建或编辑 `netlify.toml` 文件：

```toml
[build]
  command = "pnpm run build"
  publish = ".next"

[build.environment]
  COZE_SUPABASE_URL = "https://your-project.supabase.co"
  COZE_SUPABASE_ANON_KEY = "your-anon-key-here"
```

**⚠️ 注意**：`netlify.toml` 中的环境变量会暴露在版本控制中，敏感信息不建议通过此方式配置。

---

## 🚂 Railway 配置

### 方法一：通过 Dashboard 配置

1. **登录 Railway**
   ```
   https://railway.app
   ```

2. **选择你的项目**

3. **进入项目设置**
   - 点击项目名称
   - 选择 **Variables** 标签

4. **添加环境变量**
   - 点击 **+ New Variable**
   - 输入变量名和值
   - 点击 **Add Variable**
   - 重复添加所有必需的环境变量

5. **重新部署**
   - Railway 会自动检测环境变量变化并重新部署

### 方法二：通过 Railway CLI 配置

```bash
# 安装 Railway CLI
npm install -g @railway/cli

# 登录
railway login

# 进入项目目录
cd /path/to/your/project

# 添加环境变量
railway variables set COZE_SUPABASE_URL=https://your-project.supabase.co

railway variables set COZE_SUPABASE_ANON_KEY=your-anon-key-here

# 查看所有环境变量
railway variables list

# 重新部署
railway up
```

---

## 🐳 Docker 配置

### 方法一：使用 Dockerfile 创建镜像

1. **创建 `.dockerignore` 文件**：
```
node_modules
.next
.git
.env.local
*.log
```

2. **创建 `Dockerfile`**：
```dockerfile
FROM node:20-alpine AS base

# 安装依赖
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# 构建应用
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG COZE_SUPABASE_URL
ARG COZE_SUPABASE_ANON_KEY
ENV COZE_SUPABASE_URL=${COZE_SUPABASE_URL}
ENV COZE_SUPABASE_ANON_KEY=${COZE_SUPABASE_ANON_KEY}
RUN pnpm run build

# 运行应用
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 5000

CMD ["node", "server.js"]
```

3. **构建和运行**：
```bash
# 构建镜像
docker build \
  --build-arg COZE_SUPABASE_URL=https://your-project.supabase.co \
  --build-arg COZE_SUPABASE_ANON_KEY=your-anon-key-here \
  -t your-app-name .

# 运行容器
docker run -d \
  -p 5000:5000 \
  -e COZE_SUPABASE_URL=https://your-project.supabase.co \
  -e COZE_SUPABASE_ANON_KEY=your-anon-key-here \
  your-app-name
```

### 方法二：使用 docker-compose.yml

创建 `docker-compose.yml` 文件：

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        COZE_SUPABASE_URL: https://your-project.supabase.co
        COZE_SUPABASE_ANON_KEY: your-anon-key-here
    environment:
      - COZE_SUPABASE_URL=https://your-project.supabase.co
      - COZE_SUPABASE_ANON_KEY=your-anon-key-here
    ports:
      - "5000:5000"
    restart: unless-stopped
```

运行：
```bash
docker-compose up -d
```

### 方法三：使用 .env 文件

1. **创建生产环境 `.env` 文件**（不要提交到Git）：
```bash
COZE_SUPABASE_URL=https://your-project.supabase.co
COZE_SUPABASE_ANON_KEY=your-anon-key-here
```

2. **确保 `.env` 在 `.gitignore` 中**：
```
.env
.env.local
.env.production
```

3. **运行容器时挂载环境文件**：
```bash
docker run -d \
  -p 5000:5000 \
  --env-file .env \
  your-app-name
```

---

## 🔧 Render 配置

1. **登录 Render**
   ```
   https://render.com
   ```

2. **创建或编辑项目**

3. **配置环境变量**
   - 进入项目设置
   - 找到 **Environment** 部分
   - 添加环境变量：
     ```
     COZE_SUPABASE_URL=https://your-project.supabase.co
     COZE_SUPABASE_ANON_KEY=your-anon-key-here
     ```

4. **触发重新部署**

---

## ☁️ Cloudflare Pages 配置

1. **登录 Cloudflare Dashboard**
   ```
   https://dash.cloudflare.com
   ```

2. **选择你的 Pages 项目**

3. **进入 Settings**
   - 点击 **Settings** → **Functions**

4. **添加环境变量**
   - 点击 **Add variable**
   - 输入变量名和值
   - 选择环境：Production / Preview / Development
   - 点击 **Save**

5. **重新部署**

---

## 📝 通用最佳实践

### 1. 安全性

✅ **应该做的**：
- 在部署平台中配置环境变量
- 使用强密码和安全的API密钥
- 定期轮换API密钥
- 使用不同环境的独立数据库

❌ **不应该做的**：
- 将敏感信息提交到Git
- 在代码中硬编码凭据
- 在客户端代码中暴露密钥
- 共享你的`.env`文件

### 2. 环境隔离

为不同环境配置独立的数据库：

```bash
# 开发环境
COZE_SUPABASE_URL=https://dev-project.supabase.co
COZE_SUPABASE_ANON_KEY=dev-anon-key

# 预览环境
COZE_SUPABASE_URL=https://preview-project.supabase.co
COZE_SUPABASE_ANON_KEY=preview-anon-key

# 生产环境
COZE_SUPABASE_URL=https://prod-project.supabase.co
COZE_SUPABASE_ANON_KEY=prod-anon-key
```

### 3. 验证配置

部署后，验证环境变量是否正确配置：

```bash
# 方法1：检查部署日志
# 在部署平台查看构建日志，确认环境变量已加载

# 方法2：测试API端点
curl https://your-domain.com/api/products?limit=1
curl https://your-domain.com/api/blog?limit=1

# 方法3：检查浏览器控制台
# 访问网站，打开开发者工具，查看网络请求和错误信息
```

### 4. 故障排查

**问题1：API返回500错误**
```
检查项：
- COZE_SUPABASE_URL 是否正确
- COZE_SUPABASE_ANON_KEY 是否有效
- Supabase项目是否正常运行
- 数据库权限是否正确
```

**问题2：博客页面显示"No blog posts available"**
```
检查项：
- 环境变量是否配置
- blog_posts表是否有数据
- 依次运行 blog-table-quick-fix.sql 和 blog-init-fixed.sql
- 检查published字段是否为true
```

**问题3：产品页面无法加载**
```
检查项：
- products表是否有数据
- API响应格式是否正确
- 网络请求是否成功
- 浏览器控制台是否有错误
```

---

## 🎯 快速检查清单

部署前确认：

- [ ] Supabase项目已创建
- [ ] 已获取 Supabase URL 和 Anon Key
- [ ] 在部署平台中配置了所有必需的环境变量
- [ ] 数据库表已创建（products, blog_posts等）
- [ ] 已运行数据库初始化脚本
- [ ] 本地环境测试通过
- [ ] 代码已提交到Git仓库
- [ ] 已连接部署平台到Git仓库

部署后验证：

- [ ] 网站可以正常访问
- [ ] `/api/products` 返回产品数据
- [ ] `/api/blog` 返回博客数据
- [ ] 产品页面显示产品列表
- [ ] 博客页面显示博客列表
- [ ] 浏览器控制台无错误
- [ ] API响应正常

> 💡 **详细测试方法**：查看 [TESTING_GUIDE.md](./TESTING_GUIDE.md) 获取完整的测试验证指南，包括：
> - 使用 curl、浏览器、Postman 等多种测试工具
> - 错误诊断和解决方案
> - 性能基准测试
> - 自动化测试脚本

---

## 📞 获取帮助

如果遇到问题：

1. **查看部署日志**：所有平台都提供详细的构建日志
2. **检查Supabase状态**：[Supabase Status Page](https://status.supabase.com)
3. **验证Supabase连接**：在Supabase Dashboard中测试API连接
4. **查阅文档**：
   - [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
   - [Netlify Environment Variables](https://docs.netlify.com/configure-builds/environment-variables)
   - [Railway Environment Variables](https://docs.railway.app/reference/variables)
5. **联系支持**：各平台都提供技术支持

---

## 📚 相关文档

- [DEPLOYMENT.md](./DEPLOYMENT.md) - 部署问题排查指南
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - 部署验证测试指南
- [blog-table-quick-fix.sql](./blog-table-quick-fix.sql) - blog 表结构修复脚本
- [blog-init-fixed.sql](./blog-init-fixed.sql) - blog 示例数据初始化脚本
- [Supabase Documentation](https://supabase.com/docs)
