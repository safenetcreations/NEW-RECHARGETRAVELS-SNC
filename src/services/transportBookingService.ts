import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Generate a short booking ID
const generateBookingId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'RT';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export interface TransportBookingData {
  type: 'airport-transfer' | 'personal-driver' | 'tour' | 'trail';
  // Common fields
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pickupAddress?: string;
  specialRequests?: string;
  price: number;
  // Airport transfer specific
  transferType?: 'fromAirport' | 'toAirport';
  airport?: string;
  location?: string;
  flightNumber?: string;
  // Personal driver specific
  driverId?: string;
  driverName?: string;
  vehicleId?: string;
  vehicleName?: string;
  serviceType?: 'hourly' | 'daily';
  hours?: number;
  days?: number;
  // Tour specific
  tourId?: string;
  tourName?: string;
  participants?: number;
  pickupTime?: string;
  // Trail service specific
  serviceId?: string;
  serviceName?: string;
  duration?: number;
  guideRequired?: boolean;
  equipmentRental?: boolean;
  fitnessLevel?: string;
  // Date/time
  date?: Date | string;
  startDate?: Date | string;
  endDate?: Date | string;
  time?: string;
  startTime?: string;
  // Common
  passengers?: number;
  luggage?: number;
}

export interface TransportBooking extends TransportBookingData {
  id: string;
  bookingId: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: any;
  updatedAt: any;
  assignedDriverId?: string;
  assignedVehicleId?: string;
  statusNotes?: string;
  cancellationReason?: string;
  cancelledAt?: any;
}

// Create a new transport booking
export const createTransportBooking = async (bookingData: TransportBookingData): Promise<TransportBooking> => {
  try {
    const bookingRef = collection(db, 'transportBookings');
    const bookingId = generateBookingId();

    const booking = {
      ...bookingData,
      bookingId,
      status: 'pending' as const,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(bookingRef, booking);

    // Try to send confirmation email
    try {
      await sendBookingConfirmationEmail({
        id: docRef.id,
        bookingId,
        ...booking,
      } as TransportBooking);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the booking if email fails
    }

    return { id: docRef.id, bookingId, ...booking } as TransportBooking;
  } catch (error) {
    console.error('Error creating transport booking:', error);
    throw error;
  }
};

// Get booking by document ID
export const getTransportBooking = async (id: string): Promise<TransportBooking | null> => {
  try {
    const docRef = doc(db, 'transportBookings', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as TransportBooking;
    }
    return null;
  } catch (error) {
    console.error('Error getting transport booking:', error);
    throw error;
  }
};

// Get booking by booking ID (e.g., RT123456)
export const getTransportBookingByBookingId = async (bookingId: string): Promise<TransportBooking | null> => {
  try {
    const bookingsRef = collection(db, 'transportBookings');
    const q = query(bookingsRef, where('bookingId', '==', bookingId));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as TransportBooking;
    }
    return null;
  } catch (error) {
    console.error('Error getting transport booking by ID:', error);
    throw error;
  }
};

// Get bookings by email
export const getTransportBookingsByEmail = async (email: string): Promise<TransportBooking[]> => {
  try {
    const bookingsRef = collection(db, 'transportBookings');
    const q = query(
      bookingsRef,
      where('email', '==', email),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TransportBooking));
  } catch (error) {
    console.error('Error getting transport bookings by email:', error);
    throw error;
  }
};

// Get all bookings (for admin)
export const getAllTransportBookings = async (filters?: {
  status?: string;
  type?: string;
}): Promise<TransportBooking[]> => {
  try {
    const bookingsRef = collection(db, 'transportBookings');
    let q = query(bookingsRef, orderBy('createdAt', 'desc'));

    if (filters?.status) {
      q = query(bookingsRef, where('status', '==', filters.status), orderBy('createdAt', 'desc'));
    }

    if (filters?.type) {
      q = query(bookingsRef, where('type', '==', filters.type), orderBy('createdAt', 'desc'));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TransportBooking));
  } catch (error) {
    console.error('Error getting all transport bookings:', error);
    throw error;
  }
};

// Update booking status
export const updateTransportBookingStatus = async (
  id: string,
  status: TransportBooking['status'],
  notes?: string
): Promise<boolean> => {
  try {
    const docRef = doc(db, 'transportBookings', id);
    await updateDoc(docRef, {
      status,
      statusNotes: notes || '',
      updatedAt: serverTimestamp(),
    });

    // Send status update notification
    const booking = await getTransportBooking(id);
    if (booking) {
      await sendStatusUpdateEmail(booking, status);
    }

    return true;
  } catch (error) {
    console.error('Error updating transport booking status:', error);
    throw error;
  }
};

// Cancel booking
export const cancelTransportBooking = async (id: string, reason?: string): Promise<boolean> => {
  try {
    const docRef = doc(db, 'transportBookings', id);
    await updateDoc(docRef, {
      status: 'cancelled',
      cancellationReason: reason || '',
      cancelledAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Send cancellation email
    const booking = await getTransportBooking(id);
    if (booking) {
      await sendCancellationEmail(booking, reason);
    }

    return true;
  } catch (error) {
    console.error('Error cancelling transport booking:', error);
    throw error;
  }
};

// Assign driver to booking
export const assignDriverToBooking = async (
  bookingId: string,
  driverId: string,
  vehicleId: string
): Promise<boolean> => {
  try {
    const docRef = doc(db, 'transportBookings', bookingId);
    await updateDoc(docRef, {
      assignedDriverId: driverId,
      assignedVehicleId: vehicleId,
      status: 'confirmed',
      updatedAt: serverTimestamp(),
    });

    // Send driver assignment notification
    const booking = await getTransportBooking(bookingId);
    if (booking) {
      await sendDriverAssignmentEmail(booking, driverId, vehicleId);
    }

    return true;
  } catch (error) {
    console.error('Error assigning driver:', error);
    throw error;
  }
};

// Email notification functions (placeholder - integrate with your email service)
const sendBookingConfirmationEmail = async (booking: TransportBooking): Promise<void> => {
  // Integrate with your email service (e.g., SendGrid, Mailgun, etc.)
  console.log('Sending booking confirmation email for:', booking.bookingId);

  // Example: Call your API endpoint
  try {
    await fetch('/api/emails/booking-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
  }
};

const sendStatusUpdateEmail = async (booking: TransportBooking, newStatus: string): Promise<void> => {
  console.log('Sending status update email for:', booking.bookingId, 'New status:', newStatus);

  try {
    await fetch('/api/emails/status-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking, newStatus }),
    });
  } catch (error) {
    console.error('Failed to send status update email:', error);
  }
};

const sendCancellationEmail = async (booking: TransportBooking, reason?: string): Promise<void> => {
  console.log('Sending cancellation email for:', booking.bookingId);

  try {
    await fetch('/api/emails/cancellation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking, reason }),
    });
  } catch (error) {
    console.error('Failed to send cancellation email:', error);
  }
};

const sendDriverAssignmentEmail = async (
  booking: TransportBooking,
  driverId: string,
  vehicleId: string
): Promise<void> => {
  console.log('Sending driver assignment email for:', booking.bookingId);

  try {
    await fetch('/api/emails/driver-assigned', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking, driverId, vehicleId }),
    });
  } catch (error) {
    console.error('Failed to send driver assignment email:', error);
  }
};

export default {
  createTransportBooking,
  getTransportBooking,
  getTransportBookingByBookingId,
  getTransportBookingsByEmail,
  getAllTransportBookings,
  updateTransportBookingStatus,
  cancelTransportBooking,
  assignDriverToBooking,
};
