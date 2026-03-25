import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createStore } from 'vuex'
import MenuView from '@/views/MenuView.vue'

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useRoute: () => ({ path: '/' }),
}))

vi.mock('primevue/usetoast', () => ({
  useToast: () => ({ add: vi.fn() }),
}))

vi.mock('@/composables/useBreakpoint', () => {
  const { ref } = require('vue')
  return {
    useBreakpoint: () => ({ isMobile: ref(false) }),
  }
})

vi.mock('@/components/common/AppLayout.vue', () => ({
  default: { name: 'AppLayout', template: '<div><slot /></div>' },
}))
vi.mock('@/components/menu/CategorySidebar.vue', () => ({
  default: { name: 'CategorySidebar', template: '<div data-testid="category-sidebar" />', props: ['categories', 'activeCategoryId'] },
}))
vi.mock('@/components/menu/CategoryDropdown.vue', () => ({
  default: { name: 'CategoryDropdown', template: '<div data-testid="category-dropdown" />', props: ['categories', 'activeCategoryId'] },
}))
vi.mock('@/components/menu/MenuGrid.vue', () => ({
  default: { name: 'MenuGrid', template: '<div data-testid="menu-grid" />', props: ['menus'] },
}))

const mockCategories = [
  { id: 'cat-1', name: '인기', sortOrder: 1 },
  { id: 'cat-2', name: '메인', sortOrder: 2 },
]
const mockMenus = [
  { id: 'menu-1', categoryId: 'cat-1', name: '버거', price: 15000, description: '', imageUrl: null, sortOrder: 1 },
]

function createTestStore(overrides: Record<string, unknown> = {}) {
  return createStore({
    modules: {
      auth: {
        namespaced: true,
        state: () => ({ storeId: 'store-1', token: 'tok', tableId: 'table-1', tableNumber: 1, sessionId: 'sess-1' }),
        getters: { isAuthenticated: () => true },
      },
      menu: {
        namespaced: true,
        state: () => ({
          categories: mockCategories,
          menus: mockMenus,
          activeCategoryId: 'cat-1',
          isLoading: false,
          error: null,
          ...overrides,
        }),
        getters: {
          sortedCategories: (state: any) => [...state.categories].sort((a: any, b: any) => a.sortOrder - b.sortOrder),
          filteredMenus: (state: any) => state.menus.filter((m: any) => m.categoryId === state.activeCategoryId),
        },
        actions: {
          fetchMenus: vi.fn(),
          setActiveCategory: vi.fn(),
        },
      },
      cart: {
        namespaced: true,
        state: () => ({ items: [] }),
        getters: { itemCount: () => 0, isEmpty: () => true },
        actions: { addItem: vi.fn() },
      },
      ui: {
        namespaced: true,
        state: () => ({ cartPanelOpen: false }),
        mutations: { SET_CART_PANEL: vi.fn() },
        actions: { toggleCartPanel: vi.fn() },
      },
    },
  })
}

describe('MenuView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders menu view with sidebar on desktop', () => {
    const store = createTestStore()
    const wrapper = mount(MenuView, { global: { plugins: [store] } })
    expect(wrapper.find('[data-testid="menu-view"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="category-sidebar"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="menu-grid"]').exists()).toBe(true)
  })

  it('shows loading spinner when loading', () => {
    const store = createTestStore({ isLoading: true })
    const wrapper = mount(MenuView, { global: { plugins: [store] } })
    expect(wrapper.find('.pi-spinner').exists()).toBe(true)
  })

  it('shows error message on error', () => {
    const store = createTestStore({ error: '로드 실패' })
    const wrapper = mount(MenuView, { global: { plugins: [store] } })
    expect(wrapper.text()).toContain('로드 실패')
    expect(wrapper.text()).toContain('다시 시도')
  })
})
