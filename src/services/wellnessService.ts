import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, addDoc, query, orderBy } from 'firebase/firestore';

// ==========================================
// TYPES
// ==========================================

export interface WellnessPackage {
  id: string;
  name: string;
  tagline: string;
  duration: string;
  nights: number;
  price: number;
  originalPrice?: number;
  image: string;
  gallery: string[];
  resort: string;
  location: string;
  rating: number;
  reviews: number;
  category: 'spa' | 'detox' | 'mindfulness' | 'luxury' | 'retreat';
  highlights: string[];
  includes: string[];
  schedule: { day: string; activities: string[] }[];
  bestFor: string[];
  description: string;
  fullDescription: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
}

export interface SpaService {
  id: string;
  name: string;
  duration: string;
  price: number;
  image: string;
  category: 'massage' | 'facial' | 'body' | 'bath' | 'signature';
  description: string;
  benefits: string[];
  isActive: boolean;
  order: number;
}

export interface WellnessResort {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  priceRange: string;
  specialty: string;
  amenities: string[];
  isActive: boolean;
  order: number;
}

export interface WellnessTestimonial {
  id: string;
  name: string;
  country: string;
  image: string;
  quote: string;
  rating: number;
  package: string;
  isActive: boolean;
  order: number;
}

export interface WellnessPageSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroTagline: string;
  heroImageUrl: string;
  heroVideoUrl: string;
  introTitle: string;
  introDescription: string;
  packagesTitle: string;
  packagesSubtitle: string;
  servicesTitle: string;
  servicesSubtitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaBackgroundImage: string;
  whatsappNumber: string;
  phoneNumber: string;
}

// ==========================================
// DEFAULT DATA
// ==========================================

const defaultSettings: WellnessPageSettings = {
  heroTitle: 'Wellness & Spa Retreats',
  heroSubtitle: 'Rejuvenate your body, mind, and soul',
  heroTagline: 'Luxury Wellness Experiences',
  heroImageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&q=80',
  heroVideoUrl: '',
  introTitle: 'Your Sanctuary Awaits',
  introDescription: 'Escape to Sri Lanka\'s most exclusive wellness retreats. Our curated collection of spa packages combines world-class facilities with ancient healing traditions, set against breathtaking tropical landscapes.',
  packagesTitle: 'Wellness Packages',
  packagesSubtitle: 'Multi-Day Retreat Experiences',
  servicesTitle: 'Spa Services',
  servicesSubtitle: 'Individual Treatments',
  ctaTitle: 'Start Your Wellness Journey',
  ctaSubtitle: 'Let us design your perfect retreat experience',
  ctaBackgroundImage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1920&q=80',
  whatsappNumber: '+94777721999',
  phoneNumber: '+94 777 721 999'
};

