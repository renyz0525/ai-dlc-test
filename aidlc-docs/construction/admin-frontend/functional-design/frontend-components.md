# Admin Frontend - Frontend Components Design

## Component Hierarchy

```
App.vue
+-- AppLayout.vue (인증된 사용자용 레이아웃)
|   +-- SidebarNav.vue (왼쪽 사이드바)
|   +-- <router-view> (메인 콘텐츠)
|       +-- DashboardView.vue
|       |   +-- DashboardHeader.vue (필터, SSE 상태)
|       |   +-- TableCardGrid.vue
|       |   |   +-- TableCard.vue (테이블별 카드)
|       |   +-- OrderDetailModal.vue (주문 상세 모달)
|       |   |   +-- OrderItemList.vue
|       |   |   +-- OrderStatusControl.vue
|       |   +-- ConfirmDialog.vue (공통)
|       +-- TableManagementView.vue
|       |   +-- TableList.vue
|       |   |   +-- TableRow.vue
|       |   +-- OrderHistoryModal.vue
|       |   |   +-- HistoryDateFilter.vue
|       |   |   +-- HistorySessionGroup.vue
|       +-- TableSetupView.vue
|       |   +-- ExistingTableList.vue
|       |   +-- TableSetupForm.vue
|       +-- MenuManagementView.vue
|           +-- CategorySidebar.vue
|           |   +-- CategoryItem.vue
|           |   +-- CategoryForm.vue (인라인 추가/편집)
|           +-- MenuGrid.vue
|           |   +-- MenuCard.vue
|           |   +-- MenuSortControls.vue (위/아래 화살표)
|           +-- MenuFormModal.vue
|               +-- ImageUploader.vue
+-- LoginView.vue
    +-- LoginForm.vue
```

## Page Components (Views)

### LoginView.vue
- **Route**: /login
- **Purpose**: 관리자 로그인
- **State**: LoginCredentials, loginError, isLoading, isLocked
- **Actions**: login(), 로그인 시도 제한 체크

### DashboardView.vue
- **Route**: /dashboard
- **Purpose**: 실시간 주문 모니터링 대시보드
- **State**: DashboardState (from Vuex)
- **Lifecycle**:
  - mounted: 테이블 목록 + 활성 주문 로드, SSE 연결
  - unmounted: SSE 연결 해제, 타이머 정리
- **Actions**: 주문 상태 변경, 주문 삭제, 이용 완료, 필터링

### TableManagementView.vue
- **Route**: /tables
- **Purpose**: 테이블 관리 (주문 삭제, 이용 완료, 과거 내역)
- **State**: TableManagementState (from Vuex)
- **Actions**: 이용 완료, 과거 내역 조회

### TableSetupView.vue
- **Route**: /tables/setup
- **Purpose**: 테이블 초기 설정 (추가)
- **State**: tables[], setupForm (TableSetupDto)
- **Actions**: 테이블 추가

### MenuManagementView.vue
- **Route**: /menus
- **Purpose**: 메뉴 및 카테고리 CRUD
- **State**: MenuManagementState (from Vuex)
- **Actions**: 메뉴 CRUD, 카테고리 CRUD, 순서 조정, 이미지 업로드

---

## Reusable Components

### SidebarNav.vue
- **Props**: currentRoute: string
- **Emits**: none
- **Purpose**: 왼쪽 사이드바 네비게이션
- **Items**: Dashboard, Tables, Table Setup, Menus, Logout
- **State**: collapsed (boolean) - 사이드바 접기/펼치기

### TableCard.vue
- **Props**:
  - table: Table
  - orders: Order[]
  - totalAmount: number
  - latestOrder: Order | null
  - hasUnacknowledged: boolean
- **Emits**:
  - @click -> 주문 상세 모달 열기
  - @complete -> 이용 완료
- **Purpose**: 대시보드 테이블 카드
- **Visual States**:
  - 기본 (주문 없음): 회색 톤
  - 활성 (주문 있음): 컬러 카드
  - 미확인 알림: 펄스 애니메이션 (CSS animation)

### TableCardGrid.vue
- **Props**:
  - tableCards: TableCard[]
  - filter: number | null
- **Emits**:
  - @select-table -> 테이블 카드 클릭
  - @complete-table -> 이용 완료
- **Purpose**: 테이블 카드 그리드 레이아웃 (반응형)

### OrderDetailModal.vue
- **Props**:
  - visible: boolean
  - table: Table
  - orders: Order[]
