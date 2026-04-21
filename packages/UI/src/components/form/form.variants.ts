import { cva } from 'class-variance-authority';

export const formItemVariants = cva('grid', {
  variants: {
    gap: {
      sm: 'gap-1',
      md: 'gap-2',
      lg: 'gap-3',
    },
  },
  defaultVariants: {
    gap: 'md',
  },
});

export const formMessageVariants = cva('text-sm', {
  variants: {
    variant: {
      error: 'text-destructive',
      success: 'text-sgx-green',
      muted: 'text-muted-foreground',
    },
  },
  defaultVariants: {
    variant: 'error',
  },
});
