import { test, expect } from '@playwright/test';

test('the first scroll stays pinned even when optional entry modules arrive late', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.route('**/api.github.com/orgs/snclabs/repos*', route => route.fulfill({ json: [] }));
  let release;
  const pending = new Promise(resolve => { release = resolve; });
  await page.route(/\/assets\/(?:ScrollJourney|CinematicExperience)-[^/]+\.js$/, async route => { await pending; await route.continue(); });
  try {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => {
      window.entryPositions = []; window.entryRecording = true;
      const tick = () => {
        window.entryPositions.push({ stage: document.querySelector('.journey-stage').getBoundingClientRect().top,
          headline: document.querySelector('.hero-line').getBoundingClientRect().top,
          display: document.querySelector('.hero-display').getBoundingClientRect().top });
        if (window.entryRecording) requestAnimationFrame(tick);
      }; tick();
    });
    await page.mouse.wheel(0, 40);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
    release();
    await expect(page.locator('#journey')).toHaveAttribute('data-enhanced', 'true');
    // Observe the full former entry timeline, not only a final settled frame.
    await page.evaluate(() => new Promise(resolve => {
      let frames = 0; const tick = () => ++frames > 70 ? resolve() : requestAnimationFrame(tick); tick();
    }));
    const drift = await page.evaluate(() => {
      window.entryRecording = false;
      return Object.fromEntries(['stage','headline','display'].map(key => [key,
        Math.max(...window.entryPositions.map(p => p[key])) - Math.min(...window.entryPositions.map(p => p[key]))]));
    });
    await test.info().attach('first-scroll-drift.json', { body: JSON.stringify(drift), contentType: 'application/json' });
    for (const [key, value] of Object.entries(drift)) expect(value, `${key} must not drop after the first scroll`).toBeLessThanOrEqual(1.5);
  } finally { release(); }
});

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
    await page.route('**/assets/*.js', async route => { await ready; await route.continue(); });
    await page.goto('/', { waitUntil: 'commit' });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
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
    await page.unroute('**/assets/*.js');
  }
});
