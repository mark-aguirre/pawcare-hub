import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

export interface Pet {
  id: number;
  name: string;
  species: string;
  breed?: string;
  color?: string;
  dateOfBirth?: string;
  gender?: string;
  weight?: number;
  microchipId?: string;
  ownerId?: number;
  ownerName?: string;
  createdAt: string;
  updatedAt: string;
}

export const petKeys = {
  all: ['pets'] as const,
  lists: () => [...petKeys.all, 'list'] as const,
};

export function usePets() {
  return useQuery({
    queryKey: petKeys.lists(),
    queryFn: async () => {
      const response = await fetch('/api/pets?t=' + Date.now());
      if (!response.ok) {
        throw new Error('Failed to fetch pets');
      }
      return await response.json();
    },
    staleTime: 0,
    cacheTime: 0,
  });
}

export function useCreatePet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (petData: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>) => {
      return await apiClient.post<Pet>('/api/pets', petData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: petKeys.lists() });
    },
  });
}

export function useUpdatePet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...petData }: Partial<Pet> & { id: number }) => {
      return await apiClient.put<Pet>(`/api/pets/${id}`, petData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: petKeys.lists() });
    },
  });
}

export function usePetAppointments(petId?: number) {
  return useQuery({
    queryKey: ['pet-appointments', petId],
    queryFn: async () => {
      try {
        return await apiClient.get(`/api/appointments/pet/${petId}`);
      } catch (error) {
        console.warn('Backend not available, using mock data');
        return [];
      }
    },
    enabled: !!petId,
  });
}