import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createStore, Store } from 'vuex';
import dashboard from '@/store/modules/dashboard';
import type { DashboardState, Order, Table } from '@/types';

vi.mock('@/api/orders', () => ({
  ordersApi: {
    getStoreOrders: vi.fn(),
    updateOrderStatus: vi.fn(),
    deleteOrder: vi.fn(),
  },
}));

vi.mock('@/api/tables', () => ({
  tablesApi: {
    getTables: vi.fn(),
    completeTable: vi.fn(),
  },
}));

vi.mock('@/api/sse', () => ({
  sseManager: {
    connect: vi.fn(),
    disconnect: vi.fn(),
  },
}));

const mockTable: Table = {
  id: 'table-1',
  storeId: 'store-1',
  tableNumber: 1,
  currentSessionId: 'session-1',
  createdAt: '2026-03-25T00:00:00Z',
};

const mockOrder: Order = {
  id: 'order-1',
  storeId: 'store-1',
  tableId: 'table-1',
  sessionId: 'session-1',
  status: 'pending',
  totalAmount: 15000,
  items: [{ id: 'item-1', orderId: 'order-1', menuId: 'menu-1', menuName: 'Burger', quantity: 1, unitPrice: 15000 }],
  acknowledgedAt: null,
  createdAt: '2026-03-25T10:00:00Z',
  updatedAt: '2026-03-25T10:00:00Z',
};

function createTestStore(): Store<{ dashboard: DashboardState }> {
  return createStore({
    modules: {
      dashboard,
      auth: {
        namespaced: true,
        getters: {
          storeId: () => 'store-1',
        },
      },
    },
  }) as Store<{ dashboard: DashboardState }>;
}

describe('dashboard store', () => {
  let store: Store<{ dashboard: DashboardState }>;

  beforeEach(() => {
    store = createTestStore();
    vi.clearAllMocks();
  });

  describe('mutations', () => {
    it('SET_ORDERS sets orders', () => {
      store.commit('dashboard/SET_ORDERS', [mockOrder]);
      expect(store.state.dashboard.orders).toHaveLength(1);
      expect(store.state.dashboard.orders[0].id).toBe('order-1');
    });

    it('ADD_ORDER adds an order', () => {
      store.commit('dashboard/ADD_ORDER', mockOrder);
      expect(store.state.dashboard.orders).toHaveLength(1);
    });

    it('UPDATE_ORDER_STATUS updates status', () => {
      store.commit('dashboard/SET_ORDERS', [mockOrder]);
      store.commit('dashboard/UPDATE_ORDER_STATUS', { orderId: 'order-1', status: 'preparing' });
      expect(store.state.dashboard.orders[0].status).toBe('preparing');
    });

    it('REMOVE_ORDER removes an order', () => {
      store.commit('dashboard/SET_ORDERS', [mockOrder]);
      store.commit('dashboard/REMOVE_ORDER', 'order-1');
      expect(store.state.dashboard.orders).toHaveLength(0);
    });

    it('SET_TABLE_FILTER sets filter', () => {
      store.commit('dashboard/SET_TABLE_FILTER', 1);
      expect(store.state.dashboard.tableFilter).toBe(1);
    });

    it('ADD_UNACKNOWLEDGED adds order id', () => {
      store.commit('dashboard/ADD_UNACKNOWLEDGED', 'order-1');
      expect(store.state.dashboard.unacknowledgedOrderIds).toContain('order-1');
    });

    it('REMOVE_UNACKNOWLEDGED removes order id', () => {
      store.commit('dashboard/ADD_UNACKNOWLEDGED', 'order-1');
      store.commit('dashboard/REMOVE_UNACKNOWLEDGED', 'order-1');
      expect(store.state.dashboard.unacknowledgedOrderIds).not.toContain('order-1');
    });

    it('CLEAR_TABLE_ORDERS removes all orders for a table', () => {
      store.commit('dashboard/SET_ORDERS', [mockOrder]);
      store.commit('dashboard/CLEAR_TABLE_ORDERS', 'table-1');
      expect(store.state.dashboard.orders).toHaveLength(0);
    });
  });

  describe('getters', () => {
    it('tableCards returns sorted cards', () => {
      store.commit('dashboard/SET_TABLES', [mockTable]);
      store.commit('dashboard/SET_ORDERS', [mockOrder]);
      const cards = store.getters['dashboard/tableCards'];
      expect(cards).toHaveLength(1);
      expect(cards[0].table.id).toBe('table-1');
      expect(cards[0].totalAmount).toBe(15000);
      expect(cards[0].latestOrder?.id).toBe('order-1');
    });

    it('filteredTableCards filters by table number', () => {
      const table2: Table = { ...mockTable, id: 'table-2', tableNumber: 2 };
      store.commit('dashboard/SET_TABLES', [mockTable, table2]);
      store.commit('dashboard/SET_TABLE_FILTER', 1);
      const cards = store.getters['dashboard/filteredTableCards'];
      expect(cards).toHaveLength(1);
      expect(cards[0].table.tableNumber).toBe(1);
    });

    it('selectedTableOrders returns orders for selected table', () => {
      store.commit('dashboard/SET_ORDERS', [mockOrder]);
      store.commit('dashboard/SET_SELECTED_TABLE', 'table-1');
      const orders = store.getters['dashboard/selectedTableOrders'];
      expect(orders).toHaveLength(1);
    });
  });

  describe('actions', () => {
    it('fetchOrders loads orders from API', async () => {
      const { ordersApi } = await import('@/api/orders');
      vi.mocked(ordersApi.getStoreOrders).mockResolvedValue([mockOrder]);

      await store.dispatch('dashboard/fetchOrders');
      expect(store.state.dashboard.orders).toHaveLength(1);
    });

    it('fetchTables loads tables from API', async () => {
      const { tablesApi } = await import('@/api/tables');
      vi.mocked(tablesApi.getTables).mockResolvedValue([mockTable]);

      await store.dispatch('dashboard/fetchTables');
      expect(store.state.dashboard.tables).toHaveLength(1);
    });

    it('acknowledgeOrder removes from unacknowledged', () => {
      store.commit('dashboard/ADD_UNACKNOWLEDGED', 'order-1');
      store.dispatch('dashboard/acknowledgeOrder', 'order-1');
      expect(store.state.dashboard.unacknowledgedOrderIds).not.toContain('order-1');
    });
  });
});
