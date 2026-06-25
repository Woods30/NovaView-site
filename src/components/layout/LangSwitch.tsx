import { Link, useRouterState } from '@tanstack/react-router';
import { cn } from '~/lib/cn';
import { localeToUrlLocale, type Locale } from '~/i18n/locales';

interface LangSwitchProps {
  currentLocale: Locale;
}

export function LangSwitch({ currentLocale }: LangSwitchProps) {
  const { location } = useRouterState();
  // Replace the leading locale segment of the current path with the target
  // locale, preserving the rest of the path so deep links survive a switch.
  const segments = location.pathname.split('/').filter(Boolean);
  const rest = segments.slice(1).join('/');

  // Persist the user's explicit choice to localStorage so subsequent visits
  // (and detect-client.ts) can read it back. We only write on explicit click,
  // not on mount — silent writes would clobber any saved preference just by
  // rendering the component.
  const persistLocale = (target: Locale) => {
    try {
      localStorage.setItem('novaview-locale', target);
    } catch {
      // Storage may be disabled (Safari private mode, quota, etc.) — the
      // URL still updates, so the user lands on the right page; we just
      // can't remember the choice across sessions.
    }
  };

  return (
    <div className="inline-flex items-center gap-1 rounded-pill border border-border bg-surface p-1">
      {(['zh-CN', 'en'] as const).map((loc) => (
        <Link
          key={loc}
          onClick={() => persistLocale(loc)}
          // The router is rewritten in Task 10 with a typed `$locale` route;
          // until then cast through `never` to keep strict TS happy without
          // sacrificing the runtime path. Use the URL form (zh / en) so the
          // static <a href> fallback also routes to a real page — important
          // for right-click "open in new tab" and SSR snapshots.
          to={`/${localeToUrlLocale(loc)}${rest ? '/' + rest : ''}` as never}
          params={{ locale: localeToUrlLocale(loc) } as never}
          className={cn(
            'rounded-pill px-2.5 py-1 text-xs font-medium transition-colors',
            loc === currentLocale ? 'bg-fg text-bg' : 'text-fg-muted hover:text-fg',
          )}
        >
          {loc === 'zh-CN' ? '中' : 'EN'}
        </Link>
      ))}
    </div>
  );
}