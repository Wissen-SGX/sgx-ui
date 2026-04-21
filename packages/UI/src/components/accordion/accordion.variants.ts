import { cva } from 'class-variance-authority';

export const accordionItemVariants = cva('', {
  variants: {
    variant: {
      default: 'border-b last:border-b-0',
      bordered: 'border rounded-lg mb-2 last:mb-0 px-4',
      ghost: 'mb-1 last:mb-0',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const accordionTriggerVariants = cva(
  'focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md text-left font-medium transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180',
  {
    variants: {
      variant: {
        default: 'py-4 text-sm hover:underline',
        bordered: 'py-3 text-sm hover:text-sgx-blue',
        ghost: 'py-3 px-3 text-sm rounded-md hover:bg-sgx-bg-blue hover:text-sgx-blue',
      },
      size: {
        sm: 'text-xs py-2',
        md: 'text-sm py-3',
        lg: 'text-base py-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export const accordionContentVariants = cva(
  'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden',
  {
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
  }
);
