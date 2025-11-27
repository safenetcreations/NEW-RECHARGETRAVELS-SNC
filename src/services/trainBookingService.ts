import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
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

// Train Route interface for booking page
export interface TrainRoute {
  id: string;
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
  isActive: boolean;
  sortOrder: number;
}

// Train Booking Request
export interface TrainBookingRequest {
  id?: string;
  bookingReference: string;
  route: {
    id: string;
    name: string;
    departureStation: string;
    arrivalStation: string;
  };
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    passportNumber?: string;
  };
  travelDetails: {
    travelDate: string;
    passengers: number;
    ticketClass: string;
    handDelivery: boolean;
    hotelAddress?: string;
    specialRequests?: string;
  };
  pricing: {
    estimatedPrice: string;
    deliveryFee?: number;
    totalEstimate?: string;
  };
  status: 'pending' | 'confirmed' | 'tickets_ready' | 'delivered' | 'completed' | 'cancelled';
  adminNotes?: string;
  createdAt?: any;
  updatedAt?: any;
}

// Page content for Train Booking
export interface TrainBookingPageContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    backgroundImage: string;
    badges: Array<{ icon: string; text: string }>;
  };
  trustIndicators: {
    rating: string;
    bookingsCompleted: string;
    support: string;
  };
  importantInfo: Array<{
    id: string;
    icon: string;
    title: string;
    items: string[];
  }>;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

// Default routes
const DEFAULT_ROUTES: TrainRoute[] = [
  {
    id: 'kandy-ella',
    name: 'Kandy to Ella',
    category: 'Hill Country',
    description: 'The most scenic train journey in the world - traverse through misty mountains, tea plantations, and waterfalls',
    distance: '120 km',
    duration: '6-7 hours',
    highlights: ['Nine Arch Bridge', 'Tea Plantations', 'Mountain Scenery', 'Demodara Loop'],
    departureStation: 'Kandy',
    arrivalStation: 'Ella',
    frequency: 'Daily',
    bestClass: '2nd Class Observation Car',
    priceRange: 'LKR 300-1,500',
    image: 'https://i.imgur.com/cTqS05p.jpeg',
    rating: 5.0,
    popularity: 'Most Popular',
    bestTime: 'Early Morning (6:30 AM departure)',
    scenicStops: ['Nanu Oya', 'Pattipola', 'Haputale', 'Demodara'],
    icon: 'Mountain',
    isActive: true,
    sortOrder: 1
  },
  {
    id: 'colombo-kandy',
    name: 'Colombo to Kandy',
    category: 'Main Line',
    description: 'Experience the transition from coastal plains to central highlands',
    distance: '120 km',
    duration: '3 hours',
    highlights: ['Kadugannawa Pass', 'Mountain Views', 'Historical Route', 'Bible Rock'],
    departureStation: 'Colombo Fort',
    arrivalStation: 'Kandy',
    frequency: 'Multiple Daily',
    bestClass: '1st Class AC',
    priceRange: 'LKR 200-800',
    image: 'https://i.imgur.com/AEnBWJf.jpeg',
    rating: 4.5,
    popularity: 'Popular',
    bestTime: 'Morning or Afternoon',
    scenicStops: ['Rambukkana', 'Kadugannawa', 'Peradeniya'],
    icon: 'Train',
    isActive: true,
    sortOrder: 2
  },
  {
    id: 'colombo-galle',
    name: 'Colombo to Galle',
    category: 'Coastal Line',
    description: 'Stunning coastal journey along the Indian Ocean with beach views',
    distance: '115 km',
    duration: '2.5-3 hours',
    highlights: ['Ocean Views', 'Beach Towns', 'Colonial Heritage', 'Coastal Villages'],
    departureStation: 'Colombo Fort',
    arrivalStation: 'Galle',
    frequency: 'Multiple Daily',
    bestClass: '2nd Class',
    priceRange: 'LKR 180-600',
    image: 'https://i.imgur.com/QBIw5qw.jpeg',
    rating: 4.7,
    popularity: 'Popular',
    bestTime: 'Sunset Departure',
    scenicStops: ['Mount Lavinia', 'Bentota', 'Hikkaduwa', 'Unawatuna'],
    icon: 'Waves',
    isActive: true,
    sortOrder: 3
  },
  {
    id: 'colombo-badulla',
    name: 'Colombo to Badulla',
    category: 'Main Line',
    description: 'The complete upcountry experience from coast to mountains',
    distance: '292 km',
    duration: '10-11 hours',
    highlights: ['Complete Hill Country', 'Longest Journey', 'Tea Country', 'Waterfalls'],
    departureStation: 'Colombo Fort',
    arrivalStation: 'Badulla',
    frequency: 'Daily',
    bestClass: '2nd Class Observation Car',
    priceRange: 'LKR 400-2,000',
    image: 'https://i.imgur.com/xRFe6sI.jpeg',
    rating: 4.9,
    popularity: 'Epic Journey',
    bestTime: 'Early Morning Start',
    scenicStops: ['Kandy', 'Nuwara Eliya', 'Ella', 'Haputale'],
    icon: 'Mountain',
    isActive: true,
    sortOrder: 4
  },
  {
    id: 'ella-badulla',
    name: 'Ella to Badulla',
    category: 'Hill Country',
    description: 'Short scenic journey through tea country and mountains',
    distance: '25 km',
    duration: '1.5 hours',
    highlights: ['Tea Estates', 'Demodara Loop', 'Mountain Views', 'Local Experience'],
    departureStation: 'Ella',
    arrivalStation: 'Badulla',
    frequency: 'Multiple Daily',
    bestClass: '2nd Class',
    priceRange: 'LKR 100-300',
    image: 'https://i.imgur.com/l2jvb2Y.jpeg',
    rating: 4.4,
    popularity: 'Scenic Short Trip',
    bestTime: 'Morning',
    scenicStops: ['Demodara', 'Hali Ela'],
    icon: 'Eye',
    isActive: true,
    sortOrder: 5
  },
  {
    id: 'nanu-oya-ella',
    name: 'Nanu Oya to Ella',
    category: 'Hill Country',
    description: 'Heart of tea country - the most photographed train journey',
    distance: '65 km',
    duration: '3-4 hours',
    highlights: ['Nine Arch Bridge', 'Highest Point', 'Tea Plantations', 'Best Photos'],
    departureStation: 'Nanu Oya (Nuwara Eliya)',
    arrivalStation: 'Ella',
    frequency: 'Daily',
    bestClass: '2nd Class Observation Car',
    priceRange: 'LKR 200-800',
    image: 'https://i.imgur.com/oGUvzQL.jpeg',
    rating: 4.9,
    popularity: 'Instagram Famous',
    bestTime: 'Morning Light',
    scenicStops: ['Pattipola', 'Ohiya', 'Haputale'],
    icon: 'Camera',
    isActive: true,
    sortOrder: 6
  }
];

