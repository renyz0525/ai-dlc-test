import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createStore } from 'vuex'
import auth from '@/store/modules/auth'

vi.mock('@/api/auth', () => ({
  login: vi.fn().mockResolvedValue({
    token: 'test-token',
    tableId: 'table-1',
    sessionId: 'session-1',
  }),
}))

vi.mock('@/api/client', () => ({
  setTokenGetter: vi.fn(),
}))

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
    modules: { auth },
  })
}

describe('Auth Store', () => {
  let store: ReturnType<typeof createTestStore>

  beforeEach(() => {
    store = createTestStore()
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('sets auth state on successful login', async () => {
      await store.dispatch('auth/login', {
        storeId: 'store-1',
        tableNumber: 5,
        password: 'pass',
      })

      expect(store.state.auth.token).toBe('test-token')
      expect(store.state.auth.storeId).toBe('store-1')
      expect(store.state.auth.tableId).toBe('table-1')
      expect(store.state.auth.tableNumber).toBe(5)
      expect(store.state.auth.sessionId).toBe('session-1')
    })

    it('saves credentials to localStorage', async () => {
      await store.dispatch('auth/login', {
        storeId: 'store-1',
        tableNumber: 5,
        password: 'pass',
      })

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'table-order-credentials',
        expect.stringContaining('store-1')
      )
    })
  })

  describe('getters', () => {
    it('isAuthenticated returns false when no token', () => {
      expect(store.getters['auth/isAuthenticated']).toBe(false)
    })

    it('isAuthenticated returns true after login', async () => {
      await store.dispatch('auth/login', {
        storeId: 'store-1',
        tableNumber: 5,
        password: 'pass',
      })
      expect(store.getters['auth/isAuthenticated']).toBe(true)
    })
  })

  describe('logout', () => {
    it('clears auth state', async () => {
      await store.dispatch('auth/login', {
        storeId: 'store-1',
        tableNumber: 5,
        password: 'pass',
      })
      store.dispatch('auth/logout')
      expect(store.state.auth.token).toBeNull()
      expect(store.getters['auth/isAuthenticated']).toBe(false)
    })
  })

  describe('autoLogin', () => {
    it('returns false when no saved credentials', async () => {
      const result = await store.dispatch('auth/autoLogin')
      expect(result).toBe(false)
    })

    it('returns true when valid credentials exist', async () => {
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify({ storeId: 'store-1', tableNumber: 5, password: 'pass' })
      )
      const result = await store.dispatch('auth/autoLogin')
      expect(result).toBe(true)
    })
  })
})
