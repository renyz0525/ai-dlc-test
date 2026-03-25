# Admin Frontend - NFR Requirements Plan

## Unit Context
- **Unit**: Admin Frontend (Unit 3)
- **Base Technology**: Vue.js 3 + Vite + TailwindCSS + PrimeVue + Vuex 4 (TypeScript)
- **Key Features**: SSE 실시간 통신, JWT 인증, 이미지 업로드, 대시보드 모니터링

## Plan Steps

- [x] Step 1: Performance Requirements 정의
  - SSE 실시간 업데이트 응답 시간
  - 페이지 로딩 속도
  - 대시보드 렌더링 성능 (다수 테이블 카드)

- [x] Step 2: Usability & Accessibility Requirements 정의
  - 반응형 디자인 범위
  - 브라우저 호환성
  - 터치 인터랙션 지원

- [x] Step 3: Reliability Requirements 정의
  - SSE 연결 복구
  - API 에러 처리 전략
  - 오프라인/네트워크 장애 대응

- [x] Step 4: Security Requirements 정의
  - JWT 토큰 저장 방식
  - XSS/CSRF 방어
  - API 통신 보안

- [x] Step 5: Tech Stack Detail Decisions
  - 상태 관리 세부 패턴
  - 테스트 프레임워크 선택
  - 빌드/배포 설정

- [x] Step 6: NFR Requirements 문서 생성
- [x] Step 7: Tech Stack Decisions 문서 생성

---

## Clarification Questions

아래 질문에 답변해주세요. 각 질문의 [Answer]: 뒤에 선택지 알파벳을 기입해주세요.

## Question 1
Admin Frontend의 주요 사용 디바이스는 무엇인가요?

A) 데스크탑 PC만 (반응형 불필요)
B) 데스크탑 + 태블릿 (반응형 필요, 모바일 제외)
C) 데스크탑 + 태블릿 + 모바일 (풀 반응형)
D) Other (please describe after [Answer]: tag below)

[Answer]:A

## Question 2
대시보드에서 동시에 표시해야 할 최대 테이블 수는 얼마인가요?

A) 10개 이하 (소규모 매장)
B) 10~30개 (중규모 매장)
C) 30~50개 (대규모 매장)
D) Other (please describe after [Answer]: tag below)

[Answer]:A

## Question 3
JWT 토큰 저장 방식으로 어떤 것을 선호하시나요?

A) localStorage (간편, XSS에 취약할 수 있음)
B) httpOnly Cookie (보안 강화, CSRF 대응 필요)
C) Memory + Refresh Token (가장 안전, 새로고침 시 재로그인)
D) Other (please describe after [Answer]: tag below)

[Answer]:A

## Question 4
단위 테스트 프레임워크로 어떤 것을 사용하시겠습니까?

A) Vitest (Vite 네이티브, 빠름, Vue 생태계 추천)
B) Jest (안정적, 널리 사용됨)
C) Other (please describe after [Answer]: tag below)

[Answer]:A

## Question 5
컴포넌트 테스트 도구로 어떤 것을 사용하시겠습니까?

A) Vue Test Utils + Vitest/Jest (표준 조합)
B) Cypress Component Testing (E2E와 통합)
C) Testing Library (@testing-library/vue, 사용자 관점 테스트)
D) Other (please describe after [Answer]: tag below)

[Answer]:A

## Question 6
대시보드 페이지 초기 로딩 시간 목표는 어느 정도인가요?

A) 1초 이내 (매우 빠름, 적극적 최적화 필요)
B) 2초 이내 (적정 수준)
C) 3초 이내 (기본 수준)
D) Other (please describe after [Answer]: tag below)

[Answer]:C

## Question 7
브라우저 호환성 범위를 어떻게 설정하시겠습니까?

A) 최신 Chrome만 (관리자 전용이므로 브라우저 지정 가능)
B) Chrome + Edge + Firefox 최신 버전
C) Chrome + Edge + Firefox + Safari 최신 버전
D) Other (please describe after [Answer]: tag below)

[Answer]:A
