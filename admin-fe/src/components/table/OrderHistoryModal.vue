<template>
  <Dialog
    :visible="visible"
    :header="`Order History - Table ${tableNumber}`"
    modal
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    data-testid="order-history-modal"
    @update:visible="$emit('close')"
  >
    <div class="space-y-4">
      <HistoryDateFilter
        :date-range="dateRange"
        @change="handleDateRangeChange"
      />

      <div v-if="isLoading" class="text-center py-4">
        <i class="pi pi-spin pi-spinner text-2xl"></i>
      </div>

      <div v-else-if="historyOrders.length === 0" class="text-center py-4 text-gray-500">
        No order history found for selected dates.
      </div>

      <div v-else class="space-y-4">
        <HistorySessionGroup
          v-for="session in historyOrders"
          :key="session.id"
          :session="session"
        />
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'primevue/usetoast';
import Dialog from 'primevue/dialog';
import HistoryDateFilter from './HistoryDateFilter.vue';
import HistorySessionGroup from './HistorySessionGroup.vue';
import type { DateRange, OrderHistory } from '@/types';

export default defineComponent({
  name: 'OrderHistoryModal',
  components: {
    Dialog,
    HistoryDateFilter,
    HistorySessionGroup,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    tableId: {
      type: String,
      required: true,
    },
    tableNumber: {
      type: Number,
      required: true,
    },
  },
  emits: ['close'],
  setup(props) {
    const store = useStore();
    const toast = useToast();

    const isLoading = ref(false);
    const historyOrders = computed<OrderHistory[]>(() => store.state.tables.historyOrders);
    const dateRange = ref<DateRange | null>(null);

    const getTodayDateRange = (): DateRange => {
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      return {
        from: dateStr,
        to: dateStr,
      };
    };

    const fetchHistory = async (range: DateRange) => {
      if (!props.tableId) return;

      isLoading.value = true;
      try {
        await store.dispatch('tables/fetchHistory', {
          tableId: props.tableId,
          dateRange: range,
        });
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error instanceof Error ? error.message : 'Failed to fetch order history',
          life: 3000,
        });
      } finally {
        isLoading.value = false;
      }
    };

    const handleDateRangeChange = (range: DateRange) => {
      dateRange.value = range;
      fetchHistory(range);
    };

    watch(
      () => props.visible,
      (newVisible) => {
        if (newVisible && props.tableId) {
          const todayRange = getTodayDateRange();
          dateRange.value = todayRange;
          fetchHistory(todayRange);
        }
      },
      { immediate: true }
    );

    return {
      isLoading,
      historyOrders,
      dateRange,
      handleDateRangeChange,
    };
  },
});
</script>
