import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';

// Types
export interface TrainHeroSlide {
  id?: string;
  image: string;
  title: string;
  subtitle: string;
  routeName?: string;
  isActive: boolean;
  order: number;
}

export interface ScenicRoute {
  id?: string;
  name: string;
  category: 'Hill Country' | 'Main Line' | 'Coastal Line';
  description: string;
  distance: string;
  duration: string;
  highlights: string[];
  departureStation: string;
  arrivalStation: string;
  frequency: string;
  bestClass: string;
  priceRange: string;
  image: string;
  rating: number;
  popularity: string;
  bestTime: string;
  scenicStops: string[];
  icon: string;
  isFeatured: boolean;
  isActive: boolean;
}

export interface TrainBooking {
  id: string;
  bookingReference: string;
  route: {
    id: string;
    name: string;
    departureStation: string;
    arrivalStation: string;
    category: string;
  };
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    country: string;
    passportNumber: string;
  };
  travelDetails: {
    travelDate: string;
    passengers: number;
    ticketClass: string;
    preferredTime: string;
    windowSeat: boolean;
    handDelivery: boolean;
    hotelName: string;
    hotelAddress: string;
    specialRequests: string;
  };
  pricing: {
    estimatedPrice: string;
    serviceFee: number;
    deliveryFee: number;
    actualTicketPrice?: number;
    totalAmount?: number;
  };
  status: 'pending' | 'confirmed' | 'tickets_purchased' | 'delivered' | 'completed' | 'cancelled';
  paymentStatus: 'awaiting_confirmation' | 'payment_pending' | 'paid' | 'refunded';
  adminNotes?: string;
  ticketNumbers?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TrainBookingSettings {
  trustIndicators: {
    rating: string;
    bookings: string;
    support: string;
  };
  serviceFee: number;
  deliveryFee: number;
  termsAndConditions: string[];
  cancellationPolicy: string;
  bookingProcess: string[];
  travelTips: string[];
  photoTips: string[];
  contactPhone: string;
  contactEmail: string;
  contactWhatsApp: string;
}

// Hero Slides Service
export const trainHeroSlidesService = {
  async getAll(): Promise<TrainHeroSlide[]> {
    try {
      const q = query(collection(db, 'trainHeroSlides'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TrainHeroSlide));
    } catch (error) {
      console.error('Error fetching hero slides:', error);
      return [];
    }
  },

  async create(slide: Omit<TrainHeroSlide, 'id'>): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, 'trainHeroSlides'), {
        ...slide,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating hero slide:', error);
      return null;
    }
  },

  async update(id: string, slide: Partial<TrainHeroSlide>): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'trainHeroSlides', id), {
        ...slide,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Error updating hero slide:', error);
      return false;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'trainHeroSlides', id));
      return true;
    } catch (error) {
      console.error('Error deleting hero slide:', error);
      return false;
    }
  }
};

// Scenic Routes Service
export const trainRoutesService = {
  async getAll(): Promise<ScenicRoute[]> {
    try {
      const q = query(collection(db, 'trainScenicRoutes'), orderBy('rating', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ScenicRoute));
    } catch (error) {
      console.error('Error fetching routes:', error);
      return [];
    }
  },

  async create(route: Omit<ScenicRoute, 'id'>): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, 'trainScenicRoutes'), {
        ...route,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating route:', error);
      return null;
    }
  },

  async update(id: string, route: Partial<ScenicRoute>): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'trainScenicRoutes', id), {
        ...route,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Error updating route:', error);
      return false;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'trainScenicRoutes', id));
      return true;
    } catch (error) {
      console.error('Error deleting route:', error);
      return false;
    }
  }
};

