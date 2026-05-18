# MOA 작업 이력 및 고도화 우선순위

작성일: 2026-05-18

## 1. 새 이슈 점검

| 우선순위 | 이슈 | 영향 | 권장 조치 |
| --- | --- | --- | --- |
| P0 | 프론트 `package.json`에 Chromatic project token이 직접 포함됨 | 저장소 공개 또는 로그 노출 시 외부 서비스 토큰 유출 가능 | 스크립트에서 토큰 제거, `CHROMATIC_PROJECT_TOKEN` 환경변수 또는 GitHub Actions secret 사용 |
| P0 | 백엔드 `모아계정.txt`에 테스트 계정/비밀번호가 평문으로 추적됨 | 민감 정보가 Git 이력과 배포 산출물에 남을 수 있음 | 파일 삭제 유지, 필요 시 GitHub secret/로컬 문서로 분리 |
| P1 | 프론트 Storybook/Vitest browser 설정이 추가됐지만 CI 실행 경로가 아직 명확하지 않음 | 시각 회귀/접근성 테스트가 로컬 전용으로 남을 수 있음 | GitHub Actions에 `npm run build`, `npm run lint`, `npm run build-storybook` 단계 추가 |
| P1 | 메인 페이지 개편 폭이 크지만 화면 회귀 테스트가 부족함 | 랜딩, 모바일 헤더, 챗봇 floating UI가 실제 기기에서 깨질 수 있음 | Playwright 또는 Storybook interaction/a11y 테스트로 핵심 viewport 고정 |
| P2 | README 일부 한글이 인코딩 깨짐 상태로 보임 | 신규 개발자 온보딩과 산출물 문서 품질 저하 | UTF-8 기준 README 재작성 또는 별도 운영 문서로 대체 |
| P2 | `moa_temp_extracted` 같은 임시 산출물이 작업 폴더에 남아 있음 | 실수로 대량 커밋될 위험 | `.gitignore`에 추가하고 실제 반영한 파일만 추적 |

## 2. 고도화 작업 우선순위

1. 보안/비밀정보 정리
   - Chromatic token, 테스트 계정 파일, `.env`, 인증서/키 파일의 추적 여부를 재점검한다.
   - GitHub Actions secret 기반으로 Chromatic, 배포, 외부 API 키를 관리한다.

2. 배포 안정화
   - 프론트: `npm run lint`, `npm run build`, `npm run build-storybook`을 CI 필수 체크로 묶는다.
   - 백엔드: Maven test/package, systemd 배포, smoke endpoint 확인을 Actions에 명시한다.

3. 랜딩/로그인 UX 검증
   - 메인 페이지의 신규 카드형 레이아웃, sticky header, 챗봇 safe-area 위치를 모바일/데스크톱에서 확인한다.
   - 카카오 로그인 공식 이미지가 빌드 산출물에 정상 포함되는지 검증한다.

4. 테스트 체계 확장
   - Storybook stories를 실제 MOA 컴포넌트 중심으로 교체한다.
   - Vitest browser 테스트와 a11y 테스트를 핵심 UI부터 적용한다.

5. 문서 정비
   - 깨진 README를 UTF-8로 정리하고, 작업 이력/배포/운영 문서를 `docs/` 아래로 모은다.

## 3. Git 활동 요약

최근 자동화 기준 시각: 2026-05-17T16:29:20Z

- 2026-05-17T16:29:20Z 이후 신규 커밋: 없음
- 백엔드 현재 변경: 평문 계정 파일 `모아계정.txt` 삭제
- 프론트 현재 변경: 랜딩 UI 개편, 헤더/챗봇 위치 보정, 카카오 로그인 버튼 이미지 반영, MOA favicon/title 적용, Storybook/Vitest browser 설정 추가, 관리자 리팩토링 계획 문서 삭제, 임시 폴더 ignore

## 4. 날짜별 작업 내역

### 2026-05-18

- 프론트 랜딩 페이지를 카드형 대시보드 스타일로 개편했다.
- 헤더를 상단 고정 bar에서 sticky floating header 형태로 조정했다.
- 챗봇 버튼과 패널 위치를 safe-area 기준으로 보정했다.
- 로그인 화면의 카카오 로그인 버튼을 공식 이미지 기반으로 교체했다.
- MOA favicon과 브라우저 title을 적용했다.
- Storybook, Chromatic, Vitest browser 테스트 설정을 추가했다.
- Chromatic 토큰을 package script에서 제거하고 환경변수 기반 실행으로 전환했다.
- 임시 추출 폴더를 `.gitignore`에 추가했다.
- 백엔드 평문 계정 파일 삭제 상태를 확인했다.
- 프로젝트 작업 이력과 고도화 우선순위를 문서화했다.

### 2026-05-17

- 백엔드 GitHub Actions 배포 방식을 systemd 운영 방식에 맞게 수정했다.
- Maven wrapper 실행 권한 문제를 수정했다.
- PASS 토큰 응답 처리 중 변수 중복 선언 문제를 수정했다.

### 2026-05-14

- 백엔드 IDE 경고 다수를 정리했다.
- README에 Notion 기획서 링크를 추가했다.
- 최신 프로젝트 명세와 로고를 반영했다.
- Git workflow rule과 `.gitignore`를 업데이트했다.
- WAR packaging과 GitHub Actions 배포 workflow를 정리했다.
- 보안 취약 파일과 불필요한 스크립트를 정리했다.

### 2026-05-11

- 백엔드 이미지 계약과 smoke test를 추가했다.
- 프론트 UI 안정성과 이미지 처리 흐름을 개선했다.
- 마이페이지, 금융 내역, 계좌 인증 관련 화면을 개선했다.

### 2026-05-10

- 백엔드 mock 계좌 인증을 추가했다.
- 프론트 전반 경험을 개선했다.

### 2026-05-05

- 챗봇 intent 응답 우선순위를 개선했다.
- 운영 인증/업로드 설정을 보강했다.
- 프론트 운영 수정과 챗봇 UI를 개선했다.
