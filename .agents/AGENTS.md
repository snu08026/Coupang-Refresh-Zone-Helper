# Workspace Rules

## 1. Automatic Version Bump & GitHub Deployment
- 모든 코드 수정이 완료된 후에는 클라이언트가 즉각 변경 사항을 내려받을 수 있도록 서비스 워커 캐시 버전(`sw.js`의 `CACHE_NAME` 및 `index.html` 내의 오프라인 fallback 텍스트)을 반드시 **1씩 상향 조정**해야 합니다.
- 수정 사항이 발생하면 작업 종료 시점에 반드시 `git add .`, `git commit -m "내용"`, `git push` 명령어를 순차적으로 실행하여 원격 GitHub 저장소에 변경 사항을 최종 배포해야 합니다.

## 2. 화면 노출 제어 (창 띄우기 금지)
- 작업 도중 어떠한 상황에서도 브라우저 제어 에이전트(`browser_subagent`)나 GUI 창을 띄우는 도구를 실행해서는 안 됩니다. 모든 검증 및 작업은 백그라운드 명령어와 정적 코드 분석으로 수행해야 합니다.
