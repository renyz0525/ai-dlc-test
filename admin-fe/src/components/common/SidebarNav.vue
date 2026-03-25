<template>
  <aside class="w-64 bg-white border-r border-gray-200 flex flex-col" data-testid="sidebar-nav">
    <div class="p-4 border-b border-gray-200">
      <h1 class="text-xl font-bold text-gray-800" data-testid="sidebar-title">Table Order</h1>
      <p class="text-sm text-gray-500">Admin</p>
    </div>

    <nav class="flex-1 p-4 space-y-1">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="isActive(item.path) ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'"
        :data-testid="`sidebar-nav-${item.id}`"
      >
        <i :class="item.icon" class="text-lg"></i>
        <span>{{ item.label }}</span>
      </router-link>
    </nav>

    <div class="p-4 border-t border-gray-200">
      <button
        class="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        data-testid="sidebar-logout-button"
        @click="handleLogout"
      >
        <i class="pi pi-sign-out text-lg"></i>
        <span>Logout</span>
      </button>
    </div>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  name: 'SidebarNav',
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const navItems = [
      { id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: 'pi pi-th-large' },
      { id: 'tables', path: '/tables', label: 'Tables', icon: 'pi pi-table' },
      { id: 'table-setup', path: '/tables/setup', label: 'Table Setup', icon: 'pi pi-cog' },
      { id: 'menus', path: '/menus', label: 'Menus', icon: 'pi pi-list' },
    ];

    function isActive(path: string): boolean {
      return route.path === path;
    }

    async function handleLogout() {
      store.dispatch('dashboard/disconnectSSE');
      await store.dispatch('auth/logout');
      router.push('/login');
    }

    return { navItems, isActive, handleLogout };
  },
});
</script>
