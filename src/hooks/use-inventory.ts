import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi, StockAdjustment } from '@/lib/inventory-api';
import { InventoryItem } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useInventory = () => {
  return useQuery({
    queryKey: ['inventory'],
    queryFn: inventoryApi.getAll,
  });
};

export const useInventoryItem = (id: string) => {
  return useQuery({
    queryKey: ['inventory', id],
    queryFn: () => inventoryApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: inventoryApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast({
        title: 'Success',
        description: 'Inventory item created successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create inventory item',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InventoryItem> }) =>
      inventoryApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast({
        title: 'Success',
        description: 'Inventory item updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update inventory item',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: inventoryApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast({
        title: 'Success',
        description: 'Inventory item deleted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete inventory item',
        variant: 'destructive',
      });
    },
  });
};

export const useAdjustStock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, adjustment }: { id: string; adjustment: StockAdjustment }) =>
      inventoryApi.adjustStock(id, adjustment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast({
        title: 'Success',
        description: 'Stock adjusted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to adjust stock',
        variant: 'destructive',
      });
    },
  });
};