import type { Module } from 'vuex'
import type { OrderState, OrderCreateDto, OrderStatus } from '@/types'
import { createOrder, fetchOrders } from '@/api/order'

const orderModule: Module<OrderState, unknown> = {
  namespaced: true,

  state: (): OrderState => ({
    orders: [],
    currentPage: 1,
    totalPages: 1,
    isLoading: false,
    error: null,
  }),

  getters: {
    sortedOrders(state) {
      return [...state.orders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    },
  },

  mutations: {
    SET_ORDERS(state, payload: { orders: typeof state.orders; page: number; totalPages: number }) {
      state.orders = payload.orders
      state.currentPage = payload.page
      state.totalPages = payload.totalPages
    },
    UPDATE_ORDER_STATUS(state, payload: { orderId: string; status: OrderStatus }) {
      const order = state.orders.find((o) => o.id === payload.orderId)
      if (order) {
        order.status = payload.status
      }
    },
    SET_LOADING(state, loading: boolean) {
      state.isLoading = loading
    },
    SET_ERROR(state, error: string | null) {
      state.error = error
    },
  },

  actions: {
    async createOrder({ rootState }, dto: OrderCreateDto) {
      const auth = (rootState as { auth: { storeId: string; tableId: string; sessionId: string } }).auth
      return createOrder(auth.storeId, auth.tableId, auth.sessionId, dto)
    },

    async fetchOrders({ commit, rootState }, page: number = 1) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const auth = (rootState as { auth: { storeId: string; tableId: string; sessionId: string } }).auth
        const result = await fetchOrders(auth.storeId, auth.tableId, auth.sessionId, page)
        commit('SET_ORDERS', {
          orders: result.data,
          page: result.page,
          totalPages: result.totalPages,
        })
      } catch (e) {
        commit('SET_ERROR', e instanceof Error ? e.message : 'Failed to load orders')
      } finally {
        commit('SET_LOADING', false)
      }
    },

    updateOrderStatus({ commit }, payload: { orderId: string; status: OrderStatus }) {
      commit('UPDATE_ORDER_STATUS', payload)
    },
  },
}

export default orderModule
