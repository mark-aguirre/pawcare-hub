import { lazy, Suspense } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PageSkeleton } from '@/components/ui/page-skeleton';

const Records = lazy(() => import('@/pages/Records'));

export default function RecordsPage() {
  return (
    <ProtectedRoute requiredPermissions={['records']}>
      <Suspense fallback={<PageSkeleton />}>
        <Records />
      </Suspense>
    </ProtectedRoute>
  );
}