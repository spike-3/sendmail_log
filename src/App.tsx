import { useState, useCallback } from 'react';
import { parseSendmailLog, AnalysisResult } from './utils/logParser';
import { sampleLogData } from './utils/sampleData';
import OverviewPanel from './components/OverviewPanel';
import HourlyChart from './components/HourlyChart';
import SenderAnalysis from './components/SenderAnalysis';
import RecipientAnalysis from './components/RecipientAnalysis';
import ErrorAnalysis from './components/ErrorAnalysis';
import DelayAnalysis from './components/DelayAnalysis';
import RelayAnalysis from './components/RelayAnalysis';
import MessageFlow from './components/MessageFlow';
import LogTable from './components/LogTable';
import DKIMAnalysis from './components/DKIMAnalysis';
import IPAnalysis from './components/IPAnalysis';
import HelpGuide from './components/HelpGuide';
import { 
  Upload, FileText, BarChart3, Users, Mail, AlertTriangle, 
  Clock, Server, Activity, Table, Eye, Download, Shield, Globe, HelpCircle
} from 'lucide-react';

type TabType = 'overview' | 'hourly' | 'sender' | 'recipient' | 'error' | 'delay' | 'relay' | 'flow' | 'dkim' | 'ip' | 'logs' | 'help';

interface Tab {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: 'overview', label: '总览', icon: <BarChart3 size={16} /> },
  { id: 'hourly', label: '时间分布', icon: <Clock size={16} /> },
  { id: 'sender', label: '发件人', icon: <Users size={16} /> },
  { id: 'recipient', label: '收件人', icon: <Mail size={16} /> },
  { id: 'error', label: '错误分析', icon: <AlertTriangle size={16} /> },
  { id: 'delay', label: '延迟分析', icon: <Clock size={16} /> },
  { id: 'relay', label: '中继路由', icon: <Server size={16} /> },
  { id: 'flow', label: '消息流', icon: <Activity size={16} /> },
  { id: 'dkim', label: 'DKIM', icon: <Shield size={16} /> },
  { id: 'ip', label: 'IP分析', icon: <Globe size={16} /> },
  { id: 'logs', label: '原始日志', icon: <Table size={16} /> },
  { id: 'help', label: '帮助', icon: <HelpCircle size={16} /> },
];

