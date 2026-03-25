import type { Module } from 'vuex'
import type { MenuState, Category, Menu } from '@/types'
import { fetchMenus } from '@/api/menu'

const menuModule: Module<MenuState, unknown> = {
  namespaced: true,

  state: (): MenuState => ({
    categories: [],
    menus: [],
    activeCategoryId: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    sortedCategories(state): Category[] {
      return [...state.categories].sort((a, b) => a.sortOrder - b.sortOrder)
    },
    filteredMenus(state): Menu[] {
      if (!state.activeCategoryId) return state.menus
      return state.menus
        .filter((m) => m.categoryId === state.activeCategoryId)
        .sort((a, b) => a.sortOrder - b.sortOrder)
    },
  },

  mutations: {
    SET_MENUS(state, payload: { categories: Category[]; menus: Menu[] }) {
      state.categories = payload.categories
      state.menus = payload.menus
    },
    SET_ACTIVE_CATEGORY(state, categoryId: string | null) {
      state.activeCategoryId = categoryId
    },
    SET_LOADING(state, loading: boolean) {
      state.isLoading = loading
    },
    SET_ERROR(state, error: string | null) {
      state.error = error
    },
  },

  actions: {
    async fetchMenus({ commit, state, rootState }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const storeId = (rootState as { auth: { storeId: string } }).auth.storeId
        const result = await fetchMenus(storeId)
        commit('SET_MENUS', result)
        if (!state.activeCategoryId && result.categories.length > 0) {
          const sorted = [...result.categories].sort((a, b) => a.sortOrder - b.sortOrder)
          commit('SET_ACTIVE_CATEGORY', sorted[0].id)
        }
      } catch (e) {
        commit('SET_ERROR', e instanceof Error ? e.message : 'Failed to load menus')
      } finally {
        commit('SET_LOADING', false)
      }
    },

    setActiveCategory({ commit }, categoryId: string) {
      commit('SET_ACTIVE_CATEGORY', categoryId)
    },
  },
}

export default menuModule
