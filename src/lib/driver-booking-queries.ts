
import { collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, orderBy } from 'firebase/firestore';

import { db, auth } from '@/lib/firebase';

import type { DriverBooking, DriverBookingFormData } from '@/types/driver-booking';

import { getOrCreateCustomer } from './customer-service';



export interface EnhancedDriverBooking extends DriverBooking {

  driver: {

    id: string

    name: string

    first_name: string

    last_name: string

    phone: string

    email: string

    rating: number

    languages: string[]

    profile_photo_url?: string

  }

  vehicle: {

    id: string

    make: string

    model: string

    image_urls: string[]

    seats: number

    features: string[]

  }

  customer: {

    id: string

    first_name: string

    last_name: string

    phone_number: string

    email: string

  }

}



export async function createEnhancedDriverBooking(

  driverId: string,

  vehicleId: string,

  formData: DriverBookingFormData

): Promise<EnhancedDriverBooking> {

  const user = auth.currentUser;

  if (!user) throw new Error('User not authenticated');



  const customer = await getOrCreateCustomer(user.uid, user.email || '');



  const bookingData = {

    customer_id: customer.id,

    driver_id: driverId,

    vehicle_id: vehicleId,

    // ... other booking data

  };



  const docRef = await addDoc(collection(db, 'driver_bookings'), bookingData);

  const bookingSnapshot = await getDoc(docRef);

  const booking = { id: bookingSnapshot.id, ...bookingSnapshot.data() };



  // Fetch related data



  return booking as EnhancedDriverBooking;

}



export async function getDriverBookings(driverId: string): Promise<EnhancedDriverBooking[]> {

  const bookingsCollection = collection(db, 'driver_bookings');

  const q = query(bookingsCollection, where('driver_id', '==', driverId), orderBy('created_at', 'desc'));

  const snapshot = await getDocs(q);

  const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));



  // Fetch related data for each booking



  return bookings as EnhancedDriverBooking[];

}



export async function updateBookingStatusWithNotes(

  bookingId: string, 

  status: DriverBooking['booking_status'],

  driverNotes?: string,

  quotedPrice?: number

): Promise<void> {

  const updateData: any = { 

    booking_status: status,

    updated_at: new Date().toISOString()

  };



  if (driverNotes) updateData.driver_notes = driverNotes;

  if (quotedPrice) updateData.quoted_price = quotedPrice;



  if (status === 'confirmed') {

    const user = auth.currentUser;

    updateData.confirmed_by = user?.uid;

    updateData.confirmed_at = new Date().toISOString();

  }



  const bookingDoc = doc(db, 'driver_bookings', bookingId);

  await updateDoc(bookingDoc, updateData);

}



export async function shareWhatsAppContact(bookingId: string): Promise<void> {

  const bookingDoc = doc(db, 'driver_bookings', bookingId);

  await updateDoc(bookingDoc, {

    whatsapp_shared: true,

    whatsapp_shared_at: new Date().toISOString()

  });

}


