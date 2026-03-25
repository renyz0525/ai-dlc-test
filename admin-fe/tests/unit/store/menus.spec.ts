import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createStore, Store } from 'vuex';
import menus from '@/store/modules/menus';
import type { MenuManagementState, Menu, Category } from '@/types';

vi.mock('@/api/menus', () => ({
  menusApi: {
    getMenus: vi.fn(),
    createMenu: vi.fn(),
    updateMenu: vi.fn(),
    deleteMenu: vi.fn(),
    updateMenuOrder: vi.fn(),
  },
}));

vi.mock('@/api/categories', () => ({
  categoriesApi: {
    getCategories: vi.fn(),
    createCategory: vi.fn(),
    updateCategory: vi.fn(),
    deleteCategory: vi.fn(),
  },
}));

const mockCategory: Category = {
  id: 'cat-1',
  storeId: 'store-1',
  name: 'Main',
  sortOrder: 0,
  createdAt: '2026-03-25T00:00:00Z',
  updatedAt: '2026-03-25T00:00:00Z',
};

const mockMenu: Menu = {
  id: 'menu-1',
  storeId: 'store-1',
  categoryId: 'cat-1',
  name: 'Burger',
  price: 15000,
  description: 'Tasty burger',
  imageUrl: null,
  sortOrder: 0,
  createdAt: '2026-03-25T00:00:00Z',
  updatedAt: '2026-03-25T00:00:00Z',
};

function createTestStore(): Store<{ menus: MenuManagementState }> {
  return createStore({
    modules: {
      menus,
      auth: {
        namespaced: true,
        getters: { storeId: () => 'store-1' },
      },
    },
  }) as Store<{ menus: MenuManagementState }>;
}

describe('menus store', () => {
  let store: Store<{ menus: MenuManagementState }>;

  beforeEach(() => {
    store = createTestStore();
    vi.clearAllMocks();
  });

  describe('mutations', () => {
    it('SET_CATEGORIES sets categories', () => {
      store.commit('menus/SET_CATEGORIES', [mockCategory]);
      expect(store.state.menus.categories).toHaveLength(1);
    });

    it('SET_MENUS sets menus', () => {
      store.commit('menus/SET_MENUS', [mockMenu]);
      expect(store.state.menus.menus).toHaveLength(1);
    });

    it('ADD_MENU adds a menu', () => {
      store.commit('menus/ADD_MENU', mockMenu);
      expect(store.state.menus.menus).toHaveLength(1);
    });

    it('REMOVE_MENU removes a menu', () => {
      store.commit('menus/SET_MENUS', [mockMenu]);
      store.commit('menus/REMOVE_MENU', 'menu-1');
      expect(store.state.menus.menus).toHaveLength(0);
    });

    it('REMOVE_CATEGORY removes category and its menus', () => {
      store.commit('menus/SET_CATEGORIES', [mockCategory]);
      store.commit('menus/SET_MENUS', [mockMenu]);
      store.commit('menus/REMOVE_CATEGORY', 'cat-1');
      expect(store.state.menus.categories).toHaveLength(0);
      expect(store.state.menus.menus).toHaveLength(0);
    });

    it('UPDATE_MENU_ORDER updates sort order', () => {
      const menu2: Menu = { ...mockMenu, id: 'menu-2', sortOrder: 1 };
      store.commit('menus/SET_MENUS', [mockMenu, menu2]);
      store.commit('menus/UPDATE_MENU_ORDER', ['menu-2', 'menu-1']);
      const m1 = store.state.menus.menus.find((m: Menu) => m.id === 'menu-1');
      const m2 = store.state.menus.menus.find((m: Menu) => m.id === 'menu-2');
      expect(m2?.sortOrder).toBe(0);
      expect(m1?.sortOrder).toBe(1);
    });
  });

  describe('getters', () => {
    it('menusByCategory filters by selected category', () => {
      const cat2: Category = { ...mockCategory, id: 'cat-2', name: 'Drinks' };
      const menu2: Menu = { ...mockMenu, id: 'menu-2', categoryId: 'cat-2' };
      store.commit('menus/SET_CATEGORIES', [mockCategory, cat2]);
      store.commit('menus/SET_MENUS', [mockMenu, menu2]);
      store.commit('menus/SET_SELECTED_CATEGORY', 'cat-1');
      const filtered = store.getters['menus/menusByCategory'];
      expect(filtered).toHaveLength(1);
      expect(filtered[0].categoryId).toBe('cat-1');
    });
  });

  describe('actions', () => {
    it('fetchCategories loads from API', async () => {
      const { categoriesApi } = await import('@/api/categories');
      vi.mocked(categoriesApi.getCategories).mockResolvedValue([mockCategory]);

      await store.dispatch('menus/fetchCategories');
      expect(store.state.menus.categories).toHaveLength(1);
    });

    it('fetchMenus loads from API', async () => {
      const { menusApi } = await import('@/api/menus');
      vi.mocked(menusApi.getMenus).mockResolvedValue([mockMenu]);

      await store.dispatch('menus/fetchMenus');
      expect(store.state.menus.menus).toHaveLength(1);
    });

    it('deleteMenu removes menu', async () => {
      const { menusApi } = await import('@/api/menus');
      vi.mocked(menusApi.deleteMenu).mockResolvedValue();
      store.commit('menus/SET_MENUS', [mockMenu]);

      await store.dispatch('menus/deleteMenu', 'menu-1');
      expect(store.state.menus.menus).toHaveLength(0);
    });
  });
});
