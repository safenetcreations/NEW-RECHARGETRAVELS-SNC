import React from 'react';

export const StatCardSkeleton: React.FC = () => {
  return (
    <div className="admin-card-colorful p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
        <div className="w-16 h-6 bg-gray-300 rounded-full"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-8 bg-gray-300 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 rounded w-1/3"></div>
      </div>
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="admin-card p-6 animate-pulse">
      <div className="mb-4 space-y-2">
        <div className="h-6 bg-gray-300 rounded w-1/3"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="admin-card p-6 animate-pulse">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex gap-4 pb-3 border-b border-gray-200">
          <div className="h-4 bg-gray-300 rounded flex-1"></div>
          <div className="h-4 bg-gray-300 rounded flex-1"></div>
          <div className="h-4 bg-gray-300 rounded flex-1"></div>
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex gap-4 py-3">
            <div className="h-4 bg-gray-200 rounded flex-1"></div>
            <div className="h-4 bg-gray-200 rounded flex-1"></div>
            <div className="h-4 bg-gray-200 rounded flex-1"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="admin-card p-6 animate-pulse">
      <div className="space-y-3">
        <div className="h-6 bg-gray-300 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Banner Skeleton */}
      <div className="admin-card-colorful p-8 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-10 bg-gray-300 rounded w-3/4"></div>
            <div className="h-5 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="w-20 h-20 bg-gray-300 rounded-2xl"></div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="col-span-1 lg:col-span-2">
          <ChartSkeleton />
        </div>
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
};
