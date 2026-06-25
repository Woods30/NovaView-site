import { expect, test } from '@playwright/test';

test('zh → en 切换', async ({ page }) => {
  await page.goto('/zh/');
  await expect(page.locator('h1')).toContainText('手机上阅读');

  await page.click('text=EN');
  await expect(page).toHaveURL(/\/en\//);
  await expect(page.locator('h1')).toContainText('AI');

  // LangSwitch persists the explicit choice so detect-client.ts can
  // read it back on subsequent visits. The value is the internal Locale
  // form ('zh-CN' / 'en'), not the URL form ('zh' / 'en').
  const stored = await page.evaluate(() => localStorage.getItem('novaview-locale'));
  expect(stored).toBe('en');
});
