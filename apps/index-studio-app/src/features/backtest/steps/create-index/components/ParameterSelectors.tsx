import { CustomDropdown } from '@/components/CustomDropdown';
import { CreateIndexFormState } from '@/features/backtest/types';

interface ParameterSelectorsProps {
  universeOptions: string[];
  filterOptions: string[];
  rankingOptions: string[];
  weightingOptions: string[];
  selectedUniverse: string;
  selectedFilters: string;
  selectedRanking: string;
  selectedWeighting: string;
  isFixedBasket: boolean;
  onChange: (updates: Partial<CreateIndexFormState>) => void;
}

export function ParameterSelectors({
  universeOptions,
  filterOptions,
  rankingOptions,
  weightingOptions,
  selectedUniverse,
  selectedFilters,
  selectedRanking,
  selectedWeighting,
  isFixedBasket,
  onChange,
}: ParameterSelectorsProps) {
  return (
    <div className="border-t pt-6" style={{ borderColor: '#E5E7EB' }}>
      <h3 className="text-md mb-4" style={{ color: '#0B236B' }}>Select Parameters</h3>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm mb-2" style={{ color: '#0B236B' }}>Universe</label>
          <CustomDropdown
            options={universeOptions}
            value={selectedUniverse}
            onChange={(val) => onChange({ selectedUniverse: val, selectedFilters: '' })}
            placeholder="Select universe"
          />
        </div>

        <div className={isFixedBasket ? 'opacity-50 pointer-events-none' : ''}>
          <label className="block text-sm mb-2" style={{ color: '#0B236B' }}>Filters</label>
          <CustomDropdown
            options={filterOptions}
            value={selectedFilters}
            onChange={(val) => onChange({ selectedFilters: val })}
            placeholder="Select filters"
            disabled={isFixedBasket || !selectedUniverse}
          />
          {isFixedBasket ? (
            <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Not applicable for Fixed Basket</p>
          ) : selectedUniverse ? (
            <p className="text-xs text-gray-500 mt-1">Filters are linked to the selected universe</p>
          ) : null}
        </div>

        <div className={isFixedBasket ? 'opacity-50 pointer-events-none' : ''}>
          <label className="block text-sm mb-2" style={{ color: '#0B236B' }}>Ranking</label>
          <CustomDropdown
            options={rankingOptions}
            value={selectedRanking}
            onChange={(val) => onChange({ selectedRanking: val })}
            placeholder="Select ranking"
            disabled={isFixedBasket}
          />
          {isFixedBasket && (
            <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Not applicable for Fixed Basket</p>
          )}
        </div>

        <div className={isFixedBasket ? 'opacity-50 pointer-events-none' : ''}>
          <label className="block text-sm mb-2" style={{ color: '#0B236B' }}>Weighting & Constraints</label>
          <CustomDropdown
            options={weightingOptions}
            value={selectedWeighting}
            onChange={(val) => onChange({ selectedWeighting: val })}
            placeholder="Select weighting"
            disabled={isFixedBasket}
          />
          {isFixedBasket && (
            <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Not applicable for Fixed Basket</p>
          )}
        </div>
      </div>
    </div>
  );
}
