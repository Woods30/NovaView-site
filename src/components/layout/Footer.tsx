import { Container } from './Container';
import { Logo } from '~/components/brand/Logo';
import { useT } from '~/i18n/useT';
import { localeToUrlLocale, type Locale } from '~/i18n/locales';

export function Footer({ locale }: { locale: Locale }) {
  const t = useT();
  const base = `/${localeToUrlLocale(locale)}`;
  const productLinks = [
    { href: `${base}/landing#formats`, key: 'footer.l.formats' },
    { href: `${base}/landing#features`, key: 'footer.l.features' },
    { href: `${base}/landing#workflow`, key: 'footer.l.workflow' },
    { href: `${base}/landing#download`, key: 'footer.l.download' },
  ];
  const legalLinks = [
    { href: `${base}/privacy`, key: 'footer.l.privacy' },
    { href: `${base}/privacy#data`, key: 'footer.l.data' },
    { href: `${base}/privacy#rights`, key: 'footer.l.rights' },
  ];

  return (
    <footer className="border-t border-border mt-24 py-12">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Logo size="sm" alt={t('brand.logo_alt')} />
              <span className="text-base font-semibold">NovaView</span>
            </div>
            <p className="text-sm text-fg-muted max-w-[36ch]">{t('footer.about')}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">{t('footer.col.product')}</h4>
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
            <h4 className="text-sm font-semibold mb-3">{t('footer.col.legal')}</h4>
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
            <h4 className="text-sm font-semibold mb-3">{t('footer.col.contact')}</h4>
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
