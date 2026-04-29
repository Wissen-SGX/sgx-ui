import { Download, FileText, BarChart3, Table, RefreshCw, Share2, ChevronRight } from 'lucide-react';
import type { BacktestResultItem } from '@/features/backtest/types';

export function ReportsTab({ results }: { results: BacktestResultItem[] }) {
  const staticReports = [
    { id: 'performance', name: 'Performance Summary', icon: BarChart3 },
    { id: 'daily',       name: 'Daily Snapshot',      icon: Table    },
    { id: 'rebalance',   name: 'Rebalance Events',    icon: RefreshCw },
    { id: 'factsheet',   name: 'Factsheet',           icon: Share2   },
    { id: 'composition', name: 'Index Composition',   icon: FileText  },
  ];

  return (
    <div className="space-y-6">
      {/* API result files */}
      {results.length > 0 && (
        <div className="border rounded-lg bg-white overflow-hidden" style={{ borderColor: '#E5E7EB' }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: '#E5E7EB' }}>
            <div className="text-sm" style={{ color: '#0B236B' }}>Result Files</div>
          </div>
          <div className="divide-y" style={{ borderColor: '#E5E7EB' }}>
            {results.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E0F2FE' }}>
                    <FileText size={18} style={{ color: '#0094B3' }} />
                  </div>
                  <div>
                    <div className="text-sm" style={{ color: '#0B236B' }}>{item.fileName}</div>
                    <div className="text-xs text-gray-400">{item.resultType}</div>
                  </div>
                </div>
                <button className="flex items-center gap-1 text-sm" style={{ color: '#0094B3' }}>
                  <Download size={14} />
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Static report types */}
      <div className="grid grid-cols-2 gap-4">
        {staticReports.map(({ id, name, icon: Icon }) => (
          <button
            key={id}
            className="border rounded-lg p-5 bg-white hover:bg-gray-50 transition-colors text-left flex items-center justify-between group"
            style={{ borderColor: '#E5E7EB' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E0F2FE' }}>
                <Icon size={20} style={{ color: '#0094B3' }} />
              </div>
              <span className="text-sm" style={{ color: '#0B236B' }}>{name}</span>
            </div>
            <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
