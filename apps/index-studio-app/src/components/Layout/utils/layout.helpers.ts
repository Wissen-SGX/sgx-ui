import { LAYOUT_CONFIG } from '@layout/config/navigation';

export const isPathActive = (path: string, currentPath: string): boolean => {
  if (path === '/') {
    return currentPath === '/' || currentPath.startsWith('/index/');
  }
  return currentPath === path;
};

/**
 * Get tooltip placement classes for Tailwind
 */
export const getTooltipPlacementClasses = (
  placement: 'top' | 'right' | 'bottom' | 'left'
): string => {
  const placements = {
    top: 'bottom-full mb-2',
    right: 'left-full ml-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
  };
  return placements[placement];
};

/**
 * Get sidebar width class based on collapsed state
 */
export const getSidebarWidthClass = (isCollapsed: boolean): string => {
  return isCollapsed ? LAYOUT_CONFIG.SIDEBAR_WIDTH_COLLAPSED : LAYOUT_CONFIG.SIDEBAR_WIDTH_EXPANDED;
};
