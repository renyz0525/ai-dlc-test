<template>
  <Sidebar
    v-model:visible="isOpen"
    position="right"
    :header="'장바구니'"
    class="w-full md:w-[400px]"
    data-testid="cart-slide-panel"
  >
    <div class="flex flex-col h-full">
      <div v-if="isEmpty" class="flex-1 flex items-center justify-center text-gray-400">
        <div class="text-center">
          <i class="pi pi-shopping-cart text-4xl mb-2"></i>
          <p>장바구니가 비어있습니다</p>
        </div>
      </div>

      <div v-else class="flex-1 overflow-y-auto">
        <CartItemCard
          v-for="item in items"
          :key="item.menuId"
          :item="item"
          @updateQuantity="handleUpdateQuantity"
          @remove="handleRemove"
        />
      </div>

      <div v-if="!isEmpty" class="border-t border-gray-200 pt-4 mt-4 space-y-3">
        <div class="flex justify-between items-center text-lg font-bold">
          <span>총 금액</span>
          <span class="text-blue-600" data-testid="cart-total">{{ formatPrice(total) }}</span>
        </div>
        <div class="flex gap-2">
          <Button
            label="비우기"
            severity="secondary"
            outlined
            class="flex-1"
            data-testid="cart-clear-button"
            @click="handleClear"
          />
          <Button
            label="주문하기"
            class="flex-1"
            data-testid="cart-order-button"
            @click="handleOrder"
          />
        </div>
      </div>
    </div>
  </Sidebar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Sidebar from 'primevue/sidebar'
import Button from 'primevue/button'
import CartItemCard from './CartItemCard.vue'
import { formatPrice } from '@/utils/format'

const store = useStore()
const router = useRouter()

const isOpen = computed({
  get: () => store.state.ui.cartPanelOpen,
  set: (value: boolean) => store.commit('ui/SET_CART_PANEL', value),
})

const items = computed(() => store.state.cart.items)
const total = computed(() => store.getters['cart/total'])
const isEmpty = computed(() => store.getters['cart/isEmpty'])

function handleUpdateQuantity(menuId: string, quantity: number) {
  store.dispatch('cart/updateQuantity', { menuId, quantity })
}

function handleRemove(menuId: string) {
  store.dispatch('cart/removeItem', menuId)
}

function handleClear() {
  store.dispatch('cart/clearCart')
}

function handleOrder() {
  store.dispatch('ui/closeCartPanel')
  router.push('/order/confirm')
}
</script>
