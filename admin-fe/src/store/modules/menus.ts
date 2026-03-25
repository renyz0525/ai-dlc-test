import type { Module } from 'vuex';
import type { MenuManagementState, Menu, Category, CategoryCreateDto, CategoryUpdateDto } from '@/types';
import { menusApi } from '@/api/menus';
import { categoriesApi } from '@/api/categories';

const menus: Module<MenuManagementState, unknown> = {
  namespaced: true,

  state: (): MenuManagementState => ({
    categories: [],
    menus: [],
    selectedCategoryId: null,
    editingMenu: null,
    editingCategory: null,
  }),

  getters: {
    sortedCategories(state) {
      return [...state.categories].sort((a, b) => a.sortOrder - b.sortOrder);
    },
    menusByCategory(state) {
      if (!state.selectedCategoryId) return [...state.menus].sort((a, b) => a.sortOrder - b.sortOrder);
      return state.menus
        .filter((m) => m.categoryId === state.selectedCategoryId)
        .sort((a, b) => a.sortOrder - b.sortOrder);
    },
  },

  mutations: {
    SET_CATEGORIES(state, categories: Category[]) {
      state.categories = categories;
    },
    SET_MENUS(state, menuList: Menu[]) {
      state.menus = menuList;
    },
    ADD_CATEGORY(state, category: Category) {
      state.categories.push(category);
    },
    UPDATE_CATEGORY(state, updated: Category) {
      const idx = state.categories.findIndex((c) => c.id === updated.id);
      if (idx !== -1) state.categories.splice(idx, 1, updated);
    },
    REMOVE_CATEGORY(state, categoryId: string) {
      state.categories = state.categories.filter((c) => c.id !== categoryId);
      state.menus = state.menus.filter((m) => m.categoryId !== categoryId);
      if (state.selectedCategoryId === categoryId) state.selectedCategoryId = null;
    },
    ADD_MENU(state, menu: Menu) {
      state.menus.push(menu);
    },
    UPDATE_MENU(state, updated: Menu) {
      const idx = state.menus.findIndex((m) => m.id === updated.id);
      if (idx !== -1) state.menus.splice(idx, 1, updated);
    },
    REMOVE_MENU(state, menuId: string) {
      state.menus = state.menus.filter((m) => m.id !== menuId);
    },
    SET_SELECTED_CATEGORY(state, categoryId: string | null) {
      state.selectedCategoryId = categoryId;
    },
    SET_EDITING_MENU(state, menu: Menu | null) {
      state.editingMenu = menu;
    },
    SET_EDITING_CATEGORY(state, category: Category | null) {
      state.editingCategory = category;
    },
    UPDATE_MENU_ORDER(state, menuIds: string[]) {
      menuIds.forEach((id, index) => {
        const menu = state.menus.find((m) => m.id === id);
        if (menu) menu.sortOrder = index;
      });
    },
  },

  actions: {
    async fetchCategories({ commit, rootGetters }) {
      const storeId = rootGetters['auth/storeId'];
      if (!storeId) return;
      const categories = await categoriesApi.getCategories(storeId);
      commit('SET_CATEGORIES', categories);
    },

    async fetchMenus({ commit, rootGetters }) {
      const storeId = rootGetters['auth/storeId'];
      if (!storeId) return;
      const menuList = await menusApi.getMenus(storeId);
      commit('SET_MENUS', menuList);
    },

    async createCategory({ commit, rootGetters }, data: CategoryCreateDto) {
      const storeId = rootGetters['auth/storeId'];
      const category = await categoriesApi.createCategory(storeId, data);
      commit('ADD_CATEGORY', category);
      return category;
    },

    async updateCategory({ commit, rootGetters }, { categoryId, data }: { categoryId: string; data: CategoryUpdateDto }) {
      const storeId = rootGetters['auth/storeId'];
      const category = await categoriesApi.updateCategory(storeId, categoryId, data);
      commit('UPDATE_CATEGORY', category);
      return category;
    },

    async deleteCategory({ commit, rootGetters }, categoryId: string) {
      const storeId = rootGetters['auth/storeId'];
      await categoriesApi.deleteCategory(storeId, categoryId);
      commit('REMOVE_CATEGORY', categoryId);
    },

    async createMenu({ commit, rootGetters }, formData: FormData) {
      const storeId = rootGetters['auth/storeId'];
      const menu = await menusApi.createMenu(storeId, formData);
      commit('ADD_MENU', menu);
      return menu;
    },

    async updateMenu({ commit, rootGetters }, { menuId, formData }: { menuId: string; formData: FormData }) {
      const storeId = rootGetters['auth/storeId'];
      const menu = await menusApi.updateMenu(storeId, menuId, formData);
      commit('UPDATE_MENU', menu);
      return menu;
    },

    async deleteMenu({ commit, rootGetters }, menuId: string) {
      const storeId = rootGetters['auth/storeId'];
      await menusApi.deleteMenu(storeId, menuId);
      commit('REMOVE_MENU', menuId);
    },

    async updateMenuOrder({ commit, rootGetters }, menuIds: string[]) {
      const storeId = rootGetters['auth/storeId'];
      commit('UPDATE_MENU_ORDER', menuIds);
      await menusApi.updateMenuOrder(storeId, menuIds);
    },
  },
};

export default menus;
