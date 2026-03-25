# Customer Frontend - NFR Requirements Plan

## Unit Context
- **Unit**: customer-frontend
- **Tech Stack (Decided)**: Vue.js 3 + Vite + TailwindCSS + PrimeVue + Vuex 4 + TypeScript
- **Key Features**: Auto Login, Menu Browse, Cart (local), Order Creation, Order History (SSE)

## NFR Assessment Steps

- [x] Step 1: Performance Requirements 정의 (로딩, 렌더링, 인터랙션 응답 시간)
- [x] Step 2: Usability / Accessibility Requirements 정의
- [x] Step 3: Reliability Requirements 정의 (에러 처리, SSE 재연결)
- [x] Step 4: Security Requirements 정의 (토큰 관리, XSS 방지)
- [x] Step 5: Maintainability Requirements 정의 (코드 구조, 테스트)
- [x] Step 6: Tech Stack Detail Decisions 정의 (라이브러리 버전, 추가 패키지)

---

## Clarification Questions

아래 질문에 답변해주세요. 각 질문의 [Answer]: 뒤에 선택지 알파벳을 입력해주세요.

## Question 1
타겟 디바이스 및 화면 크기는?

A) 태블릿 전용 (10인치 이상) - 반응형 불필요, 태블릿 최적화만
B) 태블릿 우선 + 모바일 지원 - 태블릿 최적화하되 모바일도 대응
C) 모든 디바이스 반응형 - 모바일, 태블릿, 데스크탑 모두 지원
D) Other (please describe after [Answer]: tag below)

[Answer]:C

## Question 2
지원할 브라우저 범위는?

A) 최신 Chromium 기반만 (Chrome, Edge) - 태블릿 기본 브라우저
B) 최신 주요 브라우저 (Chrome, Safari, Firefox, Edge)
C) IE 포함 레거시 브라우저까지 지원
D) Other (please describe after [Answer]: tag below)

[Answer]:B

## Question 3
메뉴 이미지 로딩 최적화 수준은?

A) 기본 - img 태그 직접 사용, 별도 최적화 없음
B) Lazy Loading - 화면에 보이는 이미지만 로드 (Intersection Observer)
C) Lazy Loading + Placeholder - 로딩 중 placeholder/skeleton 표시
D) Other (please describe after [Answer]: tag below)

[Answer]:A

## Question 4
오프라인/네트워크 끊김 대응 수준은?

A) 미대응 - 네트워크 끊기면 에러 메시지만 표시
B) 기본 대응 - 네트워크 상태 감지 + 재연결 시 자동 복구 시도
C) PWA 수준 - Service Worker로 오프라인 캐싱, 네트워크 복구 시 동기화
D) Other (please describe after [Answer]: tag below)

[Answer]:B

## Question 5
단위 테스트 프레임워크 선택은?

A) Vitest - Vite 네이티브, 빠른 실행, Vue 생태계 표준
B) Jest - 안정적, 풍부한 생태계
C) 테스트 프레임워크 미정 - 나중에 결정
D) Other (please describe after [Answer]: tag below)

[Answer]:A

## Question 6
컴포넌트 테스트 도구 선택은?

A) Vue Test Utils + Testing Library - 컴포넌트 단위 테스트
B) Cypress Component Testing - E2E 스타일 컴포넌트 테스트
C) 컴포넌트 테스트 생략 - 단위 테스트만 작성
D) Other (please describe after [Answer]: tag below)

[Answer]:A

## Question 7
코드 품질 도구는?

A) ESLint + Prettier - 린트 + 포맷팅
B) ESLint만 - 린트만 적용
C) 코드 품질 도구 미적용
D) Other (please describe after [Answer]: tag below)

[Answer]:C

## Question 8
다국어(i18n) 지원이 필요한가요? (요구사항에서 제외되어 있으나 확인)

A) 한국어만 - 다국어 미지원, 한국어 하드코딩
B) i18n 프레임워크 구성만 - 현재는 한국어만이지만 추후 확장 가능하도록 구조만 준비
C) Other (please describe after [Answer]: tag below)

[Answer]:A
