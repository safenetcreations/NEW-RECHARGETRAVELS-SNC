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
export interface GroupVehicle {
  id?: string;
  name: string;
  type: 'van' | 'minibus' | 'coach' | 'luxury-coach';
  capacity: number;
  features: string[];
  image: string;
  pricePerDay: number;
  pricePerKm: number;
  minimumHours: number;
  hourlyRate: number;
  isActive: boolean;
  popular?: boolean;
  description?: string;
}

export interface DriverCharge {
  id?: string;
  name: string;
  description: string;
  amount: number;
  type: 'per-day' | 'per-trip' | 'hourly';
  isOptional: boolean;
  isActive: boolean;
}

export interface GroupTransportBooking {
  id: string;
  bookingReference: string;
  vehicleId: string;
  vehicleName: string;
  vehicleType: string;
  tripType: 'one-way' | 'round-trip' | 'multi-day';
  pickupLocation: string;
  pickupDate: string;
  pickupTime: string;
  dropoffLocation: string;
  returnDate?: string;
  returnTime?: string;
  stops?: string[];
  estimatedDistance?: number;
  estimatedDuration?: string;
  passengers: number;
  selectedExtras?: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  driverType: 'standard' | 'english-speaking' | 'tour-guide';
  driverCharges: number;
  vehiclePrice: number;
  extrasTotal: number;
  totalPrice: number;
  depositAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCountry?: string;
  specialRequests?: string;
  occasion?: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'deposit-paid' | 'paid' | 'refunded';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface HeroSlide {
  id?: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  isActive: boolean;
  order: number;
}

export interface GroupTransportSettings {
  trustIndicators: {
    rating: string;
    reviews: string;
    support: string;
  };
  howToBook: {
    step: number;
    title: string;
    description: string;
    icon: string;
  }[];
  terms: string[];
  cancellationPolicy: string;
  driverChargeRates: {
    standard: number;
    englishSpeaking: number;
    tourGuide: number;
  };
}

// Vehicles Service
export const vehiclesAdminService = {
  async getAll(): Promise<GroupVehicle[]> {
    try {
      const q = query(collection(db, 'groupTransportVehicles'), orderBy('capacity', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GroupVehicle));
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      return [];
    }
  },

  async create(vehicle: Omit<GroupVehicle, 'id'>): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, 'groupTransportVehicles'), vehicle);
      return docRef.id;
    } catch (error) {
      console.error('Error creating vehicle:', error);
      return null;
    }
  },

  async update(id: string, vehicle: Partial<GroupVehicle>): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'groupTransportVehicles', id), vehicle);
      return true;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      return false;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'groupTransportVehicles', id));
      return true;
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      return false;
    }
  }
};

// Driver Charges Service
export const driverChargesAdminService = {
  async getAll(): Promise<DriverCharge[]> {
    try {
      const snapshot = await getDocs(collection(db, 'groupTransportDriverCharges'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DriverCharge));
    } catch (error) {
      console.error('Error fetching driver charges:', error);
      return [];
    }
  },

  async create(charge: Omit<DriverCharge, 'id'>): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, 'groupTransportDriverCharges'), charge);
      return docRef.id;
    } catch (error) {
      console.error('Error creating driver charge:', error);
      return null;
    }
  },

  async update(id: string, charge: Partial<DriverCharge>): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'groupTransportDriverCharges', id), charge);
      return true;
    } catch (error) {
      console.error('Error updating driver charge:', error);
      return false;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'groupTransportDriverCharges', id));
      return true;
    } catch (error) {
      console.error('Error deleting driver charge:', error);
      return false;
    }
  }
};

