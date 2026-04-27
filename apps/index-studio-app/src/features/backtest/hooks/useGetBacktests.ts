import { useQuery } from '@tanstack/react-query';
import {
  fetchBacktests,
  fetchBacktestById,
  fetchBacktestDetail,
} from '../api/backtest.api';

export const backtestKeys = {
  all: ['backtests'] as const,
  detail: (id: string) => ['backtests', id] as const,
  metrics: (id: string) => ['backtests', id, 'detail'] as const,
};

export function useGetBacktests() {
  return useQuery({
    queryKey: backtestKeys.all,
    queryFn: fetchBacktests,
  });
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
