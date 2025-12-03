import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const COLLECTION = 'trainJourneysBookingContent';
const DOC_ID = 'train-journeys';

// Types matching the frontend service
export interface AdminTrainHeroSlide {
  image: string;
  caption: string;
  tag?: string;
}

export interface AdminTrainBadge {
  label: string;
  value: string;
  iconName: string;
}

export interface AdminTrainHighlight {
  label: string;
  description: string;
}

export interface AdminTrainExperience {
  id: string;
  name: string;
  summary: string;
  duration: string;
  priceLabel: string;
  level: 'Easy' | 'Moderate' | 'Challenging' | 'All Levels';
  includes: string[];
  image?: string;
  iconName: string;
}

export interface AdminTrainCombo {
  id: string;
  name: string;
  badge: string;
  duration: string;
  priceLabel: string;
  highlights: string[];
  includes: string[];
  iconName: string;
}

export interface AdminTrainLogistics {
  meetingPoint: string;
  sessionTimes: string[];
  baseLocation: string;
  transferNote: string;
  gearProvided: string[];
  bringList: string[];
  weatherPolicy: string;
  safetyNote: string;
}

export interface AdminTrainFaq {
  id: string;
  question: string;
  answer: string;
}

export interface AdminTrainGalleryImage {
  id: string;
  image: string;
  caption: string;
}

export interface AdminTrainBookingInfo {
  contactPhone: string;
  whatsapp: string;
  email: string;
  responseTime: string;
  conciergeNote: string;
}

export interface AdminTrainPricing {
  currency: string;
  startingPrice: number;
  depositNote: string;
  refundPolicy: string;
  extrasNote: string;
}

export interface AdminTrainBookingContent {
  hero: {
    title: string;
    subtitle: string;
    badge: string;
    gallery: AdminTrainHeroSlide[];
  };
  overview: {
    summary: string;
    badges: AdminTrainBadge[];
    highlights: AdminTrainHighlight[];
  };
  experiences: AdminTrainExperience[];
  combos: AdminTrainCombo[];
  logistics: AdminTrainLogistics;
  safety: string[];
  faqs: AdminTrainFaq[];
  gallery: AdminTrainGalleryImage[];
  booking: AdminTrainBookingInfo;
  pricing: AdminTrainPricing;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
}

export const defaultAdminTrainJourneysContent: AdminTrainBookingContent = {
  hero: {
    title: 'Scenic Rail Journeys Concierge',
    subtitle: "Experience Sri Lanka's iconic train rides through misty highlands, tea plantations, and the famous Nine Arch Bridge.",
    badge: 'Rail Travel Specialists',
    gallery: [
      {
        image: 'https://images.unsplash.com/photo-1564769610726-63c0b4b07b27?auto=format&fit=crop&w=2000&q=80',
        caption: 'Nine Arch Bridge - Ella',
        tag: 'Iconic Bridge'
      },
      {
        image: 'https://images.unsplash.com/photo-1589456506629-b2ea1a8576fb?auto=format&fit=crop&w=2000&q=80',
        caption: 'Tea Plantation Views',
        tag: 'Hill Country'
      }
    ]
  },
  overview: {
    summary:
      "We handle the entire rail experience—from premium ticket sourcing to private transfers and overnight stays.",
    badges: [
      { label: 'Routes', value: '10+', iconName: 'Train' },
      { label: 'Bridges', value: '50+', iconName: 'Mountain' },
      { label: 'Guest Rating', value: '4.96/5', iconName: 'Star' },
      { label: 'Daily Departures', value: 'Available', iconName: 'Calendar' }
    ],
    highlights: [
      {
        label: 'Premium ticket sourcing',
        description: 'Observation car and first-class seats secured 30-45 days ahead.'
      },
      {
        label: 'Door-to-door transfers',
        description: 'Private chauffeur picks you up and collects you at destination.'
      }
    ]
  },
  experiences: [
    {
      id: 'kandy-ella',
      name: 'Kandy to Ella Express',
      summary: "The world-famous route through tea plantations and the Nine Arch Bridge.",
      duration: '6-7 hours',
      priceLabel: 'USD 45 per guest',
      level: 'Easy',
      includes: ['Observation car ticket', 'Station transfers', 'Breakfast pack'],
      iconName: 'Train',
      image: 'https://images.unsplash.com/photo-1564769610726-63c0b4b07b27?auto=format&fit=crop&w=1400&q=80'
    }
  ],
  combos: [
    {
      id: 'rail-chauffeur',
      name: 'Scenic Rail & Chauffeur Combo',
      badge: 'Best Seller',
      duration: '2 Days / 1 Night',
      priceLabel: 'USD 180 per guest',
      highlights: ['Kandy to Ella train', 'Private car pickup/drop-off'],
      includes: ['Observation car tickets', 'Professional chauffeur'],
      iconName: 'Sparkles'
    }
  ],
  logistics: {
    meetingPoint: 'Kandy Railway Station / Colombo Fort Station',
    sessionTimes: ['Dawn Express • 5:55 AM', 'Morning Scenic • 8:47 AM', 'Afternoon Journey • 11:10 AM'],
    baseLocation: 'Stations with lounge access',
    transferNote: 'Private car transfers from any hotel in Kandy/Colombo.',
    gearProvided: ['Packed breakfast/lunch', 'Water & snacks', 'Journey map'],
    bringList: ['Light jacket', 'Camera with charged battery'],
    weatherPolicy: 'Trains operate rain or shine.',
    safetyNote: 'Hold on when at open doors. Keep valuables secure.'
  },
  safety: [
    'Licensed railway operators with safety certification',
    'Concierge support throughout your journey',
    'Emergency contact available 24/7'
  ],
  faqs: [
    {
      id: 'faq-1',
      question: 'How far in advance should I book tickets?',
      answer: 'Observation car tickets should be booked 30-45 days ahead.'
    }
  ],
  gallery: [
    {
      id: 'gallery-1',
      image: 'https://images.unsplash.com/photo-1564769610726-63c0b4b07b27?auto=format&fit=crop&w=1000&q=80',
      caption: 'Nine Arch Bridge passage'
    }
  ],
  booking: {
    contactPhone: '+94 777 721 999',
    whatsapp: 'https://wa.me/94777721999',
    email: 'concierge@rechargetravels.com',
    responseTime: 'Replies in under 15 minutes between 6 AM – 10 PM GMT+5:30',
    conciergeNote: 'Share your preferred route and dates—we handle all logistics.'
  },
  pricing: {
    currency: 'USD',
    startingPrice: 25,
    depositNote: 'Full payment required once tickets are confirmed.',
    refundPolicy: 'Tickets are non-refundable once purchased.',
    extrasNote: 'Photography packages, private transfers available as add-ons.'
  },
  seo: {
    title: 'Scenic Train Journeys Sri Lanka | Recharge Travels',
    description: "Book Sri Lanka's iconic train rides with concierge service.",
    keywords: ['Sri Lanka train journeys', 'Kandy to Ella train'],
    ogImage: 'https://images.unsplash.com/photo-1564769610726-63c0b4b07b27?auto=format&fit=crop&w=1200&h=630&q=80'
  }
};

