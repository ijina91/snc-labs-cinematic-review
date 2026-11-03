# QA report

> 2026-11-04 변경 상태: 체크마크 3D 연출을 제거하고 외부 무료 영상 제작으로 전환 중입니다. 현재는 새 원본 첫 프레임을 적용한 상태이며, 영상은 사람 인증 대기입니다. 아래 기존 WebGL 구현·60건 QA·Lighthouse 수치는 이전 커밋 cc6a428의 기록입니다. 현재 변경 사항과 실제 생성 상태는 [영상 제작 상태](docs/video/PRODUCTION_STATUS.md)를 확인하세요. 새 준비본의 자동 검증은 60/60 통과했습니다(아래 기록과 구분). [현재 QA 원본](docs/verification/qa-film-preparation.json). 외부 영상 원본·재생·성능 검증은 미완료입니다.


Dates: 2026-11-03–04 (KST). Tested production build on Windows using Playwright 1.64.1, Microsoft Edge 156, axe-core through @axe-core/playwright 4.14.0. Four viewports: 390×844, 768×1080, 1440×1080 and 1920×1080. Mobile/touch emulation is enabled where relevant.

## Automated coverage

Final six-chapter regression: **60/60 passed**, 15 cases at each viewport, zero skipped/flaky/unexpected cases (9.1 minutes). Full-page axe and the light/navy story scans report zero violations in the tested WCAG tags. No critical defect remains in the tested scope. The earlier interrupted run's tablet anchor/SVG failure was corrected and verified before this full rerun.

Twelve cases per viewport cover preserved text/assets/SEO/links and overflow; keyboard disclosures and mobile touch/menu focus; WCAG 2 A/AA and 2.1 AA axe scans; safe public project rendering and filtering; failure/retry; loading/empty states; actual seven-second request deadline; reduced motion and live preference changes; no JavaScript; blocked optional motion module; reversible SVG scroll progression; and the white initial frame followed by blue progression.

Three additional cases per viewport exercise every story chapter, upward reversal, keyboard scene controls, light/navy scene axe scans, optional WebGL-module failure, reduced-motion restoration of all text, and deferral of 3D requests until scroll. Low-core/save-data hardware is allowed to choose the specified poster path. Separate visual probes confirmed actual WebGL rendering at 390, 768 and 1440px; the full suite also checks 1920px interaction/layout.

The fullscreen revision adds explicit assertions that the hero starts at x=0, spans the viewport width, and fills at least the available viewport height below the header. Layered sky-blue backgrounds are also reviewed manually for small-text contrast; scene captions/navigation/footer use ink rather than the former muted gray.

The opening frame also asserts the check's faint 0.08 opacity before the optional animation module is released, then full opacity at completion. This prevents a full-color graphic flashing before the white-to-blue sequence starts. No-JS and failed-animation tests verify that their static graphic remains fully visible. The no-JS contexts explicitly use each project's viewport/touch settings.

Project success/error color contrast is checked in addition to the full-page axe scan. Tests assert no page exceptions, broken local asset requests, missing anchor targets or horizontal overflow in the tested chapters. Native phone href and all three service-to-contact links are verified. Tests do not initiate a telephone call.

Commands: `npm ci`, `npm test`, `npm audit --audit-level=moderate`, `git diff --check`. Raw evidence: `artifacts/qa/results.json`, `axe-{width}.json`, four full-page PNGs and retained traces on failure. CI repeats npm ci/build/Playwright on Ubuntu Chromium and uploads its own results; a local pass is not a claim that a pending remote run passed.

## Defects and corrections

