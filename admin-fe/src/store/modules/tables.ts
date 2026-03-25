import type { Module } from 'vuex';
import type { TableManagementState, TableSetupDto, DateRange } from '@/types';
import { tablesApi } from '@/api/tables';

const tables: Module<TableManagementState, unknown> = {
  namespaced: true,

  state: (): TableManagementState => ({
    tables: [],
    selectedTableId: null,
    historyOrders: [],
    historyDateRange: null,
  }),

  getters: {
    sortedTables(state) {
      return [...state.tables].sort((a, b) => a.tableNumber - b.tableNumber);
    },
    selectedTable(state) {
      return state.tables.find((t) => t.id === state.selectedTableId) || null;
    },
  },

  mutations: {
    SET_TABLES(state, tables: TableManagementState['tables']) {
      state.tables = tables;
    },
    SET_SELECTED_TABLE(state, tableId: string | null) {
      state.selectedTableId = tableId;
    },
    SET_HISTORY(state, orders: TableManagementState['historyOrders']) {
      state.historyOrders = orders;
    },
    SET_HISTORY_DATE_RANGE(state, dateRange: DateRange | null) {
      state.historyDateRange = dateRange;
    },
    ADD_TABLE(state, table: TableManagementState['tables'][0]) {
      state.tables.push(table);
    },
  },

  actions: {
    async fetchTables({ commit, rootGetters }) {
      const storeId = rootGetters['auth/storeId'];
      if (!storeId) return;
      const tablesData = await tablesApi.getTables(storeId);
      commit('SET_TABLES', tablesData);
    },

    async setupTable({ commit, rootGetters }, data: TableSetupDto) {
      const storeId = rootGetters['auth/storeId'];
      const table = await tablesApi.setupTable(storeId, data);
      commit('ADD_TABLE', table);
      return table;
    },

    async completeTable({ rootGetters }, tableId: string) {
      const storeId = rootGetters['auth/storeId'];
      await tablesApi.completeTable(storeId, tableId);
    },

    async fetchHistory({ commit, rootGetters }, { tableId, dateRange }: { tableId: string; dateRange?: DateRange }) {
      const storeId = rootGetters['auth/storeId'];
      const history = await tablesApi.getTableHistory(storeId, tableId, dateRange);
      commit('SET_HISTORY', history);
    },
  },
};

export default tables;
