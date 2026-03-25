import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';
import LoginForm from '@/components/auth/LoginForm.vue';
import PrimeVue from 'primevue/config';

const mockRouterPush = vi.fn();
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockRouterPush }),
  useRoute: () => ({ query: {} }),
}));

function createMockStore(overrides = {}) {
  return createStore({
    modules: {
      auth: {
        namespaced: true,
        getters: {
          isLocked: () => false,
          ...overrides,
        },
        actions: {
          login: vi.fn().mockResolvedValue({ token: 'test' }),
        },
      },
    },
  });
}

function mountComponent(store = createMockStore()) {
  return mount(LoginForm, {
    global: {
      plugins: [store, [PrimeVue, {}]],
      stubs: {
        InputText: { template: '<input v-bind="$attrs" />', inheritAttrs: true },
        Button: { template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>', inheritAttrs: true },
      },
    },
  });
}

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('[data-testid="login-form"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="login-form-store-id"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="login-form-username"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="login-form-password"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="login-form-submit-button"]').exists()).toBe(true);
  });

  it('shows locked message when account is locked', () => {
    const store = createMockStore({ isLocked: () => true });
    const wrapper = mountComponent(store);
    expect(wrapper.find('[data-testid="login-form-locked"]').exists()).toBe(true);
  });

  it('does not show error message initially', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('[data-testid="login-form-error"]').exists()).toBe(false);
  });
});
