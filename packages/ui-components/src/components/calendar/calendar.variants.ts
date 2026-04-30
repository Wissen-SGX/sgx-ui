import { cva } from 'class-variance-authority';

export const calendarVariants = cva('', {
  variants: {
    size: {
      sm: 'p-2',
      md: 'p-3',
      lg: 'p-4',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const calendarDayVariants = cva(
  'size-8 p-0 font-normal aria-selected:opacity-100 rounded-md inline-flex items-center justify-center ' +
    'transition-colors hover:bg-accent hover:text-accent-foreground ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  {
    variants: {
      variant: {
        default: '',
        primary: 'aria-selected:bg-sgx-blue aria-selected:text-white hover:bg-sgx-blue/10',
        ghost: 'hover:bg-transparent hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
