import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import CartSlidePanel from '@/components/cart/CartSlidePanel.vue'

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('primevue/sidebar', () => ({
  default: {
    name: 'Sidebar',
    template: '<div data-testid="sidebar"><slot /></div>',
    props: ['visible', 'position', 'header'],
  },
}))
vi.mock('primevue/button', () => ({
  default: { name: 'Button', template: '<button @click="$emit(\'click\')"><slot />{{ label }}</button>', props: ['label', 'severity', 'outlined'] },
}))
vi.mock('@/components/cart/CartItemCard.vue', () => ({
  default: {
    name: 'CartItemCard',
    template: '<div data-testid="cart-item-card">{{ item.menuName }}</div>',
    props: ['item'],
  },
}))

const mockItems = [
  { menuId: 'menu-1', menuName: '버거', unitPrice: 15000, quantity: 2, imageUrl: null },
  { menuId: 'menu-2', menuName: '스테이크', unitPrice: 32000, quantity: 1, imageUrl: null },
]

function createTestStore(items = mockItems) {
  return createStore({
    modules: {
      cart: {
        namespaced: true,
        state: () => ({ items }),
        getters: {
          total: (state: any) => state.items.reduce((s: number, i: any) => s + i.unitPrice * i.quantity, 0),
          isEmpty: (state: any) => state.items.length === 0,
        },
        actions: {
          updateQuantity: vi.fn(),
          removeItem: vi.fn(),
          clearCart: vi.fn(),
        },
      },
      ui: {
        namespaced: true,
        state: () => ({ cartPanelOpen: true }),
        mutations: {
          SET_CART_PANEL(state: any, val: boolean) { state.cartPanelOpen = val },
        },
        actions: {
          closeCartPanel: vi.fn(),
        },
      },
    },
  })
}

describe('CartSlidePanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders cart items when not empty', () => {
    const store = createTestStore()
    const wrapper = mount(CartSlidePanel, { global: { plugins: [store] } })
    const items = wrapper.findAll('[data-testid="cart-item-card"]')
    expect(items).toHaveLength(2)
  })

  it('shows empty message when cart is empty', () => {
    const store = createTestStore([])
    const wrapper = mount(CartSlidePanel, { global: { plugins: [store] } })
    expect(wrapper.text()).toContain('장바구니가 비어있습니다')
  })

  it('displays total price', () => {
    const store = createTestStore()
    const wrapper = mount(CartSlidePanel, { global: { plugins: [store] } })
    expect(wrapper.find('[data-testid="cart-total"]').exists()).toBe(true)
  })

  it('navigates to order confirm on order click', async () => {
    const store = createTestStore()
    const wrapper = mount(CartSlidePanel, { global: { plugins: [store] } })
    await wrapper.find('[data-testid="cart-order-button"]').trigger('click')
    expect(mockPush).toHaveBeenCalledWith('/order/confirm')
  })
})
