import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import { launch } from 'chrome-launcher';
import fs from 'node:fs/promises';
const chromePath = process.env.CHROME_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
await fs.mkdir('artifacts/performance', { recursive: true });
const summaries = [];
for (const [mode, run] of [['mobile', 1], ['mobile', 2], ['mobile', 3], ['desktop', 1]]) {
  // Edge does not reliably write Chrome's dynamic-port discovery file on Windows.
  const chrome = await launch({ chromePath, port: 9223, chromeFlags: ['--headless=new', '--remote-debugging-address=127.0.0.1'] });
  try {
    const result = await lighthouse(process.env.PERFORMANCE_URL || 'http://127.0.0.1:4173/', { port: chrome.port, output: ['html', 'json'], onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] }, mode === 'desktop' ? desktopConfig : undefined);
    await fs.writeFile(`artifacts/performance/${mode}-${run}.html`, result.report[0]);
    await fs.writeFile(`artifacts/performance/${mode}-${run}.json`, result.report[1]);
    const lhr = result.lhr;
    const summary = { mode, run, lighthouse: lhr.lighthouseVersion, userAgent: lhr.environment.hostUserAgent, formFactor: lhr.configSettings.formFactor, throttling: lhr.configSettings.throttling, screen: lhr.configSettings.screenEmulation, performance: lhr.categories.performance.score * 100, accessibility: lhr.categories.accessibility.score * 100, seo: lhr.categories.seo.score * 100, lcp: lhr.audits['largest-contentful-paint'].numericValue, cls: lhr.audits['cumulative-layout-shift'].numericValue, tbt: lhr.audits['total-blocking-time'].numericValue, failedAudits: Object.values(lhr.audits).filter((audit) => audit.score !== null && audit.score < 1 && audit.details).map((audit) => ({ id: audit.id, title: audit.title, score: audit.score })) };
    summaries.push(summary); console.log(JSON.stringify(summary));
  } finally { await chrome.kill(); }
}
await fs.writeFile('artifacts/performance/summary.json', JSON.stringify(summaries, null, 2));
