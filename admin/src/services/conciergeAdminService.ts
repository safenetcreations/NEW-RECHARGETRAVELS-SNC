import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// ==========================================
// INTERFACES
// ==========================================

export interface ConciergeService {
  id?: string;
  category: string;
  icon: string;
  image: string;
  description: string;
  services: string[];
  startingPrice: number;
  isActive: boolean;
  order: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ConciergeBooking {
  id?: string;
  bookingRef: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  preferredDate: string;
  alternateDate?: string;
  location: string;
  guests: number;
  duration: string;
  budget: string;
  specialRequests: string;
  selectedServices: string[];
  selectedServiceDetails: string[];
  estimatedTotal: number;
  paymentMethod: 'card' | 'paypal' | 'bank';
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  adminNotes?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ConciergeHeroContent {
  id?: string;
  title: string;
  subtitle: string;
  heroImage: string;
  badge: string;
  stats: {
    icon: string;
    value: string;
    label: string;
  }[];
  updatedAt?: Timestamp;
}

export interface ConciergeSettings {
  id?: string;
  contactPhone: string;
  contactEmail: string;
  whatsappNumber: string;
  responseTime: string;
  emergencyResponse: string;
  currency: string;
  minBookingNotice: number; // days
  cancellationPolicy: string;
  updatedAt?: Timestamp;
}

// ==========================================
// SERVICES MANAGEMENT
// ==========================================

export const getConciergeServices = async (): Promise<ConciergeService[]> => {
  try {
    const q = query(
      collection(db, 'concierge_services'),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ConciergeService));
  } catch (error) {
    console.error('Error fetching concierge services:', error);
    return [];
  }
};

export const getConciergeService = async (id: string): Promise<ConciergeService | null> => {
  try {
    const docRef = doc(db, 'concierge_services', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as ConciergeService;
    }
    return null;
  } catch (error) {
    console.error('Error fetching concierge service:', error);
    return null;
  }
};

export const createConciergeService = async (data: Omit<ConciergeService, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'concierge_services'), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating concierge service:', error);
    throw error;
  }
};

export const updateConciergeService = async (id: string, data: Partial<ConciergeService>): Promise<void> => {
  try {
    const docRef = doc(db, 'concierge_services', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating concierge service:', error);
    throw error;
  }
};

export const deleteConciergeService = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'concierge_services', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting concierge service:', error);
    throw error;
  }
};

export const reorderConciergeServices = async (services: { id: string; order: number }[]): Promise<void> => {
  try {
    const batch = writeBatch(db);
    services.forEach(({ id, order }) => {
      const docRef = doc(db, 'concierge_services', id);
      batch.update(docRef, { order, updatedAt: Timestamp.now() });
    });
    await batch.commit();
  } catch (error) {
    console.error('Error reordering services:', error);
    throw error;
  }
};

// ==========================================
// BOOKINGS MANAGEMENT
// ==========================================

export const getConciergeBookings = async (status?: string): Promise<ConciergeBooking[]> => {
  try {
    let q;
    if (status && status !== 'all') {
      q = query(
        collection(db, 'concierge_bookings'),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(
        collection(db, 'concierge_bookings'),
        orderBy('createdAt', 'desc')
      );
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ConciergeBooking));
  } catch (error) {
    console.error('Error fetching concierge bookings:', error);
    return [];
  }
};

export const getConciergeBooking = async (id: string): Promise<ConciergeBooking | null> => {
  try {
    const docRef = doc(db, 'concierge_bookings', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as ConciergeBooking;
    }
    return null;
  } catch (error) {
    console.error('Error fetching concierge booking:', error);
    return null;
  }
};

export const updateConciergeBooking = async (id: string, data: Partial<ConciergeBooking>): Promise<void> => {
  try {
    const docRef = doc(db, 'concierge_bookings', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating concierge booking:', error);
    throw error;
  }
};

export const deleteConciergeBooking = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'concierge_bookings', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting concierge booking:', error);
    throw error;
  }
};

// ==========================================
// HERO CONTENT MANAGEMENT
// ==========================================

export const getConciergeHeroContent = async (): Promise<ConciergeHeroContent | null> => {
  try {
    const docRef = doc(db, 'concierge_content', 'hero');
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as ConciergeHeroContent;
    }
    return null;
  } catch (error) {
    console.error('Error fetching concierge hero content:', error);
    return null;
  }
};

export const updateConciergeHeroContent = async (data: Partial<ConciergeHeroContent>): Promise<void> => {
  try {
    const docRef = doc(db, 'concierge_content', 'hero');
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    // If document doesn't exist, create it
    const { setDoc } = await import('firebase/firestore');
    const docRef = doc(db, 'concierge_content', 'hero');
    await setDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  }
};

// ==========================================
// SETTINGS MANAGEMENT
// ==========================================

