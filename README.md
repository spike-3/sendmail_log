# Sendmail 日志分析工具

一个全面的 Sendmail 邮件服务器日志分析工具，提供多维度可视化分析。

## 🚀 快速开始

### 最简单的方法（推荐）

项目已经构建完成，您可以直接使用：

```bash
# 方式1：直接打开文件
# 进入 dist 目录，双击打开 index.html

# 方式2：启动本地服务器（推荐）
npm run preview
# 然后访问 http://localhost:4173
```

### 使用 Docker（最简单部署）

```bash
# 使用 docker-compose
docker-compose up -d

# 访问 http://localhost:8080
```

### 从源代码构建

```bash
# 1. 安装依赖
npm install

# 2. 构建项目
npm run build

# 3. 运行
npm run preview
```

## 📖 使用工具

1. 打开工具界面
2. 上传 Sendmail 日志文件（或加载示例数据）
3. 通过标签页切换分析维度：
   - 总览、时间分布、发件人、收件人
   - 错误分析、延迟分析、中继路由
   - DKIM 分析、IP 分析、消息流
4. 导出分析报告

## 📥 获取日志文件

```bash
# CentOS/RHEL
tail -1000 /var/log/maillog > maillog.log

# Ubuntu/Debian
tail -1000 /var/log/mail.log > maillog.log

# 提取特定日期
grep "Jan 15" /var/log/maillog > jan15.log
```

## 📁 文件说明

- `dist/` - **构建好的文件，可以直接使用**
- `src/` - 源代码
- `start.bat` / `start.sh` - 启动脚本
- `Dockerfile` - Docker 配置
- `docker-compose.yml` - Docker Compose 配置

## 🌐 部署到服务器

### Nginx

```bash
# 将 dist 目录复制到 nginx 目录
cp -r dist/* /usr/share/nginx/html/
```

### Apache

```bash
# 将 dist 目录复制到 apache 目录
cp -r dist/* /var/www/html/
```

### Docker

```bash
docker-compose up -d
```

## ❓ 常见问题

**Q: 为什么不能直接打开使用？**  
A: 这是前端项目，需要构建。构建后的文件在 `dist` 目录，可以直接使用。

**Q: npm install 很慢？**  
A: 使用国内镜像：`npm config set registry https://registry.npmmirror.com`

**Q: 可以离线使用吗？**  
A: 可以！构建后的 `dist` 目录可以完全离线使用。

## 📚 详细文档

- [使用指南](使用指南.md) - 详细使用说明
- [快速开始](快速开始.md) - 快速入门
- [使用说明](使用说明.md) - 完整中文说明

## 🛠️ 技术栈

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Recharts

## 📄 许可证

MIT License
