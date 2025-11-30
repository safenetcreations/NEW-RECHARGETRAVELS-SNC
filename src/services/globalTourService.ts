// Global Tour Service - Firebase Operations
// Handles all tour CRUD and booking operations

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
  startAfter,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  GlobalTour,
  GlobalTourBooking,
  TourBookingFormData,
  TourFilters,
  BookingFilters,
  TourListResponse,
  TourBookingResponse,
  BookingUpdateData,
  BookingStatistics,
  BookingStatus,
  PaymentStatus
} from '@/types/global-tour';

// Collection references
const TOURS_COLLECTION = 'globalTours';
const BOOKINGS_COLLECTION = 'globalTourBookings';

// ==========================================
// TOUR OPERATIONS
// ==========================================

/**
 * Get all tours with optional filters
 */
export const getGlobalTours = async (
  filters?: TourFilters,
  pageSize: number = 20,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<TourListResponse> => {
  try {
    let q = query(
      collection(db, TOURS_COLLECTION),
      where('isActive', '==', true),
      orderBy('sortOrder', 'asc')
    );

    // Apply filters
    if (filters?.region) {
      q = query(q, where('region', '==', filters.region));
    }
    if (filters?.category) {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters?.featured) {
      q = query(q, where('isFeatured', '==', true));
    }
    if (filters?.popular) {
      q = query(q, where('isPopular', '==', true));
    }

    // Pagination
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    q = query(q, limit(pageSize + 1));

    const snapshot = await getDocs(q);
    const tours: GlobalTour[] = [];
    let hasMore = false;

    snapshot.docs.forEach((doc, index) => {
      if (index < pageSize) {
        tours.push({ id: doc.id, ...doc.data() } as GlobalTour);
      } else {
        hasMore = true;
      }
    });

    // Client-side filtering for price and duration
    let filteredTours = tours;
    if (filters?.minPrice !== undefined) {
      filteredTours = filteredTours.filter(t => t.priceUSD >= filters.minPrice!);
    }
    if (filters?.maxPrice !== undefined) {
      filteredTours = filteredTours.filter(t => t.priceUSD <= filters.maxPrice!);
    }
    if (filters?.minDuration !== undefined) {
      filteredTours = filteredTours.filter(t => t.duration.days >= filters.minDuration!);
    }
    if (filters?.maxDuration !== undefined) {
      filteredTours = filteredTours.filter(t => t.duration.days <= filters.maxDuration!);
    }
    if (filters?.searchQuery) {
      const search = filters.searchQuery.toLowerCase();
      filteredTours = filteredTours.filter(t =>
        t.title.toLowerCase().includes(search) ||
        t.description.toLowerCase().includes(search) ||
        t.location.toLowerCase().includes(search)
      );
    }

    return {
      tours: filteredTours,
      total: filteredTours.length,
      page: 1,
      limit: pageSize,
      hasMore
    };
  } catch (error) {
    console.error('Error fetching global tours:', error);
    throw error;
  }
};

/**
 * Get featured tours
 */
export const getFeaturedTours = async (limitCount: number = 6): Promise<GlobalTour[]> => {
  try {
    const q = query(
      collection(db, TOURS_COLLECTION),
      where('isActive', '==', true),
      where('isFeatured', '==', true),
      orderBy('sortOrder', 'asc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GlobalTour));
  } catch (error) {
    console.error('Error fetching featured tours:', error);
    return [];
  }
};

/**
 * Get tour by ID
 */
export const getTourById = async (tourId: string): Promise<GlobalTour | null> => {
  try {
    const docRef = doc(db, TOURS_COLLECTION, tourId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as GlobalTour;
    }
    return null;
  } catch (error) {
    console.error('Error fetching tour:', error);
    return null;
  }
};

/**
 * Get tour by slug
 */
export const getTourBySlug = async (slug: string): Promise<GlobalTour | null> => {
  try {
    const q = query(
      collection(db, TOURS_COLLECTION),
      where('slug', '==', slug),
      limit(1)
    );

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as GlobalTour;
    }
    return null;
  } catch (error) {
    console.error('Error fetching tour by slug:', error);
    return null;
  }
};

/**
 * Get related tours
 */
export const getRelatedTours = async (tourId: string, category: string, limitCount: number = 4): Promise<GlobalTour[]> => {
  try {
    const q = query(
      collection(db, TOURS_COLLECTION),
      where('isActive', '==', true),
      where('category', '==', category),
      limit(limitCount + 1)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as GlobalTour))
      .filter(tour => tour.id !== tourId)
      .slice(0, limitCount);
  } catch (error) {
    console.error('Error fetching related tours:', error);
    return [];
  }
};

/**
 * Create new tour (Admin)
 */
export const createTour = async (tourData: Omit<GlobalTour, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, TOURS_COLLECTION), {
      ...tourData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating tour:', error);
    throw error;
  }
};

/**
 * Update tour (Admin)
 */
