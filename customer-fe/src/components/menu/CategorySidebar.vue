<template>
  <nav
    class="w-48 bg-white border-r border-gray-200 min-h-full overflow-y-auto"
    data-testid="category-sidebar"
  >
    <ul class="py-2">
      <li v-for="category in categories" :key="category.id">
        <button
          :class="[
            'w-full text-left px-4 py-3 text-sm transition-colors',
            category.id === activeCategoryId
              ? 'bg-blue-50 text-blue-700 font-semibold border-r-2 border-blue-700'
              : 'text-gray-600 hover:bg-gray-50',
          ]"
          :data-testid="`category-item-${category.id}`"
          @click="$emit('selectCategory', category.id)"
        >
          {{ category.name }}
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import type { Category } from '@/types'

defineProps<{
  categories: Category[]
  activeCategoryId: string | null
}>()

defineEmits<{
  selectCategory: [categoryId: string]
}>()
</script>
