import * as React from 'react';
import { VariantProps } from 'class-variance-authority';
import {
  tableVariants,
  tableRowVariants,
  tableHeadVariants,
  tableCellVariants,
} from './table.variants';

export type TableSize = 'sm' | 'md' | 'lg';
export type TableRowVariant = 'default' | 'striped' | 'highlighted';
export type TableHeadVariant = 'default' | 'primary' | 'muted';

export interface TableProps
  extends React.ComponentProps<'table'>,
    VariantProps<typeof tableVariants> {}

export interface TableRowProps
  extends React.ComponentProps<'tr'>,
    VariantProps<typeof tableRowVariants> {}

export interface TableHeadProps
  extends React.ComponentProps<'th'>,
    VariantProps<typeof tableHeadVariants> {}

export interface TableCellProps
  extends React.ComponentProps<'td'>,
    VariantProps<typeof tableCellVariants> {}
