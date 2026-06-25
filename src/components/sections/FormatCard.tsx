import { Badge } from '~/components/ui/badge';

interface FormatCardProps {
  ext: string;
  title: string;
  description: string;
  features: string[];
}

export function FormatCard({ ext, title, description, features }: FormatCardProps) {
  return (
    <article className="bg-surface border border-border rounded-md p-5 flex flex-col gap-2.5 transition-all hover:border-fg hover:-translate-y-0.5">
      <span className="font-mono text-xs text-accent bg-accent/10 px-2 py-1 rounded self-start">{ext}</span>
      <h3 className="text-lg font-semibold mt-1.5">{title}</h3>
      <p className="text-sm text-fg-muted leading-relaxed">{description}</p>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {features.map((f) => (
          <Badge key={f} variant="default" className="text-[11.5px]">{f}</Badge>
        ))}
      </div>
    </article>
  );
}