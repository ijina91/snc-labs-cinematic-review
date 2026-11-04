import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/api.github.com/orgs/snclabs/repos*', route => route.fulfill({ json: [] }));
  await page.addInitScript(() => Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 }));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
});

test('the opening moves briefly then native scrolling takes over the same muted player', async ({ page }) => {
  await page.addInitScript(() => {
    window.sncPlayingEvents = 0;
    document.addEventListener('playing', event => { if (event.target.matches?.('.journey-film')) window.sncPlayingEvents++; }, true);
  });
  await page.goto('/');
  const video = page.locator('.journey-film');
  await expect.poll(() => page.evaluate(() => window.sncPlayingEvents)).toBe(1);
  await expect(video).toHaveAttribute('data-playback', 'scroll');
  const opening = await video.evaluate(el => ({ time: el.currentTime, paused: el.paused, muted: el.muted, loop: el.loop, source: el.getAttribute('src') }));
  expect(opening.time).toBeGreaterThan(.8); expect(opening.time).toBeLessThan(1.3);
  expect(opening).toMatchObject({ paused: true, muted: true, loop: false });
  const visit = async index => {
    await page.locator('#journey').evaluate((el, chapter) => {
      const header = document.querySelector('.site-header').clientHeight;
      const span = el.offsetHeight - el.querySelector('.journey-panels').clientHeight;
      scrollTo({ top: el.getBoundingClientRect().top + scrollY - header + span * (chapter + .3) / 7, behavior: 'instant' });
    }, index);
    await expect(page.locator('.journey-stage')).toHaveAttribute('data-chapter', String(index));
    await expect.poll(() => video.evaluate((el, chapter) => Math.abs(el.currentTime - (el.duration - .08) * chapter / 7), index)).toBeLessThan(.12);
  };
  await visit(3); await visit(1);
  await expect(video).toHaveAttribute('src', opening.source);
  expect(await page.evaluate(() => window.sncPlayingEvents)).toBe(1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(video).not.toHaveAttribute('src');
  await expect(page.locator('.journey-panel[aria-hidden="true"]')).toHaveCount(0);
});

test('a film arriving midway through the story reveals the requested frame without a frame-zero flash', async ({ page }) => {
  let release;
  const ready = new Promise(resolve => { release = resolve; });
  await page.route('**/assets/media/snc-blue-glass-v2*.mp4', async route => { await ready; await route.continue(); });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#journey')).toHaveAttribute('data-enhanced', 'true');
  await page.locator('#journey').evaluate(el => {
    const header = document.querySelector('.site-header').clientHeight;
    const span = el.offsetHeight - el.querySelector('.journey-panels').clientHeight;
    scrollTo({ top: el.getBoundingClientRect().top + scrollY - header + span * 4.3 / 7, behavior: 'instant' });
  });
  await expect(page.locator('.journey-stage')).toHaveAttribute('data-chapter', '4');
  await expect(page.locator('#journey')).toHaveAttribute('data-renderer', 'poster');
  await page.locator('#journey').evaluate(el => {
    window.sncFirstRevealedTimeError = null;
    const observer = new MutationObserver(() => {
      if (el.dataset.renderer !== 'video') return;
      const video = el.querySelector('video');
      window.sncFirstRevealedTimeError = Math.abs(video.currentTime - (video.duration - .08) * 4 / 7);
      observer.disconnect();
    });
    observer.observe(el, { attributes: true, attributeFilter: ['data-renderer'] });
  });
  release();
  await expect(page.locator('#journey')).toHaveAttribute('data-renderer', 'video', { timeout: 20000 });
  await expect.poll(() => page.evaluate(() => window.sncFirstRevealedTimeError)).not.toBeNull();
  expect(await page.evaluate(() => window.sncFirstRevealedTimeError)).toBeLessThan(.12);
  expect(await page.locator('.journey-film').evaluate(el => el.paused)).toBe(true);
});

test('native scrolling interrupts the opening and preserves the frame in the same player', async ({ page }) => {
  let release;
  const ready = new Promise(resolve => { release = resolve; });
  await page.route('**/assets/media/snc-blue-glass-v2*.mp4', async route => { await ready; await route.continue(); });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#journey')).toHaveAttribute('data-enhanced', 'true');
  release();
  const video=page.locator('.journey-film');
  await expect(video).toHaveAttribute('data-playback', 'intro');
  const before=await video.evaluate(el=>{
    window.sncOpeningInputFrame=null;
    addEventListener('scroll',()=>{ window.sncOpeningInputFrame={time:el.currentTime,phase:el.dataset.playback}; },{once:true,capture:true,passive:true});
    return {time:el.currentTime,src:el.getAttribute('src')};
  });
  await page.mouse.wheel(0,100);
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(0);
  await expect(video).toHaveAttribute('data-playback', 'scroll');
  await expect.poll(()=>video.evaluate(el=>el.paused)).toBe(true);
  const after=await video.evaluate(el=>({time:el.currentTime,src:el.getAttribute('src')}));
  const atInput=await page.evaluate(()=>window.sncOpeningInputFrame);
  expect(after.src).toBe(before.src);
  expect(atInput.phase).toBe('intro');
  // Compare the actual input frame, excluding browser command scheduling.
  expect(Math.abs(after.time-atInput.time)).toBeLessThan(.08);
  expect(after.time).toBeLessThan(1);
});
