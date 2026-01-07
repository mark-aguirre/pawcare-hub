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
      try {
        return await apiClient.get<Pet[]>('/api/pets');
      } catch (error) {
        console.warn('Backend not available, using mock data');
        return [
          {
            id: 1,
            name: 'Buddy',
            species: 'Dog',
            breed: 'Golden Retriever',
            ownerId: 1,
            ownerName: 'John Smith',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ] as Pet[];
      }
    },
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