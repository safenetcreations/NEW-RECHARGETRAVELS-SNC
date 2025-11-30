import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, addDoc, query, orderBy } from 'firebase/firestore';

// ==========================================
// TYPES
// ==========================================

export interface TreatmentLocation {
  name: string;
  area: string;
  rating: number;
}

export interface AyurvedaTreatment {
  id: string;
  name: string;
  sinhala: string;
  duration: string;
  price: number;
  image: string;
  description: string;
  fullDescription: string;
  benefits: string[];
  bestFor: string[];
  whatToExpect: string[];
  preparation: string[];
  locations: TreatmentLocation[];
  contraindications: string[];
  isActive: boolean;
  order: number;
}

export interface WellnessRetreat {
  id: string;
  name: string;
  duration: string;
  price: number;
  image: string;
  resort: string;
  location: string;
  rating: number;
  highlights: string[];
  description: string;
  fullDescription: string;
  includes: string[];
  isActive: boolean;
  order: number;
}

export interface AyurvedaTestimonial {
  id: string;
  name: string;
  title: string;
  image: string;
  quote: string;
  rating: number;
  program: string;
  isActive: boolean;
  order: number;
}

export interface AyurvedaResort {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  priceRange: string;
  specialty: string;
  features: string[];
  isActive: boolean;
  order: number;
}

export interface AyurvedaPageSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroSinhalaText: string;
  heroVideoUrl: string;
  heroImageUrl: string;
  philosophyTitle: string;
  philosophyDescription: string;
  treatmentsTitle: string;
  treatmentsSubtitle: string;
  retreatsTitle: string;
  retreatsSubtitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaBackgroundImage: string;
  whatsappNumber: string;
  phoneNumber: string;
}

// ==========================================
// DEFAULT DATA
// ==========================================

const defaultSettings: AyurvedaPageSettings = {
  heroTitle: 'Sri Lankan Ayurveda',
  heroSubtitle: 'Where ancient wisdom meets modern luxury',
  heroSinhalaText: 'ආයුර්වේද සුවය',
  heroVideoUrl: '',
  heroImageUrl: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1920&q=80',
  philosophyTitle: 'The Art of Healing',
  philosophyDescription: 'Ayurveda, the "Science of Life," originated in Sri Lanka over 5,000 years ago. Our island\'s unique biodiversity provides the finest medicinal herbs, while our master practitioners carry forward an unbroken lineage of healing wisdom.',
  treatmentsTitle: 'Ancient Healing Arts',
  treatmentsSubtitle: 'Signature Therapies',
  retreatsTitle: 'Luxury Wellness Retreats',
  retreatsSubtitle: 'Immersive Journeys',
  ctaTitle: 'Begin Your Journey',
  ctaSubtitle: 'Let our wellness consultants craft a bespoke Ayurveda experience tailored to your unique constitution',
  ctaBackgroundImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1920&q=80',
  whatsappNumber: '+94777721999',
  phoneNumber: '+94 777 721 999'
};

