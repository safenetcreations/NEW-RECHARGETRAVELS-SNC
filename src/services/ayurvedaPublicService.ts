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
    const q = query(
      collection(db, 'ayurveda_retreats'),
      where('isActive', '==', true),
      orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Retreat[];
  } catch (error) {
    console.error('Error fetching retreats:', error);
    return [];
  }
};

// Get Active Treatments
export const getTreatments = async (): Promise<Treatment[]> => {
  try {
    const q = query(
      collection(db, 'ayurveda_treatments'),
      where('isActive', '==', true),
      orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Treatment[];
  } catch (error) {
    console.error('Error fetching treatments:', error);
    return [];
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
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Testimonial[];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
};

// Get All Ayurveda Page Data
export const getAyurvedaPageData = async () => {
  const [hero, philosophy, cta, retreats, treatments, testimonials] = await Promise.all([
    getHeroContent(),
    getPhilosophyContent(),
    getCtaContent(),
    getRetreats(),
    getTreatments(),
    getTestimonials()
  ]);

  return {
    hero,
    philosophy,
    cta,
    retreats,
    treatments,
    testimonials
  };
};
