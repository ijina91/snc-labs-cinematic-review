import { test, expect } from '@playwright/test';

test('cold mobile enhancement keeps the headline, CTA and next section stationary', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Cold phone and fold-cover entry');
  await page.addInitScript(() => {
    window.sncEntryCLS = 0;
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.sncEntryCLS += entry.value;
    }).observe({type: 'layout-shift', buffered: true});
  });
  await page.route('**/api.github.com/orgs/snclabs/repos*', route => route.fulfill({ json: [] }));
  for (const [width, height] of [[280, 653], [320, 568], [390, 844]]) {
    await page.setViewportSize({ width, height });
    let release;
    const ready = new Promise(resolve => { release = resolve; });
    await page.route('**/assets/ScrollJourney-*.js', async route => { await ready; await route.continue(); });
    await page.goto('/', { waitUntil: 'domcontentloaded' }); await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('#journey')).not.toHaveAttribute('data-enhanced', 'true');
    const geometry = () => page.evaluate(() => ({
      headline: document.querySelector('h1').getBoundingClientRect().top,
      cta: document.querySelector('.hero-actions').getBoundingClientRect().top,
      about: document.querySelector('#about').getBoundingClientRect().top + scrollY,
      ctaBottom: document.querySelector('.hero-actions').getBoundingClientRect().bottom,
      footerTop: document.querySelector('.journey-bottom').getBoundingClientRect().top,
      headlineRight: document.querySelector('h1').getBoundingClientRect().right,
    }));
    const before = await geometry(); release();
    await expect(page.locator('#journey')).toHaveAttribute('data-enhanced', 'true');
    // Let the initial panel opacity transitions and LayoutShift delivery finish.
    await page.waitForTimeout(400);
    const after = await geometry();
    for (const key of ['headline', 'cta', 'about']) expect.soft(Math.abs(after[key] - before[key]), `${width}px ${key} entry shift`).toBeLessThan(2);
    expect.soft(after.ctaBottom, `${width}px CTA must clear the film footer`).toBeLessThanOrEqual(after.footerTop - 8);
    expect.soft(after.headlineRight, `${width}px headline width`).toBeLessThanOrEqual(width + 1);
    expect.soft(await page.evaluate(() => window.sncEntryCLS), `${width}px cumulative cold-entry layout shift`).toBeLessThan(.1);
    await page.unroute('**/assets/ScrollJourney-*.js');
  }
});
