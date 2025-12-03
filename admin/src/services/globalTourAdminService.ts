// Global Tour Admin Service - Firebase Operations
// Handles all admin tour CRUD and booking management

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
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Collection references
const TOURS_COLLECTION = 'globalTours';
const BOOKINGS_COLLECTION = 'globalTourBookings';

// Types
export type TourRegion = 'sri-lanka' | 'maldives' | 'india' | 'southeast-asia' | 'worldwide';
export type TourCategory = 'wildlife' | 'cultural' | 'beach' | 'adventure' | 'wellness' | 'heritage' | 'pilgrimage' | 'honeymoon' | 'family' | 'luxury';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'refunded';

export interface TourItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: { breakfast: boolean; lunch: boolean; dinner: boolean };
  accommodation: string;
  location: string;
}

export interface GlobalTour {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  region: TourRegion;
  country: string;
  location: string;
  category: TourCategory;
  duration: { days: number; nights: number };
  priceUSD: number;
  pricePerPersonUSD?: number;
  originalPriceUSD?: number;
  description: string;
  shortDescription: string;
  highlights: { title: string; description: string; icon: string }[];
  itinerary: TourItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  heroImage: string;
  imageGallery: string[];
  videoUrl?: string;
  minGroupSize: number;
  maxGroupSize: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isPopular: boolean;
  isActive: boolean;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface GlobalTourBooking {
  id: string;
  bookingId: string;
  bookingReference: string;
  tourId: string;
  tourTitle: string;
  tourSlug: string;
  tourRegion: TourRegion;
  tourDuration: { days: number; nights: number };
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    whatsappNumber?: string;
    nationality: string;
  };
  travelers: {
    adults: number;
    children: number;
    infants: number;
  };
  travelDate: string;
  endDate: string;
  pickupLocation: string;
  dropoffLocation?: string;
  flightDetails?: string;
  additionalNotes?: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  payment: {
    totalAmountUSD: number;
    paidAmountUSD?: number;
    currency: string;
    paymentMethod?: string;
    transactionId?: string;
  };
  adminNotes?: string;
  assignedGuide?: string;
  emailConfirmationSent: boolean;
  whatsappConfirmationSent: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface BookingStatistics {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
  topTours: { tourId: string; tourTitle: string; bookings: number }[];
}

// ==========================================
// TOUR ADMIN OPERATIONS
// ==========================================

/**
 * Get all tours (including inactive) for admin
 */
export const getAllToursAdmin = async (): Promise<GlobalTour[]> => {
  try {
    const q = query(
      collection(db, TOURS_COLLECTION),
      orderBy('sortOrder', 'asc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GlobalTour));
  } catch (error) {
    console.error('Error fetching all tours:', error);
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
 * Create new tour
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
 * Update tour
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
 * Delete tour
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

/**
 * Toggle tour active status
 */
export const toggleTourStatus = async (tourId: string, isActive: boolean): Promise<void> => {
  try {
    const docRef = doc(db, TOURS_COLLECTION, tourId);
    await updateDoc(docRef, {
      isActive,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error toggling tour status:', error);
    throw error;
  }
};

/**
 * Toggle tour featured status
 */
export const toggleTourFeatured = async (tourId: string, isFeatured: boolean): Promise<void> => {
  try {
    const docRef = doc(db, TOURS_COLLECTION, tourId);
    await updateDoc(docRef, {
      isFeatured,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error toggling tour featured:', error);
    throw error;
  }
};

/**
 * Reorder tours
 */
export const reorderTours = async (tourIds: string[]): Promise<void> => {
  try {
    const batch = writeBatch(db);
    tourIds.forEach((id, index) => {
      const docRef = doc(db, TOURS_COLLECTION, id);
      batch.update(docRef, { sortOrder: index, updatedAt: Timestamp.now() });
    });
    await batch.commit();
  } catch (error) {
    console.error('Error reordering tours:', error);
    throw error;
  }
};

// ==========================================
// BOOKING ADMIN OPERATIONS
// ==========================================

/**
 * Get all bookings with optional filters
 */
export const getAllBookingsAdmin = async (
  filters?: { status?: BookingStatus; paymentStatus?: PaymentStatus; tourId?: string },
  pageSize: number = 100
): Promise<GlobalTourBooking[]> => {
  try {
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    // Note: Firestore doesn't support multiple inequality filters,
    // so we apply additional filters client-side
    const snapshot = await getDocs(q);
    let bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GlobalTourBooking));

    // Apply filters client-side
    if (filters?.status) {
      bookings = bookings.filter(b => b.status === filters.status);
    }
    if (filters?.paymentStatus) {
      bookings = bookings.filter(b => b.paymentStatus === filters.paymentStatus);
    }
    if (filters?.tourId) {
      bookings = bookings.filter(b => b.tourId === filters.tourId);
    }

    return bookings;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
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
 * Update booking status
 */
export const updateBookingStatus = async (
  bookingId: string,
  status: BookingStatus,
  adminNotes?: string
): Promise<void> => {
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    const updateData: any = {
      status,
      updatedAt: Timestamp.now()
    };
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

/**
 * Update payment status
 */
export const updatePaymentStatus = async (
  bookingId: string,
  paymentStatus: PaymentStatus,
  paymentData?: { paidAmountUSD?: number; paymentMethod?: string; transactionId?: string }
): Promise<void> => {
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    const updateData: any = {
      paymentStatus,
      updatedAt: Timestamp.now()
    };
    if (paymentData) {
      updateData['payment.paidAmountUSD'] = paymentData.paidAmountUSD;
      if (paymentData.paymentMethod) updateData['payment.paymentMethod'] = paymentData.paymentMethod;
      if (paymentData.transactionId) updateData['payment.transactionId'] = paymentData.transactionId;
    }
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

/**
 * Assign guide to booking
 */
export const assignGuide = async (bookingId: string, guideName: string): Promise<void> => {
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    await updateDoc(docRef, {
      assignedGuide: guideName,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error assigning guide:', error);
    throw error;
  }
};

/**
 * Get booking statistics
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

    // Group by tour
    const tourCounts: Record<string, { tourTitle: string; count: number }> = {};
    bookings.forEach(booking => {
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
      topTours
    };
  } catch (error) {
    console.error('Error getting booking statistics:', error);
    throw error;
  }
};

/**
 * Mark confirmation emails/WhatsApp sent
 */
export const markConfirmationSent = async (
  bookingId: string,
  type: 'email' | 'whatsapp'
): Promise<void> => {
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    const updateData: any = { updatedAt: Timestamp.now() };
    if (type === 'email') {
      updateData.emailConfirmationSent = true;
    } else {
      updateData.whatsappConfirmationSent = true;
    }
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error(`Error marking ${type} sent:`, error);
    throw error;
  }
};

/**
 * Get recent bookings (for dashboard)
 */
export const getRecentBookings = async (count: number = 10): Promise<GlobalTourBooking[]> => {
  try {
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(count)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GlobalTourBooking));
  } catch (error) {
    console.error('Error fetching recent bookings:', error);
    return [];
  }
};

/**
 * Seed sample tours (for initial setup)
 */
export const seedSampleTours = async (): Promise<number> => {
  const sampleTours: Omit<GlobalTour, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      title: '7-Day Cultural Triangle & Wildlife Safari',
      subtitle: 'Explore Ancient Heritage & Wild Encounters',
      slug: '7-day-cultural-triangle-wildlife-safari',
      region: 'sri-lanka',
      country: 'Sri Lanka',
      location: 'Colombo, Sigiriya, Kandy, Yala',
      category: 'cultural',
      duration: { days: 7, nights: 6 },
      priceUSD: 1299,
      pricePerPersonUSD: 1299,
      originalPriceUSD: 1599,
      description: 'Experience the best of Sri Lanka\'s cultural heritage and wildlife on this comprehensive 7-day tour. Visit ancient cities, climb Sigiriya Rock, explore Kandy\'s sacred temples, and spot leopards in Yala National Park.',
      shortDescription: 'A perfect blend of culture, heritage, and wildlife in Sri Lanka.',
      highlights: [
        { title: 'Sigiriya Rock Fortress', description: 'Climb the iconic UNESCO World Heritage site', icon: 'Mountain' },
        { title: 'Temple of the Tooth', description: 'Visit Sri Lanka\'s most sacred Buddhist temple', icon: 'Landmark' },
        { title: 'Yala Safari', description: 'Spot leopards and elephants in their natural habitat', icon: 'Binoculars' }
      ],
      itinerary: [
        {
          day: 1,
          title: 'Arrival in Colombo',
          description: 'Welcome to Sri Lanka! Meet and greet at Bandaranaike International Airport.',
          activities: ['Airport pickup', 'City tour of Colombo', 'Welcome dinner'],
          meals: { breakfast: false, lunch: false, dinner: true },
          accommodation: 'Cinnamon Grand Colombo',
          location: 'Colombo'
        },
        {
          day: 2,
          title: 'Colombo to Sigiriya',
          description: 'Journey to the Cultural Triangle and visit Dambulla Cave Temple.',
          activities: ['Drive to Sigiriya', 'Dambulla Cave Temple visit', 'Village tour'],
          meals: { breakfast: true, lunch: true, dinner: true },
          accommodation: 'Aliya Resort & Spa',
          location: 'Sigiriya'
        }
      ],
      inclusions: [
        'Airport transfers',
        'All transportation in AC vehicle',
        'Professional English-speaking guide',
        '6 nights accommodation',
        'Daily breakfast',
        'All entrance fees',
        'Yala safari jeep'
      ],
      exclusions: [
        'International flights',
        'Travel insurance',
        'Personal expenses',
        'Tips and gratuities',
        'Alcoholic beverages'
      ],
      heroImage: 'https://images.unsplash.com/photo-1588598198321-9735fd52dc37?w=1200',
      imageGallery: [
        'https://images.unsplash.com/photo-1588598198321-9735fd52dc37?w=800',
        'https://images.unsplash.com/photo-1567422239373-b1e6d7b5f4e9?w=800'
      ],
      minGroupSize: 2,
      maxGroupSize: 12,
      rating: 4.9,
      reviewCount: 127,
      isFeatured: true,
      isPopular: true,
      isActive: true,
      sortOrder: 1,
      seoTitle: '7-Day Sri Lanka Cultural & Wildlife Tour | Recharge Travels',
      seoDescription: 'Experience Sri Lanka\'s ancient heritage and wildlife on our 7-day tour featuring Sigiriya, Kandy, and Yala National Park.',
      seoKeywords: ['Sri Lanka tour', 'Cultural Triangle', 'Yala Safari', 'Sigiriya Rock']
    },
    {
      title: '10-Day Complete Sri Lanka Experience',
      subtitle: 'The Ultimate Island Adventure',
      slug: '10-day-complete-sri-lanka',
      region: 'sri-lanka',
      country: 'Sri Lanka',
      location: 'Colombo, Sigiriya, Kandy, Ella, Galle',
      category: 'adventure',
      duration: { days: 10, nights: 9 },
      priceUSD: 1899,
      pricePerPersonUSD: 1899,
      originalPriceUSD: 2299,
      description: 'The ultimate Sri Lanka experience covering all major attractions from ancient cities to tea plantations, beaches, and wildlife. Perfect for first-time visitors wanting to see it all.',
      shortDescription: 'Complete Sri Lanka adventure covering culture, nature, and beaches.',
      highlights: [
        { title: 'Nine Arch Bridge', description: 'Witness the iconic railway bridge in Ella', icon: 'Train' },
        { title: 'Tea Plantation Tour', description: 'Learn about Ceylon tea production', icon: 'Leaf' },
        { title: 'Galle Fort', description: 'Explore the Dutch colonial heritage', icon: 'Castle' }
      ],
      itinerary: [],
      inclusions: [
        'Airport transfers',
        'All transportation',
        'Professional guide',
        '9 nights accommodation',
        'Daily breakfast',
        'All entrance fees'
      ],
      exclusions: [
        'International flights',
        'Travel insurance',
        'Personal expenses'
      ],
      heroImage: 'https://images.unsplash.com/photo-1546708770-36e50cfae0f1?w=1200',
      imageGallery: [],
      minGroupSize: 2,
      maxGroupSize: 10,
      rating: 4.8,
      reviewCount: 89,
      isFeatured: true,
      isPopular: true,
      isActive: true,
      sortOrder: 2
    },
    {
      title: '5-Day Maldives Beach Escape',
      subtitle: 'Paradise Island Retreat',
      slug: '5-day-maldives-beach-escape',
      region: 'maldives',
      country: 'Maldives',
      location: 'Male, South Ari Atoll',
      category: 'beach',
      duration: { days: 5, nights: 4 },
      priceUSD: 2499,
      pricePerPersonUSD: 2499,
      originalPriceUSD: 2999,
      description: 'Escape to paradise with our exclusive Maldives beach retreat. Stay in overwater villas, snorkel with tropical fish, and watch stunning sunsets over the Indian Ocean.',
      shortDescription: 'Luxury beach escape in the heart of the Maldives.',
      highlights: [
        { title: 'Overwater Villa', description: 'Stay in a luxurious overwater bungalow', icon: 'Home' },
        { title: 'Snorkeling', description: 'Swim with manta rays and sea turtles', icon: 'Fish' },
        { title: 'Sunset Cruise', description: 'Romantic dhoni sunset cruise', icon: 'Sunset' }
      ],
      itinerary: [],
      inclusions: [
        'Speedboat transfers',
        '4 nights overwater villa',
        'All-inclusive meals',
        'Snorkeling equipment',
        'Sunset cruise'
      ],
      exclusions: [
        'International flights',
        'Travel insurance',
        'Spa treatments',
        'Scuba diving'
      ],
      heroImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200',
      imageGallery: [],
      minGroupSize: 2,
      maxGroupSize: 4,
      rating: 5.0,
      reviewCount: 56,
      isFeatured: true,
      isPopular: false,
      isActive: true,
      sortOrder: 3
    }
  ];

  let count = 0;
  for (const tour of sampleTours) {
    try {
      await createTour(tour);
      count++;
    } catch (error) {
      console.error('Error seeding tour:', error);
    }
  }
  return count;
};
