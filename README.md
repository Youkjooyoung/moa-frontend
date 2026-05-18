# MOA Frontend

MOA는 OTT 구독 파티를 찾고, 참여하고, 결제/정산 상태를 확인하는 구독 공유 서비스입니다. 이 저장소는 React, Vite, Tailwind CSS 기반 프론트엔드입니다.

## 기술 스택

- React 19
- Vite
- Tailwind CSS
- Zustand
- Vitest
- Storybook

## 로컬 실행

```bash
npm install
npm run dev
```

개발 서버는 Vite 기본 포트를 사용합니다. 백엔드 API는 `vite.config.js`의 `/api`, `/uploads` 프록시를 통해 `http://localhost:8080`으로 전달됩니다.

## 검증

```bash
npm run lint
npm run test:unit
npm run build
npm run build-storybook
```

`build-storybook`은 로컬 `node_modules` 경로가 junction 또는 symlink로 연결된 환경에서도 동작하도록 별도 cache wrapper를 사용합니다.

## 주요 화면

- 랜딩: 인기 구독, 모집 중 파티, CTA
- 인증: 이메일/소셜 로그인, 회원가입, 비밀번호 재설정
- 파티: 파티 목록, 상세, 생성, 참여
- 마이페이지: 내 구독, 결제/정산 이력, 계좌 인증
- 관리자: 사용자, 상품, 공지, 문의, 로그인 이력 관리

## 운영 메모

- Chromatic은 `CHROMATIC_PROJECT_TOKEN` 환경변수 또는 GitHub Actions secret으로 실행합니다.
- `moa_temp_extracted/`, `storybook-static/`, `.cache/`, `coverage/`는 커밋하지 않습니다.
- UI 회귀 검증은 Storybook stories와 Vitest unit tests를 기준으로 확장합니다.

## 관련 문서

- [작업 이력 및 고도화 우선순위](./docs/PROJECT_ACTIVITY_AND_PRIORITIES.md)
