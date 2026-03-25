<template>
  <div class="flex flex-col gap-1 bg-white rounded shadow-md p-1">
    <Button
      icon="pi pi-chevron-up"
      size="small"
      severity="secondary"
      :disabled="isFirst"
      @click="$emit('move-up')"
      data-testid="menu-sort-up-button"
    />
    <Button
      icon="pi pi-chevron-down"
      size="small"
      severity="secondary"
      :disabled="isLast"
      @click="$emit('move-down')"
      data-testid="menu-sort-down-button"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from 'primevue/button';

export default defineComponent({
  name: 'MenuSortControls',
  components: {
    Button,
  },
  props: {
    isFirst: {
      type: Boolean,
      default: false,
    },
    isLast: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['move-up', 'move-down'],
});
</script>
