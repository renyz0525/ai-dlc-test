<template>
  <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8" data-testid="login-form">
    <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>

    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label for="storeId" class="block text-sm font-medium text-gray-700 mb-1">Store ID</label>
        <InputText
          id="storeId"
          v-model="form.storeId"
          class="w-full"
          placeholder="Store ID"
          :disabled="isLocked || isLoading"
          data-testid="login-form-store-id"
        />
      </div>

      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <InputText
          id="username"
          v-model="form.username"
          class="w-full"
          placeholder="Username"
          :disabled="isLocked || isLoading"
          data-testid="login-form-username"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <InputText
          id="password"
          v-model="form.password"
          type="password"
          class="w-full"
          placeholder="Password"
          :disabled="isLocked || isLoading"
          data-testid="login-form-password"
        />
      </div>

      <div v-if="errorMessage" class="text-red-600 text-sm" data-testid="login-form-error">
        {{ errorMessage }}
      </div>

      <div v-if="isLocked" class="text-orange-600 text-sm" data-testid="login-form-locked">
        Too many failed attempts. Please try again later.
      </div>

      <Button
        type="submit"
        label="Login"
        class="w-full"
        :loading="isLoading"
        :disabled="isLocked || !isFormValid"
        data-testid="login-form-submit-button"
      />
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

export default defineComponent({
  name: 'LoginForm',
  components: { InputText, Button },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const form = reactive({ storeId: '', username: '', password: '' });
    const errorMessage = ref('');
    const isLoading = ref(false);

    const isLocked = computed(() => store.getters['auth/isLocked']);
    const isFormValid = computed(() => form.storeId.trim() !== '' && form.username.trim() !== '' && form.password.trim() !== '');

    async function handleLogin() {
      if (!isFormValid.value || isLocked.value) return;

      errorMessage.value = '';
      isLoading.value = true;

      try {
        await store.dispatch('auth/login', {
          storeId: form.storeId.trim(),
          username: form.username.trim(),
          password: form.password,
        });

        const redirect = (route.query.redirect as string) || '/dashboard';
        router.push(redirect);
      } catch (error) {
        errorMessage.value = error instanceof Error ? error.message : 'Login failed. Please check your credentials.';
      } finally {
        isLoading.value = false;
      }
    }

    return { form, errorMessage, isLoading, isLocked, isFormValid, handleLogin };
  },
});
</script>
