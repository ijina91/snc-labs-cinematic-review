# 성능 보고서

2026-11-04, 최종 15.5초 영상 및 모바일 네이티브 opacity 진입을 적용한 Vite 빌드. http://127.0.0.1:4180/ 에서 Lighthouse 13.5.0 / Windows Microsoft Edge 156으로 순차 측정했다. 모바일은 기본 4배 CPU·약 1.6Mbps 프로필, 데스크톱은 실제 desktop 설정·1배 CPU다. 브라우저 QA를 동시에 실행하지 않았다. 운영 사이트의 실제 사용자 측정이 아니다.

## 최종 측정

| 프로필 | Performance | Accessibility | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|---:|
| Mobile 1 | 74 | 100 | 100 | 3.078s | 0.00000457 | 553.9ms |
| Mobile 2 | 75 | 100 | 100 | 3.600s | 0.00000457 | 322.8ms |
| Mobile 3 | 85 | 100 | 100 | 2.136s | 0.00000457 | 482.5ms |
| Mobile 중앙값 | **75** | **100** | **100** | **3.078s** | **0.00000457** | **482.5ms** |
| Desktop 1 | **98** | **100** | **100** | **0.731s** | **0.00004037** | **0ms** |

모바일 Performance ≥90과 LCP ≤2.5초 목표는 중앙값 기준 **미달**이다. 데스크톱 Performance·LCP, 검사한 접근성 점수 ≥95와 CLS ≤0.1은 충족했다. 모바일 한 번의 좋은 결과만 골라 통과로 표시하지 않는다. [최종 측정 데이터](docs/verification/performance-film.json).

## 구현과 전후 비교

Three.js·WebGL 체크마크를 제거했다. 배경 MP4는 4,695,423바이트, 15.5초, 1280×704, 24fps H.264이며 음성·메타데이터를 제거하고 faststart와 짧은 keyframe 간격을 적용했다. 최초 화면에서는 73,110바이트 WebP 포스터를 사용하고 영상은 스크롤 진입 후 지연 로딩한다. Reduced Motion·데이터 절약·제한된 기기 또는 오류에는 정적 이미지와 읽을 수 있는 콘텐츠를 남긴다.

폰트는 로컬 WOFF2다. Vite의 주요 초기 JS는 gzip 약 3.57KB이며, 모바일 진입 모션은 별도 약 0.77KB 모듈의 브라우저 opacity 애니메이션으로 실행한다. GSAP core 약 27.56KB와 ScrollExperience 약 18.89KB는 분리했다. 모바일에서 GSAP는 첫 스크롤까지 기다리며 데스크톱 진입에는 GSAP timeline을 사용한다.

동일 최종 영상을 처음 연결했을 때 모바일 75/69/69점, 중앙값 69점·LCP 2.543초·TBT 845.3ms였다. 모바일 compositor opacity 및 GSAP 지연 로딩 후 74/75/85점, 중앙값 75점·LCP 3.078초·TBT 482.5ms다. TBT와 점수는 개선됐지만 LCP는 악화됐으므로 전체 성능 개선 성공으로 단정하지 않는다. [첫 측정](docs/verification/performance-film-initial.json). 이전 WebGL 버전의 95점 등은 현 영상 버전의 결과로 재사용하지 않는다.

모바일 측정에서 main-thread work, 렌더링 차단, LCP 발견 경로 및 일부 forced reflow 진단이 남는다. 최종 번들·미디어 검증 성공과 모바일 목표 달성은 별개다. 배포 후 실제 기기와 실제 네트워크에서 LCP 및 상호작용을 추가 확인해야 한다.

## 상호작용 측정과 한계

별도 Playwright Event Timing probe는 실제 video 렌더러에서 390px·1440px, 모두 4배 CPU로 소개 진입·PageDown/PageUp·서비스 상세·모바일 메뉴를 시험했다. 관측된 최대 이벤트 duration은 각각 **376ms / 400ms**다. 두 값 모두 200ms를 넘는다. 실제 사용자 INP가 아니며, field INP ≤200ms를 달성했다고 주장하지 않는다. [관측 데이터](docs/verification/interactions-film.json).

Lighthouse에서 back/forward cache 복원 진단도 실패했다. 해당 진단의 실제 사유는 CacheLimitPrunedOnCriticalMemoryPressure(호스트 메모리 압력)이며, 이것이 다른 성능 미달의 원인이라고 단정하지 않는다. 실제 사용자 이력·장시간 메모리 안정성·실기기 Safari 및 Android 전체를 검증한 결과는 아니다. 성능 목표의 미달과 운영 전 승인 대기를 유지하며 주관적 99점 또는 모든 목표 통과로 표시하지 않는다.
