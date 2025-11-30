import { db } from '@/lib/firebase';
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
  orderBy,
  where,
  Timestamp
} from 'firebase/firestore';

// Types for Private Tours Admin
export interface TourDestination {
  id: string;
  name: string;
  category: 'cultural' | 'wildlife' | 'beach' | 'hill-country' | 'religious' | 'adventure';
  description: string;
  thumbnail: string;
  entranceFeeUSD: number;
  recommendedDuration: string;
  coordinates: { lat: number; lng: number };
  highlights: string[];
  isActive: boolean;
  order: number;
}

export interface TourVehicle {
  id: string;
  name: string;
  type: string;
  maxPassengers: number;
  description: string;
  thumbnail: string;
  features: string[];
  pricePerDayUSD: number;
  isActive: boolean;
  order: number;
}

export interface TourDriver {
  id: string;
  type: 'normal' | 'sltda-certified' | 'driver-guide';
  name: string;
  description: string;
  pricePerDayUSD: number;
  features: string[];
  recommended: boolean;
  isActive: boolean;
}

export interface TourPackage {
  id: string;
  name: string;
  duration: string;
  destinations: string[];
  description: string;
  thumbnail: string;
  highlights: string[];
  priceFromUSD: number;
  includedVehicle: string;
  includedDriver: string;
  inclusions: string[];
  exclusions: string[];
  itinerary: { day: number; title: string; activities: string[] }[];
  isPublished: boolean;
  featured: boolean;
  order: number;
}

export interface TourExtra {
  id: string;
  name: string;
  description: string;
  icon: string;
  priceUSD: number;
  perUnit: 'day' | 'trip' | 'person';
  isActive: boolean;
}

