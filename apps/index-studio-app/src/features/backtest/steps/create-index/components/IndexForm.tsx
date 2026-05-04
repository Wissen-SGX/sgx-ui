import { useState } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Form } from "@sgx/ui";
import { CreateIndexFormState } from "@/features/backtest/types";
import { useBacktestForm } from "@/features/backtest/hooks/useBacktestForm";
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

// Fields validated before advancing from step 1
const STEP1_FIELDS: (keyof CreateIndexFormState)[] = [
  "returnTypes",
  "backtestStartDate",
  "backtestEndDate",
  "baseCurrency",
  "baseValue",
];

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
  const form = useBacktestForm(initialFormState);

  const handleNext = async () => {
    if (currentStep === 1) {
      const valid = await form.trigger(STEP1_FIELDS);
      if (valid) setCurrentStep(3);
    }
  };

  const handlePrevious = () => {
    if (currentStep === 3) setCurrentStep(1);
  };

  const handleSaveAsDraft = async () => {
    if (currentStep === 1) {
      const valid = await form.trigger(STEP1_FIELDS);
      if (!valid) return;
    }
    onSaveAsDraft(form.getValues());
  };

  const displayStep = currentStep === 3 ? 2 : 1;
  const stepLabel =
    currentStep === 1 ? "Backtest Configuration" : "Review & Launch";

  return (
    <Form {...form}>
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

        <div
          className="bg-white rounded-lg border p-6"
          style={{ borderColor: "#E5E7EB" }}
        >
          {currentStep === 1 && <BacktestConfigStep />}
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
                style={{ backgroundColor: "#0094B3" }}
              >
                Next
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={form.handleSubmit(onSubmit)}
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
    </Form>
  );
}
