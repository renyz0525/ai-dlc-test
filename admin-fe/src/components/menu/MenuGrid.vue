<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Menu Cards -->
    <MenuCard
      v-for="(menu, index) in menus"
      :key="menu.id"
      :menu="menu"
      :is-first="index === 0"
      :is-last="index === menus.length - 1"
      @edit="$emit('edit', menu.id)"
      @delete="$emit('delete', menu.id)"
      @move-up="$emit('move-up', menu.id)"
      @move-down="$emit('move-down', menu.id)"
      :data-testid="`menu-card-${menu.id}`"
    />

    <!-- Add Menu Card -->
    <div
      class="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors min-h-[300px]"
      @click="$emit('add')"
      data-testid="add-menu-card"
    >
      <i class="pi pi-plus text-4xl text-gray-400 mb-2"></i>
      <span class="text-gray-600 font-medium">Add Menu Item</span>
    </div>
  </div>

  <div
    v-if="menus.length === 0"
    class="text-center py-12 text-gray-500"
    data-testid="empty-menu-message"
  >
    <i class="pi pi-shopping-bag text-5xl mb-4 block text-gray-300"></i>
    <p class="text-lg">No menu items found</p>
    <p class="text-sm">Click "Add Menu" to create your first menu item</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import MenuCard from './MenuCard.vue';
import type { Menu } from '@/types';

export default defineComponent({
  name: 'MenuGrid',
  components: {
    MenuCard,
  },
  props: {
    menus: {
      type: Array as PropType<Menu[]>,
      required: true,
    },
  },
  emits: ['edit', 'delete', 'move-up', 'move-down', 'add'],
});
</script>
