<template>
  <div class="w-64 bg-white border-r border-gray-200 flex flex-col">
    <div class="p-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-800">Categories</h2>
    </div>

    <div class="flex-1 overflow-y-auto">
      <!-- All Categories Option -->
      <div
        class="px-4 py-3 cursor-pointer transition-colors"
        :class="selectedCategoryId === null ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'"
        @click="handleSelect(null)"
        data-testid="category-all"
      >
        <span class="font-medium">All</span>
      </div>

      <!-- Category List -->
      <CategoryItem
        v-for="category in categories"
        :key="category.id"
        :category="category"
        :is-selected="category.id === selectedCategoryId"
        @select="handleSelect"
        @edit="handleEdit"
        @delete="handleDelete"
        :data-testid="`category-item-${category.id}`"
      />
    </div>

    <!-- Add Category Section -->
    <div class="p-4 border-t border-gray-200">
      <CategoryForm
        v-if="isAddingCategory"
        @submit="handleCreateSubmit"
        @cancel="handleCancelAdd"
        data-testid="category-form-add"
      />
      <Button
        v-else
        label="Add Category"
        icon="pi pi-plus"
        class="w-full"
        size="small"
        @click="isAddingCategory = true"
        data-testid="add-category-button"
      />
    </div>

    <!-- Edit Category Dialog -->
    <Dialog
      v-model:visible="isEditDialogVisible"
      header="Edit Category"
      :modal="true"
      :style="{ width: '400px' }"
      data-testid="category-edit-dialog"
    >
      <CategoryForm
        v-if="editingCategory"
        :category="editingCategory"
        @submit="handleEditSubmit"
        @cancel="handleCancelEdit"
        data-testid="category-form-edit"
      />
    </Dialog>

    <!-- Confirm Dialog -->
    <ConfirmDialog data-testid="category-confirm-dialog" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, type PropType } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import ConfirmDialog from 'primevue/confirmdialog';
import CategoryItem from './CategoryItem.vue';
import CategoryForm from './CategoryForm.vue';
import type { Category, CategoryCreateDto, CategoryUpdateDto } from '@/types';

export default defineComponent({
  name: 'CategorySidebar',
  components: {
    Button,
    Dialog,
    ConfirmDialog,
    CategoryItem,
    CategoryForm,
  },
  props: {
    categories: {
      type: Array as PropType<Category[]>,
      required: true,
    },
    selectedCategoryId: {
      type: String as PropType<string | null>,
      default: null,
    },
  },
  emits: ['select', 'create', 'update', 'delete'],
  setup(_props, { emit }) {
    const confirm = useConfirm();
    const isAddingCategory = ref(false);
    const isEditDialogVisible = ref(false);
    const editingCategory = ref<Category | null>(null);

    function handleSelect(categoryId: string | null) {
      emit('select', categoryId);
    }

    function handleEdit(category: Category) {
      editingCategory.value = category;
      isEditDialogVisible.value = true;
    }

    function handleDelete(categoryId: string) {
      confirm.require({
        message: 'Are you sure you want to delete this category? All menus in this category will also be deleted.',
        header: 'Delete Category',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
        accept: () => {
          emit('delete', categoryId);
        },
      });
    }

    function handleCreateSubmit(data: CategoryCreateDto) {
      emit('create', data);
      isAddingCategory.value = false;
    }

    function handleCancelAdd() {
      isAddingCategory.value = false;
    }

    function handleEditSubmit(data: CategoryUpdateDto) {
      if (editingCategory.value) {
        emit('update', { categoryId: editingCategory.value.id, data });
        isEditDialogVisible.value = false;
        editingCategory.value = null;
      }
    }

    function handleCancelEdit() {
      isEditDialogVisible.value = false;
      editingCategory.value = null;
    }

    return {
      isAddingCategory,
      isEditDialogVisible,
      editingCategory,
      handleSelect,
      handleEdit,
      handleDelete,
      handleCreateSubmit,
      handleCancelAdd,
      handleEditSubmit,
      handleCancelEdit,
    };
  },
});
</script>
