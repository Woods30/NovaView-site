import { Link } from '@tanstack/react-router';
import { Menu } from 'lucide-react';
import { Container } from './Container';
import { LangSwitch } from './LangSwitch';
import { ThemeToggle } from './ThemeToggle';
import { Logo } from '~/components/brand/Logo';
import { useT } from '~/i18n/useT';
import { localeToUrlLocale, type Locale } from '~/i18n/locales';
import type { DictionaryKey } from '~/i18n/types';
import { Button } from '~/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet';

interface TopnavProps {
  locale: Locale;
}

export function Topnav({ locale }: TopnavProps) {
  const t = useT();
  const urlLocale = localeToUrlLocale(locale);
  const navLinks: { href: string; key: DictionaryKey; external?: boolean }[] = [
    { href: `/${urlLocale}/#formats`, key: 'nav.formats' },
    { href: `/${urlLocale}/#privacy`, key: 'nav.privacy' },
    { href: `/${urlLocale}/#features`, key: 'nav.features' },
    { href: `/${urlLocale}/#workflow`, key: 'nav.workflow' },
    { href: 'https://github.com/Woods30/NovaView', key: 'nav.github', external: true },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-md">
      <Container className="flex h-[68px] items-center justify-between gap-4">
        <Link
          to={'/$locale' as never}
          params={{ locale: urlLocale } as never}
          className="flex items-center gap-3 text-fg font-semibold"
        >
          <Logo size={60} alt={t('brand.logo_alt')} />
          <span className="text-base leading-tight">
            NovaView
            <small className="block text-[11px] font-normal text-fg-muted uppercase tracking-wide">
              {t('brand.tagline')}
            </small>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target={l.external ? '_blank' : undefined}
              rel={l.external ? 'noopener' : undefined}
              className="text-fg/80 hover:text-accent"
            >
              {t(l.key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitch currentLocale={locale} />
          <ThemeToggle />
          <Button
            asChild
            size="sm"
            variant="secondary"
            className="hidden sm:inline-flex"
          >
            <a href={`/${urlLocale}/#download`}>{t('nav.download')}</a>
          </Button>
          <Sheet>
            <SheetTrigger aria-label="Open menu" className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-border">
              <Menu size={16} />
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col gap-4">
                {navLinks.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target={l.external ? '_blank' : undefined}
                    className="text-fg"
                  >
                    {t(l.key)}
                  </a>
                ))}
                <a
                  href={`/${urlLocale}/#download`}
                  className="text-accent font-medium"
                >
                  {t('nav.download')}
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
