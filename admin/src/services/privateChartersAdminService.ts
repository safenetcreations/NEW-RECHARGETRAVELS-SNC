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
    badge: 'Ultra-Private Concierge',
    title: 'Where Billionaires Escape',
    subtitle:
      'Superyachts. Gulfstreams. Helicopters. Palatial villas. Your Indian Ocean odyssey begins with a single message to our 24/7 billionaire desk.',
    ctaText: 'Summon the Concierge',
    videoUrl: '',
    videoPoster: '',
    images: [],
    microForm: {
      heading: 'Your Manifest Awaits',
      subheading: 'Three details. One message. Your asset held within minutes.',
      submitLabel: 'Dispatch Now',
      successMessage: 'Merci — Your dedicated concierge is preparing your manifest. Expect contact within 12 minutes.',
      fields: [
        { id: 'date', label: 'Departure window', type: 'date', placeholder: 'When shall we ready the fleet?' },
        { id: 'asset', label: 'Primary asset', type: 'select', options: ['Superyacht', 'Gulfstream Jet', 'Executive Helicopter', 'Multi-Asset Journey'], defaultValue: 'Superyacht' },
        { id: 'guests', label: 'Party size', type: 'number', placeholder: 'e.g. 8' }
      ]
    }
  },
  overview: {
    summary: 'For those who measure time in experiences, not hours. Recharge commands a private armada across the Indian Ocean—superyachts, Gulfstream jets, executive helicopters, and palatial residences—all orchestrated by a single concierge who answers only to you.',
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
    conciergeNote: 'One message to summon the fleet. Share your travel window, party size, and lifestyle preferences. Your dedicated concierge returns within 12 minutes with asset options, flight plans, and provisional holds—ready for your command.',
    contactPhone: '+94 77 772 1999',
    whatsapp: 'https://wa.me/94777721999',
    email: 'elite@rechargetravels.com',
    responseTime: 'Response in <12 minutes · 24/7 Global Ops',
    isLive: true,
    nextAvailabilityWindow: 'Next dispatch window: Immediate',
    depositNote: '50% to secure your manifest · Balance due 72 hours prior or on dispatch for same-day requests.',
    contractNote: 'Digital contracts via DocuSign · Full insurance certificates & crew manifests attached.'
  },
  pricing: {
    currency: 'USD',
    yachtMinimum: 18500,
    jetMinimum: 12800,
    helicopterMinimum: 6200,
    addOns: ['Michelin guest chef residencies', 'Celebrity DJ & entertainment', 'Bio-hacking wellness labs', 'Private security detail', 'Documentary film crew']
  },
  gallery: [],
  testimonials: [],
  partners: ['Benetti', 'Gulfstream', 'Airbus Corporate Jets', 'VistaJet', 'Aman Resorts', 'Four Seasons'],
  faqs: [],
  seo: {
    title: 'Billionaire Concierge Sri Lanka | Superyacht, Private Jet & Helicopter Charter',
    description: 'The ultimate private concierge for UHNW travelers. Superyachts, Gulfstream jets, executive helicopters, and palatial villas—orchestrated by a single desk that answers only to you.',
    keywords: ['billionaire travel Sri Lanka', 'UHNW concierge service', 'private yacht charter Indian Ocean', 'Gulfstream charter Sri Lanka'],
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
