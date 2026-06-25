import type { ReactNode } from 'react';

interface SurfaceCardProps {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
  bullets: string[];
  cta: string;
  external?: boolean;
}

export function SurfaceCard({ href, icon, title, description, bullets, cta, external }: SurfaceCardProps) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener' : undefined}
      className="group bg-surface border border-border rounded-lg p-6 flex flex-col gap-4 hover:border-fg transition-colors"
    >
      <div className="w-10 h-10 flex items-center justify-center border border-border rounded-md font-mono text-base">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-fg-muted leading-relaxed">{description}</p>
      </div>
      <ul className="space-y-1.5 text-sm text-fg-muted">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className="text-fg-muted mt-1">·</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <span className="text-sm text-accent mt-auto">{cta} →</span>
    </a>
  );
}