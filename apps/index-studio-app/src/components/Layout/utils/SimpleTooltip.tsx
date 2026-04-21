import React, { useState } from 'react';
import { TooltipProps } from '@layout/types/layout.types';
import { getTooltipPlacementClasses } from '@layout/utils/layout.helpers';

export const SimpleTooltip = ({ content, children, placement = 'right' }: TooltipProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const placementClass = getTooltipPlacementClasses(placement);

  return (
    <div className="relative inline-block group">
      <div onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
        {children}
      </div>
      {showTooltip && (
        <div
          className={`absolute ${placementClass} bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none`}
        >
          {content}
        </div>
      )}
    </div>
  );
};
