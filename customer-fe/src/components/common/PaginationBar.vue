<template>
  <div
    v-if="totalPages > 1"
    class="flex items-center justify-center gap-2 py-4"
    data-testid="pagination-bar"
  >
    <button
      :disabled="currentPage <= 1"
      class="px-3 py-1 rounded border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      data-testid="pagination-prev"
      @click="$emit('pageChange', currentPage - 1)"
    >
      이전
    </button>
    <span class="text-sm text-gray-600" data-testid="pagination-info">
      {{ currentPage }} / {{ totalPages }}
    </span>
    <button
      :disabled="currentPage >= totalPages"
      class="px-3 py-1 rounded border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      data-testid="pagination-next"
      @click="$emit('pageChange', currentPage + 1)"
    >
      다음
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentPage: number
  totalPages: number
}>()

defineEmits<{
  pageChange: [page: number]
}>()
</script>
