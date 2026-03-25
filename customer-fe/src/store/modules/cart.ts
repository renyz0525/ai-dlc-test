import type { Module } from 'vuex'
import type { CartState, CartItem, Menu } from '@/types'

const STORAGE_KEY = 'table-order-cart'

const cartModule: Module<CartState, unknown> = {
  namespaced: true,

  state: (): CartState => ({
    items: [],
  }),

  getters: {
    total(state): number {
      return state.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    },
    itemCount(state): number {
      return state.items.reduce((sum, item) => sum + item.quantity, 0)
    },
    isEmpty(state): boolean {
      return state.items.length === 0
    },
  },

  mutations: {
    ADD_ITEM(state, menu: Menu) {
      const existing = state.items.find((item) => item.menuId === menu.id)
      if (existing) {
        existing.quantity++
      } else {
        state.items.push({
          menuId: menu.id,
          menuName: menu.name,
          unitPrice: menu.price,
          quantity: 1,
          imageUrl: menu.imageUrl,
        })
      }
    },
    REMOVE_ITEM(state, menuId: string) {
      state.items = state.items.filter((item) => item.menuId !== menuId)
    },
    UPDATE_QUANTITY(state, payload: { menuId: string; quantity: number }) {
      const item = state.items.find((i) => i.menuId === payload.menuId)
      if (item) {
        if (payload.quantity <= 0) {
          state.items = state.items.filter((i) => i.menuId !== payload.menuId)
        } else {
          item.quantity = payload.quantity
        }
      }
    },
    CLEAR_CART(state) {
      state.items = []
    },
    LOAD_CART(state, items: CartItem[]) {
      state.items = items
    },
  },

  actions: {
    addItem({ commit, dispatch }, menu: Menu) {
      commit('ADD_ITEM', menu)
      dispatch('persistToStorage')
    },
    removeItem({ commit, dispatch }, menuId: string) {
      commit('REMOVE_ITEM', menuId)
      dispatch('persistToStorage')
    },
    updateQuantity({ commit, dispatch }, payload: { menuId: string; quantity: number }) {
      commit('UPDATE_QUANTITY', payload)
      dispatch('persistToStorage')
    },
    clearCart({ commit, dispatch }) {
      commit('CLEAR_CART')
      dispatch('persistToStorage')
    },
    loadFromStorage({ commit }) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const items: CartItem[] = JSON.parse(raw)
          if (Array.isArray(items)) {
            commit('LOAD_CART', items)
          }
        }
      } catch {
        // invalid data, ignore
      }
    },
    persistToStorage({ state }) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
      } catch {
        // localStorage unavailable
      }
    },
  },
}

export default cartModule
