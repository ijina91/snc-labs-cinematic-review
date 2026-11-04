# 레퍼런스 분석

## 최신 기준

사용자 제공 `SNC_Labs_3D_Frames_01-07.zip`의 실제 일곱 이미지를 기준으로 검은 배경, SNC 블루 유리, 반사 바닥과 수직 건축 요소를 유지한다. 순서는 01 → 02 → 03 → 04 → 05 → 06 → 07이다. 예전 화이트 디자인과 회전 체크마크 중심 시안은 현재 결과의 기준이 아니다.

원본에 인쇄된 평면 메뉴·글씨는 제작 이미지에서 제거하고 실제 웹 HTML로 분리했다. 추가 피드백에 따라 07의 구체·원형 노드, 05의 큰 타원 궤도와 06의 곡선 연결 장식을 수정했다. 작고 열린 각진 큐브 군집과 SNC 문자 형태는 보존한다.

## Pinterest — 재질과 조명

`blue glass 3d motion tech branding`으로 시각 레퍼런스를 탐색했다. [블루 유리 레이어 핀](https://www.pinterest.com/pin/313915036550946874/)에서 정지 이미지의 투명 레이어·단단한 모서리·명암을 확인했다. 이 정지 이미지만으로 전체 모션을 분석했다고 주장하지 않는다.

[Scintillations 핀](https://www.pinterest.com/pin/634303928805206028/)은 로그인 창이 있어 연결된 [Toros Kose의 공개 Behance 원작](https://www.behance.net/gallery/106823607/S-C-I-N-T-I-L-L-A-T-I-O-N-S)에서 Vimeo 영상을 재생했다. 검정 공간에서 블루 빛의 면과 방향이 바뀌는 구간을 참고했다. 원작 영상·음악·이미지는 복사하지 않았다.

적용 원칙은 화면 전체 점멸 대신 개별 유리 면의 반사광, 서로 다른 시점의 반짝임, 고정된 바닥과 자연스러운 반사다.

## awesome-opus-5-5-videos — 시간축과 연결

[yihui-dev/awesome-opus5-5-videos](https://github.com/yihui-dev/awesome-opus5-5-videos)의 공개 프롬프트와 [chuspeeism/awesome-opus-5-5-videos](https://github.com/chuspeeism/awesome-opus-5-5-videos)의 제작 설명·3D 공개 영상 사례를 확인했다. 제공된 디자인을 보존하며 움직임을 더하는 지시, 단일 공간을 통과하는 시간 구성, HTML UI와 프레임 렌더를 구분하는 제작 방식을 참고했다.

SNC에는 일곱 패널의 단일 플레이어, 실제 이전 끝 프레임을 다음 생성의 시작으로 사용하는 연결, 텍스트와 영상의 동일 진행률 및 역방향 스크롤을 적용했다. 참고 사례에 Three.js가 있다는 이유로 새 엔진을 도입하지 않았다. Opus 모델을 호출하거나 공개되지 않은 프롬프트를 사용했다고 기록하지 않는다. 저장소의 라이선스가 제삼자 영상의 재사용 권한을 자동으로 보장하지 않으므로 참고 자산은 제품에 포함하지 않는다.

실제 링크·확인 범위·적용 및 제외 기준은 [상세 무드보드](docs/REFERENCE_MOODBOARD_V2.md)에 기록했다. 확인일은 2026-11-04다.

## 이전 Instagram 참고 범위

사용자가 열어 둔 [Instagram 릴](https://www.instagram.com/reel/DfRaUziOLLU/)은 이전 브라우저 세션에서 실제 재생했다. 관찰된 파일은 약 12.42초의 세로 편집 영상으로, 모니터 속 공간형 웹사이트를 촬영한 것이다. 큰 타이포그래피·전체 화면 깊이·기둥 사이 이동을 참고했다. 원본 웹사이트 전체 길이나 구현 코드를 확인한 것으로 확대하지 않는다. 릴 길이를 웹사이트 읽기 시간에 강제하지 않으며, 관찰된 고리는 현재 사용자 지시에 따라 채택하지 않는다.

## 실제 도구와 대체 방법

설치된 frontend-design, free-video-studio, ffmpeg-skill 지침과 기존 브라우저·컴퓨터 사용 안내를 참고했다. 공급자 UI에서 무료 이미지 기반 영상을 생성하고 원본을 내려받아 FFmpeg로 디코딩·편집한다. Vite·Vanilla JS·GSAP·SVG를 유지하며 React나 Three.js는 추가하지 않았다. Playwright·axe-core·Lighthouse는 실제 설치 패키지로 검증한다.

요청한 정확한 스킬 이름 중 cinematic-web-experience, video-to-superprompt, ui-ux-pro-max, impeccable, gsap-skills, scroll-craft, motion-design-agent-skills, threejs-skills, playwright, axe-core, lighthouse 파일은 탐색 당시 없었다. 수동 스토리보드·장점/결함 관점의 검토와 설치된 테스트 패키지로 대체했다. 설치되지 않은 스킬이나 agent-browser CLI를 실행했다고 표시하지 않는다. 생성·다운로드·시각 채택·통합·QA·Slack 전달·운영 배포는 각각 실제 증거로 구분한다.
