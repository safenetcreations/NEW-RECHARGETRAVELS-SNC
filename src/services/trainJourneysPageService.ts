import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION_NAME = 'trainJourneysBookingContent';
const DOC_ID = 'train-journeys';

// Interfaces matching the Hikkaduwa Water Sports style
export interface TrainHeroSlide {
  image: string;
  caption: string;
  tag?: string;
}

export interface TrainBadge {
  label: string;
  value: string;
  iconName: string;
}

export interface TrainHighlight {
  label: string;
  description: string;
}

export interface TrainExperience {
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

export interface TrainComboPackage {
  id: string;
  name: string;
  badge: string;
  duration: string;
  priceLabel: string;
  highlights: string[];
  includes: string[];
  iconName: string;
}

export interface TrainLogistics {
  meetingPoint: string;
  sessionTimes: string[];
  baseLocation: string;
  transferNote: string;
  gearProvided: string[];
  bringList: string[];
  weatherPolicy: string;
  safetyNote: string;
}

export interface TrainFaq {
  id: string;
  question: string;
  answer: string;
}

export interface TrainGalleryImage {
  id: string;
  image: string;
  caption: string;
}

export interface TrainBookingInfo {
  contactPhone: string;
  whatsapp: string;
  email: string;
  responseTime: string;
  conciergeNote: string;
}

export interface TrainPricing {
  currency: string;
  startingPrice: number;
  depositNote: string;
  refundPolicy: string;
  extrasNote: string;
}

export interface TrainJourneysBookingContent {
  hero: {
    title: string;
    subtitle: string;
    badge: string;
    gallery: TrainHeroSlide[];
  };
  overview: {
    summary: string;
    badges: TrainBadge[];
    highlights: TrainHighlight[];
  };
  experiences: TrainExperience[];
  combos: TrainComboPackage[];
  logistics: TrainLogistics;
  safety: string[];
  faqs: TrainFaq[];
  gallery: TrainGalleryImage[];
  booking: TrainBookingInfo;
  pricing: TrainPricing;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
}

export const defaultTrainJourneysContent: TrainJourneysBookingContent = {
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
      },
      {
        image: 'https://images.unsplash.com/photo-1609924211018-ba526e55e6e0?auto=format&fit=crop&w=2000&q=80',
        caption: 'Highland Railway Journey',
        tag: 'Scenic Route'
      },
      {
        image: 'https://images.unsplash.com/photo-1566396386016-244e66a09199?auto=format&fit=crop&w=2000&q=80',
        caption: 'Observation Car Experience',
        tag: 'Premium Class'
      }
    ]
  },
  overview: {
    summary:
      "We handle the entire rail experience—from premium ticket sourcing to private transfers and overnight stays. Enjoy one of the world's most scenic train journeys with concierge-level service.",
    badges: [
      { label: 'Routes', value: '10+', iconName: 'Train' },
      { label: 'Bridges', value: '50+', iconName: 'Mountain' },
      { label: 'Guest Rating', value: '4.96/5', iconName: 'Star' },
      { label: 'Daily Departures', value: 'Available', iconName: 'Calendar' }
    ],
    highlights: [
      {
        label: 'Premium ticket sourcing',
        description: 'Observation car and first-class seats secured 30-45 days ahead—we handle the booking hassle.'
      },
      {
        label: 'Door-to-door transfers',
        description: 'Private chauffeur picks you up, drops you at the station, and collects you at your destination.'
      },
      {
        label: 'Curated experiences',
        description: 'Nine Arch Bridge photo stops, tea factory visits, and local culinary experiences included.'
      }
    ]
  },
  experiences: [
    {
      id: 'kandy-ella',
      name: 'Kandy to Ella Express',
      summary: "The world-famous route through tea plantations, waterfalls, and the iconic Nine Arch Bridge.",
      duration: '6-7 hours',
      priceLabel: 'USD 45 per guest',
      level: 'Easy',
      includes: ['Observation car ticket', 'Station transfers', 'Breakfast pack', 'Photo guide', 'Water & snacks'],
      iconName: 'Train',
      image: 'https://images.unsplash.com/photo-1564769610726-63c0b4b07b27?auto=format&fit=crop&w=1400&q=80'
    },
    {
      id: 'ella-haputale',
      name: 'Ella to Haputale Scenic',
      summary: "Short but spectacular journey through tea country with stunning Ella Gap and valley views.",
      duration: '2 hours',
      priceLabel: 'USD 25 per guest',
      level: 'Easy',
      includes: ['First-class ticket', 'Station pickup', 'Tea factory visit', 'Light refreshments'],
      iconName: 'Mountain',
      image: 'https://images.unsplash.com/photo-1588584922681-745a2223f72a?auto=format&fit=crop&w=1400&q=80'
    },
    {
      id: 'colombo-badulla',
      name: 'Colombo to Badulla Full Journey',
      summary: "The complete hill country experience—coastal plains to the highest railway station in Sri Lanka.",
      duration: '9-10 hours',
      priceLabel: 'USD 65 per guest',
      level: 'Moderate',
      includes: ['Reserved seat', 'Full day transfers', 'Packed meals', 'Station lounge access', 'Overnight options'],
      iconName: 'Map',
      image: 'https://images.unsplash.com/photo-1609924211018-ba526e55e6e0?auto=format&fit=crop&w=1400&q=80'
    },
    {
      id: 'kandy-nuwaraeliya',
      name: 'Kandy to Nuwara Eliya',
      summary: "Journey to 'Little England' through breathtaking highland scenery and colonial stations.",
      duration: '4 hours',
      priceLabel: 'USD 35 per guest',
      level: 'Easy',
      includes: ['First-class ticket', 'Hotel transfers', 'Tea tasting', 'Photo stops', 'Refreshments'],
      iconName: 'TreePine',
      image: 'https://images.unsplash.com/photo-1606820846835-91e342c0e5a0?auto=format&fit=crop&w=1400&q=80'
    }
  ],
  combos: [
    {
      id: 'rail-chauffeur',
      name: 'Scenic Rail & Chauffeur Combo',
      badge: 'Best Seller',
      duration: '2 Days / 1 Night',
      priceLabel: 'USD 180 per guest',
      highlights: ['Kandy to Ella train journey', 'Private car pickup/drop-off', 'Boutique hotel stay', 'Nine Arch Bridge visit'],
      includes: ['Observation car tickets', 'Professional chauffeur', 'Hotel booking', 'Station transfers', 'Breakfast'],
      iconName: 'Sparkles'
    },
    {
      id: 'luxury-rail',
      name: 'Luxury Rail Experience',
      badge: 'Premium',
      duration: '1 Day',
      priceLabel: 'USD 120 per guest',
      highlights: ['First-class reserved seats', 'Gourmet packed lunch', 'Station lounge access', 'Professional photography'],
      includes: ['Premium tickets', 'Meals & beverages', 'VIP lounge access', 'Souvenir package', 'Insurance'],
      iconName: 'Crown'
    },
    {
      id: 'hill-adventure',
      name: 'Hill Country Rail Adventure',
      badge: 'Multi-Day',
      duration: '3 Days / 2 Nights',
      priceLabel: 'USD 350 per guest',
      highlights: ['Multiple train journeys', 'Tea factory tours', 'Nine Arch Bridge experience', 'Ella Rock hike option'],
      includes: ['All train tickets', 'Boutique accommodation', 'Guided tours', 'All meals', 'Private transfers'],
      iconName: 'Mountain'
    }
  ],
  logistics: {
    meetingPoint: 'Kandy Railway Station / Colombo Fort Station (based on route)',
    sessionTimes: ['Dawn Express • 5:55 AM', 'Morning Scenic • 8:47 AM', 'Afternoon Journey • 11:10 AM'],
    baseLocation: 'Stations with lounge access, luggage storage, and concierge assistance',
    transferNote: 'Private car transfers from any hotel in Kandy/Colombo. Long-distance pickups available.',
    gearProvided: ['Packed breakfast/lunch', 'Water & snacks', 'Journey map', 'Photo tips guide'],
    bringList: ['Light jacket for hill country', 'Camera with charged battery', 'Motion sickness tablets', 'Small cash for vendors'],
    weatherPolicy: 'Trains operate rain or shine. Mist and cloud add to the atmosphere—no refunds for weather.',
    safetyNote: 'Hold on when at open doors. Keep valuables secure. Follow crew instructions at all times.'
  },
  safety: [
    'Licensed railway operators with safety certification',
    'Concierge support throughout your journey',
    'Emergency contact available 24/7',
    'Travel insurance recommended and available',
    'First-aid kits available on premium services'
  ],
  faqs: [
    {
      id: 'faq-1',
      question: 'How far in advance should I book tickets?',
      answer: 'Observation car tickets should be booked 30-45 days ahead due to high demand. First-class can often be secured 2-3 weeks prior. We handle all bookings for you.'
    },
    {
      id: 'faq-2',
      question: 'Which side of the train has better views?',
      answer: 'On Kandy to Ella, the right side offers better tea plantation and valley views. However, scenery alternates throughout—both sides are spectacular.'
    },
    {
      id: 'faq-3',
      question: 'Can I take photos from the train doors?',
      answer: 'Yes, doors often remain open for dramatic shots. Exercise extreme caution, hold on firmly, and never lean out. This is at your own risk.'
    },
    {
      id: 'faq-4',
      question: 'Are trains punctual?',
      answer: 'Delays are common, especially in peak season. We build buffer time into itineraries and handle any schedule changes for you.'
    },
    {
      id: 'faq-5',
      question: "What's the difference between train classes?",
      answer: 'Observation cars have large windows and AC. First Class has reserved seats with fans. Second Class has reserved seats, basic comfort. Third Class is unreserved, most authentic.'
    }
  ],
  gallery: [
    {
      id: 'gallery-1',
      image: 'https://images.unsplash.com/photo-1564769610726-63c0b4b07b27?auto=format&fit=crop&w=1000&q=80',
      caption: 'Nine Arch Bridge passage'
    },
    {
      id: 'gallery-2',
      image: 'https://images.unsplash.com/photo-1606820846835-91e342c0e5a0?auto=format&fit=crop&w=1000&q=80',
      caption: 'Tea plantation panoramas'
    },
    {
      id: 'gallery-3',
      image: 'https://images.unsplash.com/photo-1588584922681-745a2223f72a?auto=format&fit=crop&w=1000&q=80',
      caption: 'Ella Gap viewpoint'
    },
    {
      id: 'gallery-4',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc63dc26?auto=format&fit=crop&w=1000&q=80',
      caption: 'Local life along the tracks'
    }
  ],
  booking: {
    contactPhone: '+94 777 721 999',
    whatsapp: 'https://wa.me/94777721999',
    email: 'concierge@rechargetravels.com',
    responseTime: 'Replies in under 15 minutes between 6 AM – 10 PM GMT+5:30',
    conciergeNote: 'Share your preferred route and dates—we secure tickets, arrange transfers, and handle all logistics.'
  },
  pricing: {
    currency: 'USD',
    startingPrice: 25,
    depositNote: 'Full payment required once tickets are confirmed. Rescheduling subject to availability.',
    refundPolicy: 'Tickets are non-refundable once purchased. We can attempt resale if notified 7+ days ahead.',
    extrasNote: 'Photography packages, private transfers, and overnight stays available as add-ons.'
  },
  seo: {
    title: 'Scenic Train Journeys Sri Lanka | Kandy to Ella & More | Recharge Travels',
    description:
      "Book Sri Lanka's iconic train rides with concierge service. Kandy to Ella, observation car tickets, and curated rail experiences with premium transfers.",
    keywords: [
      'Sri Lanka train journeys',
      'Kandy to Ella train',
      'Nine Arch Bridge',
      'scenic railway Sri Lanka',
      'observation car tickets',
      'Recharge Travels'
    ],
    ogImage: 'https://images.unsplash.com/photo-1564769610726-63c0b4b07b27?auto=format&fit=crop&w=1200&h=630&q=80'
  }
};

