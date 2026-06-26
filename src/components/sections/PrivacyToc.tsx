import { Container } from '~/components/layout/Container';
import { cn } from '~/lib/cn';
import { useT } from '~/i18n/useT';

interface TocItem {
  id: string;
  label: string;
}

interface PrivacyTocProps {
  items: TocItem[];
  /** Width of the TOC card. Defaults to 720px to match the privacy page's
   *  main content column (hero + sections). Pass a wider value if you ever
   *  embed the TOC on a non-privacy page. */
  width?: 'narrow' | 'wide';
}

export function PrivacyToc({ items, width = 'narrow' }: PrivacyTocProps) {
  const t = useT();
  return (
    <Container className={cn('mb-12', width === 'narrow' && 'max-w-[720px]')}>
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
