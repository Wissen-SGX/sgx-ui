import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { VariantProps } from 'class-variance-authority';
import {
  accordionItemVariants,
  accordionTriggerVariants,
  accordionContentVariants,
} from './accordion.variants';

export type AccordionVariant = 'default' | 'bordered' | 'ghost';

export type AccordionSize = 'sm' | 'md' | 'lg';

export interface AccordionItemProps
  extends React.ComponentProps<typeof AccordionPrimitive.Item>,
    VariantProps<typeof accordionItemVariants> {}

export interface AccordionTriggerProps
  extends React.ComponentProps<typeof AccordionPrimitive.Trigger>,
    VariantProps<typeof accordionTriggerVariants> {}

export interface AccordionContentProps
  extends React.ComponentProps<typeof AccordionPrimitive.Content>,
    VariantProps<typeof accordionContentVariants> {}
