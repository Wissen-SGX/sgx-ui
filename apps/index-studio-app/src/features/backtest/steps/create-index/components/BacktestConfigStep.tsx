import { useRef } from 'react';
import { Upload, Calendar } from 'lucide-react';
import { useBacktest } from '@/contexts/BacktestContext';
import { CustomDropdown } from '@/components/CustomDropdown';
import { CreateIndexFormState, ReturnTypes } from '@/features/backtest/types';
import { INDEX_TYPE_OPTIONS, BASE_CURRENCY_OPTIONS, CALENDAR_OPTIONS } from '@/features/backtest/data';
import { ReturnTypeSelector } from './ReturnTypeSelector';
import { DecrementConfigSection } from './DecrementConfigSection';
import { CalendarSelector } from './CalendarSelector';
import { ParameterSelectors } from './ParameterSelectors';
import { Step1Errors } from './IndexForm';

interface BacktestConfigStepProps {
  formState: CreateIndexFormState;
  onChange: (updates: Partial<CreateIndexFormState>) => void;
  onReturnTypeChange: (type: keyof ReturnTypes) => void;
  onCalendarToggle: (calendar: string) => void;
  errors?: Step1Errors;
}

export function BacktestConfigStep({
  formState,
  onChange,
  onReturnTypeChange,
  onCalendarToggle,
  errors,
}: BacktestConfigStepProps) {
  const { universes, filterSets, rankingRules, weightingConfigurations } = useBacktest();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const universeOptions = universes.map((u) => u.universeName);
  const filterOptions = filterSets.map((f) => f.name);
  const rankingOptions = rankingRules.map((r) => r.name);
  const weightingOptions = weightingConfigurations.map((w) => w.name);

  const showDecrementFields =
    formState.returnTypes.decrementPoints || formState.returnTypes.decrementPercent;

  const isFixedBasket = formState.indexType.includes('Fixed Basket');
  const todayISO = new Date().toISOString().split('T')[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onChange({ uploadedFile: file, uploadedFileName: file?.name ?? null });
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg" style={{ color: '#0B236B' }}>Backtest Configuration</h2>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm mb-2" style={{ color: '#0B236B' }}>
            Backtest Name
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
            Index Type
          </label>
          <CustomDropdown
            options={INDEX_TYPE_OPTIONS}
            value={formState.indexType}
            onChange={(val) => {
              const updates: Partial<CreateIndexFormState> = { indexType: val };
              if (val.includes('Fixed Basket')) {
                updates.selectedUniverse = '';
                updates.selectedFilters = '';
                updates.selectedRanking = '';
                updates.selectedWeighting = '';
              } else {
                updates.uploadedFile = null;
                updates.uploadedFileName = null;
              }
              onChange(updates);
            }}
            placeholder="Select index type"
          />
          {isFixedBasket && (
            <div className="flex items-center gap-3 mt-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-1.5 border rounded-lg text-sm transition-colors hover:bg-blue-50"
                style={{ borderColor: '#0094B3', color: '#0094B3' }}
              >
                <Upload size={14} />
                Upload File
              </button>
              {(formState.uploadedFile || formState.uploadedFileName) ? (
                <span
                  className="text-sm truncate max-w-45"
                  style={{ color: '#374151' }}
                  title={formState.uploadedFile?.name ?? formState.uploadedFileName ?? ''}
                >
                  {formState.uploadedFile?.name ?? formState.uploadedFileName}
                </span>
              ) : (
                <span className="text-xs" style={{ color: '#9CA3AF' }}>
                  .csv, .xlsx, .xls
                </span>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <ReturnTypeSelector returnTypes={formState.returnTypes} onToggle={onReturnTypeChange} />
        {errors?.returnTypes && (
          <p className="text-xs mt-2" style={{ color: '#EF4444' }}>{errors.returnTypes}</p>
        )}
      </div>

      {showDecrementFields && (
        <div className="opacity-40 pointer-events-none select-none">
          <DecrementConfigSection
            returnTypes={formState.returnTypes}
            decrementFrequency={formState.decrementFrequency}
            decrementBasis={formState.decrementBasis}
            customDays={formState.customDays}
            totalPoints={formState.totalPoints}
            totalPercentage={formState.totalPercentage}
            onChange={onChange}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm mb-2" style={{ color: '#0B236B' }}>
            Backtest Start Date <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <div className="relative">
            <Calendar
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: '#6B7280' }}
            />
            <input
              type="date"
              value={formState.backtestStartDate}
              max={todayISO}
              onChange={(e) => onChange({ backtestStartDate: e.target.value })}
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0094B3]"
              style={{ borderColor: errors?.backtestStartDate ? '#EF4444' : '#D1D5DB', color: '#0B236B' }}
            />
          </div>
          {errors?.backtestStartDate ? (
            <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.backtestStartDate}</p>
          ) : (
            <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
              Historical start date for backtesting — index base date
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-2" style={{ color: '#0B236B' }}>
            Backtest End Date <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <div className="relative">
            <Calendar
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: '#6B7280' }}
            />
            <input
              type="date"
              value={formState.backtestEndDate}
              max={todayISO}
              onChange={(e) => onChange({ backtestEndDate: e.target.value })}
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0094B3]"
              style={{ borderColor: errors?.backtestEndDate ? '#EF4444' : '#D1D5DB', color: '#0B236B' }}
            />
          </div>
          {errors?.backtestEndDate ? (
            <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.backtestEndDate}</p>
          ) : (
            <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
              End date for backtest calculation (latest available date)
            </p>
          )}
        </div>
      </div>

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
          {errors?.baseCurrency && (
            <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.baseCurrency}</p>
          )}
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
            style={{ borderColor: errors?.baseValue ? '#EF4444' : '#D1D5DB', color: '#0B236B' }}
            placeholder="Enter base value"
          />
          {errors?.baseValue && (
            <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.baseValue}</p>
          )}
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
        isFixedBasket={formState.indexType.includes('Fixed Basket')}
        onChange={onChange}
      />
    </div>
  );
}
