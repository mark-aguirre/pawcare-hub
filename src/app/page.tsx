'use client';

import { lazy, Suspense } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PageSkeleton } from '@/components/ui/page-skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Dashboard = lazy(() => import('@/pages/Dashboard'));

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.role === 'OWNER') {
      router.replace('/portal');
    }
  }, [user, router]);

  if (user?.role === 'OWNER') {
    return null;
  }

  return (
    <ProtectedRoute>
      <Suspense fallback={<PageSkeleton />}>
        <Dashboard />
      </Suspense>
    </ProtectedRoute>
  );
}