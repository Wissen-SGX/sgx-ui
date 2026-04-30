import { CustomDropdown } from '@/components/CustomDropdown';
import { CreateIndexFormState, ReturnTypes } from '@/features/backtest/types';
import { DECREMENT_FREQUENCY_OPTIONS, DECREMENT_BASIS_OPTIONS } from '@sgx/shared';

interface DecrementConfigSectionProps {
  returnTypes: ReturnTypes;
  decrementFrequency: string;
  decrementBasis: string;
  customDays: string;
  totalPoints: string;
  totalPercentage: string;
  onChange: (updates: Partial<CreateIndexFormState>) => void;
}

export function DecrementConfigSection({
  returnTypes,
  decrementFrequency,
  decrementBasis,
  customDays,
  totalPoints,
  totalPercentage,
  onChange,
}: DecrementConfigSectionProps) {
  return (
    <div className="p-6 rounded-lg" style={{ backgroundColor: '#EBF8FF', border: '1px solid #0094B3' }}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-2" style={{ color: '#0B236B' }}>
            Decrement Frequency <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <CustomDropdown
            options={DECREMENT_FREQUENCY_OPTIONS}
            value={decrementFrequency}
            onChange={(val) => onChange({ decrementFrequency: val })}
            placeholder="Select frequency"
          />
        </div>

        <div>
          <label className="block text-sm mb-2" style={{ color: '#0B236B' }}>
            Decrement Basis <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <div className="flex items-center gap-6">
            {DECREMENT_BASIS_OPTIONS.map((option) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="decrementBasis"
                  value={option}
                  checked={decrementBasis === option}
                  onChange={(e) => onChange({ decrementBasis: e.target.value })}
                  className="w-4 h-4"
                  style={{ accentColor: '#0094B3' }}
                />
                <span className="text-sm" style={{ color: '#0B236B' }}>{option}</span>
              </label>
            ))}
            {decrementBasis === 'Custom' && (
              <input
                type="text"
                value={customDays}
                onChange={(e) => onChange({ customDays: e.target.value })}
                placeholder="Enter days"
                className="px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0094B3]"
                style={{ borderColor: '#D1D5DB', color: '#0B236B', width: '120px' }}
              />
            )}
          </div>
        </div>

        {returnTypes.decrementPoints && (
          <div>
            <label className="block text-sm mb-2" style={{ color: '#0B236B' }}>
              Total Points <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              value={totalPoints}
              onChange={(e) => onChange({ totalPoints: e.target.value })}
              placeholder="Enter total points"
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0094B3]"
              style={{ borderColor: '#D1D5DB', color: '#0B236B' }}
            />
          </div>
        )}

        {returnTypes.decrementPercent && (
          <div>
            <label className="block text-sm mb-2" style={{ color: '#0B236B' }}>
              Total % <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              value={totalPercentage}
              onChange={(e) => onChange({ totalPercentage: e.target.value })}
              placeholder="Enter total percentage"
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0094B3]"
              style={{ borderColor: '#D1D5DB', color: '#0B236B' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
