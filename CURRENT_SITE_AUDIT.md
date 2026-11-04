# Current site audit

Audit date: 2026-11-03 (Asia/Seoul). Baseline: `main`, commit `b9b4a4617af3229f1951c48b8b862830730e4ed0`.

## Existing implementation

Inspected `index.html`, `src/main.js`, `src/style.css`, `package.json`, all five `public/*` assets, `.github/workflows/deploy.yml`, and `README.md`.

- Vite 7, static HTML/CSS, one vanilla JavaScript entry. No animation framework.
- Company introduction; ESH / work permit development; SAP & Enterprise; Web Engineering.
- Native details/summary service disclosures, keyboard focus, skip link, reduced-motion CSS.
- Mobile navigation with expanded state, Escape, anchor-close, desktop breakpoint reset.
- Public GitHub organization repository fetch with timeout; DOM textContent prevents HTML injection. Errors silently retain the empty state; loading/error/retry need improvement.
- Telephone links: `tel:+8223545001`. No approved email or customer references.
- SEO and OG tags, favicon, robots, sitemap, social PNG/SVG.
- Deployment runs on main pushes and workflow_dispatch. No PR-only build verification currently.

## Preserve

All content/functions above, exact logo paths, canonical domain, approved phone, three verified services, public-only GitHub data, static/no-JS readability. No new claimed services or clients.

## Redesign

Replace the static two-column illustration, uneven service disclosures, minified monolithic CSS, silent GitHub failure, and lack of a technology narrative. Add scoped motion, progressive enhancement, data-backed service rendering, explicit fetch states, and reproducible QA.

## Deployment boundary

Work branch: `feat/cinematic-experience`. Production main must remain unchanged until user approval. Keep main deployment; add PR build-only checks and guard manual deployment against non-main refs.

## 2026-11-04 follow-up

The feature implementation now uses a reviewed 15.5-second original spatial film, with native scroll scrubbing and a static fallback. Rotating checks, rings, side dots/counters and the Three.js runtime were removed. Desktop entry uses GSAP; mobile entry uses browser-native opacity animations. The three verified services, company copy, public GitHub integration, phone and SEO assets remain preserved. Current validation and actual failure/recheck scopes are recorded in QA_REPORT.md and docs/verification/qa-film.json. The main/deployment approval boundary is unchanged.
