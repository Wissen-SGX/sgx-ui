import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  Download,
  FileText,
  ChevronRight,
  BarChart3,
  Table,
  RefreshCw,
  Share2,
  CheckCircle,
  Rocket,
  Paperclip,
} from 'lucide-react';
import { useBacktest } from '@/contexts/BacktestContext';
import { BacktestDetailData, BacktestEntry, BacktestStatus } from '@/features/backtest/types';

export default function BacktestDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const { backtestEntries, getBacktestDetail } = useBacktest();

  const entry = backtestEntries.find((e) => e.id === id);
  const detail = getBacktestDetail(id ?? '');
  console.log('Backtest Entry:', entry);
  console.log('Backtest Detail:', detail);

  if (!entry) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <p className="text-sm text-gray-500">Backtest not found.</p>
        <button
          onClick={() => navigate('/backtest/dashboard')}
          className="flex items-center gap-2 text-sm"
          style={{ color: '#0094B3' }}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
      </div>
    );
  }

  const tabs = [
    { key: 'overview', label: 'Overview', icon: Activity },
    { key: 'parameters', label: 'Parameters', icon: FileText },
    { key: 'indexLevels', label: 'Index Levels', icon: TrendingUp },
    { key: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/backtest/dashboard')}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl" style={{ color: '#0B236B' }}>
              {entry.name}
            </h1>
            <StatusBadge status={entry.status} />
          </div>
          <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
        </div>
        <StatusAction status={entry.status} />
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="border rounded-lg p-5 bg-white" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={18} style={{ color: '#0094B3' }} />
            <div className="text-xs text-gray-600 uppercase">Period</div>
          </div>
          <div className="text-sm" style={{ color: '#0B236B' }}>
            {entry.period.start} – {entry.period.end}
          </div>
        </div>

        <div className="border rounded-lg p-5 bg-white" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={18} style={{ color: '#16A34A' }} />
            <div className="text-xs text-gray-600 uppercase">Total Return</div>
          </div>
          <div className="text-xl" style={{ color: detail?.totalReturn.startsWith('+') ? '#16A34A' : '#0B236B' }}>
            {detail?.totalReturn ?? '--'}
          </div>
        </div>

        <div className="border rounded-lg p-5 bg-white" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center gap-2 mb-3">
            <Activity size={18} style={{ color: '#0094B3' }} />
            <div className="text-xs text-gray-600 uppercase">Sharpe Ratio</div>
          </div>
          <div className="text-xl" style={{ color: '#0B236B' }}>
            {detail?.sharpeRatio ?? '--'}
          </div>
        </div>

        <div className="border rounded-lg p-5 bg-white" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown size={18} style={{ color: '#DC2626' }} />
            <div className="text-xs text-gray-600 uppercase">Max Drawdown</div>
          </div>
          <div className="text-xl" style={{ color: '#DC2626' }}>
            {detail?.maxDrawdown ?? '--'}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b" style={{ borderColor: '#E5E7EB' }}>
        <div className="flex gap-8">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="pb-3 text-sm transition-colors relative"
              style={{ color: activeTab === key ? '#0094B3' : '#6B7280' }}
            >
              <div className="flex items-center gap-2">
                <Icon size={16} />
                {label}
              </div>
              {activeTab === key && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: '#0094B3' }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && <OverviewTab entry={entry} detail={detail} />}
      {activeTab === 'parameters' && <ParametersTab detail={detail} />}
      {activeTab === 'indexLevels' && <IndexLevelsTab indexLevels={detail?.indexLevels ?? []} />}
      {activeTab === 'reports' && <ReportsTab />}
    </div>
  );
}

