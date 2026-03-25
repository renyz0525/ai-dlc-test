<template>
  <form @submit.prevent="handleSubmit" class="space-y-4" data-testid="table-setup-form">
    <div>
      <label for="tableNumber" class="block text-sm font-medium text-gray-700 mb-1">
        Table Number
      </label>
      <InputNumber
        id="tableNumber"
        v-model="form.tableNumber"
        class="w-full"
        :min="1"
        placeholder="Enter table number"
        :disabled="isSubmitting"
        data-testid="table-number-input"
      />
      <small v-if="errors.tableNumber" class="text-red-600" data-testid="table-number-error">
        {{ errors.tableNumber }}
      </small>
    </div>

    <div>
      <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
        Password
      </label>
      <Password
        id="password"
        v-model="form.password"
        class="w-full"
        :feedback="false"
        toggle-mask
        placeholder="Enter password (min 4 characters)"
        :disabled="isSubmitting"
        data-testid="password-input"
      />
      <small v-if="errors.password" class="text-red-600" data-testid="password-error">
        {{ errors.password }}
      </small>
    </div>

    <div>
      <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
        Confirm Password
      </label>
      <Password
        id="confirmPassword"
        v-model="form.confirmPassword"
        class="w-full"
        :feedback="false"
        toggle-mask
        placeholder="Re-enter password"
        :disabled="isSubmitting"
        data-testid="confirm-password-input"
      />
      <small v-if="errors.confirmPassword" class="text-red-600" data-testid="confirm-password-error">
        {{ errors.confirmPassword }}
      </small>
    </div>

    <Button
      type="submit"
      label="Setup Table"
      class="w-full"
      :loading="isSubmitting"
      :disabled="!isFormValid"
      data-testid="submit-button"
    />
  </form>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed } from 'vue';
import InputNumber from 'primevue/inputnumber';
import Password from 'primevue/password';
import Button from 'primevue/button';
import type { TableSetupDto } from '@/types';

export default defineComponent({
  name: 'TableSetupForm',
  components: {
    InputNumber,
    Password,
    Button,
  },
  emits: ['submit'],
  setup(_props, { emit }) {
    const form = reactive({
      tableNumber: null as number | null,
      password: '',
      confirmPassword: '',
    });

    const errors = reactive({
      tableNumber: '',
      password: '',
      confirmPassword: '',
    });

    const isSubmitting = ref(false);

    const validateForm = (): boolean => {
      let isValid = true;

      // Reset errors
      errors.tableNumber = '';
      errors.password = '';
      errors.confirmPassword = '';

      // Validate table number
      if (!form.tableNumber || form.tableNumber <= 0) {
        errors.tableNumber = 'Table number must be greater than 0';
        isValid = false;
      }

      // Validate password
      if (form.password.length < 4) {
        errors.password = 'Password must be at least 4 characters';
        isValid = false;
      }

      // Validate password match
      if (form.password !== form.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }

      return isValid;
    };

    const isFormValid = computed(() => {
      return (
        form.tableNumber !== null &&
        form.tableNumber > 0 &&
        form.password.length >= 4 &&
        form.password === form.confirmPassword
      );
    });

    const handleSubmit = async () => {
      if (!validateForm() || !form.tableNumber) return;

      isSubmitting.value = true;

      try {
        const data: TableSetupDto = {
          tableNumber: form.tableNumber,
          password: form.password,
        };

        emit('submit', data);

        // Reset form on success
        form.tableNumber = null;
        form.password = '';
        form.confirmPassword = '';
      } catch (error) {
        // Error handling is done in parent component
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      form,
      errors,
      isSubmitting,
      isFormValid,
      handleSubmit,
    };
  },
});
</script>
