# 部署验证测试指南

本文档提供详细的测试步骤，帮助你验证部署是否成功。

## 🧪 测试方法

### 方法1：使用 curl 命令（推荐）

#### 测试产品API

```bash
# 测试产品API（获取1个产品）
curl -s https://your-domain.com/api/products?limit=1 | jq '.'

# 或者不格式化输出
curl -s https://your-domain.com/api/products?limit=1

# 测试产品API（获取5个产品）
curl -s https://your-domain.com/api/products?limit=5 | jq '.products[] | {id, name, price}'
```

**期望输出**（格式化后）：
```json
{
  "success": true,
  "products": [
    {
      "id": "4551864a-3418-4d05-87c3-b1fea10ccaca",
      "name": "HF Glass Tag",
      "title": "HF RFID Glass Tag - 13.56MHz",
      "price": "$0.28",
      "category": "hf-nfc-tags",
      "image": "/products/product-27.jpg",
      ...
    }
  ],
  "count": 1
}
```

#### 测试博客API

```bash
# 测试博客API（获取1篇文章）
curl -s https://your-domain.com/api/blog?limit=1 | jq '.'

# 测试博客API（获取3篇文章）
curl -s https://your-domain.com/api/blog?limit=3 | jq '.posts[] | {id, title, category}'
```

**期望输出**（格式化后）：
```json
{
  "success": true,
  "posts": [
    {
      "id": 2,
      "slug": "future-of-rfid-technology-2025",
      "title": "The Future of RFID Technology: Trends to Watch in 2025",
      "category": "Technology",
      "published": true,
      "createdAt": "2026-02-13T19:47:51.764801+08:00",
      ...
    }
  ],
  "count": 1
}
```

### 方法2：使用浏览器开发者工具

#### 测试产品API

1. 打开浏览器访问 `https://your-domain.com/api/products?limit=1`
2. 或者按 F12 打开开发者工具
3. 切换到 **Network** 标签
4. 刷新页面或手动请求API
5. 查看响应数据

**验证点**：
- ✅ Status Code: 200
- ✅ Response 包含 `"success": true`
- ✅ Response 包含 `products` 数组
- ❌ 不应该出现 `"error"` 字段

#### 测试博客API

1. 打开浏览器访问 `https://your-domain.com/api/blog?limit=1`
2. 在开发者工具 Network 标签中查看响应

**验证点**：
- ✅ Status Code: 200
- ✅ Response 包含 `"success": true`
- ✅ Response 包含 `posts` 数组
- ✅ `published` 字段为 `true`

### 方法3：使用浏览器直接访问

#### 访问产品页面

```
https://your-domain.com/products
```

**验证点**：
- ✅ 页面正常加载，无空白页面
- ✅ 显示产品列表（至少1个产品）
- ✅ 产品图片正常显示
- ✅ 产品信息（名称、价格、描述）正确
- ✅ 浏览器控制台无错误（F12 → Console）

#### 访问博客页面

```
https://your-domain.com/blog
```

**验证点**：
- ✅ 页面正常加载
- ✅ 显示博客文章列表（至少1篇文章）
- ✅ 博客封面图片正常显示
- ✅ 文章标题和摘要正确
- ✅ 浏览器控制台无错误

### 方法4：使用在线API测试工具

#### 使用 Postman

1. 创建新请求：
   ```
   Method: GET
   URL: https://your-domain.com/api/products?limit=1
   ```
2. 点击 **Send**
3. 查看响应

#### 使用 Insomnia

1. 创建新请求
2. 设置方法为 GET
3. 输入 URL
4. 点击 Send
5. 查看响应

#### 使用在线工具