// Default page content
const DEFAULT_PAGE_CONTENT: TrainBookingPageContent = {
  hero: {
    title: 'Book Your Train Journey Through Paradise',
    subtitle: 'Sri Lanka Railways - Scenic Journeys',
    description: "Experience the world's most scenic train routes through Sri Lanka's breathtaking hill country, coastal lines, and tea plantations. We handle the booking for you!",
    backgroundImage: 'https://i.imgur.com/cTqS05p.jpeg',
    badges: [
      { icon: 'Star', text: 'Famous Scenic Routes' },
      { icon: 'Clock', text: 'Manual Booking Service' },
      { icon: 'AlertCircle', text: 'Live Updates' }
    ]
  },
  trustIndicators: {
    rating: '4.9',
    bookingsCompleted: '2,500+',
    support: '24/7'
  },
  importantInfo: [
    {
      id: '1',
      icon: 'AlertCircle',
      title: 'Booking Process',
      items: [
        'Submit booking request online',
        'We check availability manually',
        'Confirmation within 24 hours',
        'Payment details sent via email',
        'Tickets delivered or ready at station'
      ]
    },
    {
      id: '2',
      icon: 'Info',
      title: 'Best Booking Tips',
      items: [
        'Book at least 7-14 days in advance',
        'Observation cars fill up quickly',
        'Early morning trains offer best views',
        'Window seats recommended for photos',
        'Bring snacks and water'
      ]
    },
    {
      id: '3',
      icon: 'Clock',
      title: 'What to Expect',
      items: [
        'Trains may run late (be flexible)',
        'Carriages can be crowded',
        'Doors stay open for photos',
        'Basic facilities on board',
        'Stunning scenery guaranteed'
      ]
    },
    {
      id: '4',
      icon: 'Camera',
      title: 'Photography Tips',
      items: [
        'Best shots from open doorways',
        'Nine Arch Bridge: get off at Demodara',
        'Morning light ideal for landscapes',
        'Keep camera secure while hanging out',
        'Video the entire journey'
      ]
    }
  ],
  seo: {
    title: 'Sri Lanka Train Booking - Scenic Railway Journeys | Recharge Travels',
    description: 'Book famous Sri Lankan train routes - Kandy to Ella, Colombo to Galle coastal line, and more scenic railway journeys. Manual booking service with live updates.',
    keywords: [
      'Sri Lanka train booking',
      'Kandy to Ella train',
      'Sri Lanka railway',
      'hill country train',
      'coastal train Sri Lanka'
    ]
  }
};

class TrainBookingService {
  private routesCollection = 'trainRoutes';
  private bookingsCollection = 'trainBookings';
  private pageContentDoc = 'page-content/train-booking';

  // ============ PAGE CONTENT ============

