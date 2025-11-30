import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, addDoc, query, orderBy } from 'firebase/firestore';

// ==========================================
// TYPES
// ==========================================

export interface WeddingPackage {
  id: string;
  name: string;
  tagline: string;
  type: 'beach' | 'elephant' | 'cultural' | 'tea-country' | 'elopement' | 'luxury';
  priceFrom: number;
  guestsUpTo: number;
  image: string;
  gallery: string[];
  description: string;
  fullDescription: string;
  includes: string[];
  highlights: string[];
  venues: string[];
  addOns: string[];
  isActive: boolean;
  isFeatured: boolean;
  order: number;
}

export interface HoneymoonPackage {
  id: string;
  name: string;
  tagline: string;
  tier: 'budget' | 'signature' | 'luxury';
  priceFrom: number;
  nights: number;
  image: string;
  gallery: string[];
  description: string;
  fullDescription: string;
  highlights: string[];
  includes: string[];
  itinerary: { day: number; title: string; description: string }[];
  isActive: boolean;
  isFeatured: boolean;
  order: number;
}

export interface WeddingVenue {
  id: string;
  name: string;
  location: string;
  type: 'beach' | 'mountain' | 'cultural' | 'garden' | 'resort';
  image: string;
  capacity: string;
  priceRange: string;
  features: string[];
  isActive: boolean;
  order: number;
}

export interface RomanceTestimonial {
  id: string;
  names: string;
  country: string;
  image: string;
  quote: string;
  type: 'wedding' | 'honeymoon';
  package: string;
  rating: number;
  isActive: boolean;
  order: number;
}

export interface RomanceFAQ {
  id: string;
  question: string;
  answer: string;
  category: 'wedding' | 'honeymoon' | 'general';
  isActive: boolean;
  order: number;
}

export interface RomancePageSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  heroVideoUrl: string;
  weddingIntro: string;
  honeymoonIntro: string;
  whySriLankaTitle: string;
  whySriLankaPoints: string[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaBackgroundImage: string;
  whatsappNumber: string;
  phoneNumber: string;
  email: string;
}

// ==========================================
// DEFAULT DATA
// ==========================================

const defaultSettings: RomancePageSettings = {
  heroTitle: 'Sri Lankan Romance',
  heroSubtitle: 'Destination weddings & honeymoons crafted with love',
  heroImageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&q=80',
  heroVideoUrl: '',
  weddingIntro: 'From barefoot beach vows with elephant blessings to misty tea-country ceremonies with Kandyan drummers—we craft unforgettable, legally compliant destination weddings across Sri Lanka.',
  honeymoonIntro: 'Hand-curated romantic escapes through ancient kingdoms, misty highlands, pristine beaches, and luxurious hideaways—each moment designed for love.',
  whySriLankaTitle: 'Why Sri Lanka for Romance?',
  whySriLankaPoints: [
    'Year-round tropical weather with diverse landscapes',
    'Affordable luxury—world-class experiences at fraction of cost',
    'Rich cultural traditions for unique ceremony elements',
    'English widely spoken, easy visa process',
    'Combine wedding + honeymoon in one trip',
    'Ethical elephant experiences available'
  ],
  ctaTitle: 'Let\'s Create Your Love Story',
  ctaSubtitle: 'Our romance specialists will design your perfect Sri Lankan celebration',
  ctaBackgroundImage: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=1920&q=80',
  whatsappNumber: '+94777721999',
  phoneNumber: '+94 777 721 999',
  email: 'romance@rechargetravels.com'
};

