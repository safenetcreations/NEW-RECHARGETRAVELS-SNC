
import { getDocs, getDoc, collection, query, where, orderBy, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/services/firebaseService';

export async function createWildlifeBooking(bookingData: any) {
  try {
    const docRef = await addDoc(collection(db, 'wildlife_bookings'), {
      ...bookingData,
      created_at: new Date().toISOString(),
      status: 'pending'
    });
    
    const docSnap = await getDoc(docRef);
    const data = { id: docSnap.id, ...docSnap.data() };
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getUserWildlifeBookings(user?: any) {
  try {
    let q;
    if (user) {
      q = query(
        collection(db, 'wildlife_bookings'),
        where('user_id', '==', user.id),
        orderBy('created_at', 'desc')
      );
    } else {
      q = query(
        collection(db, 'wildlife_bookings'),
        orderBy('created_at', 'desc')
      );
    }
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...(docSnap.data() as any) }));
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateWildlifeBookingStatus(bookingId: string, status: string) {
  try {
    await updateDoc(doc(db, 'wildlife_bookings', bookingId), {
      status,
      updated_at: new Date().toISOString()
    });
    
    const docSnap = await getDoc(doc(db, 'wildlife_bookings', bookingId));
    const data = { id: docSnap.id, ...docSnap.data() };
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
