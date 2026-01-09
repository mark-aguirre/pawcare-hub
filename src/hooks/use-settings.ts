import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { ClinicSettings, User, UserPermissions } from '@/types';

// Query keys
export const settingsKeys = {
  all: ['settings'] as const,
  clinic: () => [...settingsKeys.all, 'clinic'] as const,
  users: () => [...settingsKeys.all, 'users'] as const,
  permissions: () => [...settingsKeys.all, 'permissions'] as const,
  userPermissions: (userId: string) => [...settingsKeys.permissions(), userId] as const,
};

// Clinic Settings Hooks
export function useClinicSettings() {
  return useQuery({
    queryKey: settingsKeys.clinic(),
    queryFn: () => apiClient.get<ClinicSettings>('/api/settings'),
  });
}

export function useUpdateClinicSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (settings: Partial<ClinicSettings>) =>
      apiClient.put<ClinicSettings>('/api/settings', settings),
    onSuccess: (data) => {
      queryClient.setQueryData(settingsKeys.clinic(), data);
    },
  });
}

// Users Hooks
export function useUsers() {
  return useQuery({
    queryKey: settingsKeys.users(),
    queryFn: () => apiClient.get<User[]>('/api/settings/users'),
  });
}

// Permissions Hooks
export function useUserPermissions(userId?: string) {
  return useQuery({
    queryKey: userId ? settingsKeys.userPermissions(userId) : settingsKeys.permissions(),
    queryFn: () => {
      const url = userId ? `/api/settings/permissions?userId=${userId}` : '/api/settings/permissions';
      return apiClient.get<UserPermissions | UserPermissions[]>(url);
    },
    enabled: !!userId,
  });
}

export function useUpdateUserPermissions() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, permissions }: { userId: number; permissions: any }) =>
      apiClient.put<UserPermissions>('/api/settings/permissions', { userId, permissions }),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(settingsKeys.userPermissions(variables.userId.toString()), data);
      queryClient.invalidateQueries({ queryKey: settingsKeys.permissions() });
    },
  });
}