'use client';

import { useEffect } from 'react';

export function preloadRoute(routePath: string) {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = routePath;
  document.head.appendChild(link);
}

export function useRoutePreload() {
  const preloadOnHover = (routePath: string) => {
    return {
      onMouseEnter: () => preloadRoute(routePath),
    };
  };

  return { preloadOnHover };
}

export function ResourcePreloader({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const commonRoutes = [
      '/appointments',
      '/pets',
      '/owners',
      '/records',
      '/billing',
      '/inventory'
    ];

    const timer = setTimeout(() => {
      commonRoutes.forEach(route => preloadRoute(route));
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return <>{children}</>;
}