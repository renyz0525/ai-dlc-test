# Customer Frontend - Domain Entities

## Client-Side Domain Models

### 1. Auth State
```typescript
interface AuthState {
  token: string | null
  storeId: string | null
  tableId: string | null
  tableNumber: number | null
  sessionId: string | null
  isAuthenticated: boolean  // computed: token !== null
}

interface SavedCredentials {
  storeId: string
  tableNumber: number
  password: string
}

interface LoginResponse {
  token: string
  tableId: string
  sessionId: string
}
```

### 2. Menu Entities
```typescript
interface Category {
  id: string
  name: string
  sortOrder: number
}

interface Menu {
  id: string
  categoryId: string
  name: string
  price: number          // integer (won)
  description: string
  imageUrl: string | null
  sortOrder: number
}

interface MenuState {
  categories: Category[]
  menus: Menu[]
  activeCategoryId: string | null
  isLoading: boolean
  error: string | null
}
```

### 3. Cart Entities
```typescript
interface CartItem {
  menuId: string
  menuName: string
  unitPrice: number     // integer (won)
  quantity: number       // >= 1
  imageUrl: string | null
}

interface CartState {
  items: CartItem[]
  total: number          // computed: sum of (unitPrice * quantity)
  itemCount: number      // computed: sum of quantities
}
```

### 4. Order Entities
```typescript
// Request (create order)
interface OrderCreateDto {
  items: OrderItemDto[]
  totalAmount: number
}

interface OrderItemDto {
  menuId: string
  menuName: string
  quantity: number
  unitPrice: number
}

// Response (from API)
interface Order {
  id: string
  orderNumber: string
  tableId: string
  sessionId: string
  status: OrderStatus
  totalAmount: number
  items: OrderItem[]
  createdAt: string      // ISO 8601
}

interface OrderItem {
  id: string
  menuId: string
  menuName: string
  quantity: number
  unitPrice: number
}

type OrderStatus = 'WAITING' | 'PREPARING' | 'COMPLETED'

interface OrderState {
  orders: Order[]
  currentPage: number
  totalPages: number
  isLoading: boolean
  error: string | null
}
```

### 5. SSE Event Entities
```typescript
interface OrderStatusChangedEvent {
  type: 'order:statusChanged'
  orderId: string
  status: OrderStatus
}

interface SSEState {
  connected: boolean
  retryCount: number
  maxRetries: number     // 5
}
```

### 6. UI State
```typescript
interface UIState {
  cartPanelOpen: boolean
  toastMessage: string | null
  toastType: 'success' | 'error' | 'info'
}
```

---

## Entity Relationships

```
AuthState
  |-- storeId -> used in all API calls
  |-- tableId -> used in order API calls
  |-- sessionId -> used to filter orders

MenuState
  |-- categories[] -> Category
  |-- menus[] -> Menu (each has categoryId ref)

CartState
  |-- items[] -> CartItem (menuId references Menu.id)
  |-- (local only, no server entity)

OrderState
  |-- orders[] -> Order (each has items[])
  |-- (fetched per sessionId)

SSEState
  |-- listens for OrderStatusChangedEvent
  |-- updates OrderState.orders[].status
```

---

## localStorage Schema

| Key | Type | Description |
|---|---|---|
| `table-order-credentials` | SavedCredentials (JSON) | Auto-login credentials |
| `table-order-cart` | CartItem[] (JSON) | Persisted cart items |
