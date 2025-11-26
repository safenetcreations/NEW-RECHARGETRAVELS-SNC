
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import {
  getAdminDashboardStats,
  getAllBookings,
  updateBookingStatus,
  createLodge,
  updateLodge,
  deleteLodge,
  createActivity,
  updateActivity,
  deleteActivity,
  bulkUpdateLodgeStatus,
  bulkUpdateActivityStatus,
  type AdminStats,
  type Lodge,
  type Activity
} from '@/services/wildlife/adminService';
import { getLodges, getWildlifeActivities } from '@/services/wildlifeService';

export const useWildlifeAdmin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Dashboard Stats Query
  const { 
    data: dashboardStats, 
    isLoading: statsLoading, 
    error: statsError 
  } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const { data, error } = await getAdminDashboardStats();
      if (error) throw error;
      return data;
    }
  });

  // Lodges Query
  const { 
    data: lodges, 
    isLoading: lodgesLoading, 
    error: lodgesError 
  } = useQuery({
    queryKey: ['admin-lodges'],
    queryFn: async () => {
      const { data, error } = await getLodges();
      if (error) throw error;
      return data;
    }
  });

  // Activities Query
  const { 
    data: activities, 
    isLoading: activitiesLoading, 
    error: activitiesError 
  } = useQuery({
    queryKey: ['admin-activities'],
    queryFn: async () => {
      const { data, error } = await getWildlifeActivities();
      if (error) throw error;
      return data;
    }
  });

  // Bookings Query
  const { 
    data: bookings, 
    isLoading: bookingsLoading, 
    error: bookingsError 
  } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const { data, error } = await getAllBookings();
      if (error) throw error;
      return data;
    }
  });

  // Lodge Mutations
  const createLodgeMutation = useMutation({
    mutationFn: createLodge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lodges'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
      toast({
        title: "Success",
        description: "Lodge created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create lodge",
        variant: "destructive",
      });
    }
  });

  const updateLodgeMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Lodge> }) => 
      updateLodge(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lodges'] });
      toast({
        title: "Success",
        description: "Lodge updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to update lodge",
        variant: "destructive",
      });
    }
  });

  const deleteLodgeMutation = useMutation({
    mutationFn: deleteLodge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lodges'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
      toast({
        title: "Success",
        description: "Lodge deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete lodge", 
        variant: "destructive",
      });
    }
  });

  // Activity Mutations
  const createActivityMutation = useMutation({
    mutationFn: createActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-activities'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
      toast({
        title: "Success",
        description: "Activity created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create activity",
        variant: "destructive",
      });
    }
  });

  const updateActivityMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Activity> }) => 
      updateActivity(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-activities'] });
      toast({
        title: "Success",
        description: "Activity updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update activity",
        variant: "destructive",
      });
    }
  });

  const deleteActivityMutation = useMutation({
    mutationFn: deleteActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-activities'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
      toast({
        title: "Success",
        description: "Activity deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete activity",
        variant: "destructive",
      });
    }
  });

  // Booking Mutations
  const updateBookingMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: string; notes?: string }) => 
      updateBookingStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast({
        title: "Success",
        description: "Booking status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    }
  });

  // Bulk Operations
  const bulkLodgeStatusMutation = useMutation({
    mutationFn: ({ ids, isActive }: { ids: string[]; isActive: boolean }) => 
      bulkUpdateLodgeStatus(ids, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lodges'] });
      toast({
        title: "Success",
        description: "Lodge statuses updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update lodge statuses",
        variant: "destructive",
      });
    }
  });

  const bulkActivityStatusMutation = useMutation({
    mutationFn: ({ ids, isActive }: { ids: string[]; isActive: boolean }) => 
      bulkUpdateActivityStatus(ids, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-activities'] });
      toast({
        title: "Success",
        description: "Activity statuses updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update activity statuses",
        variant: "destructive",
      });
    }
  });

  return {
    // Data
    dashboardStats,
    lodges,
    activities,
    bookings,
    
    // Loading states
    isLoading: statsLoading || lodgesLoading || activitiesLoading || bookingsLoading,
    statsLoading,
    lodgesLoading,
    activitiesLoading,
    bookingsLoading,
    
    // Errors
    error: statsError || lodgesError || activitiesError || bookingsError,
    
    // Lodge operations
    createLodge: createLodgeMutation.mutate,
    updateLodge: updateLodgeMutation.mutate,
    deleteLodge: deleteLodgeMutation.mutate,
    
    // Activity operations
    createActivity: createActivityMutation.mutate,
    updateActivity: updateActivityMutation.mutate,
    deleteActivity: deleteActivityMutation.mutate,
    
    // Booking operations
    updateBookingStatus: updateBookingMutation.mutate,
    
    // Bulk operations
    bulkUpdateLodgeStatus: bulkLodgeStatusMutation.mutate,
    bulkUpdateActivityStatus: bulkActivityStatusMutation.mutate,
    
    // Mutation loading states
    isCreatingLodge: createLodgeMutation.isPending,
    isUpdatingLodge: updateLodgeMutation.isPending,
    isDeletingLodge: deleteLodgeMutation.isPending,
    isCreatingActivity: createActivityMutation.isPending,
    isUpdatingActivity: updateActivityMutation.isPending,
    isDeletingActivity: deleteActivityMutation.isPending,
    isUpdatingBooking: updateBookingMutation.isPending
  };
};
