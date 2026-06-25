import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { forwardRef, type ComponentPropsWithoutRef, type HTMLAttributes } from 'react';
import { cn } from '~/lib/cn';

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;

export const SheetContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof Dialog.Content> & { side?: 'right' | 'left' }
>(({ className, side = 'right', children, ...props }, ref) => (
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 z-50 bg-fg/40 data-[state=open]:animate-in data-[state=open]:fade-in" />
    <Dialog.Content
      ref={ref}
      className={cn(
        'fixed z-50 top-0 h-full w-3/4 max-w-sm bg-surface border-l border-border p-6 shadow-xl',
        side === 'right' ? 'right-0' : 'left-0 border-l-0 border-r',
        className,
      )}
      {...props}
    >
      {children}
      <Dialog.Close className="absolute right-4 top-4 text-fg-muted hover:text-fg">
        <X size={18} />
        <span className="sr-only">Close</span>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
));
SheetContent.displayName = 'SheetContent';

export const SheetTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => <h2 ref={ref} className={cn('text-lg font-semibold mb-4', className)} {...props} />,
);
SheetTitle.displayName = 'SheetTitle';