import { BookOpen, Upload, FileText, BarChart3, Shield, Globe, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export default function HelpGuide() {
  const [openSection, setOpenSection] = useState<string>('getting-started');

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? '' : id);
  };

  const sections: Section[] = [
    {
      id: 'getting-started',
      title: '快速开始',
      icon: <BookOpen size={18} />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">本工具用于分析 Sendmail 邮件服务器的日志文件，提供多维度的可视化分析。</p>
          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="font-semibold text-blue-400 mb-2">使用步骤：</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
              <li>准备 Sendmail 日志文件（通常为 <code className="px-1 bg-gray-800 rounded">/var/log/maillog</code> 或 <code className="px-1 bg-gray-800 rounded">/var/log/mail.log</code>）</li>
              <li>点击"选择文件"按钮上传日志，或直接拖拽文件到上传区域</li>
              <li>也可点击"加载示例数据"查看工具功能演示</li>
              <li>通过顶部标签页切换不同分析维度</li>
              <li>点击"导出报告"下载 JSON 格式的分析结果</li>
            </ol>
          </div>
          <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-3">
            <p className="text-sm text-green-300">💡 <strong>提示：</strong>日志文件可以是纯文本格式，工具会自动解析标准 syslog 格式的 sendmail 日志行。</p>
          </div>
        </div>
      ),
    },
    {
      id: 'log-format',
      title: '支持的日志格式',
      icon: <FileText size={18} />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">本工具支持以下日志格式：</p>
          
          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="font-semibold text-blue-400 mb-2">1. 标准 Syslog 格式</h4>
            <code className="text-xs text-green-400 block whitespace-pre-wrap">
{`Jan 15 08:01:23 mailserver sendmail[12345]: ABC12345: from=<user@example.com>, size=4521, ...
Jan 15 08:01:24 mailserver sendmail[12346]: ABC12345: to=<recipient@gmail.com>, delay=00:00:01, ...`}
            </code>
          </div>

          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="font-semibold text-blue-400 mb-2">2. sm-mta 进程日志</h4>
            <code className="text-xs text-green-400 block whitespace-pre-wrap">
{`Jan 15 08:01:20 mailserver sm-mta[12300]: ABC12345: DKIM: PASS d=example.com s=mail
Jan 15 08:01:22 mailserver sm-mta[12340]: connect from host.example.com [203.0.113.55]`}
            </code>
          </div>

          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="font-semibold text-blue-400 mb-2">3. DKIM/OpenDKIM 日志</h4>
            <code className="text-xs text-green-400 block whitespace-pre-wrap">
{`Jan 15 08:01:20 mailserver sm-mta[12300]: ABC12345: DKIM: PASS d=example.com s=mail
Jan 15 08:15:30 mailserver sm-mta[12302]: GHI34567: DKIM: FAIL d=shop.example.com s=selector1
Jan 15 10:15:35 mailserver sm-mta[12307]: STU78901: DKIM verification fail for domain bigcorp.net`}
            </code>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-lg p-3">
            <p className="text-sm text-yellow-300">⚠️ <strong>注意：</strong>日志必须包含标准 syslog 时间戳格式（如 <code>Jan 15 08:01:23</code>），否则该行将被跳过。</p>
          </div>
        </div>
      ),
    },
    {
      id: 'analysis-dimensions',
      title: '分析维度说明',
      icon: <BarChart3 size={18} />,
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-gray-900 rounded-lg p-3">
              <h4 className="font-semibold text-blue-400 text-sm mb-1">📊 总览</h4>
              <p className="text-xs text-gray-400">邮件总量、成功率、投递状态分布、Mailer 类型、邮件大小分布、队列状态</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-3">
              <h4 className="font-semibold text-blue-400 text-sm mb-1">🕐 时间分布</h4>
              <p className="text-xs text-gray-400">24小时发送量分布、每日趋势、峰值分析、工作/非工作时段对比</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-3">
              <h4 className="font-semibold text-blue-400 text-sm mb-1">👤 发件人分析</h4>
              <p className="text-xs text-gray-400">发件人排行、成功率统计、异常发件人识别</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-3">
              <h4 className="font-semibold text-blue-400 text-sm mb-1">📧 收件人分析</h4>
              <p className="text-xs text-gray-400">目标域名分布、投递成功率、域名集中度分析</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-3">
              <h4 className="font-semibold text-blue-400 text-sm mb-1">⚠️ 错误分析</h4>
              <p className="text-xs text-gray-400">错误类型分类、DSN 状态码分布、严重程度评估</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-3">
              <h4 className="font-semibold text-blue-400 text-sm mb-1">⏱️ 延迟分析</h4>
              <p className="text-xs text-gray-400">延迟分布直方图、P50/P90/P99 百分位、慢速投递记录、性能评级</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-3">
              <h4 className="font-semibold text-blue-400 text-sm mb-1">🔗 中继/路由</h4>
              <p className="text-xs text-gray-400">中继服务器排行、Mailer 统计、连接日志、路由分析</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-3">
              <h4 className="font-semibold text-blue-400 text-sm mb-1">📈 消息流</h4>
              <p className="text-xs text-gray-400">发送/投递/退回趋势、投递率变化、流量对比</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'dkim-analysis',
      title: 'DKIM 分析',
      icon: <Shield size={18} />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">DKIM (DomainKeys Identified Mail) 是一种邮件验证机制，通过数字签名验证邮件来源的真实性。</p>
          
          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="font-semibold text-blue-400 mb-2">如何启用 DKIM 日志：</h4>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-400 mb-1">1. 安装 OpenDKIM：</p>
                <code className="text-xs text-green-400 block bg-gray-800 p-2 rounded">
                  apt install opendkim opendkim-tools
                </code>
              </div>
              <div>
                <p className="text-gray-400 mb-1">2. 配置 Sendmail 集成（sendmail.mc）：</p>
                <code className="text-xs text-green-400 block bg-gray-800 p-2 rounded whitespace-pre-wrap">
{`INPUT_MAIL_FILTER(\`opendkim',
  \`S=unix:/run/opendkim/opendkim.sock')`}
                </code>
              </div>
              <div>
                <p className="text-gray-400 mb-1">3. 启用详细日志（opendkim.conf）：</p>
                <code className="text-xs text-green-400 block bg-gray-800 p-2 rounded">
{`LogResults Yes
LogWhy Yes
LogLevel 3`}
                </code>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="font-semibold text-blue-400 mb-2">DKIM 结果含义：</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-green-400 font-medium">Pass</span>
                <span className="text-gray-400">— 签名验证通过，邮件未被篡改</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="text-red-400 font-medium">Fail</span>
                <span className="text-gray-400">— 签名验证失败，邮件可能被篡改或伪造</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="text-yellow-400 font-medium">Neutral</span>
                <span className="text-gray-400">— 签名存在但不足以做出判断</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                <span className="text-purple-400 font-medium">TempError</span>
                <span className="text-gray-400">— 临时错误（如 DNS 查询超时），可重试</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-pink-500"></span>
                <span className="text-pink-400 font-medium">PermError</span>
                <span className="text-gray-400">— 永久错误（如 DNS 记录配置错误）</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gray-500"></span>
                <span className="text-gray-400 font-medium">None</span>
                <span className="text-gray-400">— 邮件未包含 DKIM 签名</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-3">
            <p className="text-sm text-blue-300">💡 <strong>分析要点：</strong>关注 DKIM 通过率低于 90% 的域名，检查其 DNS TXT 记录是否正确配置了公钥。频繁出现 Fail 可能表示存在邮件伪造攻击。</p>
          </div>
        </div>
      ),
    },
    {
      id: 'ip-analysis',
      title: 'IP 维度分析',
      icon: <Globe size={18} />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">IP 维度分析从两个方向追踪邮件流量：</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded-lg p-4">
              <h4 className="font-semibold text-blue-400 mb-2">📥 源 IP（入站方向）</h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• 来自 <code className="bg-gray-800 px-1 rounded">connect from</code> 日志行</li>
                <li>• 代表连接邮件服务器的客户端</li>
                <li>• 用于识别异常连接来源</li>
                <li>• 区分内网（10.x/172.16-31.x/192.168.x）和外网</li>
              </ul>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <h4 className="font-semibold text-green-400 mb-2">📤 目标 IP（出站方向）</h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• 来自 <code className="bg-gray-800 px-1 rounded">relay=host [IP]</code> 日志行</li>
                <li>• 代表邮件实际投递到的目标服务器</li>
                <li>• 用于分析投递目标分布</li>
                <li>• 识别投递失败的特定目标</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="font-semibold text-blue-400 mb-2">可疑 IP 检测规则：</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-start gap-2">
                <span className="text-red-400">⚡</span>
                <span><strong>高失败率：</strong>某 IP 的邮件失败率超过 50% 且失败次数 ≥ 3</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-400">⚡</span>
                <span><strong>高频连接：</strong>某 IP 的连接次数超过 20 次（可能为批量发送或攻击）</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-lg p-3">
            <p className="text-sm text-yellow-300">⚠️ <strong>安全建议：</strong>对于频繁出现的外网可疑 IP，建议将其添加到 sendmail 的 access 数据库中进行拦截：<br/>
              <code className="mt-1 block text-xs bg-gray-800 p-2 rounded">echo "IP_ADDRESS REJECT" &gt;&gt; /etc/mail/access && makemap hash /etc/mail/access</code>
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'commands',
      title: '常用日志获取命令',
      icon: <HelpCircle size={18} />,
      content: (
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="font-semibold text-blue-400 mb-2">获取最近日志：</h4>
            <code className="text-xs text-green-400 block whitespace-pre-wrap">
{`# 查看最近的邮件日志
tail -1000 /var/log/maillog

# 过滤 sendmail 相关日志
grep sendmail /var/log/maillog > sendmail-only.log

# 按日期过滤
grep "Jan 15" /var/log/maillog > jan15.log

# 过滤 DKIM 相关
grep -i dkim /var/log/maillog > dkim.log

# 统计邮件数量
grep -c "from=<" /var/log/maillog

# 统计失败邮件
grep "stat=Bounced" /var/log/maillog | wc -l`}
            </code>
          </div>

          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="font-semibold text-blue-400 mb-2">实时日志监控：</h4>
            <code className="text-xs text-green-400 block whitespace-pre-wrap">
{`# 实时查看邮件日志
tail -f /var/log/maillog

# 实时监控 sendmail 日志并高亮错误
tail -f /var/log/maillog | grep --color=auto -E "error|fail|bounce|reject"

# 使用 journalctl (systemd 系统)
journalctl -u sendmail -f
journalctl -u sendmail --since "1 hour ago"`}
            </code>
          </div>

          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="font-semibold text-blue-400 mb-2">日志轮转与归档：</h4>
            <code className="text-xs text-green-400 block whitespace-pre-wrap">
{`# 查看日志轮转配置
cat /etc/logrotate.d/syslog

# 手动轮转日志
logrotate -f /etc/logrotate.d/syslog

# 查看历史日志 (已压缩)
zcat /var/log/maillog.1.gz | grep sendmail`}
            </code>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-600 p-2 rounded-lg">
            <BookOpen size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">使用指南</h2>
            <p className="text-sm text-gray-400">了解如何使用 Sendmail 日志分析工具</p>
          </div>
        </div>

        <div className="space-y-2">
          {sections.map(section => (
            <div key={section.id} className="border border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-700/50 hover:bg-gray-700 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  {section.icon}
                  <span className="font-medium">{section.title}</span>
                </div>
                {openSection === section.id ? (
                  <ChevronUp size={18} className="text-gray-400" />
                ) : (
                  <ChevronDown size={18} className="text-gray-400" />
                )}
              </button>
              {openSection === section.id && (
                <div className="px-4 py-4 bg-gray-800/50">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
