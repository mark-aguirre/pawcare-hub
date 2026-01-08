import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { User } from '@/types';

interface LoginCredentials {
  identifier: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  user?: User;
  message: string;
}

export function useLogin() {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      apiClient.post<LoginResponse>('/api/auth/login', credentials),
  });
}