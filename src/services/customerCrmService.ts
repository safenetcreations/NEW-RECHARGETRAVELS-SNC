// Customer CRM Service - Manages customer profiles and booking history
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  runTransaction,
  Timestamp,
  limit
} from 'firebase/firestore';

// Customer Profile Interface
export interface CustomerProfile {
  id: string;
  customerId: string; // C00001, C00002, etc.

  // Basic Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsapp?: string;

  // Address
  address?: {
    street?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };

  // Passport/ID (for airport transfers)
  passport?: {
    number?: string;
    expiryDate?: string;
    nationality?: string;
  };

  // Booking Statistics
  stats: {
    totalBookings: number;
    totalSpent: number;
    lastBookingDate?: Date | Timestamp;
    firstBookingDate?: Date | Timestamp;
  };

  // Booking References (linked bookings)
  bookingReferences: string[]; // RT01205, RT01206, etc.

  // Documents (stored in Firebase Storage)
  documents?: {
    id: string;
    name: string;
    type: string; // passport, visa, itinerary, etc.
    url: string;
    uploadedAt: Date | Timestamp;
  }[];

  // Notes (internal admin notes)
  notes?: string;

  // VIP Status
  vipStatus?: 'regular' | 'silver' | 'gold' | 'platinum';

  // Preferences
  preferences?: {
    preferredVehicleType?: string;
    preferredLanguage?: string;
    specialRequirements?: string;
    dietaryRestrictions?: string;
  };

  // System fields
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

// Generate sequential customer ID (C00001, C00002, etc.)
const generateCustomerId = async (): Promise<string> => {
  const counterRef = doc(db, 'counters', 'customers');

  try {
    const newNumber = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);

      let currentNumber: number;
      if (!counterDoc.exists()) {
        // Initialize counter starting at 0 (first customer will be C00001)
        currentNumber = 0;
      } else {
        currentNumber = counterDoc.data().lastNumber || 0;
      }

      const nextNumber = currentNumber + 1;

      // Update the counter
      transaction.set(counterRef, {
        lastNumber: nextNumber,
        updatedAt: new Date()
      });

      return nextNumber;
    });

    // Format: C + 5-digit padded number (e.g., C00001, C00002)
    return `C${newNumber.toString().padStart(5, '0')}`;
  } catch (error) {
    console.error('Error generating customer ID:', error);
    // Fallback
    const timestamp = Date.now().toString(36).toUpperCase();
    return `C${timestamp}`;
  }
};

