import { AnalysisResult } from '../utils/logParser';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Users, TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  data: AnalysisResult;
}

export default function SenderAnalysis({ data }: Props) {
  const chartData = data.topSenders.slice(0, 10).map(s => ({
    name: s.address.length > 25 ? s.address.substring(0, 25) + '...' : s.address,
    fullName: s.address,
    total: s.count,
    success: s.success,
    fail: s.fail,
  }));

  return (
    <div className="space-y-6">
      {/* Sender Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Users size={20} className="text-blue-400" />
            <span className="text-sm text-gray-400">独立发件人</span>
          </div>
          <div className="text-3xl font-bold">{data.topSenders.length}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-green-400" />
            <span className="text-sm text-gray-400">最高产出</span>
          </div>
          <div className="text-lg font-bold truncate">{data.topSenders[0]?.address || '-'}</div>
          <div className="text-sm text-gray-400">{data.topSenders[0]?.count || 0} 封邮件</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={20} className="text-red-400" />
            <span className="text-sm text-gray-400">最高失败率</span>
          </div>
          <div className="text-lg font-bold truncate">
            {data.topSenders.filter(s => s.fail > 0).sort((a, b) => (b.fail / (b.count || 1)) - (a.fail / (a.count || 1)))[0]?.address || '-'}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">发件人邮件量排行 (Top 10)</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9ca3af" />
            <YAxis dataKey="name" type="category" stroke="#9ca3af" width={180} fontSize={11} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              itemStyle={{ color: '#e5e7eb' }}
              formatter={(value: number, name: string) => [value, name === 'total' ? '总计' : name === 'success' ? '成功' : '失败']}
            />
            <Legend />
            <Bar dataKey="success" stackId="a" fill="#10b981" name="成功" radius={[0, 0, 0, 0]} />
            <Bar dataKey="fail" stackId="a" fill="#ef4444" name="失败" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">发件人详细数据</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">排名</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">发件人地址</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">总计</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">成功</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">失败</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">成功率</th>
              </tr>
            </thead>
            <tbody>
              {data.topSenders.map((sender, i) => (
                <tr key={i} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                  <td className="py-3 px-4 text-gray-500">{i + 1}</td>
                  <td className="py-3 px-4 font-mono text-xs">{sender.address}</td>
                  <td className="py-3 px-4 text-right font-semibold">{sender.count}</td>
                  <td className="py-3 px-4 text-right text-green-400">{sender.success}</td>
                  <td className="py-3 px-4 text-right text-red-400">{sender.fail}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      sender.count > 0 && (sender.success / sender.count) >= 0.9 
                        ? 'bg-green-900/50 text-green-400' 
                        : sender.count > 0 && (sender.success / sender.count) >= 0.7 
                          ? 'bg-yellow-900/50 text-yellow-400'
                          : 'bg-red-900/50 text-red-400'
                    }`}>
                      {sender.count > 0 ? ((sender.success / sender.count) * 100).toFixed(1) : 0}%
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
