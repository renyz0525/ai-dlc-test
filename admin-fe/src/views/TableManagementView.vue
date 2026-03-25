<template>
  <div class="p-6" data-testid="table-management-view">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold mb-6">Table Management</h1>

      <TableList
        :tables="sortedTables"
        @complete="handleComplete"
        @view-history="handleViewHistory"
      />

      <OrderHistoryModal
        :visible="historyModalVisible"
        :table-id="selectedTableId || ''"
        :table-number="selectedTableNumber"
        @close="handleCloseHistory"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import TableList from '@/components/table/TableList.vue';
import OrderHistoryModal from '@/components/table/OrderHistoryModal.vue';
import type { Table } from '@/types';

export default defineComponent({
  name: 'TableManagementView',
  components: {
    TableList,
    OrderHistoryModal,
  },
  setup() {
    const store = useStore();
    const confirm = useConfirm();
    const toast = useToast();

    const sortedTables = computed(() => store.getters['tables/sortedTables']);
    const selectedTableId = ref<string | null>(null);
    const selectedTableNumber = ref<number>(0);
    const historyModalVisible = ref(false);

    onMounted(async () => {
      try {
        await store.dispatch('tables/fetchTables');
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error instanceof Error ? error.message : 'Failed to fetch tables',
          life: 3000,
        });
      }
    });

    const handleComplete = (tableId: string) => {
      const table = sortedTables.value.find((t: Table) => t.id === tableId);
      if (!table) return;

      confirm.require({
        message: `Complete session for Table ${table.tableNumber}?`,
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          try {
            await store.dispatch('tables/completeTable', tableId);
            await store.dispatch('tables/fetchTables');
            toast.add({
              severity: 'success',
              summary: 'Success',
              detail: `Table ${table.tableNumber} session completed`,
              life: 3000,
            });
          } catch (error) {
            toast.add({
              severity: 'error',
              summary: 'Error',
              detail: error instanceof Error ? error.message : 'Failed to complete table session',
              life: 3000,
            });
          }
        },
      });
    };

    const handleViewHistory = (tableId: string) => {
      const table = sortedTables.value.find((t: Table) => t.id === tableId);
      if (!table) return;

      selectedTableId.value = tableId;
      selectedTableNumber.value = table.tableNumber;
      historyModalVisible.value = true;
    };

    const handleCloseHistory = () => {
      historyModalVisible.value = false;
      selectedTableId.value = null;
      selectedTableNumber.value = 0;
    };

    return {
      sortedTables,
      selectedTableId,
      selectedTableNumber,
      historyModalVisible,
      handleComplete,
      handleViewHistory,
      handleCloseHistory,
    };
  },
});
</script>
