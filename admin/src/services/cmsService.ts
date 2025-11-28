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
  setDoc,
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
  LuxuryExperience,
  LuxuryExperienceFormData,
  TravelGuideSection,
  TravelGuideFormData,
  HomepageSettings,
  HomepageSettingsFormData,
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
      const docRef = doc(db, 'page-content', 'about-sri-lanka');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as AboutSriLankaContent;
      }
      return null;
    } catch (error) {
      console.error('Error fetching About Sri Lanka content:', error);
      throw error;
    }
  },

  /**
   * Get by ID (for this singleton, it's the same as getActive/get)
   */
  async getById(id: string): Promise<AboutSriLankaContent | null> {
    return this.getActive();
  },

  /**
   * Create new content (Upsert for singleton)
   */
  async create(data: AboutSriLankaFormData): Promise<CMSResponse<AboutSriLankaContent>> {
    return this.update('about-sri-lanka', data);
  },

  /**
   * Update content
   */
  async update(id: string, data: Partial<AboutSriLankaFormData>): Promise<CMSResponse<AboutSriLankaContent>> {
    try {
      const docRef = doc(db, 'page-content', 'about-sri-lanka');
      const timestamp = Timestamp.now();
      const updateData = {
        ...data,
        updatedAt: timestamp,
      };
      // Use setDoc with merge: true to handle both create and update
      await setDoc(docRef, updateData, { merge: true });
      const updated = await this.getActive();
      return { success: true, data: updated || undefined };
    } catch (error) {
      console.error('Error updating About Sri Lanka:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  /**
   * Delete content (Not applicable for singleton page content usually, but can implement if needed)
   */
  async delete(id: string): Promise<CMSResponse<void>> {
    try {
      const docRef = doc(db, 'page-content', 'about-sri-lanka');
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

// ==========================================
// Featured Destinations CRUD Operations
// ==========================================

export const featuredDestinationsService = {
  async getAll(): Promise<FeaturedDestination[]> {
    try {
      const q = query(
        collection(db, 'featuredDestinations'),
        where('isActive', '==', true),
        orderBy('order', 'asc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FeaturedDestination));
    } catch (error) {
      console.error('Error fetching featured destinations:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<FeaturedDestination | null> {
    try {
      const docRef = doc(db, 'featuredDestinations', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as FeaturedDestination;
      }
      return null;
    } catch (error) {
      console.error('Error fetching featured destination:', error);
      throw error;
    }
  },

  async create(data: FeaturedDestinationFormData): Promise<CMSResponse<FeaturedDestination>> {
    try {
      const timestamp = Timestamp.now();
      const newDest = {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      const docRef = await addDoc(collection(db, 'featuredDestinations'), newDest);
      return {
        success: true,
        data: { id: docRef.id, ...newDest } as FeaturedDestination,
      };
    } catch (error) {
      console.error('Error creating featured destination:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  async update(id: string, data: Partial<FeaturedDestinationFormData>): Promise<CMSResponse<FeaturedDestination>> {
    try {
      const docRef = doc(db, 'featuredDestinations', id);
      const updateData = {
        ...data,
        updatedAt: Timestamp.now(),
      };
      await updateDoc(docRef, updateData);
      const updated = await this.getById(id);
      return { success: true, data: updated || undefined };
    } catch (error) {
      console.error('Error updating featured destination:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  async delete(id: string): Promise<CMSResponse<void>> {
    try {
      const docRef = doc(db, 'featuredDestinations', id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting featured destination:', error);
      return { success: false, error: (error as Error).message };
    }
  },
};

// ==========================================
// Luxury Experiences CRUD Operations
// ==========================================

export const luxuryExperiencesService = {
  /**
   * Helper function to generate URL-friendly slug
   */
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  },

  /**
   * Get all luxury experiences (for admin - includes all statuses)
   */
  async getAll(): Promise<LuxuryExperience[]> {
    try {
      const q = query(
        collection(db, 'luxuryExperiences'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LuxuryExperience));
    } catch (error) {
      console.error('Error fetching luxury experiences:', error);
      throw error;
    }
  },

  /**
   * Get published experiences only (for public site)
   */
  async getPublished(): Promise<LuxuryExperience[]> {
    try {
      const q = query(
        collection(db, 'luxuryExperiences'),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LuxuryExperience));
    } catch (error) {
      console.error('Error fetching published experiences:', error);
      throw error;
    }
  },

  /**
   * Get by ID
   */
  async getById(id: string): Promise<LuxuryExperience | null> {
    try {
      const docRef = doc(db, 'luxuryExperiences', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as LuxuryExperience;
      }
      return null;
    } catch (error) {
      console.error('Error fetching luxury experience:', error);
      throw error;
    }
  },

  /**
   * Create new experience
   */
  async create(data: LuxuryExperienceFormData): Promise<CMSResponse<LuxuryExperience>> {
    try {
      const timestamp = Timestamp.now();

      // Auto-generate slug from title if not provided
      const slug = data.slug || this.generateSlug(data.title);

      const newExp = {
        ...data,
        slug,
        createdAt: timestamp,
        updatedAt: timestamp,
        publishedAt: data.status === 'published' ? timestamp : undefined,
      };

      const docRef = await addDoc(collection(db, 'luxuryExperiences'), newExp);
      return {
        success: true,
        data: { id: docRef.id, ...newExp } as LuxuryExperience,
      };
    } catch (error) {
      console.error('Error creating luxury experience:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  /**
   * Update experience
   */
  async update(id: string, data: Partial<LuxuryExperienceFormData>): Promise<CMSResponse<LuxuryExperience>> {
    try {
      const docRef = doc(db, 'luxuryExperiences', id);

      // Get current document to check status change
      const currentDoc = await getDoc(docRef);
      const currentData = currentDoc.data();

      // Update slug if title changed
      const updateData: any = {
        ...data,
        updatedAt: Timestamp.now(),
      };

      if (data.title) {
        updateData.slug = data.slug || this.generateSlug(data.title);
      }

      // Set publishedAt if status changed to published
      if (data.status === 'published' && currentData?.status !== 'published') {
        updateData.publishedAt = Timestamp.now();
      }

      await updateDoc(docRef, updateData);
      const updated = await this.getById(id);
      return { success: true, data: updated || undefined };
    } catch (error) {
      console.error('Error updating luxury experience:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  /**
   * Delete experience
   */
  async delete(id: string): Promise<CMSResponse<void>> {
    try {
      const docRef = doc(db, 'luxuryExperiences', id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting luxury experience:', error);
      return { success: false, error: (error as Error).message };
    }
  },
};

// ==========================================
// Travel Guide CRUD Operations
// ==========================================

export const travelGuideService = {
  async getAll(): Promise<TravelGuideSection[]> {
    try {
      const q = query(
        collection(db, 'travelGuide'),
        where('isActive', '==', true),
        orderBy('order', 'asc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TravelGuideSection));
    } catch (error) {
      console.error('Error fetching travel guide sections:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<TravelGuideSection | null> {
    try {
      const docRef = doc(db, 'travelGuide', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as TravelGuideSection;
      }
      return null;
    } catch (error) {
      console.error('Error fetching travel guide section:', error);
      throw error;
    }
  },

  async create(data: TravelGuideFormData): Promise<CMSResponse<TravelGuideSection>> {
    try {
      const timestamp = Timestamp.now();
      const newSection = {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      const docRef = await addDoc(collection(db, 'travelGuide'), newSection);
      return {
        success: true,
        data: { id: docRef.id, ...newSection } as TravelGuideSection,
      };
    } catch (error) {
      console.error('Error creating travel guide section:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  async update(id: string, data: Partial<TravelGuideFormData>): Promise<CMSResponse<TravelGuideSection>> {
    try {
      const docRef = doc(db, 'travelGuide', id);
      const updateData = {
        ...data,
        updatedAt: Timestamp.now(),
      };
      await updateDoc(docRef, updateData);
      const updated = await this.getById(id);
      return { success: true, data: updated || undefined };
    } catch (error) {
      console.error('Error updating travel guide section:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  async delete(id: string): Promise<CMSResponse<void>> {
    try {
      const docRef = doc(db, 'travelGuide', id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting travel guide section:', error);
      return { success: false, error: (error as Error).message };
    }
  },
};

// ==========================================
// Homepage Settings CRUD Operations
// ==========================================

export const homepageSettingsService = {
  async getActive(): Promise<HomepageSettings | null> {
    try {
      const docRef = doc(db, 'page-content', 'homepage-settings');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as HomepageSettings;
      }
      return null;
    } catch (error) {
      console.error('Error fetching homepage settings:', error);
      throw error;
    }
  },

  async update(data: Partial<HomepageSettingsFormData>): Promise<CMSResponse<HomepageSettings>> {
    try {
      const docRef = doc(db, 'page-content', 'homepage-settings');
      const timestamp = Timestamp.now();
      const updateData = {
        ...data,
        updatedAt: timestamp,
      };
      await setDoc(docRef, updateData, { merge: true });
      const updated = await this.getActive();
      return { success: true, data: updated || undefined };
    } catch (error) {
      console.error('Error updating homepage settings:', error);
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
  featuredDestinations: featuredDestinationsService,
  luxuryExperiences: luxuryExperiencesService,
  travelGuide: travelGuideService,
  homepageSettings: homepageSettingsService,
};
