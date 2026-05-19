# MOA 프론트엔드 작업 이력 및 고도화 우선순위

문서 기준일: 2026-05-19

## 2026-05-19 자동화 재점검 결과

- Git 상태: `dev` 브랜치가 `origin/dev`와 동기화되어 있고 워킹트리는 clean 상태다.
- 새 코드 이슈: 이번 점검에서 프론트엔드 소스의 신규 미커밋 변경이나 새 회귀 증상은 발견하지 못했다.
- 로컬 산출물/민감 파일: `.env`, `.env.production`, `moa-ssl.p12`, `dist`, `storybook-static`, `.cache`, `moa_temp_extracted`는 Git 추적 대상이 아니며 ignore 정책으로 막혀 있다.
- 검증 결과: lint는 0 errors / 106 warnings로 통과했고, unit test 40개와 production build가 통과했다.
- 남은 리스크: lint 경고가 여전히 많아 CI 통과 후에도 실제 결함 신호가 묻힐 수 있다.

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

## 남은 고도화 우선순위

| 우선순위 | 작업 | 이유 | 다음 액션 |
| --- | --- | --- | --- |
| P0 | lint 경고 정리 | 현재 CI는 통과하지만 `no-unused-vars`, hook dependency, React purity 경고가 많아 신규 결함을 놓치기 쉽다. | 기능 영역별로 unused import 제거, hook dependency 정리, 순수 렌더링 경고를 분리 처리 |
| P0 | 원격 저장소 URL 정리 | push는 성공하지만 원격 저장소 이동 안내가 반복되어 운영 자동화와 온보딩에 혼선을 줄 수 있다. | `origin` URL을 새 GitHub 저장소 주소로 갱신하고 fetch/push 확인 |
| P1 | Playwright/E2E 도입 | 핵심 사용자 흐름은 단위 테스트만으로 회귀를 잡기 어렵다. | 로그인, 상품 탐색, 파티 생성, 마이페이지 smoke 시나리오부터 작성 |
| P1 | 접근성 점검 자동화 | 로그인/관리자/상품 화면의 keyboard flow와 label 상태를 지속 검증해야 한다. | Storybook a11y addon 또는 Playwright axe 검증 추가 |
| P2 | UI 상태 표준화 | 로딩, 빈 상태, 오류 상태가 화면마다 다르면 유지보수 비용이 커진다. | 공통 status component와 skeleton 패턴 정리 |
| P2 | Storybook coverage 확대 | 현재 stories는 핵심 진입점만 다룬다. | 상품 카드, 파티 카드, 관리자 테이블, modal 계층으로 확장 |

## Git 활동 요약

이번 재점검 기준: 2026-05-19T09:36:33+09:00

- 2026-05-19: `a2aadd5`에서 프론트 CI, Storybook coverage, Vitest 단위 테스트 기반을 강화했다.
- 2026-05-18: `a7b53be`에서 프론트 UI 고도화 내용과 작업 문서를 정리했다.
- 2026-05-19 재점검: 이후 신규 커밋은 없고 `dev`와 `origin/dev`는 동기화 상태다.

- 2026-05-19: 프론트 CI workflow 추가, Storybook 정리, Vitest 단위 테스트 추가, README/작업 이력 문서 복구, ESLint 산출물 ignore 정리.
- 2026-05-18: 모바일 레이아웃, sticky header, safe-area, floating UI, favicon/title, Storybook/Vitest browser 기반 검증 설정을 진행.
- 2026-05-17: 백엔드 GitHub Actions deploy workflow와 systemd 배포 전제 조건을 점검.

## 날짜별 작업 이력

### 2026-05-19

- 자동화 재점검에서 Git 상태, ignore 정책, 로컬 산출물 추적 여부를 확인했다.
- 신규 미커밋 변경은 없었고 `dev` 브랜치가 `origin/dev`와 동기화되어 있음을 확인했다.
- 남은 고도화 우선순위에 원격 저장소 URL 정리를 추가했다.
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