  async getPageContent(): Promise<TrainBookingPageContent> {
    try {
      const docRef = doc(db, this.pageContentDoc);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { ...DEFAULT_PAGE_CONTENT, ...docSnap.data() } as TrainBookingPageContent;
      }
      return DEFAULT_PAGE_CONTENT;
    } catch (error) {
      console.error('Error loading page content:', error);
      return DEFAULT_PAGE_CONTENT;
    }
  }

  async updatePageContent(content: Partial<TrainBookingPageContent>): Promise<void> {
    try {
      const docRef = doc(db, this.pageContentDoc);
      await setDoc(docRef, {
        ...content,
        updatedAt: Timestamp.now()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating page content:', error);
      throw error;
    }
  }

  // ============ ROUTES ============

  async getRoutes(activeOnly = true): Promise<TrainRoute[]> {
    try {
      let q = query(
        collection(db, this.routesCollection),
        orderBy('sortOrder', 'asc')
      );

      if (activeOnly) {
        q = query(q, where('isActive', '==', true));
      }

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        // Return default routes if none exist
        return DEFAULT_ROUTES;
      }

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TrainRoute[];
    } catch (error) {
      console.error('Error getting routes:', error);
      return DEFAULT_ROUTES;
    }
  }

  async getRouteById(id: string): Promise<TrainRoute | null> {
    try {
      const docRef = doc(db, this.routesCollection, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as TrainRoute;
      }

      // Check default routes
      return DEFAULT_ROUTES.find(r => r.id === id) || null;
    } catch (error) {
      console.error('Error getting route:', error);
      return DEFAULT_ROUTES.find(r => r.id === id) || null;
    }
  }

  async createRoute(data: Omit<TrainRoute, 'id'>): Promise<TrainRoute> {
    try {
      const docRef = await addDoc(collection(db, this.routesCollection), {
        ...data,
        createdAt: Timestamp.now()
      });

      return { id: docRef.id, ...data };
    } catch (error) {
      console.error('Error creating route:', error);
      throw error;
    }
  }

  async updateRoute(id: string, data: Partial<TrainRoute>): Promise<void> {
    try {
      const docRef = doc(db, this.routesCollection, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating route:', error);
      throw error;
    }
  }

  async deleteRoute(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.routesCollection, id));
    } catch (error) {
      console.error('Error deleting route:', error);
      throw error;
    }
  }

  // ============ BOOKINGS ============

  async createBooking(data: Omit<TrainBookingRequest, 'id' | 'bookingReference' | 'createdAt'>): Promise<TrainBookingRequest> {
    try {
      const bookingReference = this.generateBookingReference();

      const docRef = await addDoc(collection(db, this.bookingsCollection), {
        ...data,
        bookingReference,
        status: 'pending',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      return {
        id: docRef.id,
        bookingReference,
        ...data
      } as TrainBookingRequest;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async getBookings(options?: {
    status?: string;
    limitCount?: number;
  }): Promise<TrainBookingRequest[]> {
    try {
      let q = query(
        collection(db, this.bookingsCollection),
        orderBy('createdAt', 'desc')
      );

      if (options?.status) {
        q = query(q, where('status', '==', options.status));
      }

      if (options?.limitCount) {
        q = query(q, limit(options.limitCount));
      }

      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TrainBookingRequest[];
    } catch (error) {
      console.error('Error getting bookings:', error);
      return [];
    }
  }

  async getBookingByReference(reference: string): Promise<TrainBookingRequest | null> {
    try {
      const q = query(
        collection(db, this.bookingsCollection),
        where('bookingReference', '==', reference),
        limit(1)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() } as TrainBookingRequest;
      }
      return null;
    } catch (error) {
      console.error('Error getting booking:', error);
      return null;
    }
  }

  async updateBookingStatus(
    id: string,
    status: TrainBookingRequest['status'],
    adminNotes?: string
  ): Promise<void> {
    try {
      const docRef = doc(db, this.bookingsCollection, id);
      await updateDoc(docRef, {
        status,
        ...(adminNotes && { adminNotes }),
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  async deleteBooking(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.bookingsCollection, id));
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }

  // ============ STATISTICS ============

  async getStatistics(): Promise<{
    totalBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    popularRoutes: Array<{ routeId: string; count: number }>;
  }> {
    try {
      const bookings = await this.getBookings();

      const pendingCount = bookings.filter(b => b.status === 'pending').length;
      const confirmedCount = bookings.filter(b => ['confirmed', 'tickets_ready', 'delivered', 'completed'].includes(b.status)).length;

      // Count bookings per route
      const routeCounts: Record<string, number> = {};
      bookings.forEach(b => {
        const routeId = b.route.id;
        routeCounts[routeId] = (routeCounts[routeId] || 0) + 1;
      });

      const popularRoutes = Object.entries(routeCounts)
        .map(([routeId, count]) => ({ routeId, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        totalBookings: bookings.length,
        pendingBookings: pendingCount,
        confirmedBookings: confirmedCount,
        popularRoutes
      };
    } catch (error) {
      console.error('Error getting statistics:', error);
      return {
        totalBookings: 0,
        pendingBookings: 0,
        confirmedBookings: 0,
        popularRoutes: []
      };
    }
  }

  // ============ HELPERS ============

  private generateBookingReference(): string {
    const prefix = 'TR';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  getTicketClasses(): string[] {
    return [
      '3rd Class',
      '2nd Class',
      '2nd Class Observation Car',
      '1st Class',
      '1st Class AC'
    ];
  }

  getCategories(): string[] {
    return ['All', 'Hill Country', 'Main Line', 'Coastal Line'];
  }
}

export const trainBookingService = new TrainBookingService();
