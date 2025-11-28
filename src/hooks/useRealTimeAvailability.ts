import { useState, useEffect, useCallback } from 'react';
import {
  subscribeToDriverAvailability,
  subscribeToTourAvailability,
  subscribeToUserNotifications,
  checkAvailabilityRange,
  markNotificationAsRead,
  DriverAvailability,
  TourAvailability,
  RealTimeNotification,
  AvailabilitySlot,
} from '@/services/realTimeAvailability';

// Hook for driver availability
export function useDriverAvailability(driverId: string | undefined, date: string | undefined) {
  const [availability, setAvailability] = useState<DriverAvailability | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!driverId || !date) {
      setAvailability(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToDriverAvailability(driverId, date, (data) => {
      setAvailability(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [driverId, date]);

  return { availability, loading, error };
}

// Hook for tour availability
export function useTourAvailability(tourId: string | undefined, date: string | undefined) {
  const [availability, setAvailability] = useState<TourAvailability | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!tourId || !date) {
      setAvailability(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToTourAvailability(tourId, date, (data) => {
      setAvailability(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [tourId, date]);

  return { availability, loading, error };
}

// Hook for user notifications
export function useNotifications(userId: string | undefined) {
  const [notifications, setNotifications] = useState<RealTimeNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = subscribeToUserNotifications(userId, (data) => {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    const unreadNotifications = notifications.filter(n => !n.read);
    await Promise.all(unreadNotifications.map(n => markNotificationAsRead(n.id)));
  }, [notifications]);

  return { notifications, unreadCount, loading, markAsRead, markAllAsRead };
}

// Hook for availability calendar
export function useAvailabilityCalendar(
  resourceType: 'driver' | 'tour' | 'vehicle',
  resourceId: string | undefined,
  startDate: string,
  endDate: string
) {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    if (!resourceId) {
      setSlots([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await checkAvailabilityRange(resourceType, resourceId, startDate, endDate);
      setSlots(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [resourceType, resourceId, startDate, endDate]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { slots, loading, error, refresh };
}

// Hook for live spots counter
export function useLiveSpots(tourId: string | undefined, date: string | undefined) {
  const { availability, loading } = useTourAvailability(tourId, date);

  const spotsLeft = availability?.spotsAvailable ?? null;
  const totalSpots = availability?.totalSpots ?? null;
  const status = availability?.status ?? 'available';

  const isLimited = status === 'limited';
  const isFull = status === 'full';
  const percentageFilled = totalSpots && spotsLeft !== null
    ? Math.round(((totalSpots - spotsLeft) / totalSpots) * 100)
    : 0;

  return {
    spotsLeft,
    totalSpots,
    status,
    isLimited,
    isFull,
    percentageFilled,
    loading,
  };
}

export default {
  useDriverAvailability,
  useTourAvailability,
  useNotifications,
  useAvailabilityCalendar,
  useLiveSpots,
};
