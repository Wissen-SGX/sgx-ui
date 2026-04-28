import { get, post, put, del } from '@sgx/api-client';
import type { BacktestEntry, BacktestDetailData, BacktestStatus, BacktestIndexType, BacktestStatusCounts } from '../types/backtest.types';
import type { ReturnTypes } from '../types/createIndex.types';

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

// Raw shape of a single backtest from the API
interface BacktestApiEntry {
  id: string;
  backtestName: string;
  description: string;
  indexType: string;
  status: BacktestStatus;
  backtestStartDate: string;
  backtestEndDate: string;
  performance?: number | null;
  uploadedFileName?: string | null;
}

// Full API response envelope for the list endpoint
interface BacktestListApiResponse {
  success: boolean;
  data: {
    stats: Omit<BacktestStatusCounts, 'launched'> & { launched?: number };
    backtests: BacktestApiEntry[];
  };
}

export interface BacktestListResult {
  stats: BacktestStatusCounts;
  backtests: BacktestEntry[];
}

const STATUS_STYLES: Record<BacktestStatus, { color: string; bg: string; icon?: 'loading' | 'error' }> = {
  Draft:                    { color: '#6B7280', bg: '#F3F4F6' },
  Running:                  { color: '#F59E0B', bg: '#FFFBEB', icon: 'loading' },
  Completed:                { color: '#16A34A', bg: '#F0FDF4' },
  'Launched to Production': { color: '#0094B3', bg: '#EFF6FF' },
  Failed:                   { color: '#DC2626', bg: '#FEF2F2', icon: 'error' },
};

const toBacktestEntry = (raw: BacktestApiEntry): BacktestEntry => {
  const style = STATUS_STYLES[raw.status] ?? { color: '#6B7280', bg: '#F3F4F6' };
  const type: BacktestIndexType = raw.indexType === 'fixed basket' ? 'fixed basket' : 'standard';
  const perf = raw.performance ?? null;
  return {
    id: raw.id,
    name: raw.backtestName,
    description: raw.description,
    type,
    typeLabel: type === 'standard' ? 'Standard Index' : 'Fixed Basket',
    period: { start: raw.backtestStartDate, end: raw.backtestEndDate },
    status: raw.status,
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
    stats: { ...response.data.stats, launched: response.data.stats.launched ?? 0 },
    backtests: response.data.backtests.map(toBacktestEntry),
  };
};

export const fetchBacktestById = (id: string): Promise<BacktestEntry> =>
  get<BacktestEntry>(`/backtests/${id}`);

export const fetchBacktestDetail = (id: string): Promise<BacktestDetailData> =>
  get<BacktestDetailData>(`/backtests/${id}/detail`);

export const createBacktest = (payload: CreateBacktestPayload): Promise<BacktestEntry> =>
  post<BacktestEntry>('/backtests', payload);

export const saveAsDraft = (payload: Partial<CreateBacktestPayload>): Promise<BacktestEntry> =>
  post<BacktestEntry>('/backtests/draft', payload);

export const updateBacktest = (id: string, payload: UpdateBacktestPayload): Promise<BacktestEntry> =>
  put<BacktestEntry>(`/backtests/${id}`, payload);

export const deleteBacktest = (id: string): Promise<void> =>
  del<void>(`/backtests/${id}`);

export const runBacktest = (id: string): Promise<BacktestEntry> =>
  post<BacktestEntry>(`/backtests/${id}/run`);

export const launchBacktest = (id: string): Promise<BacktestEntry> =>
  post<BacktestEntry>(`/backtests/${id}/launch`);
