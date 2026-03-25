import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import OrderStatusControl from '@/components/dashboard/OrderStatusControl.vue';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import type { Order } from '@/types';

const mockOrder: Order = {
  id: 'order-1', storeId: 'store-1', tableId: 'table-1', sessionId: 'session-1',
  status: 'pending', totalAmount: 15000,
  items: [], acknowledgedAt: null,
  createdAt: '2026-03-25T10:00:00Z', updatedAt: '2026-03-25T10:00:00Z',
};

function mountComponent(order: Order = mockOrder) {
  return mount(OrderStatusControl, {
    props: { order },
    global: {
      plugins: [[PrimeVue, {}], ConfirmationService],
      stubs: {
        Tag: { template: '<span v-bind="$attrs"><slot /></span>' },
        Button: { template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>' },
      },
    },
  });
}

describe('OrderStatusControl', () => {
  it('renders current status', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('[data-testid="order-status-tag-order-1"]').exists()).toBe(true);
  });

  it('shows next status button for pending order', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('[data-testid="order-status-next-button-order-1"]').exists()).toBe(true);
  });

  it('does not show next button for completed order', () => {
    const completedOrder = { ...mockOrder, status: 'completed' as const };
    const wrapper = mountComponent(completedOrder);
    expect(wrapper.find('[data-testid="order-status-next-button-order-1"]').exists()).toBe(false);
  });
});
