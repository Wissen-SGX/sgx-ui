import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createBacktest,
  updateBacktest,
  deleteBacktest,
  runBacktest,
  launchBacktest,
  type CreateBacktestPayload,
  type UpdateBacktestPayload,
} from '../api/backtest.api';
import { backtestKeys } from './useGetBacktests';

export function useCreateBacktest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBacktestPayload) => createBacktest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: backtestKeys.all });
    },
  });
}

export function useUpdateBacktest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBacktestPayload }) =>
      updateBacktest(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: backtestKeys.all });
      queryClient.invalidateQueries({ queryKey: backtestKeys.detail(id) });
    },
  });
}

export function useDeleteBacktest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBacktest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: backtestKeys.all });
    },
  });
}

export function useRunBacktest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => runBacktest(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: backtestKeys.all });
      queryClient.invalidateQueries({ queryKey: backtestKeys.detail(id) });
    },
  });
}

export function useLaunchBacktest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => launchBacktest(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: backtestKeys.all });
      queryClient.invalidateQueries({ queryKey: backtestKeys.detail(id) });
    },
  });
}
