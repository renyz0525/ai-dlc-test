import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createStore } from 'vuex'
import SetupView from '@/views/SetupView.vue'

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('primevue/inputtext', () => ({
  default: { name: 'InputText', template: '<input />', props: ['modelValue', 'disabled'] },
}))
vi.mock('primevue/password', () => ({
  default: { name: 'Password', template: '<input />', props: ['modelValue', 'disabled'] },
}))
vi.mock('primevue/button', () => ({
  default: { name: 'Button', template: '<button><slot /></button>', props: ['loading', 'label'] },
}))

function createTestStore(loginFn = vi.fn()) {
  return createStore({
    modules: {
      auth: {
        namespaced: true,
        actions: {
          login: loginFn,
        },
      },
    },
  })
}

describe('SetupView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders setup form', () => {
    const store = createTestStore()
    const wrapper = mount(SetupView, { global: { plugins: [store] } })
    expect(wrapper.find('[data-testid="setup-form"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="setup-submit-button"]').exists()).toBe(true)
  })

  it('shows validation error when fields are empty', async () => {
    const store = createTestStore()
    const wrapper = mount(SetupView, { global: { plugins: [store] } })

    await wrapper.find('form').trigger('submit')
    expect(wrapper.find('[data-testid="setup-error"]').text()).toBe('모든 필드를 입력해주세요')
  })

  it('dispatches login and navigates on success', async () => {
    const loginFn = vi.fn().mockResolvedValue(undefined)
    const store = createTestStore(loginFn)
    const wrapper = mount(SetupView, { global: { plugins: [store] } })

    // Set form values directly via component internals since PrimeVue mocks don't bind v-model
    const vm = wrapper.vm as any
    vm.form.storeId = 'store-1'
    vm.form.tableNumber = 5
    vm.form.password = 'pass'

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(loginFn).toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('shows error message on login failure', async () => {
    const loginFn = vi.fn().mockRejectedValue(new Error('인증 실패'))
    const store = createTestStore(loginFn)
    const wrapper = mount(SetupView, { global: { plugins: [store] } })

    const vm = wrapper.vm as any
    vm.form.storeId = 'store-1'
    vm.form.tableNumber = 5
    vm.form.password = 'pass'

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('[data-testid="setup-error"]').text()).toBe('인증 실패')
  })
})
