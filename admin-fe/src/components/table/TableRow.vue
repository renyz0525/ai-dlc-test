<template>
  <tr :data-testid="`table-row-${table.id}`">
    <td class="px-4 py-3">{{ table.tableNumber }}</td>
    <td class="px-4 py-3">
      <span :class="sessionStatusClass">
        {{ table.currentSessionId ? 'Active' : 'Inactive' }}
      </span>
    </td>
    <td class="px-4 py-3">
      <div class="flex gap-2">
        <Button
          label="Complete"
          severity="success"
          size="small"
          :disabled="!table.currentSessionId"
          :data-testid="`complete-button-${table.id}`"
          @click="$emit('complete')"
        />
        <Button
          label="History"
          severity="info"
          size="small"
          :data-testid="`history-button-${table.id}`"
          @click="$emit('view-history')"
        />
      </div>
    </td>
  </tr>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue';
import Button from 'primevue/button';
import type { Table } from '@/types';

export default defineComponent({
  name: 'TableRow',
  components: {
    Button,
  },
  props: {
    table: {
      type: Object as PropType<Table>,
      required: true,
    },
  },
  emits: ['complete', 'view-history'],
  setup(props) {
    const sessionStatusClass = computed(() => {
      return props.table.currentSessionId
        ? 'px-2 py-1 rounded bg-green-100 text-green-800 text-sm font-medium'
        : 'px-2 py-1 rounded bg-gray-100 text-gray-800 text-sm font-medium';
    });

    return {
      sessionStatusClass,
    };
  },
});
</script>
