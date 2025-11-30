import { db } from '@/lib/firebase';
import { collection, doc, getDoc, setDoc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

// ===== Types =====

export interface PilgrimageHeroContent {
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
}

export interface PilgrimageIntroContent {
  introParagraph: string;
}

export interface PilgrimageHighlight {
  icon: string;
  title: string;
  blurb60: string;
}

export interface PilgrimageSite {
  id: string;
  name: string;
  description: string;
  location: string;
  significance: string;
  highlights: string[];
  bestTime: string;
  duration: string;
  religion: string;
  image?: string;
  isActive: boolean;
  order: number;
}

export interface PilgrimageTour {
  id: string;
  title: string;
  thumbnail: string;
  badges: string[];
  duration: string;
  salePriceUSD: number;
  regularPriceUSD?: number;
  highlights: string[];
  included: string[];
  type: string;
  description?: string;
  isPublished: boolean;
  order: number;
}

export interface PilgrimageGalleryImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  order: number;
}

export interface PilgrimageFAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

export interface PilgrimageCtaContent {
  headline: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

export interface PilgrimageTestimonial {
  id: string;
  name: string;
  country: string;
  comment: string;
  rating: number;
  image?: string;
  tourName?: string;
  isActive: boolean;
}

export interface PilgrimageBookingConfig {
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

export interface PilgrimageGuideline {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
}

export interface PilgrimageAdminContent {
  hero: PilgrimageHeroContent;
  intro: PilgrimageIntroContent;
  highlights: PilgrimageHighlight[];
  sites: PilgrimageSite[];
  tours: PilgrimageTour[];
  gallery: PilgrimageGalleryImage[];
  faqs: PilgrimageFAQ[];
  cta: PilgrimageCtaContent;
  testimonials: PilgrimageTestimonial[];
  booking: PilgrimageBookingConfig;
  guidelines: PilgrimageGuideline[];
}

// ===== Default Content =====

export const defaultPilgrimageHero: PilgrimageHeroContent = {
  title: 'Sacred Pilgrimage Sites',
  subtitle: 'Spiritual Journeys Through Sri Lanka\'s Holy Places',
  backgroundImage: 'https://images.unsplash.com/photo-1590329273188-041ec23505f7?q=80&w=3840&h=2160&auto=format&fit=crop',
  ctaText: 'Begin Your Pilgrimage',
  ctaLink: '#tours'
};

export const defaultPilgrimageIntro: PilgrimageIntroContent = {
  introParagraph: "Sri Lanka is a land of profound spirituality, where ancient temples, sacred mountains, and holy shrines draw pilgrims from around the world. Experience the island's rich religious heritage through visits to Buddhist temples, Hindu kovils, historic mosques, and Catholic churches, each offering unique spiritual experiences and architectural wonders."
};

export const defaultPilgrimageHighlights: PilgrimageHighlight[] = [
  { icon: "🛕", title: "Sacred Temples", blurb60: "Visit ancient Buddhist temples and Hindu kovils with centuries of spiritual significance." },
  { icon: "🏔️", title: "Holy Mountains", blurb60: "Climb Sri Pada (Adam's Peak) and witness the sacred footprint revered by all faiths." },
  { icon: "🙏", title: "Multi-Faith Sites", blurb60: "Experience the harmony of Buddhism, Hinduism, Christianity, and Islam in one journey." },
  { icon: "🌅", title: "Spiritual Ceremonies", blurb60: "Participate in authentic pujas, offerings, and religious ceremonies with local devotees." }
];

export const defaultPilgrimageCta: PilgrimageCtaContent = {
  headline: "Begin Your Spiritual Journey",
  subtitle: "Let us guide you through Sri Lanka's sacred sites with respect, understanding, and authentic spiritual experiences.",
  buttonText: "Book Pilgrimage Tour",
  buttonLink: "/booking/pilgrimage"
};

export const defaultPilgrimageBooking: PilgrimageBookingConfig = {
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
    'Negombo Hotels',
    'Custom Location'
  ],
  paymentMethods: ['Credit Card', 'PayPal', 'Bank Transfer', 'Pay on Arrival']
};

export const defaultPilgrimageAdminContent: PilgrimageAdminContent = {
  hero: defaultPilgrimageHero,
  intro: defaultPilgrimageIntro,
  highlights: defaultPilgrimageHighlights,
  sites: [],
  tours: [],
  gallery: [],
  faqs: [],
  cta: defaultPilgrimageCta,
  testimonials: [],
  booking: defaultPilgrimageBooking,
  guidelines: []
};

// ===== Admin Service =====

export const pilgrimageAdminService = {
  // Get all content
  async getContent(): Promise<PilgrimageAdminContent> {
    try {
      const [hero, intro, highlights, sites, tours, gallery, faqs, cta, testimonials, booking, guidelines] = await Promise.all([
        this.getHero(),
        this.getIntro(),
        this.getHighlights(),
        this.getSites(),
        this.getTours(),
        this.getGallery(),
        this.getFAQs(),
        this.getCta(),
        this.getTestimonials(),
        this.getBookingConfig(),
        this.getGuidelines()
      ]);

      return {
        hero: hero || defaultPilgrimageHero,
        intro: intro || defaultPilgrimageIntro,
        highlights: highlights.length > 0 ? highlights : defaultPilgrimageHighlights,
        sites,
        tours,
        gallery,
        faqs,
        cta: cta || defaultPilgrimageCta,
        testimonials,
        booking: booking || defaultPilgrimageBooking,
        guidelines
      };
    } catch (error) {
      console.error('Error fetching Pilgrimage content:', error);
      return defaultPilgrimageAdminContent;
    }
  },

  // Hero
  async getHero(): Promise<PilgrimageHeroContent | null> {
    try {
      const docRef = doc(db, 'pilgrimage_content', 'hero');
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? (docSnap.data() as PilgrimageHeroContent) : null;
    } catch (error) {
      console.error('Error fetching hero:', error);
      return null;
    }
  },

  async saveHero(hero: PilgrimageHeroContent): Promise<void> {
    const docRef = doc(db, 'pilgrimage_content', 'hero');
    await setDoc(docRef, hero);
  },

  // Intro
  async getIntro(): Promise<PilgrimageIntroContent | null> {
    try {
      const docRef = doc(db, 'pilgrimage_content', 'intro');
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? (docSnap.data() as PilgrimageIntroContent) : null;
    } catch (error) {
      console.error('Error fetching intro:', error);
      return null;
    }
  },

  async saveIntro(intro: PilgrimageIntroContent): Promise<void> {
    const docRef = doc(db, 'pilgrimage_content', 'intro');
    await setDoc(docRef, intro);
  },

  // Highlights
  async getHighlights(): Promise<PilgrimageHighlight[]> {
    try {
      const docRef = doc(db, 'pilgrimage_content', 'highlights');
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

  async saveHighlights(highlights: PilgrimageHighlight[]): Promise<void> {
    const docRef = doc(db, 'pilgrimage_content', 'highlights');
    await setDoc(docRef, { items: highlights });
  },

  // CTA
  async getCta(): Promise<PilgrimageCtaContent | null> {
    try {
      const docRef = doc(db, 'pilgrimage_content', 'cta');
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? (docSnap.data() as PilgrimageCtaContent) : null;
    } catch (error) {
      console.error('Error fetching CTA:', error);
      return null;
    }
  },

  async saveCta(cta: PilgrimageCtaContent): Promise<void> {
    const docRef = doc(db, 'pilgrimage_content', 'cta');
    await setDoc(docRef, cta);
  },

  // Booking Config
  async getBookingConfig(): Promise<PilgrimageBookingConfig | null> {
    try {
      const docRef = doc(db, 'pilgrimage_content', 'booking');
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? (docSnap.data() as PilgrimageBookingConfig) : null;
    } catch (error) {
      console.error('Error fetching booking config:', error);
      return null;
    }
  },

  async saveBookingConfig(booking: PilgrimageBookingConfig): Promise<void> {
    const docRef = doc(db, 'pilgrimage_content', 'booking');
    await setDoc(docRef, booking);
  },

  // Sites
  async getSites(): Promise<PilgrimageSite[]> {
    try {
      const q = query(collection(db, 'pilgrimage_sites'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PilgrimageSite));
    } catch (error) {
      console.error('Error fetching sites:', error);
      return [];
    }
  },

  async addSite(site: Omit<PilgrimageSite, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'pilgrimage_sites'), site);
    return docRef.id;
  },

  async updateSite(id: string, site: Partial<PilgrimageSite>): Promise<void> {
    const docRef = doc(db, 'pilgrimage_sites', id);
    await updateDoc(docRef, site);
  },

  async deleteSite(id: string): Promise<void> {
    const docRef = doc(db, 'pilgrimage_sites', id);
    await deleteDoc(docRef);
  },

  // Tours
  async getTours(): Promise<PilgrimageTour[]> {
    try {
      const q = query(collection(db, 'pilgrimage_tours'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PilgrimageTour));
    } catch (error) {
      console.error('Error fetching tours:', error);
      return [];
    }
  },

  async addTour(tour: Omit<PilgrimageTour, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'pilgrimage_tours'), tour);
    return docRef.id;
  },

  async updateTour(id: string, tour: Partial<PilgrimageTour>): Promise<void> {
    const docRef = doc(db, 'pilgrimage_tours', id);
    await updateDoc(docRef, tour);
  },

  async deleteTour(id: string): Promise<void> {
    const docRef = doc(db, 'pilgrimage_tours', id);
    await deleteDoc(docRef);
  },

  // Gallery
  async getGallery(): Promise<PilgrimageGalleryImage[]> {
    try {
      const q = query(collection(db, 'pilgrimage_gallery'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PilgrimageGalleryImage));
    } catch (error) {
      console.error('Error fetching gallery:', error);
      return [];
    }
  },

  async addGalleryImage(image: Omit<PilgrimageGalleryImage, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'pilgrimage_gallery'), image);
    return docRef.id;
  },

  async updateGalleryImage(id: string, image: Partial<PilgrimageGalleryImage>): Promise<void> {
    const docRef = doc(db, 'pilgrimage_gallery', id);
    await updateDoc(docRef, image);
  },

  async deleteGalleryImage(id: string): Promise<void> {
    const docRef = doc(db, 'pilgrimage_gallery', id);
    await deleteDoc(docRef);
  },

  // FAQs
  async getFAQs(): Promise<PilgrimageFAQ[]> {
    try {
      const q = query(collection(db, 'pilgrimage_faqs'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PilgrimageFAQ));
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      return [];
    }
  },

  async addFAQ(faq: Omit<PilgrimageFAQ, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'pilgrimage_faqs'), faq);
    return docRef.id;
  },

  async updateFAQ(id: string, faq: Partial<PilgrimageFAQ>): Promise<void> {
    const docRef = doc(db, 'pilgrimage_faqs', id);
    await updateDoc(docRef, faq);
  },

  async deleteFAQ(id: string): Promise<void> {
    const docRef = doc(db, 'pilgrimage_faqs', id);
    await deleteDoc(docRef);
  },

  // Guidelines
  async getGuidelines(): Promise<PilgrimageGuideline[]> {
    try {
      const q = query(collection(db, 'pilgrimage_guidelines'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PilgrimageGuideline));
    } catch (error) {
      console.error('Error fetching guidelines:', error);
      return [];
    }
  },

  async addGuideline(guideline: Omit<PilgrimageGuideline, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'pilgrimage_guidelines'), guideline);
    return docRef.id;
  },

  async updateGuideline(id: string, guideline: Partial<PilgrimageGuideline>): Promise<void> {
    const docRef = doc(db, 'pilgrimage_guidelines', id);
    await updateDoc(docRef, guideline);
  },

  async deleteGuideline(id: string): Promise<void> {
    const docRef = doc(db, 'pilgrimage_guidelines', id);
    await deleteDoc(docRef);
  },

  // Testimonials
  async getTestimonials(): Promise<PilgrimageTestimonial[]> {
    try {
      const snapshot = await getDocs(collection(db, 'pilgrimage_testimonials'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PilgrimageTestimonial));
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }
  },

  async addTestimonial(testimonial: Omit<PilgrimageTestimonial, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'pilgrimage_testimonials'), testimonial);
    return docRef.id;
  },

  async updateTestimonial(id: string, testimonial: Partial<PilgrimageTestimonial>): Promise<void> {
    const docRef = doc(db, 'pilgrimage_testimonials', id);
    await updateDoc(docRef, testimonial);
  },

  async deleteTestimonial(id: string): Promise<void> {
    const docRef = doc(db, 'pilgrimage_testimonials', id);
    await deleteDoc(docRef);
  },

  // Save all content
  async saveContent(content: PilgrimageAdminContent): Promise<void> {
    await Promise.all([
      this.saveHero(content.hero),
      this.saveIntro(content.intro),
      this.saveHighlights(content.highlights),
      this.saveCta(content.cta),
      this.saveBookingConfig(content.booking)
    ]);
  }
};
