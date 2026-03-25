import apiClient from './client';
import type { Menu } from '@/types';

export const menusApi = {
  async getMenus(storeId: string): Promise<Menu[]> {
    const response = await apiClient.get(`/stores/${storeId}/menus`);
    return response.data;
  },

  async createMenu(storeId: string, formData: FormData): Promise<Menu> {
    const response = await apiClient.post(`/stores/${storeId}/menus`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async updateMenu(storeId: string, menuId: string, formData: FormData): Promise<Menu> {
    const response = await apiClient.put(`/stores/${storeId}/menus/${menuId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async deleteMenu(storeId: string, menuId: string): Promise<void> {
    await apiClient.delete(`/stores/${storeId}/menus/${menuId}`);
  },

  async updateMenuOrder(storeId: string, menuIds: string[]): Promise<void> {
    await apiClient.patch(`/stores/${storeId}/menus/order`, { menuIds });
  },
};
