<template>
  <Dialog
    :visible="visible"
    :header="menu ? 'Edit Menu Item' : 'Add Menu Item'"
    :modal="true"
    :closable="true"
    :style="{ width: '600px' }"
    @update:visible="handleClose"
    data-testid="menu-form-modal"
  >
    <div class="space-y-4 py-4">
      <!-- Name -->
      <div>
        <label for="menu-name" class="block text-sm font-medium text-gray-700 mb-1">
          Menu Name <span class="text-red-500">*</span>
        </label>
        <InputText
          id="menu-name"
          v-model="formData.name"
          class="w-full"
          placeholder="Enter menu name"
          :class="{ 'p-invalid': errors.name }"
          data-testid="menu-form-name-input"
        />
        <small v-if="errors.name" class="text-red-500" data-testid="menu-form-name-error">
          {{ errors.name }}
        </small>
      </div>

      <!-- Price -->
      <div>
        <label for="menu-price" class="block text-sm font-medium text-gray-700 mb-1">
          Price <span class="text-red-500">*</span>
        </label>
        <InputNumber
          id="menu-price"
          v-model="formData.price"
          mode="currency"
          currency="USD"
          locale="en-US"
          :min="0.01"
          :max="10000"
          :min-fraction-digits="2"
          :max-fraction-digits="2"
          class="w-full"
          placeholder="0.00"
          :class="{ 'p-invalid': errors.price }"
          data-testid="menu-form-price-input"
        />
        <small v-if="errors.price" class="text-red-500" data-testid="menu-form-price-error">
          {{ errors.price }}
        </small>
      </div>

      <!-- Description -->
      <div>
        <label for="menu-description" class="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <Textarea
          id="menu-description"
          v-model="formData.description"
          rows="4"
          class="w-full"
          placeholder="Enter menu description"
          :class="{ 'p-invalid': errors.description }"
          data-testid="menu-form-description-input"
        />
        <small v-if="errors.description" class="text-red-500" data-testid="menu-form-description-error">
          {{ errors.description }}
        </small>
      </div>

      <!-- Category -->
      <div>
        <label for="menu-category" class="block text-sm font-medium text-gray-700 mb-1">
          Category <span class="text-red-500">*</span>
        </label>
        <Dropdown
          id="menu-category"
          v-model="formData.categoryId"
          :options="categories"
          option-label="name"
          option-value="id"
          placeholder="Select a category"
          class="w-full"
          :class="{ 'p-invalid': errors.categoryId }"
          data-testid="menu-form-category-dropdown"
        />
        <small v-if="errors.categoryId" class="text-red-500" data-testid="menu-form-category-error">
          {{ errors.categoryId }}
        </small>
      </div>

      <!-- Image Upload -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Image</label>
        <ImageUploader
          :current-image-url="menu?.imageUrl ?? undefined"
          @change="handleImageChange"
          data-testid="menu-form-image-uploader"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button
          label="Cancel"
          severity="secondary"
          @click="handleClose"
          data-testid="menu-form-cancel-button"
        />
        <Button
          :label="menu ? 'Update' : 'Create'"
          @click="handleSubmit"
          :disabled="!isValid"
          data-testid="menu-form-submit-button"
        />
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, watch, ref, type PropType } from 'vue';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import ImageUploader from './ImageUploader.vue';
import type { Menu, Category } from '@/types';

export default defineComponent({
  name: 'MenuFormModal',
  components: {
    Dialog,
    InputText,
    InputNumber,
    Textarea,
    Dropdown,
    Button,
    ImageUploader,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    menu: {
      type: Object as PropType<Menu | undefined>,
      default: undefined,
    },
    categories: {
      type: Array as PropType<Category[]>,
      required: true,
    },
  },
  emits: ['submit', 'close'],
  setup(props, { emit }) {
    const imageFile = ref<File | null>(null);

    const formData = reactive({
      name: '',
      price: null as number | null,
      description: '',
      categoryId: '',
    });

    const errors = reactive({
      name: '',
      price: '',
      description: '',
      categoryId: '',
    });

    // Initialize form with menu data when editing
    watch(
      () => props.menu,
      (menu) => {
        if (menu) {
          formData.name = menu.name;
          formData.price = menu.price / 100; // Convert cents to dollars
          formData.description = menu.description;
          formData.categoryId = menu.categoryId;
        } else {
          resetForm();
        }
        imageFile.value = null;
      },
      { immediate: true }
    );

    const isValid = computed(() => {
      return (
        formData.name.trim().length > 0 &&
        formData.name.trim().length <= 100 &&
        formData.price !== null &&
        formData.price > 0 &&
        formData.price <= 10000 &&
        formData.categoryId !== ''
      );
    });

    function resetForm() {
      formData.name = '';
      formData.price = null;
      formData.description = '';
      formData.categoryId = '';
      imageFile.value = null;
      clearErrors();
    }

    function clearErrors() {
      errors.name = '';
      errors.price = '';
      errors.description = '';
      errors.categoryId = '';
    }

    function validate(): boolean {
      clearErrors();
      let isFormValid = true;

      // Name validation
      if (!formData.name.trim()) {
        errors.name = 'Menu name is required';
        isFormValid = false;
      } else if (formData.name.trim().length > 100) {
        errors.name = 'Menu name must be 100 characters or less';
        isFormValid = false;
      }

      // Price validation
      if (formData.price === null || formData.price <= 0) {
        errors.price = 'Price must be greater than 0';
        isFormValid = false;
      } else if (formData.price > 10000) {
        errors.price = 'Price must be 10,000 or less';
        isFormValid = false;
      }

      // Category validation
      if (!formData.categoryId) {
        errors.categoryId = 'Category is required';
        isFormValid = false;
      }

      return isFormValid;
    }

    function handleImageChange(file: File | null) {
      imageFile.value = file;
    }

    function handleSubmit() {
      if (!validate()) {
        return;
      }

      const formDataObj = new FormData();
      formDataObj.append('name', formData.name.trim());
      formDataObj.append('price', String(Math.round(formData.price! * 100))); // Convert dollars to cents
      formDataObj.append('description', formData.description.trim());
      formDataObj.append('categoryId', formData.categoryId);

      if (imageFile.value) {
        formDataObj.append('image', imageFile.value);
      }

      emit('submit', formDataObj);
    }

    function handleClose() {
      resetForm();
      emit('close');
    }

    return {
      formData,
      errors,
      isValid,
      handleImageChange,
      handleSubmit,
      handleClose,
    };
  },
});
</script>
