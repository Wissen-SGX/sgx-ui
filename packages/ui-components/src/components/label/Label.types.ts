import * as LabelPrimitive from '@radix-ui/react-label';
import * as React from 'react';
import { VariantProps } from 'class-variance-authority';
import { labelVariants } from './label.variants';

export type LabelSize = 'sm' | 'md' | 'lg';
export type LabelVariant = 'default' | 'muted' | 'primary' | 'destructive';

export interface LabelProps
  extends React.ComponentProps<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {}
