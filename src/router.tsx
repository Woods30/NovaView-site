import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import type { Locale } from './i18n/locales';

export const router = createRouter({
  routeTree,
  context: { locale: 'zh-CN' as Locale },
  defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
