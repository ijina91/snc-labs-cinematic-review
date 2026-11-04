# Third-party assets and licenses

| Asset | Source | License / use |
|---|---|---|
| SNC logo and check motif | User-provided business card / existing site | Retain existing company identity. All ribbon and connection SVGs authored for this site; no reference-video assets copied. |
| Korean text font | [Pretendard 1.3.9](https://github.com/orioncactus/pretendard/tree/v1.3.9) / npm distribution | SIL OFL 1.1. Local subsets renamed **SNC Sans** (including internal font names) because Pretendard is a reserved font name. Full copyright/license notice in `public/assets/fonts/OFL-Pretendard.txt`. |
| Latin display font | [Inter Tight / Google Fonts](https://github.com/google/fonts/tree/main/ofl/intertight) | SIL OFL 1.1. Local subset renamed **SNC Display**; full notice in `public/assets/fonts/OFL-InterTight.txt`. |
| Animation | [GSAP 3.15.0 standard license](https://gsap.com/community/standard-license/) | No-charge standard license; corporate website use falls under permitted website implementation. Not used as a competing visual animation builder. Package notices retained in distributed code. |
| Earlier 3D prototype | [Three.js 0.187.0](https://github.com/mrdoob/three.js) | MIT notice retained at `public/assets/licenses/three-LICENSE.txt` for the earlier prototype. Three.js and its scene module were removed from the current runtime and dependencies. |
| Build / test tooling | Vite, Playwright, axe-core, Lighthouse | Development tooling; package license metadata remains in installed dependencies. No testing engine is sent to visitors. |

Font sources were downloaded from the official Pretendard npm package and Google Fonts repository. `scripts/prepare-fonts.py` reproduces the subset/rename step using fonttools + Brotli in an isolated, ignored local environment. Generated WOFF2 files are committed, so CI does not need Python or font download access.

No stock photos, external illustrations, customer logos, social-video clips or undisclosed server assets are used. The Instagram reel was viewed for composition/timing analysis; none of its media is redistributed. Fonts and code are self-hosted; the only runtime external request is the unauthenticated public GitHub repository endpoint.


## SNC 공간 배경 (2026-11-04)

이번 프로젝트에서 내장 imagegen으로 새로 생성한 원본 장면을 WebP로 압축했습니다. 이 원본과 각 마지막 프레임을 기준으로 LoreMotion 무료 MiniMax H3 영상 세 구간을 직접 생성해 15.5초 MP4로 편집했습니다. 초기 LTX 출력 1편은 품질 검수에서 미채택했습니다. 타인·스톡·공급자 예시·레퍼런스 영상 자산은 포함하지 않았습니다. LoreMotion 약관과 현재 FAQ의 생성물 상업 이용·워터마크 없음 안내를 확인했으며 모델 조건을 전제로 합니다. [제작 기록과 권리 안내](docs/video/PRODUCTION_STATUS.md), [작업 ID·사양·해시](docs/verification/film.json)를 참고하세요.
