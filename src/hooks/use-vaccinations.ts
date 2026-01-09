import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

export interface Vaccination {
  id: number;
  petId: number;
  vaccineName: string;
  dateAdministered: string;
  nextDueDate?: string;
  veterinarianId?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const vaccinationKeys = {
  all: ['vaccinations'] as const,
  lists: () => [...vaccinationKeys.all, 'list'] as const,
};

export function useVaccinations() {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: vaccinationKeys.lists(),
    queryFn: async () => {
      try {
        const data = await apiClient.get<Vaccination[]>('/api/vaccinations');
        return data;
      } catch (error) {
        console.error('Failed to fetch vaccinations:', error);
        return [];
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiClient.post('/api/vaccinations', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vaccinationKeys.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await apiClient.put(`/api/vaccinations/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vaccinationKeys.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiClient.delete(`/api/vaccinations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vaccinationKeys.all });
    },
  });

  return {
    vaccinations: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    fetchVaccinations: query.refetch,
    createVaccination: createMutation.mutateAsync,
    updateVaccination: (id: string, data: any) => updateMutation.mutateAsync({ id, data }),
    deleteVaccination: deleteMutation.mutateAsync,
  };
}

export const getUpcomingVaccinations = async (daysAhead: number = 30) => {
  try {
    return await apiClient.get<Vaccination[]>(`/api/vaccinations/upcoming?daysAhead=${daysAhead}`);
  } catch (error) {
    console.error('Failed to fetch upcoming vaccinations:', error);
    return [];
  }
};