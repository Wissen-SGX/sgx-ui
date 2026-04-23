import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { CreateIndexFormState, ReturnTypes } from "@/features/backtest/types";
import { useBacktest } from "@/contexts/BacktestContext";
import { StepIndicator } from "./components/StepIndicator";
import { BacktestConfigStep } from "./components/BacktestConfigStep";
import { BacktestParamsStep } from "./components/BacktestParamsStep";
import { ReviewLaunchStep } from "./components/ReviewLaunchStep";

const DEFAULT_FORM: CreateIndexFormState = {
  backtestName: "",
  indexType: "Standard Index",
  returnTypes: {
    priceReturn: false,
    totalReturn: true,
    netTotalReturn: false,
    decrementPoints: true,
    decrementPercent: false,
  },
  decrementFrequency: "Daily",
  decrementBasis: "365 Days",
  customDays: "",
  totalPoints: "",
  totalPercentage: "",
  baseCurrency: "SGD",
  baseValue: "1000",
  selectedCalendars: ["XSES - SINGAPORE EXCHANGE"],
  description: "",
  selectedUniverse: "",
  selectedFilters: "",
  selectedRanking: "",
  selectedWeighting: "",
  uploadedFile: null,
};

export default function CreateIndexPage() {
  const navigate = useNavigate();
  const { addBacktestEntryWithDetail } = useBacktest();
  const [currentStep, setCurrentStep] = useState(1);
  const [formState, setFormState] =
    useState<CreateIndexFormState>(DEFAULT_FORM);

  const handleChange = (updates: Partial<CreateIndexFormState>) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  };

  const handleReturnTypeChange = (type: keyof ReturnTypes) => {
    setFormState((prev) => {
      const rt = prev.returnTypes;
      if (type === "decrementPoints") {
        return {
          ...prev,
          returnTypes: {
            ...rt,
            decrementPoints: !rt.decrementPoints,
            decrementPercent: false,
          },
        };
      }
      if (type === "decrementPercent") {
        return {
          ...prev,
          returnTypes: {
            ...rt,
            decrementPercent: !rt.decrementPercent,
            decrementPoints: false,
          },
        };
      }
      return { ...prev, returnTypes: { ...rt, [type]: !rt[type] } };
    });
  };

  const handleCalendarToggle = (calendar: string) => {
    setFormState((prev) => ({
      ...prev,
      selectedCalendars: prev.selectedCalendars.includes(calendar)
        ? prev.selectedCalendars.filter((c) => c !== calendar)
        : [...prev.selectedCalendars, calendar],
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep((s) => s + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const buildEntryBase = () => ({
    name: formState.backtestName || "Untitled Index",
    description: formState.description || "",
    type: (formState.indexType === "Fixed Basket"
      ? "fixed basket"
      : "standard") as "fixed basket" | "standard",
    typeLabel:
      formState.indexType === "Fixed Basket" ? "Fixed Basket" : "Standard",
  });

  const getReturnTypeLabel = (): string => {
    const rt = formState.returnTypes;
    const active: string[] = [];
    if (rt.priceReturn) active.push("Price Return");
    if (rt.totalReturn) active.push("Total Return");
    if (rt.netTotalReturn) active.push("Net Total Return");
    if (rt.decrementPoints) active.push("Decrement (Points)");
    if (rt.decrementPercent) active.push("Decrement (%)");
    return active.join(", ") || "--";
  };

  const buildDetailBase = (formattedDate: string) => ({
    totalReturn: "--",
    annualizedReturn: "--",
    volatility: "--",
    sharpeRatio: "--",
    maxDrawdown: "--",
    sortino: "--",
    calmar: "--",
    configuration: {
      indexType: formState.indexType,
      returnType: getReturnTypeLabel(),
      rebalanceFrequency: "--",
      currency: formState.baseCurrency,
      baseValue: formState.baseValue,
      baseDate: formattedDate,
      dividendTreatment: "--",
      weightCeiling: "--",
      weightingMethod: formState.selectedWeighting || "--",
    },
    metadata: {
      created: formattedDate,
      completed: null,
      lastUpdated: formattedDate,
    },
    indexLevels: [] as { date: string; value: string; change: string; positive: boolean }[],
  });

  const handleSaveAsDraft = () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    addBacktestEntryWithDetail(
      {
        ...buildEntryBase(),
        period: { start: formattedDate, end: formattedDate },
        status: "Draft",
        statusColor: "#94A3B8",
        statusBg: "#F1F5F9",
        performance: "Backtest not running yet",
        performanceValue: null,
      },
      buildDetailBase(formattedDate),
    );
    navigate("/backtest/dashboard");
  };

  const handleSubmit = () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    addBacktestEntryWithDetail(
      {
        ...buildEntryBase(),
        period: { start: formattedDate, end: formattedDate },
        status: "Running",
        statusColor: "#F59E0B",
        statusBg: "#FEF3C7",
        performance: "Awaiting Results",
        performanceValue: null,
        icon: "loading",
      },
      buildDetailBase(formattedDate),
    );
    navigate("/backtest/dashboard");
  };

  const stepLabel =
    currentStep === 1
      ? "Backtest Configuration"
      : currentStep === 2
        ? "Backtest Parameters"
        : "Review & Launch";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/backtest/dashboard")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} style={{ color: "#0B236B" }} />
        </button>
        <div>
          <h1>Create Index</h1>
          <p className="text-sm text-gray-600 mt-1">
            Step {currentStep} of 3: {stepLabel}
          </p>
        </div>
      </div>

      <StepIndicator currentStep={currentStep} />

      <div
        className="bg-white rounded-lg border p-6"
        style={{ borderColor: "#E5E7EB" }}
      >
        {currentStep === 1 && (
          <BacktestConfigStep
            formState={formState}
            onChange={handleChange}
            onReturnTypeChange={handleReturnTypeChange}
            onCalendarToggle={handleCalendarToggle}
          />
        )}
        {currentStep === 2 && <BacktestParamsStep />}
        {currentStep === 3 && <ReviewLaunchStep />}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="px-5 py-2.5 rounded-lg border text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ borderColor: "#E5E7EB", color: "#374151" }}
        >
          Previous
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveAsDraft}
            className="px-5 py-2.5 rounded-lg border text-sm transition-colors"
            style={{ borderColor: "#E5E7EB", color: "#374151" }}
          >
            Save as Draft
          </button>
          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-lg text-white text-sm flex items-center gap-2"
              style={{ backgroundColor: "#0094B3" }}
            >
              Next
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-5 py-2.5 rounded-lg text-white text-sm"
              style={{ backgroundColor: "#0094B3" }}
            >
              Launch Backtest
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