- [HTTPie](https://httpie.io/app)
- [REST Client](https://rest-client.net)
- [Hoppscotch](https://hoppscotch.io)

---

## 🔍 响应状态码说明

### 成功状态

| Status Code | 说明 | 含义 |
|------------|------|------|
| 200 OK | 成功 | 请求成功，返回数据 |
| 201 Created | 已创建 | 资源创建成功 |
| 204 No Content | 无内容 | 请求成功，无返回内容 |

### 错误状态

| Status Code | 说明 | 可能原因 |
|------------|------|---------|
| 400 Bad Request | 错误请求 | 请求参数错误 |
| 401 Unauthorized | 未授权 | 认证失败 |
| 404 Not Found | 未找到 | 资源不存在 |
| 500 Internal Server Error | 服务器错误 | 数据库连接失败或配置错误 |
| 503 Service Unavailable | 服务不可用 | 服务暂时不可用 |

---

## ❌ 常见错误诊断

### 错误1：401 Unauthorized

**症状**：
```json
{
  "error": "Unauthorized"
}
```

**原因**：
- API密钥无效或过期
- 认证配置错误

**解决方法**：
```bash
# 1. 检查环境变量是否配置
# 在部署平台查看环境变量设置

# 2. 重新获取 Supabase 凭据
# 访问 Supabase Dashboard → Settings → API
# 复制最新的 Project URL 和 anon public key

# 3. 更新环境变量
# 在部署平台更新 COZE_SUPABASE_ANON_KEY

# 4. 重新部署应用
# 触发重新部署

# 5. 再次测试
curl -s https://your-domain.com/api/products?limit=1
```

### 错误2：500 Internal Server Error

**症状**：
```json
{
  "error": "COZE_SUPABASE_URL is not set"
}
```

**原因**：
- 环境变量未配置
- 环境变量名称错误
- 配置后未重新部署

**解决方法**：
```bash
# 1. 检查环境变量配置
# 确认以下变量已配置：
# - COZE_SUPABASE_URL
# - COZE_SUPABASE_ANON_KEY

# 2. 检查变量名称拼写
# 注意大小写和下划线

# 3. 重新部署
# 配置环境变量后必须重新部署

# 4. 查看部署日志
# 检查构建日志确认变量已加载
```

### 错误3：数据返回为空

**症状**：
```json
{
  "success": true,
  "products": [],
  "count": 0
}
```

**原因**：
- 数据库表为空
- 查询条件不匹配

**解决方法**：
```bash
# 1. 检查数据库是否有数据
# 在 Supabase SQL Editor 中运行：
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM blog_posts WHERE published = true;

# 2. 初始化数据库
# 运行 database-init.sql 文件

# 3. 验证数据已插入
SELECT id, name FROM products LIMIT 5;
SELECT id, title, published FROM blog_posts LIMIT 5;

# 4. 重新测试API
curl -s https://your-domain.com/api/products?limit=5
curl -s https://your-domain.com/api/blog?limit=5
```

### 错误4：页面加载缓慢或超时

**症状**：
- API请求超时
- 页面加载时间过长

**解决方法**：
```bash
# 1. 检查 Supabase 项目状态
# 访问 Supabase Dashboard 查看项目是否正常运行

# 2. 测试 Supabase 连接
# 在 Supabase SQL Editor 中运行查询测试连接

# 3. 检查网络延迟
# 使用 ping 测试延迟：
ping your-domain.com

# 4. 查看部署日志
# 检查是否有数据库连接超时错误
```

---

## ✅ 完整验证清单

### API 验证

- [ ] 产品API返回数据：
  ```bash
  curl -s https://your-domain.com/api/products?limit=1 | jq '.success'
  # 期望输出：true
  ```

- [ ] 博客API返回数据：
  ```bash
  curl -s https://your-domain.com/api/blog?limit=1 | jq '.success'
  # 期望输出：true
  ```

- [ ] 响应状态码为200：
  ```bash
  curl -I https://your-domain.com/api/products?limit=1
  # 期望输出：HTTP/1.1 200 OK
  ```

- [ ] 响应包含数据字段：
  ```bash
  curl -s https://your-domain.com/api/products?limit=1 | jq 'has("products")'
  # 期望输出：true

  curl -s https://your-domain.com/api/blog?limit=1 | jq 'has("posts")'
  # 期望输出：true
  ```

### 前端页面验证

- [ ] 产品页面正常加载：
  ```
  访问：https://your-domain.com/products
  检查：
  ✅ 页面无空白
  ✅ 显示产品列表
  ✅ 图片加载正常
  ```

- [ ] 博客页面正常加载：
  ```
  访问：https://your-domain.com/blog
  检查：
  ✅ 页面无空白
  ✅ 显示博客列表
  ✅ 图片加载正常
  ```

- [ ] 浏览器控制台无错误：
  ```
  F12 → Console
  检查：
  ✅ 无红色错误信息
  ✅ 无警告信息
  ```

### 数据验证

- [ ] 产品数据完整：
  ```bash
  curl -s https://your-domain.com/api/products?limit=1 | \
  jq '.products[0] | {id, name, price, category, image}'
  # 检查所有字段都有值
  ```

- [ ] 博客数据完整：
  ```bash
  curl -s https://your-domain.com/api/blog?limit=1 | \
  jq '.posts[0] | {id, title, category, published}'
  # 检查所有字段都有值
  ```

### 性能验证

- [ ] API响应时间合理：
  ```bash
  time curl -s https://your-domain.com/api/products?limit=1 > /dev/null
  # 期望：响应时间 < 2秒
  ```

- [ ] 页面加载时间合理：
  ```
  F12 → Network
  检查：
  ✅ 页面完全加载时间 < 5秒
  ✅ API请求时间 < 1秒
  ```

---

## 🛠️ 高级测试

### 测试分页功能

```bash
# 测试分页
curl -s https://your-domain.com/api/products?limit=10&offset=0 | jq '.count'

# 测试第二页
curl -s https://your-domain.com/api/products?limit=10&offset=10 | jq '.products[] | .id'
```

### 测试筛选功能

```bash
# 按分类筛选
curl -s "https://your-domain.com/api/products?category=rfid-wristbands" | \
jq '.products[] | {name, category}'

# 按子分类筛选
curl -s "https://your-domain.com/api/products?subcategory=pvc-wristbands" | \
jq '.products[] | {name, subCategory}'
```

### 测试搜索功能

```bash
# 搜索产品
curl -s "https://your-domain.com/api/products?search=rfid" | \
jq '.products[] | {name, title}'

# 搜索博客
curl -s "https://your-domain.com/api/blog?category=Technology" | \
jq '.posts[] | {title, category}'
```

### 测试单个资源

```bash
# 获取单个产品（需要有效的产品ID）
curl -s "https://your-domain.com/api/products?id=4551864a-3418-4d05-87c3-b1fea10ccaca" | \
jq '.'

# 获取单篇博客（需要有效的slug）
curl -s "https://your-domain.com/api/blog?slug=future-of-rfid-technology-2025" | \
jq '.'
```

---

## 📊 性能基准

### API 响应时间基准

| 端点 | 期望响应时间 | 警告阈值 |
|------|------------|---------|
| `/api/products` | < 500ms | > 1s |
| `/api/blog` | < 300ms | > 800ms |
| `/api/products?id=xxx` | < 200ms | > 500ms |
| `/api/blog?slug=xxx` | < 200ms | > 500ms |

### 页面加载时间基准

| 页面 | 期望加载时间 | 警告阈值 |
|------|------------|---------|
| `/` (首页) | < 2s | > 5s |
| `/products` | < 3s | > 8s |
| `/blog` | < 2s | > 5s |
| `/admin/login` | < 1s | > 3s |

---

## 🎯 一键测试脚本

### Linux/macOS

创建文件 `test-deploy.sh`：

```bash
#!/bin/bash

DOMAIN="https://your-domain.com"

echo "🧪 开始测试部署..."
echo ""

# 测试产品API
echo "1️⃣ 测试产品API..."
PRODUCTS_RESPONSE=$(curl -s "$DOMAIN/api/products?limit=1")
PRODUCTS_SUCCESS=$(echo $PRODUCTS_RESPONSE | jq -r '.success')
if [ "$PRODUCTS_SUCCESS" == "true" ]; then
  echo "✅ 产品API正常"
else
  echo "❌ 产品API失败"
  echo "$PRODUCTS_RESPONSE"
fi
echo ""

# 测试博客API
echo "2️⃣ 测试博客API..."
BLOG_RESPONSE=$(curl -s "$DOMAIN/api/blog?limit=1")
BLOG_SUCCESS=$(echo $BLOG_RESPONSE | jq -r '.success')
if [ "$BLOG_SUCCESS" == "true" ]; then
  echo "✅ 博客API正常"
else
  echo "❌ 博客API失败"
  echo "$BLOG_RESPONSE"
fi
echo ""

# 测试产品页面
echo "3️⃣ 测试产品页面..."
PRODUCTS_PAGE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/products")
if [ "$PRODUCTS_PAGE_STATUS" == "200" ]; then
  echo "✅ 产品页面正常 (HTTP $PRODUCTS_PAGE_STATUS)"
else
  echo "❌ 产品页面失败 (HTTP $PRODUCTS_PAGE_STATUS)"
fi
echo ""

# 测试博客页面
echo "4️⃣ 测试博客页面..."
BLOG_PAGE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/blog")
if [ "$BLOG_PAGE_STATUS" == "200" ]; then
  echo "✅ 博客页面正常 (HTTP $BLOG_PAGE_STATUS)"
else
  echo "❌ 博客页面失败 (HTTP $BLOG_PAGE_STATUS)"
fi
echo ""

echo "✨ 测试完成！"
```

运行测试：
```bash
chmod +x test-deploy.sh
./test-deploy.sh
```

### Windows PowerShell

创建文件 `test-deploy.ps1`：

```powershell
$DOMAIN = "https://your-domain.com"

Write-Host "🧪 开始测试部署..."
Write-Host ""

# 测试产品API
Write-Host "1️⃣ 测试产品API..."
$productsResponse = Invoke-RestMethod -Uri "$DOMAIN/api/products?limit=1"
if ($productsResponse.success) {
    Write-Host "✅ 产品API正常"
} else {
    Write-Host "❌ 产品API失败"
    Write-Host $productsResponse
}
Write-Host ""

# 测试博客API
Write-Host "2️⃣ 测试博客API..."
$blogResponse = Invoke-RestMethod -Uri "$DOMAIN/api/blog?limit=1"
if ($blogResponse.success) {
    Write-Host "✅ 博客API正常"
} else {
    Write-Host "❌ 博客API失败"
    Write-Host $blogResponse
}
Write-Host ""

Write-Host "✨ 测试完成！"
```

运行测试：
```powershell
powershell -ExecutionPolicy Bypass -File test-deploy.ps1
```

---

## 📞 获取帮助

如果测试失败，按以下步骤排查：

1. **查看错误响应**：检查API返回的错误信息
2. **查看部署日志**：在部署平台查看构建和运行日志
3. **检查环境变量**：确认所有必需的环境变量已配置
4. **验证数据库**：确保 Supabase 项目正常运行
5. **查阅文档**：
   - [ENV_CONFIG_GUIDE.md](./ENV_CONFIG_GUIDE.md)
   - [DEPLOYMENT.md](./DEPLOYMENT.md)
   - [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

---

## 🎓 测试最佳实践

1. **定期测试**：部署后立即测试，定期验证
2. **记录结果**：保存测试结果，方便对比
3. **监控性能**：持续监控API响应时间
4. **自动化测试**：使用CI/CD集成测试
5. **版本控制**：记录每个部署的测试结果

---

**祝你测试顺利！** 🚀

如有问题，请查阅相关文档或联系技术支持。
