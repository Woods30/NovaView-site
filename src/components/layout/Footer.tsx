import { Container } from './Container';
import { Logo } from '~/components/brand/Logo';
import { useT } from '~/i18n/useT';
import { localeToUrlLocale, type Locale } from '~/i18n/locales';
import type { DictionaryKey } from '~/i18n/types';

export function Footer({ locale }: { locale: Locale }) {
  const t = useT();
  const base = `/${localeToUrlLocale(locale)}`;
  const productLinks: { href: string; key: DictionaryKey }[] = [
    { href: `${base}/#formats`, key: 'footer.l.formats' },
    { href: `${base}/#features`, key: 'footer.l.features' },
    { href: `${base}/#workflow`, key: 'footer.l.workflow' },
    { href: `${base}/#download`, key: 'footer.l.download' },
  ];
  const legalLinks: { href: string; key: DictionaryKey }[] = [
    { href: `${base}/privacy`, key: 'footer.l.privacy' },
    { href: `${base}/privacy#data`, key: 'footer.l.data' },
    { href: `${base}/privacy#rights`, key: 'footer.l.rights' },
  ];

  return (
    <footer className="border-t border-border mt-24 py-12">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Logo size={60} alt={t('brand.logo_alt')} />
              <span className="text-lg font-semibold">NovaView</span>
            </div>
            <p
              className="text-sm text-fg-muted max-w-[36ch]"
              dangerouslySetInnerHTML={{ __html: t('footer.about') }}
            />
          </div>
          <div>
            <h2 className="text-sm font-semibold mb-3">{t('footer.col.product')}</h2>
            <ul className="space-y-2 text-sm">
              {productLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-fg-muted hover:text-fg">
                    {t(l.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold mb-3">{t('footer.col.legal')}</h2>
            <ul className="space-y-2 text-sm">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-fg-muted hover:text-fg">
                    {t(l.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold mb-3">{t('footer.col.contact')}</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:hello@novaview.app"
                  className="text-fg-muted hover:text-fg"
                >
                  {t('footer.l.email')}
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Woods30/NovaView"
                  target="_blank"
                  rel="noopener"
                  className="text-fg-muted hover:text-fg"
                >
                  {t('footer.l.github')}
                </a>
              </li>
              <li>
                <span className="text-fg-muted font-mono text-xs">
                  {t('footer.l.version')}
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs text-fg-muted font-mono">
          <span>© 2026 NovaView. All rights reserved.</span>
          <span>landing · v1.4.2 · 2026-06</span>
        </div>
      </Container>
    </footer>
  );
}
