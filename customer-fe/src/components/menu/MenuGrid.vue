<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4"
    data-testid="menu-grid"
  >
    <MenuCard
      v-for="menu in menus"
      :key="menu.id"
      :menu="menu"
      @addToCart="$emit('addToCart', $event)"
    />
    <div v-if="menus.length === 0" class="col-span-full text-center text-gray-400 py-12">
      이 카테고리에 메뉴가 없습니다
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Menu } from '@/types'
import MenuCard from './MenuCard.vue'

defineProps<{
  menus: Menu[]
}>()

defineEmits<{
  addToCart: [menu: Menu]
}>()
</script>
