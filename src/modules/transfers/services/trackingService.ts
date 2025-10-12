
import type { TrackingData, Location, Notification } from '../types';
import { dbService, authService, storageService } from '@/lib/firebase-services';

export const trackingService = {
  async updateDriverLocation(
    bookingId: string,
    driverId: string,
    location: { latitude: number; longitude: number; heading?: number; speed?: number }
  ): Promise<void> {
    const { error } = await dbService.create('driver_locations',({
      booking_id: bookingId,
      driver_id: driverId,
      latitude: location.latitude,
      longitude: location.longitude,
      heading: location.heading,
      speed_kmh: location.speed,
    });

    if (error) throw error;
  },

  async getTrackingHistory(bookingId: string): Promise<TrackingData[]> {
    const { data, error } = await supabase
      .from('driver_locations')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return (data || []).map((item: any) => ({
      id: item.id,
      bookingId: item.booking_id,
      driverId: item.driver_id,
      latitude: item.latitude,
      longitude: item.longitude,
      heading: item.heading,
      speed: item.speed_kmh,
      accuracy: 10, // Default accuracy
      timestamp: new Date(item.created_at),
    }));
  },

  async getLatestDriverLocation(bookingId: string): Promise<TrackingData | null> {
    const { data, error } = await supabase
      .from('driver_locations')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return {
      id: data.id,
      bookingId: data.booking_id,
      driverId: data.driver_id,
      latitude: data.latitude,
      longitude: data.longitude,
      heading: data.heading,
      speed: data.speed_kmh,
      accuracy: 10, // Default accuracy
      timestamp: new Date(data.created_at),
    };
  },

  subscribeToDriverLocation(
    bookingId: string,
    callback: (location: TrackingData) => void
  ): () => void {
    const channel = supabase
      .channel(`driver_locations:${bookingId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'driver_locations',
          filter: `booking_id=eq.${bookingId}`,
        },
        (payload) => {
          const data = payload.new;
          callback({
            id: data.id,
            bookingId: data.booking_id,
            driverId: data.driver_id,
            latitude: data.latitude,
            longitude: data.longitude,
            heading: data.heading,
            speed: data.speed_kmh,
            accuracy: 10,
            timestamp: new Date(data.created_at),
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // Add the missing methods that useBookingTracking expects
  subscribeToTracking(
    bookingId: string,
    onUpdate: (data: TrackingData) => void,
    onError: (error: Error) => void
  ): () => void {
    return this.subscribeToDriverLocation(bookingId, onUpdate);
  },

  async updateLocation(
    bookingId: string,
    location: Omit<TrackingData, 'id' | 'bookingId' | 'driverId' | 'timestamp'>
  ): Promise<void> {
    // Get current user to use as driver ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    await this.updateDriverLocation(bookingId, user.id, {
      latitude: location.latitude,
      longitude: location.longitude,
      heading: location.heading,
      speed: location.speed,
    });
  },

  async searchLocations(query: string): Promise<Location[]> {
    try {
      console.log('Searching locations for:', query);
      
      const { data, error } = await supabase.functions.invoke('search-locations', {
        body: { query }
      });

      if (error) {
        console.error('Location search error:', error);
        throw new Error(error.message || 'Failed to search locations');
      }

      console.log('Location search results:', data);
      
      return (data.results || []).map((result: any) => ({
        lat: result.lat,
        lng: result.lng,
        address: result.address,
        name: result.name
      }));
    } catch (error) {
      console.error('Location search service error:', error);
      // Return empty array on error instead of throwing
      return [];
    }
  },

  subscribeToNotifications(
    bookingId: string,
    callback: (notification: Notification) => void
  ): () => void {
    // Mock implementation since we don't have notifications table in current schema
    console.log('Notifications subscription not implemented for booking:', bookingId);
    
    return () => {
      // Cleanup function
    };
  },
};
