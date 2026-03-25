<template>
  <div class="p-6" data-testid="table-setup-view">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold mb-6">Table Setup</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 class="text-xl font-semibold mb-4">Existing Tables</h2>
          <ExistingTableList :tables="sortedTables" />
        </div>

        <div>
          <h2 class="text-xl font-semibold mb-4">Setup New Table</h2>
          <TableSetupForm @submit="handleSubmit" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'primevue/usetoast';
import ExistingTableList from '@/components/table/ExistingTableList.vue';
import TableSetupForm from '@/components/table/TableSetupForm.vue';
import type { TableSetupDto } from '@/types';

export default defineComponent({
  name: 'TableSetupView',
  components: {
    ExistingTableList,
    TableSetupForm,
  },
  setup() {
    const store = useStore();
    const toast = useToast();

    const sortedTables = computed(() => store.getters['tables/sortedTables']);

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

    const handleSubmit = async (data: TableSetupDto) => {
      try {
        await store.dispatch('tables/setupTable', data);
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: `Table ${data.tableNumber} has been set up successfully`,
          life: 3000,
        });
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error instanceof Error ? error.message : 'Failed to setup table',
          life: 3000,
        });
        throw error;
      }
    };

    return {
      sortedTables,
      handleSubmit,
    };
  },
});
</script>
