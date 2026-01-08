'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingWrapper } from '@/components/ui/loading-wrapper';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
}

export function ProtectedRoute({ children, requiredPermissions = [] }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }

    if (!isLoading && user) {
      // OWNER role can only access portal
      if (user.role === 'OWNER') {
        if (pathname !== '/portal') {
          router.push('/portal');
          return;
        }
      } else {
        // Non-OWNER roles cannot access portal
        if (pathname === '/portal') {
          router.push('/');
          return;
        }
      }
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return <LoadingWrapper isLoading={true} variant="dashboard" />;
  }

  if (!user) {
    return null;
  }

  // Map roles to permissions
  const rolePermissions: Record<string, string[]> = {
    'ADMINISTRATOR': ['all'],
    'VETERINARIAN': ['pets', 'owners', 'appointments', 'records', 'prescriptions', 'lab-tests', 'vaccinations'],
    'NURSE': ['pets', 'owners', 'appointments', 'records'],
    'RECEPTIONIST': ['pets', 'owners', 'appointments', 'billing'],
    'TECHNICIAN': ['pets', 'owners', 'appointments', 'records'],
    'OWNER': ['portal']
  };

  const userPermissions = user.permissions || rolePermissions[user.role] || [];
  const hasPermission = requiredPermissions.length === 0 || 
    userPermissions.includes('all') ||
    requiredPermissions.some(permission => userPermissions.includes(permission));

  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
}