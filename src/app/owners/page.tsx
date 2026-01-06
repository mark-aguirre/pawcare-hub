import { lazy, Suspense } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PageSkeleton } from '@/components/ui/page-skeleton';

const Owners = lazy(() => import('@/pages/Owners'));

export default function OwnersPage() {
  return (
    <ProtectedRoute requiredPermissions={['owners']}>
      <Suspense fallback={<PageSkeleton />}>
        <Owners />
      </Suspense>
    </ProtectedRoute>
  );
}