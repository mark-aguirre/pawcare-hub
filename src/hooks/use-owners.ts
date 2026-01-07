import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Owner } from '@/types';

// Query keys
export const ownerKeys = {
  all: ['owners'] as const,
  lists: () => [...ownerKeys.all, 'list'] as const,
  list: (filters: string) => [...ownerKeys.lists(), { filters }] as const,
  details: () => [...ownerKeys.all, 'detail'] as const,
  detail: (id: number) => [...ownerKeys.details(), id] as const,
  search: (query: string) => [...ownerKeys.all, 'search', query] as const,
};

// Hooks
export function useOwners() {
  return useQuery({
    queryKey: ownerKeys.lists(),
    queryFn: () => apiClient.get<Owner[]>('/api/owners'),
  });
}

export function useOwner(id: number) {
  return useQuery({
    queryKey: ownerKeys.detail(id),
    queryFn: () => apiClient.get<Owner>(`/api/owners/${id}`),
    enabled: !!id,
  });
}

export function useSearchOwners(query: string) {
  return useQuery({
    queryKey: ownerKeys.search(query),
    queryFn: () => apiClient.get<Owner[]>(`/api/owners/search?name=${encodeURIComponent(query)}`),
    enabled: !!query,
  });
}

export function useCreateOwner() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (owner: Omit<Owner, 'id' | 'createdAt' | 'updatedAt'>) =>
      apiClient.post<Owner>('/api/owners', owner),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ownerKeys.lists() });
    },
  });
}

export function useUpdateOwner() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...owner }: Owner) =>
      apiClient.put<Owner>(`/api/owners/${id}`, owner),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ownerKeys.lists() });
      queryClient.setQueryData(ownerKeys.detail(data.id), data);
    },
  });
}

export function useDeleteOwner() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/api/owners/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ownerKeys.lists() });
    },
  });
}

export function useOwnerAppointments(ownerId?: number) {
  return useQuery({
    queryKey: ['owner-appointments', ownerId],
    queryFn: async () => {
      try {
        return await apiClient.get(`/api/owners/${ownerId}/appointments`);
      } catch (error) {
        console.warn('Backend not available, using mock data');
        return [];
      }
    },
    enabled: !!ownerId,
  });
}

export function useOwnerTotalSpent(ownerId?: number) {
  return useQuery({
    queryKey: ['owner-total-spent', ownerId],
    queryFn: async () => {
      try {
        return await apiClient.get(`/api/owners/${ownerId}/total-spent`);
      } catch (error) {
        console.warn('Backend not available, using mock data');
        return 0;
      }
    },
    enabled: !!ownerId,
  });
}