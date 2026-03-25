<template>
  <div class="flex h-full bg-gray-50">
    <!-- Category Sidebar -->
    <CategorySidebar
      :categories="sortedCategories"
      :selected-category-id="selectedCategoryId"
      @select="handleCategorySelect"
      @create="handleCreateCategory"
      @update="handleUpdateCategory"
      @delete="handleDeleteCategory"
      data-testid="category-sidebar"
    />

    <!-- Menu Grid -->
    <div class="flex-1 p-6 overflow-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">
          {{ selectedCategoryId ? selectedCategoryName : 'All Menus' }}
        </h1>
        <Button
          label="Add Menu"
          icon="pi pi-plus"
          @click="handleAddMenu"
          data-testid="add-menu-button"
        />
      </div>

      <MenuGrid
        :menus="menusByCategory"
        @edit="handleEditMenu"
        @delete="handleDeleteMenu"
        @move-up="handleMoveUp"
        @move-down="handleMoveDown"
        @add="handleAddMenu"
        data-testid="menu-grid"
      />
    </div>

    <!-- Menu Form Modal -->
    <MenuFormModal
      :visible="isMenuFormVisible"
      :menu="editingMenu"
      :categories="sortedCategories"
      @submit="handleMenuSubmit"
      @close="handleCloseMenuForm"
      data-testid="menu-form-modal"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import CategorySidebar from '@/components/menu/CategorySidebar.vue';
import MenuGrid from '@/components/menu/MenuGrid.vue';
import MenuFormModal from '@/components/menu/MenuFormModal.vue';
import type { Menu, Category, CategoryCreateDto, CategoryUpdateDto } from '@/types';

export default defineComponent({
  name: 'MenuManagementView',
  components: {
    Button,
    CategorySidebar,
    MenuGrid,
    MenuFormModal,
  },
  setup() {
    const store = useStore();
    const toast = useToast();

    const isMenuFormVisible = ref(false);
    const editingMenu = ref<Menu | undefined>(undefined);

    const sortedCategories = computed(() => store.getters['menus/sortedCategories']);
    const menusByCategory = computed(() => store.getters['menus/menusByCategory']);
    const selectedCategoryId = computed(() => store.state.menus.selectedCategoryId);

    const selectedCategoryName = computed(() => {
      const category = sortedCategories.value.find((c: Category) => c.id === selectedCategoryId.value);
      return category?.name || '';
    });

    onMounted(async () => {
      try {
        await Promise.all([
          store.dispatch('menus/fetchCategories'),
          store.dispatch('menus/fetchMenus'),
        ]);
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load menu data',
          life: 3000,
        });
      }
    });

    function handleCategorySelect(categoryId: string | null) {
      store.commit('menus/SET_SELECTED_CATEGORY', categoryId);
    }

    async function handleCreateCategory(data: CategoryCreateDto) {
      try {
        await store.dispatch('menus/createCategory', data);
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Category created successfully',
          life: 3000,
        });
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create category',
          life: 3000,
        });
      }
    }

    async function handleUpdateCategory({ categoryId, data }: { categoryId: string; data: CategoryUpdateDto }) {
      try {
        await store.dispatch('menus/updateCategory', { categoryId, data });
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Category updated successfully',
          life: 3000,
        });
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update category',
          life: 3000,
        });
      }
    }

    async function handleDeleteCategory(categoryId: string) {
      try {
        await store.dispatch('menus/deleteCategory', categoryId);
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Category deleted successfully',
          life: 3000,
        });
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete category',
          life: 3000,
        });
      }
    }

    function handleAddMenu() {
      editingMenu.value = undefined;
      isMenuFormVisible.value = true;
    }

    function handleEditMenu(menuId: string) {
      const menu = menusByCategory.value.find((m: Menu) => m.id === menuId);
      if (menu) {
        editingMenu.value = menu;
        isMenuFormVisible.value = true;
      }
    }

    async function handleDeleteMenu(menuId: string) {
      try {
        await store.dispatch('menus/deleteMenu', menuId);
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Menu deleted successfully',
          life: 3000,
        });
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete menu',
          life: 3000,
        });
      }
    }

    async function handleMoveUp(menuId: string) {
      const menus = menusByCategory.value;
      const index = menus.findIndex((m: Menu) => m.id === menuId);
      if (index > 0) {
        const reordered = [...menus];
        [reordered[index - 1], reordered[index]] = [reordered[index], reordered[index - 1]];
        await updateMenuOrder(reordered.map((m: Menu) => m.id));
      }
    }

    async function handleMoveDown(menuId: string) {
      const menus = menusByCategory.value;
      const index = menus.findIndex((m: Menu) => m.id === menuId);
      if (index < menus.length - 1) {
        const reordered = [...menus];
        [reordered[index], reordered[index + 1]] = [reordered[index + 1], reordered[index]];
        await updateMenuOrder(reordered.map((m: Menu) => m.id));
      }
    }

    async function updateMenuOrder(menuIds: string[]) {
      try {
        await store.dispatch('menus/updateMenuOrder', menuIds);
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Menu order updated',
          life: 3000,
        });
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update menu order',
          life: 3000,
        });
      }
    }

    async function handleMenuSubmit(formData: FormData) {
      try {
        if (editingMenu.value) {
          await store.dispatch('menus/updateMenu', { menuId: editingMenu.value.id, formData });
          toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Menu updated successfully',
            life: 3000,
          });
        } else {
          await store.dispatch('menus/createMenu', formData);
          toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Menu created successfully',
            life: 3000,
          });
        }
        isMenuFormVisible.value = false;
        editingMenu.value = undefined;
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: editingMenu.value ? 'Failed to update menu' : 'Failed to create menu',
          life: 3000,
        });
      }
    }

    function handleCloseMenuForm() {
      isMenuFormVisible.value = false;
      editingMenu.value = undefined;
    }

    return {
      sortedCategories,
      menusByCategory,
      selectedCategoryId,
      selectedCategoryName,
      isMenuFormVisible,
      editingMenu,
      handleCategorySelect,
      handleCreateCategory,
      handleUpdateCategory,
      handleDeleteCategory,
      handleAddMenu,
      handleEditMenu,
      handleDeleteMenu,
      handleMoveUp,
      handleMoveDown,
      handleMenuSubmit,
      handleCloseMenuForm,
    };
  },
});
</script>
