import { AnalysisResult } from '../utils/logParser';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Server, Network, Globe } from 'lucide-react';

interface Props {
  data: AnalysisResult;
}

export default function RelayAnalysis({ data }: Props) {
  const relayBarData = data.relayDistribution.slice(0, 10).map(r => ({
    name: r.relay.length > 30 ? r.relay.substring(0, 30) + '...' : r.relay,
    fullName: r.relay,
    count: r.count,
  }));

  // Group connections by type
  const connectEntries = data.entries.filter(e => e.type === 'connect');
  const disconnectEntries = data.entries.filter(e => e.type === 'disconnect');

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Server size={20} className="text-blue-400" />
            <span className="text-sm text-gray-400">中继服务器数</span>
          </div>
          <div className="text-3xl font-bold">{data.relayDistribution.length}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Network size={20} className="text-green-400" />
            <span className="text-sm text-gray-400">入站连接</span>
          </div>
          <div className="text-3xl font-bold">{connectEntries.length}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Globe size={20} className="text-purple-400" />
            <span className="text-sm text-gray-400">传输方式</span>
          </div>
          <div className="text-3xl font-bold">{data.mailerDistribution.length}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Server size={20} className="text-yellow-400" />
            <span className="text-sm text-gray-400">最活跃中继</span>
          </div>
          <div className="text-sm font-bold truncate">{data.relayDistribution[0]?.relay || '-'}</div>
          <div className="text-xs text-gray-400">{data.relayDistribution[0]?.count || 0} 次</div>
        </div>
      </div>

      {/* Relay Distribution Chart */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Server size={20} className="text-blue-400" />
          中继服务器使用排行 (Top 10)
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={relayBarData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9ca3af" />
            <YAxis dataKey="name" type="category" stroke="#9ca3af" width={200} fontSize={11} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              itemStyle={{ color: '#e5e7eb' }}
              formatter={(value: number, name: string, props: any) => [value, `${props.payload.fullName}`]}
            />
            <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} name="使用次数" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Mailer Distribution */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Network size={20} className="text-green-400" />
          邮件传输方式 (Mailer) 统计
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.mailerDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="mailer" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                itemStyle={{ color: '#e5e7eb' }}
              />
              <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} name="次数" />
            </BarChart>
          </ResponsiveContainer>
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300">Mailer 说明</h4>
            {data.mailerDistribution.map((m, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-700/50 rounded-lg px-4 py-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span className="font-mono text-sm">{m.mailer}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold">{m.count}</span>
                  <span className="text-xs text-gray-400 ml-2">
                    ({((m.count / data.entries.filter(e => e.type === 'to').length) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Relay Details Table */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">中继服务器详细列表</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">排名</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">中继服务器</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">使用次数</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">占比</th>
              </tr>
            </thead>
            <tbody>
              {data.relayDistribution.map((relay, i) => {
                const total = data.relayDistribution.reduce((s, r) => s + r.count, 0);
                return (
                  <tr key={i} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="py-3 px-4 text-gray-500">{i + 1}</td>
                    <td className="py-3 px-4 font-mono text-xs">{relay.relay}</td>
                    <td className="py-3 px-4 text-right font-semibold">{relay.count}</td>
                    <td className="py-3 px-4 text-right">{((relay.count / total) * 100).toFixed(1)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Connection Log */}
      {(connectEntries.length > 0 || disconnectEntries.length > 0) && (
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Globe size={20} className="text-purple-400" />
            连接日志
          </h3>
          <div className="max-h-64 overflow-y-auto space-y-1">
            {data.entries
              .filter(e => e.type === 'connect' || e.type === 'disconnect')
              .slice(0, 20)
              .map((entry, i) => (
                <div key={i} className="flex items-center gap-3 py-1.5 px-3 rounded bg-gray-700/30 text-xs">
                  <span className="text-gray-500">{entry.timestamp.toLocaleTimeString()}</span>
                  <span className={`px-1.5 py-0.5 rounded ${
                    entry.type === 'connect' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                  }`}>
                    {entry.type === 'connect' ? 'CONNECT' : 'DISCONNECT'}
                  </span>
                  <span className="font-mono text-gray-300">{entry.relay}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
