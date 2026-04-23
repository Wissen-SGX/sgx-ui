import { ReturnTypes } from '@/features/backtest/types';

interface ReturnTypeSelectorProps {
  returnTypes: ReturnTypes;
  onToggle: (type: keyof ReturnTypes) => void;
}

const RETURN_TYPE_OPTIONS: { key: keyof ReturnTypes; label: string }[] = [
  { key: 'priceReturn', label: 'Price Return (PR)' },
  { key: 'totalReturn', label: 'Total Return (TR)' },
  { key: 'netTotalReturn', label: 'Net Total Return (NTR)' },
  { key: 'decrementPoints', label: 'Decrement (Points)' },
  { key: 'decrementPercent', label: 'Decrement (%)' },
];

export function ReturnTypeSelector({ returnTypes, onToggle }: ReturnTypeSelectorProps) {
  return (
    <div>
      <label className="block text-sm mb-2" style={{ color: '#0B236B' }}>
        Return Type <span style={{ color: '#EF4444' }}>*</span>
      </label>
      <p className="text-xs mb-3" style={{ color: '#6B7280' }}>
        Select one or more return types to calculate
      </p>
      <div className="grid grid-cols-2 gap-3">
        {RETURN_TYPE_OPTIONS.map(({ key, label }) => {
          const isChecked = returnTypes[key];
          return (
            <label
              key={key}
              className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              style={{
                borderColor: isChecked ? '#0094B3' : '#E5E7EB',
                backgroundColor: isChecked ? '#F0F9FF' : '#ffffff',
              }}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(key)}
                className="w-4 h-4"
                style={{ accentColor: '#0094B3' }}
              />
              <span className="text-sm" style={{ color: '#0B236B' }}>{label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