const defaultPackages: Omit<WellnessPackage, 'id'>[] = [
  {
    name: 'Ultimate Spa Escape',
    tagline: 'Complete relaxation & rejuvenation',
    duration: '5 Days / 4 Nights',
    nights: 4,
    price: 1450,
    originalPrice: 1750,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80',
    gallery: [],
    resort: 'Anantara Peace Haven',
    location: 'Tangalle',
    rating: 4.9,
    reviews: 156,
    category: 'spa',
    highlights: ['Daily spa treatments', 'Beachfront resort', 'Private pool villa', 'All meals included'],
    includes: ['Airport transfers', '4 nights luxury accommodation', '2 spa treatments daily', 'All meals', 'Yoga sessions', 'Wellness consultation'],
    schedule: [
      { day: 'Day 1', activities: ['Airport pickup', 'Welcome drink & check-in', 'Resort orientation', 'Evening relaxation massage'] },
      { day: 'Day 2', activities: ['Sunrise yoga', 'Aromatherapy massage', 'Pool time', 'Evening facial treatment'] },
      { day: 'Day 3', activities: ['Morning meditation', 'Hot stone therapy', 'Beach walk', 'Body scrub & wrap'] },
      { day: 'Day 4', activities: ['Yoga session', 'Deep tissue massage', 'Spa time', 'Farewell dinner'] },
      { day: 'Day 5', activities: ['Breakfast', 'Check-out', 'Airport transfer'] }
    ],
    bestFor: ['Couples', 'Stress relief', 'First-time spa goers', 'Weekend getaway'],
    description: 'Indulge in pure relaxation with daily spa treatments at a stunning beachfront resort.',
    fullDescription: 'Escape to paradise with our Ultimate Spa Escape package. Set at the luxurious Anantara Peace Haven resort overlooking the Indian Ocean, this 5-day retreat is designed to melt away stress and restore your inner balance.',
    isActive: true,
    isFeatured: true,
    order: 1
  },
  {
    name: 'Detox & Renewal Program',
    tagline: 'Cleanse, purify & transform',
    duration: '7 Days / 6 Nights',
    nights: 6,
    price: 2200,
    originalPrice: 2600,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80',
    gallery: [],
    resort: 'Santani Wellness Resort',
    location: 'Kandy Hills',
    rating: 5.0,
    reviews: 203,
    category: 'detox',
    highlights: ['Full detox program', 'Mountain retreat', 'Organic meals', 'Infinity pool'],
    includes: ['Airport transfers', '6 nights accommodation', 'Daily detox treatments', 'Organic detox meals', 'Yoga & meditation', 'Nutrition consultation'],
    schedule: [
      { day: 'Day 1', activities: ['Arrival & consultation', 'Wellness assessment', 'Light detox dinner'] },
      { day: 'Day 2-3', activities: ['Morning yoga', 'Detox treatments', 'Juice fasting option', 'Evening meditation'] },
      { day: 'Day 4-5', activities: ['Continued treatments', 'Nature walks', 'Steam therapy', 'Relaxation time'] },
      { day: 'Day 6', activities: ['Final treatments', 'Nutrition planning', 'Celebration dinner'] },
      { day: 'Day 7', activities: ['Departure'] }
    ],
    bestFor: ['Health conscious', 'Weight management', 'Digital detox', 'New beginnings'],
    description: 'A comprehensive detox program in the serene mountains of Kandy.',
    fullDescription: 'Transform your health with our intensive Detox & Renewal Program at the award-winning Santani Wellness Resort. Nestled in the misty hills of Kandy, this 7-day journey combines scientific detox protocols with ancient wellness practices.',
    isActive: true,
    isFeatured: true,
    order: 2
  },
  {
    name: 'Mindfulness Meditation Retreat',
    tagline: 'Find inner peace & clarity',
    duration: '4 Days / 3 Nights',
    nights: 3,
    price: 890,
    originalPrice: 1050,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80',
    gallery: [],
    resort: 'Ulpotha Yoga Village',
    location: 'Kurunegala',
    rating: 4.8,
    reviews: 178,
    category: 'mindfulness',
    highlights: ['Silent retreat option', 'Buddhist teachings', 'Digital detox', 'Nature immersion'],
    includes: ['Transfers', '3 nights eco-lodge', 'Meditation sessions', 'Vegetarian meals', 'Temple visits', 'Yoga classes'],
    schedule: [
      { day: 'Day 1', activities: ['Arrival', 'Orientation', 'Introduction to meditation', 'Evening dharma talk'] },
      { day: 'Day 2', activities: ['Dawn meditation', 'Mindfulness training', 'Walking meditation', 'Evening session'] },
      { day: 'Day 3', activities: ['Silent morning', 'Temple visit', 'Closing ceremony', 'Integration session'] },
      { day: 'Day 4', activities: ['Final meditation', 'Departure'] }
    ],
    bestFor: ['Spiritual seekers', 'Stress relief', 'Mental clarity', 'Personal growth'],
    description: 'A transformative meditation retreat in an authentic village setting.',
    fullDescription: 'Disconnect from the noise of modern life and reconnect with your inner self at Ulpotha, a unique eco-village retreat. This 4-day mindfulness journey offers authentic meditation practices in a setting unchanged for centuries.',
    isActive: true,
    isFeatured: false,
    order: 3
  },
  {
    name: 'Luxury Couples Retreat',
    tagline: 'Romance & relaxation for two',
    duration: '3 Days / 2 Nights',
    nights: 2,
    price: 1680,
    originalPrice: 1980,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80',
    gallery: [],
    resort: 'Cape Weligama',
    location: 'Weligama',
    rating: 5.0,
    reviews: 142,
    category: 'luxury',
    highlights: ['Couples treatments', 'Private pool suite', 'Champagne dinner', 'Sunset cruise'],
    includes: ['Luxury transfers', '2 nights pool suite', 'Couples spa journey', 'Private dining', 'Sunset boat trip', 'Breakfast in bed'],
    schedule: [
      { day: 'Day 1', activities: ['VIP arrival', 'Champagne welcome', 'Couples massage', 'Candlelit dinner'] },
      { day: 'Day 2', activities: ['Breakfast in bed', 'Spa treatments', 'Sunset cruise', 'Private beach dinner'] },
      { day: 'Day 3', activities: ['Leisurely breakfast', 'Departure'] }
    ],
    bestFor: ['Honeymoons', 'Anniversaries', 'Romantic getaways', 'Special occasions'],
    description: 'An intimate luxury escape designed for couples.',
    fullDescription: 'Celebrate your love at the stunning Cape Weligama, perched on a cliff overlooking the Indian Ocean. This exclusive couples retreat combines world-class spa treatments with romantic experiences.',
    isActive: true,
    isFeatured: true,
    order: 4
  },
  {
    name: 'Yoga & Wellness Immersion',
    tagline: 'Deepen your practice',
    duration: '6 Days / 5 Nights',
    nights: 5,
    price: 1350,
    originalPrice: 1550,
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&q=80',
    gallery: [],
    resort: 'Jetwing Ayurveda Pavilions',
    location: 'Negombo',
    rating: 4.9,
    reviews: 167,
    category: 'retreat',
    highlights: ['Daily yoga classes', 'Pranayama training', 'Spa treatments', 'Beach yoga'],
    includes: ['Transfers', '5 nights private pavilion', '2 yoga sessions daily', 'Healthy meals', 'Spa treatments', 'Beach access'],
    schedule: [
      { day: 'Day 1', activities: ['Arrival', 'Yoga assessment', 'Evening restorative class'] },
      { day: 'Day 2-4', activities: ['Sunrise yoga', 'Pranayama', 'Afternoon spa', 'Sunset meditation'] },
      { day: 'Day 5', activities: ['Advanced practice', 'Beach yoga', 'Farewell ceremony'] },
      { day: 'Day 6', activities: ['Final class', 'Departure'] }
    ],
    bestFor: ['Yoga enthusiasts', 'Fitness lovers', 'Wellness seekers', 'Solo travelers'],
    description: 'An intensive yoga retreat with spa treatments by the sea.',
    fullDescription: 'Take your yoga practice to the next level with this immersive 6-day retreat at Jetwing Ayurveda Pavilions. With twice-daily yoga sessions, spa treatments, and healthy cuisine, you\'ll leave feeling transformed.',
    isActive: true,
    isFeatured: false,
    order: 5
  },
  {
    name: 'Weight Loss & Fitness Bootcamp',
    tagline: 'Transform your body',
    duration: '14 Days / 13 Nights',
    nights: 13,
    price: 3800,
    originalPrice: 4500,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80',
    gallery: [],
    resort: 'Heritance Ayurveda',
    location: 'Beruwala',
    rating: 4.8,
    reviews: 89,
    category: 'detox',
    highlights: ['Personal trainer', 'Customized diet', 'Body treatments', 'Fitness tracking'],
    includes: ['All transfers', '13 nights stay', 'Daily fitness sessions', 'Weight loss treatments', 'Calorie-controlled meals', 'Progress monitoring'],
    schedule: [
      { day: 'Day 1', activities: ['Health assessment', 'Body analysis', 'Program planning'] },
      { day: 'Day 2-13', activities: ['Morning workout', 'Fitness activities', 'Spa treatments', 'Evening yoga'] },
      { day: 'Day 14', activities: ['Final assessment', 'Maintenance plan', 'Departure'] }
    ],
    bestFor: ['Weight loss goals', 'Fitness transformation', 'Health reset', 'Active vacationers'],
    description: 'Intensive fitness and weight loss program with lasting results.',
    fullDescription: 'Achieve your fitness goals with our comprehensive 2-week bootcamp at Heritance Ayurveda. Combining cardio, strength training, spa treatments, and a customized diet plan, you\'ll see real results.',
    isActive: true,
    isFeatured: false,
    order: 6
  }
];

