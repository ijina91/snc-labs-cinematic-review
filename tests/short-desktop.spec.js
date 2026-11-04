import { test, expect } from '@playwright/test';

test('short desktop windows preserve first layout and restore ordinary reading when space is limited', async ({ page }, info) => {
  test.skip(info.project.name !== '1440', 'Desktop height regression');
  await page.route('**/api.github.com/orgs/snclabs/repos*', route => route.fulfill({ json: [] }));
  await page.setViewportSize({ width: 1280, height: 720 });
  let release;
  const ready = new Promise(resolve => { release = resolve; });
  await page.route('**/assets/*.js', async route => { await ready; await route.continue(); });
  await page.goto('/', { waitUntil: 'commit' });
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  const aboutTop = () => page.locator('#about').evaluate(el => el.getBoundingClientRect().top + scrollY);
  const before = await aboutTop(); release();
  await expect(page.locator('#journey')).toHaveAttribute('data-enhanced', 'true');
  expect(Math.abs(await aboutTop() - before)).toBeLessThan(2);
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
  await page.setViewportSize({ width: 1920, height: 600 });
  await expect(page.locator('#journey')).not.toHaveAttribute('data-enhanced', 'true');
  await expect(page.locator('.journey-panel[aria-hidden="true"]')).toHaveCount(0);
  await expect(page.locator('.journey-film')).not.toHaveAttribute('src');
  await page.locator('.journey-panel').last().locator('h2').scrollIntoViewIfNeeded();
  await expect(page.locator('.journey-panel').last().locator('h2')).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
