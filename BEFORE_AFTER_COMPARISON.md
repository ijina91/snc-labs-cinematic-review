# SNC Labs 전후 비교

후속 v3 수정은 기존 검은 디자인을 유지하며 원본의 10–13초와 21–27초만 교체한다. 새 먼 배경은 주변과 같은 작은 청색 기둥·유리 블록이다. 시작 SNC 로고·구간 밖 화면·35초 길이·모바일/Fold 구조는 유지한다. [시간 구간별 비교와 제작 기록](docs/video/TIMED_REPAIRS.md), [실제 파일 원장](docs/verification/film-v3.json).

비교 기준은 운영 `main`의 `7cdbcca`와 새 `design/blue-glass-frames` 구현이다. 최초 감사 당시의 정적 사이트와 예전 생성 시안은 역사적 기록이며 현재 결과의 검증으로 사용하지 않는다.

| 항목 | 이전 운영 디자인 | 현재 Blue Glass |
|---|---|---|
| 배경 | 화이트에서 블루가 나타나는 진입 | 처음부터 검정·블루 유리 건축 공간 |
| 첫 화면과 소개 | 히어로와 후속 여섯 장면 | 첫 화면을 포함한 일곱 패널·하나의 플레이어 |
| 영상 | 15.5초 공간 영상 | 사용자 01~07에 기반한 일곱 실제 생성 구간·35초 마스터 |
| 조각 | 카메라 이동의 비중이 큼 | 개별 부유·미세 기울기·유리 면 하이라이트를 원본별 검수 |
| 연결 | 이전 공간 영상의 시간축 | 직전 실제 마지막 프레임에서 다음 구간 생성, 여섯 압축 접합 검수 |
| 금지 요소 | 이전 사용자 지시에 따라 고리·회전 체크·측면 안내 제거 | 동일 기준 유지, 입력 이미지의 구체·큰 타원 궤도까지 수정 |
| 서비스 | 세 서비스의 카드 구성 | ESH·SAP·Web을 각각 넓은 이미지 영역과 기본 상세 펼침으로 구성 |
| 모바일·폴드 | 운영에서 수정한 클리핑·높이 처리 | 기존 경계 규칙 보존, 일곱 패널·단일 진입 영상·폭 전환에 적용 |
| 오류·정적 읽기 | 기존 대체 화면·no-JS | 일곱 정적 프레임, 늦은 영상 로딩과 오류에서도 실제 문구 유지 |
| 회사 정보 | 승인된 세 사업 분야·전화·공개 GitHub | 같은 내용과 링크 보존, 미확인 고객·실적·서비스 추가 없음 |
| 배포 | main 기반 GitHub Pages | 같은 방식, PR 검증과 main ref 가드 유지 |

## 검토 화면

- 운영 기준: [데스크톱](docs/previews/baseline-main-desktop.png), [모바일](docs/previews/baseline-main-mobile.png).
- 새 첫 화면: [데스크톱](docs/previews/desktop.png), [모바일](docs/previews/mobile.png), [폴드](docs/previews/fold.png).
- 새 흐름: [SNC 소개](docs/previews/journey-about.png), [ESH](docs/previews/journey-esh.png), [SAP](docs/previews/journey-sap.png), [Web](docs/previews/journey-web.png), [마무리](docs/previews/journey-next.png).
- 실제 압축 영상의 [여섯 접합 프레임](docs/previews/film-v2-contact-sheet.jpg).

캡처는 정지 화면이며 영상의 모든 타이밍이나 실기기 전체 품질을 인증하지 않는다. 공개 GitHub 영역 캡처는 재현 가능한 빈 목록 응답을 사용한다. 목록·실패·재시도·텍스트 안전성은 별도 자동 검사로 확인한다. 화면 walkthrough 녹화와 실제 35초 생성 배경 영상을 구분한다.

## 장점·결함 검토

검은 공간·각진 유리·블루 빛을 중심으로 브랜드를 통일하고, 실제 회사 소개와 문의는 HTML로 유지했다. 결함 관점에서는 카메라에 편중된 이전 시도, 원형 궤도, 초기 CLS, 폴드 경계, 지연 로딩 및 GitHub 목록 대비를 검토했다. 구체적인 원인·조치와 100점 모델은 [교차 검토](docs/BLUE_GLASS_REVIEW.md)에 기록한다. 같은 구현 에이전트의 두 관점 검토이며 외부 심사나 설치되지 않은 Impeccable 스킬 실행을 주장하지 않는다.

실제 통과와 남은 한계는 [QA](QA_REPORT.md) 및 [성능 보고서](PERFORMANCE_REPORT.md)에 기재한다. 주관적인 99점으로 미검증 항목을 덮지 않는다.

## 지정 시간 수정 v3 화면

실제 새 영상의 약25초를 표시한 화면이다. 캡처에서는 공개 저장소 목록을 재현 가능한 빈 응답으로 고정했으며 해당 API의 실제 상태는 별도 기능 검사로 검증했다. 영상은 현재 프레임의 탐색·디코딩 완료를 기다린 뒤 캡처했다.

- [데스크톱 1440px](docs/previews/time-repair-desktop.png)
- [휴대폰 390px](docs/previews/time-repair-mobile.png)
- [펼친 폴드 690px](docs/previews/time-repair-fold.png)
- [10·13·21·24·27초의 앞뒤 프레임](docs/previews/film-v3-contact-sheet.jpg)

구간 밖의 화면·35초 길이·스크롤 구조는 유지했고, 먼 글자 조형을 주변과 같은 기둥·유리 블록으로 교체했다. 전체 파일의 실제 사양과 해시는 [v3 원장](docs/verification/film-v3.json)에 있다.
