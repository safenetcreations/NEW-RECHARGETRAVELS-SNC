
import type { Booking, BookingFormData, BookingFilters } from '../types';
import { dbService, authService, storageService } from '@/lib/firebase-services';

// Transform database row to our Booking type
const transformDbBookingToBooking = (dbBooking: any): Booking => {
  return {
    id: dbBooking.id,
    bookingNumber: dbBooking.booking_reference || `TXF-${dbBooking.id.slice(0, 8)}`,
    userId: dbBooking.customer_id || '',
    driverId: dbBooking.driver_id,
    pickupLocation: {
      lat: 0,
      lng: 0,
      address: dbBooking.pickup_location || '',
    },
    dropoffLocation: {
      lat: 0,
      lng: 0,
      address: dbBooking.dropoff_location || '',
    },
    pickupDatetime: new Date(`${dbBooking.pickup_date}T${dbBooking.pickup_time}`),
    passengerCount: dbBooking.passenger_count || 1,
    luggageCount: 0,
    vehicleType: 'sedan',
    totalPrice: dbBooking.final_price || dbBooking.quoted_price || 0,
    status: dbBooking.booking_status || 'pending',
    specialRequirements: dbBooking.special_requirements,
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    distance: dbBooking.estimated_distance_km,
    duration: dbBooking.duration_days ? dbBooking.duration_days * 24 * 60 : undefined,
    createdAt: new Date(dbBooking.created_at),
    updatedAt: new Date(dbBooking.updated_at || dbBooking.created_at),
  };
};

export const bookingService = {
  async getBookings(filters?: BookingFilters): Promise<Booking[]> {
    let query = supabase
      .from('driver_bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.in('booking_status', filters.status);
    }

    if (filters?.searchQuery) {
      query = query.or(`customer_notes.ilike.%${filters.searchQuery}%,pickup_location.ilike.%${filters.searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []).map(transformDbBookingToBooking);
  },

  async createBooking(data: BookingFormData): Promise<Booking> {
    // Get current user for customer_id
    const { data: { user } } = await supabase.auth.getUser();
    
    const bookingData = {
      customer_id: user?.id || '',
      driver_id: '',
      vehicle_id: '',
      pickup_location: data.pickupLocation.address,
      dropoff_location: data.dropoffLocation.address,
      pickup_date: data.pickupDate,
      pickup_time: data.pickupTime,
      passenger_count: data.passengerCount,
      service_type: 'transport_only' as const,
      duration_days: 1,
      special_requirements: data.specialRequirements,
      estimated_distance_km: 50,
      quoted_price: 2000,
      currency: 'LKR',
      booking_status: 'pending' as const,
      customer_notes: `Contact: ${data.contactName} (${data.contactEmail}, ${data.contactPhone})`,
    };

    const { data: booking, error } = await supabase
      .from('driver_bookings')
      .insert(bookingData)
      .select()
      .single();

    if (error) throw error;
    
    const newBooking = transformDbBookingToBooking(booking);

    // Send booking confirmation
    try {
      console.log('Sending booking confirmation for:', booking.id);
      await supabase.functions.invoke('send-booking-confirmation', {
        body: { bookingId: booking.id }
      });
      console.log('Booking confirmation sent successfully');
    } catch (confirmationError) {
      console.error('Failed to send booking confirmation:', confirmationError);
      // Don't throw error here - booking was created successfully
    }
    
    return newBooking;
  },

  async updateBooking(id: string, data: Partial<Booking>): Promise<Booking> {
    const updateData: any = {};
    
    if (data.status) updateData.booking_status = data.status;
    if (data.specialRequirements) updateData.special_requirements = data.specialRequirements;
    if (data.driverId) updateData.driver_id = data.driverId;

    const { data: booking, error } = await supabase
      .from('driver_bookings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return transformDbBookingToBooking(booking);
  },

  async cancelBooking(id: string): Promise<void> {
    const { error } = await supabase
      .from('driver_bookings')
      .update({ booking_status: 'cancelled' })
      .eq('id', id);

    if (error) throw error;
  },

  async getUserBookings(): Promise<Booking[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];

    const { data, error } = await supabase
      .from('driver_bookings')
      .select('*')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(transformDbBookingToBooking);
  },

  async getDrivers(): Promise<any[]> {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('is_active', true);

    if (error) return [];
    return data || [];
  },

  async assignDriver(bookingId: string, driverId: string): Promise<void> {
    const { error } = await supabase
      .from('driver_bookings')
      .update({ driver_id: driverId })
      .eq('id', bookingId);

    if (error) throw error;
  },
};
