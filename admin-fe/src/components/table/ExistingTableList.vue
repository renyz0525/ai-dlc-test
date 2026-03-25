<template>
  <div data-testid="existing-table-list">
    <DataTable :value="tables" class="p-datatable-sm">
      <Column field="tableNumber" header="Table Number" sortable />
      <Column header="Session Status">
        <template #body="{ data }">
          <span :class="sessionStatusClass(data)">
            {{ data.currentSessionId ? 'Active' : 'Inactive' }}
          </span>
        </template>
      </Column>
    </DataTable>

    <div v-if="tables.length === 0" class="text-center py-4 text-gray-500">
      No tables set up yet.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import type { Table } from '@/types';

export default defineComponent({
  name: 'ExistingTableList',
  components: {
    DataTable,
    Column,
  },
  props: {
    tables: {
      type: Array as PropType<Table[]>,
      required: true,
    },
  },
  setup() {
    const sessionStatusClass = (table: Table) => {
      return table.currentSessionId
        ? 'px-2 py-1 rounded bg-green-100 text-green-800 text-sm font-medium'
        : 'px-2 py-1 rounded bg-gray-100 text-gray-800 text-sm font-medium';
    };

    return {
      sessionStatusClass,
    };
  },
});
</script>
