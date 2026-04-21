import { cva } from 'class-variance-authority';

export const paginationLinkVariants = cva(
  'inline-flex items-center justify-center gap-1 rounded-md text-sm font-medium transition-colors ' +
    'disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      isActive: {
        true: 'border bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
        false: 'hover:bg-accent hover:text-accent-foreground bg-transparent',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3',
        lg: 'h-10 px-6',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      isActive: false,
      size: 'icon',
    },
  },
);
