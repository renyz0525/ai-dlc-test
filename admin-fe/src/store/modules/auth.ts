import type { Module } from 'vuex';
import type { AuthState, LoginCredentials } from '@/types';
import { authApi } from '@/api/auth';
import { isTokenExpired, decodeToken } from '@/utils/jwt';

const LOCK_DURATION = 15 * 60 * 1000; // 15 minutes
const MAX_LOGIN_ATTEMPTS = 5;

const state: AuthState = {
  token: null,
  user: null,
  storeId: null,
  isAuthenticated: false,
  loginAttempts: 0,
  lockUntil: null,
};

const auth: Module<AuthState, unknown> = {
  namespaced: true,

  state: () => ({ ...state }),

  getters: {
    isAuthenticated: (s) => s.isAuthenticated,
    currentUser: (s) => s.user,
    storeId: (s) => s.storeId,
    isLocked: (s) => {
      if (!s.lockUntil) return false;
      return Date.now() < s.lockUntil;
    },
    lockRemainingMs: (s) => {
      if (!s.lockUntil) return 0;
      const remaining = s.lockUntil - Date.now();
      return remaining > 0 ? remaining : 0;
    },
  },

  mutations: {
    SET_TOKEN(s, token: string) {
      s.token = token;
      s.isAuthenticated = true;
      localStorage.setItem('token', token);
    },
    SET_USER(s, user: AuthState['user']) {
      s.user = user;
    },
    SET_STORE_ID(s, storeId: string) {
      s.storeId = storeId;
      localStorage.setItem('storeId', storeId);
    },
    INCREMENT_LOGIN_ATTEMPTS(s) {
      s.loginAttempts++;
      if (s.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        s.lockUntil = Date.now() + LOCK_DURATION;
        localStorage.setItem('lockUntil', String(s.lockUntil));
        localStorage.setItem('loginAttempts', String(s.loginAttempts));
      }
    },
    RESET_LOGIN_ATTEMPTS(s) {
      s.loginAttempts = 0;
      s.lockUntil = null;
      localStorage.removeItem('lockUntil');
      localStorage.removeItem('loginAttempts');
    },
    CLEAR_AUTH(s) {
      s.token = null;
      s.user = null;
      s.storeId = null;
      s.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('storeId');
    },
  },

  actions: {
    async login({ commit, getters }, credentials: LoginCredentials) {
      if (getters.isLocked) {
        throw new Error('로그인이 잠겨 있습니다. 잠시 후 다시 시도해주세요.');
      }

      try {
        const response = await authApi.login(credentials);
        commit('SET_TOKEN', response.token);
        commit('SET_STORE_ID', credentials.storeId);

        const decoded = decodeToken(response.token);
        commit('SET_USER', { id: decoded.sub, storeId: credentials.storeId, username: credentials.username });
        commit('RESET_LOGIN_ATTEMPTS');

        return response;
      } catch (error) {
        commit('INCREMENT_LOGIN_ATTEMPTS');
        throw error;
      }
    },

    logout({ commit }) {
      commit('CLEAR_AUTH');
    },

    initAuth({ commit }) {
      const token = localStorage.getItem('token');
      const storeId = localStorage.getItem('storeId');
      const lockUntil = localStorage.getItem('lockUntil');
      const loginAttempts = localStorage.getItem('loginAttempts');

      if (lockUntil) {
        const lockTime = Number(lockUntil);
        if (Date.now() < lockTime) {
          commit('INCREMENT_LOGIN_ATTEMPTS');
          // Restore lock state
          Object.assign(state, { lockUntil: lockTime, loginAttempts: Number(loginAttempts) || MAX_LOGIN_ATTEMPTS });
        } else {
          commit('RESET_LOGIN_ATTEMPTS');
        }
      }

      if (token && !isTokenExpired(token)) {
        commit('SET_TOKEN', token);
        if (storeId) {
          commit('SET_STORE_ID', storeId);
        }
        const decoded = decodeToken(token);
        commit('SET_USER', { id: decoded.sub, storeId: storeId || '', username: '' });
      } else if (token) {
        commit('CLEAR_AUTH');
      }
    },
  },
};

export default auth;
