import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Prescription } from '@/types';

export const prescriptionKeys = {
  all: ['prescriptions'] as const,
  lists: () => [...prescriptionKeys.all, 'list'] as const,
};

export function usePrescriptions() {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: prescriptionKeys.lists(),
    queryFn: async () => {
      try {
        const data = await apiClient.get<Prescription[]>('/api/prescriptions');
        return data;
      } catch (error) {
        console.error('Failed to fetch prescriptions:', error);
        return [];
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        pet: { id: parseInt(data.petId) },
        veterinarian: { id: parseInt(data.veterinarianId) },
        medicationName: data.medicationName,
        dosage: data.dosage,
        frequency: data.frequency,
        duration: data.duration,
        instructions: data.instructions,
        refillsRemaining: data.refillsRemaining,
        notes: data.notes || '',
        status: data.status.toUpperCase()
      };
      return await apiClient.post('/api/prescriptions', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await apiClient.put(`/api/prescriptions/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiClient.delete(`/api/prescriptions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.all });
    },
  });

  return {
    prescriptions: query.data || [],
    isLoading: query.isLoading,
    error: query.error?.message || null,
    fetchPrescriptions: query.refetch,
    createPrescription: createMutation.mutateAsync,
    updatePrescription: (id: string, data: any) => updateMutation.mutateAsync({ id, data }),
    deletePrescription: deleteMutation.mutateAsync,
  };
}