const defaultWeddingPackages: Omit<WeddingPackage, 'id'>[] = [
  {
    name: 'Beach Paradise Wedding',
    tagline: 'Barefoot vows on golden sands',
    type: 'beach',
    priceFrom: 3999,
    guestsUpTo: 50,
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1200&q=80',
    gallery: [],
    description: 'Exchange vows with the Indian Ocean as your backdrop and tropical flowers adorning your path.',
    fullDescription: 'Picture this: golden sand beneath your feet, the gentle sound of waves, and a stunning sunset painting the sky as you say "I do." Our Beach Paradise Wedding brings your tropical dreams to life on Sri Lanka\'s most beautiful coastlines.',
    includes: ['Legal paperwork & registrar', 'Beach ceremony setup', 'Floral arch & aisle décor', 'Bouquet & boutonniere', 'Professional photographer (4 hrs)', 'Live Kandyan drummers', 'Reception dinner for 50', 'Wedding cake', 'Champagne toast'],
    highlights: ['Sunset ceremony timing', 'Private beach section', 'Traditional drummers', 'Tropical flower décor'],
    venues: ['Bentota', 'Mirissa', 'Unawatuna', 'Tangalle'],
    addOns: ['Fire dancers', 'Lantern release', 'Drone videography', 'Fireworks'],
    isActive: true,
    isFeatured: true,
    order: 1
  },
  {
    name: 'Elephant Blessing Ceremony',
    tagline: 'Majestic blessings for your union',
    type: 'elephant',
    priceFrom: 5999,
    guestsUpTo: 80,
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&q=80',
    gallery: [],
    description: 'Receive sacred blessings from a gentle elephant—an unforgettable, ethically-sourced Sri Lankan tradition.',
    fullDescription: 'Experience the magic of a traditional Sri Lankan wedding with an ethical elephant blessing. Our partnered sanctuaries ensure the elephants are well-cared-for while adding a truly unique element to your special day.',
    includes: ['Ethical elephant blessing ceremony', 'Traditional Poruwa ceremony platform', 'Kandyan dancers & drummers', 'Full legal arrangements', 'Professional photography (6 hrs)', 'Reception for 80 guests', 'Multi-course Sri Lankan feast', 'Traditional wedding attire rental'],
    highlights: ['Ethical sanctuary partnership', 'Traditional Sri Lankan ceremony', 'Kandyan cultural elements', 'Professional event coordination'],
    venues: ['Sigiriya resorts', 'Habarana', 'Dambulla', 'Kandy'],
    addOns: ['Horse carriage arrival', 'Traditional fire ceremony', 'Henna artist', 'Live band'],
    isActive: true,
    isFeatured: true,
    order: 2
  },
  {
    name: 'Tea Country Romance',
    tagline: 'Misty mountains & colonial elegance',
    type: 'tea-country',
    priceFrom: 4499,
    guestsUpTo: 40,
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80',
    gallery: [],
    description: 'Say your vows amidst rolling tea plantations and misty mountains in a colonial-era bungalow.',
    fullDescription: 'Escape to the cool highlands for an intimate wedding surrounded by emerald tea estates. Colonial bungalows, crisp mountain air, and breathtaking views create an atmosphere of timeless romance.',
    includes: ['Heritage bungalow venue', 'Garden ceremony setup', 'English afternoon tea reception', 'Professional photography (4 hrs)', 'Floral arrangements', 'Legal documentation', 'Dinner reception for 40', 'Accommodation for couple'],
    highlights: ['Scenic mountain views', 'Cool climate comfort', 'Colonial charm', 'Intimate setting'],
    venues: ['Nuwara Eliya', 'Ella', 'Hatton', 'Bandarawela'],
    addOns: ['Private train journey', 'Tea factory tour', 'Hot air balloon', 'Helicopter arrival'],
    isActive: true,
    isFeatured: false,
    order: 3
  },
  {
    name: 'Intimate Elopement',
    tagline: 'Just the two of you',
    type: 'elopement',
    priceFrom: 1499,
    guestsUpTo: 10,
    image: 'https://images.unsplash.com/photo-1522413452208-996ff3f3e740?w=1200&q=80',
    gallery: [],
    description: 'A simple, beautiful ceremony for couples who want to focus on each other.',
    fullDescription: 'Sometimes love is best celebrated intimately. Our elopement package provides everything you need for a beautiful, legally-binding ceremony without the stress of a large wedding.',
    includes: ['Legal paperwork & officiant', 'Beach or garden ceremony', 'Bouquet & boutonniere', 'Professional photographer (2 hrs)', 'Champagne for two', 'Romantic dinner'],
    highlights: ['Stress-free planning', 'Intimate atmosphere', 'Flexible locations', 'Quick legal process'],
    venues: ['Any beach', 'Galle Fort', 'Tea estates', 'Boutique resorts'],
    addOns: ['Sunset cruise', 'Spa day', 'Extended photography', 'Videography'],
    isActive: true,
    isFeatured: false,
    order: 4
  },
  {
    name: 'Grand Cultural Celebration',
    tagline: 'A royal Sri Lankan extravaganza',
    type: 'cultural',
    priceFrom: 12999,
    guestsUpTo: 200,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80',
    gallery: [],
    description: 'A multi-day celebration featuring traditional ceremonies, elephant processions, and fireworks.',
    fullDescription: 'Go all out with a grand Sri Lankan wedding celebration. Multiple events, traditional ceremonies, cultural performances, and luxury throughout create an unforgettable multi-day experience for you and your guests.',
    includes: ['Multi-day celebration', 'Mehendi night', 'Traditional Poruwa ceremony', 'Elephant procession', 'Kandyan attire for couple', 'Live band & DJ', 'Fireworks display', 'Full catering for 200', 'Dedicated wedding producer', '24/7 concierge'],
    highlights: ['Royal treatment', 'Multiple ceremonies', 'Cultural immersion', 'Luxury throughout'],
    venues: ['5-star resorts', 'Heritage hotels', 'Private estates'],
    addOns: ['Guest airport transfers', 'Welcome dinner', 'Farewell brunch', 'Guest excursions'],
    isActive: true,
    isFeatured: true,
    order: 5
  }
];

