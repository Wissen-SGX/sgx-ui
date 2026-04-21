import React from 'react';

export interface MenuItem {
  path: string;
  icon: React.ComponentType<{
    className?: string;
    size?: number;
    style?: React.CSSProperties;
    [key: string]: any;
  }>;
  label: string;
  count?: number;
  subItems?: MenuItem[];
  subtitle?: string;
}

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  placement?: 'top' | 'right' | 'bottom' | 'left';
}

export interface LayoutProps {
  children?: React.ReactNode;
}

export interface SidebarProps {
  isCollapsed: boolean;
  onToggle: (collapsed: boolean) => void;
}
