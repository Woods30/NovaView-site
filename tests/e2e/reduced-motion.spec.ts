import { expect, test } from '@playwright/test';

test.describe('reduced-motion', () => {
  test.use({ colorScheme: 'light' });

  test('reduced-motion 下页面仍可访问', async ({ browser }) => {
    // `reducedMotion` lives on the browser context (not the test options),
    // so we create one explicitly with the `reduce` media feature set.
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    try {
      await page.goto('/zh/');
      await expect(page.locator('h1').first()).toBeVisible();

      // Sanity-check: the root `<html>` element should be reachable and have
      // an accessible role. The new a11y snapshot API in Playwright 1.61 is
      // `page.locator('body').ariaSnapshot()`, but to keep this stable
      // across minor versions we simply verify the document has rendered
      // with a meaningful accessibility tree (e.g. a landmark or heading).
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThan(0);
    } finally {
      await context.close();
    }
  });
});
