<template>
  <div data-testid="table-list">
    <DataTable :value="tables" class="p-datatable-sm">
      <Column field="tableNumber" header="Table Number" sortable />
      <Column header="Session Status">
        <template #body="{ data }">
          <span :class="sessionStatusClass(data)">
            {{ data.currentSessionId ? 'Active' : 'Inactive' }}
          </span>
        </template>
      </Column>
      <Column header="Actions">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button
              label="Complete"
              severity="success"
              size="small"
              :disabled="!data.currentSessionId"
              :data-testid="`complete-button-${data.id}`"
              @click="$emit('complete', data.id)"
            />
            <Button
              label="History"
              severity="info"
              size="small"
              :data-testid="`history-button-${data.id}`"
              @click="$emit('view-history', data.id)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import type { Table } from '@/types';

export default defineComponent({
  name: 'TableList',
  components: {
    DataTable,
    Column,
    Button,
  },
  props: {
    tables: {
      type: Array as PropType<Table[]>,
      required: true,
    },
  },
  emits: ['complete', 'view-history'],
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
