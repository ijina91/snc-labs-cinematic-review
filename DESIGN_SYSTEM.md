# SNC Premium Web Experience design system

## Tokens

Primary blue `#216BE4`; sky `#36A4ED`; deep navy `#21386D`; ink `#182334`; white `#FFFFFF`. Supporting surfaces are blue/white tints; text uses neutral/slate shades tested for contrast. No green or unrelated accent palette.

Typography: locally hosted, licensed/subset Korean sans and condensed Latin display. Large Korean title (desktop approximately 88–112px; mobile 44–56px), section titles 38–64px; body 15–18px. Short readable line lengths. Font fallback and explicit hero/graphic dimensions prevent layout shifts.

Layout: 1280px maximum content; 24/40/64px adaptive gutters. White panoramic hero, open company-introduction grid, three independent service components, a contrasting navy technology chapter, GitHub editorial/panel split, and large white telephone CTA.

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
