// Auth Types
export interface AuthState {
  token: string | null
  storeId: string | null
  tableId: string | null
  tableNumber: number | null
  sessionId: string | null
}

export interface SavedCredentials {
  storeId: string
  tableNumber: number
  password: string
}

export interface LoginRequest {
  storeId: string
  tableNumber: number
  password: string
}

export interface LoginResponse {
  token: string
  tableId: string
  sessionId: string
}

// Menu Types
export interface Category {
  id: string
  name: string
  sortOrder: number
}

export interface Menu {
  id: string
  categoryId: string
  name: string
  price: number
  description: string
  imageUrl: string | null
  sortOrder: number
}

export interface MenuState {
  categories: Category[]
  menus: Menu[]
  activeCategoryId: string | null
  isLoading: boolean
  error: string | null
}

// Cart Types
export interface CartItem {
  menuId: string
  menuName: string
  unitPrice: number
  quantity: number
  imageUrl: string | null
}

export interface CartState {
  items: CartItem[]
}

// Order Types
export type OrderStatus = 'WAITING' | 'PREPARING' | 'COMPLETED'

export interface OrderItemDto {
  menuId: string
  menuName: string
  quantity: number
  unitPrice: number
}

export interface OrderCreateDto {
  items: OrderItemDto[]
  totalAmount: number
}

export interface OrderItem {
  id: string
  menuId: string
  menuName: string
  quantity: number
  unitPrice: number
}

export interface Order {
  id: string
  orderNumber: string
  tableId: string
  sessionId: string
  status: OrderStatus
  totalAmount: number
  items: OrderItem[]
  createdAt: string
}

export interface OrderState {
  orders: Order[]
  currentPage: number
  totalPages: number
  isLoading: boolean
  error: string | null
}

// SSE Types
export interface OrderStatusChangedEvent {
  type: 'order:statusChanged'
  orderId: string
  status: OrderStatus
}

export interface SSEState {
  connected: boolean
  retryCount: number
}

// UI Types
export type ToastType = 'success' | 'error' | 'info'

export interface UIState {
  cartPanelOpen: boolean
}

// API Types
export interface PaginatedResponse<T> {
  data: T[]
  page: number
  totalPages: number
  totalCount: number
}
