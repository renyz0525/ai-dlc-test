<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100" data-testid="login-view">
    <LoginForm />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LoginForm from '@/components/auth/LoginForm.vue';

export default defineComponent({
  name: 'LoginView',
  components: { LoginForm },
});
</script>
