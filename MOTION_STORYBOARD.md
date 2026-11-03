# Motion storyboard

The hero remains a short white-to-blue entrance (2.1s atmosphere, light sweep complete by 2.25s). The longer experience is a **six-chapter native-scroll introduction** after it, rather than a timed loading screen. The reference reel's measured 12.42s is an edited demonstration, not the site's required reading time.

## Six-chapter introduction

The stage occupies 6.6 available viewport heights (viewport minus header). CSS sticky preserves native wheel, touch, keyboard and anchor behavior. Each chapter holds its copy while the camera settles; the final portion of each segment travels toward the next. Scroll upward to reverse. Six keyboard-accessible scene buttons, a direct company-information link and a contact link provide independent exits. No wheel interception, custom scrolling engine or forced countdown.

| Chapter | Narrative | Original geometry and movement |
|---|---|---|
| SNC | Understand business before implementation | Dimensional SNC check, seamless sculpted blue loop, restrained studio reflections |
| ESH | Systems close to field work and work-permit development | Asymmetric protective ribbon, varying-depth modules, camera travels through its opening |
| SAP | Connect business and data | Three interwoven streams and a faceted core; no pole/stacked-board motif |
| Web | Make complex functions understandable | Curved interface fragments at different angles/depths connected by one flowing ribbon |
| Connection | Bring verified capabilities together | Three continuous paths gather around the SNC check |
| Next | Introduce the next project conversation | Return to the clean signature composition and inquiry action |

The palette shifts between light blue/white and two navy chapters. Text is protected by a matching gradient; chapter navigation has its own readable surface. Mobile moves the visual to the upper scene and copy below, and culls passed objects before they can obstruct the camera.

## Rendering and lifecycle

The observer waits for user scrolling near the story before importing its controller/Three.js module. GPU resources initialize only while the story is visible. Render only on progress changes, resize and a short settling tail; no perpetual animation loop. Pause when offscreen or the document is hidden. Dispose renderer, geometry, materials, environment texture, observers and listeners on cleanup. Failed WebGL/context loss uses the SVG poster with the same scroll narrative. Low-core/save-data devices avoid importing Three.js. Reduced motion restores all six chapters in normal reading flow. Static HTML includes every chapter when JavaScript is disabled.

Ring geometry uses joined normals and continuous surfaces, MSAA, and higher pixel density with a 3M-pixel soft budget that never falls below native 1×. All source graphics are authored for SNC. No particles, external HDR/photo/video assets or reference models.

## Remaining chapters

About headings use restrained GSAP reveals; supporting prose remains stationary. Native service details explain the three verified areas. A reversible SVG diagram connects business to systems and operation. Public GitHub states remain explicit and safe. The final phone CTA stays direct and accessible. Each animation has separate DOM ownership and is reverted on media/lifecycle changes.
