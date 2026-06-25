import { forwardRef, type ElementType, type HTMLAttributes } from 'react';
import { cn } from '~/lib/cn';

export const Container = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { as?: ElementType }>(
  ({ className, as: Comp = 'div', ...props }, ref) => (
    <Comp
      ref={ref}
      className={cn('mx-auto w-full max-w-[1200px] px-4 lg:px-6', className)}
      {...props}
    />
  ),
);
Container.displayName = 'Container';
