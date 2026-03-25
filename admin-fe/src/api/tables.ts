import apiClient from './client';
import type { Table, TableSetupDto, OrderHistory, DateRange } from '@/types';

export const tablesApi = {
  async getTables(storeId: string): Promise<Table[]> {
    const response = await apiClient.get(`/stores/${storeId}/tables`);
    return response.data;
  },

  async setupTable(storeId: string, data: TableSetupDto): Promise<Table> {
    const response = await apiClient.post(`/stores/${storeId}/tables`, data);
    return response.data;
  },

  async completeTable(storeId: string, tableId: string): Promise<void> {
    await apiClient.post(`/stores/${storeId}/tables/${tableId}/complete`);
  },

  async getTableHistory(
    storeId: string,
    tableId: string,
    dateRange?: DateRange
  ): Promise<OrderHistory[]> {
    const response = await apiClient.get(`/stores/${storeId}/tables/${tableId}/history`, {
      params: dateRange ? { dateFrom: dateRange.from, dateTo: dateRange.to } : undefined,
    });
    return response.data;
  },
};
