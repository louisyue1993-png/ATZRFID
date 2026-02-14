#!/bin/bash

# 产品详情页面测试脚本

echo "==================================="
echo "  测试产品详情页面"
echo "==================================="
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 获取所有产品ID
echo "1. 获取产品列表..."
echo "-------------------"

products_response=$(curl -s "http://localhost:5000/api/products?limit=100")
product_count=$(echo "$products_response" | grep -o '"id":"[^"]*"' | wc -l)

if [ "$product_count" -eq 0 ]; then
    echo -e "${RED}✗ 没有找到任何产品${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 找到 $product_count 个产品${NC}"
echo ""

# 测试每个产品详情页面
echo "2. 测试产品详情页面"
echo "-------------------"

passed=0
failed=0

echo "$products_response" | grep -o '"id":"[^"]*"' | while read id_line; do
    product_id=$(echo "$id_line" | sed 's/"id":"//g' | sed 's/"//g')
    
    # 获取产品名称
    product_name=$(echo "$products_response" | grep -o '"name":"[^"]*"' | head -1 | sed 's/"name":"//g' | sed 's/"//g')
    
    # 测试产品详情页面
    status_code=$(timeout 10 curl -s -o /dev/null -w "%{http_code}" "http://localhost:5000/products/$product_id" 2>/dev/null)
    
    if [ "$status_code" = "200" ]; then
        echo -e "${GREEN}✓${NC} $product_id ($product_name)"
        ((passed++))
    else
        echo -e "${RED}✗${NC} $product_id (HTTP $status_code)"
        ((failed++))
    fi
done

echo ""
echo "==================================="
echo "  测试完成"
echo "==================================="
echo -e "通过: ${GREEN}$passed${NC}"
echo -e "失败: ${RED}$failed${NC}"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}✓ 所有产品详情页面正常工作！${NC}"
    exit 0
else
    echo -e "${RED}✗ 部分产品详情页面失败${NC}"
    exit 1
fi
