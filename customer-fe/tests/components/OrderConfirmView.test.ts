import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createStore } from 'vuex'
import OrderConfirmView from '@/views/OrderConfirmView.vue'

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('primevue/button', () => ({
  default: { name: 'Button', template: '<button @click="$emit(\'click\')">{{ label }}</button>', props: ['label', 'loading', 'severity', 'outlined'] },
}))
vi.mock('@/components/common/AppLayout.vue', () => ({
  default: { name: 'AppLayout', template: '<div><slot /></div>' },
}))
vi.mock('@/components/order/OrderSummaryList.vue', () => ({
  default: { name: 'OrderSummaryList', template: '<div data-testid="order-summary" />', props: ['items'] },
}))

const mockCartItems = [
  { menuId: 'menu-1', menuName: '버거', unitPrice: 15000, quantity: 2, imageUrl: null },
]

function createTestStore(opts: { isEmpty?: boolean; createOrderFn?: any } = {}) {
  const { isEmpty = false, createOrderFn = vi.fn().mockResolvedValue({ orderNumber: 'ORD-0001' }) } = opts
  return createStore({
    modules: {
      auth: {
        namespaced: true,
        state: () => ({ storeId: 'store-1', tableId: 'table-1', sessionId: 'sess-1', token: 'tok', tableNumber: 1 }),
        getters: { isAuthenticated: () => true },
      },
      cart: {
        namespaced: true,
        state: () => ({ items: isEmpty ? [] : mockCartItems }),
        getters: {
          total: (state: any) => state.items.reduce((s: number, i: any) => s + i.unitPrice * i.quantity, 0),
          isEmpty: (state: any) => state.items.length === 0,
        },
        actions: { clearCart: vi.fn() },
      },
      order: {
        namespaced: true,
        actions: { createOrder: createOrderFn },
      },
      ui: {
        namespaced: true,
        state: () => ({ cartPanelOpen: false }),
        mutations: { SET_CART_PANEL: vi.fn() },
      },
    },
  })
}

describe('OrderConfirmView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders order confirmation with items', () => {
    const store = createTestStore()
    const wrapper = mount(OrderConfirmView, { global: { plugins: [store] } })
    expect(wrapper.find('[data-testid="order-confirm-view"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="order-summary"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="confirm-total"]').exists()).toBe(true)
  })

  it('redirects to menu if cart is empty', () => {
    const store = createTestStore({ isEmpty: true })
    mount(OrderConfirmView, { global: { plugins: [store] } })
    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('navigates back on back button click', async () => {
    const store = createTestStore()
    const wrapper = mount(OrderConfirmView, { global: { plugins: [store] } })
    await wrapper.find('[data-testid="confirm-back-button"]').trigger('click')
    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('submits order and navigates to success', async () => {
    const createOrderFn = vi.fn().mockResolvedValue({ orderNumber: 'ORD-0001' })
    const store = createTestStore({ createOrderFn })
    const wrapper = mount(OrderConfirmView, { global: { plugins: [store] } })

    await wrapper.find('[data-testid="confirm-submit-button"]').trigger('click')
    await flushPromises()

    expect(createOrderFn).toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith({
      name: 'OrderSuccess',
      query: { orderNumber: 'ORD-0001' },
    })
  })

  it('shows error on order failure', async () => {
    const createOrderFn = vi.fn().mockRejectedValue(new Error('주문 실패'))
    const store = createTestStore({ createOrderFn })
    const wrapper = mount(OrderConfirmView, { global: { plugins: [store] } })

    await wrapper.find('[data-testid="confirm-submit-button"]').trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-testid="confirm-error"]').text()).toBe('주문 실패')
  })
})
