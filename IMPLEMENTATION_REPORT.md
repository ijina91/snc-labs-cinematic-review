# Implementation report

> 2026-11-04 변경 상태: 체크마크 3D 연출을 제거하고 외부 무료 영상 제작으로 전환 중입니다. 현재는 새 원본 첫 프레임을 적용한 상태이며, 영상은 사람 인증 대기입니다. 아래 기존 WebGL 구현·60건 QA·Lighthouse 수치는 이전 커밋 cc6a428의 기록입니다. 현재 변경 사항과 실제 생성 상태는 [영상 제작 상태](docs/video/PRODUCTION_STATUS.md)를 확인하세요. 새 검증 결과는 별도로 기록합니다.


## Result

Rebuilt SNC Labs as a runnable white-based corporate website with a finite white-to-blue entrance, a custom folded SNC check, three verified service components, and a reversible SVG business/system diagram. The fullscreen hero leads into a six-chapter spatial introduction, with larger typography, original blue geometry and reversible camera travel. Kept Vite, semantic HTML, CSS and vanilla JavaScript. No React migration.

After the user opened Instagram, the 12.42-second reel was viewed and sampled across a complete loop. See REFERENCE_ANALYSIS.md for observed frames and actual tool/skill availability. The SNC implementation uses original geometry and keeps its own palette/content; no unavailable skill is recorded as executed.

## Preserved behavior

- Exact SNC logo geometry and approved brand colors; company introduction.
- ESH and safety work-permit system development, SAP & Enterprise, Web Engineering.
- Public GitHub projects, safe text rendering, metadata and outbound links.
- Native service disclosures, mobile navigation, Escape/focus behavior and reduced motion.
- Representative phone, canonical domain, SEO/OG metadata, favicon, robots and sitemap.
- Main-only GitHub Pages build/deploy workflow. Added explicit main-ref guards.

## Structure

`src/data/services.js` holds verified service data. `ServiceCards.js` and the Vite HTML transform render complete static HTML at build time, including logos and disclosures. `ResponsiveNavigation.js`, `ServiceInteractions.js` and `GithubProjects.js` own independent interactions. `MotionPreferences.js` identifies reduced motion and lightweight-device preferences. `CinematicExperience.js` owns the finite hero timeline; `ScrollExperience.js` owns lazy ScrollTrigger scenes and reversible SVG paths. Styles are split into tokens, site and responsive files.

`src/data/journey.js` and `JourneyMarkup.js` add six build-time-rendered introduction chapters. `components/ScrollJourney.js` gates initialization on scrolling/proximity/preferences. `animations/ScrollJourney.js` owns the native-scroll chapter controller, keyboard navigation, progress and lifecycle. `JourneyScene.js` owns the lazy Three.js perspective scene. A 6.6-viewport CSS-sticky stage lets users read, travel forward/backward and skip to normal company information or contact. Render only during progress changes and settling, never an endless idle loop.

The three business scenes use an asymmetric ESH protective ribbon, interwoven SAP streams and curved Web interface fragments. User review replaced the rigid pillar/board motif. The signature loop is now a continuous smooth surface with joined normals; anti-aliasing and improved pixel density address the initially broken-looking segmented ring. Studio lighting is generated in code. Mobile culls already-passed objects before they obscure the next scene.

GitHub requests are deferred until the section approaches the viewport. Loading, success, empty, failure, seven-second abort and retry states remain useful. Retry retains keyboard focus with aria-disabled and a guarded request, then moves focus to the resulting link before hiding the button. Responses cannot inject HTML or reveal private repositories. There is no token in runtime code.

## Motion and resilience

Content is visible before animation loads. Hero text stays readable on white while blue light accumulates over 2.1 seconds; the one-time light sweep ends by 2.25 seconds. The explanatory paragraph is stationary to protect LCP. GSAP loads separately; ScrollTrigger waits for the first native scroll and initializes nearby chapters. Reduced motion, failed animation imports and JavaScript-disabled browsing retain content and phone links. Scoped contexts, observers, fetches and event listeners are disposed on page lifecycle/preference changes.

## Assets and dependencies

Locally hosted, regenerated OFL font subsets total approximately 124 KB. Reserved font names were replaced with SNC Sans and SNC Display. Source licenses ship beside fonts; see LICENSES.md. Graphics are original SVG/CSS and procedural 3D. Runtime additions are GSAP and **Three.js 0.187.0**, justified by actual spatial camera travel/curved geometry. The Three.js scene is approximately 576KB (147KB gzip), deferred until scrolling near the introduction. The build's >500KB optional-chunk warning is disclosed, not suppressed. Low-core/save-data devices avoid that import; WebGL failure uses the SVG story, and reduced motion/no-JS retain normal reading flow.

Playwright, axe and Lighthouse are development tools. A fresh npm ci completed after releasing this workspace's locked Windows esbuild processes; preview servers were restarted. The tested lockfile audit reports no known vulnerabilities. Rendering resources (including the generated environment texture) are released on lifecycle/preference cleanup and WebGL context loss.

## Delivery boundary

Feature branch: `feat/cinematic-experience`, based on main `b9b4a4617af3229f1951c48b8b862830730e4ed0`. Organization write permissions are unavailable to the local authenticated account; review delivery uses the public fork `ijina91/snc-labs-cinematic-review` and a cross-repository PR into `snclabs/snclabs.github.io:main`. No production merge or deployment is authorized by this delivery. The PR workflow builds/tests only; deployment jobs also reject non-main manual dispatch.

Submitted [PR #1](https://github.com/snclabs/snclabs.github.io/pull/1). At initial submission GitHub Actions returned `action_required`: the first external-fork workflow requires repository-maintainer approval. Remote CI has not passed or deployed; local regression evidence remains available. Main was verified unchanged after PR creation.

QA, performance measurements, visual comparison and remaining verification limits are recorded separately. Local ignored artifacts contain raw audit JSON/HTML, test traces and a short walkthrough video.
