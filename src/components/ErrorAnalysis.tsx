import { AnalysisResult } from '../utils/logParser';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { AlertTriangle, AlertOctagon, Shield } from 'lucide-react';

interface Props {
  data: AnalysisResult;
}

const COLORS = ['#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16', '#3b82f6', '#10b981'];

export default function ErrorAnalysis({ data }: Props) {
  const totalErrors = data.errorTypes.reduce((sum, e) => sum + e.count, 0);

  return (
    <div className="space-y-6">
      {/* Error Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-5 border border-red-900/50">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={20} className="text-red-400" />
            <span className="text-sm text-gray-400">错误总数</span>
          </div>
          <div className="text-3xl font-bold text-red-400">{totalErrors}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <AlertOctagon size={20} className="text-yellow-400" />
            <span className="text-sm text-gray-400">错误类型数</span>
          </div>
          <div className="text-3xl font-bold text-yellow-400">{data.errorTypes.length}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={20} className="text-blue-400" />
            <span className="text-sm text-gray-400">错误率</span>
          </div>
          <div className="text-3xl font-bold text-blue-400">
            {data.totalMessages > 0 ? ((totalErrors / data.totalMessages) * 100).toFixed(1) : 0}%
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={20} className="text-purple-400" />
            <span className="text-sm text-gray-400">最频繁错误</span>
          </div>
          <div className="text-sm font-bold text-purple-400 truncate">{data.errorTypes[0]?.type || '-'}</div>
          <div className="text-xs text-gray-400">{data.errorTypes[0]?.count || 0} 次</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Error Type Pie */}
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">错误类型分布</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.errorTypes}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
                dataKey="count"
                nameKey="type"
              >
                {data.errorTypes.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                itemStyle={{ color: '#e5e7eb' }}
                formatter={(value: number) => [`${value} 次`, '数量']}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Error Type Bar */}
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">错误类型排行</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.errorTypes.slice(0, 8)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis dataKey="type" type="category" stroke="#9ca3af" width={120} fontSize={11} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                itemStyle={{ color: '#e5e7eb' }}
              />
              <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]} name="次数" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DSN Status Codes */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">DSN 状态码分布</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.statusCodeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="code" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  itemStyle={{ color: '#e5e7eb' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} name="次数">
                  {data.statusCodeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={
                      entry.code.startsWith('2') ? '#10b981' :
                      entry.code.startsWith('4') ? '#f59e0b' : '#ef4444'
                    } />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300">状态码说明</h4>
            {data.statusCodeDistribution.map((sc, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-700/50 rounded-lg px-4 py-2">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${
                    sc.code.startsWith('2') ? 'bg-green-500' :
                    sc.code.startsWith('4') ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></span>
                  <span className="font-mono text-sm">{sc.code}</span>
                  <span className="text-xs text-gray-400">
                    {sc.code.startsWith('2') ? '成功' : sc.code.startsWith('4') ? '临时失败' : '永久失败'}
                  </span>
                </div>
                <span className="font-semibold">{sc.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Error Details Table */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">错误详情列表</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">错误类型</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">次数</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">占比</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">严重程度</th>
              </tr>
            </thead>
            <tbody>
              {data.errorTypes.map((error, i) => (
                <tr key={i} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                  <td className="py-3 px-4">{error.type}</td>
                  <td className="py-3 px-4 text-right font-semibold">{error.count}</td>
                  <td className="py-3 px-4 text-right">{error.percentage.toFixed(1)}%</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      error.type.includes('不存在') || error.type.includes('拒绝')
                        ? 'bg-red-900/50 text-red-400'
                        : error.type.includes('延迟') || error.type.includes('超时')
                          ? 'bg-yellow-900/50 text-yellow-400'
                          : 'bg-orange-900/50 text-orange-400'
                    }`}>
                      {error.type.includes('不存在') || error.type.includes('拒绝') ? '严重' :
                       error.type.includes('延迟') || error.type.includes('超时') ? '中等' : '一般'}
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
