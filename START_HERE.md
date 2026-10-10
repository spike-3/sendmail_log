# ⚡ 立即开始使用

## 您下载的是源代码，需要先构建才能使用

## 🎯 三种使用方法（选一种）

### 方法一：直接使用已构建的文件 ⭐ 最简单

```bash
# 1. 进入 dist 目录
cd dist

# 2. 双击打开 index.html 文件
# 或者在浏览器中打开这个文件
```

### 方法二：启动本地服务器 ⭐ 推荐

```bash
# 在项目根目录运行
npm run preview

# 然后在浏览器中访问
http://localhost:4173
```

### 方法三：使用 Docker ⭐ 最适合部署

```bash
# 启动容器
docker-compose up -d

# 访问
http://localhost:8080
```

## 📋 前提条件

- **方法一**：无需任何条件，直接使用
- **方法二**：需要安装 Node.js（https://nodejs.org/）
- **方法三**：需要安装 Docker（https://docker.com/）

## 🚀 使用工具

1. 打开工具界面
2. 点击"选择文件"上传日志文件
3. 或点击"加载示例数据"查看演示
4. 通过标签页切换分析维度
5. 导出分析报告

## 📥 日志文件位置

```bash
# CentOS/RHEL
/var/log/maillog

# Ubuntu/Debian
/var/log/mail.log

# 提取日志
tail -1000 /var/log/maillog > my-log.log
```

## ❓ 遇到问题？

- 查看 [使用指南](使用指南.md)
- 查看 [快速开始](快速开始.md)
- 查看 [详细说明](使用说明.md)

## 💡 提示

- 最简单：直接打开 `dist/index.html`
- 最推荐：使用 `npm run preview`
- 最专业：使用 Docker 部署
