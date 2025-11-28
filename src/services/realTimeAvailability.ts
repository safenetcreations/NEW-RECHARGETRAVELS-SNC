import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  Timestamp,
  updateDoc,
  addDoc,
  serverTimestamp,
  getDocs,
  limit
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Types
export interface AvailabilitySlot {
  id: string;
  date: string;
  timeSlot: 'morning' | 'afternoon' | 'evening' | 'full_day';
  isAvailable: boolean;
  bookedCount: number;
  maxCapacity: number;
  priceModifier: number; // 1.0 = normal, 1.2 = 20% surge
}

export interface DriverAvailability {
  driverId: string;
  driverName: string;
  date: string;
  status: 'available' | 'booked' | 'on_trip' | 'offline';
  currentLocation?: string;
  nextAvailableTime?: string;
}

export interface TourAvailability {
  tourId: string;
  tourName: string;
  date: string;
  spotsAvailable: number;
  totalSpots: number;
  pricePerPerson: number;
  status: 'available' | 'limited' | 'full' | 'cancelled';
}

export interface RealTimeNotification {
  id: string;
  type: 'booking_confirmed' | 'driver_assigned' | 'price_drop' | 'limited_availability' | 'review_received';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: Record<string, any>;
}

// Real-time listeners
export function subscribeToDriverAvailability(
  driverId: string,
  date: string,
  callback: (availability: DriverAvailability | null) => void
): () => void {
  const availabilityRef = collection(db, 'driver_availability');
  const q = query(
    availabilityRef,
    where('driver_id', '==', driverId),
    where('date', '==', date)
  );

  return onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      callback(null);
      return;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    callback({
      driverId: data.driver_id,
      driverName: data.driver_name || 'Unknown',
      date: data.date,
      status: data.status || 'available',
      currentLocation: data.current_location,
      nextAvailableTime: data.next_available_time,
    });
  }, (error) => {
    console.error('Error subscribing to driver availability:', error);
    callback(null);
  });
}

export function subscribeToTourAvailability(
  tourId: string,
  date: string,
  callback: (availability: TourAvailability | null) => void
): () => void {
  const availabilityRef = collection(db, 'tour_availability');
  const q = query(
    availabilityRef,
    where('tour_id', '==', tourId),
    where('date', '==', date)
  );

  return onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      callback(null);
      return;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    const spotsAvailable = data.total_spots - (data.booked_spots || 0);

    callback({
      tourId: data.tour_id,
      tourName: data.tour_name || 'Tour',
      date: data.date,
      spotsAvailable,
      totalSpots: data.total_spots,
      pricePerPerson: data.price_per_person,
      status: spotsAvailable === 0 ? 'full' :
              spotsAvailable <= 3 ? 'limited' : 'available',
    });
  }, (error) => {
    console.error('Error subscribing to tour availability:', error);
    callback(null);
  });
}

export function subscribeToUserNotifications(
  userId: string,
  callback: (notifications: RealTimeNotification[]) => void
): () => void {
  const notificationsRef = collection(db, 'user_notifications');
  const q = query(
    notificationsRef,
    where('user_id', '==', userId),
    orderBy('timestamp', 'desc'),
    limit(20)
  );

  return onSnapshot(q, (snapshot) => {
    const notifications: RealTimeNotification[] = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        type: data.type,
        title: data.title,
        message: data.message,
        timestamp: data.timestamp?.toDate() || new Date(),
        read: data.read || false,
        data: data.data,
      };
    });

    callback(notifications);
  }, (error) => {
    console.error('Error subscribing to notifications:', error);
    callback([]);
  });
}

// Check availability for a date range
export async function checkAvailabilityRange(
  resourceType: 'driver' | 'tour' | 'vehicle',
  resourceId: string,
  startDate: string,
  endDate: string
): Promise<AvailabilitySlot[]> {
  const collectionName = `${resourceType}_availability`;
  const availabilityRef = collection(db, collectionName);

  const q = query(
    availabilityRef,
    where(`${resourceType}_id`, '==', resourceId),
    where('date', '>=', startDate),
    where('date', '<=', endDate),
    orderBy('date', 'asc')
  );

  try {
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        date: data.date,
        timeSlot: data.time_slot || 'full_day',
        isAvailable: data.is_available !== false,
        bookedCount: data.booked_count || 0,
        maxCapacity: data.max_capacity || 1,
        priceModifier: data.price_modifier || 1.0,
      };
    });
  } catch (error) {
    console.error('Error checking availability range:', error);
    return [];
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const notificationRef = doc(db, 'user_notifications', notificationId);
  await updateDoc(notificationRef, { read: true });
}

// Create a notification (for admin/system use)
export async function createNotification(
  userId: string,
  notification: Omit<RealTimeNotification, 'id' | 'timestamp' | 'read'>
): Promise<string> {
  const notificationsRef = collection(db, 'user_notifications');
  const docRef = await addDoc(notificationsRef, {
    user_id: userId,
    ...notification,
    timestamp: serverTimestamp(),
    read: false,
  });
  return docRef.id;
}

// Get live booking count for a tour/date
export function subscribeToBooKingCount(
  tourId: string,
  date: string,
  callback: (count: number) => void
): () => void {
  const bookingsRef = collection(db, 'bookings');
  const q = query(
    bookingsRef,
    where('tour_id', '==', tourId),
    where('date', '==', date),
    where('status', 'in', ['confirmed', 'pending'])
  );

  return onSnapshot(q, (snapshot) => {
    callback(snapshot.size);
  }, (error) => {
    console.error('Error subscribing to booking count:', error);
    callback(0);
  });
}

// Export default service object
const realTimeAvailabilityService = {
  subscribeToDriverAvailability,
  subscribeToTourAvailability,
  subscribeToUserNotifications,
  checkAvailabilityRange,
  markNotificationAsRead,
  createNotification,
  subscribeToBooKingCount,
};

export default realTimeAvailabilityService;
