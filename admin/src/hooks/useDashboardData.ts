export const useDashboardData = () => {
  const data = {
    totalRevenue: 125000,
    totalBookings: 342,
    activeUsers: 1250,
    conversionRate: 3.5
  };

  return { data, isLoading: false, error: null };
};