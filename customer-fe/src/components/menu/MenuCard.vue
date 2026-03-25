<template>
  <div
    class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col"
    :data-testid="`menu-card-${menu.id}`"
  >
    <div class="h-40 bg-gray-200 flex items-center justify-center">
      <img
        v-if="menu.imageUrl"
        :src="menu.imageUrl"
        :alt="menu.name"
        class="w-full h-full object-cover"
      />
      <i v-else class="pi pi-image text-4xl text-gray-400"></i>
    </div>
    <div class="p-3 flex flex-col flex-1">
      <h3 class="font-semibold text-gray-800 text-sm" :data-testid="`menu-name-${menu.id}`">
        {{ menu.name }}
      </h3>
      <p class="text-xs text-gray-500 mt-1 flex-1 line-clamp-2">{{ menu.description }}</p>
      <div class="flex items-center justify-between mt-3">
        <span class="font-bold text-blue-600" :data-testid="`menu-price-${menu.id}`">
          {{ formatPrice(menu.price) }}
        </span>
        <button
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors min-w-[44px] min-h-[44px]"
          :data-testid="`menu-add-button-${menu.id}`"
          @click="$emit('addToCart', menu)"
        >
          담기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Menu } from '@/types'
import { formatPrice } from '@/utils/format'

defineProps<{
  menu: Menu
}>()

defineEmits<{
  addToCart: [menu: Menu]
}>()
</script>
