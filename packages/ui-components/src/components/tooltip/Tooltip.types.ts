import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { VariantProps } from 'class-variance-authority';
import { tooltipContentVariants } from './tooltip.variants';

export type TooltipVariant = 'default' | 'dark' | 'light' | 'destructive';
export type TooltipSize = 'sm' | 'md' | 'lg';

export interface TooltipContentProps
  extends React.ComponentProps<typeof TooltipPrimitive.Content>,
    VariantProps<typeof tooltipContentVariants> {}
