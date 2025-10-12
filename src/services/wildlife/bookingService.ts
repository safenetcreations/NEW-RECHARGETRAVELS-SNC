
import { getDocs, getDoc, collection, query, where, orderBy, addDoc, updateDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '@/lib/firebase';
import type { WildlifeBooking } from './types';

export async function createWildlifeBooking(bookingData: {
  package_id: string;
  start_date: string;
  end_date: string;
  total_participants: number;
  subtotal: number;
  discount_amount?: number;
  total_amount: number;
  special_requests?: string;
}) {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      return { data: null, error: new Error('User must be logged in') };
    }

    // Generate a unique booking number
    const bookingNumber = `WB${Date.now().toString().slice(-6)}`;

    const docRef = await addDoc(collection(db, 'wildlife_bookings'), {
      booking_number: bookingNumber,
      user_id: user.uid,
      ...bookingData,
      discount_amount: bookingData.discount_amount || 0,
      payment_status: 'pending',
      booking_status: 'pending',
      created_at: new Date().toISOString()
    });
    
    const docSnap = await getDoc(docRef);
    const data = { id: docSnap.id, ...docSnap.data() };
    
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getUserWildlifeBookings() {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      return { data: null, error: new Error('User must be logged in') };
    }

    const q = query(
      collection(db, 'wildlife_bookings'),
      where('user_id', '==', user.uid),
      orderBy('created_at', 'desc')
    );
    const snapshot = await getDocs(q);
    const bookings = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as any[];
    
    // Fetch safari packages for each booking
    const bookingsWithPackages = await Promise.all(
      bookings.map(async (booking) => {
        if (booking.package_id) {
          const packageDoc = await getDoc(doc(db, 'safari_packages', booking.package_id));
          if (packageDoc.exists()) {
            booking.safari_packages = { id: packageDoc.id, ...packageDoc.data() };
          }
        }
        return booking;
      })
    );
    
    return { data: bookingsWithPackages, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateWildlifeBookingStatus(bookingId: string, status: string) {
  try {
    const bookingRef = doc(db, 'wildlife_bookings', bookingId);
    await updateDoc(bookingRef, { 
      booking_status: status,
      updated_at: new Date().toISOString()
    });
    
    const updatedDoc = await getDoc(bookingRef);
    const data = { id: updatedDoc.id, ...updatedDoc.data() };
    
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
