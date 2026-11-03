# Motion storyboard

All times are authored design targets, not reference-video observations. User steering: begin on white and introduce blue progressively, like a short cinematic sequence. The final hero uses a 1.7s finite light wash; text is readable immediately. A separate nested tint deepens with native scrolling, then the navy technology chapter provides contrast.

| Chapter | Purpose | Implementation | Fallback |
|---|---|---|---|
| Hero, 0–1.7s | Introduce SNC's connection motif and message | One GSAP timeline: white → drifting blue light wash → ribbon surface and brand → title lines → CTAs/cue. Text starts readable in HTML; the supporting paragraph stays stationary. | Static fully visible composition |
| Hero exit | Connect first view to company introduction | Small transform on a dedicated nested graphic group; no pinning. Intro and scroll motion own different elements. | Static ribbon |
| About | Pace the company explanation | ScrollTrigger mask/transform reveal of heading lines; supporting paragraph remains readable. | Normal document flow |
| Services | Explain the three verified areas | Native details interaction; CSS hover highlight and subtle icon transform. No artificial services or fake performance stats. | Native keyboard disclosures |
| Technology | Explain business-to-system relationships | ScrollTrigger scrub of three SVG paths and node emphasis; reversible on upward scrolling. Ordinary scroll, no lock. | Complete static diagram, mobile vertical composition |
| GitHub | Make public data status understandable | Loading, projects, empty, timeout/error and retry states. No decorative infinite animation. | Direct GitHub link |
| Contact | Prioritize the real telephone action | Short arrow/button response to hover/focus. | Static accessible phone link |

GSAP scoped context and matchMedia contexts are reverted on cleanup/preference changes. No overlapping transform/opacity ownership. Mobile/save-data/low-core devices omit parallax. Use transform/opacity and batched SVG measurements; no per-frame layout reads. Page lifecycle cleanup supports BFCache. No custom cursor or native scrolling replacement.

The hero waits for local fonts and two paint frames before GSAP measures transforms. ScrollTrigger is imported only after native scrolling starts; IntersectionObserver initializes nearby chapters. This separates first-paint work from below-fold choreography. Async initialization is generation-guarded so preference changes cannot resurrect disposed motion.
