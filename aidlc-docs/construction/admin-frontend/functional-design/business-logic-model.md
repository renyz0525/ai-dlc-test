# Admin Frontend - Business Logic Model

## 1. Auth (Login) Business Logic

### 1.1 Login Flow
```
1. 사용자가 매장ID, 사용자명, 비밀번호 입력
2. 로그인 시도 제한 확인:
   - loginAttempts >= 5 && 현재시간 < lockUntil -> 로그인 차단, 남은 시간 표시
   - loginAttempts >= 5 && 현재시간 >= lockUntil -> 카운터 리셋, 로그인 허용
3. POST /api/auth/admin/login 호출
4. 성공:
   - JWT 토큰을 localStorage 저장
   - 사용자 정보를 Vuex store 저장
   - storeId를 Vuex store 저장
   - loginAttempts 리셋
   - Dashboard 페이지로 리다이렉트
5. 실패:
   - loginAttempts 증가
   - loginAttempts >= 5 -> lockUntil = 현재시간 + 15분 설정
   - 에러 메시지 표시
```

### 1.2 Session Management
```
1. 앱 초기화 시:
   - localStorage에서 JWT 토큰 확인
   - 토큰 존재 시 -> 토큰 만료 확인 (JWT decode)
   - 유효 -> 인증 상태 설정, 요청 페이지로 이동
   - 만료 -> 토큰 삭제, 로그인 페이지로 리다이렉트
2. API 요청 시:
   - Authorization 헤더에 JWT 토큰 자동 포함
   - 401 응답 시 -> 토큰 삭제, 로그인 페이지로 리다이렉트
3. 로그아웃:
   - localStorage 토큰 삭제
   - Vuex store 초기화
   - SSE 연결 해제
   - 로그인 페이지로 리다이렉트
```

### 1.3 Route Guard
```
1. 인증 필요 라우트 접근 시:
   - 토큰 존재 && 유효 -> 접근 허용
   - 토큰 없음 || 만료 -> /login으로 리다이렉트 (원래 경로 query 파라미터로 보존)
2. 로그인 페이지 접근 시:
   - 이미 인증됨 -> /dashboard로 리다이렉트
```

---

## 2. Dashboard (Order Monitor) Business Logic

### 2.1 초기 로드
```
1. Dashboard 마운트 시:
   a. GET /api/stores/:storeId/tables -> 테이블 목록 로드
   b. GET /api/stores/:storeId/orders?status=pending,preparing -> 활성 주문 로드
   c. SSE 연결 시작 (GET /api/stores/:storeId/events)
2. 테이블 카드 구성:
   - 각 테이블에 해당 주문 매핑
   - 테이블별 총 주문액 계산
   - 최신 주문 미리보기 추출
   - 최신 주문 순 정렬 (Q2:B)
```

### 2.2 SSE 실시간 업데이트
```
1. order:created 수신:
   - orders 배열에 새 주문 추가
   - 해당 테이블 카드 업데이트 (총액 재계산, 최신 주문 갱신)
   - unacknowledgedOrderIds에 추가
   - 테이블 카드 정렬 순서 재계산
2. order:statusChanged 수신:
   - 해당 주문의 status 업데이트
   - 테이블 카드 시각적 반영
3. order:deleted 수신:
   - orders 배열에서 해당 주문 제거
   - 테이블별 총 주문액 재계산
4. table:completed 수신:
   - 해당 테이블의 주문 모두 제거
   - 테이블 카드 리셋
5. SSE 연결 끊김:
   - 자동 재연결 시도 (3초 간격, 최대 10회)
   - 연결 상태 UI 표시
```

### 2.3 미확인 주문 알림
```
1. 신규 주문 도착 시:
   - unacknowledgedOrderIds에 orderId 추가
   - 30초 타이머 시작
2. 30초 경과 후 미확인:
   - 해당 테이블 카드에 펄스 애니메이션 적용
   - 애니메이션은 1초 간격으로 반복
3. 확인 처리 (acknowledgeOrder):
   - 주문 상세 모달 열기 (클릭)
   - 또는 주문 상태 변경
   - unacknowledgedOrderIds에서 제거
   - 펄스 애니메이션 중단
```

