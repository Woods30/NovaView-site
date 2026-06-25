import { Container } from '~/components/layout/Container';

interface TocItem {
  id: string;
  label: string;
}

export function PrivacyToc({ items }: { items: TocItem[] }) {
  return (
    <Container className="mb-12">
      <nav className="bg-surface border border-border rounded-md p-6">
        <h2 className="font-mono text-xs uppercase tracking-widest text-fg-muted mb-3">Table of Contents</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {items.map((it) => (
            <li key={it.id}>
              <a href={`#${it.id}`} className="text-fg-muted hover:text-accent">
                → {it.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  );
}