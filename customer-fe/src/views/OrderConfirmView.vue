<template>
  <AppLayout>
    <div class="max-w-lg mx-auto p-4" data-testid="order-confirm-view">
      <h1 class="text-xl font-bold mb-6">주문 확인</h1>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <OrderSummaryList :items="cartItems" />

        <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <span class="text-lg font-bold">총 금액</span>
          <span class="text-lg font-bold text-blue-600" data-testid="confirm-total">
            {{ formatPrice(total) }}
          </span>
        </div>
      </div>

      <p v-if="error" class="text-red-500 text-sm mb-4" data-testid="confirm-error">{{ error }}</p>

      <div class="flex gap-3">
        <Button
          label="돌아가기"
          severity="secondary"
          outlined
          class="flex-1"
          data-testid="confirm-back-button"
          @click="goBack"
        />
        <Button
          label="주문 확정"
          class="flex-1"
          :loading="isSubmitting"
          data-testid="confirm-submit-button"
          @click="submitOrder"
        />
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import AppLayout from '@/components/common/AppLayout.vue'
import OrderSummaryList from '@/components/order/OrderSummaryList.vue'
import { formatPrice } from '@/utils/format'
import type { OrderCreateDto } from '@/types'

const store = useStore()
const router = useRouter()

const cartItems = computed(() => store.state.cart.items)
const total = computed(() => store.getters['cart/total'])

const isSubmitting = ref(false)
const error = ref<string | null>(null)

onMounted(() => {
  if (store.getters['cart/isEmpty']) {
    router.push('/')
  }
})

function goBack() {
  router.push('/')
}

async function submitOrder() {
  isSubmitting.value = true
  error.value = null

  try {
    const dto: OrderCreateDto = {
      items: cartItems.value.map((item) => ({
        menuId: item.menuId,
        menuName: item.menuName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      totalAmount: total.value,
    }

    const order = await store.dispatch('order/createOrder', dto)
    await store.dispatch('cart/clearCart')

    router.push({
      name: 'OrderSuccess',
      query: { orderNumber: order.orderNumber },
    })
  } catch (e) {
    error.value = e instanceof Error ? e.message : '주문에 실패했습니다. 다시 시도해주세요.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
