import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useLiveSpots } from '@/hooks/useRealTimeAvailability';

interface LiveAvailabilityIndicatorProps {
  tourId?: string;
  date?: string;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  className?: string;
}

export const LiveAvailabilityIndicator: React.FC<LiveAvailabilityIndicatorProps> = ({
  tourId,
  date,
  size = 'md',
  showProgress = true,
  className = '',
}) => {
  const { spotsLeft, totalSpots, status, isLimited, isFull, percentageFilled, loading } = useLiveSpots(tourId, date);

  if (loading) {
    return (
      <div className={`animate-pulse flex items-center gap-2 ${className}`}>
        <div className="w-4 h-4 bg-gray-200 rounded-full" />
        <div className="w-20 h-4 bg-gray-200 rounded" />
      </div>
    );
  }

  if (spotsLeft === null) {
    return null;
  }

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const statusConfig = {
    available: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-500',
    },
    limited: {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
      icon: AlertTriangle,
      iconColor: 'text-orange-500',
    },
    full: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      icon: XCircle,
      iconColor: 'text-red-500',
    },
    cancelled: {
      bg: 'bg-gray-50',
      text: 'text-gray-500',
      border: 'border-gray-200',
      icon: XCircle,
      iconColor: 'text-gray-400',
    },
  };

  const config = statusConfig[status] || statusConfig.available;
  const Icon = config.icon;

  return (
    <div className={`${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`
            inline-flex items-center gap-2 px-3 py-1.5 rounded-full border
            ${config.bg} ${config.border} ${sizeClasses[size]}
          `}
        >
          {/* Pulsing dot for live indicator */}
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isFull ? 'bg-red-400' : isLimited ? 'bg-orange-400' : 'bg-green-400'
            }`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              isFull ? 'bg-red-500' : isLimited ? 'bg-orange-500' : 'bg-green-500'
            }`} />
          </span>

          <Icon className={`${iconSizes[size]} ${config.iconColor}`} />

          <span className={config.text}>
            {isFull ? (
              'Sold Out'
            ) : isLimited ? (
              <>Only <strong>{spotsLeft}</strong> spot{spotsLeft !== 1 ? 's' : ''} left!</>
            ) : (
              <>{spotsLeft} spots available</>
            )}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      {showProgress && totalSpots && !isFull && (
        <div className="mt-2 w-full">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentageFilled}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                isLimited ? 'bg-orange-500' : 'bg-green-500'
              }`}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {totalSpots - (spotsLeft || 0)} of {totalSpots} booked
          </p>
        </div>
      )}
    </div>
  );
};

// Simple badge version for compact spaces
export const AvailabilityBadge: React.FC<{
  spotsLeft: number;
  className?: string;
}> = ({ spotsLeft, className = '' }) => {
  if (spotsLeft === 0) {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 ${className}`}>
        Sold Out
      </span>
    );
  }

  if (spotsLeft <= 3) {
    return (
      <motion.span
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 ${className}`}
      >
        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
        {spotsLeft} left
      </motion.span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ${className}`}>
      Available
    </span>
  );
};

// Driver availability status
export const DriverStatusIndicator: React.FC<{
  status: 'available' | 'booked' | 'on_trip' | 'offline';
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}> = ({ status, size = 'md', showLabel = true, className = '' }) => {
  const statusConfig = {
    available: { color: 'bg-green-500', label: 'Available', pulse: true },
    booked: { color: 'bg-blue-500', label: 'Booked', pulse: false },
    on_trip: { color: 'bg-yellow-500', label: 'On Trip', pulse: true },
    offline: { color: 'bg-gray-400', label: 'Offline', pulse: false },
  };

  const config = statusConfig[status];
  const dotSize = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3';

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className={`relative flex ${dotSize}`}>
        {config.pulse && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.color}`} />
        )}
        <span className={`relative inline-flex rounded-full ${dotSize} ${config.color}`} />
      </span>
      {showLabel && (
        <span className={`${size === 'sm' ? 'text-xs' : 'text-sm'} text-gray-600`}>
          {config.label}
        </span>
      )}
    </div>
  );
};

export default LiveAvailabilityIndicator;
