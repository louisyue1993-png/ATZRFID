#!/bin/bash

# 后台管理系统配置脚本
# 用于快速配置环境变量和初始化数据库

echo "==================================="
echo "  后台管理系统配置向导"
echo "==================================="
echo ""

# 检查是否已设置环境变量
if [ -f .env.local ]; then
    echo "✓ 发现现有的 .env.local 文件"
    read -p "是否要覆盖现有配置？(y/N): " overwrite
    if [[ ! $overwrite =~ ^[Yy]$ ]]; then
        echo "配置已取消"
        exit 0
    fi
fi

# 收集 Supabase 凭证
echo ""
echo "请输入 Supabase 凭证："
echo "（您可以在 Supabase 项目的 Settings → API 中找到这些信息）"
echo ""

read -p "Supabase Project URL: " supabase_url
read -p "Supabase Anon Key: " supabase_anon_key

# 收集管理员密码
echo ""
echo "设置管理员密码（用于登录后台管理系统）："
read -sp "管理员密码: " admin_password
echo ""
read -sp "确认密码: " admin_password_confirm
echo ""

if [ "$admin_password" != "$admin_password_confirm" ]; then
    echo "❌ 密码不匹配"
    exit 1
fi

# 创建 .env.local 文件
cat > .env.local << EOF
COZE_SUPABASE_URL=$supabase_url
COZE_SUPABASE_ANON_KEY=$supabase_anon_key
ADMIN_PASSWORD=$admin_password
EOF

echo ""
echo "✓ 环境变量已保存到 .env.local"

# 显示下一步操作
echo ""
echo "==================================="
echo "  配置完成！"
echo "==================================="
echo ""
echo "下一步操作："
echo ""
echo "1. 确保在 Supabase 中创建了必需的数据表："
echo "   - products"
echo "   - blog_posts"
echo ""
echo "2. （可选）导入初始产品数据："
echo "   npm run import-products"
echo ""
echo "3. 启动开发服务器："
echo "   pnpm dev"
echo ""
echo "4. 访问后台管理："
echo "   http://localhost:5000/admin/login"
echo ""
echo "5. 使用您设置的管理员密码登录"
echo ""