// Bookings Service
export const trainBookingsService = {
  async getAll(): Promise<TrainBooking[]> {
    try {
      const q = query(collection(db, 'trainBookings'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TrainBooking));
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }
  },

  async getByStatus(status: TrainBooking['status']): Promise<TrainBooking[]> {
    try {
      const q = query(
        collection(db, 'trainBookings'),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TrainBooking));
    } catch (error) {
      console.error('Error fetching bookings by status:', error);
      return [];
    }
  },

  async updateStatus(id: string, status: TrainBooking['status'], adminNotes?: string): Promise<boolean> {
    try {
      const updateData: any = {
        status,
        updatedAt: Timestamp.now()
      };
      if (adminNotes !== undefined) {
        updateData.adminNotes = adminNotes;
      }
      await updateDoc(doc(db, 'trainBookings', id), updateData);
      return true;
    } catch (error) {
      console.error('Error updating booking status:', error);
      return false;
    }
  },

  async updatePaymentStatus(id: string, paymentStatus: TrainBooking['paymentStatus']): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'trainBookings', id), {
        paymentStatus,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Error updating payment status:', error);
      return false;
    }
  },

  async updatePricing(id: string, pricing: Partial<TrainBooking['pricing']>): Promise<boolean> {
    try {
      const docRef = doc(db, 'trainBookings', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const currentPricing = docSnap.data().pricing || {};
        await updateDoc(docRef, {
          pricing: { ...currentPricing, ...pricing },
          updatedAt: Timestamp.now()
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating pricing:', error);
      return false;
    }
  },

  async addTicketNumbers(id: string, ticketNumbers: string[]): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'trainBookings', id), {
        ticketNumbers,
        status: 'tickets_purchased',
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Error adding ticket numbers:', error);
      return false;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'trainBookings', id));
      return true;
    } catch (error) {
      console.error('Error deleting booking:', error);
      return false;
    }
  },

  async getStats(): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    revenue: number;
  }> {
    try {
      const bookings = await this.getAll();
      const total = bookings.length;
      const pending = bookings.filter(b => b.status === 'pending').length;
      const confirmed = bookings.filter(b => ['confirmed', 'tickets_purchased'].includes(b.status)).length;
      const completed = bookings.filter(b => b.status === 'completed').length;
      const revenue = bookings
        .filter(b => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + (b.pricing.totalAmount || 0), 0);

      return { total, pending, confirmed, completed, revenue };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return { total: 0, pending: 0, confirmed: 0, completed: 0, revenue: 0 };
    }
  }
};

// Settings Service
export const trainSettingsService = {
  async get(): Promise<TrainBookingSettings | null> {
    try {
      const docRef = doc(db, 'cmsContent', 'trainBookingSettings');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as TrainBookingSettings;
      }
      return null;
    } catch (error) {
      console.error('Error fetching settings:', error);
      return null;
    }
  },

  async update(settings: TrainBookingSettings): Promise<boolean> {
    try {
      await setDoc(doc(db, 'cmsContent', 'trainBookingSettings'), {
        ...settings,
        updatedAt: Timestamp.now()
      }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      return false;
    }
  }
};