export interface PrivateTourBooking {
  id: string;
  bookingReference: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tourType: 'package' | 'custom';
  packageId?: string;
  destinations: string[];
  durationType: 'half-day' | 'full-day' | 'multi-day';
  duration: number;
  date: string;
  pickupTime: string;
  pickupLocation: string;
  passengers: number;
  vehicleId: string;
  driverType: 'normal' | 'sltda-certified' | 'driver-guide';
  extras: { extraId: string; quantity: number }[];
  specialRequests: string;
  basePrice: number;
  vehiclePrice: number;
  driverPrice: number;
  entranceFeesTotal: number;
  extrasTotal: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PrivateToursAdminContent {
  hero: {
    title: string;
    subtitle: string;
    backgroundImages: string[];
    ctaText: string;
    ctaLink: string;
  };
  intro: {
    headline: string;
    description: string;
    stats: { label: string; value: string }[];
  };
  cta: {
    headline: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
  };
  booking: {
    depositPercent: number;
    depositNote: string;
    cancellationPolicy: string;
    responseTime: string;
    whatsapp: string;
    email: string;
    phone: string;
    pickupLocations: string[];
    paymentMethods: string[];
  };
  destinations: TourDestination[];
  vehicles: TourVehicle[];
  drivers: TourDriver[];
  packages: TourPackage[];
  extras: TourExtra[];
}

export const defaultPrivateToursContent: PrivateToursAdminContent = {
  hero: {
    title: 'Private Tours Sri Lanka',
    subtitle: 'Discover the Pearl of the Indian Ocean with personalized private tours',
    backgroundImages: [
      'https://images.unsplash.com/photo-1588598198321-9735c07c3c8c?w=1920',
      'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=1920',
      'https://images.unsplash.com/photo-1552423314-cf29ab68ad73?w=1920'
    ],
    ctaText: 'Plan Your Tour',
    ctaLink: '#booking'
  },
  intro: {
    headline: 'Your Journey, Your Way',
    description: 'Experience Sri Lanka like never before with our customizable private tours.',
    stats: [
      { label: 'Happy Travelers', value: '5000+' },
      { label: 'Tours Completed', value: '3500+' },
      { label: 'Years Experience', value: '15+' },
      { label: 'Customer Rating', value: '4.9/5' }
    ]
  },
  cta: {
    headline: 'Ready to Explore Sri Lanka?',
    subtitle: 'Let us create your perfect private tour experience',
    buttonText: 'Start Planning',
    buttonLink: '#booking'
  },
  booking: {
    depositPercent: 30,
    depositNote: '30% deposit required to confirm your booking',
    cancellationPolicy: 'Free cancellation up to 48 hours before the tour',
    responseTime: 'Within 2 hours',
    whatsapp: '+94771234567',
    email: 'tours@rechargetravels.com',
    phone: '+94112345678',
    pickupLocations: [
      'Colombo Fort',
      'Bandaranaike International Airport',
      'Negombo',
      'Kandy',
      'Galle',
      'Custom Location'
    ],
    paymentMethods: ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash on Arrival']
  },
  destinations: [],
  vehicles: [],
  drivers: [],
  packages: [],
  extras: []
};

// Collection references
const CONTENT_DOC = 'privateToursContent';
const DESTINATIONS_COLLECTION = 'privateTourDestinations';
const VEHICLES_COLLECTION = 'privateTourVehicles';
const DRIVERS_COLLECTION = 'privateTourDrivers';
const PACKAGES_COLLECTION = 'privateTourPackages';
const EXTRAS_COLLECTION = 'privateTourExtras';
const BOOKINGS_COLLECTION = 'privateTourBookings';

export const privateToursAdminService = {
  // Get all content
  async getContent(): Promise<PrivateToursAdminContent> {
    const docRef = doc(db, 'cmsContent', CONTENT_DOC);
    const docSnap = await getDoc(docRef);

    const baseContent = docSnap.exists()
      ? { ...defaultPrivateToursContent, ...docSnap.data() }
      : defaultPrivateToursContent;

    // Fetch destinations
    const destinationsQuery = query(
      collection(db, DESTINATIONS_COLLECTION),
      orderBy('order', 'asc')
    );
    const destinationsSnap = await getDocs(destinationsQuery);
    const destinations = destinationsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TourDestination[];

    // Fetch vehicles
    const vehiclesQuery = query(
      collection(db, VEHICLES_COLLECTION),
      orderBy('order', 'asc')
    );
    const vehiclesSnap = await getDocs(vehiclesQuery);
    const vehicles = vehiclesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TourVehicle[];

    // Fetch drivers
    const driversSnap = await getDocs(collection(db, DRIVERS_COLLECTION));
    const drivers = driversSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TourDriver[];

    // Fetch packages
    const packagesQuery = query(
      collection(db, PACKAGES_COLLECTION),
      orderBy('order', 'asc')
    );
    const packagesSnap = await getDocs(packagesQuery);
    const packages = packagesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TourPackage[];

    // Fetch extras
    const extrasSnap = await getDocs(collection(db, EXTRAS_COLLECTION));
    const extras = extrasSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TourExtra[];

    return {
      ...baseContent,
      destinations,
      vehicles,
      drivers,
      packages,
      extras
    };
  },

  // Save base content
  async saveContent(content: Partial<PrivateToursAdminContent>): Promise<void> {
    const { destinations, vehicles, drivers, packages, extras, ...baseContent } = content;
    const docRef = doc(db, 'cmsContent', CONTENT_DOC);
    await setDoc(docRef, {
      ...baseContent,
      updatedAt: Timestamp.now()
    }, { merge: true });
  },

  // Destination CRUD
  async addDestination(data: Omit<TourDestination, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, DESTINATIONS_COLLECTION), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  },

  async updateDestination(id: string, data: Partial<TourDestination>): Promise<void> {
    const docRef = doc(db, DESTINATIONS_COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  },

  async deleteDestination(id: string): Promise<void> {
    await deleteDoc(doc(db, DESTINATIONS_COLLECTION, id));
  },

  // Vehicle CRUD
  async addVehicle(data: Omit<TourVehicle, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, VEHICLES_COLLECTION), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  },

  async updateVehicle(id: string, data: Partial<TourVehicle>): Promise<void> {
    const docRef = doc(db, VEHICLES_COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  },

  async deleteVehicle(id: string): Promise<void> {
    await deleteDoc(doc(db, VEHICLES_COLLECTION, id));
  },

  // Driver CRUD
  async addDriver(data: Omit<TourDriver, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, DRIVERS_COLLECTION), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  },

  async updateDriver(id: string, data: Partial<TourDriver>): Promise<void> {
    const docRef = doc(db, DRIVERS_COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  },

  async deleteDriver(id: string): Promise<void> {
    await deleteDoc(doc(db, DRIVERS_COLLECTION, id));
  },

  // Package CRUD
  async addPackage(data: Omit<TourPackage, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, PACKAGES_COLLECTION), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  },

