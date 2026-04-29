import { Button } from '@sgx/ui';
import { Rocket } from 'lucide-react';

interface LaunchConfirmDialogProps {
  backtestName: string;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function LaunchConfirmDialog({
  backtestName,
  isLoading,
  onConfirm,
  onCancel,
}: LaunchConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={!isLoading ? onCancel : undefined}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white shadow-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
            <Rocket size={20} className="text-[#0094B3]" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Launch Backtest</h2>
            <p className="text-xs text-gray-500">This action will queue the job for execution</p>
          </div>
        </div>

        <p className="text-sm text-gray-700">
          Are you sure you want to launch{' '}
          <span className="font-semibold text-gray-900">{backtestName}</span>?
          Once queued, the backtest will run automatically via the pipeline.
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="white"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="lightblue"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Launching…' : 'Launch'}
          </Button>
        </div>
      </div>
    </div>
  );
}
