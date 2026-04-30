import { JobStatus } from "@sgx/shared";

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
  trend?: "up" | "down";
  icon?: "loading" | "error";
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

export interface BacktestIndexLevel {
  date: string;
  value: string;
  change: string;
  positive: boolean;
}

export interface BacktestResultItem {
  id: number;
  resultType: string;
  s3Path: string;
  fileName: string;
  createdDate: string;
}

export interface BacktestDetailApiData {
  id: number;
  backtestName: string;
  indexType: string;
  universeId?: number;
  returnTypes: string;
  baseValue: number;
  baseCurrency: string;
  calendars: string;
  status: string;
  triggeredBy?: string | null;
  triggeredAt?: string | null;
  completedAt?: string | null;
  errorMessage?: string | null;
  resultS3Key?: string | null;
  uploadedFileName?: string | null;
  csvFileName?: string | null;
  backtestStartDate?: string | null;
  backtestEndDate?: string | null;
  description?: string | null;
  createdBy: string;
  createdDate: string;
  updatedDate: string;
  results: BacktestResultItem[];
}
