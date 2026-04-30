import * as React from 'react';
import { VariantProps } from 'class-variance-authority';
import {
  cardVariants,
  cardHeaderVariants,
  cardContentVariants,
  cardFooterVariants,
} from './card.variants';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'ghost';

export type CardSize = 'sm' | 'md' | 'lg';

export interface CardProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof cardVariants> {}

export interface CardHeaderProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof cardHeaderVariants> {}

export interface CardContentProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof cardContentVariants> {}

export interface CardFooterProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof cardFooterVariants> {}
