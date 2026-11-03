import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const url = process.env.PREVIEW_URL || 'http://127.0.0.1:4173/';
await fs.mkdir('docs/previews', { recursive: true });
await fs.mkdir('artifacts/recordings', { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.route('**/api.github.com/**', (route) => route.fulfill({ json: [] }));
  await page.goto(url); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(2800);
  await page.screenshot({ path: `docs/previews/${name}.png` });
  if (name === 'desktop') {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('#technology').evaluate((el) => window.scrollTo({ top: el.offsetTop - 88, behavior: 'instant' }));
    await page.screenshot({ path: 'docs/previews/technology.png' });
  }
  await page.close();
}
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, recordVideo: { dir: 'artifacts/recordings', size: { width: 1280, height: 800 } } });
const page = await context.newPage(); const video = page.video();
await page.route('**/api.github.com/**', (route) => route.fulfill({ json: [] }));
await page.goto(url); await page.waitForTimeout(2900);
for (const selector of ['#about', '#expertise', '#technology', '#opensource', '#contact']) {
  await page.locator(selector).evaluate((el) => window.scrollTo({ top: el.offsetTop - 88, behavior: 'smooth' }));
  await page.waitForTimeout(selector === '#technology' ? 1800 : 1200);
  if (selector === '#expertise') { await page.locator('.service-detail summary').first().click(); await page.waitForTimeout(500); }
}
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' })); await page.waitForTimeout(1600);
await context.close(); await video.saveAs('artifacts/cinematic-preview.webm');
await browser.close();
console.log('Saved desktop/mobile/technology PNGs and cinematic-preview.webm');
