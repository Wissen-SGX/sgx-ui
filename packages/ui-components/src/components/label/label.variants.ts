import { cva } from 'class-variance-authority';

export const labelVariants = cva(
  'flex items-center gap-2 leading-none font-medium select-none ' +
    'group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 ' +
    'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
      variant: {
        default: 'text-foreground',
        muted: 'text-muted-foreground',
        primary: 'text-sgx-blue',
        destructive: 'text-destructive',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);
