import { AnalysisResult } from '../utils/logParser';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Globe, Server, AlertTriangle, Network, ShieldAlert } from 'lucide-react';

interface Props {
  data: AnalysisResult;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

export default function IPAnalysis({ data }: Props) {
  const { sourceIpStats, destIpStats, sourceIpGeo, suspiciousIps } = data;

  const sourceBarData = sourceIpStats.slice(0, 12).map(ip => ({
    name: ip.ip,
    count: ip.count,
    success: ip.success,
    fail: ip.fail,
    host: ip.host,
  }));

  const destBarData = destIpStats.slice(0, 12).map(ip => ({
    name: ip.ip,
    count: ip.count,
    success: ip.success,
    fail: ip.fail,
    host: ip.host,
  }));

  const internalCount = sourceIpGeo.filter(ip => ip.type === '内网').reduce((s, ip) => s + ip.count, 0);
  const externalCount = sourceIpGeo.filter(ip => ip.type === '外网').reduce((s, ip) => s + ip.count, 0);
  const totalConnections = internalCount + externalCount;

  const geoPieData = [
    { name: '内网 (Private)', value: internalCount, color: '#3b82f6' },
    { name: '外网 (Public)', value: externalCount, color: '#f59e0b' },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      {/* IP Info Banner */}
      <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-4 flex gap-3">
        <Network size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-200">
          <strong>IP 维度分析</strong> — 从源 IP（发件方/连接来源）和目标 IP（投递目标/中继服务器）两个维度分析邮件流量。
          源 IP 来自 <code className="mx-1 px-1 py-0.5 bg-blue-900/50 rounded text-xs">connect from</code> 和 <code className="mx-1 px-1 py-0.5 bg-blue-900/50 rounded text-xs">relay=[IP]</code>（入站），
          目标 IP 来自 <code className="mx-1 px-1 py-0.5 bg-blue-900/50 rounded text-xs">relay=host [IP]</code>（出站）。
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Server size={20} className="text-blue-400" />
            <span className="text-sm text-gray-400">源 IP 数量</span>
          </div>
          <div className="text-3xl font-bold">{sourceIpStats.length}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Globe size={20} className="text-green-400" />
            <span className="text-sm text-gray-400">目标 IP 数量</span>
          </div>
          <div className="text-3xl font-bold">{destIpStats.length}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={20} className="text-red-400" />
            <span className="text-sm text-gray-400">可疑 IP</span>
          </div>
          <div className="text-3xl font-bold text-red-400">{suspiciousIps.length}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Network size={20} className="text-purple-400" />
            <span className="text-sm text-gray-400">总连接数</span>
          </div>
          <div className="text-3xl font-bold">{totalConnections}</div>
        </div>
      </div>

      {/* Internal vs External */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Globe size={20} className="text-blue-400" />
            源 IP 类型分布
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={geoPieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {geoPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                itemStyle={{ color: '#e5e7eb' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="bg-blue-900/20 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-blue-400">{internalCount}</div>
              <div className="text-xs text-gray-400">内网连接</div>
              <div className="text-xs text-gray-500">{totalConnections > 0 ? ((internalCount / totalConnections) * 100).toFixed(1) : 0}%</div>
            </div>
            <div className="bg-yellow-900/20 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-yellow-400">{externalCount}</div>
              <div className="text-xs text-gray-400">外网连接</div>
              <div className="text-xs text-gray-500">{totalConnections > 0 ? ((externalCount / totalConnections) * 100).toFixed(1) : 0}%</div>
            </div>
          </div>
        </div>

        {/* Suspicious IPs */}
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ShieldAlert size={20} className="text-red-400" />
            可疑 IP 检测
          </h3>
          {suspiciousIps.length > 0 ? (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {suspiciousIps.map((ip, i) => (
                <div key={i} className="bg-red-900/10 border border-red-900/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-sm text-red-400">{ip.ip}</span>
                    <span className="text-xs text-gray-400">{ip.count} 次连接</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {ip.reasons.map((reason, j) => (
                      <span key={j} className="px-2 py-0.5 bg-red-900/30 text-red-300 rounded text-xs">
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ShieldAlert size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">未检测到可疑 IP</p>
            </div>
          )}
        </div>
      </div>

      {/* Source IP Chart */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Server size={20} className="text-blue-400" />
          源 IP 排行 (入站连接/发件方)
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={sourceBarData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9ca3af" />
            <YAxis dataKey="name" type="category" stroke="#9ca3af" width={130} fontSize={11} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              itemStyle={{ color: '#e5e7eb' }}
              formatter={(value: number, name: string) => [value, name === 'count' ? '总连接' : name === 'success' ? '成功' : '失败']}
            />
            <Legend />
            <Bar dataKey="success" stackId="a" fill="#10b981" name="成功" />
            <Bar dataKey="fail" stackId="a" fill="#ef4444" name="失败" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Destination IP Chart */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Globe size={20} className="text-green-400" />
          目标 IP 排行 (出站投递目标)
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={destBarData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9ca3af" />
            <YAxis dataKey="name" type="category" stroke="#9ca3af" width={130} fontSize={11} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              itemStyle={{ color: '#e5e7eb' }}
              formatter={(value: number, name: string) => [value, name === 'count' ? '总投递' : name === 'success' ? '成功' : '失败']}
            />
            <Legend />
            <Bar dataKey="success" stackId="a" fill="#10b981" name="成功" />
            <Bar dataKey="fail" stackId="a" fill="#ef4444" name="失败" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Source IP Table */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">源 IP 详细列表</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">排名</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">IP 地址</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">主机名</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">类型</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">连接数</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">成功</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">失败</th>
              </tr>
            </thead>
            <tbody>
              {sourceIpStats.map((ip, i) => {
                const isPrivate = sourceIpGeo.find(g => g.ip === ip.ip);
                return (
                  <tr key={i} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="py-3 px-4 text-gray-500">{i + 1}</td>
                    <td className="py-3 px-4 font-mono text-xs">{ip.ip}</td>
                    <td className="py-3 px-4 text-xs text-gray-400">{ip.host || '-'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        isPrivate?.type === '内网' ? 'bg-blue-900/50 text-blue-400' : 'bg-yellow-900/50 text-yellow-400'
                      }`}>
                        {isPrivate?.type || '未知'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold">{ip.count}</td>
                    <td className="py-3 px-4 text-right text-green-400">{ip.success}</td>
                    <td className="py-3 px-4 text-right text-red-400">{ip.fail}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Destination IP Table */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">目标 IP 详细列表</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">排名</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">IP 地址</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">主机名</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">投递数</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">成功</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">失败</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">成功率</th>
              </tr>
            </thead>
            <tbody>
              {destIpStats.map((ip, i) => {
                const rate = (ip.success + ip.fail) > 0 ? (ip.success / (ip.success + ip.fail)) * 100 : 0;
                return (
                  <tr key={i} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="py-3 px-4 text-gray-500">{i + 1}</td>
                    <td className="py-3 px-4 font-mono text-xs">{ip.ip}</td>
                    <td className="py-3 px-4 text-xs text-gray-400">{ip.host || '-'}</td>
                    <td className="py-3 px-4 text-right font-semibold">{ip.count}</td>
                    <td className="py-3 px-4 text-right text-green-400">{ip.success}</td>
                    <td className="py-3 px-4 text-right text-red-400">{ip.fail}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        rate >= 90 ? 'bg-green-900/50 text-green-400' :
                        rate >= 70 ? 'bg-yellow-900/50 text-yellow-400' :
                        'bg-red-900/50 text-red-400'
                      }`}>
                        {rate.toFixed(1)}%
                      </span>
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
