
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Booking, BookingFormData, BookingFilters } from '../types';
import { bookingService } from '../services';

export const useBookings = (filters?: BookingFilters) => {
  const queryClient = useQueryClient();

  const {
    data: bookings,
    isLoading,
    error,
    refetch
  } = useQuery<Booking[]>({
    queryKey: ['transfer-bookings', filters],
    queryFn: () => bookingService.getBookings(filters),
    staleTime: 30000,
  });

  const createBookingMutation = useMutation({
    mutationFn: (data: BookingFormData) => bookingService.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfer-bookings'] });
    },
  });

  const updateBookingMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Booking> }) =>
      bookingService.updateBooking(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfer-bookings'] });
    },
  });

  const cancelBookingMutation = useMutation({
    mutationFn: (id: string) => bookingService.cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfer-bookings'] });
    },
  });

  return {
    bookings,
    isLoading,
    error,
    refetch,
    createBooking: createBookingMutation.mutate,
    updateBooking: updateBookingMutation.mutate,
    cancelBooking: cancelBookingMutation.mutate,
    isCreating: createBookingMutation.isPending,
    isUpdating: updateBookingMutation.isPending,
    isCancelling: cancelBookingMutation.isPending,
  };
};
