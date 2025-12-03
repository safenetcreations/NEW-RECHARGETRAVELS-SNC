import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const COLLECTION = 'cookingClassBookingContent';
const DOC_ID = 'cooking-class-sri-lanka';

// Types matching the frontend service
export interface AdminCookingHeroSlide {
  image: string;
  caption: string;
  tag?: string;
}

export interface AdminCookingBadge {
  label: string;
  value: string;
  iconName: string;
}

export interface AdminCookingHighlight {
  label: string;
  description: string;
}

export interface AdminCookingExperience {
  id: string;
  name: string;
  city: string;
  summary: string;
  duration: string;
  priceLabel: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  includes: string[];
  image?: string;
  iconName: string;
  rating: number;
  reviews: number;
}

export interface AdminCookingCombo {
  id: string;
  name: string;
  badge: string;
  duration: string;
  priceLabel: string;
  highlights: string[];
  includes: string[];
  iconName: string;
}

export interface AdminCookingLogistics {
  meetingPoint: string;
  sessionTimes: string[];
  baseLocation: string;
  transferNote: string;
  gearProvided: string[];
  bringList: string[];
  dietaryNote: string;
  safetyNote: string;
}

export interface AdminCookingFaq {
  id: string;
  question: string;
  answer: string;
}

export interface AdminCookingGalleryImage {
  id: string;
  image: string;
  caption: string;
}

export interface AdminCookingBookingInfo {
  contactPhone: string;
  whatsapp: string;
  email: string;
  responseTime: string;
  conciergeNote: string;
}

export interface AdminCookingPricing {
  currency: string;
  startingPrice: number;
  depositNote: string;
  refundPolicy: string;
  extrasNote: string;
}

export interface AdminCookingClassContent {
  hero: {
    title: string;
    subtitle: string;
    badge: string;
    gallery: AdminCookingHeroSlide[];
  };
  overview: {
    summary: string;
    badges: AdminCookingBadge[];
    highlights: AdminCookingHighlight[];
  };
  experiences: AdminCookingExperience[];
  combos: AdminCookingCombo[];
  logistics: AdminCookingLogistics;
  chefCredentials: string[];
  faqs: AdminCookingFaq[];
  gallery: AdminCookingGalleryImage[];
  booking: AdminCookingBookingInfo;
  pricing: AdminCookingPricing;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
}

export const defaultAdminCookingClassContent: AdminCookingClassContent = {
  hero: {
    title: 'Sri Lankan Cooking Classes',
    subtitle: 'Master the art of Ceylon cuisine with local chefs.',
    badge: 'Culinary Experiences',
    gallery: [
      {
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=2000&q=80',
        caption: 'Fresh Spice Preparation',
        tag: 'Hands-On'
      }
    ]
  },
  overview: {
    summary: 'Our cooking experiences go beyond recipes—visit local markets, pick fresh ingredients, and cook alongside home chefs.',
    badges: [
      { label: 'Locations', value: '7+', iconName: 'MapPin' },
      { label: 'Dishes', value: '30+', iconName: 'UtensilsCrossed' }
    ],
    highlights: [
      { label: 'Market-to-table experience', description: 'Visit bustling local markets, select fresh seafood and spices.' }
    ]
  },
  experiences: [
    {
      id: 'colombo-cooking',
      name: 'Urban Flavors & Seafood Market Tour',
      city: 'Colombo',
      summary: 'Dive into the bustling Pettah market.',
      duration: '4 Hours',
      priceLabel: 'USD 55 per guest',
      level: 'All Levels',
      includes: ['Pettah Market visit', 'Crab curry masterclass'],
      iconName: 'Building',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=80',
      rating: 4.8,
      reviews: 124
    }
  ],
  combos: [
    {
      id: 'culinary-trail',
      name: 'Ceylon Culinary Trail',
      badge: 'Best Seller',
      duration: '3 Days / 2 Nights',
      priceLabel: 'USD 280 per guest',
      highlights: ['3 cooking classes in 3 cities'],
      includes: ['All cooking classes', 'Accommodation'],
      iconName: 'Sparkles'
    }
  ],
  logistics: {
    meetingPoint: 'Hotel pickup available in all cities',
    sessionTimes: ['Morning Session • 9:00 AM', 'Afternoon Session • 2:00 PM'],
    baseLocation: 'Traditional homes and boutique kitchens',
    transferNote: 'Complimentary hotel pickup within city limits.',
    gearProvided: ['Apron', 'All cooking equipment', 'Ingredients'],
    bringList: ['Comfortable clothes', 'Camera', 'Appetite!'],
    dietaryNote: 'Vegetarian, vegan, and gluten-free options available.',
    safetyNote: 'All kitchens meet hygiene standards.'
  },
  chefCredentials: [
    'All chefs are certified food handlers with 5+ years experience',
    'Home cooks trained in traditional family recipes'
  ],
  faqs: [
    {
      id: 'faq-1',
      question: 'Do I need cooking experience?',
      answer: 'Not at all! Our classes are designed for all skill levels.'
    }
  ],
  gallery: [
    {
      id: 'gallery-1',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1000&q=80',
      caption: 'Grinding fresh spices'
    }
  ],
  booking: {
    contactPhone: '+94 777 721 999',
    whatsapp: 'https://wa.me/94777721999',
    email: 'concierge@rechargetravels.com',
    responseTime: 'Replies in under 15 minutes',
    conciergeNote: 'Share your preferred city, date, and dietary requirements.'
  },
  pricing: {
    currency: 'USD',
    startingPrice: 45,
    depositNote: '50% deposit secures your spot.',
    refundPolicy: 'Free cancellation up to 48 hours before.',
    extrasNote: 'Private sessions and hotel transfers available.'
  },
  seo: {
    title: 'Sri Lankan Cooking Classes | Recharge Travels',
    description: 'Join authentic Sri Lankan cooking classes across the island.',
    keywords: ['Sri Lanka cooking class', 'Ceylon culinary experience'],
    ogImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&h=630&q=80'
  }
};

