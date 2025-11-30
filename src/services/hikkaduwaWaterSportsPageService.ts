import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION_NAME = 'waterSportsBookingContent';
const DOC_ID = 'hikkaduwa';

export interface WaterSportsHeroSlide {
  image: string;
  caption: string;
  tag?: string;
}

export interface WaterSportsBadge {
  label: string;
  value: string;
  iconName: string;
}

export interface WaterSportsHighlight {
  label: string;
  description: string;
}

export interface WaterSportsExperience {
  id: string;
  name: string;
  summary: string;
  duration: string;
  priceLabel: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  includes: string[];
  image?: string;
  iconName: string;
}

export interface WaterSportsComboPackage {
  id: string;
  name: string;
  badge: string;
  duration: string;
  priceLabel: string;
  highlights: string[];
  includes: string[];
  iconName: string;
}

export interface WaterSportsLogistics {
  meetingPoint: string;
  sessionTimes: string[];
  baseLocation: string;
  transferNote: string;
  gearProvided: string[];
  bringList: string[];
  weatherPolicy: string;
  safetyNote: string;
}

export interface WaterSportsFaq {
  id: string;
  question: string;
  answer: string;
}

export interface WaterSportsGalleryImage {
  id: string;
  image: string;
  caption: string;
}

export interface WaterSportsBookingInfo {
  contactPhone: string;
  whatsapp: string;
  email: string;
  responseTime: string;
  conciergeNote: string;
}

export interface WaterSportsPricing {
  currency: string;
  startingPrice: number;
  depositNote: string;
  refundPolicy: string;
  extrasNote: string;
}

export interface WaterSportsBookingContent {
  hero: {
    title: string;
    subtitle: string;
    badge: string;
    gallery: WaterSportsHeroSlide[];
  };
  overview: {
    summary: string;
    badges: WaterSportsBadge[];
    highlights: WaterSportsHighlight[];
  };
  experiences: WaterSportsExperience[];
  combos: WaterSportsComboPackage[];
  logistics: WaterSportsLogistics;
  safety: string[];
  faqs: WaterSportsFaq[];
  gallery: WaterSportsGalleryImage[];
  booking: WaterSportsBookingInfo;
  pricing: WaterSportsPricing;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
}

