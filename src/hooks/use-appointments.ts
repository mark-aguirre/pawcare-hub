import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Appointment } from '@/types';

// Query keys
export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (filters: string) => [...appointmentKeys.lists(), { filters }] as const,
  details: () => [...appointmentKeys.all, 'detail'] as const,
  detail: (id: number) => [...appointmentKeys.details(), id] as const,
  upcoming: () => [...appointmentKeys.all, 'upcoming'] as const,
  today: () => [...appointmentKeys.all, 'today'] as const,
};

// Hooks
export function useAppointments() {
  return useQuery({
    queryKey: appointmentKeys.lists(),
    queryFn: () => apiClient.get<Appointment[]>('/api/appointments'),
  });
}

export function useAppointment(id: number) {
  return useQuery({
    queryKey: appointmentKeys.detail(id),
    queryFn: () => apiClient.get<Appointment>(`/api/appointments/${id}`),
    enabled: !!id,
  });
}

export function useUpcomingAppointments() {
  return useQuery({
    queryKey: appointmentKeys.upcoming(),
    queryFn: () => apiClient.get<Appointment[]>('/api/appointments?upcoming=true'),
  });
}

export function useTodayAppointments() {
  return useQuery({
    queryKey: appointmentKeys.today(),
    queryFn: () => apiClient.get<Appointment[]>('/api/appointments?today=true'),
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) =>
      apiClient.post<Appointment>('/api/appointments', appointment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.upcoming() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.today() });
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...appointment }: Appointment) =>
      apiClient.put<Appointment>(`/api/appointments/${id}`, appointment),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.upcoming() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.today() });
      queryClient.setQueryData(appointmentKeys.detail(data.id), data);
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/api/appointments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.upcoming() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.today() });
    },
  });
}