import type { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <article className="bg-surface border border-border rounded-md p-6 flex flex-col gap-3 transition-colors hover:border-fg">
      <div className="text-2xl text-fg-muted w-10 h-10 flex items-center justify-center border border-border rounded-md bg-bg/50">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-fg-muted leading-relaxed">{description}</p>
    </article>
  );
}