const defaultServices: Omit<SpaService, 'id'>[] = [
  { name: 'Swedish Relaxation Massage', duration: '60 min', price: 75, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80', category: 'massage', description: 'Classic Swedish massage techniques for total relaxation.', benefits: ['Stress relief', 'Muscle relaxation', 'Improved circulation'], isActive: true, order: 1 },
  { name: 'Deep Tissue Therapy', duration: '75 min', price: 95, image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80', category: 'massage', description: 'Intensive massage targeting deep muscle layers.', benefits: ['Pain relief', 'Tension release', 'Recovery'], isActive: true, order: 2 },
  { name: 'Hot Stone Massage', duration: '90 min', price: 120, image: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=800&q=80', category: 'massage', description: 'Heated volcanic stones combined with massage.', benefits: ['Deep warmth', 'Muscle relaxation', 'Energy balance'], isActive: true, order: 3 },
  { name: 'Tropical Fruit Facial', duration: '60 min', price: 85, image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80', category: 'facial', description: 'Fresh tropical fruits for radiant skin.', benefits: ['Glowing skin', 'Hydration', 'Anti-aging'], isActive: true, order: 4 },
  { name: 'Body Scrub & Wrap', duration: '90 min', price: 110, image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80', category: 'body', description: 'Exfoliation followed by nourishing body wrap.', benefits: ['Soft skin', 'Detox', 'Nourishment'], isActive: true, order: 5 },
  { name: 'Flower Bath Ritual', duration: '45 min', price: 65, image: 'https://images.unsplash.com/photo-1552693673-1bf958298935?w=800&q=80', category: 'bath', description: 'Romantic bath with fresh tropical flowers.', benefits: ['Relaxation', 'Skin softening', 'Aromatherapy'], isActive: true, order: 6 },
];

const defaultTestimonials: Omit<WellnessTestimonial, 'id'>[] = [
  { name: 'Emma Thompson', country: 'Australia', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', quote: 'The Ultimate Spa Escape was exactly what I needed. The treatments were world-class and the setting was absolutely stunning.', rating: 5, package: 'Ultimate Spa Escape', isActive: true, order: 1 },
  { name: 'Marcus Weber', country: 'Germany', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', quote: 'I lost 5kg during the Detox program and feel incredible. The team at Santani really knows what they\'re doing.', rating: 5, package: 'Detox & Renewal', isActive: true, order: 2 },
  { name: 'Sophie Laurent', country: 'France', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', quote: 'Our couples retreat was pure magic. Every detail was perfect. We\'re already planning to return for our anniversary.', rating: 5, package: 'Luxury Couples Retreat', isActive: true, order: 3 }
];

// ==========================================
// SERVICE FUNCTIONS
// ==========================================

const COLLECTIONS = {
  SETTINGS: 'wellnessPageSettings',
  PACKAGES: 'wellnessPackages',
  SERVICES: 'wellnessSpaServices',
  RESORTS: 'wellnessResorts',
  TESTIMONIALS: 'wellnessTestimonials'
};

// ===== SETTINGS =====
export const getWellnessSettings = async (): Promise<WellnessPageSettings> => {
  try {
    const docRef = doc(db, 'cmsContent', COLLECTIONS.SETTINGS);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as WellnessPageSettings;
    }
    await setDoc(docRef, defaultSettings);
    return defaultSettings;
  } catch (error) {
    console.error('Error fetching wellness settings:', error);
    return defaultSettings;
  }
};

export const updateWellnessSettings = async (settings: Partial<WellnessPageSettings>): Promise<boolean> => {
  try {
    const docRef = doc(db, 'cmsContent', COLLECTIONS.SETTINGS);
    await updateDoc(docRef, settings);
    return true;
  } catch (error) {
    console.error('Error updating wellness settings:', error);
    return false;
  }
};

// ===== PACKAGES =====
export const getWellnessPackages = async (): Promise<WellnessPackage[]> => {
  try {
    const q = query(collection(db, COLLECTIONS.PACKAGES), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      await initializeDefaultPackages();
      return defaultPackages.map((p, i) => ({ ...p, id: `pkg-${i + 1}` }));
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WellnessPackage));
  } catch (error) {
    console.error('Error fetching packages:', error);
    return defaultPackages.map((p, i) => ({ ...p, id: `pkg-${i + 1}` }));
  }
};

export const initializeDefaultPackages = async (): Promise<void> => {
  for (const pkg of defaultPackages) {
    await addDoc(collection(db, COLLECTIONS.PACKAGES), pkg);
  }
};

export const addWellnessPackage = async (pkg: Omit<WellnessPackage, 'id'>): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.PACKAGES), pkg);
    return docRef.id;
  } catch (error) {
    console.error('Error adding package:', error);
    return null;
  }
};

