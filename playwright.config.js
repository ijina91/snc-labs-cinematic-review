import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', timeout: 45000, expect: { timeout: 8000 }, workers: 1,
  reporter: [['list'], ['json', { outputFile: 'artifacts/qa/results.json' }]],
  use: { baseURL: 'http://127.0.0.1:4173', channel: process.env.CI ? undefined : 'msedge', trace: 'retain-on-failure' },
  projects: [390, 768, 1440, 1920].map((width) => ({ name: String(width), use: { viewport: { width, height: width === 390 ? 844 : 1080 }, isMobile: width === 390, hasTouch: width <= 768 } })),
  webServer: { command: 'npm run preview -- --port 4173 --strictPort', url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI },
  outputDir: 'artifacts/qa/traces',
});
