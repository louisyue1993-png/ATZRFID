# Supabase + Vercel 部署总手册（唯一执行版本）

> 本文档是当前项目的**唯一推荐部署路径**。  
> 其它历史文档（尤其 `BLOG_FIX_*`）仅作为排障归档，不作为日常部署流程。

## 1. 部署目标

- 数据库：Supabase
- 托管：Vercel
- 前端/服务端：Next.js（App Router）
- 包管理器：pnpm

## 2. 必配环境变量

在 Vercel 项目中配置以下变量（`Production` / `Preview` / `Development` 都勾选）：

```bash
COZE_SUPABASE_URL=https://<your-project>.supabase.co
COZE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
ADMIN_PASSWORD=<a-strong-password>
NEXT_PUBLIC_SITE_URL=https://<your-vercel-domain>
```

说明：
- `COZE_SUPABASE_URL`、`COZE_SUPABASE_ANON_KEY`：后端 API 连接 Supabase。
- `ADMIN_PASSWORD`：后台 `/admin/login` 登录密码（强烈建议设置，避免默认值）。
- `NEXT_PUBLIC_SITE_URL`：用于服务端拼接 API 绝对地址（未设置时会回退 `http://localhost:5000`）。

## 3. Supabase 初始化（推荐顺序）

在 Supabase SQL Editor 依次执行：

1) `blog-table-quick-fix.sql`  
2) `blog-init-fixed.sql`

如果第 1 步报错或历史结构异常，再执行：
- `blog-table-complete-fix.sql`（彻底重建）

## 4. Vercel 部署步骤

1. 将仓库导入 Vercel。
2. Framework 选择 Next.js。
3. Install Command：`pnpm install`
4. Build Command：`npx next build`（与 `vercel.json` 保持一致）
5. 添加第 2 节全部环境变量。
6. 点击 Deploy 并等待完成。

## 5. 上线后验收

访问并确认：

- `https://<your-domain>/api/products?limit=1`
- `https://<your-domain>/api/blog?limit=1`
- `https://<your-domain>/products`
- `https://<your-domain>/blog`
- `https://<your-domain>/admin/login`

通过标准：
- API 返回 200 且包含数据数组。
- 产品页/博客页能正常渲染。
- 管理后台可登录（使用 `ADMIN_PASSWORD`）。

## 6. 常见失败点（按优先级）

1. **环境变量缺失或拼写错误**  
   - 报错常见：`COZE_SUPABASE_URL is not set`
2. **博客表结构与当前 API 不一致**  
   - 先跑 `blog-table-quick-fix.sql`
3. **RLS 导致匿名查询失败**  
   - 执行 `blog-fix-rls-policy.sql`
4. **部署后忘记重新触发构建**  
   - 变量更新后必须 Redeploy

## 7. 生产安全基线

- 必须设置强 `ADMIN_PASSWORD`，不要使用默认密码。
- 不要把真实密钥写入 `vercel.json`、`netlify.toml` 或仓库。
- `COZE_SUPABASE_ANON_KEY` 可以用于前后端公共查询，但仍需配合 RLS。
- 建议为生产与测试使用不同 Supabase 项目。

## 8. 文档使用规则

- 部署与初始化：只看本文档。
- 平台细节：参考 `ENV_CONFIG_GUIDE.md`。
- 联调排查：参考 `TESTING_GUIDE.md`。
- 历史修复过程：查看 `BLOG_FIX_*`（仅归档，不作为标准流程）。
