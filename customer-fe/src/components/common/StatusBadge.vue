<template>
  <span
    :class="badgeClass"
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    data-testid="status-badge"
  >
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { OrderStatus } from '@/types'

const props = defineProps<{
  status: OrderStatus
}>()

const badgeClass = computed(() => {
  switch (props.status) {
    case 'WAITING':
      return 'bg-orange-100 text-orange-800'
    case 'PREPARING':
      return 'bg-blue-100 text-blue-800'
    case 'COMPLETED':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
})

const label = computed(() => {
  switch (props.status) {
    case 'WAITING':
      return '대기중'
    case 'PREPARING':
      return '준비중'
    case 'COMPLETED':
      return '완료'
    default:
      return props.status
  }
})
</script>
