import { lazy, Suspense } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PageSkeleton } from '@/components/ui/page-skeleton';

const Appointments = lazy(() => import('@/pages/Appointments'));

export default function AppointmentsPage() {
  return (
    <ProtectedRoute requiredPermissions={['appointments']}>
      <Suspense fallback={<PageSkeleton />}>
        <Appointments />
      </Suspense>
    </ProtectedRoute>
  );
}