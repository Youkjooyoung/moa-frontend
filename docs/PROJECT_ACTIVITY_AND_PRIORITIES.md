# MOA 프론트엔드 작업 이력 및 고도화 우선순위

문서 기준일: 2026-05-20

## 2026-05-20 자동화 점검 결과

- Git 상태: `dev` 브랜치에서 작업 중이며, 점검 전 변경 파일은 `docs/PROJECT_ACTIVITY_AND_PRIORITIES.md` 1개였다.
- Skill/Agent 점검: 저장소 내 커스텀 Skill/Agent 파일은 발견되지 않았고, `senior-enhancement-lead`, `fullstack-product-ops`, `github:yeet` 지침을 적용했다.
- AI 도구 흔적 정리: 기존 AI 도구 전용 규칙 파일을 제거하고 Codex용 `AGENTS.md`를 추가했다. 소스/문서 내 다른 AI 도구 노출 흔적은 추가로 발견되지 않았다.
- 검증 결과: `npm.cmd run lint`는 0 errors / 106 warnings로 통과했고, `npm.cmd run test:unit`은 4 files / 40 tests 통과, `npm.cmd run build`는 production build 통과다.
- 새 이슈: 로컬 `origin`은 이전 저장소 URL을 가리키며 GitHub 실제 저장소는 `Youkjooyoung/moa-frontend`로 확인됐다. `src/pages/product/GetProduct.jsx`의 구독 등록 로직도 아직 주석 상태로 남아 있고, chart 계열 chunk가 커서 번들 예산 관리가 필요하다.

## 완료한 고도화 작업

1. 백엔드 로컬 설정 분리 연계
   - 프론트 README에 백엔드 로컬 설정 분리와 실행 전제 조건을 연결했다.
   - 민감 설정은 Git에 올리지 않는 운영 원칙을 문서화했다.

2. CI/CD 검증 강화
   - GitHub Actions에서 `npm ci`, lint, unit test, production build, Storybook build를 실행하도록 정리했다.
   - Storybook 산출물은 artifact로 업로드하도록 구성했다.

3. Storybook 정리
   - 기본 예제 stories와 샘플 assets를 제거했다.
   - MOA 공통 레이아웃과 로그인 액션을 확인할 수 있는 실제 프로젝트 stories로 교체했다.
   - Storybook build wrapper에서 캐시 경로를 로컬 `.cache`로 고정했다.

4. README 및 문서 인코딩 복구
   - README를 UTF-8 한국어 문서로 재작성했다.
   - 작업 이력과 우선순위 문서를 `docs/PROJECT_ACTIVITY_AND_PRIORITIES.md`로 정리했다.

5. UI 회귀 테스트 추가
   - `MoaPage` 레이아웃 렌더링/필터 입력 테스트를 추가했다.
   - `SocialLoginButtons` 활성/비활성 상태 테스트를 추가했다.
   - Vitest 단위 테스트 전용 설정과 실행 wrapper를 추가해 한글/공백 경로에서도 실행되도록 했다.

6. Codex 작업 지침 정리
   - 기존 AI 도구 전용 규칙 파일을 제거했다.
   - 프론트 저장소용 `AGENTS.md`를 추가해 Codex 기준 작업/검증 규칙을 문서화했다.

## 남은 고도화 우선순위

| 우선순위 | 작업 | 이유 | 다음 액션 |
| --- | --- | --- | --- |
| P0 | 원격 저장소 URL 갱신 | 로컬 `origin`이 이전 URL을 가리켜 네트워크가 열려도 fetch/push 혼선이 생길 수 있다. | `origin`을 `https://github.com/Youkjooyoung/moa-frontend.git`로 갱신하고 fetch/push 확인 |
| P0 | lint warning 106개 정리 | CI는 통과하지만 `no-unused-vars`, hook dependency, React purity 경고가 많아 신규 결함 신호를 놓치기 쉽다. | unused import 제거, hook dependency 정리, effect 내부 setState 경고를 기능 영역별로 분리 처리 |
| P0 | 상품 상세 구독 등록 플로우 완성 | `GetProduct.jsx`에 구독 등록 로직이 주석 상태로 남아 실제 전환 흐름이 끊길 수 있다. | 구독 생성 API 계약 확인 후 성공/실패/중복 구독 상태를 UI와 테스트로 연결 |
| P1 | Playwright/E2E 도입 | 핵심 사용자 흐름은 단위 테스트만으로 회귀를 잡기 어렵다. | 로그인, 상품 탐색, 구독 등록, 파티 생성, 마이페이지 smoke 시나리오 작성 |
| P1 | 접근성 점검 자동화 | 로그인/관리자/상품 화면의 keyboard flow와 label 상태를 지속 검증해야 한다. | Storybook a11y addon 또는 Playwright axe 검증 추가 |
| P1 | chart bundle 예산 관리 | build 결과에서 `apexcharts`, `recharts` chunk가 크다. 초기 화면 성능과 배포 용량에 영향을 줄 수 있다. | 관리자/차트 화면 lazy loading 범위와 bundle analyzer 기준 설정 |
| P2 | UI 상태 표준화 | 로딩, 빈 상태, 오류 상태가 화면마다 다르면 유지보수 비용이 커진다. | 공통 status component와 skeleton 패턴 정리 |
| P2 | Storybook coverage 확대 | 현재 stories는 핵심 진입점만 다룬다. | 상품 카드, 파티 카드, 관리자 테이블, modal 계층으로 확장 |

