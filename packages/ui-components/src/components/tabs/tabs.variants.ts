import { cva } from 'class-variance-authority';

export const tabsVariants = cva('flex flex-col', {
  variants: {
    gap: {
      sm: 'gap-1',
      md: 'gap-2',
      lg: 'gap-4',
    },
  },
  defaultVariants: {
    gap: 'md',
  },
});

export const tabsListVariants = cva('inline-flex w-fit items-center justify-center', {
  variants: {
    variant: {
      default: 'bg-muted text-muted-foreground h-9 rounded-xl p-[3px]',
      underline: 'border-b border-border rounded-none p-0 bg-transparent h-auto gap-0',
      pills: 'bg-transparent gap-1 p-0 h-auto',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-sm font-medium ' +
    'transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 ' +
    'focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none ' +
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
  {
    variants: {
      variant: {
        default:
          'data-[state=active]:bg-card data-[state=active]:text-foreground ' +
          'text-foreground h-[calc(100%-1px)] flex-1 rounded-xl border border-transparent px-2 py-1',
        underline:
          'data-[state=active]:border-b-2 data-[state=active]:border-sgx-blue ' +
          'data-[state=active]:text-sgx-blue text-muted-foreground ' +
          'rounded-none border-b-2 border-transparent px-4 py-2',
        pills:
          'data-[state=active]:bg-sgx-blue data-[state=active]:text-white ' +
          'text-foreground rounded-lg px-4 py-1.5 hover:bg-muted',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export const tabsContentVariants = cva('flex-1 outline-none', {
  variants: {},
  defaultVariants: {},
});
