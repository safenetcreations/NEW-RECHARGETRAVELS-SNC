
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../services';

export const useDriverManagement = () => {
  const queryClient = useQueryClient();

  const {
    data: drivers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['drivers'],
    queryFn: bookingService.getDrivers,
  });

  const assignDriverMutation = useMutation({
    mutationFn: ({ bookingId, driverId }: { bookingId: string; driverId: string }) =>
      bookingService.assignDriver(bookingId, driverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
    },
  });

  return {
    drivers,
    isLoading,
    error,
    assignDriver: assignDriverMutation.mutate,
    isAssigning: assignDriverMutation.isPending,
  };
};
