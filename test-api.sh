#!/bin/bash

# ========================================
# API 测试脚本
# ========================================
# 使用方法：
# 1. 修改下方的 DOMAIN 变量为你的实际域名
# 2. 运行脚本：bash test-api.sh
# ========================================

# 🔧 配置你的域名
DOMAIN="your-domain.com"

# 检查是否安装了 jq
if ! command -v jq &> /dev/null; then
    echo "⚠️  警告：未安装 jq，将使用原始JSON输出"
    echo "   安装方法："
    echo "   - macOS: brew install jq"
    echo "   - Ubuntu/Debian: sudo apt-get install jq"
    echo "   - CentOS/RHEL: sudo yum install jq"
    echo ""
    USE_JQ=false
else
    USE_JQ=true
fi

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "========================================"
echo "🧪 ATZ RFID API 测试工具"
echo "========================================"
echo "📡 域名: ${BLUE}${DOMAIN}${NC}"
echo ""

# 测试函数
test_api() {
    local endpoint=$1
    local description=$2
    local check_field=$3
    
    echo "🔍 测试: ${description}"
    echo "   端点: ${endpoint}"
    
    response=$(curl -s "https://${DOMAIN}${endpoint}" 2>&1)
    status=$?
    
    if [ $status -eq 0 ]; then
        if [ "$USE_JQ" = true ]; then
            # 使用 jq 检查
            if echo "$response" | jq '.' > /dev/null 2>&1; then
                success=$(echo "$response" | jq -r '.success // "false"')
                if [ "$success" = "true" ]; then
                    count=$(echo "$response" | jq -r ".$check_field | length" 2>/dev/null || echo "N/A")
                    echo -e "   ✅ ${GREEN}成功${NC} - 返回 ${count} 条记录"
                    echo ""
                else
                    error=$(echo "$response" | jq -r '.error // "Unknown error"' 2>/dev/null)
                    echo -e "   ❌ ${RED}失败${NC} - ${error}"
                    echo ""
                fi
            else
                echo -e "   ⚠️  ${YELLOW}响应不是有效的JSON${NC}"
                echo "   响应内容: $response"
                echo ""
            fi
        else
            # 不使用 jq，直接显示前 5 行
            echo "   响应（前5行）:"
            echo "$response" | head -5
            echo ""
        fi
    else
        echo -e "   ❌ ${RED}请求失败${NC} - HTTP 状态码: $status"
        echo ""
    fi
}

# 执行测试
echo "========================================"
echo "📊 产品 API 测试"
echo "========================================"
echo ""

test_api "/api/products?limit=1" "获取单个产品" "products"
test_api "/api/products?limit=5" "获取5个产品" "products"
test_api "/api/products?limit=1&category=rfid-wristbands" "按分类筛选（腕带）" "products"
test_api "/api/products?search=rfid" "搜索产品" "products"

echo "========================================"
echo "📝 博客 API 测试"
echo "========================================"
echo ""

test_api "/api/blog?limit=1" "获取单篇博客" "posts"
test_api "/api/blog?limit=5" "获取5篇博客" "posts"
test_api "/api/blog?category=Technology" "按分类筛选（技术）" "posts"

echo "========================================"
echo "✨ 测试完成！"
echo "========================================"
echo ""
echo "💡 提示："
echo "   - 如果看到 ❌，请检查环境变量配置"
echo "   - 如果看到 ⚠️，请检查 API 响应格式"
echo "   - 详细测试方法：查看 TESTING_GUIDE.md"
echo "   - 配置问题：查看 ENV_CONFIG_GUIDE.md"
echo ""
