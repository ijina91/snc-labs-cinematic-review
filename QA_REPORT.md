# QA report

Date: 2026-11-03. Tested production build on Windows using Playwright 1.64.1, Microsoft Edge 156, axe-core through @axe-core/playwright 4.14.0. Four viewports: 390×844, 768×1080, 1440×1080 and 1920×1080. Mobile/touch emulation is enabled where relevant.

## Automated coverage

Final full regression: **48/48 passed**, 12 cases at each of the four viewports. Full-page axe scans report **zero violations** in the tested WCAG tags; project success/error contrast checks also pass. No critical defect remains in the tested scope.

Twelve cases per viewport cover preserved text/assets/SEO/links and overflow; keyboard disclosures and mobile touch/menu focus; WCAG 2 A/AA and 2.1 AA axe scans; safe public project rendering and filtering; failure/retry; loading/empty states; actual seven-second request deadline; reduced motion and live preference changes; no JavaScript; blocked optional motion module; reversible SVG scroll progression; and the white initial frame followed by blue progression.

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

98 is an internal assessment, not an external benchmark. The 99 target is not claimed: manual screen-reader/physical-device verification and real-user INP remain unverified. The latest fullscreen mobile synthetic interaction probe reached 256ms under 4× slowdown; the performance report records this limit and every Lighthouse sample. No cosmetic change was made merely to increase a subjective score.

## Limits and production boundary

Automated axe is not a complete accessibility certification. Safari, Firefox, physical phones, assistive-technology sessions and field Web Vitals have not been tested here. GitHub states use controlled fixtures for repeatability; production uses the real unauthenticated public endpoint with a safe fallback. GitHub Pages build/output and root paths are verified locally; a production rollout/real deployed redesign check is intentionally pending user approval. No main merge or production deploy is part of this delivery.

Remote status at initial [PR #1](https://github.com/snclabs/snclabs.github.io/pull/1) submission: GitHub Actions `action_required`, awaiting repository-maintainer approval for an external-fork workflow. Remote Ubuntu/Chromium execution is therefore unverified; the 48 passes above are the completed local Edge run.
