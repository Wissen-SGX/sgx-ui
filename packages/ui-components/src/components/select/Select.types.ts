import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { VariantProps } from 'class-variance-authority';
import { selectTriggerVariants, selectContentVariants, selectItemVariants } from './select.variants';

export type SelectSize = 'sm' | 'default' | 'lg';
export type SelectVariant = 'default' | 'ghost' | 'outlined';

export interface SelectTriggerProps
  extends React.ComponentProps<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants> {}

export interface SelectContentProps
  extends React.ComponentProps<typeof SelectPrimitive.Content>,
    VariantProps<typeof selectContentVariants> {}

export interface SelectItemProps
  extends React.ComponentProps<typeof SelectPrimitive.Item>,
    VariantProps<typeof selectItemVariants> {}