const defaultTreatments: Omit<AyurvedaTreatment, 'id'>[] = [
  { 
    name: 'Shirodhara', 
    sinhala: 'ශිරෝධාරා', 
    duration: '60 min', 
    price: 85, 
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80', 
    description: 'Warm medicated oil flows on your forehead in a rhythmic stream, inducing deep relaxation and mental clarity.',
    fullDescription: 'Shirodhara is one of the most divine Ayurvedic therapies. A continuous stream of warm, herb-infused oil is poured onto the forehead (the "third eye" area) in a specific oscillating pattern.',
    benefits: ['Deep mental relaxation', 'Improved sleep quality', 'Reduced anxiety & stress', 'Enhanced mental clarity', 'Balanced hormones'],
    bestFor: ['Insomnia & sleep disorders', 'Anxiety & depression', 'Chronic headaches', 'Mental fatigue', 'Hypertension'],
    whatToExpect: ['Gentle head & scalp massage (10 min)', 'Warm oil stream on forehead (30-40 min)', 'Post-treatment rest period (10 min)', 'Herbal tea & relaxation'],
    preparation: ['Avoid heavy meals 2 hours before', 'Wear comfortable loose clothing', 'Remove jewelry & contacts', 'Arrive 15 minutes early'],
    locations: [
      { name: 'Anantara Peace Haven', area: 'Tangalle', rating: 5.0 },
      { name: 'Santani Wellness Resort', area: 'Kandy', rating: 5.0 },
      { name: 'Siddhalepa Ayurveda', area: 'Wadduwa', rating: 4.9 }
    ],
    contraindications: ['Fever or cold', 'Recent head injury', 'Skin infections on forehead', 'Pregnancy (first trimester)'],
    isActive: true,
    order: 1
  },
  { 
    name: 'Abhyanga Massage', 
    sinhala: 'අභ්‍යංග', 
    duration: '75 min', 
    price: 95, 
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80', 
    description: 'Four-hand synchronized massage with warm herbal oils, promoting circulation and deep tissue healing.',
    fullDescription: 'Abhyanga is the cornerstone of Ayurvedic body therapies. Two therapists work in perfect synchronization, using warm medicated oils specifically selected for your dosha.',
    benefits: ['Improved blood circulation', 'Lymphatic detoxification', 'Joint flexibility', 'Skin nourishment', 'Muscle relaxation'],
    bestFor: ['Chronic fatigue', 'Muscle stiffness', 'Poor circulation', 'Dry skin conditions', 'Vata imbalance'],
    whatToExpect: ['Dosha consultation (5 min)', 'Four-hand synchronized massage (60 min)', 'Steam therapy option (10 min)', 'Herbal shower & rest'],
    preparation: ['Light meal 2-3 hours before', 'Stay hydrated', 'Inform about allergies', 'No alcohol 24 hours prior'],
    locations: [
      { name: 'Jetwing Ayurveda Pavilions', area: 'Negombo', rating: 4.9 },
      { name: 'Barberyn Beach Resort', area: 'Weligama', rating: 4.8 },
      { name: 'Heritance Ayurveda', area: 'Beruwala', rating: 4.8 }
    ],
    contraindications: ['Fever', 'Acute inflammation', 'Skin infections', 'Immediately after meals'],
    isActive: true,
    order: 2
  },
  { 
    name: 'Pizhichil Royal', 
    sinhala: 'පිළිචිල්', 
    duration: '90 min', 
    price: 150, 
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80', 
    description: 'The "King of Treatments" - warm oil bath with synchronized massage, reserved for royalty.',
    fullDescription: 'Pizhichil, meaning "squeezing," was historically reserved for Sri Lankan royalty and is considered the king of all Ayurvedic treatments.',
    benefits: ['Deep tissue rejuvenation', 'Nervous system healing', 'Anti-aging effects', 'Pain relief', 'Improved mobility'],
    bestFor: ['Arthritis & joint pain', 'Paralysis recovery', 'Neurological conditions', 'Chronic pain', 'Anti-aging'],
    whatToExpect: ['Consultation & oil selection (10 min)', 'Warm oil bath massage (70 min)', 'Rest with herbal wrap (10 min)', 'Shower & rejuvenation tea'],
    preparation: ['Fast for 3 hours before', 'Drink warm water', 'Mental preparation for luxury', 'Plan rest time after'],
    locations: [
      { name: 'Anantara Peace Haven', area: 'Tangalle', rating: 5.0 },
      { name: 'Santani Wellness Resort', area: 'Kandy', rating: 5.0 },
      { name: 'Fortress Resort & Spa', area: 'Galle', rating: 4.9 }
    ],
    contraindications: ['Fever', 'Indigestion', 'Diabetes (uncontrolled)', 'Obesity', 'During menstruation'],
    isActive: true,
    order: 3
  },
  { 
    name: 'Udvartana Detox', 
    sinhala: 'උද්වර්තන', 
    duration: '60 min', 
    price: 75, 
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80', 
    description: 'Invigorating herbal powder massage for weight loss and skin rejuvenation.',
    fullDescription: 'Udvartana is a unique dry powder massage using a blend of Ayurvedic herbs like Triphala, Kollu, and Mustard.',
    benefits: ['Weight reduction', 'Cellulite breakdown', 'Skin exfoliation', 'Improved metabolism', 'Toxin removal'],
    bestFor: ['Weight management', 'Cellulite', 'Kapha imbalance', 'Sluggish metabolism', 'Skin dullness'],
    whatToExpect: ['Body assessment (5 min)', 'Dry herbal powder massage (45 min)', 'Steam therapy (10 min)', 'Warm shower & hydration'],
    preparation: ['Light meal only', 'Exfoliate night before', 'Stay hydrated', 'Wear old undergarments'],
    locations: [
      { name: 'Siddhalepa Ayurveda', area: 'Wadduwa', rating: 4.9 },
      { name: 'Heritance Ayurveda', area: 'Beruwala', rating: 4.8 },
      { name: 'Barberyn Beach Resort', area: 'Weligama', rating: 4.8 }
    ],
    contraindications: ['Sensitive skin', 'Open wounds', 'Pregnancy', 'Severe weakness', 'High blood pressure'],
    isActive: true,
    order: 4
  },
  { 
    name: 'Nasya Therapy', 
    sinhala: 'නස්‍ය', 
    duration: '45 min', 
    price: 55, 
    image: 'https://images.unsplash.com/photo-1552693673-1bf958298935?w=800&q=80', 
    description: 'Nasal administration of herbal oils for mental clarity and sinus relief.',
    fullDescription: 'Nasya is one of the five Panchakarma therapies focusing on the head region.',
    benefits: ['Sinus cleansing', 'Mental clarity', 'Headache relief', 'Improved breathing', 'Better voice quality'],
    bestFor: ['Chronic sinusitis', 'Migraines', 'Mental fog', 'Hairfall', 'Facial paralysis'],
    whatToExpect: ['Face & neck massage (15 min)', 'Steam inhalation (5 min)', 'Nasal oil administration (10 min)', 'Rest & gargling (15 min)'],
    preparation: ['Empty stomach preferred', 'No smoking before', 'Clear nasal passages', 'Relax and breathe deeply'],
    locations: [
      { name: 'Jetwing Ayurveda Pavilions', area: 'Negombo', rating: 4.9 },
      { name: 'Siddhalepa Ayurveda', area: 'Wadduwa', rating: 4.9 },
      { name: 'Santani Wellness Resort', area: 'Kandy', rating: 5.0 }
    ],
    contraindications: ['Acute cold/flu', 'After meals', 'Pregnancy', 'Menstruation', 'Alcohol consumption'],
    isActive: true,
    order: 5
  },
  { 
    name: 'Elakizhi Poultice', 
    sinhala: 'එළකිළි', 
    duration: '75 min', 
    price: 110, 
    image: 'https://images.unsplash.com/photo-1591343395082-e120087004b4?w=800&q=80', 
    description: 'Warm herbal poultices applied rhythmically for joint pain and inflammation.',
    fullDescription: 'Elakizhi (Patra Pinda Sweda) uses boluses filled with medicinal leaves like Eranda, Nirgundi, and Drumstick.',
    benefits: ['Joint pain relief', 'Inflammation reduction', 'Improved mobility', 'Muscle relaxation', 'Detoxification'],
    bestFor: ['Arthritis', 'Sports injuries', 'Frozen shoulder', 'Back pain', 'Sciatica'],
    whatToExpect: ['Oil application (10 min)', 'Warm poultice massage (55 min)', 'Steam therapy optional (10 min)', 'Rest & herbal tea'],
    preparation: ['Light meal 2 hours before', 'Inform about pain areas', 'Wear comfortable clothing', 'Stay hydrated'],
    locations: [
      { name: 'Siddhalepa Ayurveda Hospital', area: 'Colombo', rating: 4.9 },
      { name: 'Barberyn Beach Resort', area: 'Weligama', rating: 4.8 },
      { name: 'Heritance Ayurveda', area: 'Beruwala', rating: 4.8 }
    ],
    contraindications: ['Fever', 'Open wounds', 'Severe inflammation', 'Skin infections', 'Fractures'],
    isActive: true,
    order: 6
  }
];

