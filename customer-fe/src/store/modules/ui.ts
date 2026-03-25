import type { Module } from 'vuex'
import type { UIState } from '@/types'

const uiModule: Module<UIState, unknown> = {
  namespaced: true,

  state: (): UIState => ({
    cartPanelOpen: false,
  }),

  mutations: {
    SET_CART_PANEL(state, open: boolean) {
      state.cartPanelOpen = open
    },
  },

  actions: {
    toggleCartPanel({ commit, state }) {
      commit('SET_CART_PANEL', !state.cartPanelOpen)
    },
    openCartPanel({ commit }) {
      commit('SET_CART_PANEL', true)
    },
    closeCartPanel({ commit }) {
      commit('SET_CART_PANEL', false)
    },
  },
}

export default uiModule
