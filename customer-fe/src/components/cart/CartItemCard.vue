<template>
  <div
    class="flex items-center gap-3 py-3 border-b border-gray-100"
    :data-testid="`cart-item-${item.menuId}`"
  >
    <div class="flex-1 min-w-0">
      <p class="font-medium text-sm text-gray-800 truncate">{{ item.menuName }}</p>
      <p class="text-sm text-gray-500">{{ formatPrice(item.unitPrice) }}</p>
    </div>

    <div class="flex items-center gap-2">
      <button
        class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 min-w-[44px] min-h-[44px]"
        :data-testid="`cart-item-decrease-${item.menuId}`"
        @click="$emit('updateQuantity', item.menuId, item.quantity - 1)"
      >
        <i class="pi pi-minus text-xs"></i>
      </button>
      <span
        class="w-8 text-center font-medium text-sm"
        :data-testid="`cart-item-quantity-${item.menuId}`"
      >
        {{ item.quantity }}
      </span>
      <button
        class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 min-w-[44px] min-h-[44px]"
        :data-testid="`cart-item-increase-${item.menuId}`"
        @click="$emit('updateQuantity', item.menuId, item.quantity + 1)"
      >
        <i class="pi pi-plus text-xs"></i>
      </button>
    </div>

    <div class="text-right w-20">
      <p class="font-semibold text-sm" :data-testid="`cart-item-subtotal-${item.menuId}`">
        {{ formatPrice(item.unitPrice * item.quantity) }}
      </p>
    </div>

    <button
      class="text-gray-400 hover:text-red-500 p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
      :data-testid="`cart-item-remove-${item.menuId}`"
      @click="$emit('remove', item.menuId)"
    >
      <i class="pi pi-trash text-sm"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { CartItem } from '@/types'
import { formatPrice } from '@/utils/format'

defineProps<{
  item: CartItem
}>()

defineEmits<{
  updateQuantity: [menuId: string, quantity: number]
  remove: [menuId: string]
}>()
</script>
