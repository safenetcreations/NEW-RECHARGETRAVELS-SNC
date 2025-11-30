import { db } from '@/lib/firebase';
import { collection, doc, getDoc, setDoc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

// ===== Types =====

export interface TeaTrailsHeroContent {
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
}

export interface TeaTrailsIntroContent {
  introParagraph: string;
}

export interface TeaTrailsHighlight {
  icon: string;
  title: string;
  blurb60: string;
}

export interface TeaTrailsRoute {
  id: string;
  routeName: string;
  duration: string;
  distanceKm: number;
  bestClass: string;
  difficulty: string;
  elevation: string;
  description?: string;
  image?: string;
  isActive: boolean;
  order: number;
}

export interface TeaTrailsTour {
  id: string;
  title: string;
  thumbnail: string;
  badges: string[];
  duration: string;
  salePriceUSD: number;
  regularPriceUSD?: number;
  highlights: string[];
  maxGroupSize?: number;
  includes?: string[];
  excludes?: string[];
  description?: string;
  isPublished: boolean;
  order: number;
}

export interface TeaTrailsGalleryImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  order: number;
}

export interface TeaTrailsFAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

export interface TeaTrailsCtaContent {
  headline: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

export interface TeaTrailsTestimonial {
  id: string;
  name: string;
  country: string;
  comment: string;
  rating: number;
  image?: string;
  tourName?: string;
  isActive: boolean;
}

export interface TeaTrailsBookingConfig {
  depositPercent: number;
  depositNote: string;
  cancellationPolicy: string;
  whatsapp: string;
  email: string;
  phone: string;
  responseTime: string;
  pickupLocations: string[];
  paymentMethods: string[];
}

export interface TeaTrailsAdminContent {
  hero: TeaTrailsHeroContent;
  intro: TeaTrailsIntroContent;
  highlights: TeaTrailsHighlight[];
  routes: TeaTrailsRoute[];
  tours: TeaTrailsTour[];
  gallery: TeaTrailsGalleryImage[];
  faqs: TeaTrailsFAQ[];
  cta: TeaTrailsCtaContent;
  testimonials: TeaTrailsTestimonial[];
  booking: TeaTrailsBookingConfig;
}

// ===== Default Content =====

export const defaultTeaTrailsHero: TeaTrailsHeroContent = {
  title: 'Sri Lanka Tea Trails',
  subtitle: 'From misty plantations to your perfect cup',
  backgroundImage: 'https://images.unsplash.com/photo-1606820854416-439b3305ff39?q=80&w=3840&h=2160&auto=format&fit=crop',
  ctaText: 'Book Tea Trail Tour',
  ctaLink: '#tours'
};

export const defaultTeaTrailsIntro: TeaTrailsIntroContent = {
  introParagraph: "Wake to the aroma of fresh Ceylon tea, hike through velvety carpets of emerald leaves and learn 150 years of plantation lore from local pickers. Sri Lanka's Tea Trails weave between lofty peaks, tumbling waterfalls and colonial bungalows that once housed British planters."
};

export const defaultTeaTrailsHighlights: TeaTrailsHighlight[] = [
  { icon: "🌿", title: "Estate Walks", blurb60: "Stroll with an expert guide among century-old bushes and learn how altitude shapes aroma." },
  { icon: "🫖", title: "Factory & Tasting", blurb60: "Tour a working 19th-century factory, see withering & rolling, then taste white, green and classic BOP." },
  { icon: "👒", title: "Pluck-Like-a-Pro", blurb60: "Try your hand at two-leaf-and-a-bud picking alongside smiling estate workers." },
  { icon: "🌄", title: "Lipton's Seat Hike", blurb60: "Sunrise trek to Sir Thomas Lipton's lookout for panoramas across five provinces." }
];

export const defaultTeaTrailsCta: TeaTrailsCtaContent = {
  headline: "Sip the World's Finest Tea Where It's Grown",
  subtitle: "Let Recharge Travels craft your perfect hill-country escape—private transport, colonial bungalows and insider tastings included.",
  buttonText: "Start Your Tea Journey",
  buttonLink: "/booking/tea-trails"
};

export const defaultTeaTrailsBooking: TeaTrailsBookingConfig = {
  depositPercent: 20,
  depositNote: '20% deposit required to confirm your booking',
  cancellationPolicy: 'Free cancellation up to 48 hours before the tour start date.',
  whatsapp: '+94777721999',
  email: 'info@rechargetravels.com',
  phone: '+94777721999',
  responseTime: 'We respond within 2 hours',
  pickupLocations: [
    'Colombo - Bandaranaike International Airport',
    'Colombo City Hotels',
    'Kandy City Hotels',
    'Nuwara Eliya Hotels',
    'Ella Hotels',
    'Custom Location'
  ],
  paymentMethods: ['Credit Card', 'PayPal', 'Bank Transfer', 'Pay on Arrival']
};

export const defaultTeaTrailsAdminContent: TeaTrailsAdminContent = {
  hero: defaultTeaTrailsHero,
  intro: defaultTeaTrailsIntro,
  highlights: defaultTeaTrailsHighlights,
  routes: [],
  tours: [],
  gallery: [],
  faqs: [],
  cta: defaultTeaTrailsCta,
  testimonials: [],
  booking: defaultTeaTrailsBooking
};

// ===== Admin Service =====

export const teaTrailsAdminService = {
  // Get all content
  async getContent(): Promise<TeaTrailsAdminContent> {
    try {
      const [hero, intro, highlights, routes, tours, gallery, faqs, cta, testimonials, booking] = await Promise.all([
        this.getHero(),
        this.getIntro(),
        this.getHighlights(),
        this.getRoutes(),
        this.getTours(),
        this.getGallery(),
        this.getFAQs(),
        this.getCta(),
        this.getTestimonials(),
        this.getBookingConfig()
      ]);

      return {
        hero: hero || defaultTeaTrailsHero,
        intro: intro || defaultTeaTrailsIntro,
        highlights: highlights.length > 0 ? highlights : defaultTeaTrailsHighlights,
        routes,
        tours,
        gallery,
        faqs,
        cta: cta || defaultTeaTrailsCta,
        testimonials,
        booking: booking || defaultTeaTrailsBooking
      };
    } catch (error) {
      console.error('Error fetching Tea Trails content:', error);
      return defaultTeaTrailsAdminContent;
    }
  },

  // Hero
  async getHero(): Promise<TeaTrailsHeroContent | null> {
    try {
      const docRef = doc(db, 'teatrails_content', 'hero');
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? (docSnap.data() as TeaTrailsHeroContent) : null;
    } catch (error) {
      console.error('Error fetching hero:', error);
      return null;
    }
  },

  async saveHero(hero: TeaTrailsHeroContent): Promise<void> {
    const docRef = doc(db, 'teatrails_content', 'hero');
    await setDoc(docRef, hero);
  },

  // Intro
  async getIntro(): Promise<TeaTrailsIntroContent | null> {
    try {
      const docRef = doc(db, 'teatrails_content', 'intro');
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? (docSnap.data() as TeaTrailsIntroContent) : null;
    } catch (error) {
      console.error('Error fetching intro:', error);
      return null;
    }
  },

  async saveIntro(intro: TeaTrailsIntroContent): Promise<void> {
    const docRef = doc(db, 'teatrails_content', 'intro');
    await setDoc(docRef, intro);
  },

  // Highlights
  async getHighlights(): Promise<TeaTrailsHighlight[]> {
    try {
      const docRef = doc(db, 'teatrails_content', 'highlights');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return data.items || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching highlights:', error);
      return [];
    }
  },

  async saveHighlights(highlights: TeaTrailsHighlight[]): Promise<void> {
    const docRef = doc(db, 'teatrails_content', 'highlights');
    await setDoc(docRef, { items: highlights });
  },

  // CTA
  async getCta(): Promise<TeaTrailsCtaContent | null> {
    try {
      const docRef = doc(db, 'teatrails_content', 'cta');
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? (docSnap.data() as TeaTrailsCtaContent) : null;
    } catch (error) {
      console.error('Error fetching CTA:', error);
      return null;
    }
  },

  async saveCta(cta: TeaTrailsCtaContent): Promise<void> {
    const docRef = doc(db, 'teatrails_content', 'cta');
    await setDoc(docRef, cta);
  },

  // Booking Config
  async getBookingConfig(): Promise<TeaTrailsBookingConfig | null> {
    try {
      const docRef = doc(db, 'teatrails_content', 'booking');
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? (docSnap.data() as TeaTrailsBookingConfig) : null;
    } catch (error) {
      console.error('Error fetching booking config:', error);
      return null;
    }
  },

  async saveBookingConfig(booking: TeaTrailsBookingConfig): Promise<void> {
    const docRef = doc(db, 'teatrails_content', 'booking');
    await setDoc(docRef, booking);
  },

  // Routes
  async getRoutes(): Promise<TeaTrailsRoute[]> {
    try {
      const q = query(collection(db, 'teatrails_routes'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeaTrailsRoute));
    } catch (error) {
      console.error('Error fetching routes:', error);
      return [];
    }
  },

  async addRoute(route: Omit<TeaTrailsRoute, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'teatrails_routes'), route);
    return docRef.id;
  },

  async updateRoute(id: string, route: Partial<TeaTrailsRoute>): Promise<void> {
    const docRef = doc(db, 'teatrails_routes', id);
    await updateDoc(docRef, route);
  },

  async deleteRoute(id: string): Promise<void> {
    const docRef = doc(db, 'teatrails_routes', id);
    await deleteDoc(docRef);
  },

  // Tours
  async getTours(): Promise<TeaTrailsTour[]> {
    try {
      const q = query(collection(db, 'teatrails_tours'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeaTrailsTour));
    } catch (error) {
      console.error('Error fetching tours:', error);
      return [];
    }
  },

  async addTour(tour: Omit<TeaTrailsTour, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'teatrails_tours'), tour);
    return docRef.id;
  },

  async updateTour(id: string, tour: Partial<TeaTrailsTour>): Promise<void> {
    const docRef = doc(db, 'teatrails_tours', id);
    await updateDoc(docRef, tour);
  },

  async deleteTour(id: string): Promise<void> {
    const docRef = doc(db, 'teatrails_tours', id);
    await deleteDoc(docRef);
  },

  // Gallery
  async getGallery(): Promise<TeaTrailsGalleryImage[]> {
    try {
      const q = query(collection(db, 'teatrails_gallery'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeaTrailsGalleryImage));
    } catch (error) {
      console.error('Error fetching gallery:', error);
      return [];
    }
  },

  async addGalleryImage(image: Omit<TeaTrailsGalleryImage, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'teatrails_gallery'), image);
    return docRef.id;
  },

  async updateGalleryImage(id: string, image: Partial<TeaTrailsGalleryImage>): Promise<void> {
    const docRef = doc(db, 'teatrails_gallery', id);
    await updateDoc(docRef, image);
  },

  async deleteGalleryImage(id: string): Promise<void> {
    const docRef = doc(db, 'teatrails_gallery', id);
    await deleteDoc(docRef);
  },

  // FAQs
  async getFAQs(): Promise<TeaTrailsFAQ[]> {
    try {
      const q = query(collection(db, 'teatrails_faqs'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeaTrailsFAQ));
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      return [];
    }
  },

  async addFAQ(faq: Omit<TeaTrailsFAQ, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'teatrails_faqs'), faq);
    return docRef.id;
  },

  async updateFAQ(id: string, faq: Partial<TeaTrailsFAQ>): Promise<void> {
    const docRef = doc(db, 'teatrails_faqs', id);
    await updateDoc(docRef, faq);
  },

  async deleteFAQ(id: string): Promise<void> {
    const docRef = doc(db, 'teatrails_faqs', id);
    await deleteDoc(docRef);
  },

  // Testimonials
  async getTestimonials(): Promise<TeaTrailsTestimonial[]> {
    try {
      const snapshot = await getDocs(collection(db, 'teatrails_testimonials'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeaTrailsTestimonial));
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }
  },

  async addTestimonial(testimonial: Omit<TeaTrailsTestimonial, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'teatrails_testimonials'), testimonial);
    return docRef.id;
  },

  async updateTestimonial(id: string, testimonial: Partial<TeaTrailsTestimonial>): Promise<void> {
    const docRef = doc(db, 'teatrails_testimonials', id);
    await updateDoc(docRef, testimonial);
  },

  async deleteTestimonial(id: string): Promise<void> {
    const docRef = doc(db, 'teatrails_testimonials', id);
    await deleteDoc(docRef);
  },

  // Save all content
  async saveContent(content: TeaTrailsAdminContent): Promise<void> {
    await Promise.all([
      this.saveHero(content.hero),
      this.saveIntro(content.intro),
      this.saveHighlights(content.highlights),
      this.saveCta(content.cta),
      this.saveBookingConfig(content.booking)
    ]);
  }
};
