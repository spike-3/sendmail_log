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
import { 
  Upload, FileText, BarChart3, Users, Mail, AlertTriangle, 
  Clock, Server, Activity, Table, Eye, Download
} from 'lucide-react';

type TabType = 'overview' | 'hourly' | 'sender' | 'recipient' | 'error' | 'delay' | 'relay' | 'flow' | 'logs';

interface Tab {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: 'overview', label: '总览', icon: <BarChart3 size={18} /> },
  { id: 'hourly', label: '时间分布', icon: <Clock size={18} /> },
  { id: 'sender', label: '发件人分析', icon: <Users size={18} /> },
  { id: 'recipient', label: '收件人分析', icon: <Mail size={18} /> },
  { id: 'error', label: '错误分析', icon: <AlertTriangle size={18} /> },
  { id: 'delay', label: '延迟分析', icon: <Clock size={18} /> },
  { id: 'relay', label: '中继/路由', icon: <Server size={18} /> },
  { id: 'flow', label: '消息流', icon: <Activity size={18} /> },
  { id: 'logs', label: '原始日志', icon: <Table size={18} /> },
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
      topSenders: analysis.topSenders,
      topRecipientDomains: analysis.topRecipients,
      errorTypes: analysis.errorTypes,
      statusCodeDistribution: analysis.statusCodeDistribution,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sendmail-analysis-report.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [analysis]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Mail size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Sendmail 日志分析工具</h1>
              <p className="text-xs text-gray-400">全面的邮件服务器日志解析与分析</p>
            </div>
          </div>
          {analysis && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400 flex items-center gap-1">
                <FileText size={14} />
                {fileName}
              </span>
              <button
                onClick={exportReport}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
              >
                <Download size={14} />
                导出报告
              </button>
            </div>
          )}
        </div>
      </header>

      {!analysis ? (
        /* Upload Area */
        <div className="max-w-3xl mx-auto px-4 py-20">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-2xl p-16 text-center transition-all ${
              isDragging 
                ? 'border-blue-400 bg-blue-900/20 scale-[1.02]' 
                : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
            }`}
          >
            <Upload size={64} className="mx-auto mb-6 text-gray-400" />
            <h2 className="text-2xl font-semibold mb-3 text-gray-200">上传 Sendmail 日志文件</h2>
            <p className="text-gray-400 mb-6">
              拖放日志文件到此处，或点击选择文件
            </p>
            <p className="text-sm text-gray-500 mb-8">
              支持标准 syslog 格式的 sendmail 日志（/var/log/maillog）
            </p>
            <div className="flex gap-4 justify-center">
              <label className="cursor-pointer px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
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
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <Eye size={18} />
                加载示例数据
              </button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <div className="bg-blue-600/20 p-2 rounded-lg w-fit mb-3">
                <BarChart3 size={20} className="text-blue-400" />
              </div>
              <h3 className="font-semibold mb-1">多维度分析</h3>
              <p className="text-sm text-gray-400">发件人、收件人、错误类型、延迟分布等全方位分析</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <div className="bg-green-600/20 p-2 rounded-lg w-fit mb-3">
                <Activity size={20} className="text-green-400" />
              </div>
              <h3 className="font-semibold mb-1">实时监控</h3>
              <p className="text-sm text-gray-400">按小时/天统计邮件流量，发现异常模式</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <div className="bg-purple-600/20 p-2 rounded-lg w-fit mb-3">
                <AlertTriangle size={20} className="text-purple-400" />
              </div>
              <h3 className="font-semibold mb-1">问题诊断</h3>
              <p className="text-sm text-gray-400">详细错误分类、DSN码分析、中继路由追踪</p>
            </div>
          </div>
        </div>
      ) : (
        /* Analysis Dashboard */
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Tab Navigation */}
          <div className="flex gap-1 mb-6 overflow-x-auto pb-2 bg-gray-800 rounded-xl p-1.5 border border-gray-700">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
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
            {activeTab === 'logs' && <LogTable data={analysis} />}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
