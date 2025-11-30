import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
  runTransaction
} from 'firebase/firestore';

// Types
export interface GroupVehicle {
  id: string;
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
  id: string;
  name: string;
  description: string;
  amount: number;
  type: 'per-day' | 'per-trip' | 'hourly';
  isOptional: boolean;
  isActive: boolean;
}

export interface GroupTransportBooking {
  id?: string;
  bookingReference: string;
  vehicleId: string;
  vehicleName: string;
  vehicleType: string;

  // Trip Details
  tripType: 'one-way' | 'round-trip' | 'multi-day';
  pickupLocation: string;
  pickupDate: string;
  pickupTime: string;
  dropoffLocation: string;
  returnDate?: string;
  returnTime?: string;

  // Route Details
  stops?: string[];
  estimatedDistance?: number;
  estimatedDuration?: string;

  // Passengers
  passengers: number;

  // Extras
  selectedExtras?: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];

  // Driver
  driverType: 'standard' | 'english-speaking' | 'tour-guide';
  driverCharges: number;

  // Pricing
  vehiclePrice: number;
  extrasTotal: number;
  totalPrice: number;
  depositAmount: number;

  // Customer Info
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCountry?: string;
  specialRequests?: string;
  occasion?: string;

  // Status
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'deposit-paid' | 'paid' | 'refunded';

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface GroupTransportSettings {
  id: string;
  heroSlides: {
    image: string;
    title: string;
    subtitle: string;
    description: string;
  }[];
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

// Generate booking reference
const generateBookingReference = (): string => {
  const prefix = 'GT';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

// Get next sequential reference number
const getNextSequentialReference = async (): Promise<string> => {
  const counterRef = doc(db, 'counters', 'groupTransportBookings');

  try {
    const newRef = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      let nextNumber = 1001;

      if (counterDoc.exists()) {
        nextNumber = (counterDoc.data().lastNumber || 1000) + 1;
      }

      transaction.set(counterRef, { lastNumber: nextNumber }, { merge: true });
      return `GT${nextNumber.toString().padStart(5, '0')}`;
    });

    return newRef;
  } catch (error) {
    console.error('Error generating sequential reference:', error);
    return generateBookingReference();
  }
};

// Vehicles Service
export const groupVehiclesService = {
  async getAll(): Promise<GroupVehicle[]> {
    try {
      const q = query(
        collection(db, 'groupTransportVehicles'),
        where('isActive', '==', true),
        orderBy('capacity', 'asc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GroupVehicle));
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      return [];
    }
  },

  async getById(id: string): Promise<GroupVehicle | null> {
    try {
      const docRef = doc(db, 'groupTransportVehicles', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as GroupVehicle;
      }
      return null;
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      return null;
    }
  }
};

// Driver Charges Service
export const driverChargesService = {
  async getAll(): Promise<DriverCharge[]> {
    try {
      const q = query(
        collection(db, 'groupTransportDriverCharges'),
        where('isActive', '==', true)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DriverCharge));
    } catch (error) {
      console.error('Error fetching driver charges:', error);
      return [];
    }
  }
};

// Settings Service
export const groupTransportSettingsService = {
  async get(): Promise<GroupTransportSettings | null> {
    try {
      const docRef = doc(db, 'cmsContent', 'groupTransportSettings');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as GroupTransportSettings;
      }
      return null;
    } catch (error) {
      console.error('Error fetching settings:', error);
      return null;
    }
  }
};

// Booking Service
export const groupTransportBookingService = {
  async createBooking(bookingData: Omit<GroupTransportBooking, 'id' | 'bookingReference' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; bookingId?: string; bookingReference?: string; error?: string }> {
    try {
      const bookingReference = await getNextSequentialReference();
      const now = Timestamp.now();

      const booking: Omit<GroupTransportBooking, 'id'> = {
        ...bookingData,
        bookingReference,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: now,
        updatedAt: now
      };

      const docRef = await addDoc(collection(db, 'groupTransportBookings'), booking);

      return {
        success: true,
        bookingId: docRef.id,
        bookingReference
      };
    } catch (error) {
      console.error('Error creating booking:', error);
      return {
        success: false,
        error: 'Failed to create booking'
      };
    }
  },

  async getBookingByReference(reference: string): Promise<GroupTransportBooking | null> {
    try {
      const q = query(
        collection(db, 'groupTransportBookings'),
        where('bookingReference', '==', reference)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() } as GroupTransportBooking;
      }
      return null;
    } catch (error) {
      console.error('Error fetching booking:', error);
      return null;
    }
  },

  async updateBookingStatus(bookingId: string, status: GroupTransportBooking['status']): Promise<boolean> {
    try {
      const docRef = doc(db, 'groupTransportBookings', bookingId);
      await updateDoc(docRef, {
        status,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Error updating booking status:', error);
      return false;
    }
  }
};

// Calculate pricing
export const calculateGroupTransportPrice = (
  vehicle: GroupVehicle,
  tripType: 'one-way' | 'round-trip' | 'multi-day',
  days: number,
  estimatedKm: number,
  driverType: 'standard' | 'english-speaking' | 'tour-guide',
  driverRates: { standard: number; englishSpeaking: number; tourGuide: number }
): { vehiclePrice: number; driverCharge: number; total: number; deposit: number } => {
  let vehiclePrice = 0;

  // Calculate vehicle price
  if (tripType === 'multi-day') {
    vehiclePrice = vehicle.pricePerDay * days;
  } else {
    // For one-way and round-trip, use per-km rate with minimum
    const kmPrice = vehicle.pricePerKm * estimatedKm;
    const minimumPrice = vehicle.hourlyRate * vehicle.minimumHours;
    vehiclePrice = Math.max(kmPrice, minimumPrice);

    if (tripType === 'round-trip') {
      vehiclePrice *= 1.8; // 80% of double for round trip
    }
  }

  // Calculate driver charge
  let driverCharge = 0;
  const rate = driverType === 'standard'
    ? driverRates.standard
    : driverType === 'english-speaking'
      ? driverRates.englishSpeaking
      : driverRates.tourGuide;

  driverCharge = rate * (tripType === 'multi-day' ? days : 1);

  const total = vehiclePrice + driverCharge;
  const deposit = Math.round(total * 0.3); // 30% deposit

  return {
    vehiclePrice: Math.round(vehiclePrice),
    driverCharge: Math.round(driverCharge),
    total: Math.round(total),
    deposit
  };
};

export default groupTransportBookingService;
