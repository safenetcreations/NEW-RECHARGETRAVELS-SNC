// Vehicle Rental Service - Firebase Integration
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase-config';
import type { 
  VehicleOwner, 
  Vehicle, 
  VehicleDocument, 
  VehiclePricing,
  VehicleAvailability,
  VehicleRentalBooking,
  VehicleReview,
  OwnerEarnings,
  VehicleSearchFilters,
  OwnerDashboardStats,
  OwnerVerificationStatus,
  VehicleStatus,
  DocumentStatus,
  BookingStatus
} from '@/types/vehicleRental';

// Collection names
const COLLECTIONS = {
  OWNERS: 'vehicle_owners',
  VEHICLES: 'vehicles',
  DOCUMENTS: 'vehicle_documents',
  PRICING: 'vehicle_pricing',
  AVAILABILITY: 'vehicle_availability',
  BOOKINGS: 'vehicle_bookings',
  REVIEWS: 'vehicle_reviews',
  EARNINGS: 'owner_earnings',
};

// ============ VEHICLE OWNER OPERATIONS ============
export const vehicleOwnerService = {
  // Create new owner
  async create(ownerData: Omit<VehicleOwner, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.OWNERS), {
      ...ownerData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  // Get owner by ID
  async getById(ownerId: string): Promise<VehicleOwner | null> {
    const docRef = doc(db, COLLECTIONS.OWNERS, ownerId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as VehicleOwner;
    }
    return null;
  },

  // Get owner by user ID
  async getByUserId(userId: string): Promise<VehicleOwner | null> {
    const q = query(
      collection(db, COLLECTIONS.OWNERS),
      where('userId', '==', userId),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as VehicleOwner;
    }
    return null;
  },

  // Update owner
  async update(ownerId: string, data: Partial<VehicleOwner>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.OWNERS, ownerId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  },

  // Update verification status
  async updateVerificationStatus(
    ownerId: string, 
    status: OwnerVerificationStatus,
    notes?: string,
    verifiedBy?: string
  ): Promise<void> {
    const docRef = doc(db, COLLECTIONS.OWNERS, ownerId);
    await updateDoc(docRef, {
      verificationStatus: status,
      verificationNotes: notes,
      verifiedAt: status === 'verified' ? Timestamp.now() : null,
      verifiedBy: verifiedBy,
      updatedAt: Timestamp.now(),
    });
  },

  // Get pending verifications (for admin)
  async getPendingVerifications(): Promise<VehicleOwner[]> {
    const q = query(
      collection(db, COLLECTIONS.OWNERS),
      where('verificationStatus', 'in', ['pending_verification', 'pending_admin_review']),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VehicleOwner));
  },

  // Get all owners (for admin)
  async getAll(): Promise<VehicleOwner[]> {
    const q = query(
      collection(db, COLLECTIONS.OWNERS),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VehicleOwner));
  },
};