- **Emits**:
  - @close
  - @status-change -> { orderId, newStatus }
  - @delete-order -> orderId
- **Purpose**: 주문 상세 모달 (Q1:A)

### OrderItemList.vue
- **Props**:
  - items: OrderItem[]
- **Purpose**: 주문 내 메뉴 항목 목록 표시

### OrderStatusControl.vue
- **Props**:
  - order: Order
- **Emits**:
  - @status-change -> { orderId, newStatus }
- **Purpose**: 주문 상태 변경 버튼 (pending->preparing->completed)
- **Rules**: 허용된 다음 상태만 버튼 표시

### DashboardHeader.vue
- **Props**:
  - sseConnected: boolean
  - tables: Table[]
  - currentFilter: number | null
- **Emits**:
  - @filter-change -> tableNumber | null
- **Purpose**: 대시보드 상단 - SSE 상태 표시, 테이블 필터 드롭다운

### ConfirmDialog.vue
- **Props**:
  - visible: boolean
  - title: string
  - message: string
  - confirmLabel?: string (default: "확인")
  - cancelLabel?: string (default: "취소")
  - severity?: 'info' | 'warning' | 'danger'
- **Emits**:
  - @confirm
  - @cancel
- **Purpose**: 공통 확인 다이얼로그 (PrimeVue Dialog 기반)

### TableList.vue
- **Props**:
  - tables: Table[]
- **Emits**:
  - @complete -> tableId
  - @view-history -> tableId
- **Purpose**: 테이블 관리 목록

### TableRow.vue
- **Props**:
  - table: Table
- **Emits**:
  - @complete -> tableId
  - @view-history -> tableId
- **Purpose**: 테이블 목록의 개별 행

### OrderHistoryModal.vue
- **Props**:
  - visible: boolean
  - tableId: string
  - tableNumber: number
- **Emits**:
  - @close
- **Purpose**: 과거 주문 내역 모달 (Q7:A)
- **Internal State**: historyOrders, dateRange

### HistoryDateFilter.vue
- **Props**:
  - dateRange: DateRange
- **Emits**:
  - @change -> DateRange
- **Purpose**: 날짜 범위 필터 (PrimeVue Calendar)

### HistorySessionGroup.vue
- **Props**:
  - session: OrderHistory
- **Purpose**: 세션 단위 주문 이력 그룹 표시

### ExistingTableList.vue
- **Props**:
  - tables: Table[]
- **Purpose**: 테이블 설정 페이지의 기존 테이블 목록 (읽기 전용)

### TableSetupForm.vue
- **Props**: none
- **Emits**:
  - @submit -> TableSetupDto
- **Purpose**: 테이블 추가 폼 (번호, 비밀번호, 비밀번호 확인)

### CategorySidebar.vue
- **Props**:
  - categories: Category[]
  - selectedCategoryId: string | null
- **Emits**:
  - @select -> categoryId
  - @create -> CategoryCreateDto
  - @update -> { categoryId, data: CategoryUpdateDto }
  - @delete -> categoryId
- **Purpose**: 카테고리 목록 + CRUD

### CategoryItem.vue
- **Props**:
  - category: Category
  - isSelected: boolean
- **Emits**:
  - @select
  - @edit
  - @delete
- **Purpose**: 카테고리 항목 (인라인 편집 지원)

### CategoryForm.vue
- **Props**:
  - category?: Category (편집 시)
- **Emits**:
  - @submit -> CategoryCreateDto | CategoryUpdateDto
  - @cancel
- **Purpose**: 카테고리 인라인 추가/편집 폼

### MenuGrid.vue
- **Props**:
  - menus: Menu[]
  - categoryId: string | null
- **Emits**:
  - @edit -> menuId
  - @delete -> menuId
  - @move-up -> menuId
  - @move-down -> menuId
  - @add
- **Purpose**: 메뉴 목록 그리드 (카드 형태)

### MenuCard.vue
- **Props**:
  - menu: Menu
  - isFirst: boolean
  - isLast: boolean
- **Emits**:
  - @edit
  - @delete
  - @move-up
  - @move-down
- **Purpose**: 메뉴 카드 (이미지, 정보, 액션 버튼, 순서 화살표)

### MenuSortControls.vue
- **Props**:
  - isFirst: boolean
  - isLast: boolean
- **Emits**:
  - @move-up
  - @move-down
- **Purpose**: 위/아래 화살표 버튼 (Q4:B)

### MenuFormModal.vue
- **Props**:
  - visible: boolean
  - menu?: Menu (편집 시)
  - categories: Category[]
