import { apiClient } from './api';
import { InventoryItem } from '@/types';

export interface StockAdjustment {
  type: 'add' | 'remove' | 'set';
  quantity: number;
  reason: string;
  notes?: string;
}

export const inventoryApi = {
  // Get all inventory items
  getAll: () => apiClient.get<InventoryItem[]>('/api/inventory'),
  
  // Get single inventory item
  getById: (id: string) => apiClient.get<InventoryItem>(`/api/inventory/${id}`),
  
  // Create new inventory item
  create: (item: Omit<InventoryItem, 'id' | 'createdAt'>) => 
    apiClient.post<InventoryItem>('/api/inventory', item),
  
  // Update inventory item
  update: (id: string, item: Partial<InventoryItem>) => 
    apiClient.put<InventoryItem>(`/api/inventory/${id}`, item),
  
  // Delete inventory item
  delete: (id: string) => apiClient.delete(`/api/inventory/${id}`),
  
  // Adjust stock
  adjustStock: (id: string, adjustment: StockAdjustment) => 
    apiClient.post<InventoryItem>(`/api/inventory/${id}/adjust-stock`, adjustment),
};