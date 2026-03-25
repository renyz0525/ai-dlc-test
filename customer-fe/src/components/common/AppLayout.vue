<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <CartSlidePanel />
  </div>
</template>

<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import CartSlidePanel from '@/components/cart/CartSlidePanel.vue'
</script>
