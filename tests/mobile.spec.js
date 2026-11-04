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
    const aboutTop = () => page.locator('#about').evaluate(el => el.getBoundingClientRect().top + scrollY);
    const beforeEntry = await aboutTop();
    await enter(page);
    expect(Math.abs(await aboutTop() - beforeEntry)).toBeLessThanOrEqual(1);
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

test('browser toolbar sizing keeps the stage and captions stationary and landscape restores normal reading', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/'); await enter(page);
  // Model stable svh with a taller dynamic viewport when browser bars hide.
  await page.addStyleTag({ content: `.journey { --scene-height: 766px !important; --large-viewport-height: 924px; }
    .hero--immersive .hero-stage { min-height: 766px !important; }
    .hero--immersive .hero-layout { min-height: 710px !important; }` });
  await page.locator('#journey').evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY - 78 + (el.offsetHeight - el.querySelector('.journey-stage').clientHeight) * 2.3 / 6, behavior: 'instant' }));
  await expect(page.locator('.journey-stage')).toHaveAttribute('data-chapter', '2');
  await expect(page.locator('.journey-panel').nth(2)).toHaveCSS('opacity', '1');
  const geometry = () => page.locator('#journey').evaluate(el => ({ height: el.offsetHeight,
    stage: el.querySelector('.journey-stage').clientHeight,
    captionTop: el.querySelector('.journey-panel[aria-hidden="false"] h3').getBoundingClientRect().top, y: scrollY }));
  const geometryBefore = await geometry();
  const distance = () => page.locator('#journey').evaluate(el => el.offsetHeight - el.querySelector('.journey-stage').clientHeight);
  const before = await distance();
  await page.setViewportSize({ width: 390, height: 924 });
  await expect.poll(distance).toBe(before);
  const geometryAfter = await geometry();
  expect(Math.abs(geometryAfter.height - geometryBefore.height)).toBeLessThanOrEqual(1);
  expect(Math.abs(geometryAfter.stage - geometryBefore.stage)).toBeLessThanOrEqual(1);
  expect(Math.abs(geometryAfter.captionTop - geometryBefore.captionTop)).toBeLessThanOrEqual(1);
  expect(Math.abs(geometryAfter.y - geometryBefore.y)).toBeLessThanOrEqual(1);
  await expect(page.locator('.journey-stage')).toHaveAttribute('data-chapter', '2');
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

test('portrait browser height changes never toggle between static and pinned reading', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 480 });
  await page.goto('/');
  await enter(page);
  await page.setViewportSize({ width: 390, height: 560 });
  await expect(page.locator('#journey')).toHaveAttribute('data-enhanced', 'true');
  await page.setViewportSize({ width: 390, height: 480 });
  await expect(page.locator('#journey')).toHaveAttribute('data-enhanced', 'true');
});

test('rapid touch swipes keep the active stage pinned and never drift horizontally', async ({ page }) => {
  await page.goto('/'); await enter(page);
  await expect(page.locator('#journey')).toHaveAttribute('data-renderer', 'video');
  await page.evaluate(() => {
    window.sncTouchSamples = [];
    window.sncTouchObserver = () => {
      const section = document.querySelector('#journey');
      const stage = section.querySelector('.journey-stage');
      const header = document.querySelector('.site-header').getBoundingClientRect().height;
      const start = section.getBoundingClientRect().top + scrollY - header;
      const end = start + section.offsetHeight - stage.clientHeight;
      window.sncTouchSamples.push({ x: scrollX, y: scrollY, inRange: scrollY > start + 10 && scrollY < end - 10,
        drift: Math.abs(stage.getBoundingClientRect().top - header) });
    };
    addEventListener('scroll', window.sncTouchObserver, { passive: true });
  });
  const input = await page.context().newCDPSession(page);
  for (const direction of [-1, 1, -1]) {
    const from = direction === -1 ? 700 : 200;
    await input.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 195, y: from }] });
    for (let step = 1; step <= 8; step++) {
      await input.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 195, y: from + direction * 50 * step }] });
      await page.waitForTimeout(16); // Physical gesture sampling, not a readiness wait.
    }
    await input.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.evaluate(() => new Promise(resolve => {
      let quiet;
      const done = () => { removeEventListener('scroll', wait); resolve(); };
      const wait = () => { clearTimeout(quiet); quiet = setTimeout(done, 180); };
      addEventListener('scroll', wait, { passive: true }); wait();
    }));
  }
  const samples = await page.evaluate(() => {
    removeEventListener('scroll', window.sncTouchObserver);
    return window.sncTouchSamples;
  });
  expect(samples.length).toBeGreaterThan(5);
  expect(samples.filter(sample => sample.inRange).length).toBeGreaterThan(5);
  expect(Math.max(...samples.map(sample => Math.abs(sample.x)))).toBe(0);
  expect(Math.max(...samples.filter(sample => sample.inRange).map(sample => sample.drift))).toBeLessThanOrEqual(1);
});

test('film entrance and exit reveal the frame without translating it vertically', async ({ page }) => {
  await page.goto('/'); await enter(page);
  const geometry = await page.locator('#journey').evaluate(el => ({ top: el.getBoundingClientRect().top + scrollY,
    height: el.offsetHeight, stage: el.querySelector('.journey-stage').clientHeight }));
  for (const y of [geometry.top - 78 - 180, geometry.top + geometry.height - geometry.stage - 78 + 180]) {
    await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), y);
    await expect.poll(() => page.locator('.journey-stage').evaluate(el => Math.abs(el.getBoundingClientRect().top - 78))).toBeLessThanOrEqual(1);
    await expect.poll(() => page.locator('.journey-film').evaluate(el => Math.abs(el.getBoundingClientRect().top - 78))).toBeLessThanOrEqual(1);
    await expect(page.locator('.journey-stage')).toHaveCSS('visibility', 'visible');
    await expect(page.locator('.journey-stage')).toHaveAttribute('inert', '');
    expect(await page.locator('.journey-stage').evaluate(el => getComputedStyle(el).clipPath)).not.toBe('none');
  }
  await page.locator('#about').scrollIntoViewIfNeeded();
  await expect(page.locator('#about')).toBeInViewport();
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(page.locator('.journey-stage')).toHaveCSS('visibility', 'hidden');
  await expect(page.locator('.journey-stage')).toHaveAttribute('inert', '');
});
