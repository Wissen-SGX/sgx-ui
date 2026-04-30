import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../utils';
import { buttonVariants } from './button.variants';
import { ButtonProps } from './Button.types';

const spinner = (
  <svg
    className="animate-spin size-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      color,
      size,
      radius,
      asChild = false,
      fullWidth = false,
      isLoading = false,
      spinnerPlacement = 'start',
      startContent,
      endContent,
      disabled,
      disableOnLoading = false,
      type = 'button',
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const activeVariant = variant ?? color ?? 'primary';
    const computedDisabled = disableOnLoading ? disabled || isLoading : disabled;

    return (
      <Comp
        ref={ref}
        data-slot="button"
        type={asChild ? undefined : type}
        className={cn(
          buttonVariants({ variant: activeVariant, size, radius }),
          fullWidth && 'w-full',
          isLoading && 'opacity-80 cursor-wait',
          className
        )}
        disabled={computedDisabled}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {isLoading && spinnerPlacement === 'start' && spinner}
        {!isLoading && startContent}
        {children}
        {isLoading && spinnerPlacement === 'end' && spinner}
        {!isLoading && endContent}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { buttonVariants };
export default Button;
