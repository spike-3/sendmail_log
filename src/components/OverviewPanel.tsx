import { AnalysisResult } from '../utils/logParser';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Mail, CheckCircle, XCircle, Clock, AlertTriangle, HardDrive, Timer, TrendingUp } from 'lucide-react';

interface Props {
  data: AnalysisResult;
}

const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4'];

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(2)} MB`;
}

function formatDelay(seconds: number): string {
  if (seconds < 1) return `${(seconds * 1000).toFixed(0)}ms`;
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  return `${(seconds / 60).toFixed(1)}min`;
}

export default function OverviewPanel({ data }: Props) {
  const successRate = data.totalMessages > 0 
    ? ((data.successfulDeliveries / data.totalMessages) * 100).toFixed(1) 
    : '0';
  
  const failRate = data.totalMessages > 0
    ? (((data.failedDeliveries + data.rejectedMessages) / data.totalMessages) * 100).toFixed(1)
    : '0';

  const statusPieData = [
    { name: '成功投递', value: data.successfulDeliveries },
    { name: '投递失败', value: data.failedDeliveries },
    { name: '延迟投递', value: data.deferredDeliveries },
    { name: '被拒绝', value: data.rejectedMessages },
  ].filter(d => d.value > 0);

  const mailerData = data.mailerDistribution.map(d => ({
    name: d.mailer,
    value: d.count,
  }));

  const sizeData = data.sizeDistribution.filter(d => d.count > 0);

  const stats = [
    { label: '总邮件数', value: data.totalMessages, icon: <Mail size={20} />, color: 'blue' },
    { label: '成功投递', value: data.successfulDeliveries, icon: <CheckCircle size={20} />, color: 'green' },
    { label: '投递失败', value: data.failedDeliveries, icon: <XCircle size={20} />, color: 'red' },
    { label: '延迟投递', value: data.deferredDeliveries, icon: <Clock size={20} />, color: 'yellow' },
    { label: '被拒绝', value: data.rejectedMessages, icon: <AlertTriangle size={20} />, color: 'orange' },
    { label: '总数据量', value: formatSize(data.totalSize), icon: <HardDrive size={20} />, color: 'purple' },
    { label: '平均延迟', value: formatDelay(data.avgDelay), icon: <Timer size={20} />, color: 'cyan' },
    { label: '成功率', value: `${successRate}%`, icon: <TrendingUp size={20} />, color: 'emerald' },
  ];

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
    green: 'bg-green-600/20 text-green-400 border-green-600/30',
    red: 'bg-red-600/20 text-red-400 border-red-600/30',
    yellow: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
    orange: 'bg-orange-600/20 text-orange-400 border-orange-600/30',
    purple: 'bg-purple-600/20 text-purple-400 border-purple-600/30',
    cyan: 'bg-cyan-600/20 text-cyan-400 border-cyan-600/30',
    emerald: 'bg-emerald-600/20 text-emerald-400 border-emerald-600/30',
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`rounded-xl p-4 border ${colorClasses[stat.color]}`}>
            <div className="flex items-center justify-between mb-2">
              {stat.icon}
              <span className="text-xs opacity-70">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Status Pie */}
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-400" />
            投递状态分布
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statusPieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {statusPieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                itemStyle={{ color: '#e5e7eb' }}
              />
              <Legend 
                wrapperStyle={{ color: '#9ca3af' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center text-sm text-gray-400 mt-2">
            成功率: <span className="text-green-400 font-semibold">{successRate}%</span> | 
            失败率: <span className="text-red-400 font-semibold">{failRate}%</span>
          </div>
        </div>

        {/* Mailer Distribution */}
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Mail size={20} className="text-green-400" />
            邮件传输方式 (Mailer)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={mailerData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis dataKey="name" type="category" stroke="#9ca3af" width={80} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                itemStyle={{ color: '#e5e7eb' }}
              />
              <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Size Distribution */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <HardDrive size={20} className="text-purple-400" />
          邮件大小分布
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={sizeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="range" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              itemStyle={{ color: '#e5e7eb' }}
            />
            <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="邮件数量" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Queue Status */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">队列状态摘要</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-700/50 rounded-lg">
            <div className="text-3xl font-bold text-green-400">{data.queueStats.delivered}</div>
            <div className="text-sm text-gray-400 mt-1">已投递</div>
          </div>
          <div className="text-center p-4 bg-gray-700/50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-400">{data.queueStats.deferred}</div>
            <div className="text-sm text-gray-400 mt-1">延迟中</div>
          </div>
          <div className="text-center p-4 bg-gray-700/50 rounded-lg">
            <div className="text-3xl font-bold text-red-400">{data.queueStats.bounced}</div>
            <div className="text-sm text-gray-400 mt-1">已退回</div>
          </div>
          <div className="text-center p-4 bg-gray-700/50 rounded-lg">
            <div className="text-3xl font-bold text-blue-400">{data.queueStats.pending}</div>
            <div className="text-sm text-gray-400 mt-1">待处理</div>
          </div>
        </div>
      </div>
    </div>
  );
}
