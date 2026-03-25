<template>
  <AppLayout v-if="isAuthenticated" />
  <router-view v-else />
  <Toast />
  <ConfirmDialog />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import AppLayout from './AppLayout.vue';

export default defineComponent({
  name: 'App',
  components: { AppLayout, Toast, ConfirmDialog },
  setup() {
    const store = useStore();
    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);

    return { isAuthenticated };
  },
});
</script>
