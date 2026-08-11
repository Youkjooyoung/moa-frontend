# MOA Frontend Codex 작업 지침

## 기본 원칙

- 모든 응답과 작업 기록은 한국어로 작성한다.
- 작업 전 적용 가능한 Skill과 저장소 지침을 확인하고, 작업 범위를 번호 목록으로 설명한 뒤 진행한다.
- 구현 결과가 맞다고 단정하지 말고 검증 가능한 명령으로 한 번 더 확인한다.
- 다른 AI 도구 전용 설정이나 문구를 남기지 않는다. 필요한 자동화 지침은 Codex용 `AGENTS.md`에 기록한다.

## Git 워크플로

- 기본 작업 브랜치는 `dev`이다.
- 커밋 전 `git status --short --branch`와 diff를 확인한다.
- 사용자 변경분과 자동화 변경분이 섞이면 되돌리지 않고 범위를 분리한다.
- 커밋 메시지는 실제 변경 내용을 짧고 구체적으로 작성한다.

## 검증 기준

- 프론트엔드 변경 후 가능한 범위에서 `npm.cmd run lint`, `npm.cmd run test:unit`, `npm.cmd run build`를 실행한다.
- PowerShell 실행 정책상 `npm`이 막히면 `npm.cmd`를 사용한다.
- lint warning은 통과로 보되, 남은 warning 수와 주요 유형은 문서에 남긴다.
