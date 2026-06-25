import { expect, test } from '@playwright/test';

/**
 * Pages rendered by the router. The bare `/` redirects to the default
 * locale (zh-CN) at runtime, but for static analysis we keep it explicit.
 */
const PAGES = [
  { locale: 'zh', page: '/' },
  { locale: 'zh', page: '/landing' },
  { locale: 'zh', page: '/privacy' },
  { locale: 'en', page: '/' },
  { locale: 'en', page: '/landing' },
  { locale: 'en', page: '/privacy' },
];

for (const { locale, page } of PAGES) {
  test(`${locale}${page} 不出现水平滚动`, async ({ page: browser }) => {
    await browser.goto(`/${locale}${page}`);
    const overflow = await browser.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
    await browser.screenshot({
      path: `playwright-report/${locale}${page.replace(/\//g, '_')}.png`,
      fullPage: true,
    });
  });
}