const defaultHoneymoonPackages: Omit<HoneymoonPackage, 'id'>[] = [
  {
    name: 'Budget Bliss',
    tagline: 'Romance without breaking the bank',
    tier: 'budget',
    priceFrom: 899,
    nights: 7,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80',
    gallery: [],
    description: 'Experience Sri Lanka\'s most romantic spots with boutique stays and unforgettable experiences.',
    fullDescription: 'Prove that romance doesn\'t need a massive budget. Our Budget Bliss honeymoon takes you through Sri Lanka\'s most romantic destinations with comfortable boutique stays and authentic experiences.',
    highlights: ['3-star boutique hotels', 'Private AC car & driver', 'Romantic dinner for two', 'Sigiriya + Kandy + South Coast'],
    includes: ['7 nights accommodation', 'Daily breakfast', 'Airport transfers', 'English-speaking driver-guide', 'Sigiriya entrance', 'Temple of the Tooth visit', 'Sunset beach dinner'],
    itinerary: [
      { day: 1, title: 'Arrival in Colombo', description: 'Airport pickup, transfer to Negombo beach hotel' },
      { day: 2, title: 'Sigiriya Adventure', description: 'Climb the Lion Rock, evening at leisure' },
      { day: 3, title: 'Kandy Discovery', description: 'Temple of the Tooth, cultural show' },
      { day: 4, title: 'Train to Ella', description: 'Scenic train journey through tea country' },
      { day: 5, title: 'South Coast Beach', description: 'Transfer to Mirissa, beach relaxation' },
      { day: 6, title: 'Galle Fort', description: 'Explore the historic fort, shopping' },
      { day: 7, title: 'Departure', description: 'Airport transfer' }
    ],
    isActive: true,
    isFeatured: false,
    order: 1
  },
  {
    name: 'Signature Romance',
    tagline: 'The perfect blend of luxury & adventure',
    tier: 'signature',
    priceFrom: 1899,
    nights: 10,
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80',
    gallery: [],
    description: 'Hot air balloons, private pool villas, scenic trains, and couples spa—the complete romantic Sri Lanka experience.',
    fullDescription: 'Our most popular honeymoon package combines adventure, culture, and relaxation. From floating over ancient ruins to relaxing in private pool villas, every day brings a new romantic experience.',
    highlights: ['4-5 star boutique hotels', 'Hot air balloon over Sigiriya', 'Private pool villa', 'Couples spa treatment', 'Sunset cruise'],
    includes: ['10 nights luxury accommodation', 'Half-board meals', 'Private hot air balloon flight', 'First-class train journey', 'Couples spa ritual', 'Sunset cruise', 'Private safari jeep', 'All entrance fees'],
    itinerary: [
      { day: 1, title: 'Arrival & Negombo', description: 'Welcome dinner at beach resort' },
      { day: 2, title: 'Cultural Triangle', description: 'Transfer to Sigiriya, evening at pool villa' },
      { day: 3, title: 'Hot Air Balloon', description: 'Sunrise balloon flight, champagne breakfast' },
      { day: 4, title: 'Kandy Heritage', description: 'Temple visit, cultural show, spa' },
      { day: 5, title: 'Scenic Train Journey', description: 'First-class train to Ella, tea tasting' },
      { day: 6, title: 'Ella Exploration', description: 'Nine Arch Bridge, waterfalls, hiking' },
      { day: 7, title: 'Yala Safari', description: 'Private jeep safari for leopards' },
      { day: 8, title: 'Beach Paradise', description: 'Transfer to Mirissa beach villa' },
      { day: 9, title: 'Sunset & Sea', description: 'Whale watching, sunset cruise' },
      { day: 10, title: 'Departure', description: 'Leisurely breakfast, airport transfer' }
    ],
    isActive: true,
    isFeatured: true,
    order: 2
  },
  {
    name: 'Ultra-Luxe Hideaways',
    tagline: 'No expense spared romance',
    tier: 'luxury',
    priceFrom: 4999,
    nights: 12,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
    gallery: [],
    description: 'Helicopter transfers, private chefs, exclusive villas, and once-in-a-lifetime experiences.',
    fullDescription: 'For couples who want the absolute best. Private helicopter transfers, exclusive villa stays, personal chefs, and experiences money usually can\'t buy. This is romance at its most luxurious.',
    highlights: ['5-star luxury lodges', 'Helicopter transfers', 'Private chef experiences', 'Exclusive wildlife safaris', '24/7 personal concierge'],
    includes: ['12 nights ultra-luxury accommodation', 'Full board with fine dining', 'Private helicopter transfer', 'Exclusive safari with naturalist', 'Chef\'s table wine pairing dinner', 'Private yacht charter', 'Spa journey for two', 'Personal butler service'],
    itinerary: [
      { day: 1, title: 'VIP Arrival', description: 'Helicopter to luxury beach resort' },
      { day: 2, title: 'Beach Bliss', description: 'Private beach day, sunset dinner on the sand' },
      { day: 3, title: 'Cultural Immersion', description: 'Helicopter to Sigiriya, private tour' },
      { day: 4, title: 'Balloon & Champagne', description: 'Private balloon, chef\'s dinner under stars' },
      { day: 5, title: 'Tea Country Estate', description: 'Private bungalow with butler' },
      { day: 6, title: 'Highland Romance', description: 'Private picnic, waterfall visit, spa' },
      { day: 7, title: 'Exclusive Safari', description: 'Private safari lodge, sundowner' },
      { day: 8, title: 'Wildlife & Luxury', description: 'Morning safari, afternoon at pool' },
      { day: 9, title: 'Coastal Villa', description: 'Transfer to exclusive beachfront villa' },
      { day: 10, title: 'Yacht Day', description: 'Private yacht charter, snorkeling' },
      { day: 11, title: 'Farewell Celebration', description: 'Couples spa, private beach dinner' },
      { day: 12, title: 'Departure', description: 'Helicopter to airport, VIP departure' }
    ],
    isActive: true,
    isFeatured: true,
    order: 3
  }
];

