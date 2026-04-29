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
  Rocket,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { useGetBacktestById } from '@/features/backtest/hooks/useGetBacktests';
import { TYPE_LABELS } from '@/features/backtest/api/backtest.api';
import type { BacktestDetailApiData, BacktestResultItem } from '@/features/backtest/types';
import { JobStatus } from '@sgx/shared';

const STATUS_DISPLAY: Record<string, { label: string; bg: string; color: string }> = {
  DRAFT:                    { label: 'Draft',              bg: '#F1F5F9', color: '#64748B' },
  QUEUED:                   { label: 'Queued',             bg: '#F3F4F6', color: '#6B7280' },
  RUNNING:                  { label: 'In Progress',        bg: '#FEF3C7', color: '#92400E' },
  COMPLETED:                { label: 'Completed',          bg: '#DCFCE7', color: '#16A34A' },
  FAILED:                   { label: 'Failed',             bg: '#FEE2E2', color: '#DC2626' },
  'LAUNCHED TO PRODUCTION': { label: 'Live',               bg: '#DBEAFE', color: '#1E40AF' },
};

export default function BacktestDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const { data, isLoading, isError } = useGetBacktestById(id ?? '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={28} className="animate-spin" style={{ color: '#0094B3' }} />
      </div>
    );
  }

  if (isError || !data) {
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

  const statusDisplay = STATUS_DISPLAY[data.status] ?? { label: data.status, bg: '#F3F4F6', color: '#6B7280' };

  const tabs = [
    { key: 'overview',    label: 'Overview',     icon: Activity  },
    { key: 'parameters',  label: 'Parameters',   icon: FileText  },
    { key: 'indexLevels', label: 'Index Levels', icon: TrendingUp },
    { key: 'reports',     label: 'Reports',      icon: FileText  },
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
              {data.backtestName}
            </h1>
            <StatusBadge statusDisplay={statusDisplay} />
          </div>
          <p className="text-sm text-gray-500 mt-1">ID: {data.id} · Created by {data.createdBy}</p>
        </div>
        <StatusAction status={data.status} />
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="border rounded-lg p-5 bg-white" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={18} style={{ color: '#0094B3' }} />
            <div className="text-xs text-gray-600 uppercase">Created</div>
          </div>
          <div className="text-sm" style={{ color: '#0B236B' }}>
            {new Date(data.createdDate).toLocaleDateString()}
          </div>
        </div>

        <div className="border rounded-lg p-5 bg-white" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={18} style={{ color: '#16A34A' }} />
            <div className="text-xs text-gray-600 uppercase">Return Types</div>
          </div>
          <div className="text-sm" style={{ color: '#0B236B' }}>{data.returnTypes}</div>
        </div>

        <div className="border rounded-lg p-5 bg-white" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center gap-2 mb-3">
            <Activity size={18} style={{ color: '#0094B3' }} />
            <div className="text-xs text-gray-600 uppercase">Base Value</div>
          </div>
          <div className="text-xl" style={{ color: '#0B236B' }}>
            {data.baseValue.toLocaleString()} <span className="text-sm">{data.baseCurrency}</span>
          </div>
        </div>

        <div className="border rounded-lg p-5 bg-white" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown size={18} style={{ color: '#0094B3' }} />
            <div className="text-xs text-gray-600 uppercase">Calendars</div>
          </div>
          <div className="text-sm" style={{ color: '#0B236B' }}>{data.calendars}</div>
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

      {activeTab === 'overview'    && <OverviewTab data={data} statusDisplay={statusDisplay} />}
      {activeTab === 'parameters'  && <ParametersTab data={data} />}
      {activeTab === 'indexLevels' && <IndexLevelsTab results={data.results} />}
      {activeTab === 'reports'     && <ReportsTab results={data.results} />}
    </div>
  );
}

function StatusBadge({
  statusDisplay,
}: {
  statusDisplay: { label: string; bg: string; color: string };
}) {
  return (
    <span
      className="px-3 py-1 rounded text-xs"
      style={{ backgroundColor: statusDisplay.bg, color: statusDisplay.color }}
    >
      {statusDisplay.label}
    </span>
  );
}

