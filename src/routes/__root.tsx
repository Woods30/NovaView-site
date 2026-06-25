import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { I18nProvider } from '~/i18n/provider';
import { ThemeProvider } from '~/components/theme-provider';
import { Topnav } from '~/components/layout/Topnav';
import { Footer } from '~/components/layout/Footer';
import type { Locale } from '~/i18n/locales';

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

function RootComponent() {
  const { locale } = Route.useRouteContext();
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