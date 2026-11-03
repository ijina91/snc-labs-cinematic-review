import { defineConfig } from 'vite';
import { renderServices } from './src/components/ServiceCards.js';
const brand = `<svg class="brand-mark" viewBox="0 0 106 42" aria-hidden="true"><path d="M3 10h27v7H10v6h20v17H3v-7h20v-4H3zm34 30V10h7l19 20V10h7v30h-7L44 20v20zm40-30h26v7H84v16h19v7H77z" fill="currentColor"/><path class="brand-check" d="m83 3 8 7 13-10" fill="none" stroke="currentColor" stroke-width="4"/></svg><span>Labs.</span>`;
export default defineConfig({ base: '/', plugins: [{ name: 'snc-static-content', transformIndexHtml: (html) => html.replaceAll('<!-- SNC_BRAND -->', brand).replace('<!-- SNC_SERVICES -->', renderServices()) }], build: { target: 'es2022' } });
