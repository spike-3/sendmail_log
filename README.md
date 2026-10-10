# Sendmail 日志分析工具

一个全面的 Sendmail 邮件服务器日志分析工具，提供多维度可视化分析。

## 功能特性

- 📊 **总览面板** - 邮件总量、成功率、投递状态分布
- 🕐 **时间分布** - 24小时/每日趋势分析
- 👤 **发件人分析** - 发件人排行与成功率统计
- 📧 **收件人分析** - 目标域名分布与投递分析
- ⚠️ **错误分析** - 错误类型分类与 DSN 状态码分析
- ⏱️ **延迟分析** - 延迟分布、P50/P90/P99 百分位统计
- 🔗 **中继路由** - 中继服务器与 Mailer 统计
- 📈 **消息流** - 发送/投递/退回趋势
- 🛡️ **DKIM 分析** - DKIM 签名验证结果分析
- 🌐 **IP 分析** - 源IP/目标IP 统计与可疑 IP 检测
- 📋 **原始日志** - 日志搜索与过滤
- 📖 **使用帮助** - 详细的使用指南

## 快速开始

### 方法一：直接使用构建后的文件（推荐）

如果您只想使用工具，不需要修改代码：

1. 确保已经运行过 `npm run build`
2. 打开 `dist/index.html` 文件即可使用
3. 或者将 `dist` 目录部署到任何 Web 服务器

### 方法二：从源代码运行

#### 环境要求

- Node.js 16+ 
- npm 或 yarn

#### 安装步骤

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（用于开发）
npm run dev

# 3. 构建生产版本
npm run build

# 4. 预览构建结果
npm run preview
```

#### 使用工具

1. 打开浏览器访问 `http://localhost:5173`（开发模式）或打开 `dist/index.html`
2. 点击"选择文件"上传 Sendmail 日志文件
3. 或点击"加载示例数据"查看功能演示
4. 通过顶部标签页切换不同分析维度
5. 点击"导出报告"下载 JSON 格式的分析结果

## 支持的日志格式

工具支持标准 syslog 格式的 Sendmail 日志：

```
Jan 15 08:01:23 mailserver sendmail[12345]: ABC12345: from=<user@example.com>, size=4521, ...
Jan 15 08:01:24 mailserver sendmail[12346]: ABC12345: to=<recipient@gmail.com>, delay=00:00:01, ...
Jan 15 08:01:20 mailserver sm-mta[12300]: ABC12345: DKIM: PASS d=example.com s=mail
Jan 15 08:01:22 mailserver sm-mta[12340]: connect from host.example.com [203.0.113.55]
```

## 获取日志文件

```bash
# 查看最近的邮件日志
tail -1000 /var/log/maillog

# 过滤 sendmail 相关日志
grep sendmail /var/log/maillog > sendmail-only.log

# 按日期过滤
grep "Jan 15" /var/log/maillog > jan15.log

# 过滤 DKIM 相关
grep -i dkim /var/log/maillog > dkim.log
```

## 部署

### 静态文件部署

构建后的 `dist` 目录可以直接部署到任何静态文件服务器：

- Nginx
- Apache
- GitHub Pages
- Netlify
- Vercel

### Docker 部署（可选）

创建 `Dockerfile`：

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
```

构建和运行：

```bash
docker build -t sendmail-log-analyzer .
docker run -p 8080:80 sendmail-log-analyzer
```

## 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Recharts（图表库）
- Lucide React（图标库）

## 常见问题

### Q: 为什么打开 index.html 没有反应？

A: 请确保您打开的是 `dist/index.html`（构建后的文件），而不是源代码目录中的 `index.html`。

### Q: 如何查看示例数据？

A: 在上传页面点击"加载示例数据"按钮即可查看工具的完整功能。

### Q: 日志文件太大怎么办？

A: 建议先使用 grep 过滤出需要的日志片段，例如：
```bash
grep "Jan 15" /var/log/maillog > jan15.log
```

### Q: 支持哪些 DKIM 日志格式？

A: 支持 OpenDKIM 和 sendmail milter 的标准日志格式，包括：
- `DKIM: PASS/FAIL d=domain s=selector`
- `DKIM verification result=...`
- `added DKIM-Signature`

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
