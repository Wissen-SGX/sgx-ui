import * as React from 'react';
import { VariantProps } from 'class-variance-authority';
import { inputVariants } from './input.variants';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'ghost' | 'outlined';

export interface InputProps
  extends Omit<React.ComponentProps<'input'>, 'size'>,
    VariantProps<typeof inputVariants> {}