// Hero Slides Service
export const heroSlidesAdminService = {
  async getAll(): Promise<HeroSlide[]> {
    try {
      const q = query(collection(db, 'groupTransportHeroSlides'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HeroSlide));
    } catch (error) {
      console.error('Error fetching hero slides:', error);
      return [];
    }
  },

  async create(slide: Omit<HeroSlide, 'id'>): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, 'groupTransportHeroSlides'), slide);
      return docRef.id;
    } catch (error) {
      console.error('Error creating hero slide:', error);
      return null;
    }
  },

  async update(id: string, slide: Partial<HeroSlide>): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'groupTransportHeroSlides', id), slide);
      return true;
    } catch (error) {
      console.error('Error updating hero slide:', error);
      return false;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'groupTransportHeroSlides', id));
      return true;
    } catch (error) {
      console.error('Error deleting hero slide:', error);
      return false;
    }
  }
};

// Settings Service
export const settingsAdminService = {
  async get(): Promise<GroupTransportSettings | null> {
    try {
      const docRef = doc(db, 'cmsContent', 'groupTransportSettings');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as GroupTransportSettings;
      }
      return null;
    } catch (error) {
      console.error('Error fetching settings:', error);
      return null;
    }
  },

  async update(settings: GroupTransportSettings): Promise<boolean> {
    try {
      await setDoc(doc(db, 'cmsContent', 'groupTransportSettings'), settings, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      return false;
    }
  }
};

// Bookings Service
export const bookingsAdminService = {
  async getAll(): Promise<GroupTransportBooking[]> {
    try {
      const q = query(collection(db, 'groupTransportBookings'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GroupTransportBooking));
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }
  },

  async getByStatus(status: GroupTransportBooking['status']): Promise<GroupTransportBooking[]> {
    try {
      const q = query(
        collection(db, 'groupTransportBookings'),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GroupTransportBooking));
    } catch (error) {
      console.error('Error fetching bookings by status:', error);
      return [];
    }
  },

  async updateStatus(id: string, status: GroupTransportBooking['status']): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'groupTransportBookings', id), {
        status,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Error updating booking status:', error);
      return false;
    }
  },

  async updatePaymentStatus(id: string, paymentStatus: GroupTransportBooking['paymentStatus']): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'groupTransportBookings', id), {
        paymentStatus,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Error updating payment status:', error);
      return false;
    }
  },

  async getStats(): Promise<{ total: number; pending: number; confirmed: number; completed: number; revenue: number }> {
    try {
      const bookings = await this.getAll();
      const total = bookings.length;
      const pending = bookings.filter(b => b.status === 'pending').length;
      const confirmed = bookings.filter(b => b.status === 'confirmed').length;
      const completed = bookings.filter(b => b.status === 'completed').length;
      const revenue = bookings
        .filter(b => b.paymentStatus === 'paid' || b.paymentStatus === 'deposit-paid')
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

      return { total, pending, confirmed, completed, revenue };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return { total: 0, pending: 0, confirmed: 0, completed: 0, revenue: 0 };
    }
  }
};

