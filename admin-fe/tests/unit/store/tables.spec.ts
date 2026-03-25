import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createStore, Store } from 'vuex';
import tables from '@/store/modules/tables';
import type { TableManagementState, Table } from '@/types';

vi.mock('@/api/tables', () => ({
  tablesApi: {
    getTables: vi.fn(),
    setupTable: vi.fn(),
    completeTable: vi.fn(),
    getTableHistory: vi.fn(),
  },
}));

const mockTable: Table = {
  id: 'table-1',
  storeId: 'store-1',
  tableNumber: 1,
  currentSessionId: 'session-1',
  createdAt: '2026-03-25T00:00:00Z',
};

function createTestStore(): Store<{ tables: TableManagementState }> {
  return createStore({
    modules: {
      tables,
      auth: {
        namespaced: true,
        getters: { storeId: () => 'store-1' },
      },
    },
  }) as Store<{ tables: TableManagementState }>;
}

describe('tables store', () => {
  let store: Store<{ tables: TableManagementState }>;

  beforeEach(() => {
    store = createTestStore();
    vi.clearAllMocks();
  });

  describe('mutations', () => {
    it('SET_TABLES sets tables', () => {
      store.commit('tables/SET_TABLES', [mockTable]);
      expect(store.state.tables.tables).toHaveLength(1);
    });

    it('ADD_TABLE adds a table', () => {
      store.commit('tables/ADD_TABLE', mockTable);
      expect(store.state.tables.tables).toHaveLength(1);
    });

    it('SET_SELECTED_TABLE sets selection', () => {
      store.commit('tables/SET_SELECTED_TABLE', 'table-1');
      expect(store.state.tables.selectedTableId).toBe('table-1');
    });
  });

  describe('getters', () => {
    it('sortedTables returns tables sorted by number', () => {
      const table2: Table = { ...mockTable, id: 'table-2', tableNumber: 2 };
      store.commit('tables/SET_TABLES', [table2, mockTable]);
      const sorted = store.getters['tables/sortedTables'];
      expect(sorted[0].tableNumber).toBe(1);
      expect(sorted[1].tableNumber).toBe(2);
    });
  });

  describe('actions', () => {
    it('fetchTables loads tables from API', async () => {
      const { tablesApi } = await import('@/api/tables');
      vi.mocked(tablesApi.getTables).mockResolvedValue([mockTable]);

      await store.dispatch('tables/fetchTables');
      expect(store.state.tables.tables).toHaveLength(1);
    });

    it('setupTable calls API and adds table', async () => {
      const { tablesApi } = await import('@/api/tables');
      vi.mocked(tablesApi.setupTable).mockResolvedValue(mockTable);

      await store.dispatch('tables/setupTable', { tableNumber: 1, password: '1234' });
      expect(store.state.tables.tables).toHaveLength(1);
    });

    it('fetchHistory loads history from API', async () => {
      const { tablesApi } = await import('@/api/tables');
      vi.mocked(tablesApi.getTableHistory).mockResolvedValue([]);

      await store.dispatch('tables/fetchHistory', { tableId: 'table-1' });
      expect(store.state.tables.historyOrders).toHaveLength(0);
    });
  });
});
