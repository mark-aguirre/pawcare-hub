import { lazy, Suspense } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PageSkeleton } from '@/components/ui/page-skeleton';

const Inventory = lazy(() => import('@/pages/Inventory'));

export default function InventoryPage() {
  return (
    <ProtectedRoute requiredPermissions={['inventory']}>
      <Suspense fallback={<PageSkeleton />}>
        <Inventory />
      </Suspense>
    </ProtectedRoute>
  );
}