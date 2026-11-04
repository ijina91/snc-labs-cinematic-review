import { test, expect } from '@playwright/test';

test.skip(({ isMobile }) => !isMobile, 'Phone-specific viewport and orientation cases');
test.beforeEach(async ({ page }) => {
  await page.route('**/api.github.com/orgs/snclabs/repos*', route => route.fulfill({ json: [] }));
});

async function enter(page) {
  await page.locator('#journey').evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY - 78, behavior: 'instant' }));
  await expect(page.locator('#journey')).toHaveAttribute('data-enhanced', 'true');
}

test('small phones fit the hero and keep captions readable at scroll boundaries', async ({ page }) => {
  test.setTimeout(90000);
  for (const [width, height] of [[320, 568], [360, 640], [390, 844]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const heroHeight = await page.locator('.hero').evaluate(el => el.clientHeight + document.querySelector('.site-header').clientHeight);
    expect(heroHeight).toBeLessThanOrEqual(height + 1);
    await enter(page);
    for (let index = 0; index < 6; index++) {
      // A paused gesture near the old fade-out boundary must still show copy.
      await page.locator('#journey').evaluate((el, i) => {
        const span = el.offsetHeight - el.querySelector('.journey-stage').clientHeight;
        scrollTo({ top: el.getBoundingClientRect().top + scrollY - 78 + span * ((i + .98) / 6), behavior: 'instant' });
      }, index);
      await expect(page.locator('.journey-stage')).toHaveAttribute('data-chapter', String(index));
      const panel = page.locator('.journey-panel').nth(index);
      await expect(panel).toHaveCSS('opacity', '1');
      const fits = await panel.evaluate(el => {
        const stage = el.closest('.journey-stage');
        const top = el.querySelector('.journey-label').getBoundingClientRect().top;
        const bottom = el.querySelector('.journey-description').getBoundingClientRect().bottom;
        const hud = stage.querySelector('.journey-top').getBoundingClientRect().bottom;
        const footer = stage.querySelector('.journey-bottom').getBoundingClientRect().top;
        const range = document.createRange(); range.selectNodeContents(el.querySelector('h3'));
        return { top: top >= hud + 8, bottom: bottom <= footer - 8,
          width: [...range.getClientRects()].every(r => r.left >= 0 && r.right <= innerWidth + 1) };
      });
      expect(fits).toEqual({ top: true, bottom: true, width: true });
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  }
});

test('browser toolbar sizing keeps scroll distance stable and landscape restores normal reading', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/'); await enter(page);
  // Model stable svh with a taller dynamic viewport when browser bars hide.
  await page.addStyleTag({ content: '.journey { --scene-height: 766px !important; }' });
  const distance = () => page.locator('#journey').evaluate(el => el.offsetHeight - el.querySelector('.journey-stage').clientHeight);
  const before = await distance();
  await page.setViewportSize({ width: 390, height: 924 });
  await expect.poll(distance).toBe(before);
  expect(await page.locator('.journey-stage').evaluate(el => el.clientHeight)).toBe(846);
  await page.setViewportSize({ width: 844, height: 390 });
  await expect(page.locator('#journey')).not.toHaveAttribute('data-enhanced', 'true');
  await expect(page.locator('.journey-panel[aria-hidden="true"]')).toHaveCount(0);
  await expect(page.locator('.journey-film')).not.toHaveAttribute('src');
  const last = page.locator('.journey-panel').last().locator('h3');
  await last.scrollIntoViewIfNeeded(); await expect(last).toBeInViewport();
  await page.setViewportSize({ width: 390, height: 844 });
  await enter(page);
  await expect(page.locator('#journey')).toHaveAttribute('data-renderer', 'video');
});
