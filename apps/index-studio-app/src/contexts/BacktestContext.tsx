import { createContext, useContext, useState, ReactNode } from 'react';
import {
  Universe,
  FilterRule,
  FilterSet,
  RankingFactor,
  WeightConstraintRule,
  RankingRule,
  WeightingConfiguration,
  UniverseConfiguration,
  GeneratedFile,
  FormulaField,
  BacktestConfiguration,
} from '@/features/parameters-configuration/types';
import {
  initialUniverses,
  initialFilterSets,
  initialUniverseConfigurations,
  initialRankingRules,
  initialWeightingConfigurations,
  initialFormulaFields,
} from '@/features/parameters-configuration/data';

export type {
  Universe,
  FilterRule,
  FilterSet,
  RankingFactor,
  WeightConstraintRule,
  RankingRule,
  WeightingConfiguration,
  UniverseConfiguration,
  GeneratedFile,
  FormulaField,
  BacktestConfiguration,
};

interface BacktestContextType {
  config: BacktestConfiguration;
  updateConfig: (updates: Partial<BacktestConfiguration>) => void;
  resetConfig: () => void;
  addFilter: (filter: FilterRule) => void;
  updateFilter: (id: number, updates: Partial<FilterRule>) => void;
  deleteFilter: (id: number) => void;
  addRankingFactor: (factor: RankingFactor) => void;
  updateRankingFactor: (id: number, updates: Partial<RankingFactor>) => void;
  deleteRankingFactor: (id: number) => void;
  addWeightConstraint: (constraint: WeightConstraintRule) => void;
  updateWeightConstraint: (id: number, updates: Partial<WeightConstraintRule>) => void;
  deleteWeightConstraint: (id: number) => void;
  universes: Universe[];
  addUniverse: (universe: Omit<Universe, 'id'>) => void;
  updateUniverse: (id: number, updates: Partial<Universe>) => void;
  deleteUniverse: (id: number) => void;
  filterSets: FilterSet[];
  addFilterSet: (filterSet: Omit<FilterSet, 'id'>) => void;
  updateFilterSet: (id: number, updates: Partial<FilterSet>) => void;
  deleteFilterSet: (id: number) => void;
  rankingRules: RankingRule[];
  addRankingRule: (rankingRule: Omit<RankingRule, 'id'>) => void;
  updateRankingRule: (id: number, updates: Partial<RankingRule>) => void;
  deleteRankingRule: (id: number) => void;
  weightingConfigurations: WeightingConfiguration[];
  addWeightingConfiguration: (config: Omit<WeightingConfiguration, 'id'>) => void;
  updateWeightingConfiguration: (id: number, updates: Partial<WeightingConfiguration>) => void;
  deleteWeightingConfiguration: (id: number) => void;
  universeConfigurations: UniverseConfiguration[];
  addUniverseConfiguration: (config: Omit<UniverseConfiguration, 'id'>) => void;
  updateUniverseConfiguration: (id: number, updates: Partial<UniverseConfiguration>) => void;
  deleteUniverseConfiguration: (id: number) => void;
  runUniverseConfiguration: (id: number) => void;
  formulaFields: FormulaField[];
  addFormulaField: (field: Omit<FormulaField, 'id'>) => void;
  updateFormulaField: (id: number, updates: Partial<FormulaField>) => void;
  deleteFormulaField: (id: number) => void;
}

const defaultConfig: BacktestConfiguration = {
  indexName: '',
  indexType: 'Standard Index',
  returnType: ['Total Return'],
  baseDate: '',
  rebalanceFrequency: 'Monthly',
  description: '',
  baseCurrency: 'SGD',
  baseValue: '1000',
  pricingSource: 'REFINITIV',
  dividendTreatment: 'Reinvest',
  universeMethod: 'global',
  selectionRules: [],
  filters: [],
  rankingFactors: [],
  topN: '',
  weightingMethod: 'Free Float Market Cap',
  weightConstraints: [],
  sectorConstraints: [],
  rebalancingBuffer: '',
  minimumWeight: '',
  startDate: '',
  endDate: '',
  rebalancingReviewDate: '',
  rebalancingEffectiveDate: '',
  turnaroundTime: 0,
  pricePoint: 'Close',
  dataSource: 'Bloomberg',
  corporateActions: true,
  holidayCalendar: 'SGX',
  status: 'draft',
};

