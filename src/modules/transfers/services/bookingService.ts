
import { collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, orderBy, QueryConstraint } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import type { Booking, BookingFormData, BookingFilters } from '../types';

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
    const bookingsCollection = collection(db, 'driver_bookings');
    const constraints: QueryConstraint[] = [orderBy('created_at', 'desc')];

    if (filters?.status) {
      constraints.push(where('booking_status', 'in', filters.status));
    }

    if (filters?.searchQuery) {
      // Firestore does not support 'or' queries in the same way as Supabase.
      // This is a simplified search on one field.
      constraints.push(where('customer_notes', '>=', filters.searchQuery));
      constraints.push(where('customer_notes', '<=', filters.searchQuery + '\uf8ff'));
    }

    const q = query(bookingsCollection, ...constraints);
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return (data || []).map(transformDbBookingToBooking);
  },

  async createBooking(data: BookingFormData): Promise<Booking> {
    const user = auth.currentUser;
    
    const bookingData = {
      customer_id: user?.uid || '',
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
      created_at: new Date(),
      updated_at: new Date(),
    };

    const docRef = await addDoc(collection(db, 'driver_bookings'), bookingData);
    
    const newBooking = transformDbBookingToBooking({ id: docRef.id, ...bookingData });

    // The function invocation needs to be replaced with a Firebase Cloud Function call
    console.log('Booking confirmation logic to be implemented with Firebase Cloud Functions');
    
    return newBooking;
  },

  async updateBooking(id: string, data: Partial<Booking>): Promise<Booking> {
    const updateData: any = {};
    
    if (data.status) updateData.booking_status = data.status;
    if (data.specialRequirements) updateData.special_requirements = data.specialRequirements;
    if (data.driverId) updateData.driver_id = data.driverId;

    const bookingDoc = doc(db, 'driver_bookings', id);
    await updateDoc(bookingDoc, updateData);

    const snapshot = await getDoc(bookingDoc);
    const updatedBooking = transformDbBookingToBooking({ id: snapshot.id, ...snapshot.data() });
    
    return updatedBooking;
  },

  async cancelBooking(id: string): Promise<void> {
    const bookingDoc = doc(db, 'driver_bookings', id);
    await updateDoc(bookingDoc, { booking_status: 'cancelled' });
  },

  async getUserBookings(): Promise<Booking[]> {
    const user = auth.currentUser;
    
    if (!user) return [];

    const bookingsCollection = collection(db, 'driver_bookings');
    const q = query(bookingsCollection, where('customer_id', '==', user.uid), orderBy('created_at', 'desc'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return (data || []).map(transformDbBookingToBooking);
  },

  async getDrivers(): Promise<any[]> {
    const driversCollection = collection(db, 'drivers');
    const q = query(driversCollection, where('is_active', '==', true));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return data || [];
  },

  async assignDriver(bookingId: string, driverId: string): Promise<void> {
    const bookingDoc = doc(db, 'driver_bookings', bookingId);
    await updateDoc(bookingDoc, { driver_id: driverId });
  },
};
