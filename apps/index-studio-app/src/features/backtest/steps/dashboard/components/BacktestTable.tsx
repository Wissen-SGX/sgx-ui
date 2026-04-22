import { useNavigate } from 'react-router-dom';
import { FileText, RefreshCw, CheckCircle, Rocket, XCircle, Play, Square, Eye, MoreVertical } from 'lucide-react';
import { BacktestEntry, BacktestStatus } from '@/features/backtest/types';

interface BacktestTableProps {
  entries: BacktestEntry[];
  onRun: (id: string, e: React.MouseEvent) => void;
  onStop: (id: string, e: React.MouseEvent) => void;
}

function StatusBadge({ entry }: { entry: BacktestEntry }) {
  return (
    <div className="flex items-center gap-2">
      {entry.icon === 'loading' && <RefreshCw size={14} className="animate-spin" style={{ color: entry.statusColor }} />}
      {entry.icon === 'error' && <XCircle size={14} style={{ color: entry.statusColor }} />}
      {entry.status === 'Completed' && !entry.icon && <CheckCircle size={14} style={{ color: entry.statusColor }} />}
      {entry.status === 'Launched to Production' && <Rocket size={14} style={{ color: entry.statusColor }} />}
      <span
        className="px-3 py-1 rounded text-xs"
        style={{ backgroundColor: entry.statusBg, color: entry.statusColor }}
      >
        {entry.status}
      </span>
    </div>
  );
}

function PerformanceBadge({ entry }: { entry: BacktestEntry }) {
  if (entry.icon === 'loading') {
    return (
      <div className="flex items-center gap-2 text-sm" style={{ color: '#F59E0B' }}>
        <RefreshCw size={14} className="animate-spin" />
        Awaiting Results
      </div>
    );
  }
  if (entry.performanceValue !== null) {
    return (
      <div className="flex items-center gap-2">
        <div className="text-sm" style={{ color: '#16A34A' }}>
          {entry.trend === 'up' ? '↑' : '↓'} {entry.performance}
        </div>
      </div>
    );
  }
  return <div className="text-sm text-gray-500">{entry.performance}</div>;
}

const COLUMNS = ['Backtest Name', 'Type', 'Period', 'Status', 'Performance', 'Actions'];

const STATUS_WITH_RUNNING_ACTION: BacktestStatus[] = ['Running'];

export function BacktestTable({ entries, onRun, onStop }: BacktestTableProps) {
  const navigate = useNavigate();

  return (
    <div className="border rounded-lg bg-white overflow-hidden" style={{ borderColor: '#E5E7EB' }}>
      <table className="w-full">
        <thead>
          <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
            {COLUMNS.map((col) => (
              <th key={col} className="text-left px-6 py-3 text-xs text-gray-600 uppercase tracking-wider">
                {col === 'Backtest Name' ? (
                  <div className="flex items-center gap-2">
                    <FileText size={14} />
                    {col}
                  </div>
                ) : col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                No backtests match your filters
              </td>
            </tr>
          ) : (
            entries.map((entry, index) => (
              <tr
                key={entry.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                style={{ borderBottom: index < entries.length - 1 ? '1px solid #E5E7EB' : 'none' }}
                onClick={() => navigate(`/backtest/${entry.id}`)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-gray-400 shrink-0" />
                    <div>
                      <div className="text-sm" style={{ color: '#0B236B' }}>{entry.name}</div>
                      <div className="text-xs text-gray-500">{entry.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className="px-3 py-1 rounded text-xs"
                    style={{
                      backgroundColor: entry.type === 'standard' ? '#DBEAFE' : '#FEF3C7',
                      color: entry.type === 'standard' ? '#1E40AF' : '#92400E',
                    }}
                  >
                    {entry.typeLabel}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>📅</span>
                    <span>{entry.period.start}</span>
                    <span>→</span>
                    <span>{entry.period.end}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge entry={entry} />
                </td>
                <td className="px-6 py-4">
                  <PerformanceBadge entry={entry} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {STATUS_WITH_RUNNING_ACTION.includes(entry.status) ? (
                      <button
                        onClick={(e) => onStop(entry.id, e)}
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                        title="Stop backtest"
                      >
                        <Square size={16} style={{ color: '#DC2626' }} />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => onRun(entry.id, e)}
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                        title="Run backtest"
                      >
                        <Play size={16} style={{ color: '#0094B3' }} />
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/backtest/${entry.id}`)}
                      className="p-2 hover:bg-gray-100 rounded transition-colors"
                      title="View details"
                    >
                      <Eye size={16} style={{ color: '#0094B3' }} />
                    </button>
                    <button
                      className="p-2 hover:bg-gray-100 rounded transition-colors"
                      title="More options"
                    >
                      <MoreVertical size={16} className="text-gray-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
