import { cva } from 'class-variance-authority';

export const selectTriggerVariants = cva(
  'border-input data-[placeholder]:text-muted-foreground ' +
    "[&_svg:not([class*='text-'])]:text-muted-foreground " +
    'focus-visible:border-ring focus-visible:ring-ring/50 ' +
    'aria-invalid:ring-destructive/20 aria-invalid:border-destructive ' +
    'flex w-full items-center justify-between gap-2 rounded-md border bg-input-background ' +
    'px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none ' +
    'focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 ' +
    '*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex ' +
    '*:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 ' +
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      size: {
        sm: 'h-8 text-xs',
        default: 'h-9 text-sm',
        lg: 'h-11 text-base',
      },
      variant: {
        default: 'bg-input-background',
        ghost: 'border-transparent bg-transparent focus-visible:bg-input-background',
        outlined: 'bg-transparent border-sgx-blue focus-visible:ring-sgx-blue',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
);

export const selectContentVariants = cva(
  'bg-popover text-popover-foreground ' +
    'data-[state=open]:animate-in data-[state=closed]:animate-out ' +
    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 ' +
    'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 ' +
    'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 ' +
    'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ' +
    'relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] ' +
    'origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md',
  {
    variants: {},
    defaultVariants: {},
  }
);

export const selectItemVariants = cva(
  "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground " +
    'relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 ' +
    'text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ' +
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {},
    defaultVariants: {},
  }
);