### 2.4 주문 상세 보기 (Q1:A - 모달)
```
1. 테이블 카드 클릭:
   - selectedOrderId 설정
   - 모달 다이얼로그 오픈
   - 해당 테이블의 전체 주문 목록 표시
   - 각 주문: 주문번호, 시각, 메뉴/수량, 금액, 상태
2. 모달 내 액션:
   - 주문 상태 변경 버튼
   - 주문 삭제 버튼
3. 모달 닫기:
   - selectedOrderId 초기화
   - 해당 주문 acknowledge 처리
```

### 2.5 주문 상태 변경 (Q5:B - 확인 팝업)
```
1. 상태 변경 버튼 클릭:
   - 확인 팝업 표시 ("주문 #{orderId} 상태를 {newStatus}로 변경하시겠습니까?")
2. 확인:
   - PATCH /api/stores/:storeId/orders/:orderId/status 호출
   - 성공 -> UI 즉시 업데이트 (optimistic update)
   - 실패 -> 에러 메시지 표시, UI 롤백
3. 취소:
   - 팝업 닫기, 변경 없음
```

### 2.6 테이블 필터링
```
1. 필터 선택 시:
   - tableFilter 설정 (테이블 번호)
   - 해당 테이블의 카드만 표시
2. 필터 해제:
   - tableFilter = null
   - 전체 테이블 카드 표시
```

### 2.7 테이블 카드 정렬 (Q2:B - 최신 주문 순)
```
1. 정렬 기준: 각 테이블의 가장 최근 주문 createdAt 기준 내림차순
2. 주문이 없는 테이블: 목록 하단에 테이블 번호 오름차순
3. 새 주문 도착 시: 정렬 순서 자동 재계산
```

---

## 3. Table Management Business Logic

### 3.1 테이블 목록 조회
```
1. Table Management 페이지 마운트 시:
   - GET /api/stores/:storeId/tables -> 테이블 목록 로드
   - 각 테이블의 세션 상태 표시 (활성/비활성)
```

### 3.2 주문 삭제 (US-A04)
```
1. Dashboard 모달에서 주문 삭제 버튼 클릭:
   - 확인 팝업 표시 ("주문 #{orderId}를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")
2. 확인:
   - DELETE /api/stores/:storeId/orders/:orderId 호출
   - 성공 -> 주문 목록에서 제거, 테이블 총 주문액 재계산
   - 실패 -> 에러 메시지 표시
3. 취소:
   - 팝업 닫기, 변경 없음
```

### 3.3 이용 완료 (US-A05)
```
1. 테이블 카드 또는 테이블 관리에서 "이용 완료" 버튼 클릭:
   - 확인 팝업 표시 ("테이블 #{tableNumber}의 이용을 완료하시겠습니까? 현재 주문 내역이 과거 이력으로 이동됩니다.")
2. 확인:
   - POST /api/stores/:storeId/tables/:tableId/complete 호출
   - 성공 -> 해당 테이블의 현재 주문 모두 제거, 총 주문액 0으로 리셋
   - 실패 -> 에러 메시지 표시
3. 취소:
   - 팝업 닫기, 변경 없음
```

### 3.4 과거 주문 내역 조회 (Q7:A - 모달/패널)
```
1. Table Management에서 테이블별 "과거 내역" 버튼 클릭:
   - 모달 오픈
   - GET /api/stores/:storeId/tables/:tableId/history 호출
   - 기본: 오늘 날짜의 이력 표시
2. 날짜 필터링:
   - 시작일/종료일 DatePicker 제공
   - 날짜 변경 시 API 재호출 (?dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD)
3. 이력 표시:
   - 세션 단위로 그룹화
   - 각 세션: 시작시각, 완료시각, 주문 목록, 총 금액
   - 시간 역순 정렬
4. 모달 닫기:
   - historyOrders 초기화
```

---

## 4. Table Setup Business Logic (Q8:C - 별도 페이지)

### 4.1 테이블 설정 페이지
```
1. /tables/setup 라우트로 별도 페이지 제공
2. 기존 테이블 목록 표시 (번호, 세션 상태)
3. "테이블 추가" 폼:
   - 테이블 번호 입력 (숫자, 중복 검증)
   - 비밀번호 입력 (태블릿 자동 로그인용)
   - 비밀번호 확인 입력
4. POST /api/stores/:storeId/tables 호출
5. 성공 -> 테이블 목록에 추가, 폼 초기화
6. 실패 -> 에러 메시지 표시 (중복 번호 등)
```

