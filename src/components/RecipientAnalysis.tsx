import { AnalysisResult } from '../utils/logParser';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Globe, Target } from 'lucide-react';

interface Props {
  data: AnalysisResult;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

export default function RecipientAnalysis({ data }: Props) {
  const pieData = data.topRecipients.slice(0, 8).map(r => ({
    name: r.domain,
    value: r.count,
  }));

  const barData = data.topRecipients.slice(0, 12).map(r => ({
    name: r.domain.length > 20 ? r.domain.substring(0, 20) + '...' : r.domain,
    fullName: r.domain,
    total: r.count,
    success: r.success,
    fail: r.fail,
  }));

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Globe size={20} className="text-blue-400" />
            <span className="text-sm text-gray-400">目标域名数</span>
          </div>
          <div className="text-3xl font-bold">{data.topRecipients.length}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Target size={20} className="text-green-400" />
            <span className="text-sm text-gray-400">最大接收域</span>
          </div>
          <div className="text-lg font-bold truncate">{data.topRecipients[0]?.domain || '-'}</div>
          <div className="text-sm text-gray-400">{data.topRecipients[0]?.count || 0} 封</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Target size={20} className="text-purple-400" />
            <span className="text-sm text-gray-400">域名集中度</span>
          </div>
          <div className="text-2xl font-bold">
            {data.topRecipients.length > 0 
              ? ((data.topRecipients.slice(0, 3).reduce((s, r) => s + r.count, 0) / 
                  data.topRecipients.reduce((s, r) => s + r.count, 0)) * 100).toFixed(1)
              : 0}%
          </div>
          <div className="text-sm text-gray-400">Top 3 域名占比</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">域名分布饼图</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={{ stroke: '#6b7280' }}
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                itemStyle={{ color: '#e5e7eb' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">域名投递统计</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis dataKey="name" type="category" stroke="#9ca3af" width={150} fontSize={11} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                itemStyle={{ color: '#e5e7eb' }}
              />
              <Legend />
              <Bar dataKey="success" stackId="a" fill="#10b981" name="成功" />
              <Bar dataKey="fail" stackId="a" fill="#ef4444" name="失败" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">收件域名详细数据</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">排名</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">域名</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">总计</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">成功</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">失败</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">成功率</th>
              </tr>
            </thead>
            <tbody>
              {data.topRecipients.map((r, i) => (
                <tr key={i} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                  <td className="py-3 px-4 text-gray-500">{i + 1}</td>
                  <td className="py-3 px-4 font-mono text-xs">{r.domain}</td>
                  <td className="py-3 px-4 text-right font-semibold">{r.count}</td>
                  <td className="py-3 px-4 text-right text-green-400">{r.success}</td>
                  <td className="py-3 px-4 text-right text-red-400">{r.fail}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      r.count > 0 && (r.success / r.count) >= 0.9 
                        ? 'bg-green-900/50 text-green-400' 
                        : r.count > 0 && (r.success / r.count) >= 0.7 
                          ? 'bg-yellow-900/50 text-yellow-400'
                          : 'bg-red-900/50 text-red-400'
                    }`}>
                      {r.count > 0 ? ((r.success / r.count) * 100).toFixed(1) : 0}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
