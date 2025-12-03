import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION_NAME = 'islandGetawaysBookingContent';
const DOC_ID = 'island-getaways';

// Interfaces matching the Hikkaduwa Water Sports style
export interface IslandHeroSlide {
  image: string;
  caption: string;
  tag?: string;
}

export interface IslandBadge {
  label: string;
  value: string;
  iconName: string;
}

export interface IslandHighlight {
  label: string;
  description: string;
}

export interface IslandExperience {
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

export interface IslandComboPackage {
  id: string;
  name: string;
  badge: string;
  duration: string;
  priceLabel: string;
  highlights: string[];
  includes: string[];
  iconName: string;
}

export interface IslandLogistics {
  meetingPoint: string;
  sessionTimes: string[];
  baseLocation: string;
  transferNote: string;
  gearProvided: string[];
  bringList: string[];
  weatherPolicy: string;
  safetyNote: string;
}

export interface IslandFaq {
  id: string;
  question: string;
  answer: string;
}

export interface IslandGalleryImage {
  id: string;
  image: string;
  caption: string;
}

export interface IslandBookingInfo {
  contactPhone: string;
  whatsapp: string;
  email: string;
  responseTime: string;
  conciergeNote: string;
}

export interface IslandPricing {
  currency: string;
  startingPrice: number;
  depositNote: string;
  refundPolicy: string;
  extrasNote: string;
}

export interface IslandGetawaysBookingContent {
  hero: {
    title: string;
    subtitle: string;
    badge: string;
    gallery: IslandHeroSlide[];
  };
  overview: {
    summary: string;
    badges: IslandBadge[];
    highlights: IslandHighlight[];
  };
  experiences: IslandExperience[];
  combos: IslandComboPackage[];
  logistics: IslandLogistics;
  safety: string[];
  faqs: IslandFaq[];
  gallery: IslandGalleryImage[];
  booking: IslandBookingInfo;
  pricing: IslandPricing;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
}

export const defaultIslandGetawaysContent: IslandGetawaysBookingContent = {
  hero: {
    title: 'Island Escapes Concierge',
    subtitle: "Discover pristine islands, vibrant coral reefs, and untouched paradise beaches across Sri Lanka.",
    badge: 'Marine & Island Certified',
    gallery: [
      {
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=2000&q=80',
        caption: 'Pigeon Island Marine Sanctuary',
        tag: 'Snorkeling'
      },
      {
        image: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=2000&q=80',
        caption: 'Delft Island Wild Horses',
        tag: 'Island Hopping'
      },
      {
        image: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&w=2000&q=80',
        caption: 'Crystal Clear Reef Waters',
        tag: 'Diving'
      },
      {
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2000&q=80',
        caption: 'Sunset Beach Paradise',
        tag: 'Beach'
      }
    ]
  },
  overview: {
    summary:
      "We operate exclusive island-hopping expeditions across Sri Lanka's hidden gems—combining marine adventures, cultural exploration, and boutique concierge service for unforgettable island experiences.",
    badges: [
      { label: 'Islands', value: '40+', iconName: 'Anchor' },
      { label: 'Marine Species', value: '300+', iconName: 'Fish' },
      { label: 'Guest Rating', value: '4.95/5', iconName: 'Star' },
      { label: 'Tours', value: 'Daily', iconName: 'Calendar' }
    ],
    highlights: [
      {
        label: 'Private island concierge',
        description: 'Dedicated host for permits, boats, and marine guides—all via single WhatsApp thread.'
      },
      {
        label: 'Premium marine gear',
        description: 'Snorkel kits, dive equipment, and underwater cameras included on select packages.'
      },
      {
        label: 'Safety & coverage',
        description: 'Full marine insurance, certified boat captains, and on-call support throughout.'
      }
    ]
  },
  experiences: [
    {
      id: 'pigeon-island',
      name: 'Pigeon Island Marine Safari',
      summary: 'Snorkel alongside sea turtles, blacktip sharks, and 300+ fish species in crystal-clear waters.',
      duration: '4 hours',
      priceLabel: 'USD 65 per guest',
      level: 'All Levels',
      includes: ['Marine park entry', 'Snorkel gear', 'Glass-bottom boat', 'Marine guide', 'Fruit & refreshments'],
      iconName: 'Fish',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1400&q=80'
    },
    {
      id: 'delft-island',
      name: 'Delft Island Heritage Tour',
      summary: 'Discover wild horses, ancient baobab trees, and Dutch colonial ruins on this mystical northern island.',
      duration: '6 hours',
      priceLabel: 'USD 85 per guest',
      level: 'Beginner',
      includes: ['Ferry tickets', 'Island guide', 'Lunch pack', 'Cultural briefing', 'Photography stops'],
      iconName: 'Compass',
      image: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=1400&q=80'
    },
    {
      id: 'mannar-birds',
      name: 'Mannar Bird Sanctuary Expedition',
      summary: 'Spot flamingos, migratory birds, and explore the ancient pearl diving heritage of Mannar Island.',
      duration: '5 hours',
      priceLabel: 'USD 75 per guest',
      level: 'Beginner',
      includes: ['Expert ornithologist', 'Binoculars', 'Bird checklist', 'Transport', 'Refreshments'],
      iconName: 'Camera',
      image: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&w=1400&q=80'
    },
    {
      id: 'reef-dive',
      name: 'Great Basses Reef Dive',
      summary: 'PADI-certified wreck and reef dives at one of Asia\'s premier diving destinations.',
      duration: '6 hours',
      priceLabel: 'USD 125 per diver',
      level: 'Intermediate',
      includes: ['Full dive gear', 'PADI dive master', 'Speedboat transfer', 'Surface interval brunch', 'Dive insurance'],
      iconName: 'Anchor',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=80'
    }
  ],
  combos: [
    {
      id: 'island-explorer',
      name: 'Ultimate Island Explorer',
      badge: 'Best Seller',
      duration: '4 Days / 3 Nights',
      priceLabel: 'USD 549 per guest',
      highlights: ['Multi-island hopping adventure', 'Snorkeling + cultural tours', 'Beach resort accommodation', 'All meals included'],
      includes: ['Ferry & boat transfers', 'Marine park entries', 'Expert guides', 'Boutique hotel stay', 'Concierge host'],
      iconName: 'Sparkles'
    },
    {
      id: 'marine-paradise',
      name: 'Marine Paradise Package',
      badge: 'Snorkelers',
      duration: '3 Days / 2 Nights',
      priceLabel: 'USD 399 per guest',
      highlights: ['Pigeon Island snorkeling', 'Whale watching cruise', 'Coral reef exploration', 'Beach resort stay'],
      includes: ['All marine equipment', 'PADI guides', 'Beach accommodation', 'Breakfast & lunch', 'Photography'],
      iconName: 'Waves'
    },
    {
      id: 'northern-heritage',
      name: 'Northern Islands Heritage',
      badge: 'Cultural',
      duration: '3 Days / 2 Nights',
      priceLabel: 'USD 379 per guest',
      highlights: ['Delft Island wild horses', 'Jaffna cultural sites', 'Kayts pristine beaches', 'Local cuisine experience'],
      includes: ['All ferry tickets', 'Heritage guides', 'Guesthouse stay', 'Traditional meals', 'Transport'],
      iconName: 'Compass'
    }
  ],
  logistics: {
    meetingPoint: 'Trincomalee Harbor Office / Jaffna Ferry Terminal (based on tour)',
    sessionTimes: ['Sunrise Departure • 6:00 AM', 'Morning Session • 9:00 AM', 'Afternoon Cruise • 2:00 PM'],
    baseLocation: 'Multiple departure points with locker facilities and guest lounges',
    transferNote: 'Complimentary transfers from Trincomalee/Jaffna hotels. Long-distance transfers at cost.',
    gearProvided: ['Premium snorkel kits', 'Life jackets', 'Underwater cameras', 'Reef-safe sunscreen'],
    bringList: ['Swimwear & change of clothes', 'Motion sickness tablets', 'Waterproof bag', 'Gratuities for crew'],
    weatherPolicy: 'Full reschedule or refund if seas exceed safe limits. Weather updates 24h prior.',
    safetyNote: 'All boats captained by licensed operators with marine insurance and first-aid kits.'
  },
  safety: [
    'Licensed boat captains with marine certification',
    'Full marine liability insurance coverage',
    'On-board first-aid kits and emergency protocols',
    'Life jackets mandatory for all water activities',
    'Real-time weather monitoring and safety checks'
  ],
  faqs: [
    {
      id: 'faq-1',
      question: 'Do I need to know how to swim for island tours?',
      answer: 'Basic swimming is required for snorkeling and diving activities. Non-swimmers can enjoy glass-bottom boat tours, beach visits, and cultural excursions with life jacket support for water activities.'
    },
    {
      id: 'faq-2',
      question: 'What is the best time to visit Sri Lanka\'s islands?',
      answer: 'East coast islands (Pigeon Island, Trincomalee) are best May–September. Northern islands (Delft, Kayts) are ideal March–September. We advise on optimal timing based on your chosen destinations.'
    },
    {
      id: 'faq-3',
      question: 'Are permits required for marine parks?',
      answer: 'Yes, Pigeon Island and other marine parks require entry permits. All permits are included in our packages and arranged by your concierge—no hassle for you.'
    },
    {
      id: 'faq-4',
      question: 'Can I combine multiple islands in one trip?',
      answer: 'Absolutely! Our combo packages are designed for multi-island exploration. Custom itineraries can also be arranged through your dedicated concierge.'
    },
    {
      id: 'faq-5',
      question: 'What happens if weather conditions change?',
      answer: 'Safety first. We either reschedule to calmer conditions, swap to an alternative protected site, or process a full refund if we cannot operate safely.'
    }
  ],
  gallery: [
    {
      id: 'gallery-1',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1000&q=80',
      caption: 'Pigeon Island crystal waters'
    },
    {
      id: 'gallery-2',
      image: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&w=1000&q=80',
      caption: 'Snorkeling the coral gardens'
    },
    {
      id: 'gallery-3',
      image: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=1000&q=80',
      caption: 'Delft Island landscapes'
    },
    {
      id: 'gallery-4',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
      caption: 'Sunset island cruises'
    }
  ],
  booking: {
    contactPhone: '+94 777 721 999',
    whatsapp: 'https://wa.me/94777721999',
    email: 'concierge@rechargetravels.com',
    responseTime: 'Replies in under 15 minutes between 6 AM – 10 PM GMT+5:30',
    conciergeNote: 'Share your preferred islands and dates—we\'ll handle permits, boats, accommodation, and all logistics.'
  },
  pricing: {
    currency: 'USD',
    startingPrice: 65,
    depositNote: 'Full payment charged once tour is confirmed. Rescheduling free up to 48 hours prior.',
    refundPolicy: '100% refund for weather cancellations or if we cannot meet minimum safety standards.',
    extrasNote: 'Underwater photography, drone footage, and private chef experiences available as add-ons.'
  },
  seo: {
    title: 'Sri Lanka Island Escapes Concierge | Pigeon Island, Delft & More | Recharge Travels',
    description:
      "Book exclusive island-hopping tours across Sri Lanka's pristine islands. Snorkeling at Pigeon Island, heritage tours at Delft, and marine adventures with concierge service.",
    keywords: [
      'Sri Lanka islands',
      'Pigeon Island snorkeling',
      'Delft Island tours',
      'island hopping Sri Lanka',
      'marine national park',
      'Recharge Travels islands'
    ],
    ogImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1200&h=630&q=80'
  }
};

// Legacy interface exports for backward compatibility
export interface Island {
  id: string;
  name: string;
  description: string;
  location: string;
  accessibility: string;
  highlights: string[];
  bestTime: string;
  activities: string[];
  uniqueFeature: string;
}

export interface IslandPackage {
  id: string;
  name: string;
  duration: string;
  price: string;
  highlights: string[];
  included: string[];
  iconName: string;
  islands: string[];
}

class IslandGetawaysPageService {
  async getContent(): Promise<IslandGetawaysBookingContent> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        await setDoc(docRef, defaultIslandGetawaysContent);
        return defaultIslandGetawaysContent;
      }

