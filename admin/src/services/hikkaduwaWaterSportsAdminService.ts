import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION = 'waterSportsBookingContent';
const DOC_ID = 'hikkaduwa';

export interface AdminWaterSportsHeroSlide {
  image: string;
  caption: string;
  tag?: string;
}

export interface AdminWaterSportsBadge {
  label: string;
  value: string;
  iconName: string;
}

export interface AdminWaterSportsHighlight {
  label: string;
  description: string;
}

export interface AdminWaterSportsExperience {
  id: string;
  name: string;
  summary: string;
  duration: string;
  priceLabel: string;
  level: string;
  includes: string[];
  iconName: string;
  image?: string;
}

export interface AdminWaterSportsCombo {
  id: string;
  name: string;
  badge: string;
  duration: string;
  priceLabel: string;
  highlights: string[];
  includes: string[];
  iconName: string;
}

export interface AdminWaterSportsLogistics {
  meetingPoint: string;
  sessionTimes: string[];
  baseLocation: string;
  transferNote: string;
  gearProvided: string[];
  bringList: string[];
  weatherPolicy: string;
  safetyNote: string;
}

export interface AdminWaterSportsBookingContent {
  hero: {
    title: string;
    subtitle: string;
    badge: string;
    gallery: AdminWaterSportsHeroSlide[];
  };
  overview: {
    summary: string;
    badges: AdminWaterSportsBadge[];
    highlights: AdminWaterSportsHighlight[];
  };
  experiences: AdminWaterSportsExperience[];
  combos: AdminWaterSportsCombo[];
  logistics: AdminWaterSportsLogistics;
  safety: string[];
  faqs: Array<{ id: string; question: string; answer: string }>;
  gallery: Array<{ id: string; image: string; caption: string }>;
  booking: {
    contactPhone: string;
    whatsapp: string;
    email: string;
    responseTime: string;
    conciergeNote: string;
  };
  pricing: {
    currency: string;
    startingPrice: number;
    depositNote: string;
    refundPolicy: string;
    extrasNote: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
}

export const defaultAdminWaterSportsContent: AdminWaterSportsBookingContent = {
  hero: {
    title: 'Hikkaduwa Water Sports Concierge',
    subtitle: "Surf, dive, and jet across Sri Lanka's most vibrant marine playground with pro hosts.",
    badge: 'Marine & Adventure Certified',
    gallery: [
      {
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2000&q=80',
        caption: 'Snorkel the marine sanctuary',
        tag: 'Snorkeling'
      },
      {
        image: 'https://images.unsplash.com/photo-1530870110042-98b2cb110834?auto=format&fit=crop&w=2000&q=80',
        caption: 'Pro surf coaching bays',
        tag: 'Surf coaching'
      }
    ]
  },
  overview: {
    summary:
      'We operate the only concierge-led water sports outfit in Hikkaduwa—pairing insured operators, boutique hospitality, and marine biologist briefings for every booking.',
    badges: [
      { label: 'Activities', value: '15+', iconName: 'Activity' },
      { label: 'Crew', value: 'ISA & PADI', iconName: 'Shield' }
    ],
    highlights: [
      {
        label: 'Concierge thread',
        description: 'Single WhatsApp host manages weather holds, transport, and add-ons.'
      }
    ]
  },
  experiences: [
    {
      id: 'surf-lessons',
      name: 'Signature Surf Coaching',
      summary: 'Private or duo lessons with ISA-certified instructors and drone analysis.',
      duration: '120 mins',
      priceLabel: 'USD 45 per guest',
      level: 'All Levels',
      includes: ['Surftech board', 'Rash guard + zinc', 'Drone clip & analysis', 'Hydration + fruit cooler'],
      iconName: 'Waves'
    }
  ],
  combos: [
    {
      id: 'ultimate-day',
      name: 'Ultimate Ocean Day',
      badge: 'Best Seller',
      duration: '8 hours',
      priceLabel: 'USD 165 per guest',
      highlights: ['Surf + snorkel + jet ski', 'Marine biologist briefing', 'Private beach cabana lunch', 'GoPro media kit'],
      includes: ['All gear + wetsuits', 'Hotel transfers within 15km'],
      iconName: 'Sparkles'
    }
  ],
  logistics: {
    meetingPoint: 'Hikkaduwa Surf House, Galle Road, Narigama',
    sessionTimes: ['Sunrise Tide • 6:30 AM', 'Midday Reef • 11:00 AM', 'Golden Hour • 4:30 PM'],
    baseLocation: 'Narigama beachfront HQ with lockers, lounge, and showers',
    transferNote: 'Complimentary return transfers within 10 km. Private vans for longer distances at cost.',
    gearProvided: ['Surftech boards & wetsuits', 'Cressi snorkel & dive rigs', 'Impact vests + helmets'],
    bringList: ['Swimwear & change of clothes', 'Motion relief tablets', 'Waterproof phone pouch'],
    weatherPolicy: 'If seas exceed safe limits we reschedule or refund 100%.',
    safetyNote: 'ISA/PADI crew on every session with medic on call.'
  },
  safety: [
    'Certified ISA / PADI instructors',
    'Onsite medics + oxygen kits',
    'Full marine liability insurance'
  ],
  faqs: [
    {
      id: 'faq-1',
      question: 'Do I need to swim?',
      answer: 'Basic swimming is required for surf/snorkel/dive. Non-swimmers can book glass-bottom or lagoon SUP with tow support.'
    }
  ],
  gallery: [
    { id: 'gallery-1', image: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=1000&q=80', caption: 'SUP safari' }
  ],
  booking: {
    contactPhone: '+94 777 721 999',
    whatsapp: 'https://wa.me/94777721999',
    email: 'concierge@rechargetravels.com',
    responseTime: 'Replies in under 15 minutes between 6 AM – 10 PM GMT+5:30',
    conciergeNote: 'Share your preferred activity mix and we handle permits, gear, and transfers.'
  },
  pricing: {
    currency: 'USD',
    startingPrice: 35,
    depositNote: 'Full payment charged once sessions are confirmed.',
    refundPolicy: '100% refund for weather cancellations or if we cannot operate safely.',
    extrasNote: 'Photo/video bundles, drone capture, and private chefs available as add-ons.'
  },
  seo: {
    title: 'Hikkaduwa Water Sports Concierge | Recharge Travels',
    description:
      'Book premium surf lessons, snorkel safaris, jet ski circuits, and dive charters in Hikkaduwa with insured operators, concierge support, and pro media.',
    keywords: ['Hikkaduwa water sports', 'surf lessons Sri Lanka'],
    ogImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&h=630&q=80'
  }
};

class HikkaduwaWaterSportsAdminService {
  async getContent(): Promise<AdminWaterSportsBookingContent> {
    const ref = doc(db, COLLECTION, DOC_ID);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, defaultAdminWaterSportsContent);
      return defaultAdminWaterSportsContent;
    }
    return { ...defaultAdminWaterSportsContent, ...snap.data() } as AdminWaterSportsBookingContent;
  }

  async saveContent(content: AdminWaterSportsBookingContent) {
    const ref = doc(db, COLLECTION, DOC_ID);
    await setDoc(ref, content, { merge: true });
  }
}

export const hikkaduwaWaterSportsAdminService = new HikkaduwaWaterSportsAdminService();

