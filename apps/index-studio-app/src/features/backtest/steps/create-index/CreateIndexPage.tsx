import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@sgx/ui";
import { CreateIndexFormState } from "@/features/backtest/types";
import { useSaveAsDraft, useRunBacktest } from "@/features/backtest/hooks/useBacktestMutations";
import { IndexForm, DEFAULT_FORM } from "./components/IndexForm";
import LaunchConfirmDialog from "../dashboard/components/LaunchConfirmDialog";

type AlertVariant = "success" | "destructive";

interface AlertState {
  variant: AlertVariant;
  title: string;
  description: string;
}

const ALERT_AUTO_DISMISS_MS = 5000;

export default function CreateIndexPage() {
  const navigate = useNavigate();
  const { mutate: saveAsDraft, isPending: isSavingDraft } = useSaveAsDraft();
  const { mutate: runBacktest, isPending: isLaunching } = useRunBacktest();

  const [pendingFormState, setPendingFormState] = useState<CreateIndexFormState | null>(null);
  const [alert, setAlert] = useState<AlertState | null>(null);
  const navigateOnDismiss = useRef(false);

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

  const handleSaveAsDraft = (formState: CreateIndexFormState) => {
    saveAsDraft(formState, {
      onSuccess: () => navigate("/backtest/dashboard"),
    });
  };

  const handleSubmit = (formState: CreateIndexFormState) => {
    setPendingFormState(formState);
  };

  const handleConfirmLaunch = () => {
    if (!pendingFormState) return;
    runBacktest(pendingFormState, {
      onSuccess: () => {
        setPendingFormState(null);
        navigateOnDismiss.current = true;
        setAlert({
          variant: "success",
          title: "Backtest Queued Successfully",
          description: "Your backtest has been queued. Redirecting to dashboard…",
        });
      },
      onError: (error: unknown) => {
        setPendingFormState(null);
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
        initialFormState={DEFAULT_FORM}
        pageTitle="Create Index"
        submitLabel="Launch Backtest"
        onSaveAsDraft={handleSaveAsDraft}
        onSubmit={handleSubmit}
        onBack={() => navigate("/backtest/dashboard")}
        isSavingDraft={isSavingDraft}
      />

      {pendingFormState && (
        <LaunchConfirmDialog
          backtestName={pendingFormState.backtestName || "this backtest"}
          isLoading={isLaunching}
          onConfirm={handleConfirmLaunch}
          onCancel={() => setPendingFormState(null)}
        />
      )}
    </div>
  );
}
