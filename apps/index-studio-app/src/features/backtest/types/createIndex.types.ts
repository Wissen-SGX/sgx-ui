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
  backtestStartDate: string;
  backtestEndDate: string;
  // File is not JSON-serializable; will be null after page refresh (re-upload required before API call)
  uploadedFile: File | null;
  // Persisted filename for display in edit mode (survives serialization when uploadedFile cannot)
  uploadedFileName: string | null;
}