export const defaultWaterSportsContent: WaterSportsBookingContent = {
  hero: {
    title: 'Hikkaduwa Water Sports Concierge',
    subtitle: "Surf, dive, and jet across Sri Lanka's most vibrant marine playground with pro hosts.",
    badge: 'Marine & Adventure Certified',
    gallery: [
      {
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2000&q=80',
        caption: 'Snorkel the Hikkaduwa Marine Sanctuary',
        tag: 'Snorkeling'
      },
      {
        image: 'https://images.unsplash.com/photo-1530870110042-98b2cb110834?auto=format&fit=crop&w=2000&q=80',
        caption: 'Daily surf coaching with ISA instructors',
        tag: 'Surf Coaching'
      },
      {
        image: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?auto=format&fit=crop&w=2000&q=80',
        caption: 'Sunrise SUP & mangrove paddles',
        tag: 'SUP Sessions'
      },
      {
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=2000&q=80',
        caption: 'Adrenaline-fueled jet ski circuits',
        tag: 'Jet Ski'
      }
    ]
  },
  overview: {
    summary:
      'We operate the only concierge-led water sports outfit in Hikkaduwa—pairing insured operators, boutique hospitality, and marine biologist briefings for every booking.',
    badges: [
      { label: 'Activities', value: '15+', iconName: 'Activity' },
      { label: 'Pro Crew', value: 'ISA & PADI', iconName: 'Shield' },
      { label: 'Guest Rating', value: '4.97/5', iconName: 'Star' },
      { label: 'Same-day slots', value: 'Available', iconName: 'Calendar' }
    ],
    highlights: [
      {
        label: 'Dedicated concierge',
        description: 'Single WhatsApp thread for itineraries, transport, and weather holds.'
      },
      {
        label: 'Premium equipment',
        description: 'Surftech boards, Cressi dive gear, and GoPro footage included on select bundles.'
      },
      {
        label: 'Safety & insurance',
        description: 'Full marine liability coverage plus on-site medics during peak hours.'
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
      iconName: 'Waves',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80'
    },
    {
      id: 'reef-snorkel',
      name: 'Marine Sanctuary Snorkel',
      summary: 'Glass-bottom transfer, marine biologist brief, and reef-friendly gear for the reserve.',
      duration: '150 mins',
      priceLabel: 'USD 35 per guest',
      level: 'Beginner',
      includes: ['Private guide', 'Snorkel kit + fins', 'Reef-safe sunscreen', 'Underwater photography'],
      iconName: 'Fish',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80'
    },
    {
      id: 'jet-ski',
      name: 'Jet Ski Circuit & Speed Run',
      summary: 'Two-pass ocean circuit with telemetry coaching and GoPro footage.',
      duration: '30 mins',
      priceLabel: 'USD 55 per craft',
      level: 'Intermediate',
      includes: ['Yamaha VX jet ski', 'Safety marshal + comms', 'GoPro clips', 'Post-ride mocktail'],
      iconName: 'Zap',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1400&q=80'
    },
    {
      id: 'padi-dive',
      name: 'Twin Reef / Wreck Dive',
      summary: 'PADI dive masters, Nitrox upgrades, and breakfast between sites.',
      duration: '4 hours',
      priceLabel: 'USD 95 per diver',
      level: 'All Levels',
      includes: ['Full dive kit', 'Nitrox upgrade', 'Speedboat transfer', 'Surface interval brunch'],
      iconName: 'Anchor',
      image: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?auto=format&fit=crop&w=1400&q=80'
    }
  ],
  combos: [
    {
      id: 'full-day',
      name: 'Ultimate Ocean Day',
      badge: 'Best Seller',
      duration: '8 hours',
      priceLabel: 'USD 165 per guest',
      highlights: ['Surf + snorkel + jet ski combo', 'Marine biologist briefing', 'Private beach cabana lunch', 'GoPro media kit'],
      includes: ['All gear + wetsuits', 'Hotel transfers within 15km', 'Chef-curated lunch + mocktails', 'Concierge host'],
      iconName: 'Sparkles'
    },
    {
      id: 'family',
      name: 'Family Splash Pass',
      badge: 'Groups',
      duration: '4 hours',
      priceLabel: 'USD 220 (family of four)',
      highlights: ['Glass-bottom cruise', 'Banana boat ride', 'Junior snorkel session', 'Picnic setup'],
      includes: ['Child-sized gear', 'Beach games kit', 'Photographer add-on', 'Unlimited coconut water'],
      iconName: 'Heart'
    },
    {
      id: 'twilight',
      name: 'Golden Hour Paddle & Tapas',
      badge: 'Sunset',
      duration: '3 hours',
      priceLabel: 'USD 75 per guest',
      highlights: ['Lagoon SUP safari', 'Sunset mocktail raft', 'DJ + tapas board', 'Night-photography'],
      includes: ['LED-lit boards', 'Concierge crew', 'Tapas & beverages', 'Photography edits'],
      iconName: 'Sun'
    }
  ],
  logistics: {
    meetingPoint: 'Hikkaduwa Surf House, Galle Road, Narigama',
    sessionTimes: ['Sunrise Tide • 6:30 AM', 'Midday Reef • 11:00 AM', 'Golden Hour • 4:30 PM'],
    baseLocation: 'Narigama Beachfront HQ with lockers, lounge, and showers',
    transferNote: 'Complimentary return transfers within 10 km. Private vans for longer distances at cost.',
    gearProvided: ['Surftech boards & wetsuits', 'Cressi snorkel & dive rigs', 'Impact vests + helmets', 'Towels & amenities'],
    bringList: ['Swimwear & change of clothes', 'Any medication / motion relief', 'Waterproof phone pouch', 'Gratuities for crew'],
    weatherPolicy: 'If seas exceed safe limits we reschedule or refund 100%. Forecasts shared 24h prior.',
    safetyNote: 'All sessions supervised by ISA/PADI crew, paramedic on-call, and live radio links to harbour control.'
  },
  safety: [
    'ISA / PADI certified lead instructors',
    'Daily equipment sanitization + maintenance logs',
    'Onsite medic & oxygen kit during peak hours',
    'Full marine & personal accident insurance coverage'
  ],
  faqs: [
    {
      id: 'faq-1',
      question: 'Do I need to be an experienced swimmer?',
      answer:
        'For surfing, snorkeling, and scuba we require basic swimming ability. Non-swimmers can book glass-bottom cruises, SUP with tow support, or opt for extra floatation devices.'
    },
    {
      id: 'faq-2',
      question: 'What is the best season for Hikkaduwa water sports?',
      answer:
        'November–April delivers consistent swell and crystal visibility. We still operate during the southwest monsoon but limit activities to lagoon and mangrove zones when seas are rough.'
    },
    {
      id: 'faq-3',
      question: 'Can I combine multiple activities in one day?',
      answer:
        'Yes—our concierge staggers your schedule with hydration and rest windows. The Ultimate Ocean Day bundle is designed exactly for that.'
    },
    {
      id: 'faq-4',
      question: 'What happens if weather conditions change suddenly?',
      answer:
        'Safety first. We either shift to a calmer lagoon-based plan, move the booking, or process a full refund if we cancel.'
    }
  ],
  gallery: [
    {
      id: 'gallery-1',
      image: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=1000&q=80',
      caption: 'Crystal clear SUP sessions at Narigama lagoon'
    },
    {
      id: 'gallery-2',
      image: 'https://images.unsplash.com/photo-1470165525439-3cf9e6dccbad?auto=format&fit=crop&w=1000&q=80',
      caption: 'Marine sanctuary snorkel guides'
    },
    {
      id: 'gallery-3',
      image: 'https://images.unsplash.com/photo-1516569422880-8fce0a366e24?auto=format&fit=crop&w=1000&q=80',
      caption: 'Adrenaline jet ski sprint lap'
    },
    {
      id: 'gallery-4',
      image: 'https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=1000&q=80',
      caption: 'Sunset SUP & tapas series'
    }
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
    depositNote: 'Full payment charged once sessions are confirmed; rescheduling free up to 24 hours out.',
    refundPolicy: '100% refund for weather cancellations or if we cannot meet minimum safety standards.',
    extrasNote: 'Photo/video bundles, drone capture, and private chefs available as add-ons.'
  },
  seo: {
    title: 'Hikkaduwa Water Sports Concierge | Surf, Snorkel & Jet Ski | Recharge Travels',
    description:
      'Book premium surf lessons, snorkel safaris, jet ski circuits, and dive charters in Hikkaduwa with insured operators, concierge support, and pro media.',
    keywords: [
      'Hikkaduwa water sports',
      'Hikkaduwa surf lessons',
      'Hikkaduwa snorkel tour',
      'Sri Lanka jet ski booking',
      'Recharge Travels water sports'
    ],
    ogImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&h=630&q=80'
  }
};

class HikkaduwaWaterSportsBookingService {
  async getContent(): Promise<WaterSportsBookingContent> {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      await setDoc(docRef, defaultWaterSportsContent);
      return defaultWaterSportsContent;
    }

    const data = snapshot.data() as Partial<WaterSportsBookingContent>;

    return {
      ...defaultWaterSportsContent,
      ...data,
      hero: {
        ...defaultWaterSportsContent.hero,
        ...(data.hero || {}),
        gallery:
          data.hero?.gallery && data.hero.gallery.length > 0
            ? data.hero.gallery
            : defaultWaterSportsContent.hero.gallery
      },
      overview: {
        ...defaultWaterSportsContent.overview,
        ...(data.overview || {}),
        badges: data.overview?.badges && data.overview.badges.length > 0 ? data.overview.badges : defaultWaterSportsContent.overview.badges,
        highlights:
          data.overview?.highlights && data.overview.highlights.length > 0
            ? data.overview.highlights
            : defaultWaterSportsContent.overview.highlights
      },
      experiences: data.experiences && data.experiences.length > 0 ? data.experiences : defaultWaterSportsContent.experiences,
      combos: data.combos && data.combos.length > 0 ? data.combos : defaultWaterSportsContent.combos,
      logistics: { ...defaultWaterSportsContent.logistics, ...(data.logistics || {}) },
      safety: data.safety && data.safety.length > 0 ? data.safety : defaultWaterSportsContent.safety,
      faqs: data.faqs && data.faqs.length > 0 ? data.faqs : defaultWaterSportsContent.faqs,
      gallery: data.gallery && data.gallery.length > 0 ? data.gallery : defaultWaterSportsContent.gallery,
      booking: { ...defaultWaterSportsContent.booking, ...(data.booking || {}) },
      pricing: { ...defaultWaterSportsContent.pricing, ...(data.pricing || {}) },
      seo: { ...defaultWaterSportsContent.seo, ...(data.seo || {}) }
    };
  }

  async saveContent(content: Partial<WaterSportsBookingContent>) {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
    await setDoc(docRef, content, { merge: true });
  }

  getDefaultContent() {
    return defaultWaterSportsContent;
  }
}

export const hikkaduwaWaterSportsBookingService = new HikkaduwaWaterSportsBookingService();
export default hikkaduwaWaterSportsBookingService;