class TrainJourneysAdminService {
  async getContent(): Promise<AdminTrainBookingContent> {
    try {
      const docRef = doc(db, COLLECTION, DOC_ID);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        await setDoc(docRef, defaultAdminTrainJourneysContent);
        return defaultAdminTrainJourneysContent;
      }

      const data = snapshot.data() as Partial<AdminTrainBookingContent>;

      return {
        ...defaultAdminTrainJourneysContent,
        ...data,
        hero: {
          ...defaultAdminTrainJourneysContent.hero,
          ...(data.hero || {}),
          gallery:
            data.hero?.gallery && data.hero.gallery.length > 0
              ? data.hero.gallery
              : defaultAdminTrainJourneysContent.hero.gallery
        },
        overview: {
          ...defaultAdminTrainJourneysContent.overview,
          ...(data.overview || {}),
          badges:
            data.overview?.badges && data.overview.badges.length > 0
              ? data.overview.badges
              : defaultAdminTrainJourneysContent.overview.badges,
          highlights:
            data.overview?.highlights && data.overview.highlights.length > 0
              ? data.overview.highlights
              : defaultAdminTrainJourneysContent.overview.highlights
        },
        experiences:
          data.experiences && data.experiences.length > 0
            ? data.experiences
            : defaultAdminTrainJourneysContent.experiences,
        combos:
          data.combos && data.combos.length > 0
            ? data.combos
            : defaultAdminTrainJourneysContent.combos,
        logistics: { ...defaultAdminTrainJourneysContent.logistics, ...(data.logistics || {}) },
        safety:
          data.safety && data.safety.length > 0 ? data.safety : defaultAdminTrainJourneysContent.safety,
        faqs: data.faqs && data.faqs.length > 0 ? data.faqs : defaultAdminTrainJourneysContent.faqs,
        gallery:
          data.gallery && data.gallery.length > 0 ? data.gallery : defaultAdminTrainJourneysContent.gallery,
        booking: { ...defaultAdminTrainJourneysContent.booking, ...(data.booking || {}) },
        pricing: { ...defaultAdminTrainJourneysContent.pricing, ...(data.pricing || {}) },
        seo: { ...defaultAdminTrainJourneysContent.seo, ...(data.seo || {}) }
      };
    } catch (error) {
      console.error('Error fetching train journeys admin content:', error);
      return defaultAdminTrainJourneysContent;
    }
  }

  async saveContent(content: Partial<AdminTrainBookingContent>): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION, DOC_ID);
      await setDoc(docRef, content, { merge: true });
      return true;
    } catch (error) {
      console.error('Error saving train journeys admin content:', error);
      return false;
    }
  }
}

export const trainJourneysAdminService = new TrainJourneysAdminService();
export default trainJourneysAdminService;







