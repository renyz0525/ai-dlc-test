import apiClient from './client';
import type { LoginCredentials } from '@/types';

export const authApi = {
  async login(credentials: LoginCredentials): Promise<{ token: string; expiresIn: number }> {
    const response = await apiClient.post('/auth/admin/login', credentials);
    return response.data;
  },
};
