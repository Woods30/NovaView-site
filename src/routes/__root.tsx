import { Outlet, createRootRouteWithContext, useMatches } from '@tanstack/react-router';
import { I18nProvider } from '~/i18n/provider';
import { ThemeProvider } from '~/components/theme-provider';
import { Topnav } from '~/components/layout/Topnav';
import { Footer } from '~/components/layout/Footer';
import { DEFAULT_LOCALE, type Locale } from '~/i18n/locales';

interface RouterContext {
  locale: Locale;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl mb-2">404</h1>
        <p className="text-fg-muted">Page not found.</p>
      </div>
    </div>
  ),
});

/**
 * The router context only carries the *initial* locale (set by main.tsx).
 * Per-route locale lives on the deepest match's loader data. Fall back
 * to the context (or default) when the route doesn't expose one.
 */
function useActiveLocale(): Locale {
  const ctx = Route.useRouteContext();
  const matches = useMatches();
  const deepest = matches[matches.length - 1];
  const routeLocale = (deepest?.loaderData as { locale?: Locale } | undefined)?.locale;
  return routeLocale ?? ctx.locale ?? DEFAULT_LOCALE;
}

function RootComponent() {
  const locale = useActiveLocale();
  return (
    <ThemeProvider>
      <I18nProvider locale={locale}>
        <div className="min-h-screen flex flex-col bg-bg text-fg">
          <Topnav locale={locale} />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer locale={locale} />
        </div>
      </I18nProvider>
    </ThemeProvider>
  );
}