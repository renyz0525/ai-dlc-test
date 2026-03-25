import type { Order, OrderCreateDto, PaginatedResponse } from '@/types'
import { mockOrders, createMockOrder } from './data'

const orders: Order[] = [...mockOrders]

export async function mockCreateOrder(
  dto: OrderCreateDto,
  tableId: string,
  sessionId: string
): Promise<Order> {
  await new Promise((r) => setTimeout(r, 300))

  const order = createMockOrder(dto.items, dto.totalAmount, tableId, sessionId)
  orders.unshift(order)
  return order
}

export async function mockFetchOrders(
  _tableId: string,
  sessionId: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Order>> {
  await new Promise((r) => setTimeout(r, 200))

  const filtered = orders.filter((o) => o.sessionId === sessionId)
  const sorted = filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  const start = (page - 1) * limit
  const paged = sorted.slice(start, start + limit)

  return {
    data: paged,
    page,
    totalPages: Math.max(1, Math.ceil(sorted.length / limit)),
    totalCount: sorted.length,
  }
}