  async updatePackage(id: string, data: Partial<TourPackage>): Promise<void> {
    const docRef = doc(db, PACKAGES_COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  },

  async deletePackage(id: string): Promise<void> {
    await deleteDoc(doc(db, PACKAGES_COLLECTION, id));
  },

  // Extra CRUD
  async addExtra(data: Omit<TourExtra, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, EXTRAS_COLLECTION), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  },

  async updateExtra(id: string, data: Partial<TourExtra>): Promise<void> {
    const docRef = doc(db, EXTRAS_COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  },

  async deleteExtra(id: string): Promise<void> {
    await deleteDoc(doc(db, EXTRAS_COLLECTION, id));
  },

  // Bookings Management
  async getBookings(statusFilter?: string): Promise<PrivateTourBooking[]> {
    let q = query(collection(db, BOOKINGS_COLLECTION), orderBy('createdAt', 'desc'));

    if (statusFilter && statusFilter !== 'all') {
      q = query(
        collection(db, BOOKINGS_COLLECTION),
        where('status', '==', statusFilter),
        orderBy('createdAt', 'desc')
      );
    }

    const snap = await getDocs(q);
    return snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PrivateTourBooking[];
  },

  async updateBookingStatus(
    bookingId: string,
    status: PrivateTourBooking['status'],
    paymentStatus?: PrivateTourBooking['paymentStatus']
  ): Promise<void> {
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    const updates: any = {
      status,
      updatedAt: Timestamp.now()
    };
    if (paymentStatus) {
      updates.paymentStatus = paymentStatus;
    }
    await updateDoc(docRef, updates);
  },

  async getBookingStats(): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    totalRevenue: number;
  }> {
    const bookings = await this.getBookings();
    return {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
      totalRevenue: bookings
        .filter(b => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + b.totalPrice, 0)
    };
  },

