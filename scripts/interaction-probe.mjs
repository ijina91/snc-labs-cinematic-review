import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const measurements = [];
for (const width of [390, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.route('**/api.github.com/**', (route) => route.fulfill({ json: [] }));
  await page.addInitScript(() => {
    window.sncEventSamples = []; window.sncProbePhase = 'load';
    try { new PerformanceObserver((list) => list.getEntries().forEach((entry) => { if (entry.interactionId) window.sncEventSamples.push({ duration: entry.duration, type: entry.name, phase: window.sncProbePhase }); })).observe({ type: 'event', buffered: true, durationThreshold: 16 }); } catch { window.sncEventTimingUnsupported = true; }
  });
  const client = await page.context().newCDPSession(page);
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.goto(process.env.PERFORMANCE_URL || 'http://127.0.0.1:4173/');
  await page.waitForTimeout(1600);
  await page.evaluate(() => { window.sncProbePhase = 'journey-entry'; });
  await page.getByRole('link', {name: 'SNC의 기술 알아보기', exact: true}).click();
  await page.waitForFunction(() => /video|poster/.test(document.querySelector('#journey').dataset.renderer), null, {timeout:30000});
  await page.waitForTimeout(700);
  const renderer = await page.locator('#journey').getAttribute('data-renderer');
  await page.evaluate(() => { window.sncProbePhase = 'journey-navigation'; });
  await page.keyboard.press('PageDown');
  await page.waitForFunction(() => document.querySelector('.journey-stage').dataset.chapter === '2');
  await page.waitForTimeout(700);
  await page.keyboard.press('PageUp');
  await page.waitForFunction(() => document.querySelector('.journey-stage').dataset.chapter === '4');
  await page.waitForTimeout(700);
  await page.evaluate(() => { window.sncProbePhase = 'service-details'; });
  for (const summary of await page.locator('.service-detail summary').all()) { await summary.click(); await summary.press('Enter'); }
  if (width === 390) { await page.evaluate(() => { window.sncProbePhase = 'mobile-menu'; }); await page.getByRole('button', { name: '메뉴 열기', exact: true }).click(); await page.getByRole('button', { name: '메뉴 닫기', exact: true }).press('Escape'); }
  await page.waitForTimeout(400);
  const sample = await page.evaluate(() => ({ unsupported: !!window.sncEventTimingUnsupported, samples: window.sncEventSamples }));
  measurements.push({ width, cpuSlowdown: 4, renderer, ...sample, maxObservedDurationMs: sample.samples.length ? Math.max(...sample.samples.map((x) => x.duration)) : null, note: 'Synthetic journey entry/chapter navigation, disclosure and menu click/key Event Timing samples, not field INP. No entry may mean duration below the 16ms observer threshold.' });
  await page.close();
}
await browser.close();
await fs.mkdir('artifacts/performance', { recursive: true });
await fs.writeFile('artifacts/performance/interactions.json', JSON.stringify(measurements, null, 2));
console.log(JSON.stringify(measurements));
