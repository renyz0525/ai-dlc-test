# Admin Frontend - Functional Design Plan

## Unit Context
- **Unit**: Admin Frontend (Unit 3)
- **Technology**: Vue.js 3 + Vite + TailwindCSS + PrimeVue + Vuex 4 (TypeScript)
- **Assigned Stories**: US-A01, US-A02, US-A03, US-A04, US-A05, US-A06, US-A07

## Plan Steps

- [x] Step 1: Auth (Login) - 비즈니스 로직 및 컴포넌트 설계
  - 관리자 로그인 폼, JWT 저장, 세션 관리, 로그인 시도 제한 UI
  - Route guard (인증 필요 페이지 보호)

- [x] Step 2: Dashboard (Order Monitor) - 비즈니스 로직 및 컴포넌트 설계
  - SSE 연결 및 실시간 주문 수신
  - 테이블별 카드 그리드 레이아웃
  - 주문 상세 보기 (모달/패널)
  - 주문 상태 변경 (대기중/준비중/완료)
  - 미확인 주문 알림 (깜빡임/펄스 애니메이션)
  - 테이블별 필터링

- [x] Step 3: Table Management - 비즈니스 로직 및 컴포넌트 설계
  - 테이블 초기 설정 (번호/비밀번호)
  - 주문 삭제 (확인 팝업)
  - 이용 완료 (확인 팝업, 리셋)
  - 과거 주문 내역 조회 (날짜 필터링)

- [x] Step 4: Menu Management - 비즈니스 로직 및 컴포넌트 설계
  - 메뉴 CRUD 폼
  - 이미지 업로드 및 미리보기
  - 카테고리별 분류
  - 메뉴 노출 순서 드래그앤드롭 조정

- [x] Step 5: Domain Entities & State Management 설계
  - TypeScript 인터페이스/타입 정의
  - Vuex Store 모듈 구조
  - API Client 계층

- [x] Step 6: Business Rules & Validation 정의
  - 폼 검증 규칙
  - 인증/권한 규칙
  - UI 상태 전환 규칙

- [x] Step 7: Frontend Components 계층 구조 정의
  - 컴포넌트 트리
  - Props/Emits 정의
  - 라우팅 구조

---

## Clarification Questions

아래 질문에 답변해주세요. 각 질문의 [Answer]: 뒤에 선택지 알파벳을 기입해주세요.

## Question 1
Dashboard에서 주문 상세 보기 UI 패턴은 어떤 것을 선호하시나요?

A) 모달 다이얼로그 (카드 클릭 시 오버레이 팝업)
B) 사이드 패널 (오른쪽 슬라이드 패널)
C) 인라인 확장 (카드 아래로 확장)
D) 별도 페이지 (상세 페이지로 이동)
E) Other (please describe after [Answer]: tag below)

[Answer]:A

## Question 2
테이블 카드 그리드에서 테이블 정렬 방식은 어떻게 하시겠습니까?

A) 테이블 번호 순 고정 (항상 번호 오름차순)
B) 최신 주문 순 (최근 주문이 있는 테이블 우선)
C) 미처리 주문 수 기준 (대기중 주문이 많은 테이블 우선)
D) Other (please describe after [Answer]: tag below)

[Answer]:B

## Question 3
메뉴 관리에서 카테고리 자체의 CRUD(생성/수정/삭제)도 Admin Frontend에서 지원해야 하나요?

A) Yes - 카테고리 CRUD도 메뉴 관리 화면에서 함께 지원
B) No - 카테고리는 사전 정의된 것만 사용 (Backend seed 데이터)
C) Other (please describe after [Answer]: tag below)

[Answer]:A

## Question 4
메뉴 순서 조정 방식으로 어떤 것을 선호하시나요?

A) 드래그 앤 드롭 (직관적이지만 구현 복잡도 높음)
B) 위/아래 화살표 버튼 (단순하고 명확)
C) 순서 번호 직접 입력
D) Other (please describe after [Answer]: tag below)

[Answer]:B

## Question 5
Dashboard에서 주문 상태 변경 시 확인 절차가 필요한가요?

A) 확인 없이 즉시 변경 (빠른 처리 우선)
B) 모든 상태 변경 시 확인 팝업 표시
C) "완료" 상태로 변경할 때만 확인 팝업 표시
D) Other (please describe after [Answer]: tag below)

[Answer]:B

## Question 6
Admin Frontend의 네비게이션 구조를 어떻게 하시겠습니까?

A) 상단 네비게이션 바 (Dashboard, Tables, Menus)
B) 왼쪽 사이드바 네비게이션
C) Dashboard를 메인으로 하고, Tables/Menus는 탭 또는 서브메뉴
D) Other (please describe after [Answer]: tag below)

[Answer]:B

## Question 7
과거 주문 내역 조회 UI를 어디에 배치하시겠습니까?

A) Table Management 페이지 내 테이블별 "과거 내역" 버튼 -> 모달/패널
B) 별도 "주문 이력" 페이지로 분리
C) Dashboard에서 테이블 카드 내 "이력 보기" 버튼
D) Other (please describe after [Answer]: tag below)

[Answer]:A

## Question 8
테이블 초기 설정은 어떤 UI 패턴으로 제공하시겠습니까?

A) Table Management 페이지에 "테이블 추가" 버튼 -> 설정 폼 모달
B) 테이블 목록 상단에 인라인 설정 폼
C) 별도 "테이블 설정" 페이지
D) Other (please describe after [Answer]: tag below)

[Answer]:C
