import { Download } from 'lucide-react';
import type { BacktestResultItem } from '@/features/backtest/types';

export function IndexLevelsTab({ results }: { results: BacktestResultItem[] }) {
  const levelFiles = results.filter((r) => r.resultType === 'INDEX_LEVELS');

  if (levelFiles.length === 0) {
    return (
      <div className="border rounded-lg p-12 bg-white text-center text-sm text-gray-500" style={{ borderColor: '#E5E7EB' }}>
        No index level data available yet.
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-white overflow-hidden" style={{ borderColor: '#E5E7EB' }}>
      <div className="px-6 py-4 border-b" style={{ borderColor: '#E5E7EB' }}>
        <div className="text-sm" style={{ color: '#0B236B' }}>Index Level Files</div>
      </div>
      <table className="w-full">
        <thead>
          <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
            {['File Name', 'Result Type', 'Created', 'Download'].map((col) => (
              <th key={col} className="text-left px-6 py-3 text-xs text-gray-600 uppercase tracking-wider">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {levelFiles.map((item, index) => (
            <tr
              key={item.id}
              className="hover:bg-gray-50"
              style={{ borderBottom: index < levelFiles.length - 1 ? '1px solid #E5E7EB' : 'none' }}
            >
              <td className="px-6 py-4 text-sm" style={{ color: '#0B236B' }}>{item.fileName}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{item.resultType}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{new Date(item.createdDate).toLocaleDateString()}</td>
              <td className="px-6 py-4">
                <button className="flex items-center gap-1 text-sm" style={{ color: '#0094B3' }}>
                  <Download size={14} />
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