function App() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>('');

  const handleFileUpload = useCallback((file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const result = parseSendmailLog(text);
      setAnalysis(result);
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const loadSampleData = useCallback(() => {
    setFileName('sample-sendmail.log (示例数据)');
    const result = parseSendmailLog(sampleLogData);
    setAnalysis(result);
  }, []);

  const exportReport = useCallback(() => {
    if (!analysis) return;
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalMessages: analysis.totalMessages,
        successful: analysis.successfulDeliveries,
        failed: analysis.failedDeliveries,
        deferred: analysis.deferredDeliveries,
        rejected: analysis.rejectedMessages,
        avgDelay: analysis.avgDelay,
        totalSize: analysis.totalSize,
      },
      dkimStats: analysis.dkimStats,
      topSenders: analysis.topSenders,
      topRecipientDomains: analysis.topRecipients,
      errorTypes: analysis.errorTypes,
      statusCodeDistribution: analysis.statusCodeDistribution,
      sourceIps: analysis.sourceIpStats,
      destIps: analysis.destIpStats,
      suspiciousIps: analysis.suspiciousIps,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sendmail-analysis-report.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [analysis]);

  const resetAnalysis = useCallback(() => {
    setAnalysis(null);
    setFileName('');
    setActiveTab('overview');
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Mail size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Sendmail 日志分析工具</h1>
              <p className="text-xs text-gray-400">全面的邮件服务器日志解析与分析</p>
            </div>
          </div>
          {analysis && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400 flex items-center gap-1 hidden md:flex">
                <FileText size={14} />
                {fileName}
              </span>
              <button
                onClick={exportReport}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
              >
                <Download size={14} />
                <span className="hidden sm:inline">导出报告</span>
              </button>
              <button
                onClick={resetAnalysis}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm rounded-lg transition-colors"
              >
                <Upload size={14} />
                <span className="hidden sm:inline">重新上传</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {!analysis && activeTab !== 'help' && (
        /* Upload Area */
        <div className="max-w-3xl mx-auto px-4 py-16">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
              isDragging 
                ? 'border-blue-400 bg-blue-900/20 scale-[1.02]' 
                : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
            }`}
          >
            <Upload size={56} className="mx-auto mb-5 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2 text-gray-200">上传 Sendmail 日志文件</h2>
            <p className="text-gray-400 mb-4">
              拖放日志文件到此处，或点击选择文件
            </p>
            <p className="text-sm text-gray-500 mb-6">
              支持标准 syslog 格式的 sendmail 日志（/var/log/maillog）
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <label className="cursor-pointer px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm">
                <input
                  type="file"
                  className="hidden"
                  accept=".log,.txt,.maillog"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />
                选择文件
              </label>
              <button
                onClick={loadSampleData}
                className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors font-medium flex items-center gap-2 text-sm"
              >
                <Eye size={16} />
                加载示例数据
              </button>
              <button
                onClick={() => setActiveTab('help')}
                className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors font-medium flex items-center gap-2 text-sm"
              >
                <HelpCircle size={16} />
                使用帮助
              </button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="bg-blue-600/20 p-2 rounded-lg w-fit mb-2">
                <BarChart3 size={18} className="text-blue-400" />
              </div>
              <h3 className="font-semibold mb-1 text-sm">多维度分析</h3>
              <p className="text-xs text-gray-400">发件人、收件人、错误类型、延迟分布等全方位分析</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="bg-green-600/20 p-2 rounded-lg w-fit mb-2">
                <Activity size={18} className="text-green-400" />
              </div>
              <h3 className="font-semibold mb-1 text-sm">实时监控</h3>
              <p className="text-xs text-gray-400">按小时/天统计邮件流量，发现异常模式</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="bg-purple-600/20 p-2 rounded-lg w-fit mb-2">
                <AlertTriangle size={18} className="text-purple-400" />
              </div>
              <h3 className="font-semibold mb-1 text-sm">问题诊断</h3>
              <p className="text-xs text-gray-400">详细错误分类、DSN码分析、中继路由追踪</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="bg-cyan-600/20 p-2 rounded-lg w-fit mb-2">
                <Shield size={18} className="text-cyan-400" />
              </div>
              <h3 className="font-semibold mb-1 text-sm">DKIM 验证</h3>
              <p className="text-xs text-gray-400">分析 DKIM 签名验证结果，按域名统计通过率</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="bg-yellow-600/20 p-2 rounded-lg w-fit mb-2">
                <Globe size={18} className="text-yellow-400" />
              </div>
              <h3 className="font-semibold mb-1 text-sm">IP 维度分析</h3>
              <p className="text-xs text-gray-400">源IP/目标IP统计、内网外网分类、可疑IP检测</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="bg-orange-600/20 p-2 rounded-lg w-fit mb-2">
                <HelpCircle size={18} className="text-orange-400" />
              </div>
              <h3 className="font-semibold mb-1 text-sm">使用帮助</h3>
              <p className="text-xs text-gray-400">详细的使用指南、日志格式说明和常用命令</p>
            </div>
          </div>
        </div>
      )}

      {/* Help page when no data loaded */}
      {!analysis && activeTab === 'help' && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <HelpGuide />
        </div>
      )}

      {/* Analysis Dashboard */}
      {analysis && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Tab Navigation */}
          <div className="flex gap-1 mb-5 overflow-x-auto pb-2 bg-gray-800 rounded-xl p-1.5 border border-gray-700">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="animate-fadeIn">
            {activeTab === 'overview' && <OverviewPanel data={analysis} />}
            {activeTab === 'hourly' && <HourlyChart data={analysis} />}
            {activeTab === 'sender' && <SenderAnalysis data={analysis} />}
            {activeTab === 'recipient' && <RecipientAnalysis data={analysis} />}
            {activeTab === 'error' && <ErrorAnalysis data={analysis} />}
            {activeTab === 'delay' && <DelayAnalysis data={analysis} />}
            {activeTab === 'relay' && <RelayAnalysis data={analysis} />}
            {activeTab === 'flow' && <MessageFlow data={analysis} />}
            {activeTab === 'dkim' && <DKIMAnalysis data={analysis} />}
            {activeTab === 'ip' && <IPAnalysis data={analysis} />}
            {activeTab === 'logs' && <LogTable data={analysis} />}
            {activeTab === 'help' && <HelpGuide />}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
