import Dashboard from '@/pages/Dashboard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function Home() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}