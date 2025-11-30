import { db } from '@/lib/firebase';
import { collection, doc, getDoc, setDoc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

// ===== Types =====

export interface AyurvedaHeroContent {
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
}

export interface AyurvedaPhilosophyContent {
  label: string;
  title: string;
  description: string;
  pillars: string[];
}

export interface AyurvedaCtaContent {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
}

export interface AyurvedaRetreat {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  image: string;
  highlights: string[];
  includes: string[];
  excludes: string[];
  isActive: boolean;
  order: number;
  location: string;
  maxGuests: number;
  difficulty: string;
  bestFor: string[];
}

export interface AyurvedaTreatment {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  image: string;
  benefits: string[];
  isActive: boolean;
  order: number;
  category: string;
}

export interface AyurvedaTestimonial {
  id: string;
  name: string;
  country: string;
  comment: string;
  rating: number;
  image: string;
  retreatName: string;
  isActive: boolean;
}

export interface AyurvedaBookingConfig {
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

export interface AyurvedaAdminContent {
  hero: AyurvedaHeroContent;
  philosophy: AyurvedaPhilosophyContent;
  cta: AyurvedaCtaContent;
  booking: AyurvedaBookingConfig;
  retreats: AyurvedaRetreat[];
  treatments: AyurvedaTreatment[];
  testimonials: AyurvedaTestimonial[];
}

// ===== Default Content =====

export const defaultAyurvedaHero: AyurvedaHeroContent = {
  title: 'Ayurveda & Wellness Retreats',
  subtitle: 'Discover ancient healing traditions in the heart of Sri Lanka',
  backgroundImage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=2000&q=80',
  ctaText: 'Explore Retreats',
  ctaLink: '#retreats'
};

export const defaultAyurvedaPhilosophy: AyurvedaPhilosophyContent = {
  label: 'The Ancient Wisdom',
  title: 'The Art of Healing & Renewal',
  description: "Ayurveda, the 5,000-year-old science of life, offers a holistic approach to wellness that harmonizes body, mind, and spirit. Our carefully curated retreats combine authentic treatments with luxurious accommodations in Sri Lanka's most serene settings.",
  pillars: ['Balance', 'Harmony', 'Renewal']
};

export const defaultAyurvedaCta: AyurvedaCtaContent = {
  title: 'Begin Your Wellness Journey',
  subtitle: 'Let our experts craft a personalized retreat experience just for you',
  buttonText: 'Contact Us',
  buttonLink: '/contact',
  backgroundImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2000&q=80'
};

export const defaultAyurvedaBooking: AyurvedaBookingConfig = {
  depositPercent: 30,
  depositNote: '30% deposit required to confirm your booking',
  cancellationPolicy: 'Free cancellation up to 48 hours before the retreat start date. 50% refund for cancellations made within 48 hours.',
  whatsapp: '+94771234567',
  email: 'wellness@rechargetravels.com',
  phone: '+94771234567',
  responseTime: 'We respond within 2 hours',
  pickupLocations: [
    'Colombo - Bandaranaike International Airport',
    'Colombo City Hotels',
    'Kandy City Hotels',
    'Galle City Hotels',
    'Negombo Hotels',
    'Custom Location'
  ],
  paymentMethods: ['Credit Card', 'PayPal', 'Bank Transfer', 'Pay on Arrival']
};

export const defaultAyurvedaAdminContent: AyurvedaAdminContent = {
  hero: defaultAyurvedaHero,
  philosophy: defaultAyurvedaPhilosophy,
  cta: defaultAyurvedaCta,
  booking: defaultAyurvedaBooking,
  retreats: [],
  treatments: [],
  testimonials: []
};

// ===== Admin Service =====

export const ayurvedaAdminService = {
  // Get all content
  async getContent(): Promise<AyurvedaAdminContent> {
    try {
      const [hero, philosophy, cta, booking, retreats, treatments, testimonials] = await Promise.all([
        this.getHero(),
        this.getPhilosophy(),
        this.getCta(),
        this.getBookingConfig(),
        this.getRetreats(),
        this.getTreatments(),
        this.getTestimonials()
      ]);

      return {
        hero: hero || defaultAyurvedaHero,
        philosophy: philosophy || defaultAyurvedaPhilosophy,
        cta: cta || defaultAyurvedaCta,
        booking: booking || defaultAyurvedaBooking,
        retreats,
        treatments,
        testimonials
      };
    } catch (error) {
      console.error('Error fetching Ayurveda content:', error);
      return defaultAyurvedaAdminContent;
    }
  },

  // Hero
  async getHero(): Promise<AyurvedaHeroContent | null> {
    try {
      const docRef = doc(db, 'ayurveda_content', 'hero');
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? (docSnap.data() as AyurvedaHeroContent) : null;
    } catch (error) {
      console.error('Error fetching hero:', error);
      return null;
    }
  },

  async saveHero(hero: AyurvedaHeroContent): Promise<void> {
    const docRef = doc(db, 'ayurveda_content', 'hero');
    await setDoc(docRef, hero);
  },

  // Philosophy
  async getPhilosophy(): Promise<AyurvedaPhilosophyContent | null> {
    try {
      const docRef = doc(db, 'ayurveda_content', 'philosophy');
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? (docSnap.data() as AyurvedaPhilosophyContent) : null;
    } catch (error) {
      console.error('Error fetching philosophy:', error);
      return null;
    }
  },

  async savePhilosophy(philosophy: AyurvedaPhilosophyContent): Promise<void> {
    const docRef = doc(db, 'ayurveda_content', 'philosophy');
    await setDoc(docRef, philosophy);
  },

  // CTA
  async getCta(): Promise<AyurvedaCtaContent | null> {
    try {
      const docRef = doc(db, 'ayurveda_content', 'cta');
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? (docSnap.data() as AyurvedaCtaContent) : null;
    } catch (error) {
      console.error('Error fetching CTA:', error);
      return null;
    }
  },

  async saveCta(cta: AyurvedaCtaContent): Promise<void> {
    const docRef = doc(db, 'ayurveda_content', 'cta');
    await setDoc(docRef, cta);
  },

  // Booking Config
  async getBookingConfig(): Promise<AyurvedaBookingConfig | null> {
    try {
      const docRef = doc(db, 'ayurveda_content', 'booking');
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? (docSnap.data() as AyurvedaBookingConfig) : null;
    } catch (error) {
      console.error('Error fetching booking config:', error);
      return null;
    }
  },

  async saveBookingConfig(booking: AyurvedaBookingConfig): Promise<void> {
    const docRef = doc(db, 'ayurveda_content', 'booking');
    await setDoc(docRef, booking);
  },

  // Retreats
  async getRetreats(): Promise<AyurvedaRetreat[]> {
    try {
      const q = query(collection(db, 'ayurveda_retreats'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AyurvedaRetreat));
    } catch (error) {
      console.error('Error fetching retreats:', error);
      return [];
    }
  },

  async addRetreat(retreat: Omit<AyurvedaRetreat, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'ayurveda_retreats'), retreat);
    return docRef.id;
  },

  async updateRetreat(id: string, retreat: Partial<AyurvedaRetreat>): Promise<void> {
    const docRef = doc(db, 'ayurveda_retreats', id);
    await updateDoc(docRef, retreat);
  },

  async deleteRetreat(id: string): Promise<void> {
    const docRef = doc(db, 'ayurveda_retreats', id);
    await deleteDoc(docRef);
  },

  // Treatments
  async getTreatments(): Promise<AyurvedaTreatment[]> {
    try {
      const q = query(collection(db, 'ayurveda_treatments'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AyurvedaTreatment));
    } catch (error) {
      console.error('Error fetching treatments:', error);
      return [];
    }
  },

  async addTreatment(treatment: Omit<AyurvedaTreatment, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'ayurveda_treatments'), treatment);
    return docRef.id;
  },

  async updateTreatment(id: string, treatment: Partial<AyurvedaTreatment>): Promise<void> {
    const docRef = doc(db, 'ayurveda_treatments', id);
    await updateDoc(docRef, treatment);
  },

  async deleteTreatment(id: string): Promise<void> {
    const docRef = doc(db, 'ayurveda_treatments', id);
    await deleteDoc(docRef);
  },

  // Testimonials
  async getTestimonials(): Promise<AyurvedaTestimonial[]> {
    try {
      const snapshot = await getDocs(collection(db, 'ayurveda_testimonials'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AyurvedaTestimonial));
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }
  },

  async addTestimonial(testimonial: Omit<AyurvedaTestimonial, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'ayurveda_testimonials'), testimonial);
    return docRef.id;
  },

  async updateTestimonial(id: string, testimonial: Partial<AyurvedaTestimonial>): Promise<void> {
    const docRef = doc(db, 'ayurveda_testimonials', id);
    await updateDoc(docRef, testimonial);
  },

  async deleteTestimonial(id: string): Promise<void> {
    const docRef = doc(db, 'ayurveda_testimonials', id);
    await deleteDoc(docRef);
  },

  // Save all content
  async saveContent(content: AyurvedaAdminContent): Promise<void> {
    await Promise.all([
      this.saveHero(content.hero),
      this.savePhilosophy(content.philosophy),
      this.saveCta(content.cta),
      this.saveBookingConfig(content.booking)
    ]);
  }
};
