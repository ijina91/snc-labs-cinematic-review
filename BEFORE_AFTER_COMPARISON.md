# Before / after comparison

Baseline: production main `b9b4a4617af3229f1951c48b8b862830730e4ed0`. Baseline screenshots were captured from the unchanged public site; redesign screenshots are from the local production build. GitHub results in redesign captures are deliberately controlled empty-state fixtures, not fabricated projects.

| Area | Before | After |
|---|---|---|
| First impression | Static white/blue two-column composition | Panoramic white stage; progressive blue light; dimensional SNC check and finite 1.7s timeline |
| Identity | Company/service introduction | Same verified introduction, larger hierarchy and generous spacing |
| Expertise | Native service disclosures | Data-backed static service components, always-visible inquiry links, native keyboard details |
| Technology | No explanatory chapter | Responsive SVG connects ESH, SAP and Web work to SNC and system operation; upward scrolling reverses paths |
| Public projects | Silent fallback on API failure | Explicit loading, empty, success, timeout/error and focused retry; safe public-only metadata |
| Contact | Approved phone link | Large final CTA and mobile telephone target with the same approved phone |
| Resilience | Existing reduced-motion/menu basics | Preserved basics plus no-JS static rendering, failed-animation fallback and lifecycle cleanup |
| Assets | External font loading | Licensed, locally hosted subsets; no stock imagery or copied reference media |
| Delivery | Main deployment workflow | Same main deployment plus branch guards and PR-only quality workflow |

## Captures

- [Before, desktop full page](docs/previews/before-desktop.png)
- [Before, mobile full page](docs/previews/before-mobile.png)
- [After, desktop first view](docs/previews/desktop.png)
- [After, mobile first view](docs/previews/mobile.png)
- [After, technology chapter](docs/previews/technology.png)

Local walkthrough: `artifacts/cinematic-preview.webm`. Static captures cannot demonstrate timing or the first white frame. The Playwright white-frame test explicitly holds the optional animation module, verifies white/readable content, releases it and observes blue-opacity progression. SVG tests verify both scroll directions. Capture scripts and test sources are included for reproduction.

## Separate visual review passes

Positive pass: the SNC check is a recognizable brand anchor, white space and large Korean typography establish hierarchy, the navy diagram gives the page a purposeful contrast, and each service leads to a real inquiry action. Mobile rearranges the diagram vertically rather than squeezing desktop nodes. No green, client logos or invented statistics appear.

Negative pass: examined all four full-page layouts for clipping, horizontal overflow, excessive repetition and unreadable small labels; checked desktop/mobile chapter captures and native disclosure states. Identified low-contrast project/status labels and corrected their tokens. Removed unnecessary hero perspective and moving body copy after measured startup cost. Corrected retry focus loss caused by disabling a focused native button. No unresolved critical visual or interaction defect was found in the tested states.

These are two separate criteria passes by the implementing agent, not independent people or an executed Impeccable skill. Exact unavailable tools and limits are disclosed in REFERENCE_ANALYSIS.md and QA_REPORT.md.
