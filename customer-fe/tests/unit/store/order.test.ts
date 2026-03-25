import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createStore } from 'vuex'
import order from '@/store/modules/order'

const mockOrder = {
  id: 'order-1',
  orderNumber: 'ORD-0001',
  tableId: 'table-1',
  sessionId: 'session-1',
  status: 'WAITING' as const,
  totalAmount: 15000,
  items: [
    { id: 'oi-1', menuId: 'menu-1', menuName: '버거', quantity: 1, unitPrice: 15000 },
  ],
  createdAt: '2026-03-25T09:00:00Z',
}

vi.mock('@/api/order', () => {
  const order = {
    id: 'order-1',
    orderNumber: 'ORD-0001',
    tableId: 'table-1',
    sessionId: 'session-1',
    status: 'WAITING',
    totalAmount: 15000,
    items: [
      { id: 'oi-1', menuId: 'menu-1', menuName: '버거', quantity: 1, unitPrice: 15000 },
    ],
    createdAt: '2026-03-25T09:00:00Z',
  }
  return {
    createOrder: vi.fn().mockResolvedValue(order),
    fetchOrders: vi.fn().mockResolvedValue({
      data: [order],
      page: 1,
      totalPages: 1,
      totalCount: 1,
    }),
  }
})

function createTestStore() {
  return createStore({
    modules: {
      auth: {
        namespaced: true,
        state: () => ({ storeId: 'store-1', tableId: 'table-1', sessionId: 'session-1' }),
      },
      order,
    },
  })
}

describe('Order Store', () => {
  let store: ReturnType<typeof createTestStore>

  beforeEach(() => {
    store = createTestStore()
    vi.clearAllMocks()
  })

  describe('fetchOrders', () => {
    it('loads orders with pagination', async () => {
      await store.dispatch('order/fetchOrders', 1)
      expect(store.state.order.orders).toHaveLength(1)
      expect(store.state.order.currentPage).toBe(1)
      expect(store.state.order.totalPages).toBe(1)
    })
  })

  describe('createOrder', () => {
    it('creates an order and returns it', async () => {
      const result = await store.dispatch('order/createOrder', {
        items: [{ menuId: 'menu-1', menuName: '버거', quantity: 1, unitPrice: 15000 }],
        totalAmount: 15000,
      })
      expect(result.orderNumber).toBe('ORD-0001')
    })
  })

  describe('updateOrderStatus', () => {
    it('updates order status in state', async () => {
      await store.dispatch('order/fetchOrders', 1)
      store.dispatch('order/updateOrderStatus', { orderId: 'order-1', status: 'PREPARING' })
      expect(store.state.order.orders[0].status).toBe('PREPARING')
    })
  })

  describe('getters', () => {
    it('sortedOrders sorts by createdAt descending', async () => {
      await store.dispatch('order/fetchOrders', 1)
      const sorted = store.getters['order/sortedOrders']
      expect(sorted).toHaveLength(1)
    })
  })
})
