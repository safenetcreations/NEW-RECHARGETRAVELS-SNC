
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBookingManager, Booking } from '@/hooks/useBookingManager';

interface BookingContextType {
  currentBooking: Booking | null;
  userBookings: Booking[];
  loading: boolean;
  setCurrentBooking: (booking: Booking | null) => void;
  createBooking: (bookingData: any) => Promise<{ data: any; error: any }>;
  updateBooking: (bookingId: string, updates: any) => Promise<{ data: any; error: any }>;
  cancelBooking: (bookingId: string, reason?: string) => Promise<{ data: any; error: any }>;
  checkAvailability: (checkData: any) => Promise<any>;
  fetchUserBookings: () => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

interface BookingProviderProps {
  children: ReactNode;
}

export const BookingProvider = ({ children }: BookingProviderProps) => {
  const { user } = useAuth();
  const { 
    createBooking: createBookingManager, 
    getUserBookings, 
    cancelBooking: cancelBookingManager,
    checkAvailability: checkAvailabilityManager,
    bookings,
    isLoading 
  } = useBookingManager();
  
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserBookings();
    }
  }, [user]);

  const fetchUserBookings = async () => {
    if (!user) return;
    await getUserBookings();
  };

  const createBooking = async (bookingData: any) => {
    if (!user) {
      return { data: null, error: 'User must be logged in to create booking' };
    }
    
    try {
      const result = await createBookingManager(bookingData);
      
      if (result.success && result.booking) {
        setCurrentBooking(result.booking);
        await fetchUserBookings(); // Refresh user bookings
        return { data: result.booking, error: null };
      } else {
        return { data: null, error: result.error || 'Failed to create booking' };
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      return { data: null, error };
    }
  };

  const updateBooking = async (bookingId: string, updates: any) => {
    try {
      // For now, we'll use the cancel booking functionality
      // You can extend this based on your needs
      const result = await cancelBookingManager(bookingId, updates.cancellation_reason);
      
      if (result.success) {
        await fetchUserBookings(); // Refresh user bookings
        return { data: result, error: null };
      } else {
        return { data: null, error: result.error || 'Failed to update booking' };
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      return { data: null, error };
    }
  };

  const cancelBooking = async (bookingId: string, reason?: string) => {
    try {
      const result = await cancelBookingManager(bookingId, reason);
      
      if (result.success) {
        await fetchUserBookings(); // Refresh user bookings
        return { data: result, error: null };
      } else {
        return { data: null, error: result.error || 'Failed to cancel booking' };
      }
    } catch (error) {
      console.error('Error canceling booking:', error);
      return { data: null, error };
    }
  };

  const checkAvailability = async (checkData: any) => {
    try {
      const result = await checkAvailabilityManager(checkData);
      
      if (result.success) {
        return result.availability;
      } else {
        return { available: false, error: result.error };
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      return { available: false, error: error.message };
    }
  };

  const value = {
    currentBooking,
    userBookings: bookings,
    loading: isLoading,
    setCurrentBooking,
    createBooking,
    updateBooking,
    cancelBooking,
    checkAvailability,
    fetchUserBookings
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};
