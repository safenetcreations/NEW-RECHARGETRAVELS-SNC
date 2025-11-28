import React from 'react';
import { cn } from '@/lib/utils';

// Base skeleton component
const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('animate-pulse rounded-md bg-gray-200', className)}
    {...props}
  />
);

// Card skeleton for tours, hotels, activities
export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('bg-white rounded-xl shadow-sm overflow-hidden', className)}>
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  </div>
);

// Grid of card skeletons
export const CardGridSkeleton: React.FC<{ count?: number; className?: string }> = ({
  count = 6,
  className
}) => (
  <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

// Hero section skeleton
export const HeroSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('relative h-[70vh] min-h-[500px] overflow-hidden', className)}>
    <Skeleton className="absolute inset-0 rounded-none" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
      <Skeleton className="h-12 w-2/3 max-w-lg bg-gray-400/50" />
      <Skeleton className="h-6 w-1/2 max-w-md bg-gray-400/50" />
      <div className="flex gap-4 pt-4">
        <Skeleton className="h-12 w-32 rounded-lg bg-gray-400/50" />
        <Skeleton className="h-12 w-32 rounded-lg bg-gray-400/50" />
      </div>
    </div>
  </div>
);

// Booking form skeleton
export const BookingFormSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('bg-white rounded-xl shadow-lg p-6 space-y-4', className)}>
    <Skeleton className="h-8 w-48 mb-4" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
    <Skeleton className="h-12 w-full rounded-lg mt-4" />
  </div>
);

// Driver card skeleton
export const DriverCardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('bg-white rounded-xl shadow-sm p-4 flex gap-4', className)}>
    <Skeleton className="w-16 h-16 rounded-xl flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-24" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
    <Skeleton className="w-10 h-10 rounded-full" />
  </div>
);

// List item skeleton
export const ListItemSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('flex items-center gap-4 p-4 border-b', className)}>
    <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-4 w-32" />
    </div>
    <Skeleton className="h-8 w-20 rounded-lg" />
  </div>
);

// Testimonial skeleton
export const TestimonialSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('bg-white rounded-xl shadow-sm p-6 space-y-4', className)}>
    <div className="flex items-center gap-3">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="w-5 h-5 rounded" />
      ))}
    </div>
  </div>
);

// Stats skeleton
export const StatsSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl p-6 text-center space-y-2">
        <Skeleton className="h-10 w-20 mx-auto" />
        <Skeleton className="h-4 w-24 mx-auto" />
      </div>
    ))}
  </div>
);

// Section title skeleton
export const SectionTitleSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('text-center space-y-3 mb-8', className)}>
    <Skeleton className="h-8 w-64 mx-auto" />
    <Skeleton className="h-5 w-96 max-w-full mx-auto" />
  </div>
);

// Table skeleton
export const TableSkeleton: React.FC<{ rows?: number; cols?: number; className?: string }> = ({
  rows = 5,
  cols = 4,
  className
}) => (
  <div className={cn('bg-white rounded-xl shadow-sm overflow-hidden', className)}>
    <div className="border-b bg-gray-50 p-4 flex gap-4">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-5 flex-1" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="border-b p-4 flex gap-4">
        {Array.from({ length: cols }).map((_, colIndex) => (
          <Skeleton key={colIndex} className="h-4 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

// Page skeleton - full page loading
export const PageSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('min-h-screen', className)}>
    <HeroSkeleton />
    <div className="container mx-auto px-4 py-12 space-y-12">
      <SectionTitleSkeleton />
      <CardGridSkeleton />
      <SectionTitleSkeleton />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <TestimonialSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

export { Skeleton };
export default Skeleton;
