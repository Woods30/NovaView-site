import { Badge } from '~/components/ui/badge';

interface UseCaseCardProps {
  tag: string;
  title: string;
  description: string;
  quote: string;
}

export function UseCaseCard({ tag, title, description, quote }: UseCaseCardProps) {
  return (
    <article className="bg-surface border border-border rounded-md p-6 flex flex-col gap-3">
      <Badge variant="mono">{tag}</Badge>
      <h3 className="text-lg font-semibold mt-1">{title}</h3>
      <p className="text-sm text-fg-muted leading-relaxed">{description}</p>
      <blockquote className="mt-2 pt-4 border-t border-border text-sm italic text-fg-muted">"{quote}"</blockquote>
    </article>
  );
}