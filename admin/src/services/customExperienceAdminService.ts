import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const COLLECTION = 'customExperiencePage';
const DOC_ID = 'content';

// Types matching the frontend service
export interface AdminCustomHeroSlide {
  image: string;
  caption: string;
  tag?: string;
}

export interface AdminCustomBadge {
  label: string;
  value: string;
  iconName: string;
}

export interface AdminCustomHighlight {
  label: string;
  description: string;
}

export interface AdminCustomExperienceType {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface AdminCustomBenefit {
  id: string;
  title: string;
  description: string;
  image: string;
  icon?: string;
}

export interface AdminCustomTestimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  avatar: string;
  tripType?: string;
}

export interface AdminCustomBookingInfo {
  contactPhone: string;
  whatsapp: string;
  email: string;
  responseTime: string;
  conciergeNote: string;
}

export interface AdminCustomExperienceContent {
  hero: {
    title: string;
    subtitle: string;
    badge: string;
    gallery: AdminCustomHeroSlide[];
  };
  overview: {
    summary: string;
    badges: AdminCustomBadge[];
    highlights: AdminCustomHighlight[];
  };
  experienceTypes: AdminCustomExperienceType[];
  benefits: AdminCustomBenefit[];
  testimonials: AdminCustomTestimonial[];
  formConfig: {
    enabledFields: string[];
    customQuestions: Array<{
      id: string;
      question: string;
      type: 'text' | 'textarea' | 'select' | 'multiselect';
      options?: string[];
      required: boolean;
    }>;
  };
  booking: AdminCustomBookingInfo;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
}

export const defaultAdminCustomExperienceContent: AdminCustomExperienceContent = {
  hero: {
    title: 'Design Your Dream Sri Lanka',
    subtitle: 'Concierge-crafted itineraries blending wildlife, culture, tea trails, and oceanside bliss.',
    badge: 'Bespoke Travel Concierge',
    gallery: [
      {
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2000&q=80',
        caption: 'Your journey awaits',
        tag: 'Personalized'
      }
    ]
  },
  overview: {
    summary: 'Share your travel dreams, and our Sri Lanka-based concierge team will design every day of your journey.',
    badges: [
      { label: 'Trips Designed', value: '500+', iconName: 'Compass' },
      { label: 'Guest Rating', value: '4.97/5', iconName: 'Star' }
    ],
    highlights: [
      { label: 'Dedicated travel designer', description: 'One expert planner handles your entire trip.' }
    ]
  },
  experienceTypes: [
    { id: '1', icon: '🦁', title: 'Wildlife Safaris', description: 'Private jeeps in Yala, Wilpattu & Minneriya' }
  ],
  benefits: [
    {
      id: '1',
      title: 'Dedicated concierge',
      description: 'Sri Lanka based experts craft every day.',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
      icon: '✨'
    }
  ],
  testimonials: [
    {
      id: '1',
      name: 'Nisha & Devin',
      location: 'Toronto, Canada',
      text: 'Recharge built a 12-day honeymoon across tea country. Absolutely perfect.',
      rating: 5,
      avatar: 'https://i.pravatar.cc/120?img=45',
      tripType: 'Honeymoon'
    }
  ],
  formConfig: {
    enabledFields: ['all'],
    customQuestions: []
  },
  booking: {
    contactPhone: '+94 777 721 999',
    whatsapp: 'https://wa.me/94777721999',
    email: 'concierge@rechargetravels.com',
    responseTime: 'Replies within 12 hours',
    conciergeNote: 'Share your travel dates, group size, budget, and dream experiences.'
  },
  seo: {
    title: 'Custom Sri Lanka Travel | Recharge Travels',
    description: 'Design your perfect Sri Lanka trip with our dedicated travel concierge.',
    keywords: ['custom Sri Lanka tour', 'bespoke travel Sri Lanka'],
    ogImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&h=630&q=80'
  }
};

class CustomExperienceAdminService {
  async getContent(): Promise<AdminCustomExperienceContent> {
    try {
      const docRef = doc(db, COLLECTION, DOC_ID);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        await setDoc(docRef, defaultAdminCustomExperienceContent);
        return defaultAdminCustomExperienceContent;
      }

      const data = snapshot.data() as Partial<AdminCustomExperienceContent>;

      return {
        ...defaultAdminCustomExperienceContent,
        ...data,
        hero: {
          ...defaultAdminCustomExperienceContent.hero,
          ...(data.hero || {}),
          gallery:
            data.hero?.gallery && data.hero.gallery.length > 0
              ? data.hero.gallery
              : defaultAdminCustomExperienceContent.hero.gallery
        },
        overview: {
          ...defaultAdminCustomExperienceContent.overview,
          ...(data.overview || {}),
          badges:
            data.overview?.badges && data.overview.badges.length > 0
              ? data.overview.badges
              : defaultAdminCustomExperienceContent.overview.badges,
          highlights:
            data.overview?.highlights && data.overview.highlights.length > 0
              ? data.overview.highlights
              : defaultAdminCustomExperienceContent.overview.highlights
        },
        experienceTypes:
          data.experienceTypes && data.experienceTypes.length > 0
            ? data.experienceTypes
            : defaultAdminCustomExperienceContent.experienceTypes,
        benefits:
          data.benefits && data.benefits.length > 0
            ? data.benefits
            : defaultAdminCustomExperienceContent.benefits,
        testimonials:
          data.testimonials && data.testimonials.length > 0
            ? data.testimonials
            : defaultAdminCustomExperienceContent.testimonials,
        formConfig: { ...defaultAdminCustomExperienceContent.formConfig, ...(data.formConfig || {}) },
        booking: { ...defaultAdminCustomExperienceContent.booking, ...(data.booking || {}) },
        seo: { ...defaultAdminCustomExperienceContent.seo, ...(data.seo || {}) }
      };
    } catch (error) {
      console.error('Error fetching custom experience admin content:', error);
      return defaultAdminCustomExperienceContent;
    }
  }

  async saveContent(content: Partial<AdminCustomExperienceContent>): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION, DOC_ID);
      await setDoc(docRef, content, { merge: true });
      return true;
    } catch (error) {
      console.error('Error saving custom experience admin content:', error);
      return false;
    }
  }
}

export const customExperienceAdminService = new CustomExperienceAdminService();
export default customExperienceAdminService;







