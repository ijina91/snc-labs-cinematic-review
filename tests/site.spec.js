import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
const api = '**/api.github.com/orgs/snclabs/repos*';
const publicRepo = (name = 'workflow-tools') => ({ name, private: false, fork: false, archived: false, description: '공개 프로젝트 설명', language: 'JavaScript', stargazers_count: 2 });
test.beforeEach(async ({ page }) => { await page.route(api, (route) => route.fulfill({ json: [] })); });

test('preserved content, assets, links and responsive layout', async ({ page }, info) => {
  const errors = []; const failed = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => { if (response.url().startsWith('http://127.0.0.1') && response.status() >= 400) failed.push(response.url()); });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('SNC, 기술로가능성을 잇다.');
  const stage = await page.locator('.hero-stage').boundingBox();
  const header = await page.locator('.site-header').boundingBox();
  expect(stage.x).toBe(0);
  expect(Math.abs(stage.width - page.viewportSize().width)).toBeLessThan(1);
  expect(stage.height).toBeGreaterThanOrEqual(page.viewportSize().height - header.height - 1);
  for (const name of ['ESH Systems', 'SAP & Enterprise', 'Web Engineering']) await expect(page.locator('.service-card h3').filter({ hasText: name })).toBeVisible();
  expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBe('https://snclabs.github.io/');
  expect(await page.locator('a[href="tel:+8223545001"]').count()).toBeGreaterThan(0);
  expect(await page.locator('body').innerText()).not.toMatch(/hynix|\bSHE\b|AI Security Cloud/);
  const missing = await page.locator('a[href^="#"]').evaluateAll((links) => links.filter((a) => a.hash && !document.getElementById(a.hash.slice(1))).map((a) => a.hash));
  expect(missing).toEqual([]);
  for (const id of ['about', 'expertise', 'technology', 'opensource', 'contact']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  }
  await page.getByRole('heading', { level: 1 }).scrollIntoViewIfNeeded();
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(1300);
  await fs.mkdir('artifacts/qa', { recursive: true });
  await page.screenshot({ path: `artifacts/qa/after-${info.project.name}.png`, fullPage: true });
  expect(errors).toEqual([]); expect(failed).toEqual([]);
});

test('keyboard disclosures, inquiry links and mobile navigation', async ({ page }, info) => {
  await page.goto('/');
  for (const card of await page.locator('.service-card').all()) {
    await card.locator('summary').press('Enter'); await expect(card.locator('details')).toHaveAttribute('open', '');
    await expect(card.locator('.service-detail__body')).toBeVisible();
    await card.locator('summary').press('Enter'); await expect(card.locator('details')).not.toHaveAttribute('open', '');
    await expect(card.locator('.service-contact')).toHaveAttribute('href', '#contact');
  }
  if (Number(info.project.name) <= 900) {
    await page.getByRole('button', { name: '메뉴 열기', exact: true }).tap();
    await page.getByRole('button', { name: '메뉴 닫기', exact: true }).press('Escape');
    await expect(page.getByRole('button', { name: '메뉴 열기', exact: true })).toBeFocused();
    await page.getByRole('button', { name: '메뉴 열기', exact: true }).click();
    await page.getByRole('navigation', { name: '모바일 메뉴', exact: true }).getByRole('link', { name: 'Expertise', exact: true }).click();
    await expect(page.locator('#mobile-nav')).toBeHidden(); await expect(page).toHaveURL(/#expertise$/);
  }
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.getByRole('link', { name: 'SNC Labs 홈', exact: true }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
});

test('WCAG automated axe checks, including disclosure and navy diagram', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('/');
  await page.locator('.service-detail').first().locator('summary').click();
  await page.locator('#technology').scrollIntoViewIfNeeded();
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  await fs.mkdir('artifacts/qa', { recursive: true });
  await fs.writeFile(`artifacts/qa/axe-${info.project.name}.json`, JSON.stringify(result, null, 2));
  expect(result.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target) }))).toEqual([]);
});

test('public GitHub projects: safe rendering and private/fork filtering', async ({ page }) => {
  await page.unroute(api);
  await page.route(api, (route) => route.fulfill({ json: [publicRepo(), { ...publicRepo('private'), private: true }, { ...publicRepo('fork'), fork: true }, publicRepo('snclabs.github.io'), { ...publicRepo('safe-text'), description: '<img src=x onerror=alert(1)>', html_url: 'javascript:alert(1)' }] }));
  await page.goto('/');
  await page.locator('#opensource').scrollIntoViewIfNeeded();
  await expect(page.locator('.repo-item')).toHaveCount(2);
  await expect(page.locator('.repo-item').first()).toHaveAttribute('href', 'https://github.com/snclabs/workflow-tools');
  await expect(page.locator('.repo-list img')).toHaveCount(0);
  await expect(page.locator('.repo-list')).toContainText('<img src=x onerror=alert(1)>');
  expect((await new AxeBuilder({ page }).include('#opensource').withRules(['color-contrast']).analyze()).violations).toEqual([]);
});

