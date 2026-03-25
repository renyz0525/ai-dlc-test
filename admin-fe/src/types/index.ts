// Domain Entities

export interface Store {
  id: string;
  name: string;
  address: string;
}

export interface AdminUser {
  id: string;
  storeId: string;
  username: string;
}

export interface Table {
  id: string;
  storeId: string;
  tableNumber: number;
  currentSessionId: string | null;
  createdAt: string;
}

export interface TableSession {
  id: string;
  tableId: string;
  storeId: string;
  startedAt: string;
  completedAt: string | null;
}

export interface Category {
  id: string;
  storeId: string;
  name: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryCreateDto {
  name: string;
  sortOrder?: number;
}

export interface CategoryUpdateDto {
  name?: string;
  sortOrder?: number;
}

export interface Menu {
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

export interface MenuCreateDto {
  categoryId: string;
  name: string;
  price: number;
  description: string;
  image?: File;
}

export interface MenuUpdateDto {
  categoryId?: string;
  name?: string;
  price?: number;
  description?: string;
  image?: File;
}

export type OrderStatus = 'pending' | 'preparing' | 'completed';

export interface Order {
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

export interface OrderItem {
  id: string;
  orderId: string;
  menuId: string;
  menuName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderHistory {
  id: string;
  storeId: string;
  tableId: string;
  sessionId: string;
  orderData: Order[];
  completedAt: string;
}

// Auth Types

export interface AuthState {
  token: string | null;
  user: AdminUser | null;
  storeId: string | null;
  isAuthenticated: boolean;
  loginAttempts: number;
  lockUntil: number | null;
}

export interface LoginCredentials {
  storeId: string;
  username: string;
  password: string;
}

// Dashboard Types

export interface DashboardState {
  orders: Order[];
  tables: Table[];
  sseConnected: boolean;
  selectedTableId: string | null;
  tableFilter: number | null;
  unacknowledgedOrderIds: string[];
  alertActiveOrderIds: string[];
}

export interface TableCard {
  table: Table;
  orders: Order[];
  totalAmount: number;
  latestOrder: Order | null;
  hasUnacknowledged: boolean;
  hasAlert: boolean;
}

// Table Management Types

export interface TableManagementState {
  tables: Table[];
  selectedTableId: string | null;
  historyOrders: OrderHistory[];
  historyDateRange: DateRange | null;
}

export interface DateRange {
  from: string;
  to: string;
}

export interface TableSetupDto {
  tableNumber: number;
  password: string;
}

// Menu Management Types

export interface MenuManagementState {
  categories: Category[];
  menus: Menu[];
  selectedCategoryId: string | null;
  editingMenu: Menu | null;
  editingCategory: Category | null;
}

// API Types

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// SSE Types

export type SSEEventType =
  | 'order:created'
  | 'order:statusChanged'
  | 'order:deleted'
  | 'table:completed';

export interface OrderCreatedEvent {
  orderId: string;
  tableId: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
}

export interface OrderStatusChangedEvent {
  orderId: string;
  status: OrderStatus;
}

export interface OrderDeletedEvent {
  orderId: string;
  tableId: string;
}

export interface TableCompletedEvent {
  tableId: string;
}

export interface SSEHandlers {
  onOrderCreated: (data: OrderCreatedEvent) => void;
  onOrderStatusChanged: (data: OrderStatusChangedEvent) => void;
  onOrderDeleted: (data: OrderDeletedEvent) => void;
  onTableCompleted: (data: TableCompletedEvent) => void;
  onConnectionChange: (state: 'connected' | 'reconnecting' | 'disconnected') => void;
}
