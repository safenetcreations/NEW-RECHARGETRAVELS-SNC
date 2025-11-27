import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  addDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type {
  PrivateTourPackage,
  PrivateTourCategory,
  PrivateTourBooking,
  PrivateToursPageContent,
  PrivateTourGuide,
  PrivateTourTestimonial
} from '@/types/private-tours';

// Default page content
const DEFAULT_PAGE_CONTENT: PrivateToursPageContent = {
  heroSlides: [
    {
      id: '1',
      image: "https://images.unsplash.com/photo-1588979355313-6711a095465f?auto=format&fit=crop&q=80",
      title: "Discover Sri Lanka Your Way",
      subtitle: "Private Tours with Local Experts",
      description: "Create unforgettable memories with personalized tours guided by experienced locals",
      ctaText: "Plan Your Journey",
      ctaLink: "#booking"
    },
    {
      id: '2',
      image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&q=80",
      title: "Ancient Cities & Sacred Sites",
      subtitle: "Journey Through History",
      description: "Explore UNESCO World Heritage sites with knowledgeable guides who bring history to life",
      ctaText: "Explore Heritage",
      ctaLink: "/tours/cultural"
    },
    {
      id: '3',
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80",
      title: "Wildlife & Nature Adventures",
      subtitle: "Experience the Wild Side",
      description: "From elephants to leopards, discover Sri Lanka's incredible biodiversity",
      ctaText: "Safari Tours",
      ctaLink: "/tours/wildtours"
    }
  ],
  seoTitle: "Private Tours in Sri Lanka - Customized Travel Experiences | Recharge Travels",
  seoDescription: "Explore Sri Lanka with personalized private tours. Expert local guides, flexible itineraries, premium vehicles. Create your perfect journey today!",
  seoKeywords: ["private tours Sri Lanka", "custom Sri Lanka tours", "personalized travel Sri Lanka", "luxury private driver"],
  trustIndicators: {
    rating: "4.9",
    totalReviews: "1,892",
    yearsExperience: "12",
    toursCompleted: "5,000+",
    support: "24/7"
  },
  whyChooseUs: [
    {
      id: '1',
      icon: "User",
      title: "Expert Local Guides",
      description: "Knowledgeable guides who share insider stories and hidden gems",
      benefit: "Authentic experiences"
    },
    {
      id: '2',
      icon: "Route",
      title: "Flexible Itineraries",
      description: "Customize your tour on the go - stay longer at places you love",
      benefit: "Your pace, your way"
    },
    {
      id: '3',
      icon: "Car",
      title: "Premium Vehicles",
      description: "Air-conditioned vehicles with Wi-Fi and refreshments",
      benefit: "Travel in comfort"
    },
    {
      id: '4',
      icon: "Camera",
      title: "Photography Stops",
      description: "Unlimited photo stops at scenic viewpoints and Instagram spots",
      benefit: "Capture memories"
    },
    {
      id: '5',
      icon: "Heart",
      title: "Cultural Immersion",
      description: "Visit local villages, try authentic food, meet friendly locals",
      benefit: "Connect with culture"
    },
    {
      id: '6',
      icon: "Shield",
      title: "Safety First",
      description: "Licensed guides, insured vehicles, and 24/7 support",
      benefit: "Peace of mind"
    }
  ],
  ctaSection: {
    title: "Ready to Start Your Adventure?",
    subtitle: "Let us create the perfect Sri Lankan journey tailored just for you",
    primaryCta: "Book Private Tour",
    secondaryCta: "Talk to Expert",
    whatsappNumber: "+94777721999"
  }
};

class PrivateToursService {
  private packagesCollection = 'privateTourPackages';
  private categoriesCollection = 'privateTourCategories';
  private bookingsCollection = 'privateTourBookings';
  private guidesCollection = 'privateTourGuides';
  private testimonialsCollection = 'privateTourTestimonials';
  private pageContentDoc = 'page-content/private-tours';