// ============ VEHICLE OPERATIONS ============
export const vehicleService = {
  // Create vehicle
  async create(vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.VEHICLES), {
      ...vehicleData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  // Get vehicle by ID
  async getById(vehicleId: string): Promise<Vehicle | null> {
    const docRef = doc(db, COLLECTIONS.VEHICLES, vehicleId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Vehicle;
    }
    return null;
  },

  // Get vehicles by owner
  async getByOwner(ownerId: string): Promise<Vehicle[]> {
    const q = query(
      collection(db, COLLECTIONS.VEHICLES),
      where('ownerId', '==', ownerId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vehicle));
  },

  // Update vehicle
  async update(vehicleId: string, data: Partial<Vehicle>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.VEHICLES, vehicleId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  },

  // Update vehicle status
  async updateStatus(
    vehicleId: string, 
    status: VehicleStatus,
    approvedBy?: string
  ): Promise<void> {
    const docRef = doc(db, COLLECTIONS.VEHICLES, vehicleId);
    await updateDoc(docRef, {
      status,
      approvedAt: status === 'active' ? Timestamp.now() : null,
      approvedBy,
      updatedAt: Timestamp.now(),
    });
  },

  // Search vehicles with filters
  async search(filters: VehicleSearchFilters): Promise<Vehicle[]> {
    let q = query(
      collection(db, COLLECTIONS.VEHICLES),
      where('status', '==', 'active')
    );

    // Note: Firestore has limitations on compound queries
    // For production, consider using Algolia or Elasticsearch
    
    if (filters.vehicleType && filters.vehicleType.length > 0) {
      q = query(q, where('vehicleType', 'in', filters.vehicleType));
    }

    if (filters.city) {
      q = query(q, where('serviceAreas', 'array-contains', filters.city));
    }

    const querySnapshot = await getDocs(q);
    let vehicles = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vehicle));

    // Client-side filtering for complex conditions
    if (filters.seatingCapacity) {
      if (filters.seatingCapacity.min) {
        vehicles = vehicles.filter(v => v.seatingCapacity >= filters.seatingCapacity!.min!);
      }
      if (filters.seatingCapacity.max) {
        vehicles = vehicles.filter(v => v.seatingCapacity <= filters.seatingCapacity!.max!);
      }
    }

    if (filters.ownerRating) {
      vehicles = vehicles.filter(v => v.rating >= filters.ownerRating!);
    }

    // Sort
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'rating':
          vehicles.sort((a, b) => b.rating - a.rating);
          break;
        case 'popular':
          vehicles.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
        case 'newest':
          vehicles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
      }
    }

    return vehicles;
  },

  // Get all active vehicles
  async getActive(): Promise<Vehicle[]> {
    const q = query(
      collection(db, COLLECTIONS.VEHICLES),
      where('status', '==', 'active'),
      orderBy('rating', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vehicle));
  },

  // Get pending vehicles (for admin)
  async getPending(): Promise<Vehicle[]> {
    const q = query(
      collection(db, COLLECTIONS.VEHICLES),
      where('status', '==', 'pending_review'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vehicle));
  },

  // Delete vehicle
  async delete(vehicleId: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.VEHICLES, vehicleId));
  },
};

