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


## 2026-11-05: 최신 검은 배경 작업의 기준

이번 변경의 운영 기준은 `main`의 `7cdbcca`(기존 모바일·폴드 경계 수정 완료 버전)이고 작업 브랜치는 `design/blue-glass-frames`다. 위 `b9b4a46` 분석은 최초 요구사항 당시의 감사 기록이다. 이후 운영 버전의 화이트·블루 및 15.5초 영화와 현재 사용자 제공 01~07의 검은 배경·35초 마스터를 구분한다.

현재 저장소의 Vite + HTML/CSS + Vanilla JS, GSAP, 정적 서비스·회사 소개, GitHub 상태/재시도, 대표전화·모바일 메뉴·SEO·폰트·Pages 구조를 유지했다. 기존 모바일 부모 클리핑, SVH/LVH 분리와 폴드 읽기 위치 보존을 새 일곱 패널에도 유지한다. 첫 화면도 같은 단일 영상 시간축에 포함하며 React나 Three.js를 추가하지 않았다. 상세 구현·검증 및 한계는 최신 구현·QA·성능 보고서에서 확인한다. 이 새 디자인의 main 병합과 운영 배포는 사용자 최종 승인 전까지 진행하지 않는다.
