import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  FileText,
  Rocket,
  CheckCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useGetBacktestById } from '@/features/backtest/hooks/useGetBacktests';
import { JobStatus } from '@sgx/shared';
import { OverviewTab } from './components/OverviewTab';
import { ParametersTab } from './components/ParametersTab';
import { IndexLevelsTab } from './components/IndexLevelsTab';
import { ReportsTab } from './components/ReportsTab';

const STATUS_DISPLAY: Record<string, { label: string; bg: string; color: string }> = {
  DRAFT:                    { label: 'Draft',              bg: '#F1F5F9', color: '#64748B' },
  QUEUED:                   { label: 'Queued',             bg: '#F3F4F6', color: '#6B7280' },
  RUNNING:                  { label: 'In Progress',        bg: '#FEF3C7', color: '#92400E' },
  COMPLETED:                { label: 'Completed',          bg: '#DCFCE7', color: '#16A34A' },
  FAILED:                   { label: 'Failed',             bg: '#FEE2E2', color: '#DC2626' },
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
