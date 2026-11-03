import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
await fs.mkdir('artifacts/before', { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
for (const width of [390, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 1000 } });
  await page.goto('https://snclabs.github.io/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: `artifacts/before/site-${width}.png`, fullPage: true });
  await page.close();
}
await browser.close();
