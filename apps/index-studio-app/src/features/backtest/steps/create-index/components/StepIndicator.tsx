import { Fragment } from 'react';
import { Check, ChevronRight } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
}

const STEPS = ['Backtest Configuration', 'Backtest Parameters', 'Review & Launch'];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((label, index) => {
        const stepNum = index + 1;
        const isActive = currentStep >= stepNum;
        const isCompleted = currentStep > stepNum;
        return (
          <Fragment key={stepNum}>
            <div className="flex items-center gap-2 flex-1">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-full text-sm"
                style={{
                  backgroundColor: isActive ? '#0094B3' : '#E5E7EB',
                  color: isActive ? '#ffffff' : '#6B7280',
                }}
              >
                {isCompleted ? <Check size={16} /> : stepNum}
              </div>
              <div className="text-sm" style={{ color: isActive ? '#0B236B' : '#6B7280' }}>
                {label}
              </div>
            </div>
            {index < STEPS.length - 1 && (
              <ChevronRight size={20} className="text-gray-400" />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
