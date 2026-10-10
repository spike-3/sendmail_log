#!/bin/bash

# Sendmail 日志分析工具 - 启动脚本 (Linux/Mac)

echo "==================================="
echo "  Sendmail 日志分析工具"
echo "==================================="
echo ""

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未检测到 Node.js"
    echo ""
    echo "请先安装 Node.js:"
    echo "  下载地址: https://nodejs.org/"
    echo "  选择 LTS 版本安装"
    echo ""
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"
echo "✅ npm 版本: $(npm -v)"
echo ""

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，正在安装依赖..."
    echo "这可能需要几分钟，请耐心等待..."
    echo ""
    npm install
    
    if [ $? -ne 0 ]; then
        echo ""
        echo "❌ 依赖安装失败"
        echo "请检查网络连接或尝试手动运行: npm install"
        exit 1
    fi
    
    echo ""
    echo "✅ 依赖安装完成"
    echo ""
fi

# 构建项目
echo "🔨 正在构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ 构建失败"
    exit 1
fi

echo ""
echo "✅ 构建完成"
echo ""
echo "==================================="
echo "  启动方式"
echo "==================================="
echo ""
echo "方式1: 启动本地服务器（推荐）"
echo "  运行: npm run preview"
echo "  然后访问: http://localhost:4173"
echo ""
echo "方式2: 直接打开文件"
echo "  打开: dist/index.html"
echo ""
echo "==================================="
echo ""

# 询问是否启动预览服务器
read -p "是否立即启动预览服务器？(y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 启动预览服务器..."
    echo "按 Ctrl+C 停止服务器"
    echo ""
    npm run preview
fi