---

## 5. Menu Management Business Logic

### 5.1 메뉴 목록 조회
```
1. Menu Management 페이지 마운트 시:
   - GET /api/stores/:storeId/menus -> 전체 메뉴 로드
   - 카테고리별 그룹화하여 표시
2. 카테고리 선택 시:
   - 해당 카테고리 메뉴만 필터링
```

### 5.2 카테고리 CRUD (Q3:A)
```
1. 카테고리 추가:
   - "카테고리 추가" 버튼 -> 인라인 입력 폼
   - 카테고리명 입력 후 저장
   - POST /api/stores/:storeId/categories
2. 카테고리 수정:
   - 카테고리명 옆 편집 아이콘 클릭 -> 인라인 편집
   - 변경 후 저장
   - PUT /api/stores/:storeId/categories/:categoryId
3. 카테고리 삭제:
   - 삭제 아이콘 클릭 -> 확인 팝업 ("카테고리 삭제 시 하위 메뉴도 함께 삭제됩니다.")
   - DELETE /api/stores/:storeId/categories/:categoryId
```

### 5.3 메뉴 CRUD
```
1. 메뉴 등록:
   - "메뉴 추가" 버튼 클릭
   - 메뉴 폼 표시: 메뉴명, 가격, 설명, 카테고리 선택, 이미지 업로드
   - 폼 검증 통과 후 POST /api/stores/:storeId/menus (multipart/form-data)
   - 성공 -> 메뉴 목록에 추가
2. 메뉴 수정:
   - 메뉴 항목의 편집 버튼 클릭
   - 기존 데이터로 폼 채우기
   - 변경 후 PUT /api/stores/:storeId/menus/:menuId
   - 성공 -> 메뉴 목록 업데이트
3. 메뉴 삭제:
   - 삭제 버튼 클릭 -> 확인 팝업
   - DELETE /api/stores/:storeId/menus/:menuId
   - 성공 -> 메뉴 목록에서 제거
```

### 5.4 이미지 업로드
```
1. 이미지 파일 선택 (input type="file")
2. 클라이언트 측 미리보기 (FileReader / URL.createObjectURL)
3. 허용 형식: JPG, PNG, GIF, WebP
4. 최대 파일 크기: 5MB
5. 서버 전송: multipart/form-data로 메뉴 데이터와 함께 전송
6. 기존 이미지 변경: 새 이미지 선택 시 미리보기 교체
7. 이미지 없는 메뉴: 기본 플레이스홀더 이미지 표시
```

### 5.5 메뉴 순서 조정 (Q4:B - 위/아래 화살표)
```
1. 카테고리 내 메뉴 목록에서 각 메뉴에 위/아래 화살표 버튼 표시
2. 위 화살표 클릭: 해당 메뉴와 바로 위 메뉴의 sortOrder 교환
3. 아래 화살표 클릭: 해당 메뉴와 바로 아래 메뉴의 sortOrder 교환
4. 첫 번째 메뉴: 위 화살표 비활성화
5. 마지막 메뉴: 아래 화살표 비활성화
6. 순서 변경 시: PATCH /api/stores/:storeId/menus/order 호출
7. 성공 -> 로컬 목록 순서 업데이트
```

---

## 6. Navigation Structure (Q6:B - 왼쪽 사이드바)

### 6.1 사이드바 메뉴 구조
```
+-- Logo / Store Name
+-- Dashboard (주문 모니터링) - /dashboard
+-- Tables (테이블 관리) - /tables
+-- Table Setup (테이블 설정) - /tables/setup
+-- Menus (메뉴 관리) - /menus
+-- --- (구분선) ---
+-- Logout
```

### 6.2 라우팅 구조
```
/ -> /dashboard (리다이렉트)
/login -> LoginView
/dashboard -> DashboardView (인증 필요)
/tables -> TableManagementView (인증 필요)
/tables/setup -> TableSetupView (인증 필요)
/menus -> MenuManagementView (인증 필요)
```
