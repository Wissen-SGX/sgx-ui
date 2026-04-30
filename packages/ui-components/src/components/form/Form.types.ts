import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { VariantProps } from 'class-variance-authority';
import { FieldPath, FieldValues } from 'react-hook-form';
import { formItemVariants, formMessageVariants } from './form.variants';

export type FormItemGap = 'sm' | 'md' | 'lg';
export type FormMessageVariant = 'error' | 'success' | 'muted';

export interface FormItemProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof formItemVariants> {}

export interface FormMessageProps
  extends React.ComponentProps<'p'>,
    VariantProps<typeof formMessageVariants> {}

export interface FormLabelProps
  extends React.ComponentProps<typeof LabelPrimitive.Root> {}

export type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

export type FormItemContextValue = {
  id: string;
};
