import { lazy, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, RotateCw, CheckCircle2, AlertCircle } from "lucide-react";
import { Button, Alert, AlertTitle, AlertDescription } from "@sgx/ui";
import { useGetBacktests } from "@/features/backtest/hooks/useGetBacktests";
import { useLaunchDraftBacktest, type LaunchBacktestResponse } from "@/features/backtest/hooks/useBacktestMutations";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setDashboardFilter } from "@/store/slices/backtestUiSlice";
import type { BacktestEntry } from "@/features/backtest/types";
import LaunchConfirmDialog from "./components/LaunchConfirmDialog";

const BacktestStatusCards = lazy(
  () => import("@/features/backtest/steps/dashboard/components/BacktestStatusCards"),
);
const BacktestFilters = lazy(
  () => import("@/features/backtest/steps/dashboard/components/BacktestFilters"),
);
const BacktestTable = lazy(
  () => import("@/features/backtest/steps/dashboard/components/BacktestTable"),
);

type AlertVariant = "success" | "destructive";

interface AlertState {
  variant: AlertVariant;
  title: string;
  description: string;
}

const ALERT_AUTO_DISMISS_MS = 5000;

export default function BacktestDashboardPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data, isLoading, isError, refetch } = useGetBacktests();
  const { searchQuery, statusFilter, typeFilter } = useAppSelector(
    (s) => s.backtestUi.dashboard,
  );

  const [confirmEntry, setConfirmEntry] = useState<BacktestEntry | null>(null);
  const [alert, setAlert] = useState<AlertState | null>(null);

  const { mutate: launchDraftBacktest, isPending: isLaunching } = useLaunchDraftBacktest();

  // Auto-dismiss alert after 5 s
  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => setAlert(null), ALERT_AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [alert]);

  const filtered = data.backtests.filter((entry) => {
    const matchesSearch =
      searchQuery === "" ||
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || entry.status === statusFilter;
    const matchesType = typeFilter === "ALL" || entry.indexType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleRun = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const entry = data.backtests.find((b) => b.id === id) ?? null;
    setConfirmEntry(entry);
  };

  const handleConfirmLaunch = () => {
    if (!confirmEntry) return;
    launchDraftBacktest(confirmEntry.id, {
      onSuccess: (result: LaunchBacktestResponse) => {
        setConfirmEntry(null);
        setAlert({
          variant: "success",
          title: "Backtest Queued Successfully",
          description: `Job #${result.backtestJobId} queued at ${new Date(result.triggeredAt).toLocaleString()}. Status: ${result.status}.`,
        });
        refetch();
      },
      onError: (error: unknown) => {
        setConfirmEntry(null);
        const status = (error as { response?: { status?: number } })?.response?.status;
        setAlert({
          variant: "destructive",
          title: status === 404 ? "Backtest Not Found" : "Launch Failed",
          description:
            status === 404
              ? "The backtest could not be found. Please refresh and try again."
              : "The Airflow pipeline trigger failed. This backtest has been marked as FAILED.",
        });
      },
    });
  };

  const handleStop = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Stopping backtest:", id);
  };

  const handleEdit = (id: string) => {
    navigate(`/backtest/dashboard/${id}/edit`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage and monitor all your backtesting workflows
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="white"
            className="px-5 py-2.5 rounded-lg border flex items-center gap-2 text-sm transition-colors"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RotateCw size={18} className={isLoading ? "animate-spin" : ""} />
            Refresh Data
          </Button>
          <Button
            variant="lightblue"
            onClick={() => navigate("/backtest/create-index")}
            className="px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm"
          >
            <Plus size={18} />
            Create New Index
          </Button>
        </div>
      </div>

      {/* Inline alert — shown after launch success / error */}
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

      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to load backtests</AlertTitle>
          <AlertDescription>Please try refreshing the page.</AlertDescription>
        </Alert>
      )}

      <BacktestStatusCards counts={data.stats} />

      <BacktestFilters
        searchQuery={searchQuery}
        onSearchChange={(val) => dispatch(setDashboardFilter({ searchQuery: val }))}
        statusFilter={statusFilter}
        onStatusChange={(val) => dispatch(setDashboardFilter({ statusFilter: val }))}
        typeFilter={typeFilter}
        onTypeChange={(val) => dispatch(setDashboardFilter({ typeFilter: val }))}
        onRefresh={() => refetch()}
      />

      <BacktestTable
        entries={filtered}
        onRun={handleRun}
        onStop={handleStop}
        onEdit={handleEdit}
      />

      {/* Launch confirm dialog — rendered outside table to avoid z-index issues */}
      {confirmEntry && (
        <LaunchConfirmDialog
          backtestName={confirmEntry.name}
          isLoading={isLaunching}
          onConfirm={handleConfirmLaunch}
          onCancel={() => setConfirmEntry(null)}
        />
      )}
    </div>
  );
}