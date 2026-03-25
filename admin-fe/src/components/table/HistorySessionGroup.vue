<template>
  <div class="border rounded-lg p-4 bg-gray-50" :data-testid="`session-group-${session.id}`">
    <div class="mb-3">
      <div class="flex justify-between items-center mb-2">
        <h3 class="font-semibold text-lg">Session</h3>
        <span class="text-sm text-gray-600">
          {{ formatDate(session.completedAt) }}
        </span>
      </div>
      <div class="text-sm text-gray-600">
        <span>{{ formatTime(session.orderData[0]?.createdAt) }}</span>
        <span class="mx-2">-</span>
        <span>{{ formatTime(session.completedAt) }}</span>
      </div>
    </div>

    <div class="space-y-2 mb-3">
      <div
        v-for="order in session.orderData"
        :key="order.id"
        class="bg-white p-3 rounded border"
      >
        <div class="flex justify-between items-start mb-2">
          <span class="font-medium">Order #{{ order.id.slice(0, 8) }}</span>
          <span class="text-sm text-gray-600">{{ formatTime(order.createdAt) }}</span>
        </div>
        <div class="space-y-1">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="flex justify-between text-sm"
          >
            <span>{{ item.menuName }} × {{ item.quantity }}</span>
            <span class="font-medium">${{ (item.unitPrice * item.quantity).toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-between items-center pt-3 border-t">
      <span class="font-semibold">Total Amount:</span>
      <span class="text-xl font-bold text-green-600">
        ${{ totalAmount.toFixed(2) }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue';
import type { OrderHistory } from '@/types';

export default defineComponent({
  name: 'HistorySessionGroup',
  props: {
    session: {
      type: Object as PropType<OrderHistory>,
      required: true,
    },
  },
  setup(props) {
    const totalAmount = computed(() => {
      return props.session.orderData.reduce((sum, order) => sum + order.totalAmount, 0);
    });

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    const formatTime = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    return {
      totalAmount,
      formatDate,
      formatTime,
    };
  },
});
</script>
