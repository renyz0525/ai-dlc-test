import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createStore } from 'vuex'
import cart from '@/store/modules/cart'
import type { Menu } from '@/types'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    removeItem: vi.fn((key: string) => { delete store[key] }),
    clear: vi.fn(() => { store = {} }),
  }
})()

Object.defineProperty(global, 'localStorage', { value: localStorageMock })

function createTestStore() {
  return createStore({
    modules: { cart },
  })
}

const mockMenu: Menu = {
  id: 'menu-1',
  categoryId: 'cat-1',
  name: '시그니처 버거',
  price: 15000,
  description: '테스트',
  imageUrl: null,
  sortOrder: 1,
}

describe('Cart Store', () => {
  let store: ReturnType<typeof createTestStore>

  beforeEach(() => {
    store = createTestStore()
    localStorageMock.clear()
  })

  describe('addItem', () => {
    it('adds a new item to cart', async () => {
      await store.dispatch('cart/addItem', mockMenu)
      expect(store.state.cart.items).toHaveLength(1)
      expect(store.state.cart.items[0].menuId).toBe('menu-1')
      expect(store.state.cart.items[0].quantity).toBe(1)
    })

    it('increments quantity for existing item', async () => {
      await store.dispatch('cart/addItem', mockMenu)
      await store.dispatch('cart/addItem', mockMenu)
      expect(store.state.cart.items).toHaveLength(1)
      expect(store.state.cart.items[0].quantity).toBe(2)
    })
  })

  describe('removeItem', () => {
    it('removes item from cart', async () => {
      await store.dispatch('cart/addItem', mockMenu)
      await store.dispatch('cart/removeItem', 'menu-1')
      expect(store.state.cart.items).toHaveLength(0)
    })
  })

  describe('updateQuantity', () => {
    it('updates item quantity', async () => {
      await store.dispatch('cart/addItem', mockMenu)
      await store.dispatch('cart/updateQuantity', { menuId: 'menu-1', quantity: 5 })
      expect(store.state.cart.items[0].quantity).toBe(5)
    })

    it('removes item when quantity is 0', async () => {
      await store.dispatch('cart/addItem', mockMenu)
      await store.dispatch('cart/updateQuantity', { menuId: 'menu-1', quantity: 0 })
      expect(store.state.cart.items).toHaveLength(0)
    })
  })

  describe('clearCart', () => {
    it('removes all items', async () => {
      await store.dispatch('cart/addItem', mockMenu)
      await store.dispatch('cart/clearCart')
      expect(store.state.cart.items).toHaveLength(0)
    })
  })

  describe('getters', () => {
    it('calculates total correctly', async () => {
      await store.dispatch('cart/addItem', mockMenu)
      await store.dispatch('cart/addItem', mockMenu)
      expect(store.getters['cart/total']).toBe(30000)
    })

    it('calculates itemCount correctly', async () => {
      await store.dispatch('cart/addItem', mockMenu)
      await store.dispatch('cart/updateQuantity', { menuId: 'menu-1', quantity: 3 })
      expect(store.getters['cart/itemCount']).toBe(3)
    })

    it('returns isEmpty true for empty cart', () => {
      expect(store.getters['cart/isEmpty']).toBe(true)
    })

    it('returns isEmpty false for non-empty cart', async () => {
      await store.dispatch('cart/addItem', mockMenu)
      expect(store.getters['cart/isEmpty']).toBe(false)
    })
  })

  describe('persistence', () => {
    it('saves cart to localStorage on change', async () => {
      await store.dispatch('cart/addItem', mockMenu)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'table-order-cart',
        expect.any(String)
      )
    })

    it('loads cart from localStorage', async () => {
      const saved = JSON.stringify([
        { menuId: 'menu-1', menuName: 'Test', unitPrice: 1000, quantity: 2, imageUrl: null },
      ])
      localStorageMock.getItem.mockReturnValueOnce(saved)
      await store.dispatch('cart/loadFromStorage')
      expect(store.state.cart.items).toHaveLength(1)
      expect(store.state.cart.items[0].quantity).toBe(2)
    })
  })
})
