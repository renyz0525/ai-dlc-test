<template>
  <AppLayout>
    <div class="max-w-2xl mx-auto p-4" data-testid="order-history-view">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-xl font-bold">주문 내역</h1>
        <router-link
          to="/"
          class="text-blue-500 text-sm hover:underline"
          data-testid="history-back-link"
        >
          메뉴로 돌아가기
        </router-link>
      </div>

      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <i class="pi pi-spin pi-spinner text-3xl text-blue-500"></i>
      </div>

      <div v-else-if="error" class="text-center text-red-500 py-20">
        <p>{{ error }}</p>
        <button class="mt-4 text-blue-500 underline" @click="loadOrders(1)">다시 시도</button>
      </div>

      <div v-else-if="orders.length === 0" class="text-center text-gray-400 py-20">
        <i class="pi pi-inbox text-4xl mb-2"></i>
        <p>주문 내역이 없습니다</p>
      </div>

      <div v-else class="space-y-3">
        <OrderCard v-for="order in orders" :key="order.id" :order="order" />
      </div>

      <PaginationBar
        :currentPage="currentPage"
        :totalPages="totalPages"
        @pageChange="loadOrders"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import AppLayout from '@/components/common/AppLayout.vue'
import OrderCard from '@/components/order/OrderCard.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'

const store = useStore()

const orders = computed(() => store.getters['order/sortedOrders'])
const currentPage = computed(() => store.state.order.currentPage)
const totalPages = computed(() => store.state.order.totalPages)
const isLoading = computed(() => store.state.order.isLoading)
const error = computed(() => store.state.order.error)

function loadOrders(page: number) {
  store.dispatch('order/fetchOrders', page)
}

onMounted(() => {
  loadOrders(1)
  store.dispatch('sse/connect')
})

onUnmounted(() => {
  store.dispatch('sse/disconnect')
})
</script>
