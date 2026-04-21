import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { isPathActive } from '@layout/utils/layout.helpers';

export interface UseLayoutReturn {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isActive: (path: string) => boolean;
}

/**
 * Custom hook for managing layout state and logic
 */
export const useLayout = (): UseLayoutReturn => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  const isActive = (path: string) => isPathActive(path, location.pathname);

  return {
    isCollapsed,
    setIsCollapsed,
    searchTerm,
    setSearchTerm,
    isActive,
  };
};