  // ============ PAGE CONTENT ============

  async getPageContent(): Promise<PrivateToursPageContent> {
    try {
      const docRef = doc(db, this.pageContentDoc);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { ...DEFAULT_PAGE_CONTENT, ...docSnap.data() } as PrivateToursPageContent;
      }
      return DEFAULT_PAGE_CONTENT;
    } catch (error) {
      console.error('Error loading page content:', error);
      return DEFAULT_PAGE_CONTENT;
    }
  }

  async updatePageContent(content: Partial<PrivateToursPageContent>): Promise<void> {
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

  // ============ TOUR PACKAGES ============

  async getPackages(options?: {
    categoryId?: string;
    featured?: boolean;
    popular?: boolean;
    status?: 'published' | 'draft';
    limitCount?: number;
  }): Promise<PrivateTourPackage[]> {
    try {
      let q = query(collection(db, this.packagesCollection));

      const constraints: any[] = [];

      if (options?.status) {
        constraints.push(where('status', '==', options.status));
      } else {
        constraints.push(where('status', '==', 'published'));
      }

      if (options?.categoryId) {
        constraints.push(where('categoryId', '==', options.categoryId));
      }

      if (options?.featured) {
        constraints.push(where('featured', '==', true));
      }

      if (options?.popular) {
        constraints.push(where('popular', '==', true));
      }

      constraints.push(orderBy('sortOrder', 'asc'));

      if (options?.limitCount) {
        constraints.push(limit(options.limitCount));
      }

      q = query(collection(db, this.packagesCollection), ...constraints);
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PrivateTourPackage[];
    } catch (error) {
      console.error('Error getting packages:', error);
      return [];
    }
  }

  async getPackageById(id: string): Promise<PrivateTourPackage | null> {
    try {
      const docRef = doc(db, this.packagesCollection, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as PrivateTourPackage;
      }
      return null;
    } catch (error) {
      console.error('Error getting package:', error);
      return null;
    }
  }

  async getPackageBySlug(slug: string): Promise<PrivateTourPackage | null> {
    try {
      const q = query(
        collection(db, this.packagesCollection),
        where('slug', '==', slug),
        where('status', '==', 'published'),
        limit(1)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() } as PrivateTourPackage;
      }
      return null;
    } catch (error) {
      console.error('Error getting package by slug:', error);
      return null;
    }
  }

  async createPackage(data: Omit<PrivateTourPackage, 'id' | 'createdAt' | 'updatedAt'>): Promise<PrivateTourPackage> {
    try {
      const slug = this.generateSlug(data.name);
      const docRef = await addDoc(collection(db, this.packagesCollection), {
        ...data,
        slug,
        status: data.status || 'draft',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      return {
        id: docRef.id,
        ...data,
        slug
      } as PrivateTourPackage;
    } catch (error) {
      console.error('Error creating package:', error);
      throw error;
    }
  }

  async updatePackage(id: string, data: Partial<PrivateTourPackage>): Promise<void> {
    try {
      const docRef = doc(db, this.packagesCollection, id);
      const updates: any = { ...data, updatedAt: Timestamp.now() };

      if (data.name) {
        updates.slug = this.generateSlug(data.name);
      }

      await updateDoc(docRef, updates);
    } catch (error) {
      console.error('Error updating package:', error);
      throw error;
    }
  }

  async deletePackage(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.packagesCollection, id));
    } catch (error) {
      console.error('Error deleting package:', error);
      throw error;
    }
  }

  // ============ CATEGORIES ============

  async getCategories(): Promise<PrivateTourCategory[]> {
    try {
      const q = query(
        collection(db, this.categoriesCollection),
        where('isActive', '==', true),
        orderBy('sortOrder', 'asc')
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PrivateTourCategory[];
    } catch (error) {
      console.error('Error getting categories:', error);
      // Return default categories
      return [
        { id: 'cultural', name: 'Cultural & Heritage', slug: 'cultural', description: 'Ancient temples, UNESCO sites, and historical landmarks', icon: 'Landmark', color: '#8B5CF6', isActive: true, sortOrder: 1 },
        { id: 'wildlife', name: 'Wildlife Safari', slug: 'wildlife', description: 'National parks, elephant safaris, and leopard tracking', icon: 'Bird', color: '#10B981', isActive: true, sortOrder: 2 },
        { id: 'beach', name: 'Beach & Coastal', slug: 'beach', description: 'Pristine beaches, whale watching, and water sports', icon: 'Waves', color: '#0EA5E9', isActive: true, sortOrder: 3 },
        { id: 'hill-country', name: 'Hill Country', slug: 'hill-country', description: 'Tea plantations, scenic trains, and cool mountains', icon: 'Mountain', color: '#22C55E', isActive: true, sortOrder: 4 },
        { id: 'adventure', name: 'Adventure', slug: 'adventure', description: 'Hiking, rafting, and outdoor activities', icon: 'Compass', color: '#F59E0B', isActive: true, sortOrder: 5 },
        { id: 'wellness', name: 'Wellness & Ayurveda', slug: 'wellness', description: 'Spa retreats, yoga, and traditional healing', icon: 'Leaf', color: '#EC4899', isActive: true, sortOrder: 6 }
      ];
    }
  }

  async createCategory(data: Omit<PrivateTourCategory, 'id'>): Promise<PrivateTourCategory> {
    try {
      const docRef = await addDoc(collection(db, this.categoriesCollection), {
        ...data,
        slug: this.generateSlug(data.name),
        createdAt: Timestamp.now()
      });

      return { id: docRef.id, ...data } as PrivateTourCategory;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  // ============ GUIDES ============

  async getGuides(options?: { featured?: boolean; limitCount?: number }): Promise<PrivateTourGuide[]> {
    try {
      let q = query(
        collection(db, this.guidesCollection),
        where('isActive', '==', true)
      );

      if (options?.featured) {
        q = query(q, where('featured', '==', true));
      }

      q = query(q, orderBy('rating', 'desc'));

      if (options?.limitCount) {
        q = query(q, limit(options.limitCount));
      }

      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PrivateTourGuide[];
    } catch (error) {
      console.error('Error getting guides:', error);
      // Return default guides
      return [
        {
          id: '1',
          name: 'Chaminda Perera',
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
          languages: ['English', 'Sinhala', 'German'],
          specialties: ['Cultural Tours', 'Wildlife Safari'],
          experience: 15,
          rating: 4.9,
          reviewCount: 342,
          bio: 'Expert in Sri Lankan history and wildlife with 15 years of guiding experience.',
          isActive: true,
          featured: true
        },
        {
          id: '2',
          name: 'Kumari Silva',
          photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
          languages: ['English', 'Sinhala', 'French'],
          specialties: ['Wellness Tours', 'Culinary Experiences'],
          experience: 10,
          rating: 4.8,
          reviewCount: 256,
          bio: 'Specializes in wellness retreats and authentic culinary experiences.',
          isActive: true,
          featured: true
        },
        {
          id: '3',
          name: 'Rajitha Fernando',
          photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
          languages: ['English', 'Sinhala', 'Tamil'],
          specialties: ['Adventure Tours', 'Photography'],
          experience: 8,
          rating: 4.9,
          reviewCount: 189,
          bio: 'Adventure enthusiast and professional photographer who knows the best spots.',
          isActive: true,
          featured: true
        }
      ];
    }
  }

  // ============ TESTIMONIALS ============

  async getTestimonials(limitCount = 6): Promise<PrivateTourTestimonial[]> {
    try {
      const q = query(
        collection(db, this.testimonialsCollection),
        where('isApproved', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PrivateTourTestimonial[];
    } catch (error) {
      console.error('Error getting testimonials:', error);
      // Return default testimonials
      return [
        {
          id: '1',
          name: 'Sarah Mitchell',
          country: 'Australia',
          avatar: 'S',
          rating: 5,
          tourType: 'Cultural Triangle Tour',
          text: 'Recharge Travels made our Sri Lanka adventure unforgettable! Our private guide knew all the best spots and made the history come alive.',
          date: '2024-11-15',
          isApproved: true,
          featured: true
        },
        {
          id: '2',
          name: 'James Wilson',
          country: 'UK',
          avatar: 'J',
          rating: 5,
          tourType: 'Wildlife Safari',
          text: 'The wildlife safari exceeded all expectations. Our guide spotted leopards and elephants that other groups missed. Truly a once-in-a-lifetime experience!',
          date: '2024-11-10',
          isApproved: true,
          featured: true
        },
        {
          id: '3',
          name: 'Maria Garcia',
          country: 'Spain',
          avatar: 'M',
          rating: 5,
          tourType: 'Hill Country Explorer',
          text: 'The train journey through tea country was magical. Our driver-guide created the perfect pace for our family with young kids.',
          date: '2024-11-05',
          isApproved: true,
          featured: true
        }
      ];
    }
  }

  // ============ BOOKINGS ============

  async createBooking(data: Omit<PrivateTourBooking, 'id' | 'createdAt' | 'bookingReference'>): Promise<PrivateTourBooking> {
    try {
      const bookingReference = this.generateBookingReference();

      const docRef = await addDoc(collection(db, this.bookingsCollection), {
        ...data,
        bookingReference,
        status: 'pending',
        createdAt: Timestamp.now()
      });

      return {
        id: docRef.id,
        bookingReference,
        ...data
      } as PrivateTourBooking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async getBookings(options?: {
    status?: string;
    userId?: string;
    limitCount?: number
  }): Promise<PrivateTourBooking[]> {
    try {
      let q = query(collection(db, this.bookingsCollection));

      const constraints: any[] = [];

      if (options?.status) {
        constraints.push(where('status', '==', options.status));
      }

      if (options?.userId) {
        constraints.push(where('userId', '==', options.userId));
      }

      constraints.push(orderBy('createdAt', 'desc'));

      if (options?.limitCount) {
        constraints.push(limit(options.limitCount));
      }

      q = query(collection(db, this.bookingsCollection), ...constraints);
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PrivateTourBooking[];
    } catch (error) {
      console.error('Error getting bookings:', error);
      return [];
    }
  }

  async updateBookingStatus(id: string, status: string, notes?: string): Promise<void> {
    try {
      const docRef = doc(db, this.bookingsCollection, id);
      await updateDoc(docRef, {
        status,
        ...(notes && { adminNotes: notes }),
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  // ============ HELPERS ============

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private generateBookingReference(): string {
    const prefix = 'PT';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  // ============ STATISTICS (for admin) ============

  async getStatistics(): Promise<{
    totalPackages: number;
    totalBookings: number;
    pendingBookings: number;
    totalRevenue: number;
  }> {
    try {
      const [packages, bookings] = await Promise.all([
        getDocs(collection(db, this.packagesCollection)),
        getDocs(collection(db, this.bookingsCollection))
      ]);

      const bookingsData = bookings.docs.map(d => d.data());
      const pendingCount = bookingsData.filter(b => b.status === 'pending').length;
      const totalRevenue = bookingsData
        .filter(b => b.status === 'confirmed' || b.status === 'completed')
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

      return {
        totalPackages: packages.size,
        totalBookings: bookings.size,
        pendingBookings: pendingCount,
        totalRevenue
      };
    } catch (error) {
      console.error('Error getting statistics:', error);
      return {
        totalPackages: 0,
        totalBookings: 0,
        pendingBookings: 0,
        totalRevenue: 0
      };
    }
  }
}

export const privateToursService = new PrivateToursService();
