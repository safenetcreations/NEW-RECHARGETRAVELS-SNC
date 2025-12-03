/**
 * Route Prefetching Utility
 * Preloads route chunks for faster navigation
 */

// Store prefetched routes to avoid duplicate fetches
const prefetchedRoutes = new Set<string>();

// Route import mapping for prefetching
const routeImports: Record<string, () => Promise<any>> = {
  '/tours': () => import('@/pages/Tours'),
  '/destinations': () => import('@/pages/Destinations'),
  '/blog': () => import('@/pages/Blog'),
  '/about': () => import('@/pages/AboutRechargeTravel'),
  '/hotels': () => import('@/pages/Hotels'),
  '/book-now': () => import('@/pages/BookNow'),
  '/experiences': () => import('@/pages/LuxuryExperiences'),
  '/tours/cultural': () => import('@/pages/CulturalTours'),
  '/tours/wildtours': () => import('@/pages/WildTours'),
  '/tours/beach-tours': () => import('@/pages/BeachTours'),
};

/**
 * Prefetch a specific route's chunk
 */
export function prefetchRoute(path: string): void {
  if (prefetchedRoutes.has(path)) return;

  const importFn = routeImports[path];
  if (importFn) {
    prefetchedRoutes.add(path);
    // Use requestIdleCallback for non-blocking prefetch
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        importFn().catch(() => {
          // Silently fail - route will load on demand
          prefetchedRoutes.delete(path);
        });
      });
    } else {
      // Fallback for Safari
      setTimeout(() => {
        importFn().catch(() => {
          prefetchedRoutes.delete(path);
        });
      }, 100);
    }
  }
}

/**
 * Prefetch multiple routes at once
 */
export function prefetchRoutes(paths: string[]): void {
  paths.forEach(prefetchRoute);
}

/**
 * Prefetch common routes after initial page load
 * Call this after the homepage has fully loaded
 */
export function prefetchCommonRoutes(): void {
  // Wait for idle time before prefetching
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      prefetchRoutes([
        '/tours',
        '/destinations',
        '/hotels',
        '/book-now',
        '/experiences'
      ]);
    }, { timeout: 3000 });
  } else {
    setTimeout(() => {
      prefetchRoutes([
        '/tours',
        '/destinations',
        '/hotels',
        '/book-now',
        '/experiences'
      ]);
    }, 2000);
  }
}

/**
 * Prefetch route on link hover (for navigation menus)
 */
export function createHoverPrefetch(path: string) {
  let timeoutId: NodeJS.Timeout;

  return {
    onMouseEnter: () => {
      timeoutId = setTimeout(() => prefetchRoute(path), 100);
    },
    onMouseLeave: () => {
      clearTimeout(timeoutId);
    }
  };
}

export default {
  prefetchRoute,
  prefetchRoutes,
  prefetchCommonRoutes,
  createHoverPrefetch
};
