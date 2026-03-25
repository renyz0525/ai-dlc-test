# Integration Test Instructions

## Purpose
Admin Frontend와 Backend API 간의 통합을 검증합니다.

## Prerequisites
- Backend API 서버 실행 중 (localhost:3000)
- 테스트용 매장 데이터 세팅 완료

## Test Scenarios

### Scenario 1: Authentication Flow
- **Description**: 관리자 로그인 후 JWT 토큰 기반 인증 흐름 검증
- **Setup**: Backend에 테스트 매장 계정 생성 (loginId, password)
- **Test Steps**:
  1. LoginView에서 매장 로그인 ID/비밀번호 입력
  2. POST /api/admin/login 호출 확인
  3. JWT 토큰 localStorage 저장 확인
  4. Dashboard 리다이렉트 확인
  5. 이후 API 호출 시 Authorization 헤더 포함 확인
- **Expected Results**: 로그인 성공, 토큰 저장, Dashboard 이동
- **Cleanup**: localStorage 클리어

### Scenario 2: SSE Real-time Order Monitoring
- **Description**: SSE 연결 후 실시간 주문 수신 검증
- **Setup**: 로그인 완료, Dashboard 진입
- **Test Steps**:
  1. Dashboard 진입 시 SSE 연결 확인 (EventSource)
  2. Customer Frontend에서 주문 생성
  3. Dashboard에 새 주문 카드 표시 확인
  4. 30초 후 미확인 주문 알림 (pulse animation) 확인
  5. 주문 상태 변경 시 실시간 반영 확인
- **Expected Results**: SSE 연결 성공, 주문 실시간 수신 및 표시
- **Cleanup**: SSE disconnect

### Scenario 3: Order Status Workflow
- **Description**: 주문 상태 변경 전체 플로우 (pending -> preparing -> ready -> completed)
- **Setup**: 테스트 주문 1건 이상 존재
- **Test Steps**:
  1. Dashboard에서 테이블 카드 클릭 -> 주문 상세 모달
  2. "접수" 버튼 클릭 -> 확인 다이얼로그 -> 승인
  3. PUT /api/stores/{storeId}/orders/{orderId}/status 호출 확인
  4. 상태 변경 UI 즉시 반영 (optimistic update) 확인
  5. SSE로 상태 변경 이벤트 수신 확인
- **Expected Results**: 상태 순차적 변경, UI 즉시 반영

### Scenario 4: Table Setup and Management
- **Description**: 테이블 초기 설정 및 세션 종료 검증
- **Setup**: 매장에 테이블 없는 상태
- **Test Steps**:
  1. Table Setup 페이지 진입
  2. 테이블 수 입력 후 설정
  3. POST /api/stores/{storeId}/tables/setup 호출 확인
  4. Table Management 페이지에서 테이블 목록 확인
  5. 세션 종료 버튼 -> 확인 -> PUT /api/stores/{storeId}/tables/{tableId}/complete
- **Expected Results**: 테이블 생성 및 세션 종료 정상 동작

### Scenario 5: Menu CRUD with Image Upload
- **Description**: 메뉴 생성/수정/삭제 및 이미지 업로드 검증
- **Setup**: 카테고리 1개 이상 존재
- **Test Steps**:
  1. Menu Management 페이지 진입
  2. 카테고리 생성 -> POST /api/stores/{storeId}/categories
  3. 메뉴 생성 (이미지 포함) -> POST /api/stores/{storeId}/menus (multipart/form-data)
  4. 메뉴 수정 -> PUT /api/stores/{storeId}/menus/{menuId}
  5. 메뉴 순서 변경 -> PUT /api/stores/{storeId}/menus/order
  6. 메뉴 삭제 -> DELETE /api/stores/{storeId}/menus/{menuId}
- **Expected Results**: 모든 CRUD 정상 동작, 이미지 업로드 성공

### Scenario 6: 401 Unauthorized Handling
- **Description**: 토큰 만료 시 자동 로그아웃 검증
- **Setup**: 만료된 JWT 토큰으로 설정
- **Test Steps**:
  1. API 호출 시 401 응답 수신
  2. localStorage 토큰 제거 확인
  3. Login 페이지 리다이렉트 확인
- **Expected Results**: 자동 로그아웃 및 로그인 페이지 이동

## Setup Integration Test Environment

### 1. Start Backend Server
```bash
cd ../ai-dlc-test-backend  # Backend 프로젝트 경로
npm run dev
```

### 2. Start Admin Frontend
```bash
cd /Users/yongzher/Desktop/ai-dlc-test-admin-fe
npm run dev
```

### 3. Seed Test Data (Backend)
```bash
# Backend 프로젝트에서 시드 데이터 생성
# 테스트 매장, 카테고리, 메뉴, 테이블 데이터
```

## Run Integration Tests
현재 프로젝트에서는 통합 테스트를 수동으로 실행합니다:

1. Backend + Frontend 동시 실행
2. 브라우저에서 http://localhost:5174 접속
3. 위 시나리오를 순서대로 수행
4. 각 시나리오의 Expected Results 확인
5. 브라우저 DevTools Network 탭에서 API 호출 검증

## Cleanup
```bash
# 테스트 후 정리
# Backend 시드 데이터 초기화 (필요 시)
```
