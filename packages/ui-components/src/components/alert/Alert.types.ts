import * as React from 'react';
import { VariantProps } from 'class-variance-authority';
import { alertVariants } from './alert.variants';

export type AlertVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info';

export interface AlertProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof alertVariants> {}
