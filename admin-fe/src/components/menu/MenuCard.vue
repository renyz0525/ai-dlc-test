<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    data-testid="menu-card"
  >
    <!-- Image -->
    <div class="relative h-48 bg-gray-200">
      <img
        v-if="menu.imageUrl"
        :src="menu.imageUrl"
        :alt="menu.name"
        class="w-full h-full object-cover"
        data-testid="menu-card-image"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center text-gray-400"
        data-testid="menu-card-placeholder"
      >
        <i class="pi pi-image text-6xl"></i>
      </div>

      <!-- Sort Controls -->
      <div class="absolute top-2 right-2">
        <MenuSortControls
          :is-first="isFirst"
          :is-last="isLast"
          @move-up="$emit('move-up')"
          @move-down="$emit('move-down')"
          data-testid="menu-card-sort-controls"
        />
      </div>
    </div>

    <!-- Content -->
    <div class="p-4">
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-lg font-semibold text-gray-800 truncate flex-1" data-testid="menu-card-name">
          {{ menu.name }}
        </h3>
        <span class="text-lg font-bold text-blue-600 ml-2" data-testid="menu-card-price">
          ${{ formatPrice(menu.price) }}
        </span>
      </div>

      <p
        class="text-sm text-gray-600 line-clamp-2 mb-4"
        data-testid="menu-card-description"
      >
        {{ menu.description }}
      </p>

      <!-- Actions -->
      <div class="flex gap-2">
        <Button
          label="Edit"
          icon="pi pi-pencil"
          size="small"
          class="flex-1"
          @click="$emit('edit')"
          data-testid="menu-card-edit-button"
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          size="small"
          @click="handleDelete"
          data-testid="menu-card-delete-button"
        />
      </div>
    </div>

    <!-- Confirm Dialog -->
    <ConfirmDialog data-testid="menu-card-confirm-dialog" />
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import MenuSortControls from './MenuSortControls.vue';
import type { Menu } from '@/types';

export default defineComponent({
  name: 'MenuCard',
  components: {
    Button,
    ConfirmDialog,
    MenuSortControls,
  },
  props: {
    menu: {
      type: Object as PropType<Menu>,
      required: true,
    },
    isFirst: {
      type: Boolean,
      default: false,
    },
    isLast: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['edit', 'delete', 'move-up', 'move-down'],
  setup(props, { emit }) {
    const confirm = useConfirm();

    function formatPrice(price: number): string {
      return (price / 100).toFixed(2);
    }

    function handleDelete() {
      confirm.require({
        message: `Are you sure you want to delete "${props.menu.name}"?`,
        header: 'Delete Menu Item',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
        accept: () => {
          emit('delete');
        },
      });
    }

    return {
      formatPrice,
      handleDelete,
    };
  },
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