const defaultFAQs: Omit<RomanceFAQ, 'id'>[] = [
  { question: 'Can foreigners legally get married in Sri Lanka?', answer: 'Yes! We handle all legal requirements including affidavits, passport copies, birth certificates, and registrar coordination. Plan for approximately 4 working days for legal formalities.', category: 'wedding', isActive: true, order: 1 },
  { question: 'Is the elephant blessing ethical?', answer: 'We only partner with vetted sanctuaries that meet strict welfare standards. We never use chained or mistreated elephants. Alternatives include Kandyan drummers, vintage cars, or horse carriages.', category: 'wedding', isActive: true, order: 2 },
  { question: 'What\'s the best season for a beach wedding?', answer: 'November to April for south/west coast beaches. May to September for east coast (Trincomalee, Passikudah). Tea country is pleasant year-round with occasional rain.', category: 'wedding', isActive: true, order: 3 },
  { question: 'How far in advance should we book?', answer: 'For weddings, we recommend 9-12 months in advance to secure preferred venues and handle legalities. For honeymoons, 3-6 months is ideal, especially for peak season.', category: 'general', isActive: true, order: 4 },
  { question: 'Can we combine wedding and honeymoon in one trip?', answer: 'Absolutely! Many couples have their ceremony and immediately roll into a romantic honeymoon extension. We can seamlessly plan both.', category: 'general', isActive: true, order: 5 },
  { question: 'What\'s included in honeymoon packages?', answer: 'Typically: accommodation, private driver-guide, selected experiences (safaris, trains, etc.), breakfasts or half-board, and 24/7 concierge support. Everything is customizable.', category: 'honeymoon', isActive: true, order: 6 },
  { question: 'Can every detail be customized?', answer: 'Yes! Menus, décor colors, ceremonies, transport, guest activities—everything can be tailored to your vision. We\'re here to bring your dream to life.', category: 'general', isActive: true, order: 7 },
  { question: 'Do you help with guest accommodation?', answer: 'Yes, we can arrange group room blocks at discounted rates, coordinate guest transfers, and plan activities for your wedding party.', category: 'wedding', isActive: true, order: 8 },
  { question: 'What about dietary requirements?', answer: 'Our partner venues excel at accommodating all dietary needs—vegan, halal, kosher, gluten-free, and allergies. Just let us know in advance.', category: 'general', isActive: true, order: 9 },
  { question: 'Is destination wedding really cost-effective?', answer: 'Often yes! Smaller guest lists and Sri Lanka\'s favorable exchange rates mean many couples spend less than a hometown wedding while getting a more unique experience.', category: 'wedding', isActive: true, order: 10 }
];

