# SNC Labs

사용자 제공 01~07 프레임을 기준으로 검은 배경의 Blue Glass 디자인과 35초 연속 영상을 구현했습니다. [디자인 방향](docs/BLUE_GLASS_DESIGN.md), [현재 검증 상태](docs/BLUE_GLASS_QA.md), [Pinterest·코드 모션 참고 기록](docs/REFERENCE_MOODBOARD_V2.md). 이전 운영 버전의 제작 기록과 새 제작의 완료 여부를 구분합니다.

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

첫 화면부터 검은 배경과 블루 유리 건축 공간으로 구성합니다. 사용자 제공 01~07 순서의 일곱 패널이 하나의 영상 플레이어를 공유합니다. 회전하는 체크마크·외곽 고리·옆쪽 점 내비게이션·장면 번호는 사용하지 않습니다. 실제 HTML 타이포그래피와 CTA를 영상과 분리하고, 일반 스크롤과 모션 감소 설정을 지원합니다. 폰트는 자체 호스팅하며 회사 소개·서비스·전화 문의는 JavaScript 없이도 표시됩니다.

서비스 데이터는 `src/data/services.js`, 상호작용은 `src/components/`, 모션은 `src/animations/`, 디자인 토큰은 `src/styles/tokens.css`에서 관리합니다. 서비스와 로고는 Vite 변환으로 정적 HTML에 포함됩니다. GitHub API는 공개 데이터만 사용하며 토큰이 필요하지 않습니다. 개인 연락처, 미확인 고객명·실적·미출시 서비스는 게시하지 않습니다.

01 첫 화면 → 02 SNC 소개 → 03 엔지니어링 → 04 ESH → 05 SAP → 06 Web → 07 다음 프로젝트 순서입니다. `src/data/journey.js`의 문구도 정적 HTML에 포함됩니다. 강화된 구간은 4.5개 화면 높이(실제 스크롤 이동 3.5개 화면)이며 문구당 약 반 화면의 기본 스크롤에 영상 위치를 맞춥니다. 첫 진입 약 1.05초의 무음 모션 후 같은 플레이어를 스크롤이 이어받고, 역방향에서도 같은 시간축을 사용합니다. 반복재생·스크롤 잠금은 없습니다. 바로 읽기·문의 링크로 일반 콘텐츠에 이동할 수 있습니다. 데이터 절약·영상 오류에는 정지 배경, 모션 감소·낮은 가로 화면·JavaScript 비활성화에는 일반 읽기 흐름을 제공합니다. 폴드 폭 전환 시 읽던 위치와 모바일 입구·출구 클리핑을 보존합니다. Three.js나 React는 추가하지 않았습니다.

채택된 v2 전체 마스터는 7개 실제 생성 구간을 연결한 35초 영상입니다. 데스크톱 1280×704와 모바일 800×440 파일을 구분하며 모든 연결부와 전체 재생을 검수했습니다. [원본·사양·해시](docs/verification/film-v2.json)와 [제작 기록](docs/video/PRODUCTION_STATUS.md)을 제공합니다. 웹 검증과 운영 배포 상태는 QA 보고서를 확인하세요.

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
