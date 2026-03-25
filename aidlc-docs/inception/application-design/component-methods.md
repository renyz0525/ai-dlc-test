# Component Methods

## 1. Backend Route Handlers & DB Access

### 1.1 Auth Module

| Method | Route | Purpose | Input | Output |
|---|---|---|---|---|
| adminLogin | POST /api/auth/admin/login | 관리자 로그인 | { storeId, username, password } | { token, expiresIn } |
| tableLogin | POST /api/auth/table/login | 테이블 태블릿 로그인 | { storeId, tableNumber, password } | { token, tableId, sessionId } |
| verifyToken | middleware | 토큰 검증 | Authorization header | req.user / req.table |

### 1.2 Store Module

| Method | Route | Purpose | Input | Output |
|---|---|---|---|---|
| getStore | GET /api/stores/:storeId | 매장 정보 조회 | storeId (param) | Store |
| storeContext | middleware | 매장 컨텍스트 주입 | storeId | req.storeId |

### 1.3 Menu Module

| Method | Route | Purpose | Input | Output |
|---|---|---|---|---|
| getMenus | GET /api/stores/:storeId/menus | 메뉴 목록 조회 | storeId, ?categoryId | Menu[] |
| getMenuById | GET /api/stores/:storeId/menus/:menuId | 메뉴 상세 조회 | storeId, menuId | Menu |
| createMenu | POST /api/stores/:storeId/menus | 메뉴 등록 | MenuCreateDto + image file | Menu |
| updateMenu | PUT /api/stores/:storeId/menus/:menuId | 메뉴 수정 | MenuUpdateDto + ?image file | Menu |
| deleteMenu | DELETE /api/stores/:storeId/menus/:menuId | 메뉴 삭제 | menuId | void |
| updateMenuOrder | PATCH /api/stores/:storeId/menus/order | 메뉴 순서 변경 | { menuIds: string[] } | void |

### 1.4 Order Module

| Method | Route | Purpose | Input | Output |
|---|---|---|---|---|
| createOrder | POST /api/stores/:storeId/tables/:tableId/orders | 주문 생성 | OrderCreateDto | Order |
| getTableOrders | GET /api/stores/:storeId/tables/:tableId/orders | 테이블 주문 조회 | tableId, sessionId | Order[] |
| getStoreOrders | GET /api/stores/:storeId/orders | 매장 전체 주문 조회 | storeId, ?status | Order[] |
| updateOrderStatus | PATCH /api/stores/:storeId/orders/:orderId/status | 주문 상태 변경 | { status } | Order |
| deleteOrder | DELETE /api/stores/:storeId/orders/:orderId | 주문 삭제 | orderId | void |

### 1.5 Table Module

| Method | Route | Purpose | Input | Output |
|---|---|---|---|---|
| getTables | GET /api/stores/:storeId/tables | 테이블 목록 조회 | storeId | Table[] |
| setupTable | POST /api/stores/:storeId/tables | 테이블 초기 설정 | { tableNumber, password } | Table |
| completeTable | POST /api/stores/:storeId/tables/:tableId/complete | 이용 완료 | tableId | void |
| getTableHistory | GET /api/stores/:storeId/tables/:tableId/history | 과거 내역 조회 | tableId, ?dateFrom, ?dateTo | OrderHistory[] |

### 1.6 SSE Module

| Method | Route | Purpose | Input | Output |
|---|---|---|---|---|
| subscribe | GET /api/stores/:storeId/events | SSE 연결 | storeId | EventStream |
| publishOrderEvent | internal | 주문 이벤트 발행 | { type, order } | void |

---

## 2. Customer Frontend (Vue Composables / Vuex Store)

### 2.1 Auth Store
- `autoLogin()`: 저장된 정보로 자동 로그인
- `saveCredentials(storeId, tableNumber, password)`: 인증 정보 로컬 저장
- `getToken()`: 현재 토큰 반환

### 2.2 Menu Store
- `fetchMenus(storeId)`: 메뉴 목록 조회
- `getMenusByCategory(categoryId)`: 카테고리별 필터링

### 2.3 Cart Store
- `addItem(menu, quantity)`: 장바구니 추가
- `removeItem(menuId)`: 장바구니 삭제
- `updateQuantity(menuId, quantity)`: 수량 변경
- `clearCart()`: 장바구니 비우기
- `getTotal()`: 총액 계산
- `persistCart()` / `loadCart()`: 로컬 저장/로드

### 2.4 Order Store
- `createOrder(orderData)`: 주문 생성
- `fetchOrders(tableId, sessionId)`: 주문 내역 조회

---

## 3. Admin Frontend (Vue Composables / Vuex Store)

### 3.1 Auth Store
- `login(storeId, username, password)`: 관리자 로그인
- `logout()`: 로그아웃
- `checkSession()`: 세션 유효성 확인

### 3.2 Dashboard Store
- `connectSSE(storeId)`: SSE 연결
- `disconnectSSE()`: SSE 연결 해제
- `fetchOrders(storeId)`: 주문 목록 조회
- `updateOrderStatus(orderId, status)`: 주문 상태 변경
- `deleteOrder(orderId)`: 주문 삭제
- `acknowledgeOrder(orderId)`: 주문 확인 (알림 중단)

### 3.3 Table Store
- `fetchTables(storeId)`: 테이블 목록
- `setupTable(tableData)`: 테이블 설정
- `completeTable(tableId)`: 이용 완료
- `fetchHistory(tableId, dateRange)`: 과거 내역

### 3.4 Menu Store
- `fetchMenus(storeId)`: 메뉴 조회
- `createMenu(menuData, imageFile)`: 메뉴 등록
- `updateMenu(menuId, menuData, imageFile)`: 메뉴 수정
- `deleteMenu(menuId)`: 메뉴 삭제
- `updateMenuOrder(menuIds)`: 순서 변경
