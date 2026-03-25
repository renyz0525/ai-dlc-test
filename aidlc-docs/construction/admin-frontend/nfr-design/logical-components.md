# Admin Frontend - Logical Components

## Component Architecture Overview

```
+------------------------------------------------------+
|                    Vue App                            |
|  +--------------------------------------------------+|
|  |              Vue Router (Route Guard)             ||
|  +--------------------------------------------------+|
|  |                                                   ||
|  |  +------------+  +----------------------------+   ||
|  |  | SidebarNav |  |     View Components        |   ||
|  |  |            |  |  (Dashboard, Tables, Menus) |   ||
|  |  +------------+  +----------------------------+   ||
|  |                          |                        ||
|  |                          v                        ||
|  |  +--------------------------------------------------+
|  |  |              Vuex Store Modules              ||
|  |  |  (auth, dashboard, tables, menus)            ||
|  |  +--------------------------------------------------+
|  |          |                    |                    ||
|  |          v                    v                    ||
|  |  +-------------+    +-----------------+           ||
|  |  | API Client  |    |  SSE Manager    |           ||
|  |  | (Axios)     |    |  (EventSource)  |           ||
|  |  +-------------+    +-----------------+           ||
|  |          |                    |                    ||
|  +----------+--------------------+-------------------+|
|             |                    |                     |
+-------------+--------------------+---------------------+
              |                    |
              v                    v
        Backend REST API     Backend SSE Endpoint
```

## 1. API Client (api/client.ts)

**역할**: 모든 HTTP 통신의 단일 진입점

**구성:**
- Axios 인스턴스 (baseURL: VITE_API_BASE_URL)
- Request Interceptor: JWT 토큰 자동 주입
- Response Interceptor: 401 자동 로그아웃, 에러 메시지 추출

**인터페이스:**
```typescript
// 생성
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Request Interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch('auth/logout');
      router.push('/login');
    }
    return Promise.reject(error);
  }
);
```

## 2. SSE Manager (api/sse.ts)

**역할**: SSE 연결 라이프사이클 관리

**구성:**
- EventSource 인스턴스 관리
- 자동 재연결 (3초 간격, 최대 10회)
- 이벤트 타입별 핸들러 디스패치
- 연결 상태 콜백

**인터페이스:**
```typescript
class SSEManager {
  private eventSource: EventSource | null;
  private retryCount: number;
  private maxRetries: number = 10;
  private retryInterval: number = 3000;

  connect(storeId: string, handlers: SSEHandlers): void;
  disconnect(): void;
  getConnectionState(): 'connected' | 'reconnecting' | 'disconnected';
}

interface SSEHandlers {
  onOrderCreated: (data: OrderCreatedEvent) => void;
  onOrderStatusChanged: (data: OrderStatusChangedEvent) => void;
  onOrderDeleted: (data: OrderDeletedEvent) => void;
  onTableCompleted: (data: TableCompletedEvent) => void;
  onConnectionChange: (state: string) => void;
}
```

## 3. API Service Modules

### 3.1 api/auth.ts
**역할**: 인증 API 호출
```typescript
export const authApi = {
  login(credentials: LoginCredentials): Promise<{ token: string; expiresIn: number }>;
};
```

### 3.2 api/orders.ts
**역할**: 주문 API 호출
```typescript
export const ordersApi = {
  getStoreOrders(storeId: string, params?: { status?: string }): Promise<Order[]>;
  getTableOrders(storeId: string, tableId: string, sessionId?: string): Promise<Order[]>;
  updateOrderStatus(storeId: string, orderId: string, status: OrderStatus): Promise<Order>;
  deleteOrder(storeId: string, orderId: string): Promise<void>;
};
```

### 3.3 api/tables.ts
**역할**: 테이블 API 호출
```typescript
export const tablesApi = {
  getTables(storeId: string): Promise<Table[]>;
  setupTable(storeId: string, data: TableSetupDto): Promise<Table>;
  completeTable(storeId: string, tableId: string): Promise<void>;
  getTableHistory(storeId: string, tableId: string, dateRange?: DateRange): Promise<OrderHistory[]>;
};
```

### 3.4 api/menus.ts
**역할**: 메뉴 API 호출
```typescript
export const menusApi = {
  getMenus(storeId: string): Promise<Menu[]>;
  createMenu(storeId: string, formData: FormData): Promise<Menu>;
  updateMenu(storeId: string, menuId: string, formData: FormData): Promise<Menu>;
  deleteMenu(storeId: string, menuId: string): Promise<void>;
  updateMenuOrder(storeId: string, menuIds: string[]): Promise<void>;
};
```

### 3.5 api/categories.ts
**역할**: 카테고리 API 호출
```typescript
export const categoriesApi = {
  getCategories(storeId: string): Promise<Category[]>;
  createCategory(storeId: string, data: CategoryCreateDto): Promise<Category>;
  updateCategory(storeId: string, categoryId: string, data: CategoryUpdateDto): Promise<Category>;
  deleteCategory(storeId: string, categoryId: string): Promise<void>;
};
```

## 4. Utility Modules

### 4.1 utils/jwt.ts
**역할**: JWT 토큰 유틸리티
```typescript
export function decodeToken(token: string): { exp: number; sub: string; storeId: string };
export function isTokenExpired(token: string): boolean;
export function getTokenRemainingTime(token: string): number; // milliseconds
```

### 4.2 Toast Service (PrimeVue 통합)
**역할**: 알림 메시지 표시
- PrimeVue `useToast()` composable 사용
- 성공: severity='success', life=3000ms
- 에러: severity='error', life=5000ms
- 경고: severity='warn', life=4000ms

### 4.3 Confirm Service (PrimeVue 통합)
**역할**: 확인 다이얼로그
- PrimeVue `useConfirm()` composable 사용
- 삭제/파괴적 액션: icon='pi pi-exclamation-triangle'
- 확인 버튼: "확인" / 취소 버튼: "취소"

## 5. Unacknowledged Order Timer Manager

**역할**: 미확인 주문 타이머 관리 (dashboard store 내부)

```typescript
// dashboard store 내부 타이머 관리
const alertTimers = new Map<string, number>(); // orderId -> timeoutId

function startAlertTimer(orderId: string): void {
  const timeoutId = window.setTimeout(() => {
    commit('SET_ALERT_ACTIVE', { orderId, active: true });
  }, 30000);
  alertTimers.set(orderId, timeoutId);
}

function clearAlertTimer(orderId: string): void {
  const timeoutId = alertTimers.get(orderId);
  if (timeoutId) {
    clearTimeout(timeoutId);
    alertTimers.delete(orderId);
  }
  commit('SET_ALERT_ACTIVE', { orderId, active: false });
}

function clearAllTimers(): void {
  alertTimers.forEach((timeoutId) => clearTimeout(timeoutId));
  alertTimers.clear();
}
```

## 6. Component Communication Summary

| From | To | Method |
|---|---|---|
| View -> Vuex | Store Actions | `store.dispatch()` |
| Vuex -> View | Getters/State | `store.getters`, `store.state` |
| SSE Manager -> Vuex | Store Dispatch | 콜백에서 `store.dispatch()` |
| API Client -> Vuex | Response | Action 내부에서 mutation commit |
| Parent -> Child | Props | Vue props |
| Child -> Parent | Events | Vue emits |
| Global Notification | Toast | PrimeVue `useToast()` |
| Global Confirmation | Dialog | PrimeVue `useConfirm()` |
