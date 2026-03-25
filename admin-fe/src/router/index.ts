import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/tables',
      name: 'Tables',
      component: () => import('@/views/TableManagementView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/tables/setup',
      name: 'TableSetup',
      component: () => import('@/views/TableSetupView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/menus',
      name: 'Menus',
      component: () => import('@/views/MenuManagementView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/',
      redirect: '/dashboard',
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated'];

  if (to.path === '/login') {
    isAuthenticated ? next('/dashboard') : next();
  } else if (to.meta.requiresAuth && !isAuthenticated) {
    next({ path: '/login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
