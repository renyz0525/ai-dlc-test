import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TableCard from '@/components/dashboard/TableCard.vue';
import PrimeVue from 'primevue/config';
import type { TableCard as TableCardType } from '@/types';

const mockTableCard: TableCardType = {
  table: { id: 'table-1', storeId: 'store-1', tableNumber: 1, currentSessionId: 'session-1', createdAt: '2026-03-25T00:00:00Z' },
  orders: [
    {
      id: 'order-1', storeId: 'store-1', tableId: 'table-1', sessionId: 'session-1',
      status: 'pending', totalAmount: 25000,
      items: [{ id: 'i1', orderId: 'order-1', menuId: 'm1', menuName: 'Burger', quantity: 1, unitPrice: 25000 }],
      acknowledgedAt: null, createdAt: '2026-03-25T10:00:00Z', updatedAt: '2026-03-25T10:00:00Z',
    },
  ],
  totalAmount: 25000,
  latestOrder: null,
  hasUnacknowledged: false,
  hasAlert: false,
};

function mountComponent(props: Partial<TableCardType> = {}) {
  const tableCard = { ...mockTableCard, ...props };
  return mount(TableCard, {
    props: { tableCard },
    global: {
      plugins: [[PrimeVue, {}]],
      stubs: {
        Badge: { template: '<span v-bind="$attrs"><slot /></span>' },
        Tag: { template: '<span v-bind="$attrs"><slot /></span>' },
        Button: { template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>' },
      },
    },
  });
}

describe('TableCard', () => {
  it('renders table number', () => {
    const wrapper = mountComponent();
    expect(wrapper.text()).toContain('1');
  });

  it('emits click when card is clicked', async () => {
    const wrapper = mountComponent();
    await wrapper.find('[data-testid="table-card-1"]').trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });

  it('shows order count', () => {
    const wrapper = mountComponent();
    expect(wrapper.text()).toContain('1');
  });

  it('applies alert animation class when hasAlert is true', () => {
    const wrapper = mountComponent({ hasAlert: true });
    const card = wrapper.find('[data-testid="table-card-1"]');
    expect(card.classes()).toContain('animate-pulse-alert');
  });
});
