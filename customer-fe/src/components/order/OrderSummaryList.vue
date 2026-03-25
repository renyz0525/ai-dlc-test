<template>
  <div class="space-y-2" data-testid="order-summary-list">
    <div
      v-for="item in items"
      :key="item.menuId"
      class="flex justify-between items-center py-2 border-b border-gray-100"
      :data-testid="`summary-item-${item.menuId}`"
    >
      <div>
        <span class="text-sm font-medium text-gray-800">{{ item.menuName }}</span>
        <span class="text-sm text-gray-500 ml-2">x{{ item.quantity }}</span>
      </div>
      <span class="text-sm font-medium">{{ formatPrice(item.unitPrice * item.quantity) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CartItem } from '@/types'
import { formatPrice } from '@/utils/format'

defineProps<{
  items: CartItem[]
}>()
</script>