// Seed default data
export const seedTrainDefaultData = async (): Promise<void> => {
  try {
    // Check if data exists
    const slides = await trainHeroSlidesService.getAll();
    if (slides.length > 0) {
      console.log('Train booking data already exists, skipping seed');
      return;
    }

    // Seed hero slides
    const defaultSlides: Omit<TrainHeroSlide, 'id'>[] = [
      {
        image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=1920',
        title: 'Kandy to Ella',
        subtitle: 'The World\'s Most Scenic Train Journey',
        routeName: 'Hill Country Express',
        isActive: true,
        order: 1
      },
      {
        image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=1920',
        title: 'Nine Arch Bridge',
        subtitle: 'Sri Lanka\'s Most Photographed Railway Wonder',
        routeName: 'Demodara Loop',
        isActive: true,
        order: 2
      },
      {
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1920',
        title: 'Tea Country Rails',
        subtitle: 'Journey Through Emerald Tea Plantations',
        routeName: 'Nanu Oya to Ella',
        isActive: true,
        order: 3
      },
      {
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1920',
        title: 'Coastal Line',
        subtitle: 'Ocean Views from Colombo to Galle',
        routeName: 'Coastal Express',
        isActive: true,
        order: 4
      },
      {
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1920',
        title: 'Hill Country Adventure',
        subtitle: 'Misty Mountains & Waterfalls',
        routeName: 'Colombo to Badulla',
        isActive: true,
        order: 5
      }
    ];

    for (const slide of defaultSlides) {
      await trainHeroSlidesService.create(slide);
    }

    // Seed routes
    const defaultRoutes: Omit<ScenicRoute, 'id'>[] = [
      {
        name: 'Kandy to Ella',
        category: 'Hill Country',
        description: 'The most scenic train journey in the world - traverse through misty mountains, tea plantations, and waterfalls.',
        distance: '120 km',
        duration: '6-7 hours',
        highlights: ['Nine Arch Bridge', 'Tea Plantations', 'Mountain Scenery', 'Demodara Loop'],
        departureStation: 'Kandy',
        arrivalStation: 'Ella',
        frequency: 'Daily - Multiple trains',
        bestClass: '2nd Class Observation',
        priceRange: 'LKR 300 - 1,500',
        image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=800',
        rating: 5.0,
        popularity: 'Most Popular',
        bestTime: 'Early Morning (6:30 AM)',
        scenicStops: ['Nanu Oya', 'Pattipola', 'Haputale', 'Demodara'],
        icon: 'Mountain',
        isFeatured: true,
        isActive: true
      },
      {
        name: 'Colombo to Kandy',
        category: 'Main Line',
        description: 'Experience the transition from coastal plains to central highlands.',
        distance: '120 km',
        duration: '3 hours',
        highlights: ['Kadugannawa Pass', 'Bible Rock', 'Mountain Views', 'Colonial Stations'],
        departureStation: 'Colombo Fort',
        arrivalStation: 'Kandy',
        frequency: 'Multiple Daily',
        bestClass: '1st Class AC',
        priceRange: 'LKR 200 - 800',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800',
        rating: 4.5,
        popularity: 'Popular',
        bestTime: 'Morning or Afternoon',
        scenicStops: ['Rambukkana', 'Kadugannawa', 'Peradeniya'],
        icon: 'Train',
        isFeatured: true,
        isActive: true
      },
      {
        name: 'Colombo to Galle',
        category: 'Coastal Line',
        description: 'Stunning coastal journey along the Indian Ocean.',
        distance: '115 km',
        duration: '2.5-3 hours',
        highlights: ['Ocean Views', 'Beach Towns', 'Colonial Heritage', 'Sunset Views'],
        departureStation: 'Colombo Fort',
        arrivalStation: 'Galle',
        frequency: 'Multiple Daily',
        bestClass: '2nd Class',
        priceRange: 'LKR 180 - 600',
        image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=800',
        rating: 4.7,
        popularity: 'Popular',
        bestTime: 'Sunset Departure',
        scenicStops: ['Mount Lavinia', 'Bentota', 'Hikkaduwa', 'Unawatuna'],
        icon: 'Waves',
        isFeatured: true,
        isActive: true
      },
      {
        name: 'Nanu Oya to Ella',
        category: 'Hill Country',
        description: 'Heart of tea country - the most photographed train journey.',
        distance: '65 km',
        duration: '3-4 hours',
        highlights: ['Nine Arch Bridge', 'Highest Point', 'Tea Plantations', 'Best Photos'],
        departureStation: 'Nanu Oya',
        arrivalStation: 'Ella',
        frequency: 'Daily',
        bestClass: '2nd Class Observation',
        priceRange: 'LKR 200 - 800',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800',
        rating: 4.9,
        popularity: 'Instagram Famous',
        bestTime: 'Morning Light',
        scenicStops: ['Pattipola', 'Ohiya', 'Haputale'],
        icon: 'Camera',
        isFeatured: true,
        isActive: true
      }
    ];

    for (const route of defaultRoutes) {
      await trainRoutesService.create(route);
    }

    // Seed settings
    const defaultSettings: TrainBookingSettings = {
      trustIndicators: {
        rating: '4.9/5',
        bookings: '2,500+',
        support: '24/7'
      },
      serviceFee: 1500,
      deliveryFee: 2000,
      termsAndConditions: [
        'Booking requests are subject to availability confirmation',
        'Full payment required after confirmation (within 24 hours)',
        'Tickets are non-refundable once purchased from Sri Lanka Railways',
        'Train schedules may change - we will notify you immediately',
        'Please arrive at station at least 30 minutes before departure',
        'Keep your passport/ID for ticket collection',
        'Children under 3 travel free (no seat guaranteed)',
        'Luggage limit: 50kg per passenger',
        'Food and beverages can be purchased on long-distance trains',
        'Photography is allowed but be careful at doorways'
      ],
      cancellationPolicy: 'Free cancellation before ticket purchase. Once tickets are purchased from Sri Lanka Railways, no refunds are possible.',
      bookingProcess: [
        'Submit your booking request',
        'We check availability (24-48 hours)',
        'Receive confirmation with pricing',
        'Complete payment',
        'Receive ticket delivery/pickup info',
        'Enjoy your journey!'
      ],
      travelTips: [
        'Book 7-14 days in advance for observation car seats',
        'Early morning trains offer clearest mountain views',
        'Bring snacks, water, and a light jacket',
        'Trains can run 1-3 hours late - be flexible',
        'Window seats on the right side for Kandy-Ella views',
        'Charge your phone - power outlets in 1st class only'
      ],
      photoTips: [
        'Best shots from open doorways (be careful!)',
        'Nine Arch Bridge: Get off at Demodara station',
        'Morning golden hour: 6:30-8:30 AM',
        'Use burst mode for bridge crossings',
        'Keep camera secure with strap when hanging out'
      ],
      contactPhone: '+94 77 712 3456',
      contactEmail: 'trains@rechargetravels.com',
      contactWhatsApp: '+94777123456'
    };

    await trainSettingsService.update(defaultSettings);

    console.log('Train booking default data seeded successfully');
  } catch (error) {
    console.error('Error seeding train booking data:', error);
  }
};

export default {
  heroSlides: trainHeroSlidesService,
  routes: trainRoutesService,
  bookings: trainBookingsService,
  settings: trainSettingsService,
  seedDefaultData: seedTrainDefaultData
};
