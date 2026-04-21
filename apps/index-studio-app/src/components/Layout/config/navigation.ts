import {
  Edit,
  Settings,
  LayoutGrid,
  Plus,
  Filter,
  TrendingUp,
  Weight,
  Database,
  Globe,
  Calculator,
} from 'lucide-react';
import { MenuItem } from '@layout/types/layout.types';

export const MENU_ITEMS: MenuItem[] = [
  {
    path: '/backtest',
    icon: Edit,
    label: 'Backtest',
    count: 2,
    subItems: [
      { path: '/backtest/dashboard', label: 'Dashboard', icon: LayoutGrid },
      { path: '/backtest/create-index', label: 'Create Index', icon: Plus },
    ],
  },
  {
    path: '/parameters',
    icon: Settings,
    label: 'Parameters Configuration',
    count: 5,
    subItems: [
      { path: '/parameters/universe', label: 'Universe Selection', icon: Database },
      { path: '/parameters/filtering', label: 'Filtering', icon: Filter },
      { path: '/parameters/configure-universe', label: 'Generate Universe', icon: Globe },
      { path: '/parameters/ranking', label: 'Ranking', icon: TrendingUp },
      { path: '/parameters/weighting', label: 'Weighting & Constraints', icon: Weight },
    ],
  },
  {
    path: '/settings',
    icon: Settings,
    label: 'Settings',
    count: 1,
    subItems: [{ path: '/settings/formula-builder', label: 'Formula Builder', icon: Calculator }],
  },
];

export const LAYOUT_CONFIG = {
  SIDEBAR_WIDTH_EXPANDED: 'w-64',
  SIDEBAR_WIDTH_COLLAPSED: 'w-20',
  APP_NAME: 'Index Automation Studio',
  APP_VERSION: 'v2.1.0',
};
