import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

export interface Veterinarian {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  specialization?: string;
  email: string;
  phone?: string;
  licenseNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export const veterinarianKeys = {
  all: ['veterinarians'] as const,
  lists: () => [...veterinarianKeys.all, 'list'] as const,
};

export function useVeterinarians() {
  const query = useQuery({
    queryKey: veterinarianKeys.lists(),
    queryFn: async () => {
      try {
        const data = await apiClient.get<any[]>('/api/veterinarians');
        return data.map(vet => ({
          ...vet,
          name: vet.firstName && vet.lastName ? `${vet.firstName} ${vet.lastName}` : vet.name || 'Unknown Veterinarian'
        }));
      } catch (error) {
        console.error('Failed to fetch veterinarians:', error);
        return [];
      }
    },
  });

  return {
    veterinarians: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    fetchVeterinarians: query.refetch
  };
}