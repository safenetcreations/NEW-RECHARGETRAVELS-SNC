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
      
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const today = new Date();

      const [bookingsRaw, usersRaw] = await Promise.all([
        dbService.list('bookings'),
        dbService.list('user_profiles')
      ]);

      const bookings = (bookingsRaw as Array<any>) ?? [];
      const users = (usersRaw as Array<any>) ?? [];

      const toDate = (value: any): Date | null => {
        if (!value) return null;
        if (typeof value === 'string') return new Date(value);
        if (value?.toDate) return value.toDate();
        return null;
      };

      const totalBookings = bookings.length;

      const todayBookings = bookings.filter((booking) => {
        const created = toDate(booking.created_at ?? booking.createdAt);
        if (!created) return false;
        return (
          created.getFullYear() === today.getFullYear() &&
          created.getMonth() === today.getMonth() &&
          created.getDate() === today.getDate()
        );
      }).length;

      const monthlyBookings = bookings.filter((booking) => {
        const created = toDate(booking.created_at ?? booking.createdAt);
        if (!created) return false;
        return created >= startOfMonth;
      });

      const monthlyRevenue = monthlyBookings.reduce((sum, booking) => {
        const price = Number(booking.total_price ?? booking.amount ?? 0);
        return sum + (Number.isFinite(price) ? price : 0);
      }, 0);

      setStats({
        totalBookings,
        todayBookings,
        monthlyRevenue,
        activeUsers: users.length
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
