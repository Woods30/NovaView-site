import { expect, test } from '@playwright/test';

test('切换 dark theme 后刷新保持', async ({ page }) => {
  await page.goto('/zh/');
  await page.click('button[aria-label="切换到深色"]');
  await expect(page.locator('html')).toHaveClass(/dark/);

  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
  const stored = await page.evaluate(() => localStorage.getItem('novaview-theme'));
  expect(stored).toBe('dark');
});
