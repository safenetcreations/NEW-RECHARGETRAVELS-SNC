// National Parks Booking Service - Firebase Operations
// Handles all national park tour bookings and related operations

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Collection references
const TOURS_COLLECTION = 'nationalparks_tours';
const BOOKINGS_COLLECTION = 'nationalparks_bookings';

// ==========================================
// INTERFACES
// ==========================================

export interface NationalParkTour {
  id?: string;
  title: string;
  description: string;
  parkName: string;
  parkSlug: string;
  location: string;
  province: string;
  duration: string;
  price: number;
  pricePerPerson: number;
  image: string;
  gallery: string[];
  rating: number;
  reviews: number;
  category: string;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  difficulty: string;
  maxGroupSize: number;
  startTime: string;
  endTime: string;
  meetingPoint: string;
  featured: boolean;
  isActive: boolean;
  wildlife: string[];
  bestTimeToVisit: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface NationalParkBooking {
  id?: string;
  bookingRef: string;

  // Tour Info
  tourId: string;
  tourTitle: string;
  parkName: string;

  // Customer Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  nationality: string;

  // Travel Details
  travelDate: string;
  safariTime: 'morning' | 'afternoon' | 'fullday';
  adults: number;
  children: number;
  infants: number;

  // Extras
  vehicleType: 'shared' | 'private';
  includeGuide: boolean;
  pickupLocation: string;
  dropoffLocation: string;
  hotelName?: string;

  // Notes
  specialRequests?: string;
  dietaryRequirements?: string;

  // Pricing
  basePrice: number;
  extrasPrice: number;
  totalPrice: number;
  currency: string;

  // Status
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'unpaid' | 'partial' | 'paid' | 'refunded';

  // Admin
  adminNotes?: string;
  assignedDriver?: string;
  driverPhone?: string;

  // Communication
  emailConfirmationSent: boolean;
  whatsappConfirmationSent: boolean;

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface BookingFormData {
  tourId: string;
  tourTitle: string;
  parkName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  nationality: string;
  travelDate: string;
  safariTime: 'morning' | 'afternoon' | 'fullday';
  adults: number;
  children: number;
  infants: number;
  vehicleType: 'shared' | 'private';
  includeGuide: boolean;
  pickupLocation: string;
  dropoffLocation?: string;
  hotelName?: string;
  specialRequests?: string;
  dietaryRequirements?: string;
  agreeToTerms: boolean;
  subscribeNewsletter?: boolean;
}

export interface BookingResponse {
  success: boolean;
  bookingId: string;
  bookingRef: string;
  message: string;
  booking?: NationalParkBooking;
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

const generateBookingRef = (): string => {
  const prefix = 'NP';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// ==========================================
// TOUR OPERATIONS
// ==========================================

export const getNationalParkTours = async (parkCategory?: string): Promise<NationalParkTour[]> => {
  try {
    let q = query(
      collection(db, TOURS_COLLECTION),
      where('is_active', '==', true),
      orderBy('created_at', 'desc')
    );

    if (parkCategory && parkCategory !== 'all') {
      q = query(
        collection(db, TOURS_COLLECTION),
        where('is_active', '==', true),
        where('category', '==', parkCategory),
        orderBy('created_at', 'desc')
      );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as NationalParkTour));
  } catch (error) {
    console.error('Error fetching national park tours:', error);
    return [];
  }
};

export const getFeaturedParkTours = async (limitCount: number = 6): Promise<NationalParkTour[]> => {
  try {
    const q = query(
      collection(db, TOURS_COLLECTION),
      where('is_active', '==', true),
      where('featured', '==', true),
      orderBy('created_at', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as NationalParkTour));
  } catch (error) {
    console.error('Error fetching featured park tours:', error);
    return [];
  }
};

export const getParkTourById = async (tourId: string): Promise<NationalParkTour | null> => {
  try {
    const docRef = doc(db, TOURS_COLLECTION, tourId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as NationalParkTour;
    }
    return null;
  } catch (error) {
    console.error('Error fetching park tour:', error);
    return null;
  }
};

export const getToursByPark = async (parkName: string): Promise<NationalParkTour[]> => {
  try {
    const q = query(
      collection(db, TOURS_COLLECTION),
      where('is_active', '==', true),
      where('category', '==', parkName.toLowerCase()),
      orderBy('price', 'asc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as NationalParkTour));
  } catch (error) {
    console.error('Error fetching tours by park:', error);
    return [];
  }
};

// ==========================================
// BOOKING OPERATIONS
// ==========================================

export const createParkBooking = async (
  formData: BookingFormData,
  tour: NationalParkTour
): Promise<BookingResponse> => {
  try {
    const bookingRef = generateBookingRef();

    // Calculate pricing
    const basePrice = tour.pricePerPerson || tour.price;
    const adultsCost = basePrice * formData.adults;
    const childrenCost = basePrice * formData.children * 0.5;
    const infantsCost = 0;

    // Extras pricing
    let extrasPrice = 0;
    if (formData.vehicleType === 'private') {
      extrasPrice += 50; // Private vehicle surcharge
    }
    if (formData.includeGuide) {
      extrasPrice += 25; // Guide fee
    }
    if (formData.safariTime === 'fullday') {
      extrasPrice += basePrice * formData.adults * 0.5; // Full day premium
    }

    const totalPrice = adultsCost + childrenCost + infantsCost + extrasPrice;

    const bookingData: Omit<NationalParkBooking, 'id'> = {
      bookingRef,

      // Tour Info
      tourId: formData.tourId,
      tourTitle: formData.tourTitle,
      parkName: formData.parkName,

      // Customer Info
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      whatsappNumber: formData.whatsappNumber || formData.phone,
      nationality: formData.nationality,

      // Travel Details
      travelDate: formData.travelDate,
      safariTime: formData.safariTime,
      adults: formData.adults,
      children: formData.children,
      infants: formData.infants,

      // Extras
      vehicleType: formData.vehicleType,
      includeGuide: formData.includeGuide,
      pickupLocation: formData.pickupLocation,
      dropoffLocation: formData.dropoffLocation || formData.pickupLocation,
      hotelName: formData.hotelName,

      // Notes
      specialRequests: formData.specialRequests,
      dietaryRequirements: formData.dietaryRequirements,

      // Pricing
      basePrice: adultsCost + childrenCost,
      extrasPrice,
      totalPrice,
      currency: 'USD',

      // Status
      status: 'pending',
      paymentStatus: 'unpaid',

      // Communication
      emailConfirmationSent: false,
      whatsappConfirmationSent: false,

      // Timestamps
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), bookingData);

    return {
      success: true,
      bookingId: docRef.id,
      bookingRef,
      message: 'Safari booking created successfully!',
      booking: { id: docRef.id, ...bookingData } as NationalParkBooking
    };
  } catch (error) {
    console.error('Error creating park booking:', error);
    return {
      success: false,
      bookingId: '',
      bookingRef: '',
      message: 'Failed to create booking. Please try again.'
    };
  }
};

export const getBookingById = async (bookingId: string): Promise<NationalParkBooking | null> => {
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as NationalParkBooking;
    }
    return null;
  } catch (error) {
    console.error('Error fetching booking:', error);
    return null;
  }
};

export const getBookingByRef = async (bookingRef: string): Promise<NationalParkBooking | null> => {
  try {
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      where('bookingRef', '==', bookingRef),
      limit(1)
    );

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as NationalParkBooking;
    }
    return null;
  } catch (error) {
    console.error('Error fetching booking by ref:', error);
    return null;
  }
};

