import { useBacktest } from '@/contexts/BacktestContext';
import { CustomDropdown } from '@/components/CustomDropdown';
import { CreateIndexFormState, ReturnTypes } from '@/features/backtest/types';
import { INDEX_TYPE_OPTIONS, BASE_CURRENCY_OPTIONS, CALENDAR_OPTIONS } from '@/features/backtest/data';
import { ReturnTypeSelector } from './ReturnTypeSelector';
import { DecrementConfigSection } from './DecrementConfigSection';
import { CalendarSelector } from './CalendarSelector';
import { ParameterSelectors } from './ParameterSelectors';

interface BacktestConfigStepProps {
  formState: CreateIndexFormState;
  onChange: (updates: Partial<CreateIndexFormState>) => void;
  onReturnTypeChange: (type: keyof ReturnTypes) => void;
  onCalendarToggle: (calendar: string) => void;
}

export function BacktestConfigStep({
  formState,
  onChange,
  onReturnTypeChange,
  onCalendarToggle,
}: BacktestConfigStepProps) {
  const { universes, filterSets, rankingRules, weightingConfigurations } = useBacktest();

  const universeOptions = universes.map((u) => u.universeName);
  const filterOptions = filterSets.map((f) => f.name);
  const rankingOptions = rankingRules.map((r) => r.name);
  const weightingOptions = weightingConfigurations.map((w) => w.name);

  const showDecrementFields =
    formState.returnTypes.decrementPoints || formState.returnTypes.decrementPercent;

  return (
    <div className="space-y-6">
      <h2 className="text-lg" style={{ color: '#0B236B' }}>Backtest Configuration</h2>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm mb-2" style={{ color: '#0B236B' }}>
            Backtest Name <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <input
            type="text"
            value={formState.backtestName}
            onChange={(e) => onChange({ backtestName: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0094B3]"
            style={{ borderColor: '#D1D5DB', color: '#0B236B' }}
            placeholder="e.g., APAC ESG Leaders Q1 2026 Test Run"
          />
          <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
            Descriptive name for this backtest scenario
          </p>
        </div>

        <div>
          <label className="block text-sm mb-2" style={{ color: '#0B236B' }}>
            Index Type <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <CustomDropdown
            options={INDEX_TYPE_OPTIONS}
            value={formState.indexType}
            onChange={(val) => {
              const updates: Partial<CreateIndexFormState> = { indexType: val };
              if (val === 'Fixed Basket') {
                updates.selectedFilters = '';
                updates.selectedRanking = '';
                updates.selectedWeighting = '';
              }
              onChange(updates);
            }}
            placeholder="Select index type"
          />
        </div>
      </div>

      <ReturnTypeSelector returnTypes={formState.returnTypes} onToggle={onReturnTypeChange} />

      {showDecrementFields && (
        <DecrementConfigSection
          returnTypes={formState.returnTypes}
          decrementFrequency={formState.decrementFrequency}
          decrementBasis={formState.decrementBasis}
          customDays={formState.customDays}
          totalPoints={formState.totalPoints}
          totalPercentage={formState.totalPercentage}
          onChange={onChange}
        />
      )}

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm mb-2" style={{ color: '#0B236B' }}>
            Base Currency <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <CustomDropdown
            options={BASE_CURRENCY_OPTIONS}
            value={formState.baseCurrency}
            onChange={(val) => onChange({ baseCurrency: val })}
            placeholder="Select base currency"
          />
        </div>

        <div>
          <label className="block text-sm mb-2" style={{ color: '#0B236B' }}>
            Base Value <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <input
            type="text"
            value={formState.baseValue}
            onChange={(e) => onChange({ baseValue: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0094B3]"
            style={{ borderColor: '#D1D5DB', color: '#0B236B' }}
            placeholder="Enter base value"
          />
        </div>
      </div>

      <CalendarSelector
        calendarOptions={CALENDAR_OPTIONS}
        selectedCalendars={formState.selectedCalendars}
        onToggle={onCalendarToggle}
      />

      <div>
        <label className="block text-sm mb-2" style={{ color: '#0B236B' }}>Description</label>
        <textarea
          value={formState.description}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0094B3]"
          style={{ borderColor: '#D1D5DB', color: '#0B236B' }}
          placeholder="Describe the backtest purpose, methodology notes, or any specific testing objectives..."
        />
      </div>

      <ParameterSelectors
        universeOptions={universeOptions}
        filterOptions={filterOptions}
        rankingOptions={rankingOptions}
        weightingOptions={weightingOptions}
        selectedUniverse={formState.selectedUniverse}
        selectedFilters={formState.selectedFilters}
        selectedRanking={formState.selectedRanking}
        selectedWeighting={formState.selectedWeighting}
        isFixedBasket={formState.indexType === 'Fixed Basket'}
        onChange={onChange}
      />
    </div>
  );
}