// Seed default data
export const seedDefaultData = async (): Promise<void> => {
  try {
    // Check if data exists
    const vehicles = await vehiclesAdminService.getAll();
    if (vehicles.length > 0) {
      console.log('Data already exists, skipping seed');
      return;
    }

    // Seed vehicles
    const defaultVehicles: Omit<GroupVehicle, 'id'>[] = [
      {
        name: 'Premium Van',
        type: 'van',
        capacity: 10,
        features: ['Air Conditioning', 'Comfortable Seats', 'Luggage Space', 'USB Charging', 'Water Bottles'],
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80',
        pricePerDay: 80,
        pricePerKm: 1.5,
        minimumHours: 4,
        hourlyRate: 15,
        isActive: true,
        popular: true,
        description: 'Perfect for small groups and family trips. Comfortable seating with ample luggage space.'
      },
      {
        name: 'Mini Coach',
        type: 'minibus',
        capacity: 20,
        features: ['Reclining Seats', 'Entertainment System', 'Cool Box', 'WiFi Available', 'PA System'],
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80',
        pricePerDay: 150,
        pricePerKm: 2.5,
        minimumHours: 4,
        hourlyRate: 25,
        isActive: true,
        description: 'Ideal for medium-sized groups, corporate outings, and school trips.'
      },
      {
        name: 'Luxury Coach',
        type: 'coach',
        capacity: 35,
        features: ['Premium Seats', 'AC', 'Toilet', 'Entertainment', 'Refreshments', 'WiFi'],
        image: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&q=80',
        pricePerDay: 250,
        pricePerKm: 3.5,
        minimumHours: 6,
        hourlyRate: 40,
        isActive: true,
        popular: true,
        description: 'Premium travel experience with all amenities for longer journeys.'
      },
      {
        name: 'Large Coach',
        type: 'luxury-coach',
        capacity: 55,
        features: ['Spacious Interior', 'Large Luggage Compartment', 'PA System', 'Safety Features', 'Toilet', 'Entertainment'],
        image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&q=80',
        pricePerDay: 350,
        pricePerKm: 4.5,
        minimumHours: 6,
        hourlyRate: 55,
        isActive: true,
        description: 'Perfect for large groups, conferences, and tour groups.'
      }
    ];

    for (const vehicle of defaultVehicles) {
      await vehiclesAdminService.create(vehicle);
    }

    // Seed hero slides
    const defaultSlides: Omit<HeroSlide, 'id'>[] = [
      {
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80',
        title: 'Travel Together, Save Together',
        subtitle: 'Premium Group Transportation Solutions',
        description: 'Comfortable coaches and vans for families, corporate groups, and large tour parties',
        isActive: true,
        order: 1
      },
      {
        image: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&q=80',
        title: 'Corporate & Event Transport',
        subtitle: 'Professional Fleet for Business',
        description: 'Reliable transportation for conferences, weddings, and special events across Sri Lanka',
        isActive: true,
        order: 2
      },
      {
        image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80',
        title: 'School & Educational Tours',
        subtitle: 'Safe Journey for Students',
        description: 'Certified drivers and well-maintained vehicles for educational excursions',
        isActive: true,
        order: 3
      }
    ];

    for (const slide of defaultSlides) {
      await heroSlidesAdminService.create(slide);
    }

    // Seed settings
    const defaultSettings: GroupTransportSettings = {
      trustIndicators: {
        rating: '4.8/5',
        reviews: '1,456',
        support: '24/7 Support'
      },
      howToBook: [
        { step: 1, title: 'Select Vehicle', description: 'Choose the right vehicle for your group size', icon: 'Bus' },
        { step: 2, title: 'Enter Details', description: 'Provide pickup location, date, and route details', icon: 'MapPin' },
        { step: 3, title: 'Get Quote', description: 'Receive instant pricing with all costs included', icon: 'Calculator' },
        { step: 4, title: 'Confirm Booking', description: 'Pay deposit and receive confirmation', icon: 'CheckCircle' }
      ],
      terms: [
        'Full payment required 48 hours before departure',
        'Free cancellation up to 72 hours before pickup',
        '50% refund for cancellations 24-72 hours before',
        'No refund for cancellations within 24 hours',
        'Driver gratuity not included in pricing',
        'Fuel, tolls, and parking included',
        'Waiting time beyond 30 minutes charged at $10/hour'
      ],
      cancellationPolicy: 'Free cancellation up to 72 hours before your scheduled pickup. Cancellations made 24-72 hours before receive 50% refund. No refunds for cancellations within 24 hours of pickup.',
      driverChargeRates: {
        standard: 30,
        englishSpeaking: 45,
        tourGuide: 65
      }
    };

    await settingsAdminService.update(defaultSettings);

    console.log('Default data seeded successfully');
  } catch (error) {
    console.error('Error seeding default data:', error);
  }
};

export default {
  vehicles: vehiclesAdminService,
  driverCharges: driverChargesAdminService,
  heroSlides: heroSlidesAdminService,
  settings: settingsAdminService,
  bookings: bookingsAdminService,
  seedDefaultData
};