export const getConciergeSettings = async (): Promise<ConciergeSettings | null> => {
  try {
    const docRef = doc(db, 'concierge_content', 'settings');
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as ConciergeSettings;
    }
    return null;
  } catch (error) {
    console.error('Error fetching concierge settings:', error);
    return null;
  }
};

export const updateConciergeSettings = async (data: Partial<ConciergeSettings>): Promise<void> => {
  try {
    const docRef = doc(db, 'concierge_content', 'settings');
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    // If document doesn't exist, create it
    const { setDoc } = await import('firebase/firestore');
    const docRef = doc(db, 'concierge_content', 'settings');
    await setDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  }
};

// ==========================================
// ANALYTICS
// ==========================================

export const getConciergeStats = async (): Promise<{
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  totalRevenue: number;
  averageOrderValue: number;
}> => {
  try {
    const bookings = await getConciergeBookings();

    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    const totalRevenue = bookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + (b.estimatedTotal || 0), 0);
    const averageOrderValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

    return {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      totalRevenue,
      averageOrderValue
    };
  } catch (error) {
    console.error('Error fetching concierge stats:', error);
    return {
      totalBookings: 0,
      pendingBookings: 0,
      confirmedBookings: 0,
      completedBookings: 0,
      totalRevenue: 0,
      averageOrderValue: 0
    };
  }
};

// ==========================================
// SEED DEFAULT SERVICES
// ==========================================

export const seedDefaultConciergeServices = async (): Promise<void> => {
  const defaultServices: Omit<ConciergeService, 'id'>[] = [
    {
      category: 'Culinary Excellence',
      icon: 'ChefHat',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
      description: 'Private chefs, exclusive dining experiences, and rare wine collections',
      services: [
        'Private Michelin-Star Chef Experiences',
        'Exclusive Restaurant Reservations',
        'Wine Cellar Tours & Tastings',
        'Traditional Sri Lankan Culinary Journeys',
        'Private Beachside Dining Setup',
        'Custom Menu Creation'
      ],
      startingPrice: 500,
      isActive: true,
      order: 1
    },
    {
      category: 'Security & Protection',
      icon: 'Shield',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80',
      description: 'Executive protection, secure transportation, and privacy assurance',
      services: [
        'Executive Close Protection',
        'Secure Airport Transfers',
        'Private Security Personnel',
        'Advance Location Security',
        'Secure Communication Setup',
        'VIP Escort Services'
      ],
      startingPrice: 800,
      isActive: true,
      order: 2
    },
    {
      category: 'Event Production',
      icon: 'Sparkles',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
      description: 'Luxury event planning, private celebrations, and exclusive venues',
      services: [
        'Destination Wedding Planning',
        'Private Party Organization',
        'Corporate Event Management',
        'Exclusive Venue Booking',
        'Celebrity Entertainment Booking',
        'Floral & Decor Design'
      ],
      startingPrice: 2000,
      isActive: true,
      order: 3
    },
    {
      category: 'Lifestyle Management',
      icon: 'Crown',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      description: 'Personal shopping, real estate tours, and lifestyle curation',
      services: [
        'Personal Shopping Assistant',
        'Luxury Real Estate Tours',
        'Art & Antique Acquisitions',
        'Bespoke Gift Procurement',
        'Personal Styling Services',
        'Household Staff Arrangement'
      ],
      startingPrice: 350,
      isActive: true,
      order: 4
    },
    {
      category: 'Transportation Fleet',
      icon: 'Car',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      description: 'Luxury vehicles, private jets, and yacht charters',
      services: [
        'Rolls Royce & Bentley Fleet',
        'Private Jet Charter',
        'Luxury Yacht Rental',
        'Helicopter Tours',
        'Classic Car Experience',
        'Chauffeur Services 24/7'
      ],
      startingPrice: 600,
      isActive: true,
      order: 5
    },
    {
      category: 'Medical & Wellness',
      icon: 'Stethoscope',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
      description: 'Private healthcare, wellness retreats, and emergency medical services',
      services: [
        'Private Medical Consultations',
        'Ayurveda Wellness Programs',
        'Emergency Medical Evacuation',
        'Personal Fitness Training',
        'Spa & Rejuvenation Packages',
        'Mental Wellness Retreats'
      ],
      startingPrice: 450,
      isActive: true,
      order: 6
    }
  ];

  const batch = writeBatch(db);

  defaultServices.forEach((service, index) => {
    const docRef = doc(collection(db, 'concierge_services'));
    batch.set(docRef, {
      ...service,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  });

  await batch.commit();
  console.log('Default concierge services seeded successfully');
};

export default {
  getConciergeServices,
  getConciergeService,
  createConciergeService,
  updateConciergeService,
  deleteConciergeService,
  reorderConciergeServices,
  getConciergeBookings,
  getConciergeBooking,
  updateConciergeBooking,
  deleteConciergeBooking,
  getConciergeHeroContent,
  updateConciergeHeroContent,
  getConciergeSettings,
  updateConciergeSettings,
  getConciergeStats,
  seedDefaultConciergeServices
};
