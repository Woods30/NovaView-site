import type { ReactNode } from 'react';
import { Button } from '~/components/ui/button';

interface PlatformCardProps {
  badge: string;
  title: string;
  sub: string;
  cta: { label: string; href: string; icon: ReactNode };
  secondary?: { label: string; href: string; icon: ReactNode };
}

export function PlatformCard({ badge, title, sub, cta, secondary }: PlatformCardProps) {
  return (
    <article className="bg-surface border border-border rounded-lg p-6 lg:p-8 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <span className="inline-flex items-center justify-center px-3 py-1 bg-bg border border-border rounded-md font-mono text-xs text-fg-muted">
          {badge}
        </span>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-fg-muted">{sub}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-2">
        <Button asChild size="lg">
          <a href={cta.href} target="_blank" rel="noopener">
            {cta.icon} {cta.label}
          </a>
        </Button>
        {secondary && (
          <a href={secondary.href} target="_blank" rel="noopener" className="flex items-center gap-2 text-sm text-fg-muted hover:text-fg">
            {secondary.icon} {secondary.label}
          </a>
        )}
      </div>
    </article>
  );
}