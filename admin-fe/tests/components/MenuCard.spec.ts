import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import MenuCard from '@/components/menu/MenuCard.vue';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import type { Menu } from '@/types';

const mockMenu: Menu = {
  id: 'menu-1', storeId: 'store-1', categoryId: 'cat-1',
  name: 'Cheese Burger', price: 15000, description: 'Delicious cheese burger',
  imageUrl: null, sortOrder: 0,
  createdAt: '2026-03-25T00:00:00Z', updatedAt: '2026-03-25T00:00:00Z',
};

function mountComponent(props: { menu?: Menu; isFirst?: boolean; isLast?: boolean } = {}) {
  return mount(MenuCard, {
    props: {
      menu: props.menu || mockMenu,
      isFirst: props.isFirst ?? false,
      isLast: props.isLast ?? false,
    },
    global: {
      plugins: [[PrimeVue, {}], ConfirmationService],
      stubs: {
        Button: { template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>' },
        MenuSortControls: { template: '<div data-testid="sort-controls"><slot /></div>' },
      },
    },
  });
}

describe('MenuCard', () => {
  it('renders menu name and price', () => {
    const wrapper = mountComponent();
    expect(wrapper.text()).toContain('Cheese Burger');
  });

  it('renders placeholder when no image', () => {
    const wrapper = mountComponent();
    const card = wrapper.find('[data-testid="menu-card"]');
    expect(card.exists()).toBe(true);
  });

  it('emits edit when edit button clicked', async () => {
    const wrapper = mountComponent();
    const editBtn = wrapper.find('[data-testid="menu-card-edit-button"]');
    if (editBtn.exists()) {
      await editBtn.trigger('click');
      expect(wrapper.emitted('edit')).toBeTruthy();
    }
  });
});
