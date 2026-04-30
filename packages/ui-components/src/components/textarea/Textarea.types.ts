import * as React from 'react';
import { VariantProps } from 'class-variance-authority';
import { textareaVariants } from './textarea.variants';

export type TextareaVariant = 'default' | 'ghost' | 'outlined' | 'resizable';
export type TextareaSize = 'sm' | 'md' | 'lg';

export interface TextareaProps
  extends React.ComponentProps<'textarea'>,
    VariantProps<typeof textareaVariants> {}
