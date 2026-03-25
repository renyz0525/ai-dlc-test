<template>
  <div
    class="table-card bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-5"
    :class="{
      'border-2 border-orange-400': hasUnacknowledged,
      'animate-pulse-alert': hasAlert,
    }"
    :data-testid="`table-card-${table.tableNumber}`"
    @click="handleClick"
  >
    <!-- Table Number Header -->
    <div class="flex justify-between items-start mb-3">
      <h3 class="text-xl font-bold text-gray-800">
        테이블 {{ table.tableNumber }}
      </h3>
      <Badge
        v-if="orderCount > 0"
        :value="orderCount"
        severity="info"
        :data-testid="`table-card-${table.tableNumber}-order-count`"
      />
    </div>

    <!-- Total Amount -->
    <div class="mb-3">
      <p class="text-sm text-gray-500 mb-1">총 금액</p>
      <p class="text-2xl font-bold text-blue-600">
        {{ formattedTotalAmount }}
      </p>
    </div>

    <!-- Latest Order Preview -->
    <div v-if="latestOrder" class="mb-4">
      <p class="text-sm text-gray-500 mb-1">최근 주문</p>
      <div class="flex items-center gap-2">
        <Tag
          :value="orderStatusLabel"
          :severity="orderStatusSeverity"
          :data-testid="`table-card-${table.tableNumber}-latest-status`"
        />
        <span class="text-sm text-gray-600">
          {{ latestOrderItemsPreview }}
        </span>
      </div>
    </div>

    <div v-else class="mb-4">
      <p class="text-sm text-gray-400">주문 없음</p>
    </div>

    <!-- Complete Button -->
    <div class="flex justify-end">
      <Button
        label="완료"
        size="small"
        severity="success"
        :disabled="orderCount === 0"
        :data-testid="`table-card-${table.tableNumber}-complete-button`"
        @click.stop="handleComplete"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue';
import Badge from 'primevue/badge';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import type { TableCard as TableCardType, OrderStatus } from '@/types';

export default defineComponent({
  name: 'TableCard',
  components: {
    Badge,
    Tag,
    Button,
  },
  props: {
    tableCard: {
      type: Object as PropType<TableCardType>,
      required: true,
    },
  },
  emits: ['click', 'complete'],
  setup(props, { emit }) {
    const table = computed(() => props.tableCard.table);
    const orders = computed(() => props.tableCard.orders);
    const totalAmount = computed(() => props.tableCard.totalAmount);
    const latestOrder = computed(() => props.tableCard.latestOrder);
    const hasUnacknowledged = computed(() => props.tableCard.hasUnacknowledged);
    const hasAlert = computed(() => props.tableCard.hasAlert);
    const orderCount = computed(() => orders.value.length);

    const formattedTotalAmount = computed(() => {
      return `₩${totalAmount.value.toLocaleString('ko-KR')}`;
    });

    const orderStatusLabel = computed(() => {
      if (!latestOrder.value) return '';
      const statusMap: Record<OrderStatus, string> = {
        pending: '대기중',
        preparing: '준비중',
        completed: '완료',
      };
      return statusMap[latestOrder.value.status];
    });

    const orderStatusSeverity = computed(() => {
      if (!latestOrder.value) return undefined;
      const severityMap: Record<OrderStatus, 'warn' | 'info' | 'success'> = {
        pending: 'warn',
        preparing: 'info',
        completed: 'success',
      };
      return severityMap[latestOrder.value.status];
    });

    const latestOrderItemsPreview = computed(() => {
      if (!latestOrder.value || latestOrder.value.items.length === 0) return '';
      const firstItem = latestOrder.value.items[0];
      const remainingCount = latestOrder.value.items.length - 1;
      if (remainingCount > 0) {
        return `${firstItem.menuName} 외 ${remainingCount}건`;
      }
      return firstItem.menuName;
    });

    function handleClick() {
      emit('click');
    }

    function handleComplete() {
      emit('complete');
    }

    return {
      table,
      orderCount,
      formattedTotalAmount,
      latestOrder,
      hasUnacknowledged,
      hasAlert,
      orderStatusLabel,
      orderStatusSeverity,
      latestOrderItemsPreview,
      handleClick,
      handleComplete,
    };
  },
});
</script>

<style scoped>
@keyframes pulse-alert {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse-alert {
  animation: pulse-alert 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
