import { Link, useRouterState } from '@tanstack/react-router';
import { cn } from '~/lib/cn';
import type { Locale } from '~/i18n/locales';

interface LangSwitchProps {
  currentLocale: Locale;
}

export function LangSwitch({ currentLocale }: LangSwitchProps) {
  const { location } = useRouterState();
  // Replace the leading locale segment of the current path with the target
  // locale, preserving the rest of the path so deep links survive a switch.
  const segments = location.pathname.split('/').filter(Boolean);
  const rest = segments.slice(1).join('/');

  return (
    <div className="inline-flex items-center gap-1 rounded-pill border border-border bg-surface p-1">
      {(['zh-CN', 'en'] as const).map((loc) => (
        <Link
          key={loc}
          // The router is rewritten in Task 10 with a typed `$locale` route;
          // until then cast through `never` to keep strict TS happy without
          // sacrificing the runtime path.
          to={`/${loc}${rest ? '/' + rest : ''}` as never}
          params={{ locale: loc } as never}
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
