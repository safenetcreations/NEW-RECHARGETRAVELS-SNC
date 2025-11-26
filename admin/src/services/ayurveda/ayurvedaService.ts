import {
  getDocs,
  getDoc,
  collection,
  query,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/services/firebaseService';

// ==================== INTERFACES ====================

export interface AyurvedaStats {
  totalRetreats: number;
  totalTreatments: number;
  totalTestimonials: number;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  label: string;
  ctaText: string;
  backgroundImage: string;
  updatedAt?: any;
}

export interface PhilosophyContent {
  label: string;
  title: string;
  description: string;
  pillars: string[];
  updatedAt?: any;
}

export interface CtaContent {
  label: string;
  title: string;
  subtitle: string;
  primaryButton: string;
  secondaryButton: string;
  updatedAt?: any;
}

export interface SiteSettings {
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  social: {
    instagram: string;
    facebook: string;
    twitter: string;
    linkedin: string;
  };
  updatedAt?: any;
}

export interface Retreat {
  id?: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  price: number;
  image: string;
  order: number;
  isActive: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface Treatment {
  id?: string;
  name: string;
  icon: string;
  description: string;
  order: number;
  isActive: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface Testimonial {
  id?: string;
  author: string;
  location: string;
  quote: string;
  rating: number;
  isActive: boolean;
  createdAt?: any;
  updatedAt?: any;
}

// ==================== DASHBOARD STATS ====================

export async function getAyurvedaDashboardStats(): Promise<{ data: AyurvedaStats | null; error: any }> {
  try {
    const [retreatsSnap, treatmentsSnap, testimonialsSnap] = await Promise.all([
      getDocs(collection(db, 'ayurveda_retreats')),
      getDocs(collection(db, 'ayurveda_treatments')),
      getDocs(collection(db, 'ayurveda_testimonials'))
    ]);

    const stats: AyurvedaStats = {
      totalRetreats: retreatsSnap.size,
      totalTreatments: treatmentsSnap.size,
      totalTestimonials: testimonialsSnap.size
    };

    return { data: stats, error: null };
  } catch (error) {
    console.error('Error getting stats:', error);
    return { data: null, error };
  }
}

// ==================== HERO SECTION ====================

export async function getHeroContent(): Promise<{ data: HeroContent | null; error: any }> {
  try {
    const docRef = doc(db, 'ayurveda_content', 'hero');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { data: docSnap.data() as HeroContent, error: null };
    }
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateHeroContent(content: HeroContent): Promise<{ error: any }> {
  try {
    const docRef = doc(db, 'ayurveda_content', 'hero');
    await setDoc(docRef, {
      ...content,
      updatedAt: serverTimestamp()
    });
    return { error: null };
  } catch (error) {
    return { error };
  }
}

// ==================== PHILOSOPHY SECTION ====================

export async function getPhilosophyContent(): Promise<{ data: PhilosophyContent | null; error: any }> {
  try {
    const docRef = doc(db, 'ayurveda_content', 'philosophy');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { data: docSnap.data() as PhilosophyContent, error: null };
    }
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updatePhilosophyContent(content: PhilosophyContent): Promise<{ error: any }> {
  try {
    const docRef = doc(db, 'ayurveda_content', 'philosophy');
    await setDoc(docRef, {
      ...content,
      updatedAt: serverTimestamp()
    });
    return { error: null };
  } catch (error) {
    return { error };
  }
}

// ==================== CTA SECTION ====================

export async function getCtaContent(): Promise<{ data: CtaContent | null; error: any }> {
  try {
    const docRef = doc(db, 'ayurveda_content', 'cta');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { data: docSnap.data() as CtaContent, error: null };
    }
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateCtaContent(content: CtaContent): Promise<{ error: any }> {
  try {
    const docRef = doc(db, 'ayurveda_content', 'cta');
    await setDoc(docRef, {
      ...content,
      updatedAt: serverTimestamp()
    });
    return { error: null };
  } catch (error) {
    return { error };
  }
}

// ==================== SETTINGS ====================

export async function getSiteSettings(): Promise<{ data: SiteSettings | null; error: any }> {
  try {
    const docRef = doc(db, 'ayurveda_content', 'settings');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { data: docSnap.data() as SiteSettings, error: null };
    }
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateSiteSettings(settings: SiteSettings): Promise<{ error: any }> {
  try {
    const docRef = doc(db, 'ayurveda_content', 'settings');
    await setDoc(docRef, {
      ...settings,
      updatedAt: serverTimestamp()
    });
    return { error: null };
  } catch (error) {
    return { error };
  }
}

// ==================== RETREATS CRUD ====================

export async function getAllRetreats(): Promise<{ data: Retreat[] | null; error: any }> {
  try {
    const q = query(collection(db, 'ayurveda_retreats'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as Retreat[];
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getRetreatById(id: string): Promise<{ data: Retreat | null; error: any }> {
  try {
    const docSnap = await getDoc(doc(db, 'ayurveda_retreats', id));
    if (docSnap.exists()) {
      return { data: { id: docSnap.id, ...docSnap.data() } as Retreat, error: null };
    }
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createRetreat(retreat: Omit<Retreat, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ data: Retreat | null; error: any }> {
  try {
    const docRef = await addDoc(collection(db, 'ayurveda_retreats'), {
      ...retreat,
      isActive: retreat.isActive ?? true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const docSnap = await getDoc(docRef);
    return { data: { id: docSnap.id, ...docSnap.data() } as Retreat, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateRetreat(id: string, updates: Partial<Retreat>): Promise<{ data: Retreat | null; error: any }> {
  try {
    const docRef = doc(db, 'ayurveda_retreats', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });

    const docSnap = await getDoc(docRef);
    return { data: { id: docSnap.id, ...docSnap.data() } as Retreat, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteRetreat(id: string): Promise<{ error: any }> {
  try {
    await deleteDoc(doc(db, 'ayurveda_retreats', id));
    return { error: null };
  } catch (error) {
    return { error };
  }
}

// ==================== TREATMENTS CRUD ====================

export async function getAllTreatments(): Promise<{ data: Treatment[] | null; error: any }> {
  try {
    const q = query(collection(db, 'ayurveda_treatments'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as Treatment[];
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createTreatment(treatment: Omit<Treatment, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ data: Treatment | null; error: any }> {
  try {
    const docRef = await addDoc(collection(db, 'ayurveda_treatments'), {
      ...treatment,
      isActive: treatment.isActive ?? true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const docSnap = await getDoc(docRef);
    return { data: { id: docSnap.id, ...docSnap.data() } as Treatment, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateTreatment(id: string, updates: Partial<Treatment>): Promise<{ data: Treatment | null; error: any }> {
  try {
    const docRef = doc(db, 'ayurveda_treatments', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });

    const docSnap = await getDoc(docRef);
    return { data: { id: docSnap.id, ...docSnap.data() } as Treatment, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteTreatment(id: string): Promise<{ error: any }> {
  try {
    await deleteDoc(doc(db, 'ayurveda_treatments', id));
    return { error: null };
  } catch (error) {
    return { error };
  }
}

// ==================== TESTIMONIALS CRUD ====================

export async function getAllTestimonials(): Promise<{ data: Testimonial[] | null; error: any }> {
  try {
    const snapshot = await getDocs(collection(db, 'ayurveda_testimonials'));
    const data = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as Testimonial[];
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createTestimonial(testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ data: Testimonial | null; error: any }> {
  try {
    const docRef = await addDoc(collection(db, 'ayurveda_testimonials'), {
      ...testimonial,
      isActive: testimonial.isActive ?? true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const docSnap = await getDoc(docRef);
    return { data: { id: docSnap.id, ...docSnap.data() } as Testimonial, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<{ data: Testimonial | null; error: any }> {
  try {
    const docRef = doc(db, 'ayurveda_testimonials', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });

    const docSnap = await getDoc(docRef);
    return { data: { id: docSnap.id, ...docSnap.data() } as Testimonial, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteTestimonial(id: string): Promise<{ error: any }> {
  try {
    await deleteDoc(doc(db, 'ayurveda_testimonials', id));
    return { error: null };
  } catch (error) {
    return { error };
  }
}

// ==================== SEED DEFAULT DATA ====================

export async function seedDefaultData(): Promise<{ error: any }> {
  try {
    // Hero
    await setDoc(doc(db, 'ayurveda_content', 'hero'), {
      title: 'Ayurveda & Wellness',
      subtitle: 'Journey Within, Transform Forever',
      label: 'Recharge Travels Presents',
      ctaText: 'Explore Retreats',
      backgroundImage: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1920&q=80',
      updatedAt: serverTimestamp()
    });

    // Philosophy
    await setDoc(doc(db, 'ayurveda_content', 'philosophy'), {
      label: 'The Ancient Wisdom',
      title: 'The Art of Healing & Renewal',
      description: 'Rooted in 5,000 years of Indian wisdom, Ayurveda offers a profound path to holistic wellness. Our curated retreats blend ancient healing traditions with luxurious modern comfort, guiding you toward perfect balance of mind, body, and spirit.',
      pillars: ['Balance', 'Harmony', 'Renewal'],
      updatedAt: serverTimestamp()
    });

    // CTA
    await setDoc(doc(db, 'ayurveda_content', 'cta'), {
      label: 'Begin Your Journey',
      title: 'Transform Your Life',
      subtitle: 'Let us curate a personalized wellness journey that aligns with your unique needs and aspirations.',
      primaryButton: 'Schedule Consultation',
      secondaryButton: 'Download Brochure',
      updatedAt: serverTimestamp()
    });

    // Retreats
    const retreats = [
      { title: 'Panchakarma Detox', category: 'Detox & Purification', duration: '7-14 Days', price: 2500, description: 'The ultimate Ayurvedic cleanse. Five therapeutic treatments to eliminate toxins and restore your body\'s natural equilibrium.', image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&q=80', order: 1, isActive: true },
      { title: 'Yoga Immersion', category: 'Mind & Body', duration: '5-10 Days', price: 1800, description: 'Deepen your practice in serene surroundings. Daily yoga, meditation, and Ayurvedic nutrition for complete transformation.', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80', order: 2, isActive: true },
      { title: 'Meditation Sanctuary', category: 'Inner Peace', duration: '3-7 Days', price: 1200, description: 'Silence the noise within. Guided meditation, breathwork, and mindfulness practices in tranquil natural settings.', image: 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=600&q=80', order: 3, isActive: true },
      { title: 'Rasayana Rejuvenation', category: 'Anti-Aging', duration: '10-21 Days', price: 4000, description: 'The royal path to longevity. Ancient rejuvenation therapies that restore vitality and reverse the signs of aging.', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80', order: 4, isActive: true },
      { title: 'Couples Harmony', category: 'Together', duration: '7-14 Days', price: 3500, description: 'Reconnect with your partner through shared wellness experiences. Couples therapies, private yoga, and romantic dining.', image: 'https://images.unsplash.com/photo-1591343395082-e120087004b4?w=600&q=80', order: 5, isActive: true },
      { title: 'Signature Holistic', category: 'Ultimate Experience', duration: '14-28 Days', price: 6000, description: 'Our most comprehensive program. Full Ayurvedic assessment, personalized treatments, and lasting lifestyle transformation.', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80', order: 6, isActive: true }
    ];

    for (const retreat of retreats) {
      await addDoc(collection(db, 'ayurveda_retreats'), {
        ...retreat,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    // Treatments
    const treatments = [
      { name: 'Shirodhara', icon: 'droplets', description: 'Warm oil gently poured over the forehead to calm the mind and nervous system', order: 1, isActive: true },
      { name: 'Abhyanga', icon: 'hand', description: 'Full-body warm oil massage using synchronized strokes for deep relaxation', order: 2, isActive: true },
      { name: 'Udvartana', icon: 'sparkles', description: 'Herbal powder massage to exfoliate, detoxify, and tone the skin', order: 3, isActive: true },
      { name: 'Nasya', icon: 'wind', description: 'Nasal therapy to clear sinuses and enhance mental clarity', order: 4, isActive: true },
      { name: 'Basti', icon: 'flower-2', description: 'Gentle internal cleansing for digestive health and vitality', order: 5, isActive: true },
      { name: 'Swedana', icon: 'flame', description: 'Herbal steam therapy to open channels and release toxins', order: 6, isActive: true }
    ];

    for (const treatment of treatments) {
      await addDoc(collection(db, 'ayurveda_treatments'), {
        ...treatment,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    // Testimonial
    await addDoc(collection(db, 'ayurveda_testimonials'), {
      author: 'Sarah Mitchell',
      location: 'London, United Kingdom',
      quote: 'A transformative journey that reconnected me with myself. The attention to detail, the serene environment, and the profound healing I experienced exceeded all expectations.',
      rating: 5,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { error: null };
  } catch (error) {
    return { error };
  }
}
