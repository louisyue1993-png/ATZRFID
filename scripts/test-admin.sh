#!/bin/bash

# 后台管理系统快速测试脚本

echo "==================================="
echo "  后台管理系统测试"
echo "==================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试计数器
PASSED=0
FAILED=0

# 测试函数
test_api() {
    local name=$1
    local url=$2
    local expected_code=$3

    echo -n "测试 $name... "

    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")

    if [ "$status_code" -eq "$expected_code" ]; then
        echo -e "${GREEN}✓ 通过${NC} (HTTP $status_code)"
        ((PASSED++))
    else
        echo -e "${RED}✗ 失败${NC} (HTTP $status_code, 期望 $expected_code)"
        ((FAILED++))
    fi
}

# 检查环境变量
echo "1. 检查环境变量"
echo "-------------------"

if [ -z "$COZE_SUPABASE_URL" ]; then
    echo -e "${YELLOW}⚠ COZE_SUPABASE_URL 未设置${NC}"
else
    echo -e "${GREEN}✓ COZE_SUPABASE_URL 已设置${NC}"
fi

if [ -z "$COZE_SUPABASE_ANON_KEY" ]; then
    echo -e "${YELLOW}⚠ COZE_SUPABASE_ANON_KEY 未设置${NC}"
else
    echo -e "${GREEN}✓ COZE_SUPABASE_ANON_KEY 已设置${NC}"
fi

if [ -z "$ADMIN_PASSWORD" ]; then
    echo -e "${YELLOW}⚠ ADMIN_PASSWORD 未设置${NC}"
else
    echo -e "${GREEN}✓ ADMIN_PASSWORD 已设置${NC}"
fi

echo ""

# 检查服务是否运行
echo "2. 检查服务状态"
echo "-------------------"

if curl -s -o /dev/null -w "%{http_code}" http://localhost:5000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ 服务正在运行 (端口 5000)${NC}"
else
    echo -e "${RED}✗ 服务未运行${NC}"
    exit 1
fi

echo ""

# 测试 API 端点
echo "3. 测试 API 端点"
echo "-------------------"

BASE_URL="http://localhost:5000"

test_api "前端页面" "$BASE_URL/products" 200
test_api "产品 API" "$BASE_URL/api/products" 200
test_api "后台登录页面" "$BASE_URL/admin/login" 200

echo ""

# 测试产品数据
echo "4. 测试产品数据"
echo "-------------------"

products_response=$(curl -s "$BASE_URL/api/products?limit=5")
product_count=$(echo "$products_response" | jq -r '.count // 0' 2>/dev/null)

if [ "$product_count" -gt 0 ]; then
    echo -e "${GREEN}✓ 数据库中有 $product_count 个产品${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ 数据库中没有产品数据${NC}"
    ((FAILED++))
fi

# 测试产品分类
categories=$(echo "$products_response" | jq -r '.products[].category' | sort -u | wc -l)
echo -e "${GREEN}✓ 有 $categories 个不同的产品分类${NC}"

echo ""

# 测试后台登录（需要密码）
echo "5. 测试后台登录"
echo "-------------------"

if [ -n "$ADMIN_PASSWORD" ]; then
    login_response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "{\"password\":\"$ADMIN_PASSWORD\"}" \
        -c /tmp/admin_cookies.txt \
        "$BASE_URL/api/admin/login")

    if echo "$login_response" | grep -q '"success":true'; then
        echo -e "${GREEN}✓ 后台登录成功${NC}"
        ((PASSED++))

        # 测试受保护的 API
        products_api_response=$(curl -s \
            -b /tmp/admin_cookies.txt \
            "$BASE_URL/api/admin/products")

        if echo "$products_api_response" | grep -q '"products"'; then
            echo -e "${GREEN}✓ 后台产品 API 正常工作${NC}"
            ((PASSED++))
        else
            echo -e "${RED}✗ 后台产品 API 失败${NC}"
            ((FAILED++))
        fi
    else
        echo -e "${RED}✗ 后台登录失败${NC}"
        echo "响应: $login_response"
        ((FAILED++))
    fi

    # 清理 cookies
    rm -f /tmp/admin_cookies.txt
else
    echo -e "${YELLOW}⚠ 跳过后台登录测试（未设置 ADMIN_PASSWORD）${NC}"
fi

echo ""

# 测试详情页面
echo "6. 测试产品详情页面"
echo "-------------------"

if [ "$product_count" -gt 0 ]; then
    first_product_id=$(echo "$products_response" | jq -r '.products[0].id')
    test_api "产品详情页面" "$BASE_URL/products/$first_product_id" 200
else
    echo -e "${YELLOW}⚠ 跳过详情页面测试（没有产品数据）${NC}"
fi

echo ""

# 总结
echo "==================================="
echo "  测试总结"
echo "==================================="
echo -e "通过: ${GREEN}$PASSED${NC}"
echo -e "失败: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ 所有测试通过！后台管理系统运行正常${NC}"
    exit 0
else
    echo -e "${RED}✗ 部分测试失败，请检查配置${NC}"
    exit 1
fi