  // Seed default data
  async seedDefaultData(): Promise<void> {
    // Seed destinations
    const defaultDestinations: Omit<TourDestination, 'id'>[] = [
      {
        name: 'Sigiriya Rock Fortress',
        category: 'cultural',
        description: 'Ancient rock fortress and UNESCO World Heritage Site',
        thumbnail: 'https://images.unsplash.com/photo-1588598198321-9735c07c3c8c?w=800',
        entranceFeeUSD: 35,
        recommendedDuration: '3-4 hours',
        coordinates: { lat: 7.9570, lng: 80.7603 },
        highlights: ['Lions Gate', 'Frescoes', 'Mirror Wall', 'Summit Views'],
        isActive: true,
        order: 1
      },
      {
        name: 'Temple of the Sacred Tooth',
        category: 'religious',
        description: 'Sacred Buddhist temple housing the relic of the tooth of Buddha',
        thumbnail: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=800',
        entranceFeeUSD: 15,
        recommendedDuration: '2 hours',
        coordinates: { lat: 7.2936, lng: 80.6413 },
        highlights: ['Sacred Relic', 'Temple Architecture', 'Museum', 'Lake View'],
        isActive: true,
        order: 2
      },
      {
        name: 'Yala National Park',
        category: 'wildlife',
        description: 'Famous wildlife sanctuary with highest leopard density in the world',
        thumbnail: 'https://images.unsplash.com/photo-1552423314-cf29ab68ad73?w=800',
        entranceFeeUSD: 45,
        recommendedDuration: 'Half day',
        coordinates: { lat: 6.3698, lng: 81.5046 },
        highlights: ['Leopards', 'Elephants', 'Birds', 'Crocodiles'],
        isActive: true,
        order: 3
      },
      {
        name: 'Galle Fort',
        category: 'cultural',
        description: 'Historic Dutch colonial fort and UNESCO World Heritage Site',
        thumbnail: 'https://images.unsplash.com/photo-1580974928064-f0aeef70895a?w=800',
        entranceFeeUSD: 0,
        recommendedDuration: '3 hours',
        coordinates: { lat: 6.0269, lng: 80.2170 },
        highlights: ['Fort Walls', 'Lighthouse', 'Colonial Architecture', 'Boutiques'],
        isActive: true,
        order: 4
      },
      {
        name: 'Ella',
        category: 'hill-country',
        description: 'Scenic hill town with tea plantations and hiking trails',
        thumbnail: 'https://images.unsplash.com/photo-1586523969051-3aa86d3f6a34?w=800',
        entranceFeeUSD: 0,
        recommendedDuration: 'Full day',
        coordinates: { lat: 6.8667, lng: 81.0466 },
        highlights: ['Nine Arch Bridge', 'Little Adams Peak', 'Tea Plantations', 'Ravana Falls'],
        isActive: true,
        order: 5
      },
      {
        name: 'Mirissa Beach',
        category: 'beach',
        description: 'Beautiful beach famous for whale watching',
        thumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        entranceFeeUSD: 0,
        recommendedDuration: 'Half day',
        coordinates: { lat: 5.9483, lng: 80.4589 },
        highlights: ['Whale Watching', 'Beach', 'Surfing', 'Coconut Tree Hill'],
        isActive: true,
        order: 6
      }
    ];

    for (const dest of defaultDestinations) {
      await this.addDestination(dest);
    }

    // Seed vehicles
    const defaultVehicles: Omit<TourVehicle, 'id'>[] = [
      {
        name: 'Economy Sedan',
        type: 'sedan',
        maxPassengers: 3,
        description: 'Comfortable sedan for small groups',
        thumbnail: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800',
        features: ['AC', 'Music System', 'Comfortable Seats'],
        pricePerDayUSD: 50,
        isActive: true,
        order: 1
      },
      {
        name: 'Standard SUV',
        type: 'suv',
        maxPassengers: 5,
        description: 'Spacious SUV for families',
        thumbnail: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
        features: ['AC', 'Music System', '4WD', 'Luggage Space'],
        pricePerDayUSD: 75,
        isActive: true,
        order: 2
      },
      {
        name: 'Premium Van',
        type: 'van',
        maxPassengers: 8,
        description: 'Comfortable van for groups',
        thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        features: ['AC', 'WiFi', 'USB Charging', 'Reclining Seats'],
        pricePerDayUSD: 100,
        isActive: true,
        order: 3
      },
      {
        name: 'Luxury SUV',
        type: 'luxury',
        maxPassengers: 5,
        description: 'Premium luxury SUV for VIP tours',
        thumbnail: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        features: ['AC', 'WiFi', 'Leather Seats', 'Refrigerator', 'USB Charging', 'Panoramic Roof'],
        pricePerDayUSD: 150,
        isActive: true,
        order: 4
      }
    ];

    for (const vehicle of defaultVehicles) {
      await this.addVehicle(vehicle);
    }

    // Seed drivers
    const defaultDrivers: Omit<TourDriver, 'id'>[] = [
      {
        type: 'normal',
        name: 'Professional Driver',
        description: 'Experienced, courteous driver with excellent knowledge of roads',
        pricePerDayUSD: 0,
        features: ['Experienced & professional', 'Knowledge of routes', 'Safe driving', 'English communication'],
        recommended: false,
        isActive: true
      },
      {
        type: 'sltda-certified',
        name: 'SLTDA Certified Driver',
        description: 'Government certified chauffeur with tourism training',
        pricePerDayUSD: 25,
        features: ['SLTDA certified', 'Tourism training', 'Professional uniform', 'Better English', 'Background verified'],
        recommended: true,
        isActive: true
      },
      {
        type: 'driver-guide',
        name: 'Driver Guide',
        description: 'Licensed guide who drives - your tour narrator and driver in one!',
        pricePerDayUSD: 50,
        features: ['Licensed tour guide + driver', 'Expert local knowledge', 'Historical insights', 'Multi-language', 'Photography tips'],
        recommended: false,
        isActive: true
      }
    ];

    for (const driver of defaultDrivers) {
      await this.addDriver(driver);
    }

    // Seed extras
    const defaultExtras: Omit<TourExtra, 'id'>[] = [
      { name: 'Packed Lunch', description: 'Traditional Sri Lankan lunch pack', icon: 'utensils', priceUSD: 15, perUnit: 'person', isActive: true },
      { name: 'Bottled Water', description: 'Unlimited bottled water', icon: 'droplets', priceUSD: 5, perUnit: 'day', isActive: true },
      { name: 'Portable WiFi', description: 'High-speed mobile hotspot', icon: 'wifi', priceUSD: 10, perUnit: 'day', isActive: true },
      { name: 'Professional Photography', description: 'Tour photographer service', icon: 'camera', priceUSD: 100, perUnit: 'day', isActive: true },
      { name: 'Child Seat', description: 'Safe child car seat', icon: 'baby', priceUSD: 10, perUnit: 'trip', isActive: true }
    ];

    for (const extra of defaultExtras) {
      await this.addExtra(extra);
    }

    // Save base content
    await this.saveContent(defaultPrivateToursContent);
  }
};

export default privateToursAdminService;
