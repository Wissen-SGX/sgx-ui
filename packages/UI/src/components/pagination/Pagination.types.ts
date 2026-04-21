import * as React from 'react';
import { VariantProps } from 'class-variance-authority';
import { paginationLinkVariants } from './pagination.variants';

export type PaginationSize = 'default' | 'sm' | 'lg' | 'icon';

export interface PaginationLinkProps
  extends React.ComponentProps<'a'>,
    VariantProps<typeof paginationLinkVariants> {
  isActive?: boolean;
}