class CookingClassAdminService {
  async getContent(): Promise<AdminCookingClassContent> {
    try {
      const docRef = doc(db, COLLECTION, DOC_ID);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        await setDoc(docRef, defaultAdminCookingClassContent);
        return defaultAdminCookingClassContent;
      }

      const data = snapshot.data() as Partial<AdminCookingClassContent>;

      return {
        ...defaultAdminCookingClassContent,
        ...data,
        hero: {
          ...defaultAdminCookingClassContent.hero,
          ...(data.hero || {}),
          gallery:
            data.hero?.gallery && data.hero.gallery.length > 0
              ? data.hero.gallery
              : defaultAdminCookingClassContent.hero.gallery
        },
        overview: {
          ...defaultAdminCookingClassContent.overview,
          ...(data.overview || {}),
          badges:
            data.overview?.badges && data.overview.badges.length > 0
              ? data.overview.badges
              : defaultAdminCookingClassContent.overview.badges,
          highlights:
            data.overview?.highlights && data.overview.highlights.length > 0
              ? data.overview.highlights
              : defaultAdminCookingClassContent.overview.highlights
        },
        experiences:
          data.experiences && data.experiences.length > 0
            ? data.experiences
            : defaultAdminCookingClassContent.experiences,
        combos:
          data.combos && data.combos.length > 0
            ? data.combos
            : defaultAdminCookingClassContent.combos,
        logistics: { ...defaultAdminCookingClassContent.logistics, ...(data.logistics || {}) },
        chefCredentials:
          data.chefCredentials && data.chefCredentials.length > 0
            ? data.chefCredentials
            : defaultAdminCookingClassContent.chefCredentials,
        faqs: data.faqs && data.faqs.length > 0 ? data.faqs : defaultAdminCookingClassContent.faqs,
        gallery:
          data.gallery && data.gallery.length > 0 ? data.gallery : defaultAdminCookingClassContent.gallery,
        booking: { ...defaultAdminCookingClassContent.booking, ...(data.booking || {}) },
        pricing: { ...defaultAdminCookingClassContent.pricing, ...(data.pricing || {}) },
        seo: { ...defaultAdminCookingClassContent.seo, ...(data.seo || {}) }
      };
    } catch (error) {
      console.error('Error fetching cooking class admin content:', error);
      return defaultAdminCookingClassContent;
    }
  }

  async saveContent(content: Partial<AdminCookingClassContent>): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION, DOC_ID);
      await setDoc(docRef, content, { merge: true });
      return true;
    } catch (error) {
      console.error('Error saving cooking class admin content:', error);
      return false;
    }
  }
}

export const cookingClassAdminService = new CookingClassAdminService();
export default cookingClassAdminService;







