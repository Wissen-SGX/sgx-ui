import { useState } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { CreateIndexFormState, ReturnTypes } from "@/features/backtest/types";
import { StepIndicator } from "./StepIndicator";
import { BacktestConfigStep } from "./BacktestConfigStep";
// import { BacktestParamsStep } from "./BacktestParamsStep"; // kept for future use
import { ReviewLaunchStep } from "./ReviewLaunchStep";

export const DEFAULT_FORM: CreateIndexFormState = {
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
  backtestStartDate: "2013-03-25",
  backtestEndDate: "2025-12-11",
  uploadedFile: null,
  uploadedFileName: null,
};

export type Step1Errors = Partial<Record<
  'backtestName' | 'returnTypes' | 'backtestStartDate' | 'backtestEndDate' | 'baseCurrency' | 'baseValue',
  string
>>;

function computeStep1Errors(formState: CreateIndexFormState): Step1Errors {
  const errors: Step1Errors = {};
  if (!formState.backtestName.trim()) {
    errors.backtestName = "Backtest name is required.";
  }
  const rt = formState.returnTypes;
  if (!rt.priceReturn && !rt.totalReturn && !rt.netTotalReturn && !rt.decrementPoints && !rt.decrementPercent) {
    errors.returnTypes = "Please select at least one return type.";
  }
  if (!formState.backtestStartDate) {
    errors.backtestStartDate = "Backtest start date is required.";
  }
  if (!formState.backtestEndDate) {
    errors.backtestEndDate = "Backtest end date is required.";
  } else if (formState.backtestStartDate && formState.backtestEndDate < formState.backtestStartDate) {
    errors.backtestEndDate = "End date must be on or after the start date.";
  }
  if (!formState.baseCurrency) {
    errors.baseCurrency = "Base currency is required.";
  }
  if (!formState.baseValue.trim()) {
    errors.baseValue = "Base value is required.";
  }
  return errors;
}

interface IndexFormProps {
  initialFormState?: CreateIndexFormState;
  pageTitle: string;
  submitLabel: string;
  onSaveAsDraft: (formState: CreateIndexFormState) => void;
  onSubmit: (formState: CreateIndexFormState) => void;
  onBack: () => void;
  isSavingDraft?: boolean;
  isSubmitting?: boolean;
}

export function IndexForm({
  initialFormState = DEFAULT_FORM,
  pageTitle,
  submitLabel,
  onSaveAsDraft,
  onSubmit,
  onBack,
  isSavingDraft = false,
  isSubmitting = false,
}: IndexFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formState, setFormState] = useState<CreateIndexFormState>(initialFormState);
  const [hasAttemptedProgress, setHasAttemptedProgress] = useState(false);

  const step1Errors: Step1Errors = hasAttemptedProgress ? computeStep1Errors(formState) : {};
  const hasStep1Errors = Object.keys(step1Errors).length > 0;

  const handleChange = (updates: Partial<CreateIndexFormState>) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  };

  const handleReturnTypeChange = (type: keyof ReturnTypes) => {
    setFormState((prev) => {
      const rt = prev.returnTypes;
      if (type === "decrementPoints") {
        return {
          ...prev,
          returnTypes: { ...rt, decrementPoints: !rt.decrementPoints, decrementPercent: false },
        };
      }
      if (type === "decrementPercent") {
        return {
          ...prev,
          returnTypes: { ...rt, decrementPercent: !rt.decrementPercent, decrementPoints: false },
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

  // Step 2 (Backtest Parameters) is skipped — flow goes directly 1 → 3
  const handleNext = () => {
    if (currentStep === 1) {
      setHasAttemptedProgress(true);
      if (Object.keys(computeStep1Errors(formState)).length === 0) {
        setCurrentStep(3);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep === 3) {
      setCurrentStep(1);
      setHasAttemptedProgress(false);
    }
  };

  const handleSaveAsDraft = () => {
    if (currentStep === 1) {
      setHasAttemptedProgress(true);
      if (Object.keys(computeStep1Errors(formState)).length > 0) return;
    }
    onSaveAsDraft(formState);
  };

  const displayStep = currentStep === 3 ? 2 : 1;
  const stepLabel = currentStep === 1 ? "Backtest Configuration" : "Review & Launch";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} style={{ color: "#0B236B" }} />
        </button>
        <div>
          <h1>{pageTitle}</h1>
          <p className="text-sm text-gray-600 mt-1">
            Step {displayStep} of 2: {stepLabel}
          </p>
        </div>
      </div>

      <StepIndicator currentStep={displayStep} />

      <div className="bg-white rounded-lg border p-6" style={{ borderColor: "#E5E7EB" }}>
        {currentStep === 1 && (
          <BacktestConfigStep
            formState={formState}
            onChange={handleChange}
            onReturnTypeChange={handleReturnTypeChange}
            onCalendarToggle={handleCalendarToggle}
            errors={step1Errors}
          />
        )}
        {/* Step 2 (Backtest Parameters) is temporarily disabled — component kept for future use */}
        {/* {currentStep === 2 && <BacktestParamsStep />} */}
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
            disabled={isSavingDraft}
            className="px-5 py-2.5 rounded-lg border text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ borderColor: "#E5E7EB", color: "#374151" }}
          >
            {isSavingDraft ? "Saving…" : "Save as Draft"}
          </button>
          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-lg text-white text-sm flex items-center gap-2"
              style={{ backgroundColor: hasAttemptedProgress && hasStep1Errors ? "#9CA3AF" : "#0094B3" }}
            >
              Next
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={() => onSubmit(formState)}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#0094B3" }}
            >
              {isSubmitting ? "Launching…" : submitLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
