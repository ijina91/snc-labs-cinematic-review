# Third-party assets and licenses

| Asset | Source | License / use |
|---|---|---|
| SNC logo and check motif | User-provided business card / existing site | Retain existing company identity. All ribbon and connection SVGs authored for this site; no reference-video assets copied. |
| Korean text font | [Pretendard 1.3.9](https://github.com/orioncactus/pretendard/tree/v1.3.9) / npm distribution | SIL OFL 1.1. Local subsets renamed **SNC Sans** (including internal font names) because Pretendard is a reserved font name. Full copyright/license notice in `public/assets/fonts/OFL-Pretendard.txt`. |
| Latin display font | [Inter Tight / Google Fonts](https://github.com/google/fonts/tree/main/ofl/intertight) | SIL OFL 1.1. Local subset renamed **SNC Display**; full notice in `public/assets/fonts/OFL-InterTight.txt`. |
| Animation | [GSAP 3.15.0 standard license](https://gsap.com/community/standard-license/) | No-charge standard license; corporate website use falls under permitted website implementation. Not used as a competing visual animation builder. Package notices retained in distributed code. |
| 3D rendering | [Three.js 0.187.0](https://github.com/mrdoob/three.js) | MIT. License retained at `public/assets/licenses/three-LICENSE.txt`. RoomEnvironment, RoundedBoxGeometry and ParametricGeometry are package components under that license. Geometry and studio environment are generated locally; no external model/HDR/video asset is used. |
| Build / test tooling | Vite, Playwright, axe-core, Lighthouse | Development tooling; package license metadata remains in installed dependencies. No testing engine is sent to visitors. |

Font sources were downloaded from the official Pretendard npm package and Google Fonts repository. `scripts/prepare-fonts.py` reproduces the subset/rename step using fonttools + Brotli in an isolated, ignored local environment. Generated WOFF2 files are committed, so CI does not need Python or font download access.

No stock photos, external illustrations, customer logos, social-video clips or undisclosed server assets are used. The Instagram reel was viewed for composition/timing analysis; none of its media is redistributed. Fonts and code are self-hosted; the only runtime external request is the unauthenticated public GitHub repository endpoint.


## SNC 공간 배경 (2026-11-04)

이번 프로젝트에서 내장 imagegen으로 새로 생성한 원본 장면을 WebP로 압축했습니다. 타인·스톡·공급자 예시 자산은 포함하지 않았습니다. 외부 무료 영상 생성은 아직 사람 인증 대기이며, 실제 영상 산출물이 배포 소스에 포함되지 않았습니다. [제작 상태 및 조건](docs/video/PRODUCTION_STATUS.md)을 참고하세요.