// ============ DOCUMENT OPERATIONS ============
export const vehicleDocumentService = {
  // Upload document
  async upload(
    file: File, 
    ownerId: string, 
    vehicleId: string | null,
    documentType: VehicleDocument['documentType']
  ): Promise<string> {
    const fileName = `${Date.now()}_${file.name}`;
    const path = vehicleId 
      ? `vehicle_documents/${ownerId}/${vehicleId}/${fileName}`
      : `vehicle_documents/${ownerId}/${fileName}`;
    
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    const docRef = await addDoc(collection(db, COLLECTIONS.DOCUMENTS), {
      vehicleId,
      ownerId,
      documentType,
      fileUrl: downloadURL,
      fileName: file.name,
      ocrExtracted: false,
      isExpired: false,
      expiryAlertSent: false,
      status: 'pending',
      uploadedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    
    return docRef.id;
  },

  // Get documents by vehicle
  async getByVehicle(vehicleId: string): Promise<VehicleDocument[]> {
    const q = query(
      collection(db, COLLECTIONS.DOCUMENTS),
      where('vehicleId', '==', vehicleId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VehicleDocument));
  },

  // Get documents by owner
  async getByOwner(ownerId: string): Promise<VehicleDocument[]> {
    const q = query(
      collection(db, COLLECTIONS.DOCUMENTS),
      where('ownerId', '==', ownerId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VehicleDocument));
  },

  // Update document status
  async updateStatus(
    documentId: string, 
    status: DocumentStatus, 
    notes?: string,
    verifiedBy?: string
  ): Promise<void> {
    const docRef = doc(db, COLLECTIONS.DOCUMENTS, documentId);
    await updateDoc(docRef, {
      status,
      verificationNotes: notes,
      verifiedAt: status === 'verified' ? Timestamp.now() : null,
      verifiedBy,
      updatedAt: Timestamp.now(),
    });
  },

  // Update OCR data
  async updateOCRData(documentId: string, ocrData: VehicleDocument['ocrData']): Promise<void> {
    const docRef = doc(db, COLLECTIONS.DOCUMENTS, documentId);
    await updateDoc(docRef, {
      ocrExtracted: true,
      ocrData,
      updatedAt: Timestamp.now(),
    });
  },

  // Get expiring documents
  async getExpiring(daysAhead: number = 30): Promise<VehicleDocument[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    
    const q = query(
      collection(db, COLLECTIONS.DOCUMENTS),
      where('expiryDate', '<=', Timestamp.fromDate(futureDate)),
      where('isExpired', '==', false)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VehicleDocument));
  },
};

// ============ PRICING OPERATIONS ============
export const vehiclePricingService = {
  // Create/Update pricing
  async upsert(vehicleId: string, pricingData: Omit<VehiclePricing, 'id' | 'updatedAt'>): Promise<string> {
    const q = query(
      collection(db, COLLECTIONS.PRICING),
      where('vehicleId', '==', vehicleId),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const existingDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, COLLECTIONS.PRICING, existingDoc.id), {
        ...pricingData,
        updatedAt: Timestamp.now(),
      });
      return existingDoc.id;
    } else {
      const docRef = await addDoc(collection(db, COLLECTIONS.PRICING), {
        ...pricingData,
        vehicleId,
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    }
  },

  // Get pricing by vehicle
  async getByVehicle(vehicleId: string): Promise<VehiclePricing | null> {
    const q = query(
      collection(db, COLLECTIONS.PRICING),
      where('vehicleId', '==', vehicleId),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as VehiclePricing;
    }
    return null;
  },
};

// ============ AVAILABILITY OPERATIONS ============
export const vehicleAvailabilityService = {
  // Set availability for a date
  async setAvailability(
    vehicleId: string, 
    date: Date, 
    status: VehicleAvailability['status'],
    bookingId?: string,
    note?: string
  ): Promise<void> {
    const dateStr = date.toISOString().split('T')[0];
    const docId = `${vehicleId}_${dateStr}`;
    
    const docRef = doc(db, COLLECTIONS.AVAILABILITY, docId);
    await updateDoc(docRef, {
      vehicleId,
      date: Timestamp.fromDate(date),
      status,
      bookingId,
      note,
      updatedAt: Timestamp.now(),
    }).catch(async () => {
      // If document doesn't exist, create it
      await addDoc(collection(db, COLLECTIONS.AVAILABILITY), {
        vehicleId,
        date: Timestamp.fromDate(date),
        status,
        bookingId,
        note,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    });
  },

  // Get availability for date range
  async getForDateRange(vehicleId: string, startDate: Date, endDate: Date): Promise<VehicleAvailability[]> {
    const q = query(
      collection(db, COLLECTIONS.AVAILABILITY),
      where('vehicleId', '==', vehicleId),
      where('date', '>=', Timestamp.fromDate(startDate)),
      where('date', '<=', Timestamp.fromDate(endDate))
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VehicleAvailability));
  },

  // Bulk set availability
  async bulkSetAvailability(
    vehicleId: string, 
    dates: Date[], 
    status: VehicleAvailability['status']
  ): Promise<void> {
    const batch = writeBatch(db);
    
    for (const date of dates) {
      const dateStr = date.toISOString().split('T')[0];
      const docRef = doc(db, COLLECTIONS.AVAILABILITY, `${vehicleId}_${dateStr}`);
      batch.set(docRef, {
        vehicleId,
        date: Timestamp.fromDate(date),
        status,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }, { merge: true });
    }
    
    await batch.commit();
  },

  // Check if vehicle is available
  async isAvailable(vehicleId: string, startDate: Date, endDate: Date): Promise<boolean> {
    const availabilities = await this.getForDateRange(vehicleId, startDate, endDate);
    
    // Check if any date is not available
    const bookedDates = availabilities.filter(a => a.status !== 'available');
    return bookedDates.length === 0;
  },
};

// ============ BOOKING OPERATIONS ============
export const vehicleBookingService = {
  // Create booking
  async create(bookingData: Omit<VehicleRentalBooking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.BOOKINGS), {
      ...bookingData,
      statusHistory: [{
        status: bookingData.status,
        timestamp: Timestamp.now(),
        note: 'Booking created',
      }],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  // Get booking by ID
  async getById(bookingId: string): Promise<VehicleRentalBooking | null> {
    const docRef = doc(db, COLLECTIONS.BOOKINGS, bookingId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as VehicleRentalBooking;
    }
    return null;
  },

  // Get bookings by vehicle
  async getByVehicle(vehicleId: string): Promise<VehicleRentalBooking[]> {
    const q = query(
      collection(db, COLLECTIONS.BOOKINGS),
      where('vehicleId', '==', vehicleId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VehicleRentalBooking));
  },

  // Get bookings by owner
  async getByOwner(ownerId: string): Promise<VehicleRentalBooking[]> {
    const q = query(
      collection(db, COLLECTIONS.BOOKINGS),
      where('ownerId', '==', ownerId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VehicleRentalBooking));
  },

  // Get bookings by customer
  async getByCustomer(customerId: string): Promise<VehicleRentalBooking[]> {
    const q = query(
      collection(db, COLLECTIONS.BOOKINGS),
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VehicleRentalBooking));
  },

  // Update booking status
  async updateStatus(
    bookingId: string, 
    status: BookingStatus, 
    note?: string,
    updatedBy?: string
  ): Promise<void> {
    const booking = await this.getById(bookingId);
    if (!booking) throw new Error('Booking not found');
    
    const statusHistory = [
      ...booking.statusHistory,
      {
        status,
        timestamp: Timestamp.now(),
        note,
        updatedBy,
      }
    ];

    const updates: Record<string, unknown> = {
      status,
      statusHistory,
      updatedAt: Timestamp.now(),
    };

    // Set specific timestamps based on status
    if (status === 'confirmed') updates.confirmedAt = Timestamp.now();
    if (status === 'in_progress') updates.startedAt = Timestamp.now();
    if (status === 'completed') updates.completedAt = Timestamp.now();
    if (status === 'cancelled') updates.cancelledAt = Timestamp.now();

    const docRef = doc(db, COLLECTIONS.BOOKINGS, bookingId);
    await updateDoc(docRef, updates);

    // Update vehicle availability
    if (status === 'confirmed') {
      await this.blockVehicleAvailability(booking);
    } else if (status === 'cancelled') {
      await this.releaseVehicleAvailability(booking);
    }
  },

  // Block vehicle availability for booking
  async blockVehicleAvailability(booking: VehicleRentalBooking): Promise<void> {
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    const dates: Date[] = [];
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    
    await vehicleAvailabilityService.bulkSetAvailability(booking.vehicleId, dates, 'booked');
  },

  // Release vehicle availability
  async releaseVehicleAvailability(booking: VehicleRentalBooking): Promise<void> {
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    const dates: Date[] = [];
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    
    await vehicleAvailabilityService.bulkSetAvailability(booking.vehicleId, dates, 'available');
  },

  // Get upcoming bookings
  async getUpcoming(ownerId: string): Promise<VehicleRentalBooking[]> {
    const now = new Date();
    const q = query(
      collection(db, COLLECTIONS.BOOKINGS),
      where('ownerId', '==', ownerId),
      where('startDate', '>=', Timestamp.fromDate(now)),
      where('status', 'in', ['pending', 'confirmed']),
      orderBy('startDate', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VehicleRentalBooking));
  },

  // Calculate booking price
  calculatePrice(
    pricing: VehiclePricing,
    rentalType: VehicleRentalBooking['rentalType'],
    duration: number, // hours for hourly, days for daily, etc.
    withDriver: boolean,
    deliveryRequired: boolean
  ): {
    baseAmount: number;
    driverCost: number;
    deliveryFee: number;
    platformFee: number;
    totalAmount: number;
  } {
    let baseAmount = 0;
    
    switch (rentalType) {
      case 'hourly':
        baseAmount = pricing.hourlyRate * duration;
        break;
      case 'daily':
        baseAmount = pricing.dailyRate * duration;
        break;
      case 'weekly':
        baseAmount = pricing.weeklyRate * duration;
        break;
      case 'monthly':
        baseAmount = pricing.monthlyRate * duration;
        break;
      case 'yearly':
        baseAmount = (pricing.yearlyRate || pricing.monthlyRate * 12) * duration;
        break;
    }

    const driverCost = withDriver ? (pricing.driverCostPerDay || 0) * Math.ceil(duration / (rentalType === 'hourly' ? 8 : 1)) : 0;
    const deliveryFee = deliveryRequired ? 2000 : 0; // Fixed delivery fee
    const subtotal = baseAmount + driverCost + deliveryFee;
    const platformFee = Math.round(subtotal * 0.15); // 15% platform commission
    const totalAmount = subtotal + platformFee;

    return {
      baseAmount,
      driverCost,
      deliveryFee,
      platformFee,
      totalAmount,
    };
  },
};

// ============ REVIEW OPERATIONS ============
export const vehicleReviewService = {
  // Create review
  async create(reviewData: Omit<VehicleReview, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.REVIEWS), {
      ...reviewData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    // Update vehicle rating
    await this.updateVehicleRating(reviewData.vehicleId);

    return docRef.id;
  },

  // Get reviews by vehicle
  async getByVehicle(vehicleId: string): Promise<VehicleReview[]> {
    const q = query(
      collection(db, COLLECTIONS.REVIEWS),
      where('vehicleId', '==', vehicleId),
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VehicleReview));
  },

  // Update vehicle rating
  async updateVehicleRating(vehicleId: string): Promise<void> {
    const reviews = await this.getByVehicle(vehicleId);
    if (reviews.length === 0) return;

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await vehicleService.update(vehicleId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
    });
  },
};

