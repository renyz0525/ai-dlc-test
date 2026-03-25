import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('@/store', () => ({
  default: {
    dispatch: vi.fn(),
    getters: {},
  },
}));

vi.mock('@/router', () => ({
  default: {
    push: vi.fn(),
  },
}));

describe('API Client', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('adds Authorization header when token exists', async () => {
    localStorage.setItem('token', 'test-jwt-token');

    const { default: apiClient } = await import('@/api/client');
    const config = { headers: {} as Record<string, string> };
    const handlers = (apiClient.interceptors.request as unknown as { handlers: Array<{ fulfilled?: (config: never) => unknown }> }).handlers;
    const interceptor = handlers[0];

    if (interceptor?.fulfilled) {
      const result = interceptor.fulfilled(config as never);
      expect((result as { headers: Record<string, string> }).headers.Authorization).toBe('Bearer test-jwt-token');
    }
  });

  it('does not add Authorization header when no token', async () => {
    const { default: apiClient } = await import('@/api/client');
    const config = { headers: {} as Record<string, string> };
    const handlers = (apiClient.interceptors.request as unknown as { handlers: Array<{ fulfilled?: (config: never) => unknown }> }).handlers;
    const interceptor = handlers[0];

    if (interceptor?.fulfilled) {
      const result = interceptor.fulfilled(config as never);
      expect((result as { headers: Record<string, string> }).headers.Authorization).toBeUndefined();
    }
  });
});
