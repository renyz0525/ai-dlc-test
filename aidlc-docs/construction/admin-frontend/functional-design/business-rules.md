# Admin Frontend - Business Rules & Validation

## 1. Authentication Rules

### BR-AUTH-01: Login Attempt Limiting
- 최대 연속 실패 허용 횟수: 5회
- 잠금 시간: 15분
- 잠금 해제 후 카운터 리셋
- 잠금 상태는 클라이언트 localStorage에 저장 (loginAttempts, lockUntil)

### BR-AUTH-02: Session Duration
- JWT 토큰 유효 기간: 16시간
- 토큰 만료 시 자동 로그아웃
- 토큰 만료 확인: API 호출 시 401 응답 또는 클라이언트 측 JWT decode

### BR-AUTH-03: Route Protection
- /login 외 모든 라우트는 인증 필요
- 미인증 접근 시 /login으로 리다이렉트 (redirect query 보존)
- 인증 상태에서 /login 접근 시 /dashboard로 리다이렉트

## 2. Login Form Validation

### BR-LOGIN-01: Store ID
- 필수 입력
- 빈 문자열 불가

### BR-LOGIN-02: Username
- 필수 입력
- 빈 문자열 불가

### BR-LOGIN-03: Password
- 필수 입력
- 빈 문자열 불가

## 3. Dashboard Rules

### BR-DASH-01: Table Card Sorting
- 기본 정렬: 가장 최근 주문의 createdAt 내림차순
- 주문이 없는 테이블: 목록 하단에 테이블 번호 오름차순
- 새 주문 도착 시 정렬 자동 재계산

### BR-DASH-02: Order Status Transitions
- 허용된 상태 전환:
  - pending -> preparing
  - preparing -> completed
- 역방향 전환 불가 (completed -> preparing 등)
- 모든 상태 변경 시 확인 팝업 필수

### BR-DASH-03: Unacknowledged Order Alert
- 대기 시간: 신규 주문 도착 후 30초
- 알림 방식: 테이블 카드 펄스 애니메이션 (1초 간격 반복)
- 알림 중단 조건: 주문 상세 모달 열기 또는 주문 상태 변경
- 여러 주문이 미확인인 경우: 하나라도 남아있으면 애니메이션 유지

### BR-DASH-04: SSE Connection
- 자동 재연결: 연결 끊김 시 3초 간격, 최대 10회 시도
- 연결 상태 UI 표시: connected / reconnecting / disconnected
- 페이지 이탈 시 SSE 연결 해제

### BR-DASH-05: Order Deletion
- 확인 팝업 필수 ("되돌릴 수 없습니다" 경고 포함)
- 삭제 후 테이블 총 주문액 자동 재계산

### BR-DASH-06: Table Completion
- 확인 팝업 필수
- 완료 후: 해당 테이블의 현재 주문 모두 제거, 총액 리셋

## 4. Table Setup Validation

### BR-TABLE-01: Table Number
- 필수 입력
- 양의 정수만 허용 (1 이상)
- 동일 매장 내 중복 불가 (서버 측 검증, 클라이언트 경고)

### BR-TABLE-02: Table Password
- 필수 입력
- 최소 4자리
- 비밀번호 확인 필드와 일치 필수

## 5. Menu Management Rules

### BR-MENU-01: Menu Name
- 필수 입력
- 최소 1자, 최대 100자

### BR-MENU-02: Menu Price
- 필수 입력
- 양의 정수 (0 초과)
- 최대 1,000,000 (100만원)

### BR-MENU-03: Menu Description
- 선택 입력
- 최대 500자

### BR-MENU-04: Menu Image
- 선택 입력
- 허용 형식: JPG, JPEG, PNG, GIF, WebP
- 최대 파일 크기: 5MB
- 이미지 없는 경우 기본 플레이스홀더 표시

### BR-MENU-05: Menu Category
- 필수 선택
- 유효한 카테고리 ID여야 함

### BR-MENU-06: Sort Order (위/아래 화살표)
- 첫 번째 항목: 위 화살표 비활성화
- 마지막 항목: 아래 화살표 비활성화
- 순서 변경 시 서버에 즉시 반영

## 6. Category Management Rules

### BR-CAT-01: Category Name
- 필수 입력
- 최소 1자, 최대 50자
- 동일 매장 내 중복 불가

### BR-CAT-02: Category Deletion
- 확인 팝업 필수
- 하위 메뉴가 있는 경우 경고 메시지 ("카테고리 삭제 시 하위 메뉴도 함께 삭제됩니다.")
- 사용자가 명시적으로 확인해야 삭제 진행

## 7. Order History Rules

### BR-HIST-01: Date Filtering
- 기본값: 오늘 날짜
- 시작일은 종료일 이전이어야 함
- 미래 날짜 선택 불가

### BR-HIST-02: Display
- 세션 단위로 그룹화
- 시간 역순 정렬
- 각 세션: 시작시각, 완료시각, 주문 목록, 총 금액 표시

## 8. UI General Rules

### BR-UI-01: Confirmation Dialogs
- 모든 파괴적 액션(삭제, 이용 완료)에 확인 팝업 필수
- 팝업에 작업 설명 및 경고 메시지 포함
- "확인"과 "취소" 버튼 명확히 구분

### BR-UI-02: Error Handling
- API 에러 시 Toast 알림으로 에러 메시지 표시
- 네트워크 에러 시 재시도 옵션 제공
- 401 에러 시 자동 로그아웃 및 로그인 페이지 리다이렉트

### BR-UI-03: Loading States
- API 호출 중 로딩 인디케이터 표시
- 버튼은 요청 중 비활성화 (중복 클릭 방지)

### BR-UI-04: Success Feedback
- 데이터 변경 성공 시 Toast 알림으로 성공 메시지 표시
- 목록 자동 갱신
