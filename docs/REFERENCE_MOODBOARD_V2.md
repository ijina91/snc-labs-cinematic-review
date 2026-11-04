# SNC 모션 레퍼런스 — 실제 확인 및 적용

2026-11-04. 사용자가 지정한 Pinterest와 awesome-opus-5-5-videos를 각각 시각 연출 탐색과 코드 기반 제작 방식의 참고로 조사했다. 참고 작품의 영상·이미지·음악을 SNC의 제작 자산으로 복사하지 않는다.

## Pinterest

- 검색: `blue glass 3d motion tech branding`.
- [블루 유리 레이어 / 제품 모션 핀](https://www.pinterest.com/pin/313915036550946874/): 공개 상세 화면의 블루 투명 레이어, 단단한 모서리, 재질 사이의 명암과 반사광을 시각 확인했다. 공개 화면에서 정지 이미지를 본 범위를 넘어 전체 모션을 분석했다고 주장하지 않는다.
- [Scintillations 핀](https://www.pinterest.com/pin/634303928805206028/) → [Toros Kose의 Behance 원작](https://www.behance.net/gallery/106823607/S-C-I-N-T-I-L-L-A-T-I-O-N-S): Pinterest의 이 핀은 로그인 창이 표시되어 연결된 공개 원작에서 Vimeo 영상을 재생했다. 검정 공간을 유지하면서 가느다란 블루 빛의 면과 방향이 변하는 구간을 확인했다.
- 적용: 이미지 전체를 밝히는 효과 대신 기존 유리 면의 국소 반사광과 깊이 방향의 빛 흐름. 유리는 단단한 각진 형태로 유지한다. 구체·고리·원형 노드와 무관한 장식은 제외한다.

## awesome-opus-5-5-videos

주요 코드 모션 컬렉션인 [yihui-dev/awesome-opus5-5-videos](https://github.com/yihui-dev/awesome-opus5-5-videos)도 확인했다. README는 HTML·Canvas·SVG·Three.js로 작성한 모션, 703개 프롬프트와 418개 라이브 리메이크를 기재한다. 숫자는 확인 시점 README의 기재 내용이며 전체 사례를 직접 실행·검수했다는 뜻이 아니다.

- [BThreeAgency 프롬프트](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/bthreeagency-827092.md): 제공된 디자인·조명·타입·배치를 유지하고 움직임만 더하며, 대상을 단단한 3D 물체로 다루는 지시를 확인했다. SNC에서는 이 형태 보존 원칙을 참고한다. 원작의 배지·금색 입자는 채택하지 않는다.
- [lukasersil 프롬프트](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/lukasersil-726495.md): 장면 사이의 자연스러운 연결, 빛과 깊이, 마스크·타이포그래피 및 정교한 시간 배치를 지시한다. 임의 효과를 모으는 방식 대신 01~07의 일관된 재질과 이동 흐름에 적용한다. 15초 쇼릴 속도를 그대로 웹 스크롤에 강제하지 않는다.

동일 계열의 [chuspeeism/awesome-opus-5-5-videos](https://github.com/chuspeeism/awesome-opus-5-5-videos)도 확인했다. 이 README는 300개 사례를 기재하며 아래 제작 설명과 공개 영상 참고에 사용했다. 모든 항목의 원본 코드나 프롬프트가 공개된 것은 아니다.

| 사례 | 확인 범위 | SNC 적용 원칙 |
|---|---|---|
| [NVIDIA Blackwell 3D](https://github.com/chuspeeism/awesome-opus-5-5-videos/blob/main/cases/2103494418477260830.md) | 제작 설명과 내장 링크의 공개 영상 확인. 단일 HTML로 단계별 공간을 이동한다는 설명. 원본 프롬프트 미공개 | 장면마다 플레이어를 갈아 끼우지 않고 하나의 시간축으로 01→07을 제어. 대상과 카메라의 움직임을 구분 |
| [Omia UI 프레임 렌더](https://github.com/chuspeeism/awesome-opus-5-5-videos/blob/main/cases/2104076374281510985.md) | 제작 설명 확인. 실제 UI를 시간표로 구동하고 프레임 렌더한다는 설명 | 문구와 장면을 하나의 진행률에 맞추고 역방향 스크롤에서도 같은 상태를 재현 |
| [128BPM 코드 모션](https://github.com/chuspeeism/awesome-opus-5-5-videos/blob/main/cases/2103403361022419005.md) | HTML·900프레임·FFmpeg 제작 설명 확인. 단일 원문 프롬프트 미공개 | 임의 효과를 추가하기보다 사건의 시점·지속 시간·가감속을 정하고 최종 압축 파일을 검수 |
| [연속 도시 줌](https://github.com/chuspeeism/awesome-opus-5-5-videos/blob/main/cases/2104074435196301574.md) | 단일 셰이더의 연속 이동·개별 창 조명에 대한 제작 설명 확인 | 이동 방향과 조명의 시간차를 이어 주고 모든 조각이 동시에 점멸하지 않게 연출 |

## 현재 구현과 제작 상태

공개 프롬프트가 실린 [Ultracode 제품 소개](https://x.com/BogdanDragomir/status/2104045641538412658), [15초 제품 광고](https://x.com/tstfully/status/2104033772949680192) 항목도 구조화된 `data/cases.json`에서 확인했다. 제품의 핵심 동작과 시간 범위를 명확히 지시하는 방식만 참고한다. SNC는 음악 중심 광고가 아닌 스크롤 소개이므로, 읽기 지점·6개 장면 접합·조각과 빛의 동작을 자체 제작 지시로 작성했다.

- Vanilla JS와 기존 GSAP 유지. 7개 패널이 단일 장식용 플레이어를 공유하도록 실제 구현했다. 별도 HeroFilm은 더 이상 초기화하지 않는다.
- 텍스트·CTA는 영상 속에 굽지 않고 실제 HTML로 유지한다. 모바일·폴드의 읽기 영역과 기본 스크롤을 보존한다.
- 생성형 영상은 무료 도구에서 실제 제작하고 검수한다. 코드 참고를 했다는 이유로 사진 이동을 새 3D 영상으로 설명하지 않는다.
- v2 첫 01→02 원본은 내려받았고 전체 디코딩은 통과했다. 조각·빛·접합의 시각 검수와 전체 01→07 완성 여부는 별도 제작 원장에 기록한다.
- 참고 사이트의 특정 유료 기능, 음악, 미공개 코드 또는 프롬프트를 사용했다고 기록하지 않는다.