export const updateWellnessPackage = async (id: string, pkg: Partial<WellnessPackage>): Promise<boolean> => {
  try {
    await updateDoc(doc(db, COLLECTIONS.PACKAGES, id), pkg);
    return true;
  } catch (error) {
    console.error('Error updating package:', error);
    return false;
  }
};

export const deleteWellnessPackage = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.PACKAGES, id));
    return true;
  } catch (error) {
    console.error('Error deleting package:', error);
    return false;
  }
};

// ===== SPA SERVICES =====
export const getSpaServices = async (): Promise<SpaService[]> => {
  try {
    const q = query(collection(db, COLLECTIONS.SERVICES), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      await initializeDefaultServices();
      return defaultServices.map((s, i) => ({ ...s, id: `svc-${i + 1}` }));
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SpaService));
  } catch (error) {
    console.error('Error fetching services:', error);
    return defaultServices.map((s, i) => ({ ...s, id: `svc-${i + 1}` }));
  }
};

export const initializeDefaultServices = async (): Promise<void> => {
  for (const svc of defaultServices) {
    await addDoc(collection(db, COLLECTIONS.SERVICES), svc);
  }
};

export const addSpaService = async (service: Omit<SpaService, 'id'>): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.SERVICES), service);
    return docRef.id;
  } catch (error) {
    console.error('Error adding service:', error);
    return null;
  }
};

