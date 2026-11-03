# Reference analysis

> 2026-11-04 변경 상태: 체크마크 3D 연출을 제거하고 외부 무료 영상 제작으로 전환 중입니다. 현재는 새 원본 첫 프레임을 적용한 상태이며, 영상은 사람 인증 대기입니다. 아래 기존 WebGL 구현·60건 QA·Lighthouse 수치는 이전 커밋 cc6a428의 기록입니다. 현재 변경 사항과 실제 생성 상태는 [영상 제작 상태](docs/video/PRODUCTION_STATUS.md)를 확인하세요. 새 검증 결과는 별도로 기록합니다.


Reference: https://www.instagram.com/reel/DfRaUziOLLU/

## What was actually observed

After the user opened the reel, the in-app browser successfully exposed its playing video. Native media metadata reported **12.421223 seconds**, 1440×2560. Watched one full loop and inspected screenshots at approximately 1.19, 3.88, 4.01, 6.28, 8.80 and 11.14 seconds. Earlier HTTP-only attempts could not play it; the successful browser observation supersedes the earlier unavailable-reference report.

| Playback region | Observed composition |
|---|---|
| Around 1.2s | A luminous fragmented ring occupies a large dark canvas; oversized typography anchors the lower view |
| Around 3.9–4.0s | Blocks/fragments move through depth as the camera approaches the structure |
| Around 6.3s | Architectural columns and a small central object form a passage |
| Around 8.8s | Camera travel continues between tall structures; connected elements recede into depth |
| Around 11.1s | A quieter dark scene introduces a new large message |

The reel is a filmed monitor with editorial overlay. Its total duration is measurable; the underlying site's full length, code, frame rate and exact scroll-to-animation implementation are not established by this clip. Do not confuse a twelve-second edited reel with a required twelve-second website.

## SNC translation

Preserve the reference's large scale, spatial continuity, camera movement and scene-to-scene narrative. Author a six-chapter SNC introduction: company → ESH → SAP → Web → connection → inquiry. A native-scroll stage spans 6.6 viewport heights, with readable holds and camera transitions. The viewer controls pace and can reverse, jump chapters, or skip to normal company information.

Keep SNC white, primary blue, sky blue, navy and ink. Do not copy the red/black palette, crypto subject matter, typography, video/model assets, branding or claims. All geometry is authored in code for SNC. No downloaded reference media enters the repository or deployed site.

User review refined the geometry: replace regular pillars/stacked boards with asymmetric protective curves, interwoven data ribbons and curved interface fragments. Replace the initially segmented signature ring with a seamless smooth ribbon and improve anti-aliasing/render resolution.

## Skills and actual tools

Installed skills were searched with hidden files/junctions. Applied frontend-design; read agent-browser discovery guidance, related playwright-browser-test/playwright-e2e contracts, and computer-use/browser documentation. Actual reference inspection used the in-app browser. Actual implementation uses GSAP and Three.js; verification uses Playwright, axe and Lighthouse. The agent-browser CLI is absent.

Exact unavailable skills: cinematic-web-experience, video-to-superprompt, ui-ux-pro-max, impeccable, gsap-skills, scroll-craft, motion-design-agent-skills, threejs-skills, playwright, axe-core, lighthouse. No unavailable skill is claimed as executed. Manual storyboard/design review and real test tools are the alternatives.

Three.js is justified by the actual perspective-camera journey and original curved geometry; it loads after scroll near the introduction. No React or animation-plugin-suite migration. Low-power, reduced-motion and WebGL-failure paths keep the introduction accessible.