- **Emits**:
  - @submit -> MenuCreateDto | MenuUpdateDto
  - @close
- **Purpose**: 메뉴 등록/수정 폼 모달

### ImageUploader.vue
- **Props**:
  - currentImageUrl?: string
- **Emits**:
  - @change -> File | null
- **Purpose**: 이미지 파일 선택 + 미리보기
- **Rules**: JPG/PNG/GIF/WebP, 최대 5MB

---

## Vuex Store Modules

### auth (store/modules/auth.ts)
- **State**: AuthState
- **Getters**: isAuthenticated, currentUser, storeId, isLocked
- **Mutations**: SET_TOKEN, SET_USER, SET_STORE_ID, INCREMENT_LOGIN_ATTEMPTS, RESET_LOGIN_ATTEMPTS, SET_LOCK, CLEAR_AUTH
- **Actions**: login(), logout(), checkSession(), initAuth()

### dashboard (store/modules/dashboard.ts)
- **State**: DashboardState
- **Getters**: tableCards, filteredTableCards, selectedTableOrders, hasUnacknowledgedOrders
- **Mutations**: SET_ORDERS, ADD_ORDER, UPDATE_ORDER_STATUS, REMOVE_ORDER, SET_TABLES, SET_SSE_CONNECTED, SET_SELECTED_ORDER, SET_TABLE_FILTER, ADD_UNACKNOWLEDGED, REMOVE_UNACKNOWLEDGED, CLEAR_TABLE_ORDERS
- **Actions**: fetchOrders(), fetchTables(), connectSSE(), disconnectSSE(), updateOrderStatus(), deleteOrder(), completeTable(), acknowledgeOrder()

### tables (store/modules/tables.ts)
- **State**: TableManagementState
- **Getters**: sortedTables, selectedTable, filteredHistory
- **Mutations**: SET_TABLES, SET_SELECTED_TABLE, SET_HISTORY, SET_HISTORY_DATE_RANGE, ADD_TABLE
- **Actions**: fetchTables(), setupTable(), completeTable(), fetchHistory()

### menus (store/modules/menus.ts)
- **State**: MenuManagementState
- **Getters**: menusByCategory, selectedCategoryMenus, sortedMenus
- **Mutations**: SET_CATEGORIES, SET_MENUS, ADD_CATEGORY, UPDATE_CATEGORY, REMOVE_CATEGORY, ADD_MENU, UPDATE_MENU, REMOVE_MENU, SET_SELECTED_CATEGORY, SET_EDITING_MENU, UPDATE_MENU_ORDER
- **Actions**: fetchCategories(), fetchMenus(), createCategory(), updateCategory(), deleteCategory(), createMenu(), updateMenu(), deleteMenu(), updateMenuOrder()

---

## API Client Layer (api/)

### api/client.ts
- Axios 인스턴스 생성
- baseURL 설정
- Request interceptor: JWT 토큰 자동 추가
- Response interceptor: 401 에러 시 자동 로그아웃

### api/auth.ts
- adminLogin(credentials: LoginCredentials): Promise<{ token, expiresIn }>

### api/orders.ts
- getStoreOrders(storeId, params?): Promise<Order[]>
- getTableOrders(storeId, tableId, sessionId?): Promise<Order[]>
- updateOrderStatus(storeId, orderId, status): Promise<Order>
- deleteOrder(storeId, orderId): Promise<void>

### api/tables.ts
- getTables(storeId): Promise<Table[]>
- setupTable(storeId, data: TableSetupDto): Promise<Table>
- completeTable(storeId, tableId): Promise<void>
- getTableHistory(storeId, tableId, dateRange?): Promise<OrderHistory[]>

### api/menus.ts
- getMenus(storeId): Promise<Menu[]>
- createMenu(storeId, formData: FormData): Promise<Menu>
- updateMenu(storeId, menuId, formData: FormData): Promise<Menu>
- deleteMenu(storeId, menuId): Promise<void>
- updateMenuOrder(storeId, menuIds: string[]): Promise<void>

### api/categories.ts
- getCategories(storeId): Promise<Category[]>
- createCategory(storeId, data: CategoryCreateDto): Promise<Category>
- updateCategory(storeId, categoryId, data: CategoryUpdateDto): Promise<Category>
- deleteCategory(storeId, categoryId): Promise<void>

### api/sse.ts
- connectSSE(storeId): EventSource
- SSE 이벤트 타입별 핸들러 등록 유틸리티
