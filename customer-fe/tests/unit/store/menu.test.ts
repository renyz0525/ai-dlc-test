import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createStore } from 'vuex'
import menu from '@/store/modules/menu'

vi.mock('@/api/menu', () => ({
  fetchMenus: vi.fn().mockResolvedValue({
    categories: [
      { id: 'cat-1', name: '인기 메뉴', sortOrder: 1 },
      { id: 'cat-2', name: '메인 요리', sortOrder: 2 },
    ],
    menus: [
      { id: 'menu-1', categoryId: 'cat-1', name: '버거', price: 15000, description: '', imageUrl: null, sortOrder: 1 },
      { id: 'menu-2', categoryId: 'cat-2', name: '스테이크', price: 32000, description: '', imageUrl: null, sortOrder: 1 },
    ],
  }),
}))

function createTestStore() {
  return createStore({
    modules: {
      auth: {
        namespaced: true,
        state: () => ({ storeId: 'store-1' }),
      },
      menu,
    },
  })
}

describe('Menu Store', () => {
  let store: ReturnType<typeof createTestStore>

  beforeEach(() => {
    store = createTestStore()
    vi.clearAllMocks()
  })

  describe('fetchMenus', () => {
    it('loads menus and categories', async () => {
      await store.dispatch('menu/fetchMenus')
      expect(store.state.menu.categories).toHaveLength(2)
      expect(store.state.menu.menus).toHaveLength(2)
    })

    it('sets first category as active by default', async () => {
      await store.dispatch('menu/fetchMenus')
      expect(store.state.menu.activeCategoryId).toBe('cat-1')
    })
  })

  describe('getters', () => {
    it('sortedCategories sorts by sortOrder', async () => {
      await store.dispatch('menu/fetchMenus')
      const sorted = store.getters['menu/sortedCategories']
      expect(sorted[0].id).toBe('cat-1')
      expect(sorted[1].id).toBe('cat-2')
    })

    it('filteredMenus returns menus for active category', async () => {
      await store.dispatch('menu/fetchMenus')
      const filtered = store.getters['menu/filteredMenus']
      expect(filtered).toHaveLength(1)
      expect(filtered[0].categoryId).toBe('cat-1')
    })
  })

  describe('setActiveCategory', () => {
    it('changes the active category', async () => {
      await store.dispatch('menu/fetchMenus')
      await store.dispatch('menu/setActiveCategory', 'cat-2')
      expect(store.state.menu.activeCategoryId).toBe('cat-2')
      const filtered = store.getters['menu/filteredMenus']
      expect(filtered).toHaveLength(1)
      expect(filtered[0].categoryId).toBe('cat-2')
    })
  })
})
