import { AnalysisResult } from '../utils/logParser';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Clock, Timer, Gauge } from 'lucide-react';

interface Props {
  data: AnalysisResult;
}

function formatDelay(seconds: number): string {
  if (seconds < 1) return `${(seconds * 1000).toFixed(0)}ms`;
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  if (seconds < 3600) return `${(seconds / 60).toFixed(1)}min`;
  return `${(seconds / 3600).toFixed(1)}h`;
}

export default function DelayAnalysis({ data }: Props) {
  const delayData = data.delayDistribution.filter(d => d.count > 0);
  
  const toEntries = data.entries.filter(e => e.delay !== undefined);
  const delays = toEntries.map(e => e.delay!).sort((a, b) => a - b);
  
  const p50 = delays.length > 0 ? delays[Math.floor(delays.length * 0.5)] : 0;
  const p90 = delays.length > 0 ? delays[Math.floor(delays.length * 0.9)] : 0;
  const p99 = delays.length > 0 ? delays[Math.floor(delays.length * 0.99)] : 0;
  const maxDelay = delays.length > 0 ? delays[delays.length - 1] : 0;
  const minDelay = delays.length > 0 ? delays[0] : 0;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
          <div className="text-xs text-gray-400 mb-1">平均延迟</div>
          <div className="text-xl font-bold text-blue-400">{formatDelay(data.avgDelay)}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
          <div className="text-xs text-gray-400 mb-1">最小延迟</div>
          <div className="text-xl font-bold text-green-400">{formatDelay(minDelay)}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
          <div className="text-xs text-gray-400 mb-1">最大延迟</div>
          <div className="text-xl font-bold text-red-400">{formatDelay(maxDelay)}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
          <div className="text-xs text-gray-400 mb-1">P50</div>
          <div className="text-xl font-bold text-cyan-400">{formatDelay(p50)}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
          <div className="text-xs text-gray-400 mb-1">P90</div>
          <div className="text-xl font-bold text-yellow-400">{formatDelay(p90)}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
          <div className="text-xs text-gray-400 mb-1">P99</div>
          <div className="text-xl font-bold text-purple-400">{formatDelay(p99)}</div>
        </div>
      </div>

      {/* Delay Distribution Chart */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock size={20} className="text-blue-400" />
          延迟分布直方图
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={delayData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="range" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              itemStyle={{ color: '#e5e7eb' }}
              formatter={(value: number) => [`${value} 封`, '邮件数']}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} name="邮件数">
              {delayData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={
                  entry.range.includes('0-1') ? '#10b981' :
                  entry.range.includes('1-5') ? '#3b82f6' :
                  entry.range.includes('5-30s') ? '#06b6d4' :
                  entry.range.includes('30s') ? '#f59e0b' :
                  entry.range.includes('1-5m') ? '#f97316' :
                  '#ef4444'
                } />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Delay Health */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Gauge size={20} className="text-green-400" />
          延迟健康度评估
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">快速投递 (&lt;5s)</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${delays.length > 0 ? (delays.filter(d => d < 5).length / delays.length) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-green-400">
                  {delays.length > 0 ? ((delays.filter(d => d < 5).length / delays.length) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">正常投递 (5s-1m)</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${delays.length > 0 ? (delays.filter(d => d >= 5 && d < 60).length / delays.length) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-blue-400">
                  {delays.length > 0 ? ((delays.filter(d => d >= 5 && d < 60).length / delays.length) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">慢速投递 (1m-30m)</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500 rounded-full"
                    style={{ width: `${delays.length > 0 ? (delays.filter(d => d >= 60 && d < 1800).length / delays.length) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-yellow-400">
                  {delays.length > 0 ? ((delays.filter(d => d >= 60 && d < 1800).length / delays.length) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">严重延迟 (&gt;30m)</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: `${delays.length > 0 ? (delays.filter(d => d >= 1800).length / delays.length) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-red-400">
                  {delays.length > 0 ? ((delays.filter(d => d >= 1800).length / delays.length) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3">性能评级</h4>
            <div className="text-center">
              <div className={`text-4xl font-bold ${
                data.avgDelay < 5 ? 'text-green-400' :
                data.avgDelay < 30 ? 'text-blue-400' :
                data.avgDelay < 300 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {data.avgDelay < 5 ? '优秀' :
                 data.avgDelay < 30 ? '良好' :
                 data.avgDelay < 300 ? '一般' : '较差'}
              </div>
              <div className="text-sm text-gray-400 mt-2">
                平均延迟 {formatDelay(data.avgDelay)}
              </div>
              <div className="mt-3 text-xs text-gray-500">
                <p>• &lt;5s: 优秀 | 5-30s: 良好 | 30s-5m: 一般 | &gt;5m: 较差</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slow Messages */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Timer size={20} className="text-yellow-400" />
          慢速投递记录 (延迟 &gt; 10s)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">时间</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">队列ID</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">收件人</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">延迟</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">中继</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">状态</th>
              </tr>
            </thead>
            <tbody>
              {data.entries
                .filter(e => e.delay !== undefined && e.delay > 10)
                .sort((a, b) => (b.delay || 0) - (a.delay || 0))
                .slice(0, 10)
                .map((entry, i) => (
                  <tr key={i} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="py-3 px-4 text-gray-400 text-xs">
                      {entry.timestamp.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs">{entry.queueId}</td>
                    <td className="py-3 px-4 font-mono text-xs">{entry.to}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        (entry.delay || 0) > 300 ? 'bg-red-900/50 text-red-400' :
                        (entry.delay || 0) > 60 ? 'bg-yellow-900/50 text-yellow-400' :
                        'bg-blue-900/50 text-blue-400'
                      }`}>
                        {formatDelay(entry.delay || 0)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-400 truncate max-w-[200px]">{entry.relay}</td>
                    <td className="py-3 px-4 text-xs">{entry.status}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
