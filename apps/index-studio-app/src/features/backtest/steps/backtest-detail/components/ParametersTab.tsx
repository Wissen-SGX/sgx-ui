import { TYPE_LABELS } from '@/features/backtest/api/backtest.api';
import type { BacktestDetailApiData } from '@/features/backtest/types';

export function ParametersTab({ data }: { data: BacktestDetailApiData }) {
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