const defaultTestimonials: Omit<RomanceTestimonial, 'id'>[] = [
  { names: 'Emma & Josh', country: 'United Kingdom', image: 'https://images.unsplash.com/photo-1522413452208-996ff3f3e740?w=400&q=80', quote: 'Our beach wedding with the elephant blessing was absolutely magical. Recharge handled every detail—legal paperwork, décor, the lot. We just showed up and said our vows!', type: 'wedding', package: 'Elephant Blessing Ceremony', rating: 5, isActive: true, order: 1 },
  { names: 'Sofia & Mark', country: 'Spain', image: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&q=80', quote: 'The hot air balloon over Sigiriya at sunrise, followed by champagne breakfast—it felt like a movie. Best honeymoon decision ever!', type: 'honeymoon', package: 'Signature Romance', rating: 5, isActive: true, order: 2 },
  { names: 'Priya & David', country: 'USA', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80', quote: 'We wanted an intimate elopement and they made it so easy. Just the two of us on a private beach in Tangalle with a beautiful ceremony.', type: 'wedding', package: 'Intimate Elopement', rating: 5, isActive: true, order: 3 }
];

// ==========================================
// SERVICE FUNCTIONS
// ==========================================

const COLLECTIONS = {
  SETTINGS: 'romancePageSettings',
  WEDDING_PACKAGES: 'romanceWeddingPackages',
  HONEYMOON_PACKAGES: 'romanceHoneymoonPackages',
  VENUES: 'romanceVenues',
  TESTIMONIALS: 'romanceTestimonials',
  FAQS: 'romanceFAQs'
};

// Settings
export const getRomanceSettings = async (): Promise<RomancePageSettings> => {
  try {
    const docRef = doc(db, 'cmsContent', COLLECTIONS.SETTINGS);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return docSnap.data() as RomancePageSettings;
    await setDoc(docRef, defaultSettings);
    return defaultSettings;
  } catch (error) { console.error('Error:', error); return defaultSettings; }
};

export const updateRomanceSettings = async (settings: Partial<RomancePageSettings>): Promise<boolean> => {
  try { await updateDoc(doc(db, 'cmsContent', COLLECTIONS.SETTINGS), settings); return true; } catch { return false; }
};

// Wedding Packages
export const getWeddingPackages = async (): Promise<WeddingPackage[]> => {
  try {
    const q = query(collection(db, COLLECTIONS.WEDDING_PACKAGES), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) { await initializeWeddingPackages(); return defaultWeddingPackages.map((p, i) => ({ ...p, id: `wp-${i}` })); }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WeddingPackage));
  } catch { return defaultWeddingPackages.map((p, i) => ({ ...p, id: `wp-${i}` })); }
};

