import { expect, test } from '@playwright/test';

test('下载链接 href 正确', async ({ page }) => {
  await page.goto('/zh/#download');
  const iosHref = await page.locator('a:has-text("App Store 下载")').first().getAttribute('href');
  expect(iosHref).toContain('apps.apple.com/app/novaview');

  const androidHref = await page
    .locator('a:has-text("Google Play 下载")')
    .first()
    .getAttribute('href');
  expect(androidHref).toContain('play.google.com');

  const apkHref = await page.locator('a:has-text("APK 直装")').first().getAttribute('href');
  expect(apkHref).toContain('github.com/Woods30/NovaView/releases');

  const githubHref = await page
    .locator('a[href*="github.com/Woods30/NovaView"]')
    .first()
    .getAttribute('href');
  expect(githubHref).toBe('https://github.com/Woods30/NovaView');
});
