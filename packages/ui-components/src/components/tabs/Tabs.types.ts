import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { VariantProps } from 'class-variance-authority';
import {
  tabsVariants,
  tabsListVariants,
  tabsTriggerVariants,
  tabsContentVariants,
} from './tabs.variants';

export type TabsVariant = 'default' | 'underline' | 'pills';

export interface TabsProps
  extends React.ComponentProps<typeof TabsPrimitive.Root>,
    VariantProps<typeof tabsVariants> {}

export interface TabsListProps
  extends React.ComponentProps<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

export interface TabsTriggerProps
  extends React.ComponentProps<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}

export interface TabsContentProps
  extends React.ComponentProps<typeof TabsPrimitive.Content>,
    VariantProps<typeof tabsContentVariants> {}