function StatusBadge({ status }: { status: BacktestStatus }) {
  const map: Record<BacktestStatus, { label: string; bg: string; color: string }> = {
    'Launched to Production': { label: 'Live', bg: '#DBEAFE', color: '#1E40AF' },
    Completed: { label: 'Completed', bg: '#DCFCE7', color: '#16A34A' },
    Running: { label: 'In Progress', bg: '#FEF3C7', color: '#92400E' },
    Draft: { label: 'Draft', bg: '#F1F5F9', color: '#64748B' },
    Failed: { label: 'Failed', bg: '#FEE2E2', color: '#DC2626' },
  };
  const s = map[status];
  return (
    <span
      className="px-3 py-1 rounded text-xs"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}

function StatusAction({ status }: { status: BacktestStatus }) {
  if (status === 'Launched to Production') {
    return (
      <button
        className="px-5 py-2.5 rounded-lg flex items-center gap-2 text-white text-sm"
        style={{ backgroundColor: '#16A34A' }}
      >
        <Rocket size={16} />
        Launched to Production
      </button>
    );
  }
  if (status === 'Completed') {
    return (
      <button
        className="px-5 py-2.5 rounded-lg flex items-center gap-2 text-white text-sm"
        style={{ backgroundColor: '#0094B3' }}
      >
        <CheckCircle size={16} />
        Completed
      </button>
    );
  }
  if (status === 'Running') {
    return (
      <button
        className="px-5 py-2.5 rounded-lg flex items-center gap-2 text-white text-sm"
        style={{ backgroundColor: '#F59E0B' }}
      >
        <RefreshCw size={16} className="animate-spin" />
        Running
      </button>
    );
  }
  if (status === 'Failed') {
    return (
      <button
        className="px-5 py-2.5 rounded-lg text-white text-sm"
        style={{ backgroundColor: '#DC2626' }}
      >
        Failed
      </button>
    );
  }
  return (
    <button
      className="px-5 py-2.5 rounded-lg border text-sm"
      style={{ borderColor: '#E5E7EB', color: '#94A3B8' }}
    >
      Draft
    </button>
  );
}

function OverviewTab({
  entry,
  detail,
}: {
  entry: BacktestEntry;
  detail: BacktestDetailData | undefined;
}) {
  const cfg = detail?.configuration;
  const meta = detail?.metadata;

  return (
    <div className="space-y-6">
      {entry.uploadedFileName && (
        <div className="border rounded-lg p-5 bg-white flex items-center gap-3" style={{ borderColor: '#E5E7EB' }}>
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: '#E0F2FE' }}
          >
            <Paperclip size={18} style={{ color: '#0094B3' }} />
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Uploaded Basket File</div>
            <div className="text-sm font-medium" style={{ color: '#0B236B' }}>{entry.uploadedFileName}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div className="border rounded-lg p-6" style={{ borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
          <div className="text-xs text-gray-600 uppercase mb-3">Status</div>
          <div
            className="px-3 py-1.5 rounded text-sm inline-block"
            style={{ backgroundColor: entry.statusBg, color: entry.statusColor }}
          >
            {entry.status}
          </div>
        </div>
        <div className="border rounded-lg p-6" style={{ borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
          <div className="text-xs text-gray-600 uppercase mb-3">Backtest Period</div>
          <div className="text-sm" style={{ color: '#0B236B' }}>
            {entry.period.start} – {entry.period.end}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="border rounded-lg p-6" style={{ borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
          <div className="text-xs text-gray-600 uppercase mb-3">Total Return</div>
          <div className="text-xl" style={{ color: detail?.totalReturn?.startsWith('+') ? '#16A34A' : '#0B236B' }}>
            {detail?.totalReturn ?? '--'}
          </div>
        </div>
        <div className="border rounded-lg p-6" style={{ borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
          <div className="text-xs text-gray-600 uppercase mb-3">Sharpe Ratio</div>
          <div className="text-xl" style={{ color: '#0B236B' }}>
            {detail?.sharpeRatio ?? '--'}
          </div>
        </div>
      </div>

      {/* Configuration */}
      {cfg && (
        <div className="border rounded-lg bg-white" style={{ borderColor: '#E5E7EB' }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: '#E5E7EB' }}>
            <div className="flex items-center gap-2 text-sm" style={{ color: '#0B236B' }}>
              <FileText size={16} />
              Configuration
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-x-16 gap-y-4">
              {[
                ['Index Type', cfg.indexType],
                ['Return Type', cfg.returnType],
                ['Rebalance Frequency', cfg.rebalanceFrequency],
                ['Currency', cfg.currency],
                ['Base Value', cfg.baseValue],
                ['Base Date', cfg.baseDate],
                ['Dividend Treatment', cfg.dividendTreatment],
                ['Weight Ceiling', cfg.weightCeiling],
                ['Weighting Method', cfg.weightingMethod],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">{label}</span>
                  <span className="text-sm" style={{ color: '#0B236B' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      {detail && (
        <div className="border rounded-lg bg-white" style={{ borderColor: '#E5E7EB' }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: '#E5E7EB' }}>
            <div className="flex items-center gap-2 text-sm" style={{ color: '#0B236B' }}>
              <Activity size={16} />
              Performance Metrics
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Total Return', value: detail.totalReturn, color: detail.totalReturn.startsWith('+') ? '#16A34A' : '#0B236B' },
                { label: 'Annualized Return', value: detail.annualizedReturn, color: detail.annualizedReturn.startsWith('+') ? '#16A34A' : '#0B236B' },
                { label: 'Volatility', value: detail.volatility, color: '#0B236B' },
                { label: 'Sharpe Ratio', value: detail.sharpeRatio, color: '#0B236B' },
                { label: 'Max Drawdown', value: detail.maxDrawdown, color: detail.maxDrawdown.startsWith('-') ? '#DC2626' : '#0B236B' },
                { label: 'Sortino', value: detail.sortino, color: '#0B236B' },
                { label: 'Calmar', value: detail.calmar, color: '#0B236B' },
              ].map(({ label, value, color }) => (
                <div key={label} className="border rounded-lg p-4 bg-white" style={{ borderColor: '#E5E7EB' }}>
                  <div className="text-xs text-gray-500 mb-2">{label}</div>
                  <div className="text-lg" style={{ color }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Backtesting Algorithm */}
      <div className="border rounded-lg bg-white" style={{ borderColor: '#E5E7EB' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm" style={{ color: '#0B236B' }}>
              <FileText size={16} />
              Backtesting Algorithm
              <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: '#DBEAFE', color: '#1E40AF' }}>
                Frozen
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1 text-sm" style={{ color: '#0094B3' }}>
                <FileText size={14} />
                Previous Algorithm
              </button>
              <button className="flex items-center gap-1 text-sm" style={{ color: '#0094B3' }}>
                <Download size={14} />
                Download
              </button>
            </div>
          </div>
        </div>
        <div className="p-6 text-sm text-gray-500 text-center py-8">
          📄 "selection_algorithm.py" uploaded
          <div className="text-xs text-gray-400 mt-1">
            Click "Previous Algorithm" to view or "Download" to save a copy
          </div>
        </div>
      </div>

      {/* Metadata */}
      {meta && (
        <div className="border rounded-lg bg-white" style={{ borderColor: '#E5E7EB' }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: '#E5E7EB' }}>
            <div className="flex items-center gap-2 text-sm" style={{ color: '#0B236B' }}>
              <FileText size={16} />
              Metadata
            </div>
          </div>
          <div className="p-6 space-y-3">
            {[
              ['Created', meta.created],
              ['Completed', meta.completed ?? 'In Progress'],
              ['Last Updated', meta.lastUpdated],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">{label}</span>
                <span className="text-sm" style={{ color: '#0B236B' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="border rounded-lg bg-white" style={{ borderColor: '#E5E7EB' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center gap-2 text-sm" style={{ color: '#0B236B' }}>
            <FileText size={16} />
            Description
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-700">{entry.description || 'No description provided.'}</p>
        </div>
      </div>
    </div>
  );
}

function ParametersTab({ detail }: { detail: BacktestDetailData | undefined }) {
  const cfg = detail?.configuration;

  if (!cfg) {
    return (
      <div className="border rounded-lg p-12 bg-white text-center text-sm text-gray-500" style={{ borderColor: '#E5E7EB' }}>
        No parameter data available.
      </div>
    );
  }

  const left = [
    ['Index Type', cfg.indexType],
    ['Currency', cfg.currency],
    ['Base Date', cfg.baseDate],
    ['Rebalance Frequency', cfg.rebalanceFrequency],
    ['Weight Ceiling', cfg.weightCeiling],
  ];
  const right = [
    ['Return Type', cfg.returnType],
    ['Base Value', cfg.baseValue],
    ['Weighting Method', cfg.weightingMethod],
    ['Dividend Treatment', cfg.dividendTreatment],
  ];

  return (
    <div className="space-y-6">
      <div className="border rounded-lg bg-white" style={{ borderColor: '#E5E7EB' }}>
        <div className="grid grid-cols-2 gap-8 p-6">
          <div className="space-y-4">
            {left.map(([label, value], i) => (
              <div
                key={label}
                className="flex justify-between items-center py-3"
                style={{ borderBottom: i < left.length - 1 ? '1px solid #E5E7EB' : 'none' }}
              >
                <span className="text-sm text-gray-600">{label}</span>
                <span className="text-sm" style={{ color: '#0B236B' }}>{value}</span>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {right.map(([label, value], i) => (
              <div
                key={label}
                className="flex justify-between items-center py-3"
                style={{ borderBottom: i < right.length - 1 ? '1px solid #E5E7EB' : 'none' }}
              >
                <span className="text-sm text-gray-600">{label}</span>
                <span className="text-sm" style={{ color: '#0B236B' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function IndexLevelsTab({
  indexLevels,
}: {
  indexLevels: BacktestDetailData['indexLevels'];
}) {
  if (indexLevels.length === 0) {
    return (
      <div className="border rounded-lg p-12 bg-white text-center text-sm text-gray-500" style={{ borderColor: '#E5E7EB' }}>
        No index level data available yet.
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-white overflow-hidden" style={{ borderColor: '#E5E7EB' }}>
      <div className="px-6 py-4 border-b" style={{ borderColor: '#E5E7EB' }}>
        <div className="text-sm" style={{ color: '#0B236B' }}>Historical Index Levels</div>
      </div>
      <table className="w-full">
        <thead>
          <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
            {['Date', 'Index Value', 'Daily Change'].map((col) => (
              <th key={col} className="text-left px-6 py-3 text-xs text-gray-600 uppercase tracking-wider">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {indexLevels.map((item, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50"
              style={{ borderBottom: index < indexLevels.length - 1 ? '1px solid #E5E7EB' : 'none' }}
            >
              <td className="px-6 py-4 text-sm" style={{ color: '#0B236B' }}>{item.date}</td>
              <td className="px-6 py-4 text-sm" style={{ color: '#0094B3' }}>{item.value}</td>
              <td className="px-6 py-4">
                <span className="text-sm" style={{ color: item.positive ? '#16A34A' : '#DC2626' }}>
                  {item.change}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReportsTab() {
  const reports = [
    { id: 1, name: 'Performance Summary', icon: BarChart3 },
    { id: 2, name: 'Index Levels (R-4)', icon: Table },
    { id: 3, name: 'Daily Snapshot', icon: Table },
    { id: 4, name: 'Rebalance Events', icon: RefreshCw },
    { id: 5, name: 'Factsheet', icon: Share2 },
    { id: 6, name: 'Index Composition', icon: FileText },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {reports.map(({ id, name, icon: Icon }) => (
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
  );
}