export const getAllParkBookings = async (status?: string): Promise<NationalParkBooking[]> => {
  try {
    let q;
    if (status && status !== 'all') {
      q = query(
        collection(db, BOOKINGS_COLLECTION),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(
        collection(db, BOOKINGS_COLLECTION),
        orderBy('createdAt', 'desc')
      );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as NationalParkBooking));
  } catch (error) {
    console.error('Error fetching park bookings:', error);
    return [];
  }
};

export const updateParkBooking = async (
  bookingId: string,
  data: Partial<NationalParkBooking>
): Promise<void> => {
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};

export const cancelParkBooking = async (
  bookingId: string,
  reason?: string
): Promise<void> => {
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    await updateDoc(docRef, {
      status: 'cancelled',
      adminNotes: reason || 'Cancelled by customer',
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};

// ==========================================
// STATISTICS
// ==========================================

export const getParkBookingStats = async (): Promise<{
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  totalRevenue: number;
  popularParks: { park: string; count: number }[];
}> => {
  try {
    const snapshot = await getDocs(collection(db, BOOKINGS_COLLECTION));
    const bookings = snapshot.docs.map(doc => doc.data() as NationalParkBooking);

    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    const totalRevenue = bookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    // Count by park
    const parkCounts: Record<string, number> = {};
    bookings.forEach(booking => {
      const park = booking.parkName || 'Unknown';
      parkCounts[park] = (parkCounts[park] || 0) + 1;
    });

    const popularParks = Object.entries(parkCounts)
      .map(([park, count]) => ({ park, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      totalRevenue,
      popularParks
    };
  } catch (error) {
    console.error('Error getting park booking stats:', error);
    return {
      totalBookings: 0,
      pendingBookings: 0,
      confirmedBookings: 0,
      completedBookings: 0,
      totalRevenue: 0,
      popularParks: []
    };
  }
};

export default {
  getNationalParkTours,
  getFeaturedParkTours,
  getParkTourById,
  getToursByPark,
  createParkBooking,
  getBookingById,
  getBookingByRef,
  getAllParkBookings,
  updateParkBooking,
  cancelParkBooking,
  getParkBookingStats
};
