'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingWrapper } from '@/components/ui/loading-wrapper';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
}

export function ProtectedRoute({ children, requiredPermissions = [] }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <LoadingWrapper isLoading={true} variant="dashboard" />;
  }

  if (!user) {
    return null;
  }

  const hasPermission = requiredPermissions.length === 0 || 
    user.permissions.includes('all') ||
    requiredPermissions.some(permission => user.permissions.includes(permission));

  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
}