import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION_NAME = 'pageContent';
const DOC_ID = 'jungle-camping';

// Interfaces
export interface HeroImage {
  id: string;
  url: string;
  caption: string;
  tag?: string;
}

export interface Stat {
  id: string;
  iconName: string;
  label: string;
  value: string;
}

export interface OverviewHighlight {
  id: string;
  label: string;
  description: string;
}

export interface CampingPackage {
  id: string;
  name: string;
  duration: string;
  priceLabel: string;
  summary: string;
  highlights: string[];
  included: string[];
  iconName: string;
  difficulty: string;
  image: string;
  startLocation: string;
  transportNote: string;
}

export interface WildlifeSpotting {
  id: string;
  animal: string;
  bestTime: string;
  frequency: 'Very Common' | 'Common' | 'Regular' | 'Occasional' | 'Rare';
  description: string;
}

export interface CampingEssentialCategory {
  id: string;
  category: string;
  iconName: string;
  items: string[];
}

export interface LogisticsInfo {
  meetingPoint: string;
  stayLength: string;
  startWindows: string[];
  transferNote: string;
  baseCampDescription: string;
  amenities: string[];
  packingList: string[];
  weatherNote: string;
}

export interface BookingInfo {
  conciergeNote: string;
  contactPhone: string;
  whatsapp: string;
  email: string;
  responseTime: string;
  depositNote: string;
  priceIncludes: string[];
}

