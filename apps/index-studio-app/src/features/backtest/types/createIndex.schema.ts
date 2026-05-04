import { z } from "zod";

export const createIndexSchema = z
  .object({
    backtestName: z.string().min(1, "Backtest name is required."),
    indexType: z.string(),
    returnTypes: z.object({
      priceReturn: z.boolean(),
      totalReturn: z.boolean(),
      netTotalReturn: z.boolean(),
      decrementPoints: z.boolean(),
      decrementPercent: z.boolean(),
    }),
    decrementFrequency: z.string(),
    decrementBasis: z.string(),
    customDays: z.string(),
    totalPoints: z.string(),
    totalPercentage: z.string(),
    baseCurrency: z.string().min(1, "Base currency is required."),
    baseValue: z.string().min(1, "Base value is required."),
    selectedCalendars: z.array(z.string()),
    description: z.string(),
    selectedUniverse: z.string(),
    selectedFilters: z.string(),
    selectedRanking: z.string(),
    selectedWeighting: z.string(),
    backtestStartDate: z.string().min(1, "Backtest start date is required."),
    backtestEndDate: z.string().min(1, "Backtest end date is required."),
    // File is browser-only; skip instanceof check so schema is portable
    uploadedFile: z.any(),
    uploadedFileName: z.string().nullable(),
  })
  .refine(
    (data) =>
      data.returnTypes.priceReturn ||
      data.returnTypes.totalReturn ||
      data.returnTypes.netTotalReturn ||
      data.returnTypes.decrementPoints ||
      data.returnTypes.decrementPercent,
    {
      message: "Please select at least one return type.",
      path: ["returnTypes"],
    },
  )
  .refine(
    (data) =>
      !data.backtestStartDate ||
      !data.backtestEndDate ||
      data.backtestEndDate >= data.backtestStartDate,
    {
      message: "End date must be on or after the start date.",
      path: ["backtestEndDate"],
    },
  );

export type CreateIndexFormValues = z.infer<typeof createIndexSchema>;
