# ========================================
# API 测试脚本 (PowerShell)
# ========================================
# 使用方法：
# 1. 修改下方的 DOMAIN 变量为你的实际域名
# 2. 运行脚本：powershell -ExecutionPolicy Bypass -File test-api.ps1
# ========================================

# 🔧 配置你的域名
$DOMAIN = "your-domain.com"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🧪 ATZ RFID API 测试工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📡 域名: $DOMAIN" -ForegroundColor Yellow
Write-Host ""

# 测试函数
function Test-API {
    param(
        [string]$Endpoint,
        [string]$Description,
        [string]$CheckField
    )
    
    Write-Host "🔍 测试: $Description" -ForegroundColor White
    Write-Host "   端点: $Endpoint" -ForegroundColor Gray
    
    try {
        $url = "https://${DOMAIN}${Endpoint}"
        $response = Invoke-RestMethod -Uri $url -Method Get -ErrorAction Stop
        
        if ($response.success -eq $true) {
            $count = $response.$CheckField.Count
            Write-Host "   ✅ 成功 - 返回 $count 条记录" -ForegroundColor Green
            Write-Host ""
        }
        else {
            $error = $response.error
            Write-Host "   ❌ 失败 - $error" -ForegroundColor Red
            Write-Host ""
        }
    }
    catch {
        Write-Host "   ❌ 请求失败 - $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
    }
}

# 执行测试
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📊 产品 API 测试" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Test-API "/api/products?limit=1" "获取单个产品" "products"
Test-API "/api/products?limit=5" "获取5个产品" "products"
Test-API "/api/products?limit=1&category=rfid-wristbands" "按分类筛选（腕带）" "products"
Test-API "/api/products?search=rfid" "搜索产品" "products"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📝 博客 API 测试" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Test-API "/api/blog?limit=1" "获取单篇博客" "posts"
Test-API "/api/blog?limit=5" "获取5篇博客" "posts"
Test-API "/api/blog?category=Technology" "按分类筛选（技术）" "posts"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✨ 测试完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 提示：" -ForegroundColor Yellow
Write-Host "   - 如果看到 ❌，请检查环境变量配置" -ForegroundColor White
Write-Host "   - 如果看到 ⚠️，请检查 API 响应格式" -ForegroundColor White
Write-Host "   - 详细测试方法：查看 TESTING_GUIDE.md" -ForegroundColor White
Write-Host "   - 配置问题：查看 ENV_CONFIG_GUIDE.md" -ForegroundColor White
Write-Host ""