function StatusAction({ status }: { status: string }) {
  if (status === JobStatus.QUEUED) {
    return (
      <button
        className="px-5 py-2.5 rounded-lg flex items-center gap-2 text-white text-sm"
        style={{ backgroundColor: '#16A34A' }}
      >
        <Rocket size={16} />
        Queued
      </button>
    );
  }
  if (status === JobStatus.DRAFT) {
    return (
      <button
        className="px-5 py-2.5 rounded-lg text-sm border"
        style={{ borderColor: '#E5E7EB', color: '#94A3B8' }}
      >
        Draft
      </button>
    );
  }
  if (status === JobStatus.COMPLETED) {
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
  if (status === JobStatus.RUNNING) {
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
  if (status === JobStatus.FAILED) {
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
  data,
  statusDisplay,
}: {
  data: BacktestDetailApiData;
  statusDisplay: { label: string; bg: string; color: string };
}) {
  return (
    <div className="space-y-6">
      {/* Status + Dates */}
      <div className="grid grid-cols-2 gap-6">
        <div className="border rounded-lg p-6" style={{ borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
          <div className="text-xs text-gray-600 uppercase mb-3">Status</div>
          <div
            className="px-3 py-1.5 rounded text-sm inline-block"
            style={{ backgroundColor: statusDisplay.bg, color: statusDisplay.color }}
          >
            {statusDisplay.label}
          </div>
        </div>
        <div className="border rounded-lg p-6" style={{ borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
          <div className="text-xs text-gray-600 uppercase mb-3">Created By</div>
          <div className="text-sm" style={{ color: '#0B236B' }}>{data.createdBy}</div>
        </div>
      </div>

      {/* Configuration */}
      <div className="border rounded-lg bg-white" style={{ borderColor: '#E5E7EB' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center gap-2 text-sm" style={{ color: '#0B236B' }}>
            <FileText size={16} />
            Configuration
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-x-16 gap-y-4">
            {([
              ['Index Type',    TYPE_LABELS[data.indexType] ?? data.indexType],
              ['Return Types',  data.returnTypes],
              ['Base Value',    String(data.baseValue)],
              ['Base Currency', data.baseCurrency],
              ['Calendars',     data.calendars],
            ] as [string, string][]).map(([label, value]) => (
              <div key={label} className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #F3F4F6' }}>
                <span className="text-sm text-gray-600">{label}</span>
                <span className="text-sm" style={{ color: '#0B236B' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Error message if failed */}
      {data.errorMessage && (
        <div className="border rounded-lg p-5 bg-red-50" style={{ borderColor: '#FECACA' }}>
          <div className="text-xs text-red-600 uppercase mb-1">Error</div>
          <p className="text-sm text-red-700">{data.errorMessage}</p>
        </div>
      )}

      {/* Metadata */}
      <div className="border rounded-lg bg-white" style={{ borderColor: '#E5E7EB' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center gap-2 text-sm" style={{ color: '#0B236B' }}>
            <FileText size={16} />
            Metadata
          </div>
        </div>
        <div className="p-6 space-y-3">
          {([
            ['Created',      new Date(data.createdDate).toLocaleString()],
            ['Last Updated', new Date(data.updatedDate).toLocaleString()],
            ['Triggered By', data.triggeredBy ?? '—'],
            ['Triggered At', data.triggeredAt ? new Date(data.triggeredAt).toLocaleString() : '—'],
            ['Completed At', data.completedAt ? new Date(data.completedAt).toLocaleString() : '—'],
          ] as [string, string][]).map(([label, value]) => (
            <div key={label} className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #F3F4F6' }}>
              <span className="text-sm text-gray-600">{label}</span>
              <span className="text-sm" style={{ color: '#0B236B' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ParametersTab({ data }: { data: BacktestDetailApiData }) {
  const left: [string, string][] = [
    ['Index Type',    TYPE_LABELS[data.indexType] ?? data.indexType],
    ['Base Currency', data.baseCurrency],
    ['Base Value',    String(data.baseValue)],
  ];
  const right: [string, string][] = [
    ['Return Types', data.returnTypes],
    ['Calendars',    data.calendars],
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

function IndexLevelsTab({ results }: { results: BacktestResultItem[] }) {
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

function ReportsTab({ results }: { results: BacktestResultItem[] }) {
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
