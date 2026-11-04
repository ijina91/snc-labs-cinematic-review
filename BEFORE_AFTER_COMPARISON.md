# 전후 비교와 시각 검토

기준: 운영 main `b9b4a4617af3229f1951c48b8b862830730e4ed0`. Before는 이전에 캡처한 변경 전 운영 사이트, After는 로컬 배포용 빌드다. GitHub 프로젝트 캡처는 빈 결과 fixture로 제어했으며 가짜 공개 프로젝트를 만들지 않았다.

| 구분 | 변경 전 | 현재 결과 |
|---|---|---|
| 첫 화면 | 정적 화이트·블루 2열 구성 | 전체 화면의 화이트→블루 공간과 2.25초 이내 GSAP 진입 |
| 회사 소개 | 회사·서비스 텍스트 중심 | 회사→ESH→SAP→Web→연결→문의의 여섯 스크롤 장면 |
| 배경 | 별도 정적 일러스트 | SNC 전용 원본에서 생성한 15.5초 공간 영상, 양방향 스크롤 탐색 |
| 장식 | 중간 시안의 회전 체크·고리·개별 3D 오브젝트 | 비대칭 블루 금속·유리·빛의 연속 공간, Three.js 제거 |
| 화면 조작 | 중간 시안의 오른쪽 점·장면 번호 | 점·번호 제거, 기본 스크롤과 바로 읽기·문의 링크 |
| 서비스 | 세 실제 분야의 기본 소개 | 데이터 기반 상세 컴포넌트와 분야별 문의 링크 |
| 기술 설명 | 별도 기술 서사 없음 | 업무·시스템·운영의 관계를 양방향 SVG로 설명 |
| GitHub | 실패 상태 구분 부족 | 로딩·성공·빈 결과·시간제한·실패·재시도, 공개 데이터만 표시 |
| 문의 | 기존 대표전화 | 같은 전화의 대형 CTA·터치 조작 영역 |
| 회복력 | 기본 모션 감소·메뉴 | no-JS·영상/모션 실패·저사양 대체·실시간 모션 설정 변경 |
| 배포 | main Pages workflow | 기존 방식 유지, main ref 가드와 PR 검증 전용 workflow |

## 현재 캡처

- [변경 전 데스크톱](docs/previews/before-desktop.png), [변경 전 모바일](docs/previews/before-mobile.png).
- [현재 데스크톱](docs/previews/desktop.png), [현재 모바일](docs/previews/mobile.png).
- [SNC 소개](docs/previews/journey-snc.png), [ESH](docs/previews/journey-esh.png), [SAP](docs/previews/journey-sap.png), [Web](docs/previews/journey-web.png), [연결](docs/previews/journey-connect.png), [문의 전환](docs/previews/journey-next.png).
- [모바일 소개](docs/previews/journey-mobile.png), [기술 설명](docs/previews/technology.png), [실제 영상 프레임](docs/previews/film-contact-sheet.png).

스크롤 walkthrough는 ignored `artifacts/cinematic-preview.webm`, 실제 배경 MP4는 `public/assets/media/snc-spatial-film.mp4`다. 화면 녹화와 생성 배경 영상을 혼동하지 않는다. 정지 캡처가 영상 타이밍이나 모든 프레임의 품질을 증명하는 것으로 표시하지 않는다.

## 긍정 검토 — 시각 목표 확인

1440px 첫 화면과 SAP 장면, 390px 첫 화면과 소개 장면을 별도로 확인했다. 흰색 여백·대형 한글 타이틀·SNC 블루의 관계가 유지되고 배경이 콘텐츠 컨테이너 밖으로 펼쳐진다. 네이비 장면은 본문 대비를 보호하며 모바일은 문구를 하단으로 재배치한다. 회사 소개·기술 분야·실제 대표전화로 이어지는 경로를 유지했다. 프레임 시트에서 공간 이동과 일관된 재질·색상을 확인했다.

## 부정 검토 — 결함 찾기

초기 LTX 출력의 주름진 금속·원형 공간은 미채택하고 원본 이미지 기반 생성으로 교체했다. 이전 이미지 컨테이너 경계와 모바일 relative 배치를 바로잡았다. 최종 히어로 오른쪽 아래 작은 SNC 문구가 블루 배경에 묻혀 네이비 바탕·화이트 글자로 바꾸고 비링크의 화살표를 제거했다. 영상 연결부·모바일 문구·가로 넘침·키보드·오류 대체는 실제 프레임과 자동 검사로 확인했다.

모션 감소 후 모바일 화면이 일반 서비스 구간으로 이동한 trace도 확인했다. 영상은 화면 밖에서 일부러 로딩하지 않으므로 테스트가 소개 구간으로 재진입하도록 수정하고 관련 검사를 다시 실행했다. 기능 실패를 성공으로 덮거나 offscreen 영상 강제 로딩을 추가하지 않았다.

두 검토는 같은 구현 에이전트가 서로 다른 기준으로 수행한 별도 검토이며 독립된 사람/에이전트의 인증 또는 Impeccable 스킬 실행이 아니다. 자동 QA의 실제 결과·최초 실패·재검사는 QA_REPORT.md에, 성능과 해상도 한계는 PERFORMANCE_REPORT.md에 공개한다. 주관적 99점·완벽함·모든 실기기 품질을 인증하지 않는다.
