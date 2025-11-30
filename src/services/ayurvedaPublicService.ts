import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, where, orderBy } from 'firebase/firestore';

export interface HeroContent {
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
}

export interface PhilosophyContent {
  label: string;
  title: string;
  description: string;
  pillars: string[];
}

export interface CtaContent {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
}

export interface Retreat {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  image: string;
  highlights: string[];
  isActive: boolean;
  order: number;
}

export interface Treatment {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  image: string;
  benefits: string[];
  isActive: boolean;
  order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  country: string;
  comment: string;
  rating: number;
  image: string;
  retreatName: string;
  isActive: boolean;
}

// Get Hero Content
export const getHeroContent = async (): Promise<HeroContent | null> => {
  try {
    const docRef = doc(db, 'ayurveda_content', 'hero');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as HeroContent;
    }
    return null;
  } catch (error) {
    console.error('Error fetching hero content:', error);
    return null;
  }
};

// Get Philosophy Content
export const getPhilosophyContent = async (): Promise<PhilosophyContent | null> => {
  try {
    const docRef = doc(db, 'ayurveda_content', 'philosophy');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as PhilosophyContent;
    }
    return null;
  } catch (error) {
    console.error('Error fetching philosophy content:', error);
    return null;
  }
};

// Get CTA Content
export const getCtaContent = async (): Promise<CtaContent | null> => {
  try {
    const docRef = doc(db, 'ayurveda_content', 'cta');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as CtaContent;
    }
    return null;
  } catch (error) {
    console.error('Error fetching CTA content:', error);
    return null;
  }
};

// Get Active Retreats
export const getRetreats = async (): Promise<Retreat[]> => {
  try {
    // Try compound query first (requires index)
    const q = query(
      collection(db, 'ayurveda_retreats'),
      where('isActive', '==', true),
      orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(q);
    console.log('✅ Retreats fetched:', querySnapshot.docs.length);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Retreat[];
  } catch (error: any) {
    console.error('Error fetching retreats with compound query:', error);
    // Fallback: fetch all and filter/sort in memory (works without index)
    try {
      console.log('⚠️ Falling back to simple query for retreats...');
      const simpleQuery = await getDocs(collection(db, 'ayurveda_retreats'));
      const retreats = simpleQuery.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Retreat))
        .filter(r => r.isActive)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      console.log('✅ Retreats fetched (fallback):', retreats.length);
      return retreats;
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      return [];
    }
  }
};

// Get Active Treatments
export const getTreatments = async (): Promise<Treatment[]> => {
  try {
    // Try compound query first (requires index)
    const q = query(
      collection(db, 'ayurveda_treatments'),
      where('isActive', '==', true),
      orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(q);
    console.log('✅ Treatments fetched:', querySnapshot.docs.length);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Treatment[];
  } catch (error: any) {
    console.error('Error fetching treatments with compound query:', error);
    // Fallback: fetch all and filter/sort in memory (works without index)
    try {
      console.log('⚠️ Falling back to simple query for treatments...');
      const simpleQuery = await getDocs(collection(db, 'ayurveda_treatments'));
      const treatments = simpleQuery.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Treatment))
        .filter(t => t.isActive)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      console.log('✅ Treatments fetched (fallback):', treatments.length);
      return treatments;
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      return [];
    }
  }
};

// Get Active Testimonials
export const getTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const q = query(
      collection(db, 'ayurveda_testimonials'),
      where('isActive', '==', true)
    );
    const querySnapshot = await getDocs(q);
    console.log('✅ Testimonials fetched:', querySnapshot.docs.length);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Testimonial[];
  } catch (error: any) {
    console.error('Error fetching testimonials:', error);
    // Fallback: fetch all and filter in memory
    try {
      console.log('⚠️ Falling back to simple query for testimonials...');
      const simpleQuery = await getDocs(collection(db, 'ayurveda_testimonials'));
      const testimonials = simpleQuery.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Testimonial))
        .filter(t => t.isActive);
      console.log('✅ Testimonials fetched (fallback):', testimonials.length);
      return testimonials;
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      return [];
    }
  }
};

// Get All Ayurveda Page Data
export const getAyurvedaPageData = async () => {
  console.log('🔄 Loading Ayurveda page data...');
  const [hero, philosophy, cta, retreats, treatments, testimonials] = await Promise.all([
    getHeroContent(),
    getPhilosophyContent(),
    getCtaContent(),
    getRetreats(),
    getTreatments(),
    getTestimonials()
  ]);

  console.log('📊 Ayurveda data loaded:', {
    hero: !!hero,
    philosophy: !!philosophy,
    cta: !!cta,
    retreatsCount: retreats.length,
    treatmentsCount: treatments.length,
    testimonialsCount: testimonials.length
  });

  return {
    hero,
    philosophy,
    cta,
    retreats,
    treatments,
    testimonials
  };
};
