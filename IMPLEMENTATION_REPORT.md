# Implementation report

## Result

Rebuilt SNC Labs as a runnable white-based corporate website with a finite white-to-blue entrance, a custom folded SNC check, three verified service components, and a reversible SVG business/system diagram. The latest revision replaces the rounded inset hero with a full-width, viewport-height stage, larger typography/check geometry, orbital curves, outline SNC lettering and a finite light sweep. Kept Vite, semantic HTML, CSS and vanilla JavaScript. No React or WebGL migration.

The Instagram reel was inaccessible; this is an independent design. See REFERENCE_ANALYSIS.md for actual tool and skill availability. No unavailable skill is recorded as executed.

## Preserved behavior

- Exact SNC logo geometry and approved brand colors; company introduction.
- ESH and safety work-permit system development, SAP & Enterprise, Web Engineering.
- Public GitHub projects, safe text rendering, metadata and outbound links.
- Native service disclosures, mobile navigation, Escape/focus behavior and reduced motion.
- Representative phone, canonical domain, SEO/OG metadata, favicon, robots and sitemap.
- Main-only GitHub Pages build/deploy workflow. Added explicit main-ref guards.

## Structure

`src/data/services.js` holds verified service data. `ServiceCards.js` and the Vite HTML transform render complete static HTML at build time, including logos and disclosures. `ResponsiveNavigation.js`, `ServiceInteractions.js` and `GithubProjects.js` own independent interactions. `MotionPreferences.js` identifies reduced motion and lightweight-device preferences. `CinematicExperience.js` owns the finite hero timeline; `ScrollExperience.js` owns lazy ScrollTrigger scenes and reversible SVG paths. Styles are split into tokens, site and responsive files.

GitHub requests are deferred until the section approaches the viewport. Loading, success, empty, failure, seven-second abort and retry states remain useful. Retry retains keyboard focus with aria-disabled and a guarded request, then moves focus to the resulting link before hiding the button. Responses cannot inject HTML or reveal private repositories. There is no token in runtime code.

## Motion and resilience

Content is visible before animation loads. Hero text stays readable on white while blue light accumulates over 2.1 seconds; the one-time light sweep ends by 2.25 seconds. The explanatory paragraph is stationary to protect LCP. GSAP loads separately; ScrollTrigger waits for the first native scroll and initializes nearby chapters. Reduced motion, failed animation imports and JavaScript-disabled browsing retain content and phone links. Scoped contexts, observers, fetches and event listeners are disposed on page lifecycle/preference changes.

## Assets and dependencies

Locally hosted, subsetted OFL fonts total approximately 122 KB. Reserved font names were replaced with SNC Sans and SNC Display. Source licenses ship beside fonts; see LICENSES.md. All decorative graphics are authored inline SVG/CSS. GSAP is the only runtime addition. Playwright, axe and Lighthouse are development tools. npm ci and the final build have been run; npm audit reports no known vulnerabilities at the tested lockfile.

## Delivery boundary

Feature branch: `feat/cinematic-experience`, based on main `b9b4a4617af3229f1951c48b8b862830730e4ed0`. Organization write permissions are unavailable to the local authenticated account; review delivery uses the public fork `ijina91/snc-labs-cinematic-review` and a cross-repository PR into `snclabs/snclabs.github.io:main`. No production merge or deployment is authorized by this delivery. The PR workflow builds/tests only; deployment jobs also reject non-main manual dispatch.

Submitted [PR #1](https://github.com/snclabs/snclabs.github.io/pull/1). At initial submission GitHub Actions returned `action_required`: the first external-fork workflow requires repository-maintainer approval. Remote CI has not passed or deployed; local regression evidence remains available. Main was verified unchanged after PR creation.

QA, performance measurements, visual comparison and remaining verification limits are recorded separately. Local ignored artifacts contain raw audit JSON/HTML, test traces and a short walkthrough video.
