@echo off
chcp 65001 >nul
REM Sendmail 日志分析工具 - 启动脚本 (Windows)

echo ===================================
echo   Sendmail 日志分析工具
echo ===================================
echo.

REM 检查 Node.js 是否安装
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 错误: 未检测到 Node.js
    echo.
    echo 请先安装 Node.js:
    echo   下载地址: https://nodejs.org/
    echo   选择 LTS 版本安装
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js 版本:
node -v
echo ✅ npm 版本:
npm -v
echo.

REM 检查是否已安装依赖
if not exist "node_modules\" (
    echo 📦 首次运行，正在安装依赖...
    echo 这可能需要几分钟，请耐心等待...
    echo.
    call npm install
    
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo ❌ 依赖安装失败
        echo 请检查网络连接或尝试手动运行: npm install
        pause
        exit /b 1
    )
    
    echo.
    echo ✅ 依赖安装完成
    echo.
)

REM 构建项目
echo 🔨 正在构建项目...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ 构建失败
    pause
    exit /b 1
)

echo.
echo ✅ 构建完成
echo.
echo ===================================
echo   启动方式
echo ===================================
echo.
echo 方式1: 启动本地服务器（推荐）
echo   运行: npm run preview
echo   然后访问: http://localhost:4173
echo.
echo 方式2: 直接打开文件
echo   打开: dist\index.html
echo.
echo ===================================
echo.

REM 询问是否启动预览服务器
set /p START_PREVIEW="是否立即启动预览服务器？(y/n): "

if /i "%START_PREVIEW%"=="y" (
    echo.
    echo 🚀 启动预览服务器...
    echo 按 Ctrl+C 停止服务器
    echo.
    call npm run preview
) else (
    echo.
    echo 您可以稍后运行: npm run preview
    echo.
)

pause
