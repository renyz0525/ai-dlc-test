import type { Module } from 'vuex'
import type { SSEState } from '@/types'
import { sseManager } from '@/api/sse'

const sseModule: Module<SSEState, unknown> = {
  namespaced: true,

  state: (): SSEState => ({
    connected: false,
    retryCount: 0,
  }),

  mutations: {
    SET_CONNECTED(state, connected: boolean) {
      state.connected = connected
    },
  },

  actions: {
    connect({ commit, dispatch, rootState }) {
      const storeId = (rootState as { auth: { storeId: string } }).auth.storeId
      sseManager.connect(storeId, (event) => {
        if (event.type === 'order:statusChanged') {
          dispatch('order/updateOrderStatus', {
            orderId: event.orderId,
            status: event.status,
          }, { root: true })
        }
      })
      commit('SET_CONNECTED', true)
    },

    disconnect({ commit }) {
      sseManager.disconnect()
      commit('SET_CONNECTED', false)
    },
  },
}

export default sseModule
