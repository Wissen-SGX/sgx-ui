import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  RefreshCw,
  CheckCircle,
  Rocket,
  XCircle,
  Play,
  Square,
  Eye,
  MoreVertical,
  Edit2,
} from "lucide-react";
import { BacktestEntry, BacktestStatus } from "@/features/backtest/types";
import { JobStatus, IndexType, STATUS_OPTIONS } from "@sgx/shared";

interface BacktestTableProps {
  entries: BacktestEntry[];
  onRun: (id: string, e: React.MouseEvent) => void;
  onStop: (id: string, e: React.MouseEvent) => void;
  onEdit: (id: string) => void;
}

function StatusBadge({ entry }: { entry: BacktestEntry }) {
  const statusLabel =
    STATUS_OPTIONS.find((o) => o.value === entry.status)?.label ?? entry.status;
  return (
    <div className="flex items-center gap-2">
      {entry.icon === "loading" && (
        <RefreshCw
          size={14}
          className="animate-spin"
          style={{ color: entry.statusColor }}
        />
      )}
      {entry.icon === "error" && (
        <XCircle size={14} style={{ color: entry.statusColor }} />
      )}
      {entry.status === JobStatus.COMPLETED && !entry.icon && (
        <CheckCircle size={14} style={{ color: entry.statusColor }} />
      )}
      {(entry.status as string) === "LAUNCHED TO PRODUCTION" && (
        <Rocket size={14} style={{ color: entry.statusColor }} />
      )}
      <span
        className="px-3 py-1 rounded text-xs"
        style={{ backgroundColor: entry.statusBg, color: entry.statusColor }}
      >
        {statusLabel}
      </span>
    </div>
  );
}

function PerformanceBadge({ entry }: { entry: BacktestEntry }) {
  if (entry.icon === "loading") {
    return (
      <div
        className="flex items-center gap-2 text-sm"
        style={{ color: "#F59E0B" }}
      >
        <RefreshCw size={14} className="animate-spin" />
        Awaiting Results
      </div>
    );
  }
  if (entry.performanceValue !== null) {
    return (
      <div className="flex items-center gap-2">
        <div className="text-sm" style={{ color: "#16A34A" }}>
          {entry.trend === "up" ? "↑" : "↓"} {entry.performance}
        </div>
      </div>
    );
  }
  return <div className="text-sm text-gray-500">{entry.performance}</div>;
}

const COLUMNS = [
  "Backtest Name",
  "Type",
  "Period",
  "Status",
  "Performance",
  "Actions",
];

const STATUS_WITH_RUNNING_ACTION: BacktestStatus[] = [JobStatus.RUNNING];

export default function BacktestTable({
  entries,
  onRun,
  onStop,
  onEdit,
}: BacktestTableProps) {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (openMenuId === id) {
      setOpenMenuId(null);
    } else {
      const button = buttonRefs.current[id];
      if (button) {
        const rect = button.getBoundingClientRect();
        setMenuPosition({ top: rect.bottom + 4, left: rect.right - 192 });
      }
      setOpenMenuId(id);
    }
  };

  return (
    <div
      className="border rounded-lg bg-white overflow-hidden"
      style={{ borderColor: "#E5E7EB" }}
    >
      <table className="w-full">
        <thead>
          <tr
            style={{
              backgroundColor: "#F9FAFB",
              borderBottom: "1px solid #E5E7EB",
            }}
          >
            {COLUMNS.map((col) => (
              <th
                key={col}
                className="text-left px-6 py-3 text-xs text-gray-600 uppercase tracking-wider"
              >
                {col === "Backtest Name" ? (
                  <div className="flex items-center gap-2">
                    <FileText size={14} />
                    {col}
                  </div>
                ) : (
                  col
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-12 text-center text-sm text-gray-500"
              >
                No backtests match your filters
              </td>
            </tr>
          ) : (
            entries.map((entry, index) => (
              <tr
                key={entry.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                style={{
                  borderBottom:
                    index < entries.length - 1 ? "1px solid #E5E7EB" : "none",
                }}
                onClick={() => navigate(`/backtest/dashboard/${entry.id}`)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-gray-400 shrink-0" />
                    <div>
                      <div className="text-sm" style={{ color: "#0B236B" }}>
                        {entry.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {entry.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className="px-3 py-1 rounded text-xs"
                    style={{
                      backgroundColor:
                        entry.indexType === IndexType.STANDARD_INDEX
                          ? "#DBEAFE"
                          : "#FEF3C7",
                      color:
                        entry.indexType === IndexType.STANDARD_INDEX
                          ? "#1E40AF"
                          : "#92400E",
                    }}
                  >
                    {entry.typeLabel}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>📅</span>
                    <span>{entry.period.start}</span>
                    <span>→</span>
                    <span>{entry.period.end}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge entry={entry} />
                </td>
                <td className="px-6 py-4">
                  <PerformanceBadge entry={entry} />
                </td>
                <td className="px-6 py-4">
                  <div
                    className="flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {STATUS_WITH_RUNNING_ACTION.includes(entry.status) ? (
                      <button
                        onClick={(e) => onStop(entry.id, e)}
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                        title="Stop backtest"
                      >
                        <Square size={16} style={{ color: "#DC2626" }} />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => onRun(entry.id, e)}
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                        title="Run backtest"
                      >
                        <Play size={16} style={{ color: "#0094B3" }} />
                      </button>
                    )}
                    <button
                      onClick={() =>
                        navigate(`/backtest/dashboard/${entry.id}`)
                      }
                      className="p-2 hover:bg-gray-100 rounded transition-colors"
                      title="View details"
                    >
                      <Eye size={16} style={{ color: "#0094B3" }} />
                    </button>
                    <button
                      ref={(el) => {
                        buttonRefs.current[entry.id] = el;
                      }}
                      onClick={(e) => handleMenuToggle(entry.id, e)}
                      className="p-2 hover:bg-gray-100 rounded transition-colors"
                      title="More options"
                    >
                      <MoreVertical size={16} className="text-gray-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {openMenuId !== null &&
        (() => {
          const openEntry = entries.find((e) => e.id === openMenuId);
          const isDraft = openEntry?.status === JobStatus.DRAFT;
          return (
            <div
              ref={menuRef}
              className="fixed z-50 w-52 rounded-lg shadow-lg border bg-white py-1"
              style={{
                top: menuPosition.top,
                left: menuPosition.left,
                borderColor: "#E5E7EB",
              }}
            >
              {isDraft ? (
                <button
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors"
                  style={{ color: "#374151" }}
                  onClick={() => {
                    onEdit(openMenuId);
                    setOpenMenuId(null);
                  }}
                >
                  <Edit2 size={14} style={{ color: "#0094B3" }} />
                  Edit Backtest
                </button>
              ) : (
                <div className="px-4 py-2">
                  <div className="flex items-center gap-2 text-sm text-gray-400 cursor-not-allowed">
                    <Edit2 size={14} />
                    Edit Backtest
                  </div>
                  <p className="text-xs mt-1" style={{ color: "#F59E0B" }}>
                    Only Draft backtests can be edited.
                  </p>
                </div>
              )}
            </div>
          );
        })()}
    </div>
  );
}
