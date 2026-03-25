import apiClient from './client';
import type { Category, CategoryCreateDto, CategoryUpdateDto } from '@/types';

export const categoriesApi = {
  async getCategories(storeId: string): Promise<Category[]> {
    const response = await apiClient.get(`/stores/${storeId}/categories`);
    return response.data;
  },

  async createCategory(storeId: string, data: CategoryCreateDto): Promise<Category> {
    const response = await apiClient.post(`/stores/${storeId}/categories`, data);
    return response.data;
  },

  async updateCategory(
    storeId: string,
    categoryId: string,
    data: CategoryUpdateDto
  ): Promise<Category> {
    const response = await apiClient.put(`/stores/${storeId}/categories/${categoryId}`, data);
    return response.data;
  },

  async deleteCategory(storeId: string, categoryId: string): Promise<void> {
    await apiClient.delete(`/stores/${storeId}/categories/${categoryId}`);
  },
};
