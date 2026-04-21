import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '../../utils';
import { labelVariants } from './label.variants';
import type { LabelProps } from './Label.types';

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, variant, size, ...props }, ref) => {
  return (
    <LabelPrimitive.Root
      ref={ref}
      data-slot="label"
      className={cn(labelVariants({ variant, size }), className)}
      {...props}
    />
  );
});

Label.displayName = 'Label';

export { labelVariants };
export { Label };
export default Label;
