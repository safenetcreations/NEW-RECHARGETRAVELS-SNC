import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION_NAME = 'pageContent';
const DOC_ID = 'private-charters';

export interface AdminHeroSlide {
  id: string;
  image: string;
  caption: string;
  tag?: string;
}

export interface AdminOverviewHighlight {
  id: string;
  label: string;
  description: string;
}

export interface AdminStatChip {
  id: string;
  iconName: string;
  label: string;
  value: string;
}

export interface AdminFleetAsset {
  id: string;
  name: string;
  vesselType: string;
  capacity: string;
  range: string;
  priceLabel: string;
  iconName: string;
  image: string;
  highlights: string[];
  hospitality: string[];
}

export interface AdminSignatureJourney {
  id: string;
  title: string;
  duration: string;
  route: string;
  description: string;
  services: string[];
}

export interface AdminServiceTier {
  id: string;
  name: string;
  iconName: string;
  description: string;
  deliverables: string[];
}

export type AdminMicroFormFieldType = 'text' | 'date' | 'select' | 'number';

export interface AdminHeroMicroFormField {
  id: string;
  label: string;
  type: AdminMicroFormFieldType;
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
}

export interface AdminHeroMicroForm {
  heading: string;
  subheading: string;
  submitLabel: string;
  successMessage: string;
  fields: AdminHeroMicroFormField[];
}

export interface AdminMissionTimelineEntry {
  id: string;
  title: string;
  timestamp: string;
  description: string;
  iconName: string;
  quote?: string;
}

export interface AdminCrewHighlight {
  id: string;
  name: string;
  role: string;
  bio: string;
  badges: string[];
  image?: string;
}

export interface AdminLifestyleRitual {
  id: string;
  title: string;
  description: string;
  iconName: string;
  tag?: string;
}

export interface AdminBookingInfo {
  conciergeNote: string;
  contactPhone: string;
  whatsapp: string;
  email: string;
  responseTime: string;
  isLive: boolean;
  nextAvailabilityWindow: string;
  depositNote: string;
  contractNote: string;
}

export interface AdminPricingInfo {
  currency: string;
  yachtMinimum: number;
  jetMinimum: number;
  helicopterMinimum: number;
  addOns: string[];
}

export interface AdminGalleryImage {
  id: string;
  image: string;
  caption: string;
}

export interface AdminFAQEntry {
  id: string;
  question: string;
  answer: string;
}

export interface AdminPrivateChartersContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaText: string;
    videoUrl?: string;
    videoPoster?: string;
    images: AdminHeroSlide[];
    microForm: AdminHeroMicroForm;
  };
  overview: {
    summary: string;
    highlights: AdminOverviewHighlight[];
  };
  stats: AdminStatChip[];
  fleet: AdminFleetAsset[];
  journeys: AdminSignatureJourney[];
  serviceTiers: AdminServiceTier[];
  missions: AdminMissionTimelineEntry[];
  crew: AdminCrewHighlight[];
  rituals: AdminLifestyleRitual[];
  booking: AdminBookingInfo;
  pricing: AdminPricingInfo;
  gallery: AdminGalleryImage[];
  testimonials: {
    quote: string;
    author: string;
  }[];
  partners: string[];
  faqs: AdminFAQEntry[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
}

export const defaultPrivateChartersAdminContent: AdminPrivateChartersContent = {
  hero: {
    badge: 'Private Charter Desk',
    title: 'Indian Ocean Private Charters',
    subtitle:
      'Superyachts, Gulfstream jets, and twin-engine helicopters on 24/7 standby for bespoke Sri Lankan journeys.',
    ctaText: 'Request a charter plan',
    videoUrl: '',
    videoPoster: '',
    images: [],
    microForm: {
      heading: 'Need a manifest in motion?',
      subheading: 'Share three details and our desk will hold the right asset while you finish this page.',
      submitLabel: 'Send to concierge',
      successMessage: 'Merci — concierge desk received your manifest and will respond within 15 minutes.',
      fields: [
        { id: 'date', label: 'Preferred date', type: 'date' },
        { id: 'asset', label: 'Asset focus', type: 'select', options: ['Superyacht', 'Private Jet', 'Helicopter', 'Multi-modal'], defaultValue: 'Superyacht' },
        { id: 'guests', label: 'Guests', type: 'number', placeholder: 'e.g. 8' }
      ]
    }
  },
  overview: {
    summary: '',
    highlights: []
  },
  stats: [],
  fleet: [],
  journeys: [],
  serviceTiers: [],
  missions: [],
  crew: [],
  rituals: [],
  booking: {
    conciergeNote: '',
    contactPhone: '+94 77 772 1999',
    whatsapp: 'https://wa.me/94777721999',
    email: 'charters@rechargetravels.com',
    responseTime: 'Replies within 15 minutes · 24/7 ops desk',
    isLive: true,
    nextAvailabilityWindow: 'Sunrise dispatch window · 05:30 GMT+5:30',
    depositNote: '50% deposit required to release charter order.',
    contractNote: ''
  },
  pricing: {
    currency: 'USD',
    yachtMinimum: 0,
    jetMinimum: 0,
    helicopterMinimum: 0,
    addOns: []
  },
  gallery: [],
  testimonials: [],
  partners: [],
  faqs: [],
  seo: {
    title: 'Private Charters Sri Lanka | Superyacht, Jet & Helicopter Concierge',
    description: '',
    keywords: [],
    ogImage: ''
  }
};

class PrivateChartersAdminService {
  async getContent(): Promise<AdminPrivateChartersContent> {
    try {
      const ref = doc(db, COLLECTION_NAME, DOC_ID);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        return snap.data() as AdminPrivateChartersContent;
      }
      await this.save(defaultPrivateChartersAdminContent);
      return defaultPrivateChartersAdminContent;
    } catch (error) {
      console.error('Error fetching private charters admin content:', error);
      return defaultPrivateChartersAdminContent;
    }
  }

  async save(content: AdminPrivateChartersContent): Promise<void> {
    const ref = doc(db, COLLECTION_NAME, DOC_ID);
    await setDoc(ref, { ...content, updatedAt: serverTimestamp() });
  }
}

export const privateChartersAdminService = new PrivateChartersAdminService();
