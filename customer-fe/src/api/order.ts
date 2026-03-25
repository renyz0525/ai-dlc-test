import type { Order, OrderCreateDto, PaginatedResponse } from '@/types'
import { api } from './client'
import { mockCreateOrder, mockFetchOrders } from './mock/order'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export async function createOrder(
  storeId: string,
  tableId: string,
  sessionId: string,
  dto: OrderCreateDto
): Promise<Order> {
  if (USE_MOCK) {
    return mockCreateOrder(dto, tableId, sessionId)
  }
  return api.post<Order>(`/api/stores/${storeId}/tables/${tableId}/orders`, dto)
}

export async function fetchOrders(
  storeId: string,
  tableId: string,
  sessionId: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Order>> {
  if (USE_MOCK) {
    return mockFetchOrders(tableId, sessionId, page, limit)
  }
  return api.get<PaginatedResponse<Order>>(
    `/api/stores/${storeId}/tables/${tableId}/orders?sessionId=${sessionId}&page=${page}&limit=${limit}`
  )
}