## Git 활동 요약

이번 재점검 기준: 2026-05-20T11:30:00+09:00

- 2026-05-20: 자동화 점검에서 Codex용 `AGENTS.md`를 추가하고 기존 AI 도구 전용 규칙 파일을 제거했다.
- 2026-05-20: lint, unit test, production build를 재검증했고 원격 URL 갱신, lint warning 106개, 상품 상세 구독 등록 미완성 이슈를 P0로 올렸다.
- 2026-05-19: `a2aadd5`에서 프론트 CI, Storybook coverage, Vitest 단위 테스트 기반을 강화했다.
- 2026-05-18: `a7b53be`에서 프론트 UI 고도화 내용과 작업 문서를 정리했다.

## 날짜별 작업 이력

### 2026-05-20

- 자동화 메모리와 저장소 지침을 확인했다.
- 저장소 내 커스텀 Skill/Agent 파일을 검색했고, 별도 파일은 발견하지 못했다.
- 기존 AI 도구 전용 규칙 파일을 제거하고 Codex용 `AGENTS.md`를 추가했다.
- 다른 AI 도구 문구 노출 여부를 검색했고 추가 정리 대상은 발견하지 못했다.
- `npm.cmd run lint`, `npm.cmd run test:unit`, `npm.cmd run build`를 실행해 현재 검증 상태를 확인했다.
- GitHub 실제 저장소가 `Youkjooyoung/moa-frontend`로 확인되어 로컬 원격 URL 갱신을 새 우선순위에 반영했다.
- lint warning 106개, 상품 상세 구독 등록 미완성, chart bundle 크기를 새 고도화 우선순위에 반영했다.

### 2026-05-19

- 자동화 재점검에서 Git 상태, ignore 정책, 로컬 산출물 추적 여부를 확인했다.
- 신규 미커밋 변경은 없었고 `dev` 브랜치가 `origin/dev`와 동기화되어 있음을 확인했다.
- GitHub Actions 프론트 CI를 추가했다.
- Storybook 기본 예제를 제거하고 MOA 전용 stories로 교체했다.
- Storybook build wrapper와 Vitest unit wrapper를 추가했다.
- `MoaPage`, `SocialLoginButtons` 단위 테스트를 추가했다.
- README와 작업 이력 문서를 UTF-8 한국어로 복구했다.
- ESLint가 `storybook-static`, `.cache`, coverage 산출물을 검사하지 않도록 정리했다.

### 2026-05-18

- 모바일 중심 UI 안정화와 header/floating controls 개선을 진행했다.
- MOA favicon과 title을 정리했다.
- Storybook, Chromatic, Vitest browser 기반 검증 설정을 점검했다.
- 임시 추출 폴더와 로컬 산출물 ignore 정책을 보강했다.

### 2026-05-17

- 백엔드 GitHub Actions deploy workflow를 점검했다.
- Maven wrapper 실행 조건과 systemd 배포 전제를 정리했다.
- PASS 연동 관련 환경 분리와 문서화 필요 사항을 정리했다.

### 2026-05-14

- IDE 실행 환경과 README/Notion 연결 문서를 정리했다.
- WAR packaging과 GitHub Actions 배포 workflow를 보강했다.
- 백엔드 민감 정보 관리와 ignore 정책을 점검했다.

### 2026-05-11

- 백엔드 배포 smoke test와 프론트 주요 UI 흐름 점검을 진행했다.

### 2026-05-10

- mock 인증 흐름과 프론트 화면 안정화 작업을 진행했다.

### 2026-05-05

- 로그인 intent, 계정 등록/검증, 프론트 계정 설정 UI 흐름을 점검했다.
