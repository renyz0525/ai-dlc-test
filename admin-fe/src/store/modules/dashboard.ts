import type { Module } from 'vuex';
import type {
  DashboardState,
  Order,
  OrderStatus,
  TableCard,
  OrderCreatedEvent,
  OrderStatusChangedEvent,
  OrderDeletedEvent,
  TableCompletedEvent,
} from '@/types';
import { ordersApi } from '@/api/orders';
import { tablesApi } from '@/api/tables';
import { sseManager } from '@/api/sse';

const ALERT_DELAY = 30000; // 30 seconds
const alertTimers = new Map<string, number>();

const dashboard: Module<DashboardState, unknown> = {
  namespaced: true,

  state: (): DashboardState => ({
    orders: [],
    tables: [],
    sseConnected: false,
    selectedTableId: null,
    tableFilter: null,
    unacknowledgedOrderIds: [],
    alertActiveOrderIds: [],
  }),

  getters: {
    tableCards(state): TableCard[] {
      const cards: TableCard[] = state.tables.map((table) => {
        const tableOrders = state.orders.filter((o) => o.tableId === table.id);
        const totalAmount = tableOrders.reduce((sum, o) => sum + o.totalAmount, 0);
        const sortedOrders = [...tableOrders].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        const latestOrder = sortedOrders[0] || null;
        const hasUnacknowledged = tableOrders.some((o) =>
          state.unacknowledgedOrderIds.includes(o.id)
        );
        const hasAlert = tableOrders.some((o) => state.alertActiveOrderIds.includes(o.id));

        return { table, orders: tableOrders, totalAmount, latestOrder, hasUnacknowledged, hasAlert };
      });

      // Sort: tables with latest orders first, then by table number
      cards.sort((a, b) => {
        if (a.latestOrder && b.latestOrder) {
          return (
            new Date(b.latestOrder.createdAt).getTime() -
            new Date(a.latestOrder.createdAt).getTime()
          );
        }
        if (a.latestOrder) return -1;
        if (b.latestOrder) return 1;
        return a.table.tableNumber - b.table.tableNumber;
      });

      return cards;
    },

    filteredTableCards(state, getters): TableCard[] {
      if (state.tableFilter === null) return getters.tableCards;
      return getters.tableCards.filter(
        (card: TableCard) => card.table.tableNumber === state.tableFilter
      );
    },

    selectedTableOrders(state): Order[] {
      if (!state.selectedTableId) return [];
      return state.orders
        .filter((o) => o.tableId === state.selectedTableId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
  },

  mutations: {
    SET_ORDERS(state, orders: Order[]) {
      state.orders = orders;
    },
    ADD_ORDER(state, order: Order) {
      state.orders.push(order);
    },
    UPDATE_ORDER_STATUS(state, { orderId, status }: { orderId: string; status: OrderStatus }) {
      const order = state.orders.find((o) => o.id === orderId);
      if (order) order.status = status;
    },
    REMOVE_ORDER(state, orderId: string) {
      state.orders = state.orders.filter((o) => o.id !== orderId);
    },
    SET_TABLES(state, tables: DashboardState['tables']) {
      state.tables = tables;
    },
    SET_SSE_CONNECTED(state, connected: boolean) {
      state.sseConnected = connected;
    },
    SET_SELECTED_TABLE(state, tableId: string | null) {
      state.selectedTableId = tableId;
    },
    SET_TABLE_FILTER(state, tableNumber: number | null) {
      state.tableFilter = tableNumber;
    },
    ADD_UNACKNOWLEDGED(state, orderId: string) {
      if (!state.unacknowledgedOrderIds.includes(orderId)) {
        state.unacknowledgedOrderIds.push(orderId);
      }
    },
    REMOVE_UNACKNOWLEDGED(state, orderId: string) {
      state.unacknowledgedOrderIds = state.unacknowledgedOrderIds.filter((id) => id !== orderId);
    },
    SET_ALERT_ACTIVE(state, { orderId, active }: { orderId: string; active: boolean }) {
      if (active && !state.alertActiveOrderIds.includes(orderId)) {
        state.alertActiveOrderIds.push(orderId);
      } else if (!active) {
        state.alertActiveOrderIds = state.alertActiveOrderIds.filter((id) => id !== orderId);
      }
    },
    CLEAR_TABLE_ORDERS(state, tableId: string) {
      state.orders = state.orders.filter((o) => o.tableId !== tableId);
      state.unacknowledgedOrderIds = state.unacknowledgedOrderIds.filter((id) => {
        const order = state.orders.find((o) => o.id === id);
        return order !== undefined;
      });
    },
  },

  actions: {
    async fetchOrders({ commit, rootGetters }) {
      const storeId = rootGetters['auth/storeId'];
      if (!storeId) return;
      const orders = await ordersApi.getStoreOrders(storeId, { status: 'pending,preparing' });
      commit('SET_ORDERS', orders);
    },

    async fetchTables({ commit, rootGetters }) {
      const storeId = rootGetters['auth/storeId'];
      if (!storeId) return;
      const tables = await tablesApi.getTables(storeId);
      commit('SET_TABLES', tables);
    },

    connectSSE({ commit, rootGetters }) {
      const storeId = rootGetters['auth/storeId'];
      if (!storeId) return;

      sseManager.connect(storeId, {
        onOrderCreated(data: OrderCreatedEvent) {
          const order: Order = {
            id: data.orderId,
            storeId,
            tableId: data.tableId,
            sessionId: '',
            status: 'pending',
            totalAmount: data.totalAmount,
            items: data.items,
            acknowledgedAt: null,
            createdAt: data.createdAt,
            updatedAt: data.createdAt,
          };
          commit('ADD_ORDER', order);
          commit('ADD_UNACKNOWLEDGED', data.orderId);

          const timerId = window.setTimeout(() => {
            commit('SET_ALERT_ACTIVE', { orderId: data.orderId, active: true });
          }, ALERT_DELAY);
          alertTimers.set(data.orderId, timerId);
        },
        onOrderStatusChanged(data: OrderStatusChangedEvent) {
          commit('UPDATE_ORDER_STATUS', { orderId: data.orderId, status: data.status });
        },
        onOrderDeleted(data: OrderDeletedEvent) {
          commit('REMOVE_ORDER', data.orderId);
          commit('REMOVE_UNACKNOWLEDGED', data.orderId);
          commit('SET_ALERT_ACTIVE', { orderId: data.orderId, active: false });
          const timerId = alertTimers.get(data.orderId);
          if (timerId) {
            clearTimeout(timerId);
            alertTimers.delete(data.orderId);
          }
        },
        onTableCompleted(data: TableCompletedEvent) {
          commit('CLEAR_TABLE_ORDERS', data.tableId);
        },
        onConnectionChange(connectionState) {
          commit('SET_SSE_CONNECTED', connectionState === 'connected');
        },
      });
    },

    disconnectSSE() {
      sseManager.disconnect();
      alertTimers.forEach((timerId) => clearTimeout(timerId));
      alertTimers.clear();
    },

    async updateOrderStatus({ commit, rootGetters }, { orderId, status }: { orderId: string; status: OrderStatus }) {
      const storeId = rootGetters['auth/storeId'];
      const previousOrder = (this as unknown as { state: { dashboard: DashboardState } }).state.dashboard.orders.find(
        (o: Order) => o.id === orderId
      );
      const previousStatus = previousOrder?.status;

      commit('UPDATE_ORDER_STATUS', { orderId, status });

      try {
        await ordersApi.updateOrderStatus(storeId, orderId, status);
        // Acknowledge the order
        commit('REMOVE_UNACKNOWLEDGED', orderId);
        commit('SET_ALERT_ACTIVE', { orderId, active: false });
        const timerId = alertTimers.get(orderId);
        if (timerId) {
          clearTimeout(timerId);
          alertTimers.delete(orderId);
        }
      } catch {
        if (previousStatus) {
          commit('UPDATE_ORDER_STATUS', { orderId, status: previousStatus });
        }
        throw new Error('주문 상태 변경에 실패했습니다.');
      }
    },

    async deleteOrder({ commit, rootGetters }, orderId: string) {
      const storeId = rootGetters['auth/storeId'];
      commit('REMOVE_ORDER', orderId);

      try {
        await ordersApi.deleteOrder(storeId, orderId);
        commit('REMOVE_UNACKNOWLEDGED', orderId);
        commit('SET_ALERT_ACTIVE', { orderId, active: false });
        const timerId = alertTimers.get(orderId);
        if (timerId) {
          clearTimeout(timerId);
          alertTimers.delete(orderId);
        }
      } catch {
        // Refetch to restore state
        const orders = await ordersApi.getStoreOrders(storeId, { status: 'pending,preparing' });
        commit('SET_ORDERS', orders);
        throw new Error('주문 삭제에 실패했습니다.');
      }
    },

    async completeTable({ commit, rootGetters }, tableId: string) {
      const storeId = rootGetters['auth/storeId'];
      await tablesApi.completeTable(storeId, tableId);
      commit('CLEAR_TABLE_ORDERS', tableId);
    },

    acknowledgeOrder({ commit }, orderId: string) {
      commit('REMOVE_UNACKNOWLEDGED', orderId);
      commit('SET_ALERT_ACTIVE', { orderId, active: false });
      const timerId = alertTimers.get(orderId);
      if (timerId) {
        clearTimeout(timerId);
        alertTimers.delete(orderId);
      }
    },
  },
};

export default dashboard;
