import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

export interface Veterinarian {
  id: number;
  name: string;
  specialization?: string;
  email: string;
  phone?: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const veterinarianKeys = {
  all: ['veterinarians'] as const,
  lists: () => [...veterinarianKeys.all, 'list'] as const,
};

export function useVeterinarians() {
  return useQuery({
    queryKey: veterinarianKeys.lists(),
    queryFn: async () => {
      try {
        return await apiClient.get<Veterinarian[]>('/api/veterinarians');
      } catch (error) {
        console.warn('Backend not available, using mock data');
        return [
          {
            id: 1,
            name: 'Dr. Sarah Chen',
            specialization: 'General Practice',
            email: 'sarah.chen@pawcare.com',
            phone: '555-0100',
            photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ] as Veterinarian[];
      }
    },
  });
}