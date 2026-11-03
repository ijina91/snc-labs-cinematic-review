# Performance report

Date: 2026-11-04 (KST), final six-chapter build. Served from `http://127.0.0.1:4180/`. Lighthouse 13.5.0 through installed headless Microsoft Edge 156 on Windows. Mobile uses Lighthouse's standard simulated mobile/network/CPU profile; desktop uses the actual desktop configuration module. Three sequential mobile samples and one desktop sample are measured without concurrent browser QA. These are local lab results, not a production CrUX/field measurement.

## Final measurements

| Profile | Performance | Accessibility | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|---:|
| Mobile 1 | 94 | 100 | 100 | 2.517s | 0.0000225 | 76.5ms |
| Mobile 2 | 95 | 100 | 100 | 2.505s | 0.0000225 | 87ms |
| Mobile 3 | 95 | 100 | 100 | 2.439s | 0.0000225 | 109ms |
| Mobile median | **95** | **100** | **100** | **2.505s** | **0.0000225** | **87ms** |
| Desktop 1 | **96** | **100** | **100** | **0.736s** | **0.0000486** | **148ms** |

These are fresh measurements of the six-chapter revision. Performance/accessibility/CLS targets are met in these samples. The mobile median LCP misses the 2.5s target by approximately **5ms** (two samples miss it, one meets it); no across-the-board LCP pass is claimed. Lighthouse still flags forced reflow, dependency chains and render-blocking work, with one mobile BFCache diagnostic. These are recorded improvement opportunities. Machine-readable summaries are included in `docs/verification/performance.json`.

The BFCache diagnostic reports `CacheLimitPrunedOnCriticalMemoryPressure`, classified by Lighthouse as **Not actionable**. This records the browser's memory-pressure eviction during that run; it is not evidence of an unload-handler defect. Lifecycle cleanup remains implemented, while cache restoration cannot be guaranteed under host memory pressure.

Goal: LCP ≤2.5s, CLS ≤0.1, Lighthouse Performance ≥90, Accessibility ≥95, field INP ≤200ms. A lab report does not establish field INP. Total Blocking Time is reported independently and is not relabeled as INP.

Raw final reports are `artifacts/performance/mobile-{1,2,3}.{json,html}`, `desktop-1.{json,html}` and `summary.json`. `npm run performance` reproduces all four runs against a running preview server. `PERFORMANCE_URL` changes the address and `CHROME_PATH` changes the installed Chromium-family executable. Edge uses an explicit localhost debugging port because dynamic-port discovery failed in this environment.

## Interaction probe

Observed maximum Event Timing duration in the final six-chapter revision: **200ms at 390px**, **192ms at 1440px**, both with 4× CPU slowdown and **WebGL active**. These small lab samples stay within the 200ms threshold; no field-INP pass is claimed. Scene-navigation events reached 40ms mobile / 48ms desktop in this sample, while initial story entry reached 200ms / 136ms. Full samples are included in `docs/verification/interactions.json`.

`npm run probe` runs real click/key interactions on mobile and desktop under 4× CPU slowdown, observing Event Timing entries at a 16ms threshold. It covers entry into the 3D introduction, pointer/keyboard chapter navigation, disclosures and mobile menu/Escape; the output identifies the selected renderer and interaction phase. This small synthetic sample is not a percentile or real-user INP. An absent entry means no observed qualifying event, not a measured zero. Raw output: `artifacts/performance/interactions.json`.

## Optimization supported by measurements

An early combined animation implementation measured mobile Performance 74, LCP 3.195s, TBT 587ms and CLS 0. Identified startup layout work and moving explanatory copy rather than assuming the SVG needed a heavier renderer. Split hero GSAP from ScrollTrigger; defer ScrollTrigger until native scrolling, initialize nearby chapters through IntersectionObserver, batch path measurements, wait for fonts before transforms, and keep the LCP paragraph stationary. Defer public GitHub fetch until its section approaches. Remove unnecessary CSS perspective. These changes preserve the intended finite entrance and ordinary scroll behavior.

An earlier desktop-labeled run accidentally used mobile settings; it is excluded from desktop comparisons. Final desktop runs use `desktop-config.js`; summary records the actual form factor, throttling and screen settings. Intermediate runs are not cherry-picked as final results.

## Asset budget and delivery

- Static HTML: approximately 24.73KB (6.49KB gzip), including all six introduction chapters.
- CSS: 40.05KB (9.06KB gzip), including the fullscreen and scroll-story layouts.
- Main application JS: 8.60KB (3.55KB gzip).
- Hero module: 1.14KB (0.55KB gzip); shared GSAP core: 70.04KB (27.53KB gzip).
- Scroll module: 45.43KB (18.93KB gzip), requested after scrolling starts.
- Story controller: 3.72KB (1.67KB gzip); Three.js scene: 575.80KB (146.68KB gzip), deferred until user scrolling near the introduction. The build warns about this optional >500KB chunk; the warning is not hidden or described as a first-paint resource.
- Three locally hosted font subsets: approximately 124KB total; no external font request.
- No hero raster/video download, initial WebGL context or runtime test engine. The generated environment and geometry are self-hosted code. Low-core/save-data devices use the SVG story without importing Three.js. GPU renders stop offscreen, when hidden and once motion settles. Normal/static introduction heights match to prevent later-anchor shifts.

Build sizes above are emitted by the final Vite build; gzip figures are build-tool estimates. No claim is made that all transferred bytes are required before first paint. Font source tooling and QA/video artifacts are excluded from deployment.

## Limits

The local machine, installed browser, simulated throttling and localhost delivery affect results. Production CDN/network and physical-device results may differ. INP needs field telemetry after an approved deployment and sufficient interactions; it remains unverified. Actual Pages rollout is intentionally pending approval, so a production redesign Web Vitals claim would be premature.
