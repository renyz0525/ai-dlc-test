<template>
  <div class="flex h-screen bg-gray-50" data-testid="app-layout">
    <SidebarNav />
    <main class="flex-1 overflow-auto p-6">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SidebarNav from '@/components/common/SidebarNav.vue';

export default defineComponent({
  name: 'AppLayout',
  components: { SidebarNav },
});
</script>
