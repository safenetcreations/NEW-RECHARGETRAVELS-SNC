
import { useState, useCallback } from 'react';
import type { Booking } from '../types';
import { bookingService } from '../services';

export const useBookingState = () => {
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);

  const loadBookingHistory = useCallback(async () => {
    try {
      const history = await bookingService.getUserBookings();
      setBookingHistory(history);
    } catch (error) {
      console.error('Failed to load booking history:', error);
    }
  }, []);

  const selectBooking = useCallback((booking: Booking) => {
    setCurrentBooking(booking);
  }, []);

  const clearCurrentBooking = useCallback(() => {
    setCurrentBooking(null);
  }, []);

  return {
    currentBooking,
    bookingHistory,
    selectBooking,
    clearCurrentBooking,
    loadBookingHistory,
  };
};
