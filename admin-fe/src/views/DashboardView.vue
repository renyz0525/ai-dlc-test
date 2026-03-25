<template>
  <div class="dashboard-view p-6" data-testid="dashboard-view">
    <DashboardHeader
      :sse-connected="sseConnected"
      :tables="tables"
      :current-filter="currentFilter"
      @filter-change="handleFilterChange"
    />

    <TableCardGrid
      :table-cards="filteredTableCards"
      @select-table="handleSelectTable"
      @complete-table="handleCompleteTable"
    />

    <OrderDetailModal
      :visible="isModalVisible"
      :table="selectedTable"
      :orders="selectedTableOrders"
      @close="handleCloseModal"
      @status-change="handleStatusChange"
      @delete-order="handleDeleteOrder"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'primevue/usetoast';
import type { Table } from '@/types';
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue';
import TableCardGrid from '@/components/dashboard/TableCardGrid.vue';
import OrderDetailModal from '@/components/dashboard/OrderDetailModal.vue';

export default defineComponent({
  name: 'DashboardView',
  components: {
    DashboardHeader,
    TableCardGrid,
    OrderDetailModal,
  },
  setup() {
    const store = useStore();
    const toast = useToast();

    const tables = computed(() => store.state.dashboard.tables);
    const sseConnected = computed(() => store.state.dashboard.sseConnected);
    const currentFilter = computed(() => store.state.dashboard.tableFilter);
    const filteredTableCards = computed(() => store.getters['dashboard/filteredTableCards']);
    const selectedTableId = computed(() => store.state.dashboard.selectedTableId);
    const selectedTableOrders = computed(() => store.getters['dashboard/selectedTableOrders']);
    const isModalVisible = computed(() => selectedTableId.value !== null);
    const selectedTable = computed(() => {
      if (!selectedTableId.value) return null;
      return tables.value.find((t: Table) => t.id === selectedTableId.value) || null;
    });

    function handleFilterChange(tableNumber: number | null) {
      store.commit('dashboard/SET_TABLE_FILTER', tableNumber);
    }

    function handleSelectTable(tableId: string) {
      store.commit('dashboard/SET_SELECTED_TABLE', tableId);
      // Acknowledge all unacknowledged orders for this table
      const orders = store.getters['dashboard/selectedTableOrders'];
      orders.forEach((order: { id: string }) => {
        store.dispatch('dashboard/acknowledgeOrder', order.id);
      });
    }

    function handleCloseModal() {
      store.commit('dashboard/SET_SELECTED_TABLE', null);
    }

    async function handleStatusChange({ orderId, newStatus }: { orderId: string; newStatus: string }) {
      try {
        await store.dispatch('dashboard/updateOrderStatus', { orderId, status: newStatus });
        toast.add({
          severity: 'success',
          summary: '성공',
          detail: '주문 상태가 변경되었습니다.',
          life: 3000,
        });
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: '오류',
          detail: error instanceof Error ? error.message : '주문 상태 변경에 실패했습니다.',
          life: 3000,
        });
      }
    }

    async function handleDeleteOrder(orderId: string) {
      try {
        await store.dispatch('dashboard/deleteOrder', orderId);
        toast.add({
          severity: 'success',
          summary: '성공',
          detail: '주문이 삭제되었습니다.',
          life: 3000,
        });
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: '오류',
          detail: error instanceof Error ? error.message : '주문 삭제에 실패했습니다.',
          life: 3000,
        });
      }
    }

    async function handleCompleteTable(tableId: string) {
      try {
        await store.dispatch('dashboard/completeTable', tableId);
        toast.add({
          severity: 'success',
          summary: '성공',
          detail: '테이블 세션이 완료되었습니다.',
          life: 3000,
        });
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: '오류',
          detail: '테이블 세션 완료에 실패했습니다.',
          life: 3000,
        });
      }
    }

    onMounted(async () => {
      await store.dispatch('dashboard/fetchTables');
      await store.dispatch('dashboard/fetchOrders');
      store.dispatch('dashboard/connectSSE');
    });

    onUnmounted(() => {
      store.dispatch('dashboard/disconnectSSE');
    });

    return {
      tables,
      sseConnected,
      currentFilter,
      filteredTableCards,
      isModalVisible,
      selectedTable,
      selectedTableOrders,
      handleFilterChange,
      handleSelectTable,
      handleCloseModal,
      handleStatusChange,
      handleDeleteOrder,
      handleCompleteTable,
    };
  },
});
</script>

<style scoped>
.dashboard-view {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>
