import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from '~/lib/cn';

const badgeVariants = cva('inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-medium', {
  variants: {
    variant: {
      default: 'bg-fg/5 text-fg',
      success: 'bg-success/10 text-success',
      accent: 'bg-accent/10 text-accent',
      mono: 'bg-fg/5 text-fg-muted font-mono',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };