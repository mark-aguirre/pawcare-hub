import { lazy, Suspense } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PageSkeleton } from '@/components/ui/page-skeleton';

const Pets = lazy(() => import('@/pages/Pets'));

export default function PetsPage() {
  return (
    <ProtectedRoute requiredPermissions={['pets']}>
      <Suspense fallback={<PageSkeleton />}>
        <Pets />
      </Suspense>
    </ProtectedRoute>
  );
}