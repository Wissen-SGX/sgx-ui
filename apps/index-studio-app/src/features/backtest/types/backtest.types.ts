import { JobStatus } from '@sgx/shared/constants';

export type BacktestStatus = JobStatus;

export interface BacktestEntry {
  id: string;
  name: string;
  description: string;
  indexType: string;
  typeLabel: string;
  period: { start: string; end: string };
  status: BacktestStatus;
  statusColor: string;
  statusBg: string;
  performance: string;
  performanceValue: number | null;
  trend?: 'up' | 'down';
  icon?: 'loading' | 'error';
  uploadedFileName?: string;
}

export interface BacktestStatusCounts {
  total: number;
  draft: number;
  running: number;
  completed: number;
  queued: number;
  failed: number;
}

export interface BacktestDetailConfiguration {
  indexType: string;
  returnType: string;
  rebalanceFrequency: string;
  currency: string;
  baseValue: string;
  baseDate: string;
  dividendTreatment: string;
  weightCeiling: string;
  weightingMethod: string;
}

export interface BacktestIndexLevel {
  date: string;
  value: string;
  change: string;
  positive: boolean;
}

export interface BacktestDetailData {
  id: string;
  totalReturn: string;
  annualizedReturn: string;
  volatility: string;
  sharpeRatio: string;
  maxDrawdown: string;
  sortino: string;
  calmar: string;
  configuration: BacktestDetailConfiguration;
  metadata: {
    created: string;
    completed: string | null;
    lastUpdated: string;
  };
  indexLevels: BacktestIndexLevel[];
}
