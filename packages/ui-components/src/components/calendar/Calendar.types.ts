import { DayPicker } from 'react-day-picker';
import * as React from 'react';
import { VariantProps } from 'class-variance-authority';
import { calendarVariants, calendarDayVariants } from './calendar.variants';

export type CalendarSize = 'sm' | 'md' | 'lg';
export type CalendarDayVariant = 'default' | 'primary' | 'ghost';

export interface CalendarProps
  extends React.ComponentProps<typeof DayPicker>,
    VariantProps<typeof calendarVariants>,
    Pick<VariantProps<typeof calendarDayVariants>, 'variant'> {}
