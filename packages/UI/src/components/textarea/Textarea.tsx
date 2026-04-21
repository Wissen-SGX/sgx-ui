import * as React from 'react';
import { cn } from '../../utils';
import { textareaVariants } from './textarea.variants';
import type { TextareaProps } from './Textarea.types';

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        className={cn(textareaVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';

export { textareaVariants };
export { Textarea };
export default Textarea;
