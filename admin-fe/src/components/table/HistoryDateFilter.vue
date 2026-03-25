<template>
  <div class="flex gap-4 items-end" data-testid="history-date-filter">
    <div class="flex-1">
      <label for="from-date" class="block text-sm font-medium text-gray-700 mb-1">
        From Date
      </label>
      <Calendar
        id="from-date"
        v-model="fromDate"
        date-format="yy-mm-dd"
        placeholder="Select date"
        class="w-full"
        data-testid="from-date-input"
        @date-select="handleDateChange"
      />
    </div>

    <div class="flex-1">
      <label for="to-date" class="block text-sm font-medium text-gray-700 mb-1">
        To Date
      </label>
      <Calendar
        id="to-date"
        v-model="toDate"
        date-format="yy-mm-dd"
        placeholder="Select date"
        class="w-full"
        data-testid="to-date-input"
        @date-select="handleDateChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, type PropType } from 'vue';
import Calendar from 'primevue/calendar';
import type { DateRange } from '@/types';

export default defineComponent({
  name: 'HistoryDateFilter',
  components: {
    Calendar,
  },
  props: {
    dateRange: {
      type: Object as PropType<DateRange | null>,
      default: null,
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const fromDate = ref<Date | null>(null);
    const toDate = ref<Date | null>(null);

    const formatDateToString = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const handleDateChange = () => {
      if (fromDate.value && toDate.value) {
        const range: DateRange = {
          from: formatDateToString(fromDate.value),
          to: formatDateToString(toDate.value),
        };
        emit('change', range);
      }
    };

    watch(
      () => props.dateRange,
      (newRange) => {
        if (newRange) {
          fromDate.value = new Date(newRange.from + 'T00:00:00');
          toDate.value = new Date(newRange.to + 'T00:00:00');
        } else {
          const today = new Date();
          fromDate.value = today;
          toDate.value = today;
        }
      },
      { immediate: true }
    );

    return {
      fromDate,
      toDate,
      handleDateChange,
    };
  },
});
</script>
