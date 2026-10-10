import { useState } from 'react';
import { AnalysisResult } from '../utils/logParser';
import { FileText, Search, Filter } from 'lucide-react';

interface Props {
  data: AnalysisResult;
}

type FilterType = 'all' | 'from' | 'to' | 'stat' | 'warning' | 'error' | 'reject' | 'connect' | 'disconnect';

export default function LogTable({ data }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [queueFilter, setQueueFilter] = useState('');

  const filteredEntries = data.entries.filter(entry => {
    if (filterType !== 'all' && entry.type !== filterType) return false;
    if (queueFilter && entry.queueId !== queueFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return entry.raw.toLowerCase().includes(term) ||
             (entry.from && entry.from.toLowerCase().includes(term)) ||
             (entry.to && entry.to.toLowerCase().includes(term)) ||
             (entry.status && entry.status.toLowerCase().includes(term)) ||
             (entry.relay && entry.relay.toLowerCase().includes(term));
    }
    return true;
  });

  const filterOptions: { value: FilterType; label: string; color: string }[] = [
    { value: 'all', label: '全部', color: 'bg-gray-600' },
    { value: 'from', label: 'FROM', color: 'bg-blue-600' },
    { value: 'to', label: 'TO', color: 'bg-green-600' },
    { value: 'stat', label: 'STAT', color: 'bg-purple-600' },
    { value: 'warning', label: 'WARNING', color: 'bg-yellow-600' },
    { value: 'error', label: 'ERROR', color: 'bg-red-600' },
    { value: 'reject', label: 'REJECT', color: 'bg-orange-600' },
    { value: 'connect', label: 'CONNECT', color: 'bg-cyan-600' },
    { value: 'disconnect', label: 'DISCONNECT', color: 'bg-gray-500' },
  ];

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'from': return 'bg-blue-900/50 text-blue-400 border-blue-700';
      case 'to': return 'bg-green-900/50 text-green-400 border-green-700';
      case 'stat': return 'bg-purple-900/50 text-purple-400 border-purple-700';
      case 'warning': return 'bg-yellow-900/50 text-yellow-400 border-yellow-700';
      case 'error': return 'bg-red-900/50 text-red-400 border-red-700';
      case 'reject': return 'bg-orange-900/50 text-orange-400 border-orange-700';
      case 'connect': return 'bg-cyan-900/50 text-cyan-400 border-cyan-700';
      case 'disconnect': return 'bg-gray-700/50 text-gray-400 border-gray-600';
      default: return 'bg-gray-700/50 text-gray-400 border-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="搜索日志内容..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="队列ID筛选"
              value={queueFilter}
              onChange={(e) => setQueueFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 w-32"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {filterOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilterType(opt.value)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filterType === opt.value
                  ? `${opt.color} text-white`
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-gray-400 px-2">
        <span>共 {filteredEntries.length} 条记录 (总计 {data.entries.length} 条)</span>
        <span>显示前 100 条</span>
      </div>

      {/* Log Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="text-left py-3 px-3 text-gray-400 font-medium w-32">时间</th>
                <th className="text-left py-3 px-3 text-gray-400 font-medium w-20">类型</th>
                <th className="text-left py-3 px-3 text-gray-400 font-medium w-24">队列ID</th>
                <th className="text-left py-3 px-3 text-gray-400 font-medium">内容</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.slice(0, 100).map((entry, i) => (
                <tr key={i} className="border-b border-gray-700/30 hover:bg-gray-700/20">
                  <td className="py-2 px-3 text-gray-500 font-mono whitespace-nowrap">
                    {entry.timestamp.toLocaleTimeString()}
                  </td>
                  <td className="py-2 px-3">
                    <span className={`px-1.5 py-0.5 rounded border text-[10px] font-medium ${getTypeColor(entry.type)}`}>
                      {entry.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-mono text-gray-400">{entry.queueId}</td>
                  <td className="py-2 px-3 text-gray-300">
                    <div className="flex flex-wrap gap-2">
                      {entry.from && <span className="text-blue-300">from: {entry.from}</span>}
                      {entry.to && <span className="text-green-300">to: {entry.to}</span>}
                      {entry.status && <span className="text-yellow-300">stat: {entry.status}</span>}
                      {entry.relay && <span className="text-purple-300">relay: {entry.relay}</span>}
                      {entry.delay !== undefined && <span className="text-cyan-300">delay: {entry.delay}s</span>}
                      {entry.mailer && <span className="text-gray-400">mailer: {entry.mailer}</span>}
                      {entry.size !== undefined && <span className="text-gray-400">size: {entry.size}</span>}
                      {!entry.from && !entry.to && !entry.status && !entry.relay && (
                        <span className="text-gray-500 truncate max-w-lg">{entry.raw.substring(0, 200)}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Raw Log View */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText size={20} className="text-gray-400" />
          原始日志 (前50行)
        </h3>
        <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs overflow-x-auto max-h-96 overflow-y-auto">
          {data.entries.slice(0, 50).map((entry, i) => (
            <div key={i} className="py-0.5 text-gray-400 hover:text-gray-200">
              <span className="text-gray-600 mr-2">{String(i + 1).padStart(3, '0')}</span>
              {entry.raw}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