| Finding | Cause and correction | Verification |
|---|---|---|
| Low-contrast project/status text | Light slate tokens missed AA; darkened project text, service labels, slashes and header arrow | Full-page and project-state axe rescans |
| Focus lost after retry | Setting disabled on the focused native button moved focus to the body; use aria-disabled with an in-flight guard, then focus result link before hiding | Explicit focused-result assertion at all four widths |
| Expensive startup measurements | All ScrollTriggers and font transforms initialized together; split hero/scroll imports, initialize nearby chapters after scroll, await settled fonts | Lighthouse repeated with the final production build |
| Back-to-top target ineffective | Sticky header target did not reliably move document scroll | Moved top anchor to body; contact-to-logo assertion |
| Story initialization shifted later anchors | Static chapters reserved 6 viewports but enhancement used 6.6; reserve the same 6.6-height layout before initialization | About-position delta asserted below 2px; tablet SVG/reversal focused rerun passed |
| Rigid business geometry and broken-looking ring | User review found pillar/board repetition and segmented/aliased edges; replace with asymmetric continuous ribbons/curved interfaces, join normals, enable MSAA and higher density | Fresh chapter captures and native-scroll visual review |
| Mobile passed-object overlap | Wider mobile camera distance left the preceding model in front of the next scene | Cull passed objects; inspect 390/768px chapters |
| One axe transport failure in an earlier concurrent run | JSON transport error, with no corresponding axe violations | Isolated rescan passed; final suite uses one worker |

The initial regression failures and intermediate measurements are retained locally. They are not presented as successful runs. Scroll targets in the test harness were also corrected to inspect chapter content rather than relying on a sticky header's position.

## Manual positive and negative passes

Separate criteria passes are documented in BEFORE_AFTER_COMPARISON.md. Positive pass assesses hierarchy, brand, whitespace, responsive narrative and inquiry clarity. Negative pass examines all four page captures, clipping, overlap, asset loading, distracting effects, contact links, focus, SVG direction and fallback states. Corrected concrete defects above; no unresolved critical defect was found within tested scope. These are separate passes by the implementing agent, not independent reviewers or an unavailable Impeccable tool.

## Quality rubric

Internal target: 99/100; scoring cannot override failed checks.

| Category | Weight | Assessed |
|---|---:|---:|
| Verified content and brand | 20 | 20 |
| Layout and visual hierarchy | 20 | 20 |
| Inquiry and functional behavior | 20 | 20 |
| Accessibility and resilience | 15 | 14 |
| Purposeful motion and cleanup | 10 | 10 |
| Measured performance | 10 | 9 |
| Reviewable delivery and deployment boundary | 5 | 5 |
| Total | 100 | 98 |

98 is an internal assessment, not an external benchmark. The 99 target is not claimed: manual screen-reader/physical-device verification and real-user INP remain unverified. The final six-chapter synthetic interaction probe reached 200ms mobile / 192ms desktop under 4× slowdown with WebGL active. The mobile median lab LCP misses 2.5s by approximately 5ms; the performance report records every sample. No cosmetic change was made merely to increase a subjective score.

## Limits and production boundary

Automated axe is not a complete accessibility certification. Safari, Firefox, physical phones, assistive-technology sessions and field Web Vitals have not been tested here. GitHub states use controlled fixtures for repeatability; production uses the real unauthenticated public endpoint with a safe fallback. GitHub Pages build/output and root paths are verified locally; a production rollout/real deployed redesign check is intentionally pending user approval. No main merge or production deploy is part of this delivery.

Remote status at initial [PR #1](https://github.com/snclabs/snclabs.github.io/pull/1) submission: GitHub Actions `action_required`, awaiting repository-maintainer approval for an external-fork workflow. Remote Ubuntu/Chromium execution is therefore unverified; reported passes are local Edge results.


## 2026-11-04 최종 정지 배경 준비본

전체 회귀 60/60 통과 후 배경을 전체 stage에 배치하는 시각 수정을 진행했다. 이 수정의 추가 16건 중 15건은 첫 실행에서 통과했고, 모바일 키보드 검사는 native PageUp이 끝나기 전에 다음 Enter를 입력해 실패했다. 기본 스크롤이 안정된 뒤 다음 키보드 동작을 수행하도록 검사 순서를 수정했고, 동일 키보드 흐름을 네 화면 크기에서 다시 실행해 4/4 통과했다. 실패한 16건 실행을 16/16 성공으로 표기하지 않는다. 현재 소스의 레이아웃·axe·화이트 진입·6개 장면은 추가 검사와 재검사로 확인했다. 실제 외부 영상 원본은 없으므로 영상 품질·재생·성능은 검증하지 않았다.