const defaultRetreats: Omit<WellnessRetreat, 'id'>[] = [
  { 
    name: 'Royal Panchakarma Retreat', 
    duration: '14 Nights', 
    price: 4500, 
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80', 
    resort: 'Anantara Peace Haven', 
    location: 'Tangalle', 
    rating: 5.0, 
    highlights: ['Complete 5-therapy detox', 'Private villa', 'Personal physician', 'Organic cuisine'], 
    description: 'The ultimate purification journey at a world-class beachfront sanctuary.',
    fullDescription: 'Experience the complete Panchakarma detoxification at one of Sri Lanka\'s most luxurious resorts.',
    includes: ['Daily Ayurvedic treatments', 'Consultation with physician', 'All meals included', 'Yoga sessions', 'Airport transfers', 'Luxury accommodation'],
    isActive: true,
    order: 1
  },
  { 
    name: 'Rasayana Anti-Aging Program', 
    duration: '21 Nights', 
    price: 6800, 
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80', 
    resort: 'Santani Wellness', 
    location: 'Kandy Hills', 
    rating: 5.0, 
    highlights: ['Longevity therapies', 'Mountain retreat', 'Infinity pool', 'Helipad access'], 
    description: 'Reverse aging with ancient Rasayana protocols in the misty highlands.',
    fullDescription: 'Our signature anti-aging program combines traditional Rasayana therapies with modern wellness practices.',
    includes: ['Rasayana treatments', 'Anti-aging facials', 'Detox program', 'Mountain yoga', 'Organic meals', 'Private suite'],
    isActive: true,
    order: 2
  },
  { 
    name: 'Executive Stress Escape', 
    duration: '7 Nights', 
    price: 2200, 
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80', 
    resort: 'Jetwing Ayurveda Pavilions', 
    location: 'Negombo', 
    rating: 4.9, 
    highlights: ['Daily Shirodhara', 'Sleep restoration', 'Yoga pavilion', 'Beach access'], 
    description: 'Reset your mind and body in private Ayurveda pavilions by the sea.',
    fullDescription: 'Designed for busy executives who need maximum relaxation in minimum time.',
    includes: ['Daily stress-relief treatments', 'Shirodhara sessions', 'Sleep therapy', 'Beach meditation', 'All meals', 'Private pavilion'],
    isActive: true,
    order: 3
  }
];

