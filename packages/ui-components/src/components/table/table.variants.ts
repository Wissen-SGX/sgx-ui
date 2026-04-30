import { cva } from 'class-variance-authority';

export const tableVariants = cva('w-full caption-bottom', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const tableRowVariants = cva('border-b transition-colors', {
  variants: {
    variant: {
      default: 'hover:bg-muted/50 data-[state=selected]:bg-muted',
      striped: 'odd:bg-muted/20 hover:bg-muted/50 data-[state=selected]:bg-muted',
      highlighted: 'hover:bg-sgx-bg-blue data-[state=selected]:bg-sgx-bg-blue',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const tableHeadVariants = cva(
  'h-10 px-2 text-left align-middle font-medium whitespace-nowrap ' +
    '[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
  {
    variants: {
      variant: {
        default: 'text-foreground',
        primary: 'text-sgx-blue',
        muted: 'text-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export const tableCellVariants = cva(
  'p-2 align-middle whitespace-nowrap ' +
    '[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
  {
    variants: {
      size: {
        sm: 'p-1',
        md: 'p-2',
        lg: 'p-4',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);
