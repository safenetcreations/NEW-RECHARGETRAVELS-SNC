import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION_NAME = 'pageContent';
const DOC_ID = 'private-charters';

export interface HeroSlide {
  id: string;
  image: string;
  caption: string;
  tag?: string;
}

export interface OverviewHighlight {
  id: string;
  label: string;
  description: string;
}

export interface StatChip {
  id: string;
  iconName: string;
  label: string;
  value: string;
}

export interface FleetAsset {
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

export interface SignatureJourney {
  id: string;
  title: string;
  duration: string;
  route: string;
  description: string;
  services: string[];
}

export interface ServiceTier {
  id: string;
  name: string;
  iconName: string;
  description: string;
  deliverables: string[];
}

export type MicroFormFieldType = 'text' | 'date' | 'select' | 'number';

export interface HeroMicroFormField {
  id: string;
  label: string;
  type: MicroFormFieldType;
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
}

export interface HeroMicroForm {
  heading: string;
  subheading: string;
  submitLabel: string;
  successMessage: string;
  fields: HeroMicroFormField[];
}

export interface MissionTimelineEntry {
  id: string;
  title: string;
  timestamp: string;
  description: string;
  iconName: string;
  quote?: string;
}

export interface CrewHighlight {
  id: string;
  name: string;
  role: string;
  bio: string;
  badges: string[];
  image?: string;
}

export interface LifestyleRitual {
  id: string;
  title: string;
  description: string;
  iconName: string;
  tag?: string;
}

export interface BookingInfo {
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

export interface PricingInfo {
  currency: string;
  yachtMinimum: number;
  jetMinimum: number;
  helicopterMinimum: number;
  addOns: string[];
}

export interface GalleryImage {
  id: string;
  image: string;
  caption: string;
}

export interface FAQEntry {
  id: string;
  question: string;
  answer: string;
}

export interface PrivateChartersPageContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaText: string;
    videoUrl?: string;
    videoPoster?: string;
    images: HeroSlide[];
    microForm: HeroMicroForm;
  };
  overview: {
    summary: string;
    highlights: OverviewHighlight[];
  };
  stats: StatChip[];
  fleet: FleetAsset[];
  journeys: SignatureJourney[];
  serviceTiers: ServiceTier[];
  missions: MissionTimelineEntry[];
  crew: CrewHighlight[];
  rituals: LifestyleRitual[];
  booking: BookingInfo;
  pricing: PricingInfo;
  gallery: GalleryImage[];
  testimonials: {
    quote: string;
    author: string;
  }[];
  partners: string[];
  faqs: FAQEntry[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
  updatedAt?: any;
}

const defaultContent: PrivateChartersPageContent = {
  hero: {
    badge: 'Private Charter Desk',
    title: 'Indian Ocean Private Charters',
    subtitle:
      'Superyachts, Gulfstream jets, and twin-engine helicopters on 24/7 standby for bespoke Sri Lankan journeys.',
    ctaText: 'Request a charter plan',
    videoUrl: 'https://cdn.coverr.co/videos/coverr-super-yacht-at-sunset-9339/1080p.mp4',
    videoPoster: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2000&q=80',
    images: [
      {
        id: 'hero-1',
        image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2000&q=80',
        caption: 'Sunset departures from Colombo Port City',
        tag: 'Superyacht fleet'
      },
      {
        id: 'hero-2',
        image: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=2000&q=80',
        caption: 'Dassault and Gulfstream ready rampside',
        tag: 'Private jets'
      },
      {
        id: 'hero-3',
        image: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=2000&q=80',
        caption: 'Twin-engine heli transfers to south coast villas',
        tag: 'Helicopter shuttle'
      }
    ],
    microForm: {
      heading: 'Need a manifest in motion?',
      subheading: 'Share three details and our desk will hold the right asset while you finish this page.',
      submitLabel: 'Send to concierge',
      successMessage: 'Merci — concierge desk received your manifest and will respond within 15 minutes.',
      fields: [
        {
          id: 'date',
          label: 'Preferred date',
          type: 'date',
          placeholder: 'Select a target departure'
        },
        {
          id: 'asset',
          label: 'Asset focus',
          type: 'select',
          options: ['Superyacht', 'Private Jet', 'Helicopter', 'Multi-modal'],
          defaultValue: 'Superyacht'
        },
        {
          id: 'guests',
          label: 'Guests',
          type: 'number',
          placeholder: 'e.g. 8'
        }
      ]
    }
  },
  overview: {
    summary:
      'Recharge Travels maintains a vetted fleet of yachts, jets, helicopters, and VIP ground assets stationed across Sri Lanka, the Maldives, and Southern India. Our concierge pilots every itinerary from manifest to customs fast-track so you only focus on arrival playlists and champagne toasts.',
    highlights: [
      {
        id: 'hl-1',
        label: '24/7 charter desk',
        description: 'Marine and aviation ops teams on-call with 45-minute dispatch windows for urgent missions.'
      },
      {
        id: 'hl-2',
        label: 'Design-first itineraries',
        description: 'Combine yachts, seaplanes, sleeper trains, and jungle lodges under one concierge invoice.'
      },
      {
        id: 'hl-3',
        label: 'Bespoke hospitality',
        description: 'Onboard butlers, mixologists, and wellness coaches curated per guest preferences.'
      }
    ]
  },
  stats: [
    { id: 'stat-1', iconName: 'Ship', label: 'Superyachts on call', value: '12' },
    { id: 'stat-2', iconName: 'Plane', label: 'Jet categories', value: '5' },
    { id: 'stat-3', iconName: 'Clock', label: 'Average dispatch', value: '45 min' },
    { id: 'stat-4', iconName: 'Users', label: 'Guest satisfaction', value: '4.97/5' }
  ],
  fleet: [
    {
      id: 'fleet-yacht',
      name: 'MY Serendipity',
      vesselType: '40m Benetti superyacht',
      capacity: '10 guests · 7 crew',
      range: 'Cruising 12 kts · 1,500 nm',
      priceLabel: 'USD 16,000 per day + APA',
      iconName: 'Anchor',
      image: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1600&q=80',
      highlights: ['4 ensuite staterooms', 'Beach club with Seabobs + e-foils', 'Williams tender + chase boat'],
      hospitality: ['Executive chef + pastry team', 'Onboard mixologist', 'Wellness therapist & IV lounge']
    },
    {
      id: 'fleet-jet',
      name: 'Gulfstream G600',
      vesselType: 'Ultra-long-range jet',
      capacity: '13 passengers',
      range: '6,600 nm nonstop',
      priceLabel: 'USD 9,800 per block hour',
      iconName: 'Plane',
      image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80',
      highlights: ['Full-size galley with chef plating', 'Ka-band Wi-Fi + video conferencing', ' lie-flat suites'],
      hospitality: ['ISS-certified cabin crew', 'Onboard sommelier cellar', 'Signature Sri Lankan wellness menu']
    },
    {
      id: 'fleet-heli',
      name: 'Airbus H145 Luxury Shuttle',
      vesselType: 'Twin-engine helicopter',
      capacity: '8 passengers',
      range: '370 nm · IFR capable',
      priceLabel: 'USD 5,400 per flight hour',
      iconName: 'Navigation',
      image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
      highlights: ['Noise-cancelling interiors', 'Oversized baggage hold', 'Night-vision equipped crew'],
      hospitality: ['Concierge manifests & customs', 'Cold-pressed juice program', 'Luxury vehicle crossover on landing']
    }
  ],
  journeys: [
    {
      id: 'journey-1',
      title: 'Tea Country to Atoll Weekender',
      duration: '4 days',
      route: 'Colombo → Castlereagh → Maldives',
      description:
        'Sunrise helicopter from Colombo to Ceylon Tea Trails, sunset Gulfstream hop to Malé, and superyacht hop between private atolls with onboard chef collaborations.',
      services: ['Helicopter transfer', 'Heritage bungalow buyout', 'Gulfstream charter', 'Benetti yacht with spa crew']
    },
    {
      id: 'journey-2',
      title: 'Wild Coast Grand Circle',
      duration: '7 days',
      route: 'Colombo → Yala → Trincomalee → Sigiriya',
      description:
        'Twin-engine heli to safari lodge, coastal yacht convoy to east coast, catamaran dive days, and private hot-air balloon over Lion Rock.',
      services: ['Heli + safari logistics', 'Yacht convoy + dive masters', 'Seaplane night transfer', 'Balloon charter + proposal setups']
    },
    {
      id: 'journey-3',
      title: 'Executive Roadshow Express',
      duration: '48 hours',
      route: 'Chennai → Colombo → Galle → Bangalore',
      description:
        'Corporate deck schedules for board meetings, site inspections, and partner dinners executed via jet, heli, and armored convoys with rolling boardrooms.',
      services: ['Gulfstream shuttle', 'Armored Mercedes fleet', 'Onboard boardroom fitout', 'Concierge security + customs fast-track']
    }
  ],
  serviceTiers: [
    {
      id: 'tier-1',
      name: 'Ocean Residences',
      iconName: 'Waves',
      description: 'Superyachts, expedition vessels, and luxury catamarans stationed across Sri Lanka & Maldives.',
      deliverables: ['APA management & provisioning', 'Chef rotations & mixology takeovers', 'Submersible + toy concierge']
    },
    {
      id: 'tier-2',
      name: 'Sky Studio',
      iconName: 'Cloud',
      description: 'Jet, turboprop, and helicopter programmes with global handling partners.',
      deliverables: ['Flight planning + permits', 'Onboard wellness & menus', 'Runway-to-villa transfers + customs liaison']
    },
    {
      id: 'tier-3',
      name: 'Ground Luxury',
      iconName: 'Car',
      description: 'Armored convoys, vintage convertibles, and chauffeur concierge for gala arrivals.',
      deliverables: ['Security coordination', 'Event styling + red carpet', 'Champagne welcome + luggage butlers']
    }
  ],
  missions: [
    {
      id: 'mission-1',
      title: 'Manifest received',
      timestamp: '16:05 GMT+5:30',
      description: 'UHNW couple requested Colombo departure, Maldives arrival, wellness chef onboard.',
      iconName: 'Inbox',
      quote: '“Hold the G600 and Serendipity; chef to draft plant-based menu.”'
    },
    {
      id: 'mission-2',
      title: 'Heli intercept',
      timestamp: '17:10 GMT+5:30',
      description: 'Airbus H145 whisked guests from Port City helipad to waiting Gulfstream.',
      iconName: 'Navigation',
      quote: 'Captain Liyanage cleared Colombo airspace in 6 minutes.'
    },
    {
      id: 'mission-3',
      title: 'Jet to Maldives',
      timestamp: '18:05 GMT+5:30',
      description: 'G600 hop with IV lounge + sommelier pairing; customs pre-cleared for Malé.',
      iconName: 'Plane',
      quote: '“Wheels up to champagne sabrage in 67 minutes.”'
    },
    {
      id: 'mission-4',
      title: 'Yacht sabrage',
      timestamp: '19:30 GMT+5:30',
      description: 'Benetti Serendipity anchored off private atoll with DJ + seaplane drone crew.',
      iconName: 'Anchor',
      quote: 'Guests greeted by butler team & Dom Pérignon sabrage.'
    }
  ],
  crew: [
    {
      id: 'crew-1',
      name: 'Capt. Nalaka Liyanage',
      role: 'Master Captain · Benetti Fleet',
      bio: '20 years on Indian Ocean routes with ISM + ISPS certifications, speaks 4 languages.',
      badges: ['ISPS', 'MCA Master 3000', 'Night-vision certified']
    },
    {
      id: 'crew-2',
      name: 'Anika Perera',
      role: 'Chief Steward & Mixologist',
      bio: 'Former Aman sommelier curating Michelin collaborations and bespoke bar programs.',
      badges: ['WSET 3', 'Forbes Five-Star alumni']
    },
    {
      id: 'crew-3',
      name: 'Dr. Julien Armand',
      role: 'Wellness Director',
      bio: 'Leads onboard IV therapy, breathwork, and bio-hacking rituals with medical oversight.',
      badges: ['Functional Med MD', 'Ex-Lanserhof']
    }
  ],
  rituals: [
    {
      id: 'ritual-1',
      title: 'Wellness lab',
      description: 'Cold plunge, red-light therapy, and IV drips staged on the sundeck.',
      iconName: 'HeartPulse',
      tag: 'Bio-hacking'
    },
    {
      id: 'ritual-2',
      title: 'Sabrage & sound',
      description: 'Champagne sabrage synchronized with live DJ + crystal bowl sound baths.',
      iconName: 'Music',
      tag: 'Celebration'
    },
    {
      id: 'ritual-3',
      title: 'Armored transfers',
      description: 'Bentley + Defender convoys with discreet executive protection.',
      iconName: 'Shield',
      tag: 'Security'
    }
  ],
  booking: {
    conciergeNote:
      'Email or WhatsApp our charter desk with preferred dates, passenger manifest, and lifestyle notes. We return within 15 minutes with proposed assets, flight plans, and provisional holds.',
    contactPhone: '+94 77 772 1999',
    whatsapp: 'https://wa.me/94777721999',
    email: 'charters@rechargetravels.com',
    responseTime: 'Replies within 15 minutes · 24/7 ops desk',
    isLive: true,
    nextAvailabilityWindow: 'Sunrise dispatch window · 05:30 GMT+5:30',
    depositNote: '50% deposit to release charter order · balance due 7 days prior or on dispatch for short-notice trips.',
    contractNote: 'Contracts issued electronically with DocuSign + insurance certificates attached.'
  },
  pricing: {
    currency: 'USD',
    yachtMinimum: 16000,
    jetMinimum: 9800,
    helicopterMinimum: 5400,
    addOns: ['Michelin guest chef residencies', 'Live entertainment or DJ sets', 'Pop-up wellness labs', 'Destination content crew']
  },
  gallery: [
    {
      id: 'gal-1',
      image: 'https://images.unsplash.com/photo-1510070009289-b5bc34383727?auto=format&fit=crop&w=1200&q=80',
      caption: 'Mid-ocean dinner staging'
    },
    {
      id: 'gal-2',
      image: 'https://images.unsplash.com/photo-1498079022511-d15614cb1c02?auto=format&fit=crop&w=1200&q=80',
      caption: 'Jet cabin with bespoke florals'
    },
    {
      id: 'gal-3',
      image: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
      caption: 'Helicopter transfer to south coast villa'
    },
    {
      id: 'gal-4',
      image: 'https://images.unsplash.com/photo-1469478715127-6d347c4a32c7?auto=format&fit=crop&w=1200&q=80',
      caption: 'Sunrise yoga on flybridge'
    }
  ],
  testimonials: [
    {
      quote:
        'Recharge choreographed a Colombo-to-Maldives escape with minutes-notice. Chef, sommelier, and pilot brief were immaculate.',
      author: 'Amara & Devan (Zurich)'
    },
    {
      quote:
        'Boardroom setup on the Gulfstream, seaplane transfer to the catamaran, and IV lounge on deck—flawless execution.',
      author: 'C. Wellington, Venture Partner'
    },
    {
      quote:
        'Night-vision heli into Yala, sunrise balloon over Lion Rock, and yacht brunch within 24 hours. No one else runs ops like this.',
      author: 'Helena Ortiz, Creative Director'
    }
  ],
  partners: ['Benetti', 'Gulfstream', 'Airbus', 'VistaJet', 'Relais & Châteaux'],
  faqs: [
    {
      id: 'faq-1',
      question: 'How quickly can you dispatch a charter?',
      answer: 'Aviation and heli assets can launch within 45 minutes of contract sign; yachts require 12–24 hours for provisioning unless already crewed nearby.'
    },
    {
      id: 'faq-2',
      question: 'Can we combine Sri Lanka with the Maldives or India?',
      answer: 'Yes, we routinely clear customs for Maldives atolls, Lakshadweep, and Chennai. We manage all permits, handlers, and concierge visas.'
    },
    {
      id: 'faq-3',
      question: 'Do you handle security and insurance?',
      answer: 'We coordinate armored convoys, onboard executive protection, and comprehensive passenger insurance per charter regulations.'
    },
    {
      id: 'faq-4',
      question: 'What information do you need to start?',
      answer: 'Travel window, group size, passport nationality, preferred experiences, and any dietary/wellness requests help us tailor the asset manifest.'
    }
  ],
  seo: {
    title: 'Private Charters Sri Lanka | Superyacht, Jet & Helicopter Concierge',
    description:
      'Book bespoke Sri Lankan private charters with superyachts, Gulfstream jets, and helicopters under one luxury concierge desk.',
    keywords: [
      'Sri Lanka private yacht charter',
      'Sri Lanka private jet concierge',
      'helicopter charter Sri Lanka',
      'luxury travel Sri Lanka charters'
    ],
    ogImage: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=630'
  }
};

class PrivateChartersPageService {
  async getPageContent(): Promise<PrivateChartersPageContent> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as PrivateChartersPageContent;
      } else {
        await this.updatePageContent(defaultContent);
        return defaultContent;
      }
    } catch (error) {
      console.error('Error fetching private charters page content:', error);
      return defaultContent;
    }
  }

  async updatePageContent(content: Partial<PrivateChartersPageContent>): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      await setDoc(
        docRef,
        {
          ...content,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );
      return true;
    } catch (error) {
      console.error('Error updating private charters page content:', error);
      return false;
    }
  }

  async resetToDefault(): Promise<boolean> {
    return this.updatePageContent(defaultContent);
  }

  getDefaultContent(): PrivateChartersPageContent {
    return defaultContent;
  }
}

export const privateChartersPageService = new PrivateChartersPageService();