// Legacy type alias for backward compatibility
export type TrainJourneysPageContent = TrainJourneysBookingContent;

class TrainJourneysPageService {
  async getPageContent(): Promise<TrainJourneysBookingContent> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        await setDoc(docRef, defaultTrainJourneysContent);
        return defaultTrainJourneysContent;
      }

      const data = snapshot.data() as Partial<TrainJourneysBookingContent>;

      return {
        ...defaultTrainJourneysContent,
        ...data,
        hero: {
          ...defaultTrainJourneysContent.hero,
          ...(data.hero || {}),
          gallery:
            data.hero?.gallery && data.hero.gallery.length > 0
              ? data.hero.gallery
              : defaultTrainJourneysContent.hero.gallery
        },
        overview: {
          ...defaultTrainJourneysContent.overview,
          ...(data.overview || {}),
          badges: data.overview?.badges && data.overview.badges.length > 0 
            ? data.overview.badges 
            : defaultTrainJourneysContent.overview.badges,
          highlights:
            data.overview?.highlights && data.overview.highlights.length > 0
              ? data.overview.highlights
              : defaultTrainJourneysContent.overview.highlights
        },
        experiences: data.experiences && data.experiences.length > 0 
          ? data.experiences 
          : defaultTrainJourneysContent.experiences,
        combos: data.combos && data.combos.length > 0 
          ? data.combos 
          : defaultTrainJourneysContent.combos,
        logistics: { ...defaultTrainJourneysContent.logistics, ...(data.logistics || {}) },
        safety: data.safety && data.safety.length > 0 
          ? data.safety 
          : defaultTrainJourneysContent.safety,
        faqs: data.faqs && data.faqs.length > 0 
          ? data.faqs 
          : defaultTrainJourneysContent.faqs,
        gallery: data.gallery && data.gallery.length > 0 
          ? data.gallery 
          : defaultTrainJourneysContent.gallery,
        booking: { ...defaultTrainJourneysContent.booking, ...(data.booking || {}) },
        pricing: { ...defaultTrainJourneysContent.pricing, ...(data.pricing || {}) },
        seo: { ...defaultTrainJourneysContent.seo, ...(data.seo || {}) }
      };
    } catch (error) {
      console.error('Error fetching train journeys content:', error);
      return defaultTrainJourneysContent;
    }
  }

  async saveContent(content: Partial<TrainJourneysBookingContent>): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      await setDoc(docRef, content, { merge: true });
      return true;
    } catch (error) {
      console.error('Error saving train journeys content:', error);
      return false;
    }
  }

  getDefaultContent(): TrainJourneysBookingContent {
    return defaultTrainJourneysContent;
  }
}

export const trainJourneysPageService = new TrainJourneysPageService();
export default trainJourneysPageService;
