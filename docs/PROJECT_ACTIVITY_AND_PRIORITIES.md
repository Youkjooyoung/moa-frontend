# MOA 프론트엔드 작업 이력 및 고도화 우선순위

문서 기준일: 2026-06-19

## 2026-06-19 고도화 구현 결과

- 순차 고도화 추가 결과: `test:smoke` 스크립트와 Playwright 기반 smoke runner를 추가했다. production build 후 preview 서버에서 상품 상세 -> 구독 신청 -> 성공/실패 흐름을 API mock으로 검증한다.
- 상품/구독 smoke 기준: `/product/:id`에서 구독 신청 진입, `/subscription/add/:productId` 확인 모달, 성공 시 `/subscriptions` 이동, 실패 시 실패 alert와 현재 화면 유지를 검증한다.
- lint warning 추가 축소: 47 warnings에서 42 warnings로 줄였다. 미사용 변수, 렌더 단계 난수 사용 일부, 상품 상세 hook dependency를 정리했다.
- 차트 lazy loading: 관리자 차트 비교 화면을 선택형 lazy loading으로 분리했다. `ChartComparisonPage` 진입만으로 `recharts`와 `apexcharts` 데모 컴포넌트를 동시에 렌더링하지 않는다.
- 검증 결과: `npm.cmd run lint`는 0 errors / 42 warnings, `npm.cmd run test:unit`은 4 files / 40 tests 통과, `npm.cmd run test:smoke` 통과, `npm.cmd run build` 통과.

- 적용 Skill: `senior-enhancement-lead`를 확인했고, 저장소의 `AGENTS.md` 지침을 우선 적용했다.
- 생성 Skill/Agent 검색 결과: 프로젝트 루트에 `.agents`, `.codex`, 별도 `SKILL.md`는 없었다. 현재 작업은 기존 Skill로 충분하므로 새 Skill은 생성하지 않았다.
- AI 도구 흔적 정리: 기존 외부 AI 도구 전용 설정 파일 삭제 상태와 `AGENTS.md` 추가 상태를 유지했다. 새 지침은 Codex 기준으로 통일한다.
- 운영 디버그 로그 정리: `src` 기준 `console.log`와 `debugger` 검색 결과가 0건이 되도록 구독, 상품 이미지, OTP, 크리스마스 이스터에그 주변 로그를 제거했다.
- lint warning 축소: `motion` JSX 네임스페이스 오탐을 ESLint 규칙에서 보정하고, 명확한 미사용 변수/의존성 경고 일부를 정리했다. `npm.cmd run lint` 기준 0 errors / 42 warnings로 감소했다.
- 번들 예산 기준: production build에서 큰 차트 chunk는 `apexcharts`와 `recharts`를 별도 예산 대상으로 본다. 신규 차트 화면은 라우트 또는 컴포넌트 단위 lazy loading을 기본값으로 한다.
- smoke 검증 기준: 1차는 상품 상세 -> 구독 신청 -> 성공/실패 처리, 2차는 로그인/OTP, 마이페이지 계좌 검증, 관리자 사용자/푸시 화면을 대상으로 한다. 실제 자동화는 백엔드와 프론트 dev 서버가 동시에 준비된 환경에서 실행한다.
- 검증 결과: `npm.cmd run lint`는 0 errors / 42 warnings, `npm.cmd run test:unit`은 4 files / 40 tests 통과, `npm.cmd run test:smoke` 통과, `npm.cmd run build`는 통과했다.

## 현재 고도화 우선순위

| 우선순위 | 작업 | 상태 | 다음 액션 |
| --- | --- | --- | --- |
| P0 | AI 도구 전용 흔적 Codex 기준 통일 | 진행 중 | 외부 AI 도구 전용 설정 파일 삭제와 `AGENTS.md` 추가 상태를 커밋에 포함 |
| P0 | 운영 디버그 로그 제거 | 완료 | `console.error`는 오류 관측용으로 유지하되 민감정보 출력 여부 추가 점검 |
| P0 | 상품 상세 구독 등록 흐름 검증 | 대기 | 백엔드/프론트 통합 실행 환경에서 Playwright smoke 작성 |
| P0 | lint warning 축소 | 진행 중 | hook dependency, set-state-in-effect, fast-refresh 순으로 계속 정리 |
| P1 | 차트 번들 예산 관리 | 기준 확정 | 차트 화면 신규/수정 시 lazy loading과 chunk 크기 확인 |
| P1 | Playwright E2E smoke 도입 | 대기 | 핵심 사용자 흐름 3-5개 smoke 작성 |
| P1 | 접근성 검증 자동화 | 대기 | Storybook a11y 또는 Playwright axe 검증 추가 |
| P2 | 공통 상태 UI 정리 | 대기 | 로딩/빈 상태/오류 상태 패턴 문서화 |
| P2 | Storybook coverage 확장 | 대기 | 상품/파티/관리자 모달 stories 확대 |

## 남은 주요 lint warning 유형

- React `set-state-in-effect`
- `react-hooks/purity`의 렌더 단계 `Math.random` 사용 경고
- 일부 hook dependency 경고
- `react-refresh/only-export-components`
- 일부 관리자 화면 미사용 변수

## 검증 명령

- `npm.cmd run lint`
- `npm.cmd run test:unit`
- `npm.cmd run build`

## 변경 원칙

- 기존 미커밋 변경분은 사용자 또는 이전 자동화 작업으로 보고 되돌리지 않는다.
- 민감 파일 내용은 공개하지 않고, 추적 여부와 관리 방식만 점검한다.
- 기능 변경과 운영/문서 정리는 검증 가능한 작은 단위로 나눈다.
