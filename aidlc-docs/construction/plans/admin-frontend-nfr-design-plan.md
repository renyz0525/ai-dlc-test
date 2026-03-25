# Admin Frontend - NFR Design Plan

## Unit Context
- **Unit**: Admin Frontend (Unit 3)
- **NFR Summary**: 데스크탑 전용, 소규모(10테이블), Chrome만, 3초 로딩, localStorage JWT, Vitest

## Plan Steps

- [x] Step 1: Resilience Patterns 설계
  - SSE 연결 복구 패턴
  - API 에러 처리 패턴 (글로벌 인터셉터)
  - Optimistic Update 패턴

- [x] Step 2: Performance Patterns 설계
  - 라우트별 코드 스플리팅
  - PrimeVue 개별 import
  - SSE 이벤트 처리 최적화

- [x] Step 3: Security Patterns 설계
  - JWT 토큰 관리 패턴
  - Route Guard 패턴
  - API 인증 인터셉터

- [x] Step 4: State Management Patterns 설계
  - Vuex 모듈 패턴
  - SSE -> Vuex 연동 패턴
  - 비확인 주문 타이머 관리

- [x] Step 5: Logical Components 정의
  - API Client 계층
  - SSE Manager
  - Toast/Confirm 서비스

---

## Clarification Questions

아래 질문에 답변해주세요. 각 질문의 [Answer]: 뒤에 선택지 알파벳을 기입해주세요.

## Question 1
SSE 연결이 완전히 실패한 경우 (10회 재시도 후) 대시보드 데이터를 어떻게 유지하시겠습니까?

A) 수동 새로고침만 안내 (별도 폴링 없음)
B) SSE 실패 시 30초 간격 HTTP 폴링으로 전환
C) Other (please describe after [Answer]: tag below)

[Answer]:A

## Question 2
API 요청 실패 시 자동 재시도 전략이 필요한가요?

A) 재시도 없음 (즉시 에러 표시, 사용자 수동 재시도)
B) GET 요청만 1회 자동 재시도
C) Other (please describe after [Answer]: tag below)

[Answer]:A

## Question 3
PrimeVue 테마/스타일링 방식은 어떻게 하시겠습니까?

A) PrimeVue 기본 테마 (Aura) + TailwindCSS 커스터마이징
B) PrimeVue Unstyled 모드 + TailwindCSS로 완전 커스텀 스타일링
C) Other (please describe after [Answer]: tag below)

[Answer]:A
