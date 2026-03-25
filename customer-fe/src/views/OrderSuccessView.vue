<template>
  <AppLayout>
    <div class="flex items-center justify-center min-h-[calc(100vh-57px)]" data-testid="order-success-view">
      <div class="text-center p-8">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i class="pi pi-check text-4xl text-green-600"></i>
        </div>
        <h1 class="text-2xl font-bold text-gray-800 mb-2">주문이 완료되었습니다</h1>
        <p class="text-lg text-gray-600 mb-4" data-testid="success-order-number">
          주문번호: {{ orderNumber }}
        </p>
        <p class="text-gray-400" data-testid="success-countdown">
          {{ countdown }}초 후 메뉴 화면으로 이동합니다
        </p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/common/AppLayout.vue'

const route = useRoute()
const router = useRouter()

const orderNumber = ref(route.query.orderNumber as string || '-')
const countdown = ref(5)
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      if (timer) clearInterval(timer)
      router.push('/')
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
