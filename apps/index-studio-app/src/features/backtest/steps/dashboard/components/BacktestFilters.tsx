import { useState } from "react";
import { Search, ChevronDown, RotateCw } from "lucide-react";
import { STATUS_OPTIONS, TYPE_OPTIONS } from "@sgx/shared/constants";

interface BacktestFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  typeFilter: string;
  onTypeChange: (value: string) => void;
  onRefresh: () => void;
}

export default function BacktestFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  onRefresh,
}: BacktestFiltersProps) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const handleStatusSelect = (value: string) => {
    onStatusChange(value);
    setShowStatusDropdown(false);
  };

  const handleTypeSelect = (value: string) => {
    onTypeChange(value);
    setShowTypeDropdown(false);
  };

  const currentStatusLabel =
    STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ?? "All Statuses";
  const currentTypeLabel =
    TYPE_OPTIONS.find((o) => o.value === typeFilter)?.label ?? "All Types";

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search by name or description..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0094B3]"
          style={{ borderColor: "#E5E7EB" }}
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            className="px-4 py-2.5 border rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
            style={{ borderColor: "#E5E7EB", color: "#374151" }}
            onClick={() => {
              setShowStatusDropdown((v) => !v);
              setShowTypeDropdown(false);
            }}
          >
            {currentStatusLabel}
            <ChevronDown size={16} className="text-gray-400" />
          </button>
          {showStatusDropdown && (
            <div
              className="absolute z-10 mt-1 w-56 bg-white rounded-lg shadow-lg border"
              style={{ borderColor: "#E5E7EB" }}
            >
              {STATUS_OPTIONS.map(({ label, value }, i, arr) => (
                <div
                  key={value}
                  className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${i === 0 ? "rounded-t-lg" : ""} ${i === arr.length - 1 ? "rounded-b-lg" : ""}`}
                  onClick={() => handleStatusSelect(value)}
                >
                  {label}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            className="px-4 py-2.5 border rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
            style={{ borderColor: "#E5E7EB", color: "#374151" }}
            onClick={() => {
              setShowTypeDropdown((v) => !v);
              setShowStatusDropdown(false);
            }}
          >
            {currentTypeLabel}
            <ChevronDown size={16} className="text-gray-400" />
          </button>
          {showTypeDropdown && (
            <div
              className="absolute z-10 mt-1 w-56 bg-white rounded-lg shadow-lg border"
              style={{ borderColor: "#E5E7EB" }}
            >
              {TYPE_OPTIONS.map(({ label, value }, i, arr) => (
                <div
                  key={value}
                  className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${i === 0 ? "rounded-t-lg" : ""} ${i === arr.length - 1 ? "rounded-b-lg" : ""}`}
                  onClick={() => handleTypeSelect(value)}
                >
                  {label}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onRefresh}
          className="p-2.5 border rounded-lg hover:bg-gray-50 transition-colors"
          style={{ borderColor: "#E5E7EB" }}
          title="Refresh"
        >
          <RotateCw size={18} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}
