import { Container } from '~/components/layout/Container';
import { useT } from '~/i18n/useT';

interface TocItem {
  id: string;
  label: string;
}

export function PrivacyToc({ items }: { items: TocItem[] }) {
  const t = useT();
  return (
    <Container className="mb-12">
      <nav aria-label={t('priv.toc.title')} className="bg-surface border border-border rounded-md p-6">
        <h2 className="font-mono text-xs uppercase tracking-widest text-fg-muted mb-3">{t('priv.toc.title')}</h2>
        <ul className="space-y-2 text-sm">
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