export interface PricingInfo {
  currency: string;
  startingPrice: number;
  teenDiscountPercent: number;
  privateCampSurcharge: string;
  addOns: string[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
}

export interface JungleCampingPageContent {
  hero: {
    title: string;
    subtitle: string;
    badge: string;
    ctaText: string;
    images: HeroImage[];
  };
  overview: {
    title: string;
    description: string;
    highlights: OverviewHighlight[];
  };
  stats: Stat[];
  campingPackages: CampingPackage[];
  wildlifeSpottings: WildlifeSpotting[];
  campingEssentials: CampingEssentialCategory[];
  logistics: LogisticsInfo;
  booking: BookingInfo;
  pricing: PricingInfo;
  faqs: FAQ[];
  gallery: GalleryImage[];
  cta: {
    title: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
  };
  contact: {
    phone: string;
    phoneNote: string;
    email: string;
    emailNote: string;
    website: string;
    websiteNote: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
  updatedAt?: any;
}

// Default content
const defaultContent: JungleCampingPageContent = {
  hero: {
    title: 'Jungle Camping Concierge',
    subtitle: 'Luxury canvas tents, private naturalists, and leopard-tracking safaris across Yala, Udawalawe, and Wasgamuwa.',
    badge: 'Wilderness Concierge',
    ctaText: 'Reserve jungle camp',
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920&h=1080&fit=crop', caption: 'Sunrise brews above leopard country', tag: 'Dawn brews' },
      { id: '2', url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=1920&h=1080&fit=crop', caption: 'Canvas suites on the river bend', tag: 'Riverside glamps' },
      { id: '3', url: 'https://images.unsplash.com/photo-1533873984035-25970ab07461?w=1920&h=1080&fit=crop', caption: 'Night drives with thermal scopes', tag: 'Night safari' },
      { id: '4', url: 'https://images.unsplash.com/photo-1517823382935-51bfcb0ec6bc?w=1920&h=1080&fit=crop', caption: 'Firelit slow dining', tag: 'Campfire dinners' }
    ]
  },
  overview: {
    title: 'Design your own jungle base',
    description: 'Recharge Travels builds private camps beside waterholes, ridge lines, and elephant corridors. Chef-curated menus, hot showers, and star labs keep it elevated while veteran trackers read the forest around you.',
    highlights: [
      { id: 'h1', label: 'Canvas suites', description: 'Memory-foam beds, ensuite showers, Dyson fans, and portable AC for the lowlands.' },
      { id: 'h2', label: 'Safari cadence', description: 'Dawn and dusk drives, mid-day hide sessions, and astronomy walks after dinner.' },
      { id: 'h3', label: 'Conservation-first', description: 'Leave-no-trace camps, park fees funded, local tracker partnerships, and carbon offsets.' }
    ]
  },
  stats: [
    { id: '1', iconName: 'Mountain', label: 'National parks unlocked', value: '5' },
    { id: '2', iconName: 'Leaf', label: 'Endemic species spotted', value: '34+' },
    { id: '3', iconName: 'Star', label: 'Starlit dinners served', value: '1,200+' },
    { id: '4', iconName: 'Shield', label: 'Incident-free record', value: '100%' }
  ],
  campingPackages: [
    {
      id: '1',
      name: 'Leopard Trackers Camp',
      duration: '2 days · Yala Block 1',
      priceLabel: 'USD 420 per guest',
      summary: 'Focus on leopard behavior with telemetry support, photographic jeeps, and private naturalists.',
      highlights: ['Two golden-hour drives', 'Telemetry-supported tracking', 'Hide sessions near waterholes'],
      included: ['Luxury canvas suite', 'Gourmet Sri Lankan dinners', 'Unlimited beverages', 'Private safari jeep', 'Dedicated ranger'],
      iconName: 'Tent',
      difficulty: 'Easy',
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&h=1000&fit=crop',
      startLocation: 'Tissamaharama / Yala Gate pickup',
      transportNote: 'Private transfers from Colombo, Galle, or the South Coast can be added with chauffeur SUVs.'
    },
    {
      id: '2',
      name: 'Elephant River Camp',
      duration: '3 days · Udawalawe',
      priceLabel: 'USD 360 per guest',
      summary: 'Camp along the Walawe River with kayak safaris, baby elephant nursery access, and thermal scopes at night.',
      highlights: ['Kayak safaris at dusk', 'Elephant transit home visit', 'Thermal night walks'],
      included: ['Family safari tent', 'Solar-powered showers', 'Naturalist + host duo', 'River kayaking gear', 'All park dues'],
      iconName: 'Compass',
      difficulty: 'Family friendly',
      image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1600&h=1000&fit=crop',
      startLocation: 'Udawalawe town rendezvous',
      transportNote: 'Round-trip transfers from Galle / Colombo or the Tea Country available at cost.'
    },
    {
      id: '3',
      name: 'Rainforest Glamping Retreat',
      duration: '2 days · Sinharaja buffer zone',
      priceLabel: 'USD 480 per guest',
      summary: 'Mossy cloud forest immersion with private guides, herbal steam therapy, and birding masterclasses.',
      highlights: ['Waterfall plunge pools', 'Ayurvedic steam therapy', 'Endemic bird safaris'],
      included: ['Glass-fronted forest suite', 'On-site herbalist & chef', 'Birding scopes + checklists', 'Guided night walks', 'All meals + snacks'],
      iconName: 'Crown',
      difficulty: 'Moderate',
      image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1600&h=1000&fit=crop',
      startLocation: 'Deniyaya or Galle hotel pickup',
      transportNote: '4x4 upgrade advised for final approach; arranged upon request.'
    }
  ],
  wildlifeSpottings: [
    { id: '1', animal: 'Sri Lankan Leopard', bestTime: 'Dawn & Dusk', frequency: 'Regular', description: 'Telemetry support plus veteran drivers boost strike rates in Blocks 1, 5, and Kumana corridors.' },
    { id: '2', animal: 'Sloth Bear', bestTime: 'May – August', frequency: 'Occasional', description: 'Fruit-heavy evenings around Palu trees make sightings likely on specific moons.' },
    { id: '3', animal: 'Asian Elephant mega herds', bestTime: 'Year round', frequency: 'Very Common', description: 'Udawalawe herds loom near lagoons and evenings at the Walawe River mouth.' },
    { id: '4', animal: 'Junglefowl & hornbills', bestTime: 'Morning', frequency: 'Very Common', description: 'Sinharaja guides use bird-calls and thermal scopes to reveal canopy dwellers.' }
  ],
  campingEssentials: [
    {
      id: '1',
      category: 'What to pack',
      iconName: 'Backpack',
      items: ['Neutral layers + light down jacket', 'Wide-brim hat / buff', 'Camera with zoom lens', 'Reusable water bottle', 'Quick-dry swimwear', 'Personal meds + epi pens']
    },
    {
      id: '2',
      category: 'We provide',
      iconName: 'Package',
      items: ['Canvas suites & mosquito nets', 'Hot bucket showers', 'Portable power banks', 'Field library + scopes', 'Turn-down service', 'Farm-to-table menus']
    },
    {
      id: '3',
      category: 'Safety net',
      iconName: 'Shield',
      items: ['24/7 ranger + tracker team', 'Satellite comms & VHF', 'Emergency medevac plan', 'Wildlife-safe perimeters', 'Night watch rotations', 'Insurance coverage']
    }
  ],
  logistics: {
    meetingPoint: 'Private chauffeur pickup from Colombo, South Coast, or Tea Country (or meet at park gates).',
    stayLength: '2 nights recommended for leopard & sloth bear probability curves.',
    startWindows: ['Sunrise departures 4:30 – 6:00 AM', 'Golden hour drives 3:00 – 6:30 PM', 'Night walks 8:30 – 10:00 PM'],
    transferNote: 'Executive SUVs, seaplanes, or helicopter drops can be bundled into the concierge quote.',
    baseCampDescription: 'Each camp has a dining marquee, library lounge, solar-powered lighting, and a field kitchen run by resort chefs.',
    amenities: ['Hot showers & vanity station', 'Espresso + juice bar', 'Campfire degustation seating', 'Stargazing deck with telescope'],
    packingList: ['Soft duffel (no wheels)', 'Light rain jacket', 'Binoculars (10x42)', 'Insect balm / reef-safe sunscreen', 'Travel journal'],
    weatherNote: 'Dry season (May–Sept) is golden for sightings; Dec–March brings lush forests and moody light.'
  },
  booking: {
    conciergeNote: 'Tell us your wildlife wishlist, dietary cues, and travel window — we confirm licenses, trackers, and chefs in under 30 minutes.',
    contactPhone: '+94 77 772 1999',
    whatsapp: 'https://wa.me/94777721999',
    email: 'concierge@rechargetravels.com',
    responseTime: 'Replies within 15 minutes · 06:00 – 22:00 (GMT+5:30)',
    depositNote: '30% deposit to lock trackers, jeeps, and kitchen crew. Balance only once you arrive in camp.',
    priceIncludes: ['Private safari jeep & driver', 'Dedicated naturalist', 'All gourmet meals + beverages', 'Park permits & taxes']
  },
  pricing: {
    currency: 'USD',
    startingPrice: 360,
    teenDiscountPercent: 30,
    privateCampSurcharge: 'Add USD 150 per night to privatize the jeep, tent, and service crew.',
    addOns: ['Helicopter or seaplane arrival', 'Night-vision & astro rigs', 'On-site wildlife photographer', 'Spa therapists & mixologists']
  },
  faqs: [
    { id: '1', question: 'How remote are the camps?', answer: 'Camps sit inside buffer zones or private river bends with dedicated guards. You are 10–20 minutes from the park gate yet surrounded solely by jungle noise.' },
    { id: '2', question: 'Can families join?', answer: 'Yes. Family suites include twin tents connected via deck, board games, junior ranger kits, and early meals.' },
    { id: '3', question: 'Is there mobile coverage?', answer: 'We rely on satellite comms and Starlink backup. Mobile coverage appears intermittently near park edges.' },
    { id: '4', question: 'What if it rains heavily?', answer: 'Dining pavilions, raised walkways, and waterproof tents keep you dry. We reschedule drives or run hide sessions until weather clears.' }
  ],
  gallery: [
    { id: '1', url: 'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?w=900&h=700&fit=crop', alt: 'Safari breakfast setup' },
    { id: '2', url: 'https://images.unsplash.com/photo-1496523720220-b62e33cf3161?w=900&h=700&fit=crop', alt: 'Leopard on jeep track' },
    { id: '3', url: 'https://images.unsplash.com/photo-1501824877893-19ec8d6e7a39?w=900&h=700&fit=crop', alt: 'Canvas suite interior' },
    { id: '4', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&h=700&fit=crop', alt: 'Camp dining marquee' }
  ],
  cta: {
    title: 'Ready to trade walls for wilderness?',
    description: 'Share your dates and we curate a private basecamp with chefs, trackers, and chauffeurs dialed in.',
    primaryButtonText: 'Plan jungle stay',
    secondaryButtonText: 'WhatsApp concierge'
  },
  contact: {
    phone: '+94 77 772 1999',
    phoneNote: 'WhatsApp & voice · 06:00 – 22:00',
    email: 'concierge@rechargetravels.com',
    emailNote: 'Average reply under 15 mins',
    website: 'www.rechargetravels.com',
    websiteNote: 'Browse more experiences'
  },
  seo: {
    title: 'Jungle Camping Sri Lanka | Private Safari Camps & Glamping | Recharge Travels',
    description: 'Book luxury jungle camping across Yala, Udawalawe, and Sinharaja. Private naturalists, chef-led dining, and concierge transfers.',
    keywords: ['jungle camping Sri Lanka', 'Yala glamping', 'private safari camp', 'Udawalawe camping', 'luxury tent Sri Lanka'],
    ogImage: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&h=630&fit=crop'
  }
};

// Service class
class JungleCampingPageService {
  async getPageContent(): Promise<JungleCampingPageContent> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as JungleCampingPageContent;
      } else {
        // Initialize with default content if doesn't exist
        await this.updatePageContent(defaultContent);
        return defaultContent;
      }
    } catch (error) {
      console.error('Error fetching jungle camping page content:', error);
      return defaultContent;
    }
  }

  async updatePageContent(content: Partial<JungleCampingPageContent>): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      await setDoc(docRef, {
        ...content,
        updatedAt: serverTimestamp()
      }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating jungle camping page content:', error);
      return false;
    }
  }

  async resetToDefault(): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      await setDoc(docRef, {
        ...defaultContent,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error resetting jungle camping page content:', error);
      return false;
    }
  }

  getDefaultContent(): JungleCampingPageContent {
    return defaultContent;
  }
}

export const jungleCampingPageService = new JungleCampingPageService();
export default jungleCampingPageService;
