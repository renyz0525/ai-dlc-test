import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/setup',
      name: 'Setup',
      component: () => import('@/views/SetupView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      name: 'Menu',
      component: () => import('@/views/MenuView.vue'),
    },
    {
      path: '/order/confirm',
      name: 'OrderConfirm',
      component: () => import('@/views/OrderConfirmView.vue'),
    },
    {
      path: '/order/success',
      name: 'OrderSuccess',
      component: () => import('@/views/OrderSuccessView.vue'),
    },
    {
      path: '/orders',
      name: 'OrderHistory',
      component: () => import('@/views/OrderHistoryView.vue'),
    },
  ],
})

router.beforeEach(async (to, _from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']

  if (to.path === '/setup') {
    if (isAuthenticated) {
      return next('/')
    }
    return next()
  }

  if (to.meta.requiresAuth === false) {
    return next()
  }

  if (!isAuthenticated) {
    const success = await store.dispatch('auth/autoLogin')
    if (!success) {
      return next('/setup')
    }
  }

  next()
})

export default router
