import { get, post, put, del } from '@sgx/api-client';
import type { BacktestEntry, BacktestDetailData } from '../types/backtest.types';
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

export const fetchBacktests = (): Promise<BacktestEntry[]> =>
  get<BacktestEntry[]>('/backtests');

export const fetchBacktestById = (id: string): Promise<BacktestEntry> =>
  get<BacktestEntry>(`/backtests/${id}`);

export const fetchBacktestDetail = (id: string): Promise<BacktestDetailData> =>
  get<BacktestDetailData>(`/backtests/${id}/detail`);

export const createBacktest = (payload: CreateBacktestPayload): Promise<BacktestEntry> =>
  post<BacktestEntry>('/backtests', payload);

export const updateBacktest = (id: string, payload: UpdateBacktestPayload): Promise<BacktestEntry> =>
  put<BacktestEntry>(`/backtests/${id}`, payload);

export const deleteBacktest = (id: string): Promise<void> =>
  del<void>(`/backtests/${id}`);

export const runBacktest = (id: string): Promise<BacktestEntry> =>
  post<BacktestEntry>(`/backtests/${id}/run`);

export const launchBacktest = (id: string): Promise<BacktestEntry> =>
  post<BacktestEntry>(`/backtests/${id}/launch`);
