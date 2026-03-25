import type { Module } from 'vuex'
import type { AuthState, SavedCredentials } from '@/types'
import { login } from '@/api/auth'
import { setTokenGetter } from '@/api/client'

const STORAGE_KEY = 'table-order-credentials'

const authModule: Module<AuthState, unknown> = {
  namespaced: true,

  state: (): AuthState => ({
    token: null,
    storeId: null,
    tableId: null,
    tableNumber: null,
    sessionId: null,
  }),

  getters: {
    isAuthenticated(state): boolean {
      return state.token !== null
    },
  },

  mutations: {
    SET_AUTH(state, payload: { token: string; storeId: string; tableId: string; tableNumber: number; sessionId: string }) {
      state.token = payload.token
      state.storeId = payload.storeId
      state.tableId = payload.tableId
      state.tableNumber = payload.tableNumber
      state.sessionId = payload.sessionId
    },
    CLEAR_AUTH(state) {
      state.token = null
      state.storeId = null
      state.tableId = null
      state.tableNumber = null
      state.sessionId = null
    },
  },

  actions: {
    async login({ commit }, credentials: { storeId: string; tableNumber: number; password: string }) {
      const response = await login({
        storeId: credentials.storeId,
        tableNumber: credentials.tableNumber,
        password: credentials.password,
      })

      commit('SET_AUTH', {
        token: response.token,
        storeId: credentials.storeId,
        tableId: response.tableId,
        tableNumber: credentials.tableNumber,
        sessionId: response.sessionId,
      })

      setTokenGetter(() => response.token)

      const saved: SavedCredentials = {
        storeId: credentials.storeId,
        tableNumber: credentials.tableNumber,
        password: credentials.password,
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
      } catch {
        // localStorage unavailable
      }
    },

    async autoLogin({ dispatch }): Promise<boolean> {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return false

        const credentials: SavedCredentials = JSON.parse(raw)
        await dispatch('login', credentials)
        return true
      } catch {
        localStorage.removeItem(STORAGE_KEY)
        return false
      }
    },

    logout({ commit }) {
      commit('CLEAR_AUTH')
      setTokenGetter(() => null)
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {
        // localStorage unavailable
      }
    },
  },
}

export default authModule
