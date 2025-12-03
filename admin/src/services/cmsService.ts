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

const DEFAULT_FEATURED_DESTINATIONS: FeaturedDestinationFormData[] = [
  {
    name: 'Sigiriya',
    title: 'Lion Rock Fortress',
    category: 'UNESCO Heritage',
    description:
      'Ancient rock fortress rising 200m above jungle. UNESCO World Heritage site.',
    image: 'https://images.unsplash.com/photo-1586523969943-2d62a1a7d4d3?w=1920&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1586523969943-2d62a1a7d4d3?w=1920&q=80', title: 'Discover Sigiriya', subtitle: 'Ancient Rock Fortress' },
      { url: 'https://images.unsplash.com/photo-1588598198321-9735fd52045b?w=1920&q=80', title: 'Lion Gate Entrance', subtitle: 'Gateway to History' },
      { url: 'https://images.unsplash.com/photo-1624461682949-18e7f54a0c74?w=1920&q=80', title: 'Ancient Frescoes', subtitle: 'Cloud Maidens Art' },
      { url: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=1920&q=80', title: 'Mirror Wall', subtitle: 'Ancient Graffiti Gallery' },
      { url: 'https://images.unsplash.com/photo-1580181046391-e7e83f206c62?w=1920&q=80', title: 'Summit Views', subtitle: 'Panoramic Jungle Vistas' },
    ],
    price: 150,
    currency: 'USD',
    duration: 'Full Day Trip',
    rating: 4.9,
    features: ['Ancient Frescoes', 'Mirror Wall', 'Lion Gate'],
    link: '/destinations/sigiriya',
    bestTimeToVisit: 'Year-round, best from December to April',
    popularActivities: ['Sunrise climb', 'Fresco viewing', 'Fortress walk'],
    isActive: true,
    isFeatured: true,
    order: 1,
  },
  {
    name: 'Ella',
    title: 'Hill Country Paradise',
    category: 'Hill Country',
    description: 'Misty mountain town famous for Nine Arch Bridge and hiking trails.',
    image: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=1920&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=1920&q=80', title: 'Welcome to Ella', subtitle: 'Hill Country Paradise' },
      { url: 'https://images.unsplash.com/photo-1590123853629-82e97e3d5291?w=1920&q=80', title: 'Nine Arch Bridge', subtitle: 'Iconic Railway Wonder' },
      { url: 'https://images.unsplash.com/photo-1571536802807-30451e3f3d43?w=1920&q=80', title: 'Tea Plantations', subtitle: 'Emerald Green Hills' },
      { url: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=1920&q=80', title: 'Ella Rock Summit', subtitle: 'Breathtaking Views' },
      { url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1920&q=80', title: 'Scenic Train Journey', subtitle: 'Most Beautiful Ride' },
    ],
    price: 180,
    currency: 'USD',
    duration: '2 Days / 1 Night',
    rating: 4.8,
    features: ['Nine Arch Bridge', 'Ella Rock', 'Tea Trails'],
    link: '/destinations/ella',
    bestTimeToVisit: 'February to April',
    popularActivities: ['Scenic train ride', 'Ella Rock hike', 'Little Adam\'s Peak'],
    isActive: true,
    isFeatured: true,
    order: 2,
  },
  {
    name: 'Kandy',
    title: 'Temple of Sacred Tooth',
    category: 'Cultural Heritage',
    description: "Cultural capital housing Buddha's sacred tooth relic.",
    image: 'https://images.unsplash.com/photo-1580181046391-e7e83f206c62?w=1920&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1580181046391-e7e83f206c62?w=1920&q=80', title: 'Discover Kandy', subtitle: 'Cultural Capital of Sri Lanka' },
      { url: 'https://images.unsplash.com/photo-1588598198321-9735fd52045b?w=1920&q=80', title: 'Temple of Tooth', subtitle: 'Sacred Buddhist Relic' },
      { url: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=1920&q=80', title: 'Kandy Lake', subtitle: 'Serene Waters' },
      { url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1920&q=80', title: 'Traditional Dance', subtitle: 'Cultural Performance' },
      { url: 'https://images.unsplash.com/photo-1571536802807-30451e3f3d43?w=1920&q=80', title: 'Royal Palace', subtitle: 'Historic Architecture' },
    ],
    price: 130,
    currency: 'USD',
    duration: 'Full Day Trip',
    rating: 4.7,
    features: ['Temple of Tooth', 'Kandy Lake', 'Cultural Dance'],
    link: '/destinations/kandy',
    bestTimeToVisit: 'July to August for Esala Perahera',
    popularActivities: ['Temple visit', 'City walk', 'Cultural show'],
    isActive: true,
    isFeatured: true,
    order: 3,
  },
  {
    name: 'Galle',
    title: 'Dutch Colonial Fort',
    category: 'Colonial Heritage',
    description: 'Historic fort city with colonial architecture and ocean views.',
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52045b?w=1920&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1588598198321-9735fd52045b?w=1920&q=80', title: 'Galle Fort', subtitle: 'UNESCO World Heritage Site' },
      { url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1920&q=80', title: 'Historic Lighthouse', subtitle: 'Iconic Landmark' },
      { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80', title: 'Ocean Views', subtitle: 'Stunning Coastline' },
      { url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=80', title: 'Colonial Streets', subtitle: 'Dutch Architecture' },
      { url: 'https://images.unsplash.com/photo-1580181046391-e7e83f206c62?w=1920&q=80', title: 'Sunset Magic', subtitle: 'Golden Hour Views' },
    ],
    price: 140,
    currency: 'USD',
    duration: 'Full Day Trip',
    rating: 4.8,
    features: ['Galle Fort', 'Lighthouse', 'Dutch Museum'],
    link: '/destinations/galle',
    bestTimeToVisit: 'December to April',
    popularActivities: ['Fort walk', 'Sunset views', 'Cafe hopping'],
    isActive: true,
    isFeatured: true,
    order: 4,
  },
  {
    name: 'Mirissa',
    title: 'Whale Watching Capital',
    category: 'Beach & Wildlife',
    description:
      "Pristine beach paradise and world's best blue whale destination.",
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80', title: 'Mirissa Beach', subtitle: 'Tropical Paradise' },
      { url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=80', title: 'Blue Whale Watching', subtitle: 'Marine Giants' },
      { url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1920&q=80', title: 'Coconut Tree Hill', subtitle: 'Instagram Famous' },
      { url: 'https://images.unsplash.com/photo-1588598198321-9735fd52045b?w=1920&q=80', title: 'Surfing Paradise', subtitle: 'Ride the Waves' },
      { url: 'https://images.unsplash.com/photo-1580181046391-e7e83f206c62?w=1920&q=80', title: 'Beach Sunset', subtitle: 'Golden Evenings' },
    ],
    price: 160,
    currency: 'USD',
    duration: 'Full Day Trip',
    rating: 4.9,
    features: ['Blue Whales', 'Coconut Beach', 'Surfing'],
    link: '/destinations/mirissa',
    bestTimeToVisit: 'November to April',
    popularActivities: ['Whale watching', 'Beach time', 'Surfing'],
    isActive: true,
    isFeatured: true,
    order: 5,
  },
  {
    name: 'Yala',
    title: 'Leopard Kingdom',
    category: 'Wildlife Safari',
    description: "World's highest leopard density. Iconic safari destination.",
    image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=1920&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=1920&q=80', title: 'Yala National Park', subtitle: 'Wildlife Sanctuary' },
      { url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&q=80', title: 'Sri Lankan Leopard', subtitle: 'Highest Density in World' },
      { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=80', title: 'Wild Elephants', subtitle: 'Gentle Giants' },
      { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1920&q=80', title: 'Safari Adventure', subtitle: 'Jeep Expedition' },
      { url: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=1920&q=80', title: 'Bird Watching', subtitle: 'Over 200 Species' },
    ],
    price: 220,
    currency: 'USD',
    duration: 'Full Day Safari',
    rating: 4.9,
    features: ['Leopards', 'Elephants', 'Bird Watching'],
    link: '/wild-tours',
    bestTimeToVisit: 'February to July',
    popularActivities: ['Jeep safari', 'Wildlife photography', 'Bird watching'],
    isActive: true,
    isFeatured: true,
    order: 6,
  },
];

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
   * Get all hero slides for admin (includes active and inactive)
   */
  async getAllAdmin(): Promise<HeroSlide[]> {
    try {
      const q = query(
        collection(db, 'heroSlides'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HeroSlide));
    } catch (error) {
      console.error('Error fetching hero slides for admin:', error);
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
      // For admin panel, get all destinations (including inactive) and sort client-side
      const snapshot = await getDocs(collection(db, 'featuredDestinations'));
      const destinations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FeaturedDestination));
      // Sort by order field
      return destinations.sort((a, b) => (a.order || 0) - (b.order || 0));
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

  async importDefaults(): Promise<CMSResponse<FeaturedDestination[]>> {
    try {
      const existingSnapshot = await getDocs(collection(db, 'featuredDestinations'));
      if (!existingSnapshot.empty) {
        return {
          success: false,
          error:
            'Featured destinations already exist. Delete them first if you want to re-import defaults.',
        };
      }

      const created: FeaturedDestination[] = [];
      const timestamp = Timestamp.now();

      for (const dest of DEFAULT_FEATURED_DESTINATIONS) {
        const data = {
          ...dest,
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        const docRef = await addDoc(collection(db, 'featuredDestinations'), data);
        created.push({ id: docRef.id, ...data } as FeaturedDestination);
      }

      return { success: true, data: created };
    } catch (error) {
      console.error('Error importing default featured destinations:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  async clearAll(): Promise<CMSResponse<void>> {
    try {
      const snapshot = await getDocs(collection(db, 'featuredDestinations'));
      const deletePromises = snapshot.docs.map(docSnap => deleteDoc(docSnap.ref));
      await Promise.all(deletePromises);
      return { success: true };
    } catch (error) {
      console.error('Error clearing featured destinations:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  async clearAndImport(): Promise<CMSResponse<FeaturedDestination[]>> {
    try {
      // First clear all existing destinations
      const snapshot = await getDocs(collection(db, 'featuredDestinations'));
      const deletePromises = snapshot.docs.map(docSnap => deleteDoc(docSnap.ref));
      await Promise.all(deletePromises);

      // Now import defaults
      const created: FeaturedDestination[] = [];
      const timestamp = Timestamp.now();

      for (const dest of DEFAULT_FEATURED_DESTINATIONS) {
        const data = {
          ...dest,
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        const docRef = await addDoc(collection(db, 'featuredDestinations'), data);
        created.push({ id: docRef.id, ...data } as FeaturedDestination);
      }

      return { success: true, data: created };
    } catch (error) {
      console.error('Error clearing and importing featured destinations:', error);
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
