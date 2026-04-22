export type BacktestStatus = 'Draft' | 'Running' | 'Completed' | 'Launched to Production' | 'Failed';

export type BacktestIndexType = 'standard' | 'fixed basket';

export interface BacktestEntry {
  id: string;
  name: string;
  description: string;
  type: BacktestIndexType;
  typeLabel: string;
  period: { start: string; end: string };
  status: BacktestStatus;
  statusColor: string;
  statusBg: string;
  performance: string;
  performanceValue: number | null;
  trend?: 'up' | 'down';
  icon?: 'loading' | 'error';
}

export interface BacktestStatusCounts {
  total: number;
  draft: number;
  running: number;
  completed: number;
  launched: number;
  failed: number;
}