const initializeWeddingPackages = async () => { for (const p of defaultWeddingPackages) await addDoc(collection(db, COLLECTIONS.WEDDING_PACKAGES), p); };

export const addWeddingPackage = async (pkg: Omit<WeddingPackage, 'id'>): Promise<string | null> => {
  try { return (await addDoc(collection(db, COLLECTIONS.WEDDING_PACKAGES), pkg)).id; } catch { return null; }
};

export const updateWeddingPackage = async (id: string, pkg: Partial<WeddingPackage>): Promise<boolean> => {
  try { await updateDoc(doc(db, COLLECTIONS.WEDDING_PACKAGES, id), pkg); return true; } catch { return false; }
};

export const deleteWeddingPackage = async (id: string): Promise<boolean> => {
  try { await deleteDoc(doc(db, COLLECTIONS.WEDDING_PACKAGES, id)); return true; } catch { return false; }
};

// Honeymoon Packages
export const getHoneymoonPackages = async (): Promise<HoneymoonPackage[]> => {
  try {
    const q = query(collection(db, COLLECTIONS.HONEYMOON_PACKAGES), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) { await initializeHoneymoonPackages(); return defaultHoneymoonPackages.map((p, i) => ({ ...p, id: `hp-${i}` })); }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HoneymoonPackage));
  } catch { return defaultHoneymoonPackages.map((p, i) => ({ ...p, id: `hp-${i}` })); }
};

const initializeHoneymoonPackages = async () => { for (const p of defaultHoneymoonPackages) await addDoc(collection(db, COLLECTIONS.HONEYMOON_PACKAGES), p); };

export const addHoneymoonPackage = async (pkg: Omit<HoneymoonPackage, 'id'>): Promise<string | null> => {
  try { return (await addDoc(collection(db, COLLECTIONS.HONEYMOON_PACKAGES), pkg)).id; } catch { return null; }
};

export const updateHoneymoonPackage = async (id: string, pkg: Partial<HoneymoonPackage>): Promise<boolean> => {
  try { await updateDoc(doc(db, COLLECTIONS.HONEYMOON_PACKAGES, id), pkg); return true; } catch { return false; }
};

export const deleteHoneymoonPackage = async (id: string): Promise<boolean> => {
  try { await deleteDoc(doc(db, COLLECTIONS.HONEYMOON_PACKAGES, id)); return true; } catch { return false; }
};

// FAQs
export const getRomanceFAQs = async (): Promise<RomanceFAQ[]> => {
  try {
    const q = query(collection(db, COLLECTIONS.FAQS), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) { await initializeFAQs(); return defaultFAQs.map((f, i) => ({ ...f, id: `faq-${i}` })); }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RomanceFAQ));
  } catch { return defaultFAQs.map((f, i) => ({ ...f, id: `faq-${i}` })); }
};

const initializeFAQs = async () => { for (const f of defaultFAQs) await addDoc(collection(db, COLLECTIONS.FAQS), f); };