const defaultTestimonials: Omit<AyurvedaTestimonial, 'id'>[] = [
  { 
    name: 'Lady Sarah Windsor', 
    title: 'London, UK', 
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', 
    quote: 'The Panchakarma experience at Anantara was nothing short of transformative. I returned home feeling 10 years younger.', 
    rating: 5,
    program: 'Royal Panchakarma Retreat',
    isActive: true,
    order: 1
  },
  { 
    name: 'Dr. James Chen', 
    title: 'Singapore', 
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', 
    quote: 'As a physician, I was skeptical. After experiencing Shirodhara, I now recommend Sri Lankan Ayurveda to all my patients.', 
    rating: 5,
    program: 'Executive Stress Escape',
    isActive: true,
    order: 2
  },
  { 
    name: 'Isabella Rossi', 
    title: 'Milan, Italy', 
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', 
    quote: 'The attention to detail, the authenticity, the results - this is wellness at its finest. Simply extraordinary.', 
    rating: 5,
    program: 'Rasayana Anti-Aging',
    isActive: true,
    order: 3
  }
];

// ==========================================
// SERVICE FUNCTIONS
// ==========================================

// Collection names
const COLLECTIONS = {
  SETTINGS: 'ayurvedaPageSettings',
  TREATMENTS: 'ayurvedaTreatments',
  RETREATS: 'ayurvedaRetreats',
  TESTIMONIALS: 'ayurvedaTestimonials',
  RESORTS: 'ayurvedaResorts'
};

// ===== SETTINGS =====
export const getAyurvedaSettings = async (): Promise<AyurvedaPageSettings> => {
  try {
    const docRef = doc(db, 'cmsContent', COLLECTIONS.SETTINGS);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as AyurvedaPageSettings;
    }
    // Initialize with defaults if not exists
    await setDoc(docRef, defaultSettings);
    return defaultSettings;
  } catch (error) {
    console.error('Error fetching Ayurveda settings:', error);
    return defaultSettings;
  }
};

export const updateAyurvedaSettings = async (settings: Partial<AyurvedaPageSettings>): Promise<boolean> => {
  try {
    const docRef = doc(db, 'cmsContent', COLLECTIONS.SETTINGS);
    await updateDoc(docRef, settings);
    return true;
  } catch (error) {
    console.error('Error updating Ayurveda settings:', error);
    return false;
  }
};

// ===== TREATMENTS =====
export const getAyurvedaTreatments = async (): Promise<AyurvedaTreatment[]> => {
  try {
    const q = query(collection(db, COLLECTIONS.TREATMENTS), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      // Initialize with defaults
      await initializeDefaultTreatments();
      return defaultTreatments.map((t, i) => ({ ...t, id: `treatment-${i + 1}` }));
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AyurvedaTreatment));
  } catch (error) {
    console.error('Error fetching treatments:', error);
    return defaultTreatments.map((t, i) => ({ ...t, id: `treatment-${i + 1}` }));
  }
};

export const initializeDefaultTreatments = async (): Promise<void> => {
  try {
    for (const treatment of defaultTreatments) {
      await addDoc(collection(db, COLLECTIONS.TREATMENTS), treatment);
    }
  } catch (error) {
    console.error('Error initializing treatments:', error);
  }
};

export const addAyurvedaTreatment = async (treatment: Omit<AyurvedaTreatment, 'id'>): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.TREATMENTS), treatment);
    return docRef.id;
  } catch (error) {
    console.error('Error adding treatment:', error);
    return null;
  }
};

