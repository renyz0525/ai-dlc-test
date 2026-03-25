import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import OrderHistoryView from '@/views/OrderHistoryView.vue'

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useRoute: () => ({ path: '/orders' }),
}))

vi.mock('@/components/common/AppLayout.vue', () => ({
  default: { name: 'AppLayout', template: '<div><slot /></div>' },
}))
vi.mock('@/components/order/OrderCard.vue', () => ({
  default: { name: 'OrderCard', template: '<div data-testid="order-card">{{ order.orderNumber }}</div>', props: ['order'] },
}))
vi.mock('@/components/common/PaginationBar.vue', () => ({
  default: { name: 'PaginationBar', template: '<div data-testid="pagination" />', props: ['currentPage', 'totalPages'] },
}))

const mockOrders = [
  {
    id: 'order-1',
    orderNumber: 'ORD-0001',
    tableId: 'table-1',
    sessionId: 'sess-1',
    status: 'WAITING',
    totalAmount: 15000,
    items: [{ id: 'oi-1', menuId: 'menu-1', menuName: '버거', quantity: 1, unitPrice: 15000 }],
    createdAt: '2026-03-25T09:00:00Z',
  },
]

function createTestStore(overrides: Record<string, unknown> = {}) {
  const fetchOrders = vi.fn()
  const connect = vi.fn()
  const disconnect = vi.fn()

  const store = createStore({
    modules: {
      auth: {
        namespaced: true,
        state: () => ({ storeId: 'store-1', token: 'tok', tableId: 'table-1', tableNumber: 1, sessionId: 'sess-1' }),
        getters: { isAuthenticated: () => true },
      },
      order: {
        namespaced: true,
        state: () => ({
          orders: mockOrders,
          currentPage: 1,
          totalPages: 1,
          isLoading: false,
          error: null,
          ...overrides,
        }),
        getters: {
          sortedOrders: (state: any) => [...state.orders].sort(
            (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ),
        },
        actions: { fetchOrders },
      },
      sse: {
        namespaced: true,
        actions: { connect, disconnect },
      },
      cart: {
        namespaced: true,
        state: () => ({ items: [] }),
        getters: { itemCount: () => 0, isEmpty: () => true },
      },
      ui: {
        namespaced: true,
        state: () => ({ cartPanelOpen: false }),
        mutations: { SET_CART_PANEL: vi.fn() },
      },
    },
  })

  return { store, fetchOrders, connect, disconnect }
}

describe('OrderHistoryView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders order history with orders', () => {
    const { store } = createTestStore()
    const wrapper = mount(OrderHistoryView, {
      global: {
        plugins: [store],
        stubs: { 'router-link': { template: '<a><slot /></a>' } },
      },
    })
    expect(wrapper.find('[data-testid="order-history-view"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-testid="order-card"]')).toHaveLength(1)
  })

  it('fetches orders and connects SSE on mount', () => {
    const { store, fetchOrders, connect } = createTestStore()
    mount(OrderHistoryView, {
      global: {
        plugins: [store],
        stubs: { 'router-link': { template: '<a><slot /></a>' } },
      },
    })
    expect(fetchOrders).toHaveBeenCalledWith(expect.anything(), 1)
    expect(connect).toHaveBeenCalled()
  })

  it('shows loading spinner when loading', () => {
    const { store } = createTestStore({ isLoading: true })
    const wrapper = mount(OrderHistoryView, {
      global: {
        plugins: [store],
        stubs: { 'router-link': { template: '<a><slot /></a>' } },
      },
    })
    expect(wrapper.find('.pi-spinner').exists()).toBe(true)
  })

  it('shows empty message when no orders', () => {
    const { store } = createTestStore({ orders: [] })
    const wrapper = mount(OrderHistoryView, {
      global: {
        plugins: [store],
        stubs: { 'router-link': { template: '<a><slot /></a>' } },
      },
    })
    expect(wrapper.text()).toContain('주문 내역이 없습니다')
  })

  it('shows error message on error', () => {
    const { store } = createTestStore({ error: '서버 오류' })
    const wrapper = mount(OrderHistoryView, {
      global: {
        plugins: [store],
        stubs: { 'router-link': { template: '<a><slot /></a>' } },
      },
    })
    expect(wrapper.text()).toContain('서버 오류')
  })

  it('renders pagination bar', () => {
    const { store } = createTestStore()
    const wrapper = mount(OrderHistoryView, {
      global: {
        plugins: [store],
        stubs: { 'router-link': { template: '<a><slot /></a>' } },
      },
    })
    expect(wrapper.find('[data-testid="pagination"]').exists()).toBe(true)
  })
})
