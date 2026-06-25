import { expect, test } from '@playwright/test';

test('首页 hash 锚点滚动到 #formats', async ({ page }) => {
  // Navigate directly with the hash so the browser performs the
  // in-page scroll. The Topnav link itself uses the internal `zh-CN`
  // form (a known issue tracked separately) so clicking it routes to
  // `/zh-CN/#formats`, which the `$locale` route does not match.
  await page.goto('/zh/#formats');
  await page.waitForTimeout(500);
  const scrollY = await page.evaluate(() => window.scrollY);
  expect(scrollY).toBeGreaterThan(100);
});
