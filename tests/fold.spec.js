import { test, expect } from '@playwright/test';

test.skip(({ isMobile }) => !isMobile, 'Touch/fold viewport scenarios');
test.beforeEach(async ({ page }) => {
  await page.route('**/api.github.com/orgs/snclabs/repos*', route => route.fulfill({ json: [] }));
});
async function enter(page) {
  await page.locator('#journey').evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY - document.querySelector('.site-header').getBoundingClientRect().height, behavior: 'instant' }));
  await expect(page.locator('#journey')).toHaveAttribute('data-enhanced', 'true');
}

test('a stale fixed frame cannot paint over the next section', async ({ page }) => {
  await page.goto('/'); await enter(page);
  await page.locator('#about').evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY + 20, behavior: 'instant' }));
  await expect(page.locator('.journey-stage')).toHaveCSS('visibility', 'hidden');
  // Model a compositor scroll reaching the next section before JS updates
  // the previous visible mask. Parent clipping must remain a hard boundary.
  await page.addStyleTag({ content: '.journey-stage { visibility: visible !important; clip-path: none !important; }' });
  await page.locator('.journey-stage').evaluate(el => { el.inert = false; });
  expect(await page.evaluate(() => !!document.elementFromPoint(innerWidth / 2, innerHeight - 30)?.closest('.journey-stage'))).toBe(false);
});

test('completed film has no extra large-viewport tail to scroll through', async ({ page }) => {
  await page.goto('/');
  await page.addStyleTag({ content: '.journey { --scene-height: 766px !important; --large-viewport-height: 924px; }' });
  await enter(page);
  await page.locator('#journey').evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY - 78 + 3 * 766, behavior: 'instant' }));
  await expect(page.locator('.journey-stage')).toHaveAttribute('data-chapter', '5');
  expect(await page.locator('#about').evaluate(el => el.getBoundingClientRect().top)).toBeLessThanOrEqual(845);
  await expect(page.locator('.journey-stage')).not.toHaveAttribute('inert');
});

test('fold cover, unfolded screens and rotation preserve the current scene', async ({ page }) => {
  test.setTimeout(90000);
  await page.setViewportSize({ width: 344, height: 882 });
  await page.goto('/'); await page.evaluate(() => document.fonts.ready); await enter(page);
  await page.locator('#journey').evaluate(el => {
    const span = el.offsetHeight - el.querySelector('.journey-panels').clientHeight;
    scrollTo({ top: el.getBoundingClientRect().top + scrollY - 78 + span * 2.3 / 6, behavior: 'instant' });
  });
  await expect(page.locator('.journey-stage')).toHaveAttribute('data-chapter', '2');
  for (const [width, height] of [[690, 829], [829, 690], [768, 1024], [1024, 768], [344, 882], [280, 653]]) {
    await page.setViewportSize({ width, height });
    await expect(page.locator('.journey-stage')).toHaveCSS('position', 'fixed');
    await expect(page.locator('.journey-stage')).toHaveAttribute('data-chapter', '2');
    await expect.poll(async () => Math.abs(Number(await page.locator('#journey').getAttribute('data-scene-position')) - 2)).toBeLessThan(.01);
    // Sample subsequent paint frames too: a delayed smooth restoration can
    // begin after the first correct scene has already satisfied the assertion.
    const delayedDrift = await page.locator('#journey').evaluate(el => new Promise(resolve => {
      let remaining = 18, maximum = 0;
      const sample = () => {
        maximum = Math.max(maximum, Math.abs(Number(el.dataset.scenePosition) - 2));
        if (--remaining) requestAnimationFrame(sample); else resolve(maximum);
      };
      requestAnimationFrame(sample);
    }));
    expect(delayedDrift).toBeLessThan(.01);
    const fits = await page.locator('.journey-panel').nth(2).evaluate(el => {
      const r = el.querySelector('h3').getBoundingClientRect();
      const bottom = el.querySelector('.journey-description').getBoundingClientRect().bottom;
      const stage = el.closest('.journey-stage');
      return r.left >= 0 && r.right <= innerWidth + 1 && r.top > stage.querySelector('.journey-top').getBoundingClientRect().bottom && bottom < stage.querySelector('.journey-bottom').getBoundingClientRect().top;
    });
    expect(fits).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator('.hero-actions').evaluate(el => [...el.querySelectorAll('a')].every(a => a.getBoundingClientRect().left >= 0 && a.getBoundingClientRect().right <= innerWidth + 1))).toBe(true);
    expect(await page.locator('.hero').evaluate(el => el.clientHeight + document.querySelector('.site-header').clientHeight)).toBeLessThanOrEqual(height + 1);
  }
  await page.locator('#contact').scrollIntoViewIfNeeded();
  for (const [width, height] of [[690, 829], [1024, 768], [344, 882]]) {
    await page.setViewportSize({ width, height });
    expect(await page.evaluate(() => !!document.elementFromPoint(innerWidth / 2, innerHeight - 30)?.closest('.journey-stage'))).toBe(false);
  }
});