export const updateTour = async (tourId: string, tourData: Partial<GlobalTour>): Promise<void> => {
  try {
    const docRef = doc(db, TOURS_COLLECTION, tourId);
    await updateDoc(docRef, {
      ...tourData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating tour:', error);
    throw error;
  }
};

/**
 * Delete tour (Admin)
 */
export const deleteTour = async (tourId: string): Promise<void> => {
  try {
    const docRef = doc(db, TOURS_COLLECTION, tourId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting tour:', error);
    throw error;
  }
};

// ==========================================
// BOOKING OPERATIONS
// ==========================================

/**
 * Generate booking reference
 */
const generateBookingReference = (): string => {
  const prefix = 'RT';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Create tour booking
 */
export const createTourBooking = async (
  formData: TourBookingFormData,
  tour: GlobalTour
): Promise<TourBookingResponse> => {
  try {
    const bookingReference = generateBookingReference();

    // Calculate total price
    const basePrice = tour.pricePerPersonUSD || tour.priceUSD;
    const adultsCost = basePrice * formData.adults;
    const childrenCost = basePrice * formData.children * 0.5; // 50% discount for children
    const totalAmountUSD = adultsCost + childrenCost;

    // Calculate end date
    const startDate = new Date(formData.travelDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + tour.duration.days - 1);

    const bookingData: Omit<GlobalTourBooking, 'id'> = {
      bookingId: `BK-${Date.now()}`,
      bookingReference,

      // Tour info
      tourId: tour.id,
      tourTitle: tour.title,
      tourSlug: tour.slug,
      tourRegion: tour.region,
      tourDuration: tour.duration,

      // Customer info
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        whatsappNumber: formData.whatsappNumber || formData.phone,
        nationality: formData.nationality
      },

      // Travel details
      travelers: {
        adults: formData.adults,
        children: formData.children,
        infants: formData.infants
      },
      travelDate: formData.travelDate,
      endDate: endDate.toISOString().split('T')[0],
      pickupLocation: formData.pickupLocation,
      dropoffLocation: formData.dropoffLocation,
      flightDetails: formData.flightDetails,

      // Notes
      additionalNotes: formData.additionalNotes,

      // Status
      status: 'pending' as BookingStatus,
      paymentStatus: 'unpaid' as PaymentStatus,

      // Payment
      payment: {
        totalAmountUSD,
        currency: 'USD'
      },

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
      bookingReference,
      message: 'Booking created successfully!',
      booking: { id: docRef.id, ...bookingData } as GlobalTourBooking
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    return {
      success: false,
      bookingId: '',
      bookingReference: '',
      message: 'Failed to create booking. Please try again.'
    };
  }
};

/**
 * Get booking by ID
 */
export const getBookingById = async (bookingId: string): Promise<GlobalTourBooking | null> => {
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as GlobalTourBooking;
    }
    return null;
  } catch (error) {
    console.error('Error fetching booking:', error);
    return null;
  }
};

/**
 * Get booking by reference
 */
export const getBookingByReference = async (reference: string): Promise<GlobalTourBooking | null> => {
  try {
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      where('bookingReference', '==', reference),
      limit(1)
    );

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as GlobalTourBooking;
    }
    return null;
  } catch (error) {
    console.error('Error fetching booking by reference:', error);
    return null;
  }
};

/**
 * Get all bookings (Admin)
 */
export const getAllBookings = async (
  filters?: BookingFilters,
  pageSize: number = 50
): Promise<GlobalTourBooking[]> => {
  try {
    let q = query(
      collection(db, BOOKINGS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters?.paymentStatus) {
      q = query(q, where('paymentStatus', '==', filters.paymentStatus));
    }
    if (filters?.tourId) {
      q = query(q, where('tourId', '==', filters.tourId));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GlobalTourBooking));
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
};

/**
 * Update booking (Admin)
 */
export const updateBooking = async (bookingId: string, data: BookingUpdateData): Promise<void> => {
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

/**
 * Get booking statistics (Admin)
 */
export const getBookingStatistics = async (): Promise<BookingStatistics> => {
  try {
    const snapshot = await getDocs(collection(db, BOOKINGS_COLLECTION));
    const bookings = snapshot.docs.map(doc => doc.data() as GlobalTourBooking);

    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
    const totalRevenue = bookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + (b.payment?.totalAmountUSD || 0), 0);
    const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

    // Group by month
    const bookingsByMonth: { month: string; count: number; revenue: number }[] = [];
    const tourCounts: Record<string, { tourTitle: string; count: number }> = {};

    bookings.forEach(booking => {
      // Count by tour
      if (!tourCounts[booking.tourId]) {
        tourCounts[booking.tourId] = { tourTitle: booking.tourTitle, count: 0 };
      }
      tourCounts[booking.tourId].count++;
    });

    const topTours = Object.entries(tourCounts)
      .map(([tourId, data]) => ({
        tourId,
        tourTitle: data.tourTitle,
        bookings: data.count
      }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5);

    return {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue,
      averageBookingValue,
      bookingsByMonth,
      topTours
    };
  } catch (error) {
    console.error('Error getting booking statistics:', error);
    throw error;
  }
};

/**
 * Mark booking email sent
 */
export const markEmailSent = async (bookingId: string): Promise<void> => {
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    await updateDoc(docRef, {
      emailConfirmationSent: true,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error marking email sent:', error);
  }
};

/**
 * Mark WhatsApp sent
 */
export const markWhatsAppSent = async (bookingId: string): Promise<void> => {
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    await updateDoc(docRef, {
      whatsappConfirmationSent: true,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error marking WhatsApp sent:', error);
  }
};
