<template>
  <div class="space-y-3">
    <div>
      <label for="category-name" class="block text-sm font-medium text-gray-700 mb-1">
        Category Name
      </label>
      <InputText
        id="category-name"
        v-model="formData.name"
        class="w-full"
        placeholder="Enter category name"
        :class="{ 'p-invalid': errors.name }"
        data-testid="category-form-name-input"
      />
      <small v-if="errors.name" class="text-red-500" data-testid="category-form-name-error">
        {{ errors.name }}
      </small>
    </div>

    <div class="flex gap-2">
      <Button
        label="Save"
        icon="pi pi-check"
        size="small"
        @click="handleSubmit"
        :disabled="!isValid"
        data-testid="category-form-save-button"
      />
      <Button
        label="Cancel"
        icon="pi pi-times"
        severity="secondary"
        size="small"
        @click="$emit('cancel')"
        data-testid="category-form-cancel-button"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, type PropType } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import type { Category, CategoryCreateDto, CategoryUpdateDto } from '@/types';

export default defineComponent({
  name: 'CategoryForm',
  components: {
    InputText,
    Button,
  },
  props: {
    category: {
      type: Object as PropType<Category | undefined>,
      default: undefined,
    },
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const formData = reactive({
      name: props.category?.name || '',
    });

    const errors = reactive({
      name: '',
    });

    const isValid = computed(() => {
      return formData.name.trim().length > 0 && formData.name.trim().length <= 100;
    });

    function validate() {
      errors.name = '';

      if (!formData.name.trim()) {
        errors.name = 'Category name is required';
        return false;
      }

      if (formData.name.trim().length > 100) {
        errors.name = 'Category name must be 100 characters or less';
        return false;
      }

      return true;
    }

    function handleSubmit() {
      if (!validate()) {
        return;
      }

      const data: CategoryCreateDto | CategoryUpdateDto = {
        name: formData.name.trim(),
      };

      emit('submit', data);
    }

    return {
      formData,
      errors,
      isValid,
      handleSubmit,
    };
  },
});
</script>
