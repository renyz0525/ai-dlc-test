# Customer Frontend - Functional Design Plan

## Unit Context
- **Unit**: customer-frontend
- **Stories**: US-C01 ~ US-C05 (5 stories)
- **Tech**: Vue.js 3 + Vite + TailwindCSS + PrimeVue + Vuex 4
- **Role**: Developer 2 (Customer Frontend)

## Functional Design Steps

- [x] Step 1: Auth (Auto Login) - 비즈니스 로직 및 세션 관리 설계
- [x] Step 2: Menu View - 메뉴 탐색 비즈니스 로직 설계
- [x] Step 3: Cart - 장바구니 비즈니스 로직 설계 (로컬 전용)
- [x] Step 4: Order Creation - 주문 생성 플로우 설계
- [x] Step 5: Order History - 주문 내역 조회 로직 설계
- [x] Step 6: Frontend Component Hierarchy 설계
- [x] Step 7: State Management (Vuex) 설계
- [x] Step 8: API Integration Points 정의
- [x] Step 9: Business Rules & Validation 정의

---

## Clarification Questions

아래 질문에 답변해주세요. 각 질문의 [Answer]: 뒤에 선택지 알파벳을 입력해주세요.

## Question 1
메뉴 화면에서 카테고리 전환 방식은 어떤 형태를 선호하시나요?

A) 상단 탭(Tab) 바 - 카테고리 탭 클릭 시 해당 카테고리로 필터링
B) 좌측 사이드 네비게이션 - 카테고리 목록을 좌측에 고정 배치
C) 상단 가로 스크롤 칩(Chip) - 카테고리 칩을 가로 스크롤로 표시
D) Other (please describe after [Answer]: tag below)

[Answer]:B

## Question 2
장바구니 UI 접근 방식은 어떤 형태를 선호하시나요?

A) 하단 고정 바 - 항상 화면 하단에 장바구니 요약(수량, 총액) 표시, 클릭 시 장바구니 페이지로 이동
B) 우측 슬라이드 패널 - 장바구니 아이콘 클릭 시 우측에서 패널 슬라이드
C) 별도 전체 페이지 - 장바구니 아이콘 클릭 시 전체 페이지로 이동
D) Other (please describe after [Answer]: tag below)

[Answer]:B

## Question 3
메뉴에 장바구니 추가 시 수량 선택 방식은 어떤 형태를 선호하시나요?

A) 즉시 1개 추가 - 메뉴 카드에 "담기" 버튼, 클릭 시 즉시 1개 추가 (수량은 장바구니에서 조절)
B) 수량 선택 모달 - 메뉴 클릭 시 상세 모달 팝업에서 수량 선택 후 추가
C) 메뉴 카드 인라인 - 카드에 +/- 버튼으로 즉시 수량 조절
D) Other (please describe after [Answer]: tag below)

[Answer]:A

## Question 4
주문 확정 후 성공 화면에서 5초 대기 중 사용자가 할 수 있는 액션은?

A) 5초 카운트다운만 표시, 사용자 액션 없이 자동 리다이렉트
B) 5초 카운트다운 + "메뉴로 바로 가기" 버튼 제공 (즉시 이동 가능)
C) 5초 카운트다운 + "주문 내역 보기" 버튼도 추가 제공
D) Other (please describe after [Answer]: tag below)

[Answer]:A

## Question 5
주문 내역 화면에서 주문 상태 실시간 업데이트가 필요한가요? (요구사항에서 "선택사항"으로 표시됨)

A) Yes - SSE 연결로 주문 상태 실시간 업데이트 (관리자가 상태 변경 시 즉시 반영)
B) No - 화면 진입 시 조회만, 수동 새로고침으로 상태 확인
C) 절충안 - 주기적 폴링(예: 30초)으로 상태 업데이트
D) Other (please describe after [Answer]: tag below)

[Answer]:A

## Question 6
초기 설정 화면(SetupView)의 접근 방식은?

A) 최초 접근 시 자동 표시 - 저장된 인증 정보가 없을 때만 설정 화면 표시, 이후 자동 로그인
B) URL 직접 접근 - /setup 경로로만 접근 가능, 관리자가 태블릿에서 직접 URL 입력
C) 메뉴 화면에 숨겨진 설정 버튼 - 길게 누르기 등 특별한 제스처로 설정 화면 접근
D) Other (please describe after [Answer]: tag below)

[Answer]:A

## Question 7
Backend API가 아직 완성 전이므로, Mock API 전략은 어떻게 하시겠습니까?

A) MSW (Mock Service Worker) 사용 - 브라우저 레벨 API 모킹, 실제 API와 동일한 요청/응답 시뮬레이션
B) JSON Server 사용 - 간단한 REST API 모킹 서버 구동
C) Vuex store 내부 Mock 데이터 - API 호출 없이 하드코딩된 데이터 사용, API 연동 시 교체
D) Other (please describe after [Answer]: tag below)

[Answer]:C

## Question 8
페이지네이션 또는 무한 스크롤 방식은? (주문 내역 화면에서 요구사항에 언급됨)

A) 무한 스크롤 - 하단 도달 시 자동 로드
B) 페이지네이션 - 페이지 번호 버튼으로 이동
C) "더 보기" 버튼 - 클릭 시 추가 데이터 로드
D) 현재 세션 주문만 표시하므로 양이 적어 전체 로드 (페이지네이션 불필요)
E) Other (please describe after [Answer]: tag below)

[Answer]:B
