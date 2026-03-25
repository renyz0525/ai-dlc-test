<template>
  <AppLayout>
    <div class="flex h-[calc(100vh-57px)]" data-testid="menu-view">
      <CategorySidebar
        v-if="!isMobile"
        :categories="sortedCategories"
        :activeCategoryId="activeCategoryId"
        @selectCategory="setCategory"
      />

      <div class="flex-1 overflow-y-auto">
        <CategoryDropdown
          v-if="isMobile"
          :categories="sortedCategories"
          :activeCategoryId="activeCategoryId"
          @selectCategory="setCategory"
        />

        <div v-if="isLoading" class="flex items-center justify-center py-20">
          <i class="pi pi-spin pi-spinner text-3xl text-blue-500"></i>
        </div>

        <div v-else-if="error" class="text-center text-red-500 py-20">
          <p>{{ error }}</p>
          <button class="mt-4 text-blue-500 underline" @click="loadMenus">다시 시도</button>
        </div>

        <MenuGrid
          v-else
          :menus="filteredMenus"
          @addToCart="handleAddToCart"
        />
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useToast } from 'primevue/usetoast'
import { useBreakpoint } from '@/composables/useBreakpoint'
import type { Menu } from '@/types'
import AppLayout from '@/components/common/AppLayout.vue'
import CategorySidebar from '@/components/menu/CategorySidebar.vue'
import CategoryDropdown from '@/components/menu/CategoryDropdown.vue'
import MenuGrid from '@/components/menu/MenuGrid.vue'

const store = useStore()
const toast = useToast()
const { isMobile } = useBreakpoint()

const sortedCategories = computed(() => store.getters['menu/sortedCategories'])
const filteredMenus = computed(() => store.getters['menu/filteredMenus'])
const activeCategoryId = computed(() => store.state.menu.activeCategoryId)
const isLoading = computed(() => store.state.menu.isLoading)
const error = computed(() => store.state.menu.error)

function setCategory(categoryId: string) {
  store.dispatch('menu/setActiveCategory', categoryId)
}

function handleAddToCart(menu: Menu) {
  store.dispatch('cart/addItem', menu)
  toast.add({
    severity: 'info',
    summary: '장바구니 추가',
    detail: `${menu.name} 1개가 추가되었습니다`,
    life: 2000,
  })
}

function loadMenus() {
  store.dispatch('menu/fetchMenus')
}

onMounted(() => {
  if (store.state.menu.menus.length === 0) {
    loadMenus()
  }
})
</script>
