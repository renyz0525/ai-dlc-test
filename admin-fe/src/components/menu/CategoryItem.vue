<template>
  <div
    class="group px-4 py-3 cursor-pointer transition-colors flex items-center justify-between"
    :class="isSelected ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'"
    @click="$emit('select', category.id)"
    :data-testid="`category-item-${category.id}`"
  >
    <span class="font-medium truncate flex-1">{{ category.name }}</span>

    <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        icon="pi pi-pencil"
        severity="secondary"
        text
        size="small"
        @click.stop="$emit('edit', category)"
        :data-testid="`category-edit-button-${category.id}`"
      />
      <Button
        icon="pi pi-trash"
        severity="danger"
        text
        size="small"
        @click.stop="$emit('delete', category.id)"
        :data-testid="`category-delete-button-${category.id}`"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import Button from 'primevue/button';
import type { Category } from '@/types';

export default defineComponent({
  name: 'CategoryItem',
  components: {
    Button,
  },
  props: {
    category: {
      type: Object as PropType<Category>,
      required: true,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['select', 'edit', 'delete'],
});
</script>
