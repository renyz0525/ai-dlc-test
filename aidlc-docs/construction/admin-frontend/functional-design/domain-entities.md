# Admin Frontend - Domain Entities (TypeScript Interfaces)

## Core Entities

### Store
```typescript
interface Store {
  id: string;
  name: string;
  address: string;
}
```

### User (Admin)
```typescript
interface AdminUser {
  id: string;
  storeId: string;
  username: string;
}
```

### Table
```typescript
interface Table {
  id: string;
  storeId: string;
  tableNumber: number;
  currentSessionId: string | null;
  createdAt: string;
}
```

### TableSession
```typescript
interface TableSession {
  id: string;
  tableId: string;
  storeId: string;
  startedAt: string;
  completedAt: string | null;
}
```

### Category
```typescript
interface Category {
  id: string;
  storeId: string;
  name: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface CategoryCreateDto {
  name: string;
  sortOrder?: number;
}

interface CategoryUpdateDto {
  name?: string;
  sortOrder?: number;
}
```

### Menu
```typescript
interface Menu {
  id: string;
  storeId: string;
  categoryId: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface MenuCreateDto {
  categoryId: string;
  name: string;
  price: number;
  description: string;
  image?: File;
}

interface MenuUpdateDto {
  categoryId?: string;
  name?: string;
  price?: number;
  description?: string;
  image?: File;
}
```

### Order
```typescript
type OrderStatus = 'pending' | 'preparing' | 'completed';

interface Order {
  id: string;
  storeId: string;
  tableId: string;
  sessionId: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  acknowledgedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  id: string;
  orderId: string;
  menuId: string;
  menuName: string;
  quantity: number;
  unitPrice: number;
}
```

### OrderHistory
```typescript
interface OrderHistory {
  id: string;
  storeId: string;
  tableId: string;
  sessionId: string;
  orderData: Order[];
  completedAt: string;
}
```

## UI State Types

### Auth State
```typescript
interface AuthState {
  token: string | null;
  user: AdminUser | null;
  storeId: string | null;
  isAuthenticated: boolean;
  loginAttempts: number;
  isLocked: boolean;
  lockUntil: number | null;
}

interface LoginCredentials {
  storeId: string;
  username: string;
  password: string;
}
```

### Dashboard State
```typescript
interface DashboardState {
  orders: Order[];
  tables: Table[];
  sseConnected: boolean;
  selectedOrderId: string | null;
  tableFilter: number | null;
  unacknowledgedOrderIds: string[];
}

interface TableCard {
  table: Table;
  orders: Order[];
  totalAmount: number;
  latestOrder: Order | null;
  hasUnacknowledged: boolean;
}
```

### Table Management State
```typescript
interface TableManagementState {
  tables: Table[];
  selectedTableId: string | null;
  historyOrders: OrderHistory[];
  historyDateRange: DateRange | null;
}

interface DateRange {
  from: string;
  to: string;
}

interface TableSetupDto {
  tableNumber: number;
  password: string;
}
```

### Menu Management State
```typescript
interface MenuManagementState {
  categories: Category[];
  menus: Menu[];
  selectedCategoryId: string | null;
  editingMenu: Menu | null;
  editingCategory: Category | null;
}
```

## API Response Types

```typescript
interface ApiResponse<T> {
  data: T;
  message?: string;
}

interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
```

## SSE Event Types

```typescript
type SSEEventType = 'order:created' | 'order:statusChanged' | 'order:deleted' | 'table:completed';

interface SSEEvent {
  type: SSEEventType;
  data: OrderCreatedEvent | OrderStatusChangedEvent | OrderDeletedEvent | TableCompletedEvent;
}

interface OrderCreatedEvent {
  orderId: string;
  tableId: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
}

interface OrderStatusChangedEvent {
  orderId: string;
  status: OrderStatus;
}

interface OrderDeletedEvent {
  orderId: string;
  tableId: string;
}

interface TableCompletedEvent {
  tableId: string;
}
```
