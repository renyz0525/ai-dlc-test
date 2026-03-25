<template>
  <div class="px-4 py-2" data-testid="category-dropdown">
    <select
      :value="activeCategoryId"
      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
      data-testid="category-dropdown-select"
      @change="onSelect"
    >
      <option v-for="category in categories" :key="category.id" :value="category.id">
        {{ category.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '@/types'

defineProps<{
  categories: Category[]
  activeCategoryId: string | null
}>()

const emit = defineEmits<{
  selectCategory: [categoryId: string]
}>()

function onSelect(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('selectCategory', target.value)
}
</script>
