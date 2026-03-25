<template>
  <header class="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between"
          data-testid="app-header">
    <div class="flex items-center gap-2">
      <span class="text-lg font-bold text-gray-800" data-testid="header-title">Table Order</span>
      <span v-if="tableNumber" class="text-sm text-gray-500">
        테이블 {{ tableNumber }}
      </span>
    </div>
    <div class="flex items-center gap-3">
      <router-link
        to="/orders"
        class="text-gray-600 hover:text-gray-800 p-2"
        data-testid="header-orders-link"
      >
        <i class="pi pi-list text-xl"></i>
      </router-link>
      <button
        class="relative p-2 text-gray-600 hover:text-gray-800"
        data-testid="header-cart-button"
        @click="toggleCart"
      >
        <i class="pi pi-shopping-cart text-xl"></i>
        <span
          v-if="cartItemCount > 0"
          class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
          data-testid="header-cart-badge"
        >
          {{ cartItemCount > 99 ? '99+' : cartItemCount }}
        </span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const tableNumber = computed(() => store.state.auth.tableNumber)
const cartItemCount = computed(() => store.getters['cart/itemCount'])

function toggleCart() {
  store.dispatch('ui/toggleCartPanel')
}
</script>
