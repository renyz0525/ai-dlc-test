<template>
  <div class="dashboard-header mb-6" data-testid="dashboard-header">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-lg shadow p-4">
      <div class="flex items-center gap-3">
        <h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>
        <Badge
          :value="connectionStatusText"
          :severity="connectionStatusSeverity"
          data-testid="sse-connection-badge"
        />
      </div>

      <div class="flex items-center gap-2">
        <label for="table-filter" class="text-sm font-medium text-gray-700 whitespace-nowrap">
          테이블 필터:
        </label>
        <Dropdown
          id="table-filter"
          v-model="selectedFilter"
          :options="filterOptions"
          option-label="label"
          option-value="value"
          placeholder="전체 테이블"
          class="w-48"
          data-testid="table-filter-dropdown"
          @change="handleFilterChange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, type PropType } from 'vue';
import Badge from 'primevue/badge';
import Dropdown from 'primevue/dropdown';
import type { Table } from '@/types';

export default defineComponent({
  name: 'DashboardHeader',
  components: {
    Badge,
    Dropdown,
  },
  props: {
    sseConnected: {
      type: Boolean,
      required: true,
    },
    tables: {
      type: Array as PropType<Table[]>,
      required: true,
    },
    currentFilter: {
      type: Number as PropType<number | null>,
      default: null,
    },
  },
  emits: ['filter-change'],
  setup(props, { emit }) {
    const selectedFilter = ref<number | null>(props.currentFilter);

    const connectionStatusText = computed(() => {
      return props.sseConnected ? '연결됨' : '연결 끊김';
    });

    const connectionStatusSeverity = computed(() => {
      return props.sseConnected ? 'success' : 'danger';
    });

    const filterOptions = computed(() => {
      const options: { label: string; value: number | null }[] = [{ label: '전체 테이블', value: null }];
      const sortedTables = [...props.tables].sort((a, b) => a.tableNumber - b.tableNumber);
      sortedTables.forEach((table) => {
        options.push({
          label: `테이블 ${table.tableNumber}`,
          value: table.tableNumber,
        });
      });
      return options;
    });

    function handleFilterChange() {
      emit('filter-change', selectedFilter.value);
    }

    watch(() => props.currentFilter, (newVal) => {
      selectedFilter.value = newVal;
    });

    return {
      selectedFilter,
      connectionStatusText,
      connectionStatusSeverity,
      filterOptions,
      handleFilterChange,
    };
  },
});
</script>

<style scoped>
.dashboard-header {
  position: sticky;
  top: 0;
  z-index: 10;
}
</style>
