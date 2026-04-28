import { get, post, put, del } from '@sgx/api-client';
import { JobStatus, IndexType } from '@sgx/shared';
import type { BacktestEntry, BacktestDetailData, BacktestStatus, BacktestStatusCounts } from '../types/backtest.types';
import type { ReturnTypes, CreateIndexFormState } from '../types/createIndex.types';


export interface CreateBacktestPayload {
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
  uploadedFileName?: string | null;
}

export type UpdateBacktestPayload = Partial<CreateBacktestPayload>;

// --- Draft request helpers ---

const INDEX_TYPE_MAP: Record<string, string> = {
  'Standard Index': IndexType.STANDARD_INDEX,
  'Fixed Basket (Equal Weighted)': IndexType.FIXED_BASKET_EQUAL_WEIGHT,
  'Fixed Basket (Equal Weight)': IndexType.FIXED_BASKET_EQUAL_WEIGHT,
  'Fixed Basket (Free Float)': IndexType.FIXED_BASKET_FREE_FLOAT,
  'Single Stock': 'SINGLE_STOCK',
  'Equal Weight Index': 'EQUAL_WEIGHT_INDEX',
  'IOI (Index of Index)': IndexType.INDEX_OF_INDICES,
  'Index of Indices': IndexType.INDEX_OF_INDICES,
};

const TYPE_LABELS: Record<string, string> = {
  [IndexType.STANDARD_INDEX]: 'Standard Index',
  [IndexType.FIXED_BASKET_EQUAL_WEIGHT]: 'Fixed Basket (Equal Weight)',
  [IndexType.FIXED_BASKET_FREE_FLOAT]: 'Fixed Basket (Free Float)',
  [IndexType.INDEX_OF_INDICES]: 'Index of Indices',
  FIXED_BASKET: 'Fixed Basket',
  SINGLE_STOCK: 'Single Stock',
  EQUAL_WEIGHT_INDEX: 'Equal Weight Index',
};

const toReturnTypesCsv = (rt: ReturnTypes): string => {
  const parts: string[] = [];
  if (rt.priceReturn) parts.push('PR');
  if (rt.totalReturn) parts.push('TR');
  if (rt.netTotalReturn) parts.push('NTR');
  if (rt.decrementPoints) parts.push('DP');
  if (rt.decrementPercent) parts.push('DPCT');
  return parts.join(',');
};

// "XNYS - NEW YORK STOCK EXCHANGE" → "XNYS"
const toCalendarsCsv = (calendars: string[]): string =>
  calendars.map((c) => c.split(' - ')[0]).join(',');

// --- Raw shape of a single backtest from the API ---
interface BacktestApiEntry {
  id: string;
  backtestName: string;
  description: string;
  indexType: string;
  status: string;
  backtestStartDate: string;
  backtestEndDate: string;
  performance?: number | null;
  uploadedFileName?: string | null;
}

// Full API response envelope for the list endpoint
interface BacktestListApiResponse {
  success: boolean;
  data: {
    stats: Omit<BacktestStatusCounts, 'queued'> & { queued?: number };
    backtests: BacktestApiEntry[];
  };
}

export interface BacktestListResult {
  stats: BacktestStatusCounts;
  backtests: BacktestEntry[];
}

const STATUS_STYLES: Record<string, { color: string; bg: string; icon?: 'loading' | 'error' }> = {
  [JobStatus.DRAFT]:     { color: '#6B7280', bg: '#F3F4F6' },
  [JobStatus.QUEUED]:    { color: '#6B7280', bg: '#F3F4F6' },
  [JobStatus.RUNNING]:   { color: '#F59E0B', bg: '#FFFBEB', icon: 'loading' },
  [JobStatus.COMPLETED]: { color: '#16A34A', bg: '#F0FDF4' },
  [JobStatus.FAILED]:    { color: '#DC2626', bg: '#FEF2F2', icon: 'error' },
  'LAUNCHED TO PRODUCTION': { color: '#0094B3', bg: '#EFF6FF' },
};

const toBacktestEntry = (raw: BacktestApiEntry): BacktestEntry => {
  const style = STATUS_STYLES[raw.status] ?? { color: '#6B7280', bg: '#F3F4F6' };
  const perf = raw.performance ?? null;
  return {
    id: raw.id,
    name: raw.backtestName,
    description: raw.description,
    indexType: raw.indexType,
    typeLabel: TYPE_LABELS[raw.indexType] ?? raw.indexType,
    period: { start: raw.backtestStartDate, end: raw.backtestEndDate },
    status: raw.status as BacktestStatus,
    statusColor: style.color,
    statusBg: style.bg,
    icon: style.icon,
    performance: perf !== null ? `${perf >= 0 ? '+' : ''}${perf.toFixed(2)}%` : '—',
    performanceValue: perf,
    trend: perf !== null ? (perf >= 0 ? 'up' : 'down') : undefined,
    uploadedFileName: raw.uploadedFileName ?? undefined,
  };
};

export const fetchBacktests = async (): Promise<BacktestListResult> => {
  const response = await get<BacktestListApiResponse>('/backtest');
  return {
    stats: { ...response.data.stats, queued: response.data.stats.queued ?? 0 },
    backtests: response.data.backtests.map(toBacktestEntry),
  };
};

export const fetchBacktestById = (id: string): Promise<BacktestEntry> =>
  get<BacktestEntry>(`/backtests/${id}`);

export const fetchBacktestDetail = (id: string): Promise<BacktestDetailData> =>
  get<BacktestDetailData>(`/backtests/${id}/detail`);

export const createBacktest = (payload: CreateBacktestPayload): Promise<BacktestEntry> =>
  post<BacktestEntry>('/backtests', payload);

export const saveAsDraft = (formState: CreateIndexFormState): Promise<BacktestEntry> => {
  const requestObj = {
    backtestName: formState.backtestName,
    indexType: INDEX_TYPE_MAP[formState.indexType] ?? formState.indexType,
    returnTypes: toReturnTypesCsv(formState.returnTypes),
    baseValue: Number(formState.baseValue),
    baseCurrency: formState.baseCurrency,
    calendars: toCalendarsCsv(formState.selectedCalendars),
  };

  const formData = new FormData();
  if (formState.uploadedFile) {
    formData.append('file', formState.uploadedFile);
  }
  formData.append('backtestName', requestObj.backtestName);
  formData.append('indexType', requestObj.indexType);
  formData.append('returnTypes', requestObj.returnTypes);
  formData.append('baseValue', String(requestObj.baseValue));
  formData.append('baseCurrency', requestObj.baseCurrency);
  formData.append('calendars', requestObj.calendars);

  return post<BacktestEntry>('/backtest/draft', formData);
};

export const updateBacktest = (id: string, payload: UpdateBacktestPayload): Promise<BacktestEntry> =>
  put<BacktestEntry>(`/backtests/${id}`, payload);

export const deleteBacktest = (id: string): Promise<void> =>
  del<void>(`/backtests/${id}`);

export const runBacktest = (id: string): Promise<BacktestEntry> =>
  post<BacktestEntry>(`/backtests/${id}/run`);

export const launchBacktest = (id: string): Promise<BacktestEntry> =>
  post<BacktestEntry>(`/backtests/${id}/launch`);
