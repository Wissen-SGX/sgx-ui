import { lazy } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, RotateCw } from "lucide-react";
import { Button } from "@sgx/ui";
import { useGetBacktests } from "@/features/backtest/hooks/useGetBacktests";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setDashboardFilter } from "@/store/slices/backtestUiSlice";
const BacktestStatusCards = lazy(
  () =>
    import("@/features/backtest/steps/dashboard/components/BacktestStatusCards"),
);
const BacktestFilters = lazy(
  () =>
    import("@/features/backtest/steps/dashboard/components/BacktestFilters"),
);
const BacktestTable = lazy(
  () => import("@/features/backtest/steps/dashboard/components/BacktestTable"),
);

export default function BacktestDashboardPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data, isLoading, isError, refetch } = useGetBacktests();
  const { searchQuery, statusFilter, typeFilter } = useAppSelector(
    (s) => s.backtestUi.dashboard,
  );
  console.log("data", data);
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
    console.log("Running backtest:", id);
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
            variant={"white"}
            className="px-5 py-2.5 rounded-lg border flex items-center gap-2 text-sm transition-colors"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RotateCw size={18} className={isLoading ? "animate-spin" : ""} />
            Refresh Data
          </Button>
          <Button
            variant={"lightblue"}
            onClick={() => navigate("/backtest/create-index")}
            className="px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm"
          >
            <Plus size={18} />
            Create New Index
          </Button>
        </div>
      </div>

      {isError && (
        <p className="text-sm text-red-500">
          Failed to load backtests. Please try refreshing.
        </p>
      )}

      <BacktestStatusCards counts={data.stats} />

      <BacktestFilters
        searchQuery={searchQuery}
        onSearchChange={(val) =>
          dispatch(setDashboardFilter({ searchQuery: val }))
        }
        statusFilter={statusFilter}
        onStatusChange={(val) =>
          dispatch(setDashboardFilter({ statusFilter: val }))
        }
        typeFilter={typeFilter}
        onTypeChange={(val) =>
          dispatch(setDashboardFilter({ typeFilter: val }))
        }
        onRefresh={() => refetch()}
      />

      <BacktestTable
        entries={filtered}
        onRun={handleRun}
        onStop={handleStop}
        onEdit={handleEdit}
      />
    </div>
  );
}
