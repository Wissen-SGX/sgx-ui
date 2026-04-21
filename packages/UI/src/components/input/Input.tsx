import * as React from 'react';
import { cn } from '../../utils';
import { inputVariants } from './input.variants';
import type { InputProps } from './Input.types';

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, size, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(inputVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';

export { inputVariants };
export { Input };
export default Input;
