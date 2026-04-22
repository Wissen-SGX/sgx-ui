export interface ReturnTypes {
  priceReturn: boolean;
  totalReturn: boolean;
  netTotalReturn: boolean;
  decrementPoints: boolean;
  decrementPercent: boolean;
}

export interface CreateIndexFormState {
  backtestName: string;
  indexType: string;
  returnTypes: ReturnTypes;
  decrementFrequency: string;
  decrementBasis: string;
  customDays: string;
  totalPoints: string;
  totalPercentage: string;
  baseCurrency: string;
  baseValue: string;
  selectedCalendars: string[];
  description: string;
  selectedUniverse: string;
  selectedFilters: string;
  selectedRanking: string;
  selectedWeighting: string;
}
