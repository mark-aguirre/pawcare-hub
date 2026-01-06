import { lazy, Suspense } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PageSkeleton } from '@/components/ui/page-skeleton';

const Billing = lazy(() => import('@/pages/Billing'));

export default function BillingPage() {
  return (
    <ProtectedRoute requiredPermissions={['billing']}>
      <Suspense fallback={<PageSkeleton />}>
        <Billing />
      </Suspense>
    </ProtectedRoute>
  );
}