test('GitHub failure and retry preserve useful content', async ({ page }) => {
  await page.unroute(api); let attempts = 0;
  await page.route(api, (route) => ++attempts === 1 ? route.fulfill({ status: 503, json: {} }) : route.fulfill({ json: [publicRepo()] }));
  await page.goto('/');
  await page.locator('#opensource').scrollIntoViewIfNeeded();
  await expect(page.locator('#github-retry')).toBeVisible();
  await expect(page.locator('#repo-content')).toContainText('지금은 프로젝트를 불러오지 못했습니다.');
  expect((await new AxeBuilder({ page }).include('#opensource').withRules(['color-contrast']).analyze()).violations).toEqual([]);
  await page.getByRole('button', { name: /다시 불러오기/ }).click();
  await expect(page.locator('.repo-item')).toHaveCount(1); await expect(page.locator('#github-retry')).toBeHidden();
  await expect(page.locator('.repo-item').first()).toBeFocused();
});

test('GitHub loading and empty states are explicit', async ({ page }) => {
  await page.unroute(api); let release;
  const ready = new Promise((resolve) => { release = resolve; });
  await page.route(api, async (route) => { await ready; await route.fulfill({ json: [] }); });
  await page.goto('/');
  await page.locator('#opensource').scrollIntoViewIfNeeded();
  await expect(page.locator('#repo-content')).toHaveAttribute('aria-busy', 'true');
  await expect(page.locator('#repo-content')).toContainText('Connecting to GitHub.');
  release();
  await expect(page.locator('#repo-content')).toContainText('Every connection starts somewhere.');
  await expect(page.locator('#repo-content')).toHaveAttribute('aria-busy', 'false');
});

test('GitHub real request deadline exits loading state', async ({ page }) => {
  await page.unroute(api);
  await page.route(api, () => new Promise(() => {}));
  await page.goto('/');
  await page.locator('#opensource').scrollIntoViewIfNeeded();
  await expect(page.locator('#github-retry')).toBeVisible({ timeout: 12000 });
  await expect(page.locator('#repo-content')).toHaveAttribute('aria-busy', 'false');
});

test('reduced motion, reverse scrolling and preference changes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.locator('#contact').scrollIntoViewIfNeeded(); await page.getByRole('heading', { level: 1 }).scrollIntoViewIfNeeded();
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.locator('#technology').scrollIntoViewIfNeeded();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('heading', { level: 1 }).scrollIntoViewIfNeeded();
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
  expect(await page.locator('.hero-line').first().evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
});

test('no JavaScript still exposes company content, disclosures and navigation', async ({ browser }, info) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: info.project.use.viewport, isMobile: info.project.use.isMobile, hasTouch: info.project.use.hasTouch }); const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.service-card')).toHaveCount(3);
  await page.locator('.service-detail').first().locator('summary').click();
  await expect(page.locator('.service-detail__body').first()).toBeVisible();
  await expect(page.locator('.no-script-nav')).toBeVisible();
  await expect(page.locator('.hero-art-intro')).toHaveCSS('opacity', '1');
  await expect(page.getByText('02-354-5001', { exact: true })).toBeVisible(); await context.close();
});

test('optional motion bundle failure does not hide content or break navigation', async ({ page }) => {
  await page.route('**/assets/CinematicExperience-*.js', (route) => route.abort()); await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.hero-art-intro')).toHaveCSS('opacity', '1');
  await page.getByRole('link', { name: 'SNC의 기술 알아보기', exact: true }).click();
  await expect(page).toHaveURL(/#expertise$/); await expect(page.locator('.service-card')).toHaveCount(3);
});

test('SVG connection progresses with native scroll and reverses upward', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' }); await page.goto('/');
  const path = page.locator('.flow-svg:visible [data-flow]').first();
  await page.mouse.wheel(0, 25);
  await page.locator('.connection-map').evaluate((el) => window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - innerHeight - 120, behavior: 'instant' }));
  await expect.poll(() => path.evaluate((el) => parseFloat(getComputedStyle(el).strokeDashoffset))).toBeGreaterThan(10);
  await page.locator('.connection-map').evaluate((el) => window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + el.clientHeight - innerHeight * .3, behavior: 'instant' }));
  await expect.poll(() => path.evaluate((el) => parseFloat(getComputedStyle(el).strokeDashoffset))).toBeLessThan(1);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect.poll(() => path.evaluate((el) => parseFloat(getComputedStyle(el).strokeDashoffset))).toBeGreaterThan(10);
});

test('white first frame progressively gains brand-blue background', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' }); let release;
  const ready = new Promise((resolve) => { release = resolve; });
  await page.route('**/assets/CinematicExperience-*.js', async (route) => { await ready; await route.continue(); });
  await page.goto('/');
  await expect(page.locator('.hero-stage')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.locator('.hero-ambient')).toHaveCSS('opacity', '0');
  await expect(page.locator('.hero-art-intro')).toHaveCSS('opacity', '0.08');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  release();
  await expect.poll(() => page.locator('.hero-ambient').evaluate((el) => Number(getComputedStyle(el).opacity))).toBeGreaterThan(.99);
  await expect(page.locator('.hero-art-intro')).toHaveCSS('opacity', '1');
});
