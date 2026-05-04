import { useAppForm } from "@/hooks/useAppForm";
import { createIndexSchema } from "@/features/backtest/types/createIndex.schema";
import type { CreateIndexFormState } from "@/features/backtest/types";

export function useBacktestForm(defaultValues: CreateIndexFormState) {
  return useAppForm<CreateIndexFormState>(createIndexSchema, defaultValues);
}
