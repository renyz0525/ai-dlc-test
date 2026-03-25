<template>
  <div
    class="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
    :data-testid="`order-card-${order.id}`"
  >
    <div class="flex justify-between items-start mb-3">
      <div>
        <p class="font-semibold text-sm" :data-testid="`order-number-${order.id}`">
          {{ order.orderNumber }}
        </p>
        <p class="text-xs text-gray-500">{{ formatDate(order.createdAt) }}</p>
      </div>
      <StatusBadge :status="order.status" />
    </div>

    <div class="space-y-1 mb-3">
      <div
        v-for="item in order.items"
        :key="item.id"
        class="flex justify-between text-sm text-gray-600"
      >
        <span>{{ item.menuName }} x{{ item.quantity }}</span>
        <span>{{ formatPrice(item.unitPrice * item.quantity) }}</span>
      </div>
    </div>

    <div class="flex justify-between items-center pt-3 border-t border-gray-100">
      <span class="text-sm font-medium text-gray-500">합계</span>
      <span class="font-bold text-blue-600" :data-testid="`order-total-${order.id}`">
        {{ formatPrice(order.totalAmount) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '@/types'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { formatPrice, formatDate } from '@/utils/format'

defineProps<{
  order: Order
}>()
</script>