const BacktestContext = createContext<BacktestContextType | undefined>(undefined);

export function BacktestProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<BacktestConfiguration>(defaultConfig);
  const [universes, setUniverses] = useState<Universe[]>(initialUniverses);
  const [filterSets, setFilterSets] = useState<FilterSet[]>(initialFilterSets);
  const [rankingRules, setRankingRules] = useState<RankingRule[]>(initialRankingRules);
  const [weightingConfigurations, setWeightingConfigurations] = useState<WeightingConfiguration[]>(initialWeightingConfigurations);
  const [universeConfigurations, setUniverseConfigurations] = useState<UniverseConfiguration[]>(initialUniverseConfigurations);
  const [formulaFields, setFormulaFields] = useState<FormulaField[]>(initialFormulaFields);

  // --- Config ---
  const updateConfig = (updates: Partial<BacktestConfiguration>) =>
    setConfig(prev => ({ ...prev, ...updates }));
  const resetConfig = () => setConfig(defaultConfig);

  // --- Filters (on config) ---
  const addFilter = (filter: FilterRule) =>
    setConfig(prev => ({ ...prev, filters: [...prev.filters, filter] }));
  const updateFilter = (id: number, updates: Partial<FilterRule>) =>
    setConfig(prev => ({ ...prev, filters: prev.filters.map(f => f.id === id ? { ...f, ...updates } : f) }));
  const deleteFilter = (id: number) =>
    setConfig(prev => ({ ...prev, filters: prev.filters.filter(f => f.id !== id) }));

  // --- Ranking Factors (on config) ---
  const addRankingFactor = (factor: RankingFactor) =>
    setConfig(prev => ({ ...prev, rankingFactors: [...prev.rankingFactors, factor] }));
  const updateRankingFactor = (id: number, updates: Partial<RankingFactor>) =>
    setConfig(prev => ({ ...prev, rankingFactors: prev.rankingFactors.map(f => f.id === id ? { ...f, ...updates } : f) }));
  const deleteRankingFactor = (id: number) =>
    setConfig(prev => ({ ...prev, rankingFactors: prev.rankingFactors.filter(f => f.id !== id) }));

  // --- Weight Constraints (on config) ---
  const addWeightConstraint = (constraint: WeightConstraintRule) =>
    setConfig(prev => ({ ...prev, weightConstraints: [...prev.weightConstraints, constraint] }));
  const updateWeightConstraint = (id: number, updates: Partial<WeightConstraintRule>) =>
    setConfig(prev => ({ ...prev, weightConstraints: prev.weightConstraints.map(c => c.id === id ? { ...c, ...updates } : c) }));
  const deleteWeightConstraint = (id: number) =>
    setConfig(prev => ({ ...prev, weightConstraints: prev.weightConstraints.filter(c => c.id !== id) }));

  // --- Universes ---
  const addUniverse = (universe: Omit<Universe, 'id'>) => {
    const newId = universes.length > 0 ? Math.max(...universes.map(u => u.id)) + 1 : 1;
    setUniverses(prev => [...prev, { ...universe, id: newId }]);
  };
  const updateUniverse = (id: number, updates: Partial<Universe>) =>
    setUniverses(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  const deleteUniverse = (id: number) =>
    setUniverses(prev => prev.filter(u => u.id !== id));

  // --- Filter Sets ---
  const addFilterSet = (filterSet: Omit<FilterSet, 'id'>) => {
    const newId = filterSets.length > 0 ? Math.max(...filterSets.map(f => f.id)) + 1 : 1;
    setFilterSets(prev => [...prev, { ...filterSet, id: newId }]);
  };
  const updateFilterSet = (id: number, updates: Partial<FilterSet>) =>
    setFilterSets(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  const deleteFilterSet = (id: number) =>
    setFilterSets(prev => prev.filter(f => f.id !== id));

  // --- Ranking Rules ---
  const addRankingRule = (rankingRule: Omit<RankingRule, 'id'>) => {
    const newId = rankingRules.length > 0 ? Math.max(...rankingRules.map(r => r.id)) + 1 : 1;
    setRankingRules(prev => [...prev, { ...rankingRule, id: newId }]);
  };
  const updateRankingRule = (id: number, updates: Partial<RankingRule>) =>
    setRankingRules(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  const deleteRankingRule = (id: number) =>
    setRankingRules(prev => prev.filter(r => r.id !== id));

  // --- Weighting Configurations ---
  const addWeightingConfiguration = (wc: Omit<WeightingConfiguration, 'id'>) => {
    const newId = weightingConfigurations.length > 0 ? Math.max(...weightingConfigurations.map(w => w.id)) + 1 : 1;
    setWeightingConfigurations(prev => [...prev, { ...wc, id: newId }]);
  };
  const updateWeightingConfiguration = (id: number, updates: Partial<WeightingConfiguration>) =>
    setWeightingConfigurations(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  const deleteWeightingConfiguration = (id: number) =>
    setWeightingConfigurations(prev => prev.filter(w => w.id !== id));

  // --- Universe Configurations ---
  const addUniverseConfiguration = (uc: Omit<UniverseConfiguration, 'id'>) => {
    const newId = universeConfigurations.length > 0 ? Math.max(...universeConfigurations.map(c => c.id)) + 1 : 1;
    setUniverseConfigurations(prev => [...prev, { ...uc, id: newId }]);
  };
  const updateUniverseConfiguration = (id: number, updates: Partial<UniverseConfiguration>) =>
    setUniverseConfigurations(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  const deleteUniverseConfiguration = (id: number) =>
    setUniverseConfigurations(prev => prev.filter(c => c.id !== id));

  const runUniverseConfiguration = (id: number) => {
    updateUniverseConfiguration(id, { status: 'Running' });
    setTimeout(() => {
      setUniverseConfigurations(prev => {
        const config = prev.find(c => c.id === id);
        if (!config) return prev;
        const now = new Date();
        const timestamp = `${now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })} ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
        const newFiles: GeneratedFile[] = [
          { id: config.generatedFiles.length + 1, fileName: `${config.name.toLowerCase().replace(/\s+/g, '_')}_holdings.csv`, generatedAt: timestamp, fileSize: '520 KB', status: 'Completed' },
          { id: config.generatedFiles.length + 2, fileName: `${config.name.toLowerCase().replace(/\s+/g, '_')}_analytics.xlsx`, generatedAt: timestamp, fileSize: '1.5 MB', status: 'Completed' },
        ];
        return prev.map(c => c.id === id ? { ...c, status: 'Completed', generatedFiles: [...c.generatedFiles, ...newFiles] } : c);
      });
    }, 3000);
  };

  // --- Formula Fields ---
  const addFormulaField = (field: Omit<FormulaField, 'id'>) => {
    const newId = formulaFields.length > 0 ? Math.max(...formulaFields.map(f => f.id)) + 1 : 1;
    setFormulaFields(prev => [...prev, { ...field, id: newId }]);
  };
  const updateFormulaField = (id: number, updates: Partial<FormulaField>) =>
    setFormulaFields(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  const deleteFormulaField = (id: number) =>
    setFormulaFields(prev => prev.filter(f => f.id !== id));

  return (
    <BacktestContext.Provider
      value={{
        config, updateConfig, resetConfig,
        addFilter, updateFilter, deleteFilter,
        addRankingFactor, updateRankingFactor, deleteRankingFactor,
        addWeightConstraint, updateWeightConstraint, deleteWeightConstraint,
        universes, addUniverse, updateUniverse, deleteUniverse,
        filterSets, addFilterSet, updateFilterSet, deleteFilterSet,
        rankingRules, addRankingRule, updateRankingRule, deleteRankingRule,
        weightingConfigurations, addWeightingConfiguration, updateWeightingConfiguration, deleteWeightingConfiguration,
        universeConfigurations, addUniverseConfiguration, updateUniverseConfiguration, deleteUniverseConfiguration, runUniverseConfiguration,
        formulaFields, addFormulaField, updateFormulaField, deleteFormulaField,
      }}
    >
      {children}
    </BacktestContext.Provider>
  );
}

export function useBacktest() {
  const context = useContext(BacktestContext);
  if (!context) throw new Error('useBacktest must be used within BacktestProvider');
  return context;
}
