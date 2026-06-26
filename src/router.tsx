import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import type { Locale } from './i18n/locales';

export const router = createRouter({
  routeTree,
  context: { locale: 'zh-CN' as Locale },
  defaultPreload: 'intent',
  // Keep trailing slashes on every URL the router builds. The route id
  // `/$locale/` and the prerendered HTML at `/<lang>/index.html` both
  // expect the slash; without it the SPA shell is served instead of the
  // locale-specific page (which broke the i18n-switch E2E).
  trailingSlash: 'always',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
