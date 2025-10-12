import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { dbService, authService, storageService } from '@/lib/firebase-services';

export type AppRole = 'super_admin' | 'admin' | 'editor' | 'media_manager' | 'customer';

export const useRoles = () => {
  const [userRole, setUserRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserRole();
    } else {
      setUserRole(null);
      setLoading(false);
    }
  }, [user, isAdmin]);

  const fetchUserRole = async () => {
    try {
      if (!user) {
        setUserRole(null);
        setLoading(false);
        return;
      }

      // For now, use the existing admin check from profiles
      if (isAdmin) {
        setUserRole('super_admin');
      } else {
        setUserRole('customer');
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (role: AppRole): boolean => {
    return userRole === role;
  };

  const isAdminRole = (): boolean => {
    return userRole === 'admin' || userRole === 'super_admin';
  };

  const isSuperAdmin = (): boolean => {
    return userRole === 'super_admin';
  };

  const canManageUsers = (): boolean => {
    return userRole === 'super_admin' || userRole === 'admin';
  };

  const canEditContent = (): boolean => {
    return ['super_admin', 'admin', 'editor'].includes(userRole || '');
  };

  const canManageMedia = (): boolean => {
    return ['super_admin', 'admin', 'media_manager'].includes(userRole || '');
  };

  const promoteUser = async (email: string, role: AppRole) => {
    // This would use the database function once types are updated
    // For now, return a placeholder
    console.log('Promoting user:', email, 'to role:', role);
    return true;
  };

  const initializeFirstAdmin = async (email: string) => {
    // This would use the database function once types are updated
    // For now, return a placeholder
    console.log('Initializing first admin:', email);
    return true;
  };

  return {
    userRole,
    loading,
    hasRole,
    isAdmin: isAdminRole,
    isSuperAdmin,
    canManageUsers,
    canEditContent,
    canManageMedia,
    promoteUser,
    initializeFirstAdmin,
    refetch: fetchUserRole
  };
};

// Enhanced admin dashboard hook
export const useAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    todayBookings: 0,
    monthlyRevenue: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch basic stats
      const today = new Date().toISOString().split('T')[0];
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

      const [bookingsCount, todayBookingsCount, monthlyBookings, usersCount] = await Promise.all([
        dbService.list('bookings'('*'),
        dbService.list('bookings'('*').gte('created_at', today),
        dbService.list('bookings'('total_price').gte('created_at', startOfMonth),
        dbService.list('profiles'('*')
      ]);

      const monthlyRevenue = monthlyBookings.data?.reduce((sum, booking) => sum + (Number(booking.total_price) || 0), 0) || 0;

      setStats({
        totalBookings: bookingsCount.count || 0,
        todayBookings: todayBookingsCount.count || 0,
        monthlyRevenue,
        activeUsers: usersCount.count || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return {
    stats,
    loading,
    refetch: fetchDashboardStats
  };
};