export const addRomanceFAQ = async (faq: Omit<RomanceFAQ, 'id'>): Promise<string | null> => {
  try { return (await addDoc(collection(db, COLLECTIONS.FAQS), faq)).id; } catch { return null; }
};

export const updateRomanceFAQ = async (id: string, faq: Partial<RomanceFAQ>): Promise<boolean> => {
  try { await updateDoc(doc(db, COLLECTIONS.FAQS, id), faq); return true; } catch { return false; }
};

export const deleteRomanceFAQ = async (id: string): Promise<boolean> => {
  try { await deleteDoc(doc(db, COLLECTIONS.FAQS, id)); return true; } catch { return false; }
};

// Testimonials
export const getRomanceTestimonials = async (): Promise<RomanceTestimonial[]> => {
  try {
    const q = query(collection(db, COLLECTIONS.TESTIMONIALS), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) { await initializeTestimonials(); return defaultTestimonials.map((t, i) => ({ ...t, id: `rt-${i}` })); }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RomanceTestimonial));
  } catch { return defaultTestimonials.map((t, i) => ({ ...t, id: `rt-${i}` })); }
};

const initializeTestimonials = async () => { for (const t of defaultTestimonials) await addDoc(collection(db, COLLECTIONS.TESTIMONIALS), t); };

export const addRomanceTestimonial = async (t: Omit<RomanceTestimonial, 'id'>): Promise<string | null> => {
  try { return (await addDoc(collection(db, COLLECTIONS.TESTIMONIALS), t)).id; } catch { return null; }
};

export const updateRomanceTestimonial = async (id: string, t: Partial<RomanceTestimonial>): Promise<boolean> => {
  try { await updateDoc(doc(db, COLLECTIONS.TESTIMONIALS, id), t); return true; } catch { return false; }
};

export const deleteRomanceTestimonial = async (id: string): Promise<boolean> => {
  try { await deleteDoc(doc(db, COLLECTIONS.TESTIMONIALS, id)); return true; } catch { return false; }
};

// Combined fetch
export const getAllRomanceData = async () => {
  const [settings, weddingPackages, honeymoonPackages, faqs, testimonials] = await Promise.all([
    getRomanceSettings(), getWeddingPackages(), getHoneymoonPackages(), getRomanceFAQs(), getRomanceTestimonials()
  ]);
  return {
    settings,
    weddingPackages: weddingPackages.filter(p => p.isActive),
    honeymoonPackages: honeymoonPackages.filter(p => p.isActive),
    faqs: faqs.filter(f => f.isActive),
    testimonials: testimonials.filter(t => t.isActive)
  };
};

// ==========================================
// ROMANCE BOOKINGS
// ==========================================

export interface RomanceBooking {
  id?: string;
  bookingRef: string;
  type: 'wedding' | 'honeymoon';
  packageId: string;
  packageName: string;
  packagePrice: number;
  // Contact
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  // Details
  eventDate: string;
  guests: number;
  // Wedding specific
  weddingType?: string;
  venue?: string;
  // Honeymoon specific
  nights?: number;
  // Common
  specialRequests: string;
  addOns: string[];
  // Meta
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export const submitRomanceBooking = async (booking: Omit<RomanceBooking, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; bookingRef: string }> => {
  try {
    const bookingRef = `ROM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    const docRef = await addDoc(collection(db, 'romanceBookings'), {
      ...booking,
      bookingRef,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { success: true, bookingRef };
  } catch (error) {
    console.error('Error submitting booking:', error);
    return { success: false, bookingRef: '' };
  }
};

export const getRomanceBookings = async (): Promise<RomanceBooking[]> => {
  try {
    const q = query(collection(db, 'romanceBookings'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as RomanceBooking));
  } catch { return []; }
};

export const updateRomanceBookingStatus = async (id: string, status: RomanceBooking['status']): Promise<boolean> => {
  try { await updateDoc(doc(db, 'romanceBookings', id), { status, updatedAt: new Date() }); return true; } catch { return false; }
};
