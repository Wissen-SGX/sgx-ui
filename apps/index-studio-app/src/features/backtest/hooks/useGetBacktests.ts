import { useQuery } from '@tanstack/react-query';
import {
  fetchBacktests,
  fetchBacktestById,
  fetchBacktestDetail,
  type BacktestListResult,
} from '../api/backtest.api';

export const backtestKeys = {
  all: ['backtests'] as const,
  detail: (id: string) => ['backtests', id] as const,
  metrics: (id: string) => ['backtests', id, 'detail'] as const,
};

const EMPTY: BacktestListResult = { stats: { total: 0, draft: 0, running: 0, completed: 0, launched: 0, failed: 0 }, backtests: [] };

export function useGetBacktests() {
  const query = useQuery({
    queryKey: backtestKeys.all,
    queryFn: fetchBacktests,
  });
  return { ...query, data: query.data ?? EMPTY };
}

export function useGetBacktestById(id: string) {
  return useQuery({
    queryKey: backtestKeys.detail(id),
    queryFn: () => fetchBacktestById(id),
    enabled: Boolean(id),
  });
}

export function useGetBacktestDetail(id: string) {
  return useQuery({
    queryKey: backtestKeys.metrics(id),
    queryFn: () => fetchBacktestDetail(id),
    enabled: Boolean(id),
  });
}
