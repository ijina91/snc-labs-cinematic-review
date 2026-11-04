import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const url = process.env.PREVIEW_URL || 'http://127.0.0.1:4173/';
await fs.mkdir('docs/previews', { recursive: true });
await fs.mkdir('artifacts/recordings', { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
if (process.env.CAPTURE_BASELINE_URL) {
  for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
    const page=await browser.newPage({viewport:{width,height},hasTouch:name==='mobile',isMobile:name==='mobile'});
    await page.route('**/api.github.com/**',route=>route.fulfill({json:[]}));
    await page.goto(process.env.CAPTURE_BASELINE_URL); await page.evaluate(()=>document.fonts.ready); await page.waitForTimeout(2800);
    await page.screenshot({path:`docs/previews/baseline-main-${name}.png`}); await page.close();
  }
  await fs.writeFile('artifacts/recordings/baseline.json',JSON.stringify({url:process.env.CAPTURE_BASELINE_URL,capturedAt:new Date().toISOString(),githubFixture:'empty list'},null,2));
}
async function enterJourney(page) {
  await page.evaluate(() => scrollTo({top: 0, behavior: 'instant'}));
  await page.waitForFunction(() => document.querySelector('#journey').dataset.enhanced === 'true');
  await page.waitForFunction(() => document.querySelector('#journey').dataset.renderer === 'video', null, {timeout: 20000});
}
async function chapter(page, index, behavior = 'instant') {
  await page.locator('#journey').evaluate((el, options) => {
    const header = document.querySelector('.site-header').getBoundingClientRect().height;
    const span = el.offsetHeight - el.querySelector('.journey-panels').clientHeight;
    scrollTo({top: el.getBoundingClientRect().top + scrollY - header + span * ((options.index + .3) / 7), behavior: options.behavior});
  }, {index, behavior});
}
for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844], ['fold', 690, 829]]) {
  const page = await browser.newPage({ viewport: { width, height }, hasTouch: name !== 'desktop', isMobile: name === 'mobile' });
  await page.route('**/api.github.com/**', (route) => route.fulfill({ json: [] }));
  await page.goto(url); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(2800);
  await page.screenshot({ path: `docs/previews/${name}.png` });
  await enterJourney(page);
  for (const [index, chapterName] of name === 'desktop' ? [[0,'snc'],[1,'about'],[2,'engineering'],[3,'esh'],[4,'sap'],[5,'web'],[6,'next']] : [[3,name]]) {
    await chapter(page, index); await page.waitForTimeout(1400);
    await page.screenshot({path: `docs/previews/journey-${chapterName}.png`});
  }
  for (const section of ['about', 'expertise', 'technology', 'opensource', 'contact']) {
    await page.locator(`#${section}`).evaluate(el => scrollTo({top: el.getBoundingClientRect().top + scrollY - document.querySelector('.site-header').clientHeight, behavior:'instant'}));
    await page.waitForTimeout(700);
    await page.screenshot({ path: `docs/previews/${name}-${section}.png` });
  }
  await page.close();
}
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, recordVideo: { dir: 'artifacts/recordings', size: { width: 1280, height: 800 } } });
const page = await context.newPage(); const video = page.video();
await page.route('**/api.github.com/**', (route) => route.fulfill({ json: [] }));
await page.goto(url); await page.waitForTimeout(3400);
await enterJourney(page);
for (let index = 0; index < 7; index++) { await chapter(page, index, 'smooth'); await page.waitForTimeout(3600); }
for (const selector of ['#about', '#expertise', '#technology', '#opensource', '#contact']) {
  await page.locator(selector).evaluate((el) => window.scrollTo({ top: el.offsetTop - 88, behavior: 'smooth' }));
  await page.waitForTimeout(selector === '#technology' ? 4200 : 3000);
  if (selector === '#expertise') { await page.locator('.service-detail summary').first().click(); await page.waitForTimeout(1800); }
}
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' })); await page.waitForTimeout(1600);
await context.close(); await video.saveAs('artifacts/cinematic-preview.webm');
await browser.close();
console.log('Saved the seven-chapter film, mobile/Fold, business sections and cinematic-preview.webm. GitHub API uses an empty-list fixture.');
