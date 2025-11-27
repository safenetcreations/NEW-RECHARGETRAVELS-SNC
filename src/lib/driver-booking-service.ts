
import { dbService, authService, storageService } from '@/lib/firebase-services'
import type { DriverBooking, DriverBookingFormData, Customer, UserProfile } from '@/types/driver-booking'

export async function createDriverBooking(
  driverId: string,
  vehicleId: string,
  formData: DriverBookingFormData
): Promise<DriverBooking> {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  // Get or create customer record
  const customer = await getOrCreateCustomer(user.uid, user.email || '');

  const bookingData = {
    customer_id: customer.id,
    driver_id: driverId,
    vehicle_id: vehicleId,
    pickup_location: formData.pickup_location,
    dropoff_location: formData.dropoff_location,
    pickup_date: formData.pickup_date,
    pickup_time: formData.pickup_time,
    return_date: formData.return_date,
    return_time: formData.return_time,
    passenger_count: formData.passenger_count,
    service_type: formData.service_type,
    duration_days: formData.duration_days || 1,
    special_requirements: formData.special_requirements,
    estimated_distance_km: formData.estimated_distance_km,
    customer_notes: formData.customer_notes,
    booking_status: 'pending' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const result = await dbService.create('driver_bookings', bookingData);
  return result as DriverBooking;
}

export async function getOrCreateCustomer(userId: string, email: string): Promise<Customer> {
  try {
    // First check if customer exists
    const customers = await dbService.list('customers', [
      { field: 'user_id', operator: '==', value: userId }
    ]);

    if (customers && customers.length > 0) {
      return customers[0] as Customer;
    }

    // Create customer if doesn't exist
    const newCustomer = await dbService.create('customers', {
      user_id: userId,
      first_name: '',
      last_name: '',
      phone_number: '',
      preferred_language: 'en',
      email: email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    return newCustomer as Customer;
  } catch (error) {
    console.error('Error in getOrCreateCustomer:', error);
    throw error;
  }
}

export async function getUserBookings(userId: string): Promise<DriverBooking[]> {
  try {
    // Get bookings for this customer
    const bookings = await dbService.list('driver_bookings', [
      { field: 'customer_id', operator: '==', value: userId }
    ], 'created_at', undefined);

    // For each booking, get driver and vehicle details
    const enrichedBookings = await Promise.all(
      bookings.map(async (booking: any) => {
        const [driver, vehicle] = await Promise.all([
          dbService.get('drivers', booking.driver_id),
          dbService.get('vehicles', booking.vehicle_id)
        ]);

        return {
          ...booking,
          drivers: driver ? { name: (driver as any).name, phone: (driver as any).phone, email: (driver as any).email } : null,
          vehicles: vehicle ? { make: (vehicle as any).make, model: (vehicle as any).model, image_urls: (vehicle as any).image_urls } : null
        };
      })
    );

    return enrichedBookings as DriverBooking[];
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
}

export async function updateBookingStatus(
  bookingId: string, 
  status: DriverBooking['booking_status']
): Promise<void> {
  try {
    await dbService.update('driver_bookings', bookingId, { 
      booking_status: status,
      updated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
}

export async function checkDriverAvailability(
  driverId: string,
  startDate: string,
  endDate: string
): Promise<boolean> {
  try {
    // Get all confirmed and in-progress bookings for this driver
    const bookings = await dbService.list('driver_bookings', [
      { field: 'driver_id', operator: '==', value: driverId },
      { field: 'booking_status', operator: 'in', value: ['confirmed', 'in_progress'] }
    ]);

    // Check for date conflicts
    const hasConflict = bookings.some((booking: any) => {
      const bookingStart = new Date(booking.pickup_date);
      const bookingEnd = new Date(booking.return_date);
      const requestedStart = new Date(startDate);
      const requestedEnd = new Date(endDate);

      // Check if dates overlap
      return bookingStart <= requestedEnd && bookingEnd >= requestedStart;
    });

    return !hasConflict;
  } catch (error) {
    console.error('Error checking driver availability:', error);
    throw error;
  }
}
