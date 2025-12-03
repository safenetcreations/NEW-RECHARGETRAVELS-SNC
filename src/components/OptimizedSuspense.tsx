import React, { Suspense, ReactNode, useEffect, useState, memo } from 'react';

// Ultra-fast skeleton loading component
const PageSkeleton = memo(() => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    {/* Header skeleton */}
    <div className="h-16 bg-white/80 backdrop-blur-sm shadow-sm animate-pulse" />
    
    {/* Hero skeleton */}
    <div className="h-[60vh] bg-gradient-to-br from-slate-200 to-slate-300 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skeleton-shimmer" />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
        <div className="h-4 w-32 bg-white/30 rounded-full mb-6" />
        <div className="h-12 w-96 max-w-[80%] bg-white/40 rounded-lg mb-4" />
        <div className="h-6 w-64 max-w-[60%] bg-white/30 rounded-lg mb-8" />
        <div className="h-14 w-48 bg-emerald-500/50 rounded-full" />
      </div>
    </div>
    
    {/* Content skeleton */}
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
            <div className="h-40 bg-slate-200 rounded-lg mb-4" />
            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-slate-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>

    <style>{`
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      .skeleton-shimmer {
        animation: shimmer 1.5s infinite;
      }
    `}</style>
  </div>
));

PageSkeleton.displayName = 'PageSkeleton';

// Minimal spinner for secondary pages
const MinimalSpinner = memo(() => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  </div>
));

MinimalSpinner.displayName = 'MinimalSpinner';

// Instant render fallback - shows nothing for very short loads
const InstantFallback = memo(() => null);
InstantFallback.displayName = 'InstantFallback';

interface OptimizedSuspenseProps {
  children: ReactNode;
  variant?: 'page' | 'minimal' | 'instant';
  delay?: number; // Delay before showing fallback (ms)
}

/**
 * OptimizedSuspense - Performance-optimized Suspense wrapper
 * - 'page': Full page skeleton for route transitions
 * - 'minimal': Simple spinner for component loading
 * - 'instant': No fallback, instant load attempt
 */
export const OptimizedSuspense = memo(function OptimizedSuspense({ 
  children, 
  variant = 'minimal',
  delay = 0 
}: OptimizedSuspenseProps) {
  const [showFallback, setShowFallback] = useState(delay === 0);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setShowFallback(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  const getFallback = () => {
    if (!showFallback) return null;
    
    switch (variant) {
      case 'page':
        return <PageSkeleton />;
      case 'minimal':
        return <MinimalSpinner />;
      case 'instant':
        return <InstantFallback />;
      default:
        return <MinimalSpinner />;
    }
  };

  return (
    <Suspense fallback={getFallback()}>
      {children}
    </Suspense>
  );
});

// Pre-export components for direct use
export { PageSkeleton, MinimalSpinner, InstantFallback };

export default OptimizedSuspense;
