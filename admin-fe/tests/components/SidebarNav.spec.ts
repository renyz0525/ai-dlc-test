import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';
import SidebarNav from '@/components/common/SidebarNav.vue';

const mockRouterPush = vi.fn();
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockRouterPush }),
  useRoute: () => ({ path: '/dashboard' }),
  RouterLink: { template: '<a v-bind="$attrs"><slot /></a>', props: ['to'] },
}));

function mountComponent() {
  const store = createStore({
    modules: {
      auth: { namespaced: true, actions: { logout: vi.fn() } },
      dashboard: { namespaced: true, actions: { disconnectSSE: vi.fn() } },
    },
  });

  return mount(SidebarNav, {
    global: {
      plugins: [store],
      stubs: {
        RouterLink: { template: '<a v-bind="$attrs"><slot /></a>', props: ['to'] },
      },
    },
  });
}

describe('SidebarNav', () => {
  it('renders sidebar with navigation items', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('[data-testid="sidebar-nav"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="sidebar-title"]').text()).toBe('Table Order');
  });

  it('renders all navigation links', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('[data-testid="sidebar-nav-dashboard"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="sidebar-nav-tables"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="sidebar-nav-menus"]').exists()).toBe(true);
  });

  it('renders logout button', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('[data-testid="sidebar-logout-button"]').exists()).toBe(true);
  });
});
