# SNC Labs

사용자 제공 01~07 프레임을 기준으로 검은 배경의 Blue Glass 디자인을 제작 중입니다. [디자인 방향](docs/BLUE_GLASS_DESIGN.md), [현재 검증 상태](docs/BLUE_GLASS_QA.md), [Pinterest·코드 모션 참고 기록](docs/REFERENCE_MOODBOARD_V2.md). 이전 운영 버전의 제작 기록과 새 제작의 완료 여부를 구분합니다.

SNC의 회사 소개와 ESH·안전작업허가 관련 시스템 개발, SAP & Enterprise, Web Engineering, 공개 GitHub 활동을 소개하는 Vite + Vanilla JS 웹사이트입니다.

## 실행 및 검증

```sh
npm ci
npm run dev
npm test
npm run preview
```

`npm test`는 빌드, 정적 산출물 검증, 4개 해상도의 Playwright/axe 검증을 실행합니다. 로컬 Windows에서는 설치된 Edge, CI에서는 Playwright Chromium을 사용합니다. CI 외 환경에서 Chromium을 사용하려면 `CI=1`을 설정하고 브라우저를 준비하세요.

별도 터미널에서 `npm run preview`를 실행한 뒤 다음 명령을 사용할 수 있습니다.

```sh
npm run performance
npm run probe
npm run capture
```

기본 검증 주소는 `http://127.0.0.1:4173/`입니다. `PERFORMANCE_URL`, `PREVIEW_URL`로 변경할 수 있습니다. 성능 검증은 Edge 경로를 기본 사용하며 `CHROME_PATH`로 변경합니다. 성능 측정 중 다른 브라우저 테스트를 동시에 실행하지 마세요. `probe` 결과는 합성 Event Timing이며 실제 사용자 INP가 아닙니다.

## 설계

첫 화면은 화면 끝까지 펼쳐지는 뷰포트 높이의 구성이며, 화이트에서 브랜드 블루가 점진적으로 나타나는 2.25초 이내의 진입 연출을 사용합니다. 데스크톱은 GSAP, 모바일은 브라우저 기본 투명도 애니메이션을 사용하며 GSAP은 스크롤 전까지 로딩하지 않습니다. 비대칭 블루 건축 공간, 투명한 유리와 넓은 타이포그래피 여백을 조합합니다. 회전하는 체크마크와 외곽 고리, 옆쪽 점 내비게이션과 장면 번호는 제거했습니다. 일반 스크롤을 유지하며 모션 감소 설정에서는 정적 콘텐츠를 표시합니다. 폰트는 자체 호스팅합니다. 회사 소개, 서비스와 전화 문의는 JavaScript 없이도 표시됩니다.

서비스 데이터는 `src/data/services.js`, 상호작용은 `src/components/`, 모션은 `src/animations/`, 디자인 토큰은 `src/styles/tokens.css`에서 관리합니다. 서비스와 로고는 Vite 변환으로 정적 HTML에 포함됩니다. GitHub API는 공개 데이터만 사용하며 토큰이 필요하지 않습니다. 개인 연락처, 미확인 고객명·실적·미출시 서비스는 게시하지 않습니다.

첫 화면 뒤에는 회사 소개 → ESH → SAP → Web → 연결 → 문의로 이어지는 6개 장면이 있습니다. `src/data/journey.js`의 문구도 정적 HTML에 포함됩니다. 4개 화면 높이의 구간(고정 화면을 제외한 실제 이동 3개 화면, 문구당 약 반 화면)의 기본 스크롤에 맞춰 실제 영상의 재생 위치가 이동하며, 위로 스크롤하면 역순으로 돌아갑니다. 바로 읽기·문의 링크로 일반 콘텐츠에 이동할 수 있습니다. 영상은 사용자 스크롤 후 해당 구간 근처에서만 불러옵니다. 저사양/데이터 절약·영상 오류 시 원본 정지 배경, 모션 감소·JavaScript 비활성화 시 일반 읽기 흐름을 제공합니다. 자동재생·반복재생·스크롤 잠금은 사용하지 않습니다. Three.js와 기존 3D 장면 모듈은 제거했습니다.

## 문서

- [레퍼런스 및 스킬 확인](REFERENCE_ANALYSIS.md)
- [기존 사이트 분석](CURRENT_SITE_AUDIT.md)
- [디자인 시스템](DESIGN_SYSTEM.md)
- [모션 스토리보드](MOTION_STORYBOARD.md)
- [구현 보고서](IMPLEMENTATION_REPORT.md)
- [QA 보고서](QA_REPORT.md)
- [성능 보고서](PERFORMANCE_REPORT.md)
- [전후 비교](BEFORE_AFTER_COMPARISON.md)
- [자산 라이선스](LICENSES.md)

## GitHub Pages

운영 주소: https://snclabs.github.io/

Pages Source는 GitHub Actions입니다. 기존 `main` push/수동 배포를 유지하며 두 배포 job 모두 main ref로 제한합니다. 작업 브랜치와 PR에서는 검증만 수행합니다. **이 리디자인은 사용자 승인 전 main 병합 및 운영 배포를 하지 않습니다.**

`docs/previews/`는 검토용 캡처입니다. `artifacts/`의 원본 QA/성능 결과와 영상, 폰트 제작 환경은 무시되며 커밋이나 배포에 포함하지 않습니다. 폰트 재생성은 일반 빌드에 필요하지 않습니다. 절차는 LICENSES.md와 `scripts/prepare-fonts.py`를 참고하세요.