// Customer CRM Service
export const customerCrmService = {
  collection: 'customers',

  // Find customer by email
  async findByEmail(email: string): Promise<CustomerProfile | null> {
    const q = query(
      collection(db, this.collection),
      where('email', '==', email.toLowerCase()),
      limit(1)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as CustomerProfile;
  },

  // Find customer by phone
  async findByPhone(phone: string): Promise<CustomerProfile | null> {
    const normalizedPhone = phone.replace(/\s+/g, '');
    const q = query(
      collection(db, this.collection),
      where('phone', '==', normalizedPhone),
      limit(1)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as CustomerProfile;
  },

  // Find customer by customer ID
  async findByCustomerId(customerId: string): Promise<CustomerProfile | null> {
    const q = query(
      collection(db, this.collection),
      where('customerId', '==', customerId),
      limit(1)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as CustomerProfile;
  },

  // Create or update customer from booking
  async createOrUpdateFromBooking(bookingData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bookingReference: string;
    bookingAmount: number;
    whatsapp?: string;
    passportNumber?: string;
    nationality?: string;
    specialRequests?: string;
  }): Promise<CustomerProfile> {
    const email = bookingData.email.toLowerCase();

    // Check if customer exists
    const existingCustomer = await this.findByEmail(email);

    if (existingCustomer) {
      // Update existing customer
      const docRef = doc(db, this.collection, existingCustomer.id);

      const updatedBookings = [...(existingCustomer.bookingReferences || [])];
      if (!updatedBookings.includes(bookingData.bookingReference)) {
        updatedBookings.push(bookingData.bookingReference);
      }

      const updatedStats = {
        totalBookings: (existingCustomer.stats?.totalBookings || 0) + 1,
        totalSpent: (existingCustomer.stats?.totalSpent || 0) + bookingData.bookingAmount,
        lastBookingDate: serverTimestamp(),
        firstBookingDate: existingCustomer.stats?.firstBookingDate || existingCustomer.createdAt
      };

      // Determine VIP status based on total spent
      let vipStatus: CustomerProfile['vipStatus'] = 'regular';
      if (updatedStats.totalSpent >= 5000) vipStatus = 'platinum';
      else if (updatedStats.totalSpent >= 2000) vipStatus = 'gold';
      else if (updatedStats.totalSpent >= 1000) vipStatus = 'silver';

      await updateDoc(docRef, {
        // Update info if provided
        firstName: bookingData.firstName || existingCustomer.firstName,
        lastName: bookingData.lastName || existingCustomer.lastName,
        phone: bookingData.phone || existingCustomer.phone,
        whatsapp: bookingData.whatsapp || existingCustomer.whatsapp,
        // Update passport if provided
        ...(bookingData.passportNumber && {
          passport: {
            ...existingCustomer.passport,
            number: bookingData.passportNumber,
            nationality: bookingData.nationality || existingCustomer.passport?.nationality
          }
        }),
        // Update preferences if provided
        ...(bookingData.specialRequests && {
          preferences: {
            ...existingCustomer.preferences,
            specialRequirements: bookingData.specialRequests
          }
        }),
        // Update stats
        stats: updatedStats,
        bookingReferences: updatedBookings,
        vipStatus,
        updatedAt: serverTimestamp()
      });

      return {
        ...existingCustomer,
        stats: updatedStats as any,
        bookingReferences: updatedBookings,
        vipStatus
      };
    } else {
      // Create new customer
      const customerId = await generateCustomerId();

      const newCustomer: Omit<CustomerProfile, 'id'> = {
        customerId,
        firstName: bookingData.firstName,
        lastName: bookingData.lastName,
        email: email,
        phone: bookingData.phone.replace(/\s+/g, ''),
        whatsapp: bookingData.whatsapp,
        passport: bookingData.passportNumber ? {
          number: bookingData.passportNumber,
          nationality: bookingData.nationality
        } : undefined,
        preferences: bookingData.specialRequests ? {
          specialRequirements: bookingData.specialRequests
        } : undefined,
        stats: {
          totalBookings: 1,
          totalSpent: bookingData.bookingAmount,
          firstBookingDate: serverTimestamp() as any,
          lastBookingDate: serverTimestamp() as any
        },
        bookingReferences: [bookingData.bookingReference],
        vipStatus: 'regular',
        createdAt: serverTimestamp() as any,
        updatedAt: serverTimestamp() as any
      };

      const docRef = await addDoc(collection(db, this.collection), newCustomer);

      return {
        id: docRef.id,
        ...newCustomer
      };
    }
  },

  // Get all customers (admin)
  async getAllCustomers(options?: {
    vipStatus?: string;
    searchQuery?: string;
    limit?: number;
  }): Promise<CustomerProfile[]> {
    let q = query(collection(db, this.collection), orderBy('createdAt', 'desc'));

    if (options?.vipStatus) {
      q = query(
        collection(db, this.collection),
        where('vipStatus', '==', options.vipStatus),
        orderBy('createdAt', 'desc')
      );
    }

    const snapshot = await getDocs(q);
    let customers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CustomerProfile[];

    // Client-side search if query provided
    if (options?.searchQuery) {
      const search = options.searchQuery.toLowerCase();
      customers = customers.filter(c =>
        c.firstName.toLowerCase().includes(search) ||
        c.lastName.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search) ||
        c.phone.includes(search) ||
        c.customerId.toLowerCase().includes(search)
      );
    }

    if (options?.limit) {
      customers = customers.slice(0, options.limit);
    }

    return customers;
  },

  // Get customer by document ID
  async getById(id: string): Promise<CustomerProfile | null> {
    const docRef = doc(db, this.collection, id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) return null;

    return { id: snapshot.id, ...snapshot.data() } as CustomerProfile;
  },

  // Update customer profile
  async updateCustomer(id: string, data: Partial<CustomerProfile>): Promise<void> {
    const docRef = doc(db, this.collection, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  },

  // Add document to customer
  async addDocument(customerId: string, document: {
    name: string;
    type: string;
    url: string;
  }): Promise<void> {
    const customer = await this.getById(customerId);
    if (!customer) throw new Error('Customer not found');

    const newDocument = {
      id: `doc_${Date.now()}`,
      ...document,
      uploadedAt: serverTimestamp()
    };

    const documents = [...(customer.documents || []), newDocument];

    await this.updateCustomer(customerId, { documents: documents as any });
  },

  // Add admin note
  async addNote(customerId: string, note: string): Promise<void> {
    const customer = await this.getById(customerId);
    if (!customer) throw new Error('Customer not found');

    const timestamp = new Date().toISOString();
    const existingNotes = customer.notes || '';
    const newNotes = existingNotes
      ? `${existingNotes}\n\n[${timestamp}]\n${note}`
      : `[${timestamp}]\n${note}`;

    await this.updateCustomer(customerId, { notes: newNotes });
  },

  // Get customer statistics
  async getStatistics(): Promise<{
    totalCustomers: number;
    newThisMonth: number;
    vipBreakdown: { regular: number; silver: number; gold: number; platinum: number };
    totalRevenue: number;
  }> {
    const customers = await this.getAllCustomers();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const newThisMonth = customers.filter(c => {
      const createdAt = c.createdAt instanceof Timestamp
        ? c.createdAt.toDate()
        : new Date(c.createdAt);
      return createdAt >= startOfMonth;
    }).length;

    const vipBreakdown = {
      regular: customers.filter(c => c.vipStatus === 'regular' || !c.vipStatus).length,
      silver: customers.filter(c => c.vipStatus === 'silver').length,
      gold: customers.filter(c => c.vipStatus === 'gold').length,
      platinum: customers.filter(c => c.vipStatus === 'platinum').length
    };

    const totalRevenue = customers.reduce((sum, c) => sum + (c.stats?.totalSpent || 0), 0);

    return {
      totalCustomers: customers.length,
      newThisMonth,
      vipBreakdown,
      totalRevenue
    };
  }
};

export default customerCrmService;
