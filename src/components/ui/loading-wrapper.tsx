import { ReactNode } from 'react';
import { PageSkeleton } from './page-skeleton';

interface LoadingWrapperProps {
  isLoading: boolean;
  children: ReactNode;
  variant?: 'dashboard' | 'list' | 'grid' | 'billing' | 'records';
}

export function LoadingWrapper({ isLoading, children, variant = 'list' }: LoadingWrapperProps) {
  if (isLoading) {
    return <PageSkeleton variant={variant} />;
  }

  return <>{children}</>;
}