// ============ EARNINGS OPERATIONS ============
export const ownerEarningsService = {
  // Create earning record
  async create(earningData: Omit<OwnerEarnings, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.EARNINGS), {
      ...earningData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  },

  // Get earnings by owner
  async getByOwner(ownerId: string): Promise<OwnerEarnings[]> {
    const q = query(
      collection(db, COLLECTIONS.EARNINGS),
      where('ownerId', '==', ownerId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as OwnerEarnings));
  },

  // Get owner dashboard stats
  async getOwnerStats(ownerId: string): Promise<OwnerDashboardStats> {
    const [vehicles, bookings, earnings] = await Promise.all([
      vehicleService.getByOwner(ownerId),
      vehicleBookingService.getByOwner(ownerId),
      this.getByOwner(ownerId),
    ]);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const activeVehicles = vehicles.filter(v => v.status === 'active').length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const activeBookings = bookings.filter(b => b.status === 'in_progress').length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;

    const totalEarnings = earnings.reduce((sum, e) => sum + e.ownerEarnings, 0);
    const monthlyEarnings = earnings
      .filter(e => new Date(e.createdAt) >= startOfMonth)
      .reduce((sum, e) => sum + e.ownerEarnings, 0);
    const pendingPayouts = earnings
      .filter(e => e.payoutStatus === 'pending')
      .reduce((sum, e) => sum + e.ownerEarnings, 0);

    const avgRating = vehicles.length > 0 
      ? vehicles.reduce((sum, v) => sum + v.rating, 0) / vehicles.length 
      : 0;

    return {
      totalVehicles: vehicles.length,
      activeVehicles,
      pendingBookings,
      activeBookings,
      completedBookings,
      totalEarnings,
      monthlyEarnings,
      pendingPayouts,
      avgRating: Math.round(avgRating * 10) / 10,
      utilizationRate: 0, // Calculate based on availability
      upcomingExpiringDocuments: 0, // Calculate from documents
    };
  },
};

// Export all services
export const vehicleRentalService = {
  owners: vehicleOwnerService,
  vehicles: vehicleService,
  documents: vehicleDocumentService,
  pricing: vehiclePricingService,
  availability: vehicleAvailabilityService,
  bookings: vehicleBookingService,
  reviews: vehicleReviewService,
  earnings: ownerEarningsService,
};

export default vehicleRentalService;
