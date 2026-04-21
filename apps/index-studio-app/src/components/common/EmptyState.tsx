import React from 'react';
import { Search } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Search,
  title = 'No data found',
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-sgx-light-grey" />
      </div>

      <h4 className="text-sgx-blue mb-1">{title}</h4>

      {description && (
        <p className="text-sm text-sgx-dark-grey text-center max-w-sm">{description}</p>
      )}

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
