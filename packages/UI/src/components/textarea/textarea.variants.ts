import { cva } from 'class-variance-authority';

export const textareaVariants = cva(
  'border-input placeholder:text-muted-foreground ' +
    'focus-visible:border-ring focus-visible:ring-ring/50 ' +
    'aria-invalid:ring-destructive/20 aria-invalid:border-destructive ' +
    'flex w-full rounded-md border bg-input-background px-3 py-2 ' +
    'transition-[color,box-shadow] outline-none focus-visible:ring-[3px] ' +
    'disabled:cursor-not-allowed disabled:opacity-50 field-sizing-content',
  {
    variants: {
      variant: {
        default: 'bg-input-background resize-none',
        ghost: 'border-transparent bg-transparent focus-visible:bg-input-background resize-none',
        outlined: 'bg-transparent border-sgx-blue focus-visible:ring-sgx-blue resize-none',
        resizable: 'bg-input-background resize-y',
      },
      size: {
        sm: 'min-h-12 text-xs px-2 py-1.5',
        md: 'min-h-16 text-sm md:text-sm',
        lg: 'min-h-24 text-base px-4 py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);
