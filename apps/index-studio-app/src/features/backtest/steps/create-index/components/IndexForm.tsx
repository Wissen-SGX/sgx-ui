import { useState } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { CreateIndexFormState, ReturnTypes } from "@/features/backtest/types";
import { StepIndicator } from "./StepIndicator";
import { BacktestConfigStep } from "./BacktestConfigStep";
import { BacktestParamsStep } from "./BacktestParamsStep";
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

interface IndexFormProps {
  initialFormState?: CreateIndexFormState;
  pageTitle: string;
  submitLabel: string;
  onSaveAsDraft: (formState: CreateIndexFormState) => void;
  onSubmit: (formState: CreateIndexFormState) => void;
  onBack: () => void;
}

export function IndexForm({
  initialFormState = DEFAULT_FORM,
  pageTitle,
  submitLabel,
  onSaveAsDraft,
  onSubmit,
  onBack,
}: IndexFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formState, setFormState] = useState<CreateIndexFormState>(initialFormState);

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

  const handleNext = () => { if (currentStep < 3) setCurrentStep((s) => s + 1); };
  const handlePrevious = () => { if (currentStep > 1) setCurrentStep((s) => s - 1); };

  const stepLabel =
    currentStep === 1 ? "Backtest Configuration"
    : currentStep === 2 ? "Backtest Parameters"
    : "Review & Launch";

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
            Step {currentStep} of 3: {stepLabel}
          </p>
        </div>
      </div>

      <StepIndicator currentStep={currentStep} />

      <div className="bg-white rounded-lg border p-6" style={{ borderColor: "#E5E7EB" }}>
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
            onClick={() => onSaveAsDraft(formState)}
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
              onClick={() => onSubmit(formState)}
              className="px-5 py-2.5 rounded-lg text-white text-sm"
              style={{ backgroundColor: "#0094B3" }}
            >
              {submitLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
