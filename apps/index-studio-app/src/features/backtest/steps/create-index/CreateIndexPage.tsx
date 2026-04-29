import { useNavigate } from "react-router-dom";
import { CreateIndexFormState, ReturnTypes } from "@/features/backtest/types";
import { useBacktest } from "@/contexts/BacktestContext";
import { useSaveAsDraft } from "@/features/backtest/hooks/useBacktestMutations";
import { IndexForm, DEFAULT_FORM } from "./components/IndexForm";
import { JobStatus, IndexType } from "@sgx/shared";

const LABEL_TO_INDEX_TYPE: Record<string, string> = {
  "Standard Index": IndexType.STANDARD_INDEX,
  "Fixed Basket (Equal Weighted)": IndexType.FIXED_BASKET_EQUAL_WEIGHT,
  "Fixed Basket (Equal Weight)": IndexType.FIXED_BASKET_EQUAL_WEIGHT,
  "Fixed Basket (Free Float)": IndexType.FIXED_BASKET_FREE_FLOAT,
  "Index of Indices": IndexType.INDEX_OF_INDICES,
};

function formatISODate(isoDate: string): string {
  if (!isoDate) return "--";
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function getReturnTypeLabel(returnTypes: ReturnTypes): string {
  const active: string[] = [];
  if (returnTypes.priceReturn) active.push("Price Return");
  if (returnTypes.totalReturn) active.push("Total Return");
  if (returnTypes.netTotalReturn) active.push("Net Total Return");
  if (returnTypes.decrementPoints) active.push("Decrement (Points)");
  if (returnTypes.decrementPercent) active.push("Decrement (%)");
  return active.join(", ") || "--";
}

function buildEntry(formState: CreateIndexFormState) {
  return {
    name: formState.backtestName || "Untitled Index",
    description: formState.description || "",
    indexType: LABEL_TO_INDEX_TYPE[formState.indexType] ?? IndexType.STANDARD_INDEX,
    typeLabel: formState.indexType,
    period: {
      start: formatISODate(formState.backtestStartDate),
      end: formatISODate(formState.backtestEndDate),
    },
    ...(formState.indexType.includes("Fixed Basket") && formState.uploadedFileName
      ? { uploadedFileName: formState.uploadedFileName }
      : {}),
  };
}

function buildDetail(formState: CreateIndexFormState, createdDate: string) {
  return {
    totalReturn: "--",
    annualizedReturn: "--",
    volatility: "--",
    sharpeRatio: "--",
    maxDrawdown: "--",
    sortino: "--",
    calmar: "--",
    configuration: {
      indexType: formState.indexType,
      returnType: getReturnTypeLabel(formState.returnTypes),
      rebalanceFrequency: "--",
      currency: formState.baseCurrency,
      baseValue: formState.baseValue,
      baseDate: formatISODate(formState.backtestStartDate),
      dividendTreatment: "--",
      weightCeiling: "--",
      weightingMethod: formState.selectedWeighting || "--",
    },
    metadata: { created: createdDate, completed: null, lastUpdated: createdDate },
    indexLevels: [] as { date: string; value: string; change: string; positive: boolean }[],
  };
}

export default function CreateIndexPage() {
  const navigate = useNavigate();
  const { addBacktestEntryWithDetail } = useBacktest();
  const { mutate: saveAsDraft, isPending: isSavingDraft } = useSaveAsDraft();

  const today = () =>
    new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  const handleSaveAsDraft = (formState: CreateIndexFormState) => {
    saveAsDraft(formState, {
      onSuccess: () => navigate("/backtest/dashboard"),
    });
  };

  const handleSubmit = (formState: CreateIndexFormState) => {
    const date = today();
    const { uploadedFile, ...serializableFormState } = formState;
    addBacktestEntryWithDetail(
      {
        ...buildEntry(formState),
        status: JobStatus.RUNNING,
        statusColor: "#F59E0B",
        statusBg: "#FEF3C7",
        performance: "Awaiting Results",
        performanceValue: null,
        icon: "loading",
      },
      buildDetail(formState, date),
      serializableFormState,
    );
    navigate("/backtest/dashboard");
  };

  return (
    <IndexForm
      initialFormState={DEFAULT_FORM}
      pageTitle="Create Index"
      submitLabel="Launch Backtest"
      onSaveAsDraft={handleSaveAsDraft}
      onSubmit={handleSubmit}
      onBack={() => navigate("/backtest/dashboard")}
      isSavingDraft={isSavingDraft}
    />
  );
}
