import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createStore, Store } from 'vuex';
import auth from '@/store/modules/auth';
import type { AuthState } from '@/types';

vi.mock('@/api/auth', () => ({
  authApi: {
    login: vi.fn(),
  },
}));

vi.mock('@/utils/jwt', () => ({
  isTokenExpired: vi.fn(() => false),
  decodeToken: vi.fn(() => ({ sub: 'user-1', storeId: 'store-1', exp: Date.now() / 1000 + 3600, iat: Date.now() / 1000 })),
}));

function createTestStore(): Store<{ auth: AuthState }> {
  return createStore({
    modules: { auth },
  }) as Store<{ auth: AuthState }>;
}

describe('auth store', () => {
  let store: Store<{ auth: AuthState }>;

  beforeEach(() => {
    store = createTestStore();
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('mutations', () => {
    it('SET_TOKEN sets token and isAuthenticated', () => {
      store.commit('auth/SET_TOKEN', 'test-token');
      expect(store.state.auth.token).toBe('test-token');
      expect(store.state.auth.isAuthenticated).toBe(true);
      expect(localStorage.getItem('token')).toBe('test-token');
    });

    it('SET_STORE_ID sets storeId', () => {
      store.commit('auth/SET_STORE_ID', 'store-1');
      expect(store.state.auth.storeId).toBe('store-1');
      expect(localStorage.getItem('storeId')).toBe('store-1');
    });

    it('CLEAR_AUTH clears all auth state', () => {
      store.commit('auth/SET_TOKEN', 'test-token');
      store.commit('auth/SET_STORE_ID', 'store-1');
      store.commit('auth/CLEAR_AUTH');

      expect(store.state.auth.token).toBeNull();
      expect(store.state.auth.isAuthenticated).toBe(false);
      expect(store.state.auth.storeId).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });

    it('INCREMENT_LOGIN_ATTEMPTS increments counter', () => {
      store.commit('auth/INCREMENT_LOGIN_ATTEMPTS');
      expect(store.state.auth.loginAttempts).toBe(1);
    });

    it('INCREMENT_LOGIN_ATTEMPTS sets lock after 5 failures', () => {
      for (let i = 0; i < 5; i++) {
        store.commit('auth/INCREMENT_LOGIN_ATTEMPTS');
      }
      expect(store.state.auth.loginAttempts).toBe(5);
      expect(store.state.auth.lockUntil).not.toBeNull();
    });

    it('RESET_LOGIN_ATTEMPTS resets counter and lock', () => {
      for (let i = 0; i < 5; i++) {
        store.commit('auth/INCREMENT_LOGIN_ATTEMPTS');
      }
      store.commit('auth/RESET_LOGIN_ATTEMPTS');
      expect(store.state.auth.loginAttempts).toBe(0);
      expect(store.state.auth.lockUntil).toBeNull();
    });
  });

  describe('getters', () => {
    it('isAuthenticated returns false initially', () => {
      expect(store.getters['auth/isAuthenticated']).toBe(false);
    });

    it('isAuthenticated returns true after SET_TOKEN', () => {
      store.commit('auth/SET_TOKEN', 'test-token');
      expect(store.getters['auth/isAuthenticated']).toBe(true);
    });

    it('isLocked returns false when no lock', () => {
      expect(store.getters['auth/isLocked']).toBe(false);
    });
  });

  describe('actions', () => {
    it('login calls API and sets token on success', async () => {
      const { authApi } = await import('@/api/auth');
      vi.mocked(authApi.login).mockResolvedValue({ token: 'jwt-token', expiresIn: 57600 });

      await store.dispatch('auth/login', {
        storeId: 'store-1',
        username: 'admin',
        password: 'pass',
      });

      expect(store.state.auth.token).toBe('jwt-token');
      expect(store.state.auth.isAuthenticated).toBe(true);
      expect(store.state.auth.storeId).toBe('store-1');
    });

    it('login increments attempts on failure', async () => {
      const { authApi } = await import('@/api/auth');
      vi.mocked(authApi.login).mockRejectedValue(new Error('Invalid credentials'));

      await expect(
        store.dispatch('auth/login', { storeId: 's1', username: 'u', password: 'p' })
      ).rejects.toThrow();

      expect(store.state.auth.loginAttempts).toBe(1);
    });

    it('logout clears auth state', () => {
      store.commit('auth/SET_TOKEN', 'test-token');
      store.dispatch('auth/logout');
      expect(store.state.auth.isAuthenticated).toBe(false);
      expect(store.state.auth.token).toBeNull();
    });
  });
});
