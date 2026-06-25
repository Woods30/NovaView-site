import * as RadixSeparator from '@radix-ui/react-separator';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '~/lib/cn';

export const Separator = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof RadixSeparator.Root>
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
  <RadixSeparator.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      'bg-border',
      orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
      className,
    )}
    {...props}
  />
));
Separator.displayName = 'Separator';