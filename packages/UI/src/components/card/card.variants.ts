import { cva } from 'class-variance-authority';

export const cardVariants = cva('bg-card text-card-foreground flex flex-col gap-6 transition-all', {
  variants: {
    variant: {
      default: 'rounded-xl border',
      elevated: 'rounded-xl shadow-md border-0',
      outlined: 'rounded-xl border-2 border-sgx-blue',
      ghost: 'rounded-xl border-0 bg-transparent',
    },
    size: {
      sm: 'gap-3',
      md: 'gap-6',
      lg: 'gap-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

export const cardHeaderVariants = cva(
  '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
  {
    variants: {
      size: {
        sm: 'px-4 pt-4',
        md: 'px-6 pt-6',
        lg: 'px-8 pt-8',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export const cardContentVariants = cva('[&:last-child]:pb-6', {
  variants: {
    size: {
      sm: 'px-4',
      md: 'px-6',
      lg: 'px-8',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const cardFooterVariants = cva('flex items-center [.border-t]:pt-6', {
  variants: {
    size: {
      sm: 'px-4 pb-4',
      md: 'px-6 pb-6',
      lg: 'px-8 pb-8',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
