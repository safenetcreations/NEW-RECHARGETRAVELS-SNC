import { tripAdvisorTours, type TripAdvisorTour } from '@/data/tripAdvisorTours'

// Use local data only - Firebase collection disabled
export const useTripAdvisorTours = () => {
  return {
    tours: tripAdvisorTours,
    isLoading: false,
    error: null
  }
}
