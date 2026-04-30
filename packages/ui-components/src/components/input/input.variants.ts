import { cva } from 'class-variance-authority';

export const inputVariants = cva(
  'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground ' +
    'border-input flex w-full min-w-0 rounded-md border bg-input-background px-3 py-1 ' +
    'text-base transition-[color,box-shadow] outline-none ' +
    'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium ' +
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ' +
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] ' +
    'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
  {
    variants: {
      size: {
        sm: 'h-7 text-sm px-2',
        md: 'h-9 text-sm md:text-sm',
        lg: 'h-11 text-base px-4',
      },
      variant: {
        default: 'bg-input-background',
        ghost: 'border-transparent bg-transparent focus-visible:bg-input-background',
        outlined: 'bg-transparent border-sgx-blue focus-visible:ring-sgx-blue',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);