export const updateSpaService = async (id: string, service: Partial<SpaService>): Promise<boolean> => {
  try {
    await updateDoc(doc(db, COLLECTIONS.SERVICES, id), service);
    return true;
  } catch (error) {
    console.error('Error updating service:', error);
    return false;
  }
};

export const deleteSpaService = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.SERVICES, id));
    return true;
  } catch (error) {
    console.error('Error deleting service:', error);
    return false;
  }
};

// ===== TESTIMONIALS =====
export const getWellnessTestimonials = async (): Promise<WellnessTestimonial[]> => {
  try {
    const q = query(collection(db, COLLECTIONS.TESTIMONIALS), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      await initializeDefaultTestimonials();
      return defaultTestimonials.map((t, i) => ({ ...t, id: `test-${i + 1}` }));
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WellnessTestimonial));
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return defaultTestimonials.map((t, i) => ({ ...t, id: `test-${i + 1}` }));
  }
};

export const initializeDefaultTestimonials = async (): Promise<void> => {
  for (const testimonial of defaultTestimonials) {
    await addDoc(collection(db, COLLECTIONS.TESTIMONIALS), testimonial);
  }
};

export const addWellnessTestimonial = async (testimonial: Omit<WellnessTestimonial, 'id'>): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.TESTIMONIALS), testimonial);
    return docRef.id;
  } catch (error) {
    console.error('Error adding testimonial:', error);
    return null;
  }
};

export const updateWellnessTestimonial = async (id: string, testimonial: Partial<WellnessTestimonial>): Promise<boolean> => {
  try {
    await updateDoc(doc(db, COLLECTIONS.TESTIMONIALS, id), testimonial);
    return true;
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return false;
  }
};

export const deleteWellnessTestimonial = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.TESTIMONIALS, id));
    return true;
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return false;
  }
};

// ===== COMBINED DATA FETCH =====
export const getAllWellnessData = async () => {
  const [settings, packages, services, testimonials] = await Promise.all([
    getWellnessSettings(),
    getWellnessPackages(),
    getSpaServices(),
    getWellnessTestimonials()
  ]);

  return {
    settings,
    packages: packages.filter(p => p.isActive),
    services: services.filter(s => s.isActive),
    testimonials: testimonials.filter(t => t.isActive)
  };
};

export default {
  getWellnessSettings,
  updateWellnessSettings,
  getWellnessPackages,
  addWellnessPackage,
  updateWellnessPackage,
  deleteWellnessPackage,
  getSpaServices,
  addSpaService,
  updateSpaService,
  deleteSpaService,
  getWellnessTestimonials,
  addWellnessTestimonial,
  updateWellnessTestimonial,
  deleteWellnessTestimonial,
  getAllWellnessData
};
