import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { CreateIndexFormState, ReturnTypes } from "@/features/backtest/types";
import { useBacktest } from "@/contexts/BacktestContext";
import { IndexForm, DEFAULT_FORM } from "./IndexForm";

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
    type: (formState.indexType.includes("Fixed Basket") ? "fixed basket" : "standard") as "fixed basket" | "standard",
    typeLabel: formState.indexType.includes("Fixed Basket") ? "Fixed Basket" : "Standard",
    period: {
      start: formatISODate(formState.backtestStartDate),
      end: formatISODate(formState.backtestEndDate),
    },
    ...(formState.indexType.includes("Fixed Basket") && formState.uploadedFileName
      ? { uploadedFileName: formState.uploadedFileName }
      : {}),
  };
}

function buildConfiguration(formState: CreateIndexFormState) {
  return {
    indexType: formState.indexType,
    returnType: getReturnTypeLabel(formState.returnTypes),
    rebalanceFrequency: "--",
    currency: formState.baseCurrency,
    baseValue: formState.baseValue,
    baseDate: formatISODate(formState.backtestStartDate),
    dividendTreatment: "--",
    weightCeiling: "--",
    weightingMethod: formState.selectedWeighting || "--",
  };
}

export default function EditBacktestPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getFormState, saveFormState, updateBacktestEntry, updateBacktestDetail, getBacktestDetail, backtestEntries } = useBacktest();

  const entry = id ? backtestEntries.find((e) => e.id === id) : undefined;

  if (entry && entry.status !== 'Draft') {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/backtest/dashboard')}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
        <div className="flex flex-col items-center justify-center py-24 gap-4 border rounded-lg bg-white" style={{ borderColor: '#E5E7EB' }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
            <Lock size={24} style={{ color: '#F59E0B' }} />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-base" style={{ color: '#0B236B' }}>Editing Not Allowed</h2>
            <p className="text-sm text-gray-500 max-w-sm">
              <span className="font-medium" style={{ color: '#0B236B' }}>{entry.name}</span> has status{' '}
              <span
                className="px-2 py-0.5 rounded text-xs"
                style={{ backgroundColor: entry.statusBg, color: entry.statusColor }}
              >
                {entry.status}
              </span>
              . Only <span className="font-medium">Draft</span> backtests can be edited.
            </p>
          </div>
          <button
            onClick={() => navigate('/backtest/dashboard')}
            className="px-5 py-2.5 rounded-lg text-white text-sm"
            style={{ backgroundColor: '#0094B3' }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const saved = id ? getFormState(id) : undefined;
  const initialFormState: CreateIndexFormState = saved ? { ...saved, uploadedFile: null } : DEFAULT_FORM;

  const today = () =>
    new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  const handleSaveAsDraft = (formState: CreateIndexFormState) => {
    if (!id) return;
    const date = today();
    const { uploadedFile, ...serializableFormState } = formState;
    const existingDetail = getBacktestDetail(id);

    updateBacktestEntry(id, {
      ...buildEntry(formState),
      status: "Draft",
      statusColor: "#94A3B8",
      statusBg: "#F1F5F9",
      performance: "Backtest not running yet",
      performanceValue: null,
      icon: undefined,
    });
    updateBacktestDetail(id, {
      configuration: buildConfiguration(formState),
      metadata: {
        created: existingDetail?.metadata.created ?? date,
        completed: null,
        lastUpdated: date,
      },
    });
    saveFormState(id, serializableFormState);
    navigate("/backtest/dashboard");
  };

  const handleSubmit = (formState: CreateIndexFormState) => {
    if (!id) return;
    const date = today();
    const { uploadedFile, ...serializableFormState } = formState;
    const existingDetail = getBacktestDetail(id);

    updateBacktestEntry(id, {
      ...buildEntry(formState),
      status: "Running",
      statusColor: "#F59E0B",
      statusBg: "#FEF3C7",
      performance: "Awaiting Results",
      performanceValue: null,
      icon: "loading",
    });
    updateBacktestDetail(id, {
      configuration: buildConfiguration(formState),
      metadata: {
        created: existingDetail?.metadata.created ?? date,
        completed: null,
        lastUpdated: date,
      },
    });
    saveFormState(id, serializableFormState);
    navigate("/backtest/dashboard");
  };

  return (
    <IndexForm
      key={id}
      initialFormState={initialFormState}
      pageTitle="Edit Index"
      submitLabel="Update Backtest"
      onSaveAsDraft={handleSaveAsDraft}
      onSubmit={handleSubmit}
      onBack={() => navigate("/backtest/dashboard")}
    />
  );
}