export const updateAyurvedaTreatment = async (id: string, treatment: Partial<AyurvedaTreatment>): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.TREATMENTS, id);
    await updateDoc(docRef, treatment);
    return true;
  } catch (error) {
    console.error('Error updating treatment:', error);
    return false;
  }
};

export const deleteAyurvedaTreatment = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.TREATMENTS, id));
    return true;
  } catch (error) {
    console.error('Error deleting treatment:', error);
    return false;
  }
};

// ===== RETREATS =====
export const getAyurvedaRetreats = async (): Promise<WellnessRetreat[]> => {
  try {
    const q = query(collection(db, COLLECTIONS.RETREATS), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      await initializeDefaultRetreats();
      return defaultRetreats.map((r, i) => ({ ...r, id: `retreat-${i + 1}` }));
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WellnessRetreat));
  } catch (error) {
    console.error('Error fetching retreats:', error);
    return defaultRetreats.map((r, i) => ({ ...r, id: `retreat-${i + 1}` }));
  }
};

export const initializeDefaultRetreats = async (): Promise<void> => {
  try {
    for (const retreat of defaultRetreats) {
      await addDoc(collection(db, COLLECTIONS.RETREATS), retreat);
    }
  } catch (error) {
    console.error('Error initializing retreats:', error);
  }
};

export const addAyurvedaRetreat = async (retreat: Omit<WellnessRetreat, 'id'>): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.RETREATS), retreat);
    return docRef.id;
  } catch (error) {
    console.error('Error adding retreat:', error);
    return null;
  }
};

export const updateAyurvedaRetreat = async (id: string, retreat: Partial<WellnessRetreat>): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.RETREATS, id);
    await updateDoc(docRef, retreat);
    return true;
  } catch (error) {
    console.error('Error updating retreat:', error);
    return false;
  }
};

export const deleteAyurvedaRetreat = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.RETREATS, id));
    return true;
  } catch (error) {
    console.error('Error deleting retreat:', error);
    return false;
  }
};

// ===== TESTIMONIALS =====
export const getAyurvedaTestimonials = async (): Promise<AyurvedaTestimonial[]> => {
  try {
    const q = query(collection(db, COLLECTIONS.TESTIMONIALS), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      await initializeDefaultTestimonials();
      return defaultTestimonials.map((t, i) => ({ ...t, id: `testimonial-${i + 1}` }));
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AyurvedaTestimonial));
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return defaultTestimonials.map((t, i) => ({ ...t, id: `testimonial-${i + 1}` }));
  }
};

export const initializeDefaultTestimonials = async (): Promise<void> => {
  try {
    for (const testimonial of defaultTestimonials) {
      await addDoc(collection(db, COLLECTIONS.TESTIMONIALS), testimonial);
    }
  } catch (error) {
    console.error('Error initializing testimonials:', error);
  }
};

export const addAyurvedaTestimonial = async (testimonial: Omit<AyurvedaTestimonial, 'id'>): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.TESTIMONIALS), testimonial);
    return docRef.id;
  } catch (error) {
    console.error('Error adding testimonial:', error);
    return null;
  }
};

export const updateAyurvedaTestimonial = async (id: string, testimonial: Partial<AyurvedaTestimonial>): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.TESTIMONIALS, id);
    await updateDoc(docRef, testimonial);
    return true;
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return false;
  }
};

export const deleteAyurvedaTestimonial = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.TESTIMONIALS, id));
    return true;
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return false;
  }
};

// ===== COMBINED DATA FETCH =====
export const getAllAyurvedaData = async () => {
  const [settings, treatments, retreats, testimonials] = await Promise.all([
    getAyurvedaSettings(),
    getAyurvedaTreatments(),
    getAyurvedaRetreats(),
    getAyurvedaTestimonials()
  ]);

  return {
    settings,
    treatments: treatments.filter(t => t.isActive),
    retreats: retreats.filter(r => r.isActive),
    testimonials: testimonials.filter(t => t.isActive)
  };
};

export default {
  getAyurvedaSettings,
  updateAyurvedaSettings,
  getAyurvedaTreatments,
  addAyurvedaTreatment,
  updateAyurvedaTreatment,
  deleteAyurvedaTreatment,
  getAyurvedaRetreats,
  addAyurvedaRetreat,
  updateAyurvedaRetreat,
  deleteAyurvedaRetreat,
  getAyurvedaTestimonials,
  addAyurvedaTestimonial,
  updateAyurvedaTestimonial,
  deleteAyurvedaTestimonial,
  getAllAyurvedaData
};
