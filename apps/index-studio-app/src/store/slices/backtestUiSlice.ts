import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CreateIndexFormState, ReturnTypes } from '@/features/backtest/types/createIndex.types';
import { STATUS_OPTIONS, TYPE_OPTIONS } from '@/features/backtest/steps/dashboard/components/BacktestFilters';

// File is non-serializable — kept in local component state only; slice holds the filename for display.
type SerializableFormState = Omit<CreateIndexFormState, 'uploadedFile'>;

const defaultReturnTypes: ReturnTypes = {
  priceReturn: false,
  totalReturn: false,
  netTotalReturn: false,
  decrementPoints: false,
  decrementPercent: false,
};

const defaultForm: SerializableFormState = {
  backtestName: '',
  indexType: '',
  returnTypes: defaultReturnTypes,
  decrementFrequency: '',
  decrementBasis: '',
  customDays: '',
  totalPoints: '',
  totalPercentage: '',
  baseCurrency: '',
  baseValue: '',
  selectedCalendars: [],
  description: '',
  selectedUniverse: '',
  selectedFilters: '',
  selectedRanking: '',
  selectedWeighting: '',
  backtestStartDate: '',
  backtestEndDate: '',
  uploadedFileName: null,
};

interface DashboardFilters {
  statusFilter: string;
  typeFilter: string;
  searchQuery: string;
}

interface BacktestUiState {
  form: SerializableFormState;
  activeStep: number;
  editingId: string | null;
  dashboard: DashboardFilters;
}

const initialState: BacktestUiState = {
  form: defaultForm,
  activeStep: 0,
  editingId: null,
  dashboard: {
    statusFilter: STATUS_OPTIONS[0],
    typeFilter: TYPE_OPTIONS[0],
    searchQuery: '',
  },
};

const backtestUiSlice = createSlice({
  name: 'backtestUi',
  initialState,
  reducers: {
    setFormField(state, action: PayloadAction<Partial<SerializableFormState>>) {
      state.form = { ...state.form, ...action.payload };
    },
    setActiveStep(state, action: PayloadAction<number>) {
      state.activeStep = action.payload;
    },
    setEditingId(state, action: PayloadAction<string | null>) {
      state.editingId = action.payload;
    },
    setDashboardFilter(state, action: PayloadAction<Partial<DashboardFilters>>) {
      state.dashboard = { ...state.dashboard, ...action.payload };
    },
    resetForm(state) {
      state.form = defaultForm;
      state.activeStep = 0;
      state.editingId = null;
    },
  },
});

export const {
  setFormField,
  setActiveStep,
  setEditingId,
  setDashboardFilter,
  resetForm,
} = backtestUiSlice.actions;

export default backtestUiSlice.reducer;
