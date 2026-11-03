# SNC Premium Web Experience design system

## Scroll introduction

Maintain SNC white/blue/sky/navy/ink while extending the experience through six native-scroll chapters. The visual language is sculptural systems: a smooth signature loop, an asymmetric protective envelope, interwoven data flows and curved interface fragments. Reject repeated pillars/boards, checkerboard ring segments, coarse edges and meaningless particles. Continuous ribbon normals, MSAA and native-or-higher render resolution preserve clean surfaces. Use generated studio reflections rather than external imagery.

Copy sits left of the 3D view on desktop and below it on mobile. Readable gradient plates, independent chapter-navigation surfaces and a permanent inquiry exit protect usability. Six chapters use explicit sequence indicators; users control their reading time. Two navy scenes give contrast within a white/blue overall site. Reduced-motion/static reading preserves every factual paragraph.

## Fullscreen revision — 2026-11-03

User requests a more spectacular full-screen composition while retaining SNC color. Replace the rounded inset hero with an edge-to-edge, viewport-height stage. Keep white at entry; accumulate sky/primary blue across the full background. Enlarged dimensional brand check occupies the right half, with SNC outline typography and concentric architectural curves behind it. One finite light sweep introduces depth; no infinite particles or neon. Header remains legible. Main headline stays left aligned and immediately readable. Technology chapter also fills at least a viewport. Mobile becomes a vertical text/graphic scene rather than a scaled desktop canvas.

Tokens remain #FFFFFF / #216BE4 / #36A4ED / #21386D / #182334, with SNC Sans for Korean and SNC Display for Latin. Scene gutters 6.1vw on desktop, 40/28px on tablet/mobile; hero type 7.4vw desktop and 12.2vw mobile. Layout: `[ full-width header ] / [ large message | oversized check, blue atmosphere ] / [ scene footer ]`. The specific SNC check carries the visual impact; reject a generic globe, stock video or WebGL effect.

## Tokens

Primary blue `#216BE4`; sky `#36A4ED`; deep navy `#21386D`; ink `#182334`; white `#FFFFFF`. Supporting surfaces are blue/white tints; text uses neutral/slate shades tested for contrast. No green or unrelated accent palette.

Typography: locally hosted, licensed/subset Korean sans and condensed Latin display. Fullscreen Korean title (desktop 70–145px; mobile 40–68px), section titles 35–56px; body 12–18px depending on viewport. Short readable line lengths. Font fallback and explicit hero/graphic dimensions prevent layout shifts.

Layout: 1280px maximum reading content; 24/40/64px adaptive gutters. The hero deliberately exceeds that grid to fill the viewport width with 6.1vw scene gutters. Open company-introduction grid, three independent service components, a viewport-height navy technology chapter, GitHub editorial/panel split, and large white telephone CTA.

```text
logo          navigation                 contact
[ large headline       folded SNC ribbon        ]
[ description / CTAs              scroll cue     ]
company idea                  company description
ESH component       SAP component       Web component
[ navy: business → SNC → systems → operations    ]
GitHub introduction                   project panel
large contact message                 phone link
```

## Distinctive principle and self-critique

The brand check, rather than a generic globe/server cube, is the central graphic. Its two joined strokes represent the brief's connection between business context and technical implementation. Keep supporting surfaces quiet; avoid repeating the hero animation on every card. Use deep navy only for the explanatory technology chapter rather than converting the whole site to dark mode.

Rejected from the initial plan: identical fade-up effects for all sections and continuous floating graphics. Replace with one finite hero timeline, restrained heading reveals, a scroll-driven SVG explanation, and responsive user-triggered details/hover states.

## Interaction and accessibility

At least 44px interactive targets, visible focus, semantic headings/landmarks, native service disclosures, polite status updates, no hidden-by-default content. The no-JS path retains service content, phone links, navigation links and GitHub fallback. Reduced motion disables decorative entrances/parallax/scrubbing.
