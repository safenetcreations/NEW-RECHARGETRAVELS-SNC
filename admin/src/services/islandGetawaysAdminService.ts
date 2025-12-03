import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION = 'islandGetawaysBookingContent';
const DOC_ID = 'island-getaways';

export interface AdminIslandHeroSlide {
  image: string;
  caption: string;
  tag?: string;
}

export interface AdminIslandBadge {
  label: string;
  value: string;
  iconName: string;
}

export interface AdminIslandHighlight {
  label: string;
  description: string;
}

export interface AdminIslandExperience {
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

export interface AdminIslandCombo {
  id: string;
  name: string;
  badge: string;
  duration: string;
  priceLabel: string;
  highlights: string[];
  includes: string[];
  iconName: string;
}

export interface AdminIslandLogistics {
  meetingPoint: string;
  sessionTimes: string[];
  baseLocation: string;
  transferNote: string;
  gearProvided: string[];
  bringList: string[];
  weatherPolicy: string;
  safetyNote: string;
}

export interface AdminIslandGetawaysBookingContent {
  hero: {
    title: string;
    subtitle: string;
    badge: string;
    gallery: AdminIslandHeroSlide[];
  };
  overview: {
    summary: string;
    badges: AdminIslandBadge[];
    highlights: AdminIslandHighlight[];
  };
  experiences: AdminIslandExperience[];
  combos: AdminIslandCombo[];
  logistics: AdminIslandLogistics;
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

export const defaultAdminIslandGetawaysContent: AdminIslandGetawaysBookingContent = {
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
      }
    ]
  },
  overview: {
    summary:
      "We operate exclusive island-hopping expeditions across Sri Lanka's hidden gems—combining marine adventures, cultural exploration, and boutique concierge service for unforgettable island experiences.",
    badges: [
      { label: 'Islands', value: '40+', iconName: 'Anchor' },
      { label: 'Marine Species', value: '300+', iconName: 'Fish' }
    ],
    highlights: [
      {
        label: 'Private island concierge',
        description: 'Dedicated host for permits, boats, and marine guides—all via single WhatsApp thread.'
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
    }
  ],
  combos: [
    {
      id: 'island-explorer',
      name: 'Ultimate Island Explorer',
      badge: 'Best Seller',
      duration: '4 Days / 3 Nights',
      priceLabel: 'USD 549 per guest',
      highlights: ['Multi-island hopping adventure', 'Snorkeling + cultural tours', 'Beach resort accommodation'],
      includes: ['Ferry & boat transfers', 'Marine park entries', 'Expert guides'],
      iconName: 'Sparkles'
    }
  ],
  logistics: {
    meetingPoint: 'Trincomalee Harbor Office / Jaffna Ferry Terminal (based on tour)',
    sessionTimes: ['Sunrise Departure • 6:00 AM', 'Morning Session • 9:00 AM', 'Afternoon Cruise • 2:00 PM'],
    baseLocation: 'Multiple departure points with locker facilities and guest lounges',
    transferNote: 'Complimentary transfers from Trincomalee/Jaffna hotels. Long-distance transfers at cost.',
    gearProvided: ['Premium snorkel kits', 'Life jackets', 'Underwater cameras', 'Reef-safe sunscreen'],
    bringList: ['Swimwear & change of clothes', 'Motion sickness tablets', 'Waterproof bag'],
    weatherPolicy: 'Full reschedule or refund if seas exceed safe limits.',
    safetyNote: 'All boats captained by licensed operators with marine insurance.'
  },
  safety: [
    'Licensed boat captains with marine certification',
    'Full marine liability insurance coverage',
    'On-board first-aid kits and emergency protocols'
  ],
  faqs: [
    {
      id: 'faq-1',
      question: 'Do I need to know how to swim?',
      answer: 'Basic swimming is required for snorkeling. Non-swimmers can enjoy glass-bottom boat tours and beach visits.'
    }
  ],
  gallery: [
    { id: 'gallery-1', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1000&q=80', caption: 'Pigeon Island waters' }
  ],
  booking: {
    contactPhone: '+94 777 721 999',
    whatsapp: 'https://wa.me/94777721999',
    email: 'concierge@rechargetravels.com',
    responseTime: 'Replies in under 15 minutes between 6 AM – 10 PM GMT+5:30',
    conciergeNote: "Share your preferred islands and dates—we'll handle permits, boats, and all logistics."
  },
  pricing: {
    currency: 'USD',
    startingPrice: 65,
    depositNote: 'Full payment charged once tour is confirmed.',
    refundPolicy: '100% refund for weather cancellations or if we cannot operate safely.',
    extrasNote: 'Underwater photography, drone footage, and private chefs available as add-ons.'
  },
  seo: {
    title: 'Sri Lanka Island Escapes Concierge | Recharge Travels',
    description:
      "Book exclusive island-hopping tours across Sri Lanka's pristine islands with concierge service.",
    keywords: ['Sri Lanka islands', 'Pigeon Island snorkeling'],
    ogImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1200&h=630&q=80'
  }
};

class IslandGetawaysAdminService {
  async getContent(): Promise<AdminIslandGetawaysBookingContent> {
    const ref = doc(db, COLLECTION, DOC_ID);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, defaultAdminIslandGetawaysContent);
      return defaultAdminIslandGetawaysContent;
    }
    return { ...defaultAdminIslandGetawaysContent, ...snap.data() } as AdminIslandGetawaysBookingContent;
  }

  async saveContent(content: AdminIslandGetawaysBookingContent) {
    const ref = doc(db, COLLECTION, DOC_ID);
    await setDoc(ref, content, { merge: true });
  }
}

export const islandGetawaysAdminService = new IslandGetawaysAdminService();







