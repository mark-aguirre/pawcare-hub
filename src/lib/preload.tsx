'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const preloadedRoutes = new Set<string>();

export function preloadRoute(routePath: string) {
  if (preloadedRoutes.has(routePath)) return;
  
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = routePath;
  document.head.appendChild(link);
  preloadedRoutes.add(routePath);
}

export function useRoutePreload() {
  const router = useRouter();
  
  const preloadOnHover = useCallback((routePath: string) => {
    return {
      onMouseEnter: () => {
        preloadRoute(routePath);
        router.prefetch(routePath);
      },
    };
  }, [router]);

  return { preloadOnHover };
}

export function ResourcePreloader({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const commonRoutes = [
      '/appointments',
      '/pets', 
      '/owners',
      '/records'
    ];

    // Immediate prefetch for critical routes
    const prefetchTimer = setTimeout(() => {
      commonRoutes.forEach(route => {
        preloadRoute(route);
      });
    }, 100);

    return () => clearTimeout(prefetchTimer);
  }, []);

  return <>{children}</>;
}