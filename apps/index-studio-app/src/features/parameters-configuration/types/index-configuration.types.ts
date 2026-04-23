import type { FilterRule } from './filter.types';

export type { FilterRule };

export type IndexType = 'Standard Index' | 'Fixed Basket' | 'Single Stock';
export type ReturnType = 'Total Return' | 'Net Return' | 'Price Return' | 'Decrement Version' | 'Currency Hedged' | 'Excess Return';
export type WeightingMethod = 'Free Float Market Cap' | 'Total Market Cap' | 'Equal Weight' | 'Custom Weight' | 'Proportional' | 'Basket' | 'Fixed' | 'Custom';
export type DividendTreatment = 'Reinvest' | 'Pay Out';
export type UniverseMethod = 'global' | 'existing-index' | 'client-upload';

export interface SelectionRule {
  id: number;
  description: string;
  isEditing: boolean;
  appliedToIndex?: string;
}

export interface RankingFactor {
  id: number;
  name: string;
  order: 'Ascending' | 'Descending';
  weightPercentage: number;
  appliedToIndex?: string;
}

export interface WeightConstraintRule {
  id: number;
  type: string;
  maxValue: string;
  minValue: string;
  appliedToIndex?: string;
}

export interface RankingRule {
  id: number;
  name: string;
  primaryFactor: string;
  rankingFactors: RankingFactor[];
}

export interface WeightConstraint {
  id: number;
  type: 'Sector' | 'Security' | 'Country';
  category: string;
  floor: string;
  ceiling: string;
}

export interface WeightingConfiguration {
  id: number;
  name: string;
  weightingMethod: string;
  constraints: WeightConstraint[];
}

export interface FormulaField {
  id: number;
  fieldName: string;
  description: string;
  formula: string;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
}

export interface BacktestConfiguration {
  indexName: string;
  indexType: IndexType;
  returnType: ReturnType[];
  baseDate: string;
  rebalanceFrequency: string;
  description: string;
  baseCurrency: string;
  baseValue: string;
  pricingSource: string;
  dividendTreatment: DividendTreatment;
  universeMethod: UniverseMethod;
  selectedExistingIndex?: string;
  uploadedFile?: File | null;
  selectionRules: SelectionRule[];
  filters: FilterRule[];
  rankingFactors: RankingFactor[];
  topN: string;
  weightingMethod: WeightingMethod;
  weightConstraints: WeightConstraintRule[];
  sectorConstraints: Array<{ sector: string; weight: string }>;
  rebalancingBuffer: string;
  minimumWeight: string;
  startDate: string;
  endDate: string;
  rebalancingReviewDate: string;
  rebalancingEffectiveDate: string;
  turnaroundTime: number;
  pricePoint: string;
  dataSource: string;
  corporateActions: boolean;
  holidayCalendar: string;
  createdBy?: string;
  createdDate?: string;
  status?: 'draft' | 'pending' | 'approved' | 'running' | 'completed';
}
