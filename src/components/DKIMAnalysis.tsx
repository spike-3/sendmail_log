import { AnalysisResult } from '../utils/logParser';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Shield, ShieldCheck, ShieldX, ShieldAlert, Info } from 'lucide-react';

interface Props {
  data: AnalysisResult;
}

const RESULT_COLORS: Record<string, string> = {
  pass: '#10b981',
  fail: '#ef4444',
  neutral: '#f59e0b',
  temperror: '#8b5cf6',
  permerror: '#ec4899',
  none: '#6b7280',
};

export default function DKIMAnalysis({ data }: Props) {
  const { dkimStats, dkimByDomain, dkimFailures } = data;

  const pieData = [
    { name: '通过 (Pass)', value: dkimStats.pass, color: RESULT_COLORS.pass },
    { name: '失败 (Fail)', value: dkimStats.fail, color: RESULT_COLORS.fail },
    { name: '中性 (Neutral)', value: dkimStats.neutral, color: RESULT_COLORS.neutral },
    { name: '临时错误', value: dkimStats.temperror, color: RESULT_COLORS.temperror },
    { name: '永久错误', value: dkimStats.permerror, color: RESULT_COLORS.permerror },
    { name: '无签名', value: dkimStats.none, color: RESULT_COLORS.none },
  ].filter(d => d.value > 0);

  const domainBarData = dkimByDomain.slice(0, 10).map(d => ({
    name: d.domain.length > 25 ? d.domain.substring(0, 25) + '...' : d.domain,
    fullName: d.domain,
    pass: d.pass,
    fail: d.fail,
    total: d.total,
    passRate: d.passRate,
  }));

  const hasDkimData = dkimStats.total > 0;

  return (
    <div className="space-y-6">
      {/* DKIM Info Banner */}
      <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-4 flex gap-3">
        <Info size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-200">
          <strong>DKIM (DomainKeys Identified Mail)</strong> 是一种邮件验证方法，允许发件人通过数字签名关联域名与邮件。
          本工具解析 OpenDKIM / sendmail milter 的 DKIM 日志，支持以下格式：
          <code className="mx-1 px-1 py-0.5 bg-blue-900/50 rounded text-xs">DKIM: PASS/FAIL</code>、
          <code className="mx-1 px-1 py-0.5 bg-blue-900/50 rounded text-xs">DKIM verification result=...</code>、
          <code className="mx-1 px-1 py-0.5 bg-blue-900/50 rounded text-xs">d=domain s=selector</code>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
          <Shield size={18} className="mx-auto mb-1 text-gray-400" />
          <div className="text-2xl font-bold">{dkimStats.total}</div>
          <div className="text-xs text-gray-400">总验证次数</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-green-900/50 text-center">
          <ShieldCheck size={18} className="mx-auto mb-1 text-green-400" />
          <div className="text-2xl font-bold text-green-400">{dkimStats.pass}</div>
          <div className="text-xs text-gray-400">通过</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-red-900/50 text-center">
          <ShieldX size={18} className="mx-auto mb-1 text-red-400" />
          <div className="text-2xl font-bold text-red-400">{dkimStats.fail}</div>
          <div className="text-xs text-gray-400">失败</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-yellow-900/50 text-center">
          <ShieldAlert size={18} className="mx-auto mb-1 text-yellow-400" />
          <div className="text-2xl font-bold text-yellow-400">{dkimStats.neutral}</div>
          <div className="text-xs text-gray-400">中性</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-purple-900/50 text-center">
          <ShieldAlert size={18} className="mx-auto mb-1 text-purple-400" />
          <div className="text-2xl font-bold text-purple-400">{dkimStats.temperror}</div>
          <div className="text-xs text-gray-400">临时错误</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-pink-900/50 text-center">
          <ShieldAlert size={18} className="mx-auto mb-1 text-pink-400" />
          <div className="text-2xl font-bold text-pink-400">{dkimStats.permerror}</div>
          <div className="text-xs text-gray-400">永久错误</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
          <Shield size={18} className="mx-auto mb-1 text-gray-400" />
          <div className="text-2xl font-bold">{dkimStats.none}</div>
          <div className="text-xs text-gray-400">无签名</div>
        </div>
      </div>

      {/* Pass Rate */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">DKIM 通过率</h3>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">总体通过率</span>
              <span className={`text-2xl font-bold ${
                dkimStats.passRate >= 90 ? 'text-green-400' :
                dkimStats.passRate >= 70 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {dkimStats.passRate.toFixed(1)}%
              </span>
            </div>
            <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  dkimStats.passRate >= 90 ? 'bg-green-500' :
                  dkimStats.passRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${dkimStats.passRate}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
          <div className="text-center bg-gray-700/50 rounded-xl p-4 min-w-[120px]">
            <div className={`text-3xl font-bold ${
              dkimStats.passRate >= 90 ? 'text-green-400' :
              dkimStats.passRate >= 70 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {dkimStats.passRate >= 90 ? 'A' : dkimStats.passRate >= 80 ? 'B' : dkimStats.passRate >= 70 ? 'C' : 'D'}
            </div>
            <div className="text-xs text-gray-400 mt-1">安全等级</div>
          </div>
        </div>
      </div>

      {!hasDkimData ? (
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
          <Shield size={48} className="mx-auto mb-4 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-400 mb-2">未检测到 DKIM 日志</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            日志中未发现 DKIM 相关记录。请确保 sendmail 已配置 OpenDKIM milter，
            并且日志中包含 DKIM 验证结果。
          </p>
          <div className="mt-4 bg-gray-900 rounded-lg p-4 text-left text-xs text-gray-400 max-w-lg mx-auto">
            <p className="font-semibold text-gray-300 mb-2">启用 DKIM 日志记录：</p>
            <code className="block text-green-400">
              # /etc/mail/sendmail.mc<br/>
              INPUT_MAIL_FILTER(`opendkim', `S=unix:/run/opendkim/opendkim.sock')<br/><br/>
              # /etc/opendkim.conf<br/>
              LogResults Yes<br/>
              LogWhy Yes
            </code>
          </div>
        </div>
      ) : (
        <>
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">DKIM 结果分布</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    itemStyle={{ color: '#e5e7eb' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Domain Bar Chart */}
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">按域名统计</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={domainBarData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis dataKey="name" type="category" stroke="#9ca3af" width={150} fontSize={11} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    itemStyle={{ color: '#e5e7eb' }}
                  />
                  <Legend />
                  <Bar dataKey="pass" stackId="a" fill="#10b981" name="通过" />
                  <Bar dataKey="fail" stackId="a" fill="#ef4444" name="失败" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Domain Detail Table */}
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">域名 DKIM 详细数据</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">域名</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">总计</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">通过</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">失败</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">通过率</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {dkimByDomain.map((d, i) => (
                    <tr key={i} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                      <td className="py-3 px-4 font-mono text-xs">{d.domain}</td>
                      <td className="py-3 px-4 text-right font-semibold">{d.total}</td>
                      <td className="py-3 px-4 text-right text-green-400">{d.pass}</td>
                      <td className="py-3 px-4 text-right text-red-400">{d.fail}</td>
                      <td className="py-3 px-4 text-right">{d.passRate.toFixed(1)}%</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          d.passRate >= 90 ? 'bg-green-900/50 text-green-400' :
                          d.passRate >= 70 ? 'bg-yellow-900/50 text-yellow-400' :
                          'bg-red-900/50 text-red-400'
                        }`}>
                          {d.passRate >= 90 ? '正常' : d.passRate >= 70 ? '警告' : '异常'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* DKIM Failures */}
          {dkimFailures.length > 0 && (
            <div className="bg-gray-800 rounded-xl p-5 border border-red-900/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ShieldX size={20} className="text-red-400" />
                DKIM 失败记录 ({dkimFailures.length})
              </h3>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {dkimFailures.slice(0, 20).map((entry, i) => (
                  <div key={i} className="bg-red-900/10 border border-red-900/30 rounded-lg p-3 text-xs">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-gray-500">{entry.timestamp.toLocaleString()}</span>
                      <span className="px-1.5 py-0.5 bg-red-900/50 text-red-400 rounded">
                        {entry.dkimResult?.toUpperCase()}
                      </span>
                      {entry.dkimDomain && (
                        <span className="text-yellow-400 font-mono">d={entry.dkimDomain}</span>
                      )}
                      {entry.dkimSelector && (
                        <span className="text-blue-400 font-mono">s={entry.dkimSelector}</span>
                      )}
                    </div>
                    <div className="text-gray-400 truncate">{entry.dkimDetail}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
