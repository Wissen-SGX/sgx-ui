import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Lock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@sgx/ui";
import { CreateIndexFormState, ReturnTypes } from "@/features/backtest/types";
import { IndexForm, DEFAULT_FORM } from "./IndexForm";
import { JobStatus, STATUS_OPTIONS } from "@sgx/shared";
import { useGetBacktestById } from "@/features/backtest/hooks/useGetBacktests";
import { useUpdateDraft, useLaunchDraftBacktest } from "@/features/backtest/hooks/useBacktestMutations";
import { TYPE_LABELS } from "@/features/backtest/api/backtest.api";
import { CALENDAR_OPTIONS } from "@sgx/shared";
import type { BacktestDetailApiData } from "@/features/backtest/types/backtest.types";
import LaunchConfirmDialog from "@/features/backtest/steps/dashboard/components/LaunchConfirmDialog";

type AlertVariant = "success" | "destructive";
interface AlertState { variant: AlertVariant; title: string; description: string; }
const ALERT_AUTO_DISMISS_MS = 5000;

// Convert API returnTypes CSV ("PR,TR") → ReturnTypes object
function parseReturnTypes(csv: string): ReturnTypes {
  const codes = (csv ?? "").split(",").map((s) => s.trim());
  return {
    priceReturn: codes.includes("PR"),
    totalReturn: codes.includes("TR"),
    netTotalReturn: codes.includes("NTR"),
    decrementPoints: codes.includes("DP"),
    decrementPercent: codes.includes("DPCT"),
  };
}

// Convert API calendars CSV ("XSES,XNYS") → full option strings for the form
function parseCalendars(csv: string): string[] {
  if (!csv) return [];
  return csv
    .split(",")
    .map((code) => code.trim())
    .filter(Boolean)
    .map(
      (code) =>
        CALENDAR_OPTIONS.find((opt) => opt.startsWith(code + " - ")) ?? code,
    );
}

function apiDataToFormState(data: BacktestDetailApiData): CreateIndexFormState {
  return {
    ...DEFAULT_FORM,
    backtestName: data.backtestName,
    indexType: TYPE_LABELS[data.indexType] ?? data.indexType,
    returnTypes: parseReturnTypes(data.returnTypes),
    baseCurrency: data.baseCurrency,
    baseValue: String(data.baseValue),
    selectedCalendars: parseCalendars(data.calendars),
    backtestStartDate: data.backtestStartDate ?? DEFAULT_FORM.backtestStartDate,
    backtestEndDate: data.backtestEndDate ?? DEFAULT_FORM.backtestEndDate,
    description: data.description ?? "",
    uploadedFile: null,
    uploadedFileName: data.csvFileName ?? data.uploadedFileName ?? null,
  };
}

export default function EditBacktestPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetBacktestById(id ?? "");

  const { mutate: updateDraft, isPending: isUpdating } = useUpdateDraft();
  const { mutate: launchDraft, isPending: isLaunching } = useLaunchDraftBacktest();

  const [showLaunchDialog, setShowLaunchDialog] = useState(false);
  const [alert, setAlert] = useState<AlertState | null>(null);
  const navigateOnDismiss = useRef(false);
  const launchedRef = useRef(false);

  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => {
      setAlert(null);
      if (navigateOnDismiss.current) {
        navigateOnDismiss.current = false;
        navigate("/backtest/dashboard");
      }
    }, ALERT_AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [alert, navigate]);

  const handleLaunch = () => {
    setShowLaunchDialog(true);
  };

  const handleConfirmLaunch = () => {
    if (!id) return;
    launchDraft(id, {
      onSuccess: () => {
        setShowLaunchDialog(false);
        launchedRef.current = true;
        navigateOnDismiss.current = true;
        setAlert({
          variant: "success",
          title: "Backtest Queued Successfully",
          description: "Your backtest has been queued. Redirecting to dashboard…",
        });
      },
      onError: (error: unknown) => {
        setShowLaunchDialog(false);
        const status = (error as { response?: { status?: number } })?.response?.status;
        setAlert({
          variant: "destructive",
          title:
            status === 400
              ? "Validation Error"
              : status === 404
                ? "Universe Not Found"
                : "Launch Failed",
          description:
            status === 400
              ? "Validation failed, missing CSV, or universe is not ready."
              : status === 404
                ? "The universe could not be found. Please check your configuration."
                : "The Airflow pipeline trigger failed. This backtest has been marked as FAILED.",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2
          size={28}
          className="animate-spin"
          style={{ color: "#0094B3" }}
        />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <p className="text-sm text-gray-500">Backtest not found.</p>
        <button
          onClick={() => navigate("/backtest/dashboard")}
          className="flex items-center gap-2 text-sm"
          style={{ color: "#0094B3" }}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (data.status !== JobStatus.DRAFT && !launchedRef.current) {
    const statusLabel =
      STATUS_OPTIONS.find((o) => o.value === data.status)?.label ?? data.status;
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate("/backtest/dashboard")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
        <div
          className="flex flex-col items-center justify-center py-24 gap-4 border rounded-lg bg-white"
          style={{ borderColor: "#E5E7EB" }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#FEF3C7" }}
          >
            <Lock size={24} style={{ color: "#F59E0B" }} />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-base" style={{ color: "#0B236B" }}>
              Editing Not Allowed
            </h2>
            <p className="text-sm text-gray-500 max-w-sm">
              <span className="font-medium" style={{ color: "#0B236B" }}>
                {data.backtestName}
              </span>{" "}
              has status{" "}
              <span
                className="px-2 py-0.5 rounded text-xs font-medium"
                style={{ backgroundColor: "#F3F4F6", color: "#6B7280" }}
              >
                {statusLabel}
              </span>
              . Only <span className="font-medium">Draft</span> backtests can be
              edited.
            </p>
          </div>
          <button
            onClick={() => navigate("/backtest/dashboard")}
            className="px-5 py-2.5 rounded-lg text-white text-sm"
            style={{ backgroundColor: "#0094B3" }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const initialFormState = apiDataToFormState(data);

  const handleSaveAsDraft = (formState: CreateIndexFormState) => {
    if (!id) return;
    updateDraft(
      { id, formState },
      { onSuccess: () => navigate("/backtest/dashboard") },
    );
  };

  return (
    <div className="space-y-4">
      {alert && (
        <Alert variant={alert.variant}>
          {alert.variant === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.description}</AlertDescription>
        </Alert>
      )}

      <IndexForm
        key={id}
        initialFormState={initialFormState}
        pageTitle="Edit Index"
        submitLabel="Launch Backtest"
        onSaveAsDraft={handleSaveAsDraft}
        onSubmit={handleLaunch}
        onBack={() => navigate("/backtest/dashboard")}
        isSavingDraft={isUpdating}
        isSubmitting={isLaunching}
      />

      {showLaunchDialog && (
        <LaunchConfirmDialog
          backtestName={data.backtestName}
          isLoading={isLaunching}
          onConfirm={handleConfirmLaunch}
          onCancel={() => setShowLaunchDialog(false)}
        />
      )}
    </div>
  );
}
