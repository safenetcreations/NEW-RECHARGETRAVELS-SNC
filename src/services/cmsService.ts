/**
 * CMS Service
 * Firebase CRUD operations for all landing page CMS collections
 */

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
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  HeroSlide,
  HeroSlideFormData,
  Testimonial,
  TestimonialFormData,
  AboutSriLankaContent,
  AboutSriLankaFormData,
  WhyChooseUsFeature,
  WhyChooseUsFormData,
  TravelPackage,
  TravelPackageFormData,
  FeaturedDestination,
  FeaturedDestinationFormData,
  BlogPost,
  BlogPostFormData,
  NewsletterConfig,
  NewsletterConfigFormData,
  HomepageStat,
  HomepageStatFormData,
  SiteSettings,
  SiteSettingsFormData,
  MediaFile,
  MediaFileFormData,
  CMSResponse,
} from '@/types/cms';

// ==========================================
// Hero Slides CRUD Operations
// ==========================================

export const heroSlidesService = {
  /**
   * Get all hero slides
   */
  async getAll(): Promise<HeroSlide[]> {
    try {
      const q = query(
        collection(db, 'heroSlides'),
        where('isActive', '==', true),
        orderBy('order', 'asc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HeroSlide));
    } catch (error) {
      console.error('Error fetching hero slides:', error);
      throw error;
    }
  },

  /**
   * Get a single hero slide by ID
   */
  async getById(id: string): Promise<HeroSlide | null> {
    try {
      const docRef = doc(db, 'heroSlides', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as HeroSlide;
      }
      return null;
    } catch (error) {
      console.error('Error fetching hero slide:', error);
      throw error;
    }
  },

  /**
   * Create a new hero slide
   */
  async create(data: HeroSlideFormData): Promise<CMSResponse<HeroSlide>> {
    try {
      const timestamp = Timestamp.now();
      const newSlide = {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      const docRef = await addDoc(collection(db, 'heroSlides'), newSlide);
      return {
        success: true,
        data: { id: docRef.id, ...newSlide } as HeroSlide,
      };
    } catch (error) {
      console.error('Error creating hero slide:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  /**
   * Update an existing hero slide
   */
  async update(id: string, data: Partial<HeroSlideFormData>): Promise<CMSResponse<HeroSlide>> {
    try {
      const docRef = doc(db, 'heroSlides', id);
      const updateData = {
        ...data,
        updatedAt: Timestamp.now(),
      };
      await updateDoc(docRef, updateData);
      const updated = await this.getById(id);
      return { success: true, data: updated || undefined };
    } catch (error) {
      console.error('Error updating hero slide:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  /**
   * Delete a hero slide
   */
  async delete(id: string): Promise<CMSResponse<void>> {
    try {
      const docRef = doc(db, 'heroSlides', id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting hero slide:', error);
      return { success: false, error: (error as Error).message };
    }
  },
};

// ==========================================
// Testimonials CRUD Operations
// ==========================================

export const testimonialsService = {
  /**
   * Get all active testimonials
   */
  async getAll(): Promise<Testimonial[]> {
    try {
      const q = query(
        collection(db, 'testimonials'),
        where('isActive', '==', true),
        orderBy('order', 'asc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      throw error;
    }
  },

  /**
   * Get featured testimonials
   */
  async getFeatured(limitCount: number = 3): Promise<Testimonial[]> {
    try {
      const q = query(
        collection(db, 'testimonials'),
        where('isActive', '==', true),
        where('isFeatured', '==', true),
        orderBy('order', 'asc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
    } catch (error) {
      console.error('Error fetching featured testimonials:', error);
      throw error;
    }
  },

  /**
   * Get a single testimonial by ID
   */
  async getById(id: string): Promise<Testimonial | null> {
    try {
      const docRef = doc(db, 'testimonials', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Testimonial;
      }
      return null;
    } catch (error) {
      console.error('Error fetching testimonial:', error);
      throw error;
    }
  },

  /**
   * Create a new testimonial
   */
  async create(data: TestimonialFormData): Promise<CMSResponse<Testimonial>> {
    try {
      const timestamp = Timestamp.now();
      const newTestimonial = {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      const docRef = await addDoc(collection(db, 'testimonials'), newTestimonial);
      return {
        success: true,
        data: { id: docRef.id, ...newTestimonial } as Testimonial,
      };
    } catch (error) {
      console.error('Error creating testimonial:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  /**
   * Update an existing testimonial
   */
  async update(id: string, data: Partial<TestimonialFormData>): Promise<CMSResponse<Testimonial>> {
    try {
      const docRef = doc(db, 'testimonials', id);
      const updateData = {
        ...data,
        updatedAt: Timestamp.now(),
      };
      await updateDoc(docRef, updateData);
      const updated = await this.getById(id);
      return { success: true, data: updated || undefined };
    } catch (error) {
      console.error('Error updating testimonial:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  /**
   * Delete a testimonial
   */
  async delete(id: string): Promise<CMSResponse<void>> {
    try {
      const docRef = doc(db, 'testimonials', id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      return { success: false, error: (error as Error).message };
    }
  },
};

// ==========================================
// About Sri Lanka CRUD Operations
// ==========================================

export const aboutSriLankaService = {
  /**
   * Get active About Sri Lanka content
   */
  async getActive(): Promise<AboutSriLankaContent | null> {
    try {
      const q = query(
        collection(db, 'aboutSriLanka'),
        where('isActive', '==', true),
        limit(1)
      );
      const snapshot = await getDocs(q);
      if (snapshot.docs.length > 0) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() } as AboutSriLankaContent;
      }
      return null;
    } catch (error) {
      console.error('Error fetching About Sri Lanka content:', error);
      throw error;
    }
  },

  /**
   * Get by ID
   */
  async getById(id: string): Promise<AboutSriLankaContent | null> {
    try {
      const docRef = doc(db, 'aboutSriLanka', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as AboutSriLankaContent;
      }
      return null;
    } catch (error) {
      console.error('Error fetching About Sri Lanka:', error);
      throw error;
    }
  },

  /**
   * Create new content
   */
  async create(data: AboutSriLankaFormData): Promise<CMSResponse<AboutSriLankaContent>> {
    try {
      const timestamp = Timestamp.now();
      const newContent = {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      const docRef = await addDoc(collection(db, 'aboutSriLanka'), newContent);
      return {
        success: true,
        data: { id: docRef.id, ...newContent } as AboutSriLankaContent,
      };
    } catch (error) {
      console.error('Error creating About Sri Lanka content:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  /**
   * Update content
   */
  async update(id: string, data: Partial<AboutSriLankaFormData>): Promise<CMSResponse<AboutSriLankaContent>> {
    try {
      const docRef = doc(db, 'aboutSriLanka', id);
      const updateData = {
        ...data,
        updatedAt: Timestamp.now(),
      };
      await updateDoc(docRef, updateData);
      const updated = await this.getById(id);
      return { success: true, data: updated || undefined };
    } catch (error) {
      console.error('Error updating About Sri Lanka:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  /**
   * Delete content
   */
  async delete(id: string): Promise<CMSResponse<void>> {
    try {
      const docRef = doc(db, 'aboutSriLanka', id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting About Sri Lanka:', error);
      return { success: false, error: (error as Error).message };
    }
  },
};

// ==========================================
// Why Choose Us CRUD Operations
// ==========================================

export const whyChooseUsService = {
  /**
   * Get all active features
   */
  async getAll(): Promise<WhyChooseUsFeature[]> {
    try {
      const q = query(
        collection(db, 'whyChooseUs'),
        where('isActive', '==', true),
        orderBy('order', 'asc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WhyChooseUsFeature));
    } catch (error) {
      console.error('Error fetching Why Choose Us features:', error);
      throw error;
    }
  },

  /**
   * Get by ID
   */
  async getById(id: string): Promise<WhyChooseUsFeature | null> {
    try {
      const docRef = doc(db, 'whyChooseUs', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as WhyChooseUsFeature;
      }
      return null;
    } catch (error) {
      console.error('Error fetching Why Choose Us feature:', error);
      throw error;
    }
  },

  /**
   * Create new feature
   */
  async create(data: WhyChooseUsFormData): Promise<CMSResponse<WhyChooseUsFeature>> {
    try {
      const timestamp = Timestamp.now();
      const newFeature = {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      const docRef = await addDoc(collection(db, 'whyChooseUs'), newFeature);
      return {
        success: true,
        data: { id: docRef.id, ...newFeature } as WhyChooseUsFeature,
      };
    } catch (error) {
      console.error('Error creating Why Choose Us feature:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  /**
   * Update feature
   */
  async update(id: string, data: Partial<WhyChooseUsFormData>): Promise<CMSResponse<WhyChooseUsFeature>> {
    try {
      const docRef = doc(db, 'whyChooseUs', id);
      const updateData = {
        ...data,
        updatedAt: Timestamp.now(),
      };
      await updateDoc(docRef, updateData);
      const updated = await this.getById(id);
      return { success: true, data: updated || undefined };
    } catch (error) {
      console.error('Error updating Why Choose Us feature:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  /**
   * Delete feature
   */
  async delete(id: string): Promise<CMSResponse<void>> {
    try {
      const docRef = doc(db, 'whyChooseUs', id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting Why Choose Us feature:', error);
      return { success: false, error: (error as Error).message };
    }
  },
};

// ==========================================
// Travel Packages CRUD Operations
// ==========================================

export const travelPackagesService = {
  /**
   * Get all active packages
   */
  async getAll(): Promise<TravelPackage[]> {
    try {
      const q = query(
        collection(db, 'travelPackages'),
        where('isActive', '==', true),
        orderBy('order', 'asc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TravelPackage));
    } catch (error) {
      console.error('Error fetching travel packages:', error);
      throw error;
    }
  },

  /**
   * Get featured packages
   */
  async getFeatured(limitCount: number = 6): Promise<TravelPackage[]> {
    try {
      const q = query(
        collection(db, 'travelPackages'),
        where('isActive', '==', true),
        where('isFeatured', '==', true),
        orderBy('order', 'asc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TravelPackage));
    } catch (error) {
      console.error('Error fetching featured packages:', error);
      throw error;
    }
  },

  /**
   * Get by ID
   */
  async getById(id: string): Promise<TravelPackage | null> {
    try {
      const docRef = doc(db, 'travelPackages', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as TravelPackage;
      }
      return null;
    } catch (error) {
      console.error('Error fetching travel package:', error);
      throw error;
    }
  },

  /**
   * Create new package
   */
  async create(data: TravelPackageFormData): Promise<CMSResponse<TravelPackage>> {
    try {
      const timestamp = Timestamp.now();
      const newPackage = {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      const docRef = await addDoc(collection(db, 'travelPackages'), newPackage);
      return {
        success: true,
        data: { id: docRef.id, ...newPackage } as TravelPackage,
      };
    } catch (error) {
      console.error('Error creating travel package:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  /**
   * Update package
   */
  async update(id: string, data: Partial<TravelPackageFormData>): Promise<CMSResponse<TravelPackage>> {
    try {
      const docRef = doc(db, 'travelPackages', id);
      const updateData = {
        ...data,
        updatedAt: Timestamp.now(),
      };
      await updateDoc(docRef, updateData);
      const updated = await this.getById(id);
      return { success: true, data: updated || undefined };
    } catch (error) {
      console.error('Error updating travel package:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  /**
   * Delete package
   */
  async delete(id: string): Promise<CMSResponse<void>> {
    try {
      const docRef = doc(db, 'travelPackages', id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting travel package:', error);
      return { success: false, error: (error as Error).message };
    }
  },
};

// ==========================================
// Homepage Stats CRUD Operations
// ==========================================

export const homepageStatsService = {
  /**
   * Get all active stats
   */
  async getAll(): Promise<HomepageStat[]> {
    try {
      const q = query(
        collection(db, 'homepageStats'),
        where('isActive', '==', true),
        orderBy('order', 'asc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HomepageStat));
    } catch (error) {
      console.error('Error fetching homepage stats:', error);
      throw error;
    }
  },

  /**
   * Get by ID
   */
  async getById(id: string): Promise<HomepageStat | null> {
    try {
      const docRef = doc(db, 'homepageStats', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as HomepageStat;
      }
      return null;
    } catch (error) {
      console.error('Error fetching homepage stat:', error);
      throw error;
    }
  },

  /**
   * Create new stat
   */
  async create(data: HomepageStatFormData): Promise<CMSResponse<HomepageStat>> {
    try {
      const timestamp = Timestamp.now();
      const newStat = {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      const docRef = await addDoc(collection(db, 'homepageStats'), newStat);
      return {
        success: true,
        data: { id: docRef.id, ...newStat } as HomepageStat,
      };
    } catch (error) {
      console.error('Error creating homepage stat:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  /**
   * Update stat
   */
  async update(id: string, data: Partial<HomepageStatFormData>): Promise<CMSResponse<HomepageStat>> {
    try {
      const docRef = doc(db, 'homepageStats', id);
      const updateData = {
        ...data,
        updatedAt: Timestamp.now(),
      };
      await updateDoc(docRef, updateData);
      const updated = await this.getById(id);
      return { success: true, data: updated || undefined };
    } catch (error) {
      console.error('Error updating homepage stat:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  /**
   * Delete stat
   */
  async delete(id: string): Promise<CMSResponse<void>> {
    try {
      const docRef = doc(db, 'homepageStats', id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting homepage stat:', error);
      return { success: false, error: (error as Error).message };
    }
  },
};

// Export all services
export const cmsService = {
  heroSlides: heroSlidesService,
  testimonials: testimonialsService,
  aboutSriLanka: aboutSriLankaService,
  whyChooseUs: whyChooseUsService,
  travelPackages: travelPackagesService,
  homepageStats: homepageStatsService,
};
