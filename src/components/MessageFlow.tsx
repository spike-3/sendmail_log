import { AnalysisResult } from '../utils/logParser';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line
} from 'recharts';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  data: AnalysisResult;
}

export default function MessageFlow({ data }: Props) {
  const flowData = data.messageFlow;

  const totalSent = flowData.reduce((s, f) => s + f.sent, 0);
  const totalDelivered = flowData.reduce((s, f) => s + f.delivered, 0);
  const totalBounced = flowData.reduce((s, f) => s + f.bounced, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-xl p-5 border border-blue-900/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-blue-400" />
            <span className="text-sm text-gray-400">总发送</span>
          </div>
          <div className="text-3xl font-bold text-blue-400">{totalSent}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 border border-green-900/50">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={20} className="text-green-400" />
            <span className="text-sm text-gray-400">总投递</span>
          </div>
          <div className="text-3xl font-bold text-green-400">{totalDelivered}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 border border-red-900/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={20} className="text-red-400" />
            <span className="text-sm text-gray-400">总退回</span>
          </div>
          <div className="text-3xl font-bold text-red-400">{totalBounced}</div>
        </div>
      </div>

      {/* Area Chart */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity size={20} className="text-blue-400" />
          消息流量趋势 (堆叠面积图)
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={flowData}>
            <defs>
              <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="deliveredGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="bouncedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9ca3af" fontSize={11} />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              itemStyle={{ color: '#e5e7eb' }}
            />
            <Legend />
            <Area type="monotone" dataKey="sent" stroke="#3b82f6" fill="url(#sentGrad)" name="发送" />
            <Area type="monotone" dataKey="delivered" stroke="#10b981" fill="url(#deliveredGrad)" name="投递" />
            <Area type="monotone" dataKey="bounced" stroke="#ef4444" fill="url(#bouncedGrad)" name="退回" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-green-400" />
          消息流对比 (折线图)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={flowData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9ca3af" fontSize={11} />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              itemStyle={{ color: '#e5e7eb' }}
            />
            <Legend />
            <Line type="monotone" dataKey="sent" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="发送" />
            <Line type="monotone" dataKey="delivered" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="投递" />
            <Line type="monotone" dataKey="bounced" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="退回" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Delivery Rate Over Time */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">投递率趋势</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">时间段</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">发送</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">投递</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">退回</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">投递率</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">状态</th>
              </tr>
            </thead>
            <tbody>
              {flowData.map((flow, i) => {
                const rate = flow.sent > 0 ? (flow.delivered / flow.sent) * 100 : 0;
                return (
                  <tr key={i} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="py-3 px-4 text-xs">{flow.time}</td>
                    <td className="py-3 px-4 text-right">{flow.sent}</td>
                    <td className="py-3 px-4 text-right text-green-400">{flow.delivered}</td>
                    <td className="py-3 px-4 text-right text-red-400">{flow.bounced}</td>
                    <td className="py-3 px-4 text-right font-semibold">{rate.toFixed(1)}%</td>
                    <td className="py-3 px-4">
                      <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            rate >= 90 ? 'bg-green-500' : rate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${rate}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
