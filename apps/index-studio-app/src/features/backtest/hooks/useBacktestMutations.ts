import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  saveAsDraft,
  updateDraft,
  updateBacktest,
  deleteBacktest,
  launchDraftBacktest,
  runBacktest,
  type CreateBacktestPayload,
  type UpdateBacktestPayload,
  type LaunchBacktestResponse,
} from "../api/backtest.api";
import type { CreateIndexFormState } from "../types/createIndex.types";
import { backtestKeys } from "./useGetBacktests";

export type { LaunchBacktestResponse };

export function useRunBacktest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formState: CreateIndexFormState) => runBacktest(formState),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: backtestKeys.all });
    },
  });
}

export function useSaveAsDraft() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formState: CreateIndexFormState) => saveAsDraft(formState),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: backtestKeys.all });
    },
  });
}

export function useUpdateDraft() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      formState,
    }: {
      id: string;
      formState: CreateIndexFormState;
    }) => updateDraft(id, formState),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: backtestKeys.all });
      queryClient.invalidateQueries({ queryKey: backtestKeys.detail(id) });
    },
  });
}

export function useUpdateBacktest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateBacktestPayload;
    }) => updateBacktest(id, payload),
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

export function useLaunchDraftBacktest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => launchDraftBacktest(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: backtestKeys.all });
      queryClient.invalidateQueries({ queryKey: backtestKeys.detail(id) });
    },
  });
}
