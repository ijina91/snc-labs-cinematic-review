# Performance report

Date: 2026-11-03. Production build served from `http://127.0.0.1:4180/`. Lighthouse 13.5.0 through installed headless Microsoft Edge 156 on Windows. Mobile uses Lighthouse's standard simulated mobile/network/CPU profile; desktop uses the actual desktop configuration module. Three sequential mobile samples and one desktop sample are measured without concurrent browser QA. These are local lab results, not a production CrUX/field measurement.

## Final measurements

| Profile | Performance | Accessibility | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|---:|
| Mobile 1 | 90 | 100 | 100 | 2.511s | 0 | 138.5ms |
| Mobile 2 | 95 | 100 | 100 | 2.043s | 0 | 101ms |
| Mobile 3 | 97 | 100 | 100 | 2.033s | 0 | 78ms |
| Mobile median | **95** | **100** | **100** | **2.043s** | **0** | **101ms** |
| Desktop 1 | **100** | **100** | **100** | **0.558s** | **0.0000062** | **0ms** |

Median mobile and the desktop sample meet the lab targets. Mobile sample 1 exceeds the LCP goal by approximately 11ms; the goal was not met in every sample. Lighthouse still flags forced reflow, dependency chains and render-blocking work; these are improvement opportunities, not hidden successes. Machine-readable final summaries are included in `docs/verification/performance.json`.

Goal: LCP ≤2.5s, CLS ≤0.1, Lighthouse Performance ≥90, Accessibility ≥95, field INP ≤200ms. A lab report does not establish field INP. Total Blocking Time is reported independently and is not relabeled as INP.

Raw final reports are `artifacts/performance/mobile-{1,2,3}.{json,html}`, `desktop-1.{json,html}` and `summary.json`. `npm run performance` reproduces all four runs against a running preview server. `PERFORMANCE_URL` changes the address and `CHROME_PATH` changes the installed Chromium-family executable. Edge uses an explicit localhost debugging port because dynamic-port discovery failed in this environment.

## Interaction probe

Observed maximum Event Timing duration: **320ms at 390px**, **152ms at 1440px**, both with 4× CPU slowdown. The mobile sample exceeds the 200ms interaction target; it is disclosed as a remaining lab interaction-performance limit. No field-INP pass is claimed. Full event samples are included in `docs/verification/interactions.json`.

`npm run probe` runs real click/key interactions on mobile and desktop under 4× CPU slowdown, observing Event Timing entries at a 16ms threshold. It covers disclosures and mobile menu/Escape. This small synthetic sample is not a percentile or real-user INP. An absent entry means no observed qualifying event, not a measured zero. Raw output: `artifacts/performance/interactions.json`.

## Optimization supported by measurements

An early combined animation implementation measured mobile Performance 74, LCP 3.195s, TBT 587ms and CLS 0. Identified startup layout work and moving explanatory copy rather than assuming the SVG needed a heavier renderer. Split hero GSAP from ScrollTrigger; defer ScrollTrigger until native scrolling, initialize nearby chapters through IntersectionObserver, batch path measurements, wait for fonts before transforms, and keep the LCP paragraph stationary. Defer public GitHub fetch until its section approaches. Remove unnecessary CSS perspective. These changes preserve the intended finite entrance and ordinary scroll behavior.

An earlier desktop-labeled run accidentally used mobile settings; it is excluded from desktop comparisons. Final desktop runs use `desktop-config.js`; summary records the actual form factor, throttling and screen settings. Intermediate runs are not cherry-picked as final results.

## Asset budget and delivery

- Static HTML: approximately 18.59KB (5.39KB gzip).
- CSS: 27.04KB (6.55KB gzip).
- Main application JS: 7.66KB (3.27KB gzip).
- Hero module: 0.77KB (0.44KB gzip); shared GSAP core: 70.04KB (27.53KB gzip).
- Scroll module: 45.59KB (18.95KB gzip), requested after scrolling starts.
- Three locally hosted font subsets: approximately 122KB total; no external font request.
- No hero raster/video download, WebGL context, infinite animation loop or runtime test engine. Decorative graphics are SVG/CSS. Font and graphic dimensions reserve layout space.

Build sizes above are emitted by the final Vite build; gzip figures are build-tool estimates. No claim is made that all transferred bytes are required before first paint. Font source tooling and QA/video artifacts are excluded from deployment.

## Limits

The local machine, installed browser, simulated throttling and localhost delivery affect results. Production CDN/network and physical-device results may differ. INP needs field telemetry after an approved deployment and sufficient interactions; it remains unverified. Actual Pages rollout is intentionally pending approval, so a production redesign Web Vitals claim would be premature.
