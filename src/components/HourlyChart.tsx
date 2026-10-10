import { AnalysisResult } from '../utils/logParser';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { Clock, Calendar } from 'lucide-react';

interface Props {
  data: AnalysisResult;
}

export default function HourlyChart({ data }: Props) {
  return (
    <div className="space-y-6">
      {/* Hourly Distribution */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock size={20} className="text-blue-400" />
          24小时邮件发送分布
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data.hourlyDistribution}>
            <defs>
              <linearGradient id="hourlyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="hour" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              itemStyle={{ color: '#e5e7eb' }}
              labelStyle={{ color: '#9ca3af' }}
            />
            <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="url(#hourlyGradient)" name="邮件数" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="text-sm text-gray-400">峰值时段</div>
            <div className="text-lg font-bold text-blue-400">
              {data.hourlyDistribution.reduce((max, h) => h.count > max.count ? h : max, data.hourlyDistribution[0])?.hour || '-'}
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="text-sm text-gray-400">峰值数量</div>
            <div className="text-lg font-bold text-green-400">
              {Math.max(...data.hourlyDistribution.map(h => h.count))}
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="text-sm text-gray-400">平均/小时</div>
            <div className="text-lg font-bold text-yellow-400">
              {(data.totalMessages / 24).toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Distribution */}
      {data.dailyDistribution.length > 1 && (
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-green-400" />
            每日邮件趋势
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.dailyDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                itemStyle={{ color: '#e5e7eb' }}
              />
              <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} name="邮件数" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Hourly Bar Chart */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock size={20} className="text-purple-400" />
          小时柱状图对比
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.hourlyDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="hour" stroke="#9ca3af" fontSize={11} />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              itemStyle={{ color: '#e5e7eb' }}
            />
            <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="邮件数" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Time Pattern Analysis */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">时间模式分析</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">工作时段 (8:00-18:00)</h4>
            <div className="text-2xl font-bold text-blue-400">
              {data.hourlyDistribution
                .filter(h => {
                  const hour = parseInt(h.hour);
                  return hour >= 8 && hour < 18;
                })
                .reduce((sum, h) => sum + h.count, 0)}
            </div>
            <div className="text-sm text-gray-400">封邮件</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">非工作时段 (18:00-8:00)</h4>
            <div className="text-2xl font-bold text-purple-400">
              {data.hourlyDistribution
                .filter(h => {
                  const hour = parseInt(h.hour);
                  return hour < 8 || hour >= 18;
                })
                .reduce((sum, h) => sum + h.count, 0)}
            </div>
            <div className="text-sm text-gray-400">封邮件</div>
          </div>
        </div>
      </div>
    </div>
  );
}
