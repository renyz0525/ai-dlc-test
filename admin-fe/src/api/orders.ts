import apiClient from './client';
import type { Order, OrderStatus } from '@/types';

export const ordersApi = {
  async getStoreOrders(storeId: string, params?: { status?: string }): Promise<Order[]> {
    const response = await apiClient.get(`/stores/${storeId}/orders`, { params });
    return response.data;
  },

  async getTableOrders(storeId: string, tableId: string, sessionId?: string): Promise<Order[]> {
    const response = await apiClient.get(`/stores/${storeId}/tables/${tableId}/orders`, {
      params: sessionId ? { sessionId } : undefined,
    });
    return response.data;
  },

  async updateOrderStatus(storeId: string, orderId: string, status: OrderStatus): Promise<Order> {
    const response = await apiClient.patch(`/stores/${storeId}/orders/${orderId}/status`, {
      status,
    });
    return response.data;
  },

  async deleteOrder(storeId: string, orderId: string): Promise<void> {
    await apiClient.delete(`/stores/${storeId}/orders/${orderId}`);
  },
};
