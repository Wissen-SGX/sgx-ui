import { FileText, Paperclip } from 'lucide-react';
import { TYPE_LABELS } from '@/features/backtest/api/backtest.api';
import type { BacktestDetailApiData } from '@/features/backtest/types';

export function OverviewTab({
  data,
  statusDisplay,
}: {
  data: BacktestDetailApiData;
  statusDisplay: { label: string; bg: string; color: string };
}) {
  return (
    <div className="space-y-6">
      {/* Uploaded File */}
      {data.csvFileName && (
        <div className="border rounded-lg p-4 flex items-center gap-3" style={{ borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
          <Paperclip size={16} className="text-gray-400 shrink-0" />
          <div>
            <div className="text-xs text-gray-600 uppercase mb-0.5">Uploaded File</div>
            <div className="text-sm" style={{ color: '#0B236B' }}>{data.csvFileName}</div>
          </div>
        </div>
      )}

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