      const data = snapshot.data() as Partial<IslandGetawaysBookingContent>;

      return {
        ...defaultIslandGetawaysContent,
        ...data,
        hero: {
          ...defaultIslandGetawaysContent.hero,
          ...(data.hero || {}),
          gallery:
            data.hero?.gallery && data.hero.gallery.length > 0
              ? data.hero.gallery
              : defaultIslandGetawaysContent.hero.gallery
        },
        overview: {
          ...defaultIslandGetawaysContent.overview,
          ...(data.overview || {}),
          badges: data.overview?.badges && data.overview.badges.length > 0 
            ? data.overview.badges 
            : defaultIslandGetawaysContent.overview.badges,
          highlights:
            data.overview?.highlights && data.overview.highlights.length > 0
              ? data.overview.highlights
              : defaultIslandGetawaysContent.overview.highlights
        },
        experiences: data.experiences && data.experiences.length > 0 
          ? data.experiences 
          : defaultIslandGetawaysContent.experiences,
        combos: data.combos && data.combos.length > 0 
          ? data.combos 
          : defaultIslandGetawaysContent.combos,
        logistics: { ...defaultIslandGetawaysContent.logistics, ...(data.logistics || {}) },
        safety: data.safety && data.safety.length > 0 
          ? data.safety 
          : defaultIslandGetawaysContent.safety,
        faqs: data.faqs && data.faqs.length > 0 
          ? data.faqs 
          : defaultIslandGetawaysContent.faqs,
        gallery: data.gallery && data.gallery.length > 0 
          ? data.gallery 
          : defaultIslandGetawaysContent.gallery,
        booking: { ...defaultIslandGetawaysContent.booking, ...(data.booking || {}) },
        pricing: { ...defaultIslandGetawaysContent.pricing, ...(data.pricing || {}) },
        seo: { ...defaultIslandGetawaysContent.seo, ...(data.seo || {}) }
      };
    } catch (error) {
      console.error('Error fetching island getaways content:', error);
      return defaultIslandGetawaysContent;
    }
  }

  async saveContent(content: Partial<IslandGetawaysBookingContent>): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      await setDoc(docRef, content, { merge: true });
      return true;
    } catch (error) {
      console.error('Error saving island getaways content:', error);
      return false;
    }
  }

  getDefaultContent(): IslandGetawaysBookingContent {
    return defaultIslandGetawaysContent;
  }
}

export const islandGetawaysPageService = new IslandGetawaysPageService();
export default islandGetawaysPageService;
