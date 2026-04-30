import * as React from 'react';
import { cn } from '../../utils';
import {
  cardVariants,
  cardHeaderVariants,
  cardContentVariants,
  cardFooterVariants,
} from './card.variants';
import type { CardProps, CardHeaderProps, CardContentProps, CardFooterProps } from './Card.types';

function Card({ className, variant, size, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant, size }), className)}
      {...props}
    />
  );
}

function CardHeader({ className, size, ...props }: CardHeaderProps) {
  return (
    <div
      data-slot="card-header"
      className={cn(cardHeaderVariants({ size }), className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <h4
      data-slot="card-title"
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <p
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  );
}

function CardContent({ className, size, ...props }: CardContentProps) {
  return (
    <div
      data-slot="card-content"
      className={cn(cardContentVariants({ size }), className)}
      {...props}
    />
  );
}

function CardFooter({ className, size, ...props }: CardFooterProps) {
  return (
    <div
      data-slot="card-footer"
      className={cn(cardFooterVariants({ size }), className)}
      {...props}
    />
  );
}

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';
CardAction.displayName = 'CardAction';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';

export { cardVariants, cardHeaderVariants, cardContentVariants, cardFooterVariants };
export { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter };
export default Card;
