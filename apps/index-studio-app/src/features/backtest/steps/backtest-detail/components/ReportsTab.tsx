import { Download, FileText } from "lucide-react";
import type { BacktestResultItem } from "@/features/backtest/types";

export function ReportsTab({ results }: { results: BacktestResultItem[] }) {
  return (
    <div className="space-y-6">
      {/* API result files */}
      {results.length > 0 ? (
        <div
          className="border rounded-lg bg-white overflow-hidden"
          style={{ borderColor: "#E5E7EB" }}
        >
          <div
            className="px-6 py-4 border-b"
            style={{ borderColor: "#E5E7EB" }}
          >
            <div className="text-sm" style={{ color: "#0B236B" }}>
              Result Files
            </div>
          </div>
          <div className="divide-y" style={{ borderColor: "#E5E7EB" }}>
            {results.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "#E0F2FE" }}
                  >
                    <FileText size={18} style={{ color: "#0094B3" }} />
                  </div>
                  <div>
                    <div className="text-sm" style={{ color: "#0B236B" }}>
                      {item.resultType.replace(/_/g, " ")}
                    </div>
                  </div>
                </div>
                <a
                  href={item.downloadUrl}
                  download
                  className="flex items-center gap-1 text-sm"
                  style={{ color: "#0094B3" }}
                >
                  <Download size={14} />
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          className="border rounded-lg p-12 bg-white text-center text-sm text-gray-500"
          style={{ borderColor: "#E5E7EB" }}
        >
          No reports data available yet.
        </div>
      )}
    </div>
  );
}
