import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { TourPackage } from '@/components/wildTours/TourPackageCard';

const COLLECTION_NAME = 'wildTours';

export interface WildTourFirestore extends TourPackage {
  category: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
  itinerary?: {
    day: number;
    title: string;
    description: string;
    activities: string[];
  }[];
  faq?: {
    question: string;
    answer: string;
  }[];
  bestTime?: string;
  difficulty?: string;
  included?: string[];
  excluded?: string[];
  cancellationPolicy?: string;
}

class FirebaseWildToursService {
  private collectionRef = collection(db, COLLECTION_NAME);

  /**
   * Get all wild tours
   */
  async getAllTours(): Promise<WildTourFirestore[]> {
    try {
      const q = query(this.collectionRef, where('isActive', '==', true), orderBy('category'), orderBy('price'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as WildTourFirestore));
    } catch (error) {
      console.error('Error fetching wild tours:', error);
      return [];
    }
  }

  /**
   * Get tours by category
   */
  async getToursByCategory(category: string): Promise<WildTourFirestore[]> {
    try {
      const q = query(
        this.collectionRef,
        where('category', '==', category),
        where('isActive', '==', true),
        orderBy('price')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as WildTourFirestore));
    } catch (error) {
      console.error(`Error fetching tours for category ${category}:`, error);
      return [];
    }
  }

  /**
   * Get a single tour by ID
   */
  async getTourById(tourId: string): Promise<WildTourFirestore | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, tourId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as WildTourFirestore;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching tour ${tourId}:`, error);
      return null;
    }
  }

  /**
   * Create a new tour
   */
  async createTour(tourData: Omit<WildTourFirestore, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(this.collectionRef, {
        ...tourData,
        createdAt: now,
        updatedAt: now,
        isActive: true
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating tour:', error);
      throw error;
    }
  }

  /**
   * Update a tour
   */
  async updateTour(tourId: string, tourData: Partial<WildTourFirestore>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, tourId);
      await updateDoc(docRef, {
        ...tourData,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error(`Error updating tour ${tourId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a tour (soft delete by setting isActive to false)
   */
  async deleteTour(tourId: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, tourId);
      await updateDoc(docRef, {
        isActive: false,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error(`Error deleting tour ${tourId}:`, error);
      throw error;
    }
  }

  /**
   * Permanently delete a tour (use with caution)
   */
  async permanentlyDeleteTour(tourId: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, tourId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error permanently deleting tour ${tourId}:`, error);
      throw error;
    }
  }

  /**
   * Get tours by tier (semi-luxury or budget)
   */
  async getToursByTier(tier: 'semi-luxury' | 'budget'): Promise<WildTourFirestore[]> {
    try {
      const q = query(
        this.collectionRef,
        where('tier', '==', tier),
        where('isActive', '==', true),
        orderBy('category'),
        orderBy('price')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as WildTourFirestore));
    } catch (error) {
      console.error(`Error fetching tours for tier ${tier}:`, error);
      return [];
    }
  }

  /**
   * Search tours by keyword
   */
  async searchTours(keyword: string): Promise<WildTourFirestore[]> {
    try {
      const allTours = await this.getAllTours();
      const lowerKeyword = keyword.toLowerCase();

      return allTours.filter(tour =>
        tour.title.toLowerCase().includes(lowerKeyword) ||
        tour.location.toLowerCase().includes(lowerKeyword) ||
        tour.description.some(desc => desc.toLowerCase().includes(lowerKeyword)) ||
        tour.category.toLowerCase().includes(lowerKeyword)
      );
    } catch (error) {
      console.error('Error searching tours:', error);
      return [];
    }
  }
  /**
   * Create a new booking
   */
  async createBooking(bookingData: any): Promise<string> {
    try {
      const bookingsRef = collection(db, 'wildtours_bookings');
      const docRef = await addDoc(bookingsRef, {
        ...bookingData,
        createdAt: Timestamp.now(),
        status: 'confirmed', // Auto-confirm for demo/payment success
        paymentStatus: 'paid_deposit'
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }
}

export const wildToursService = new FirebaseWildToursService();
