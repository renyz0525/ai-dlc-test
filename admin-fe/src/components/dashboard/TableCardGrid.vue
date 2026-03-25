<template>
  <div class="table-card-grid" data-testid="table-card-grid">
    <div
      v-if="tableCards.length === 0"
      class="text-center text-gray-500 py-12"
      data-testid="no-tables-message"
    >
      표시할 테이블이 없습니다.
    </div>

    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      <TableCard
        v-for="tableCard in tableCards"
        :key="tableCard.table.id"
        :table-card="tableCard"
        @click="handleSelectTable(tableCard.table.id)"
        @complete="handleCompleteTable(tableCard.table.id)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { TableCard as TableCardType } from '@/types';
import TableCard from './TableCard.vue';

export default defineComponent({
  name: 'TableCardGrid',
  components: {
    TableCard,
  },
  props: {
    tableCards: {
      type: Array as PropType<TableCardType[]>,
      required: true,
    },
  },
  emits: ['select-table', 'complete-table'],
  setup(_props, { emit }) {
    function handleSelectTable(tableId: string) {
      emit('select-table', tableId);
    }

    function handleCompleteTable(tableId: string) {
      emit('complete-table', tableId);
    }

    return {
      handleSelectTable,
      handleCompleteTable,
    };
  },
});
</script>
