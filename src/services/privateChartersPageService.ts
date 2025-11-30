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
    badge: 'Ultra-Private Concierge',
    title: 'Where Billionaires Escape',
    subtitle:
      'Superyachts. Gulfstreams. Helicopters. Palatial villas. Your Indian Ocean odyssey begins with a single message to our 24/7 billionaire desk.',
    ctaText: 'Summon the Concierge',
    videoUrl: 'https://cdn.coverr.co/videos/coverr-super-yacht-at-sunset-9339/1080p.mp4',
    videoPoster: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2000&q=80',
    images: [
      {
        id: 'hero-1',
        image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2000&q=80',
        caption: 'Golden hour departures from Colombo Port City',
        tag: 'Superyacht Fleet'
      },
      {
        id: 'hero-2',
        image: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=2000&q=80',
        caption: 'Gulfstream G700 awaiting your command',
        tag: 'Private Aviation'
      },
      {
        id: 'hero-3',
        image: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=2000&q=80',
        caption: 'Night-vision heli to your private villa',
        tag: 'Executive Shuttle'
      }
    ],
    microForm: {
      heading: 'Your Manifest Awaits',
      subheading: 'Three details. One message. Your asset held within minutes.',
      submitLabel: 'Dispatch Now',
      successMessage: 'Merci — Your dedicated concierge is preparing your manifest. Expect contact within 12 minutes.',
      fields: [
        {
          id: 'date',
          label: 'Departure window',
          type: 'date',
          placeholder: 'When shall we ready the fleet?'
        },
        {
          id: 'asset',
          label: 'Primary asset',
          type: 'select',
          options: ['Superyacht', 'Gulfstream Jet', 'Executive Helicopter', 'Multi-Asset Journey'],
          defaultValue: 'Superyacht'
        },
        {
          id: 'guests',
          label: 'Party size',
          type: 'number',
          placeholder: 'e.g. 8'
        }
      ]
    }
  },
  overview: {
    summary:
      'For those who measure time in experiences, not hours. Recharge commands a private armada across the Indian Ocean—superyachts, Gulfstream jets, executive helicopters, and palatial residences—all orchestrated by a single concierge who answers only to you. From wheels-up to champagne sabrage, every detail is choreographed to perfection.',
    highlights: [
      {
        id: 'hl-1',
        label: 'Instant Dispatch Protocol',
        description: 'Marine and aviation teams on 45-minute standby. Your jet fueled. Your yacht provisioned. Your helicopter crewed.'
      },
      {
        id: 'hl-2',
        label: 'Seamless Multi-Modal Journeys',
        description: 'Yacht to jet to villa—one invoice, zero friction. We architect impossible itineraries across sea, sky, and land.'
      },
      {
        id: 'hl-3',
        label: 'White-Glove Hospitality',
        description: 'Michelin chefs, master sommeliers, wellness physicians, and security details—curated to your exact specifications.'
      }
    ]
  },
  stats: [
    { id: 'stat-1', iconName: 'Ship', label: 'Superyachts', value: '12' },
    { id: 'stat-2', iconName: 'Plane', label: 'Jet Fleet', value: '8' },
    { id: 'stat-3', iconName: 'Clock', label: 'Dispatch Time', value: '<45 min' },
    { id: 'stat-4', iconName: 'Crown', label: 'UHNW Clients', value: '5,800+' }
  ],
  fleet: [
    {
      id: 'fleet-yacht',
      name: 'MY Serendipity',
      vesselType: '40m Benetti Superyacht',
      capacity: '10 guests · 7 crew',
      range: '1,500 nm · 12 kts cruise',
      priceLabel: 'USD 18,500/day',
      iconName: 'Anchor',
      image: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1600&q=80',
      highlights: ['4 palatial staterooms with ocean views', 'Beach club with Seabobs & e-foils', 'Williams tender + chase boat for island hops'],
      hospitality: ['Michelin-trained executive chef', 'Master sommelier with 500-bottle cellar', 'IV therapy & wellness physician onboard']
    },
    {
      id: 'fleet-jet',
      name: 'Gulfstream G700',
      vesselType: 'Ultra-Long-Range Jet',
      capacity: '19 passengers',
      range: '7,500 nm nonstop',
      priceLabel: 'USD 12,800/hour',
      iconName: 'Plane',
      image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80',
      highlights: ['Full galley with live chef plating', 'Ka-band Wi-Fi for seamless connectivity', 'Lie-flat suites with Hermès bedding'],
      hospitality: ['ISS-certified cabin crew', 'Dom Pérignon & vintage cellar', 'Bespoke wellness menu by nutritionist']
    },
    {
      id: 'fleet-heli',
      name: 'Airbus H160 VIP',
      vesselType: 'Executive Helicopter',
      capacity: '8 passengers',
      range: '450 nm · IFR certified',
      priceLabel: 'USD 6,200/hour',
      iconName: 'Navigation',
      image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
      highlights: ['Whisper-quiet cabin technology', 'Climate-controlled leather interior', 'Night-vision equipped crew for 24/7 ops'],
      hospitality: ['Customs pre-clearance protocol', 'Chilled champagne service', 'Maybach crossover on landing']
    },
    {
      id: 'fleet-villa',
      name: 'Aman Private Villa',
      vesselType: 'Oceanfront Estate',
      capacity: '16 guests · 8 staff',
      range: 'Southern Sri Lanka',
      priceLabel: 'USD 8,500/night',
      iconName: 'Hotel',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1600&q=80',
      highlights: ['Infinity pool overlooking Indian Ocean', 'Private beach with butler service', 'Helipad for seamless arrivals'],
      hospitality: ['24/7 private chef & butler team', 'In-villa spa & wellness center', 'Security detail & concierge']
    }
  ],
  journeys: [
    {
      id: 'journey-1',
      title: 'The Maharaja Circuit',
      duration: '5 days',
      route: 'Colombo → Tea Trails → Maldives',
      description:
        'Helicopter to Ceylon Tea Trails at dawn, Gulfstream hop to Malé at sunset, superyacht odyssey between private atolls with Michelin chef collaborations and underwater dining.',
      services: ['Executive helicopter transfer', 'Heritage bungalow buyout', 'G700 charter to Maldives', 'Benetti yacht with spa & dive crew']
    },
    {
      id: 'journey-2',
      title: 'Wild Kingdom Expedition',
      duration: '7 days',
      route: 'Colombo → Yala → Trincomalee → Sigiriya',
      description:
        'Night-vision heli to exclusive safari lodge, coastal yacht convoy to pristine east coast, catamaran dive expeditions, and private hot-air balloon over Lion Rock at sunrise.',
      services: ['Heli safari logistics', 'Yacht convoy with dive masters', 'Seaplane night transfer', 'Private balloon with champagne proposal setup']
    },
    {
      id: 'journey-3',
      title: 'Boardroom Express',
      duration: '48 hours',
      route: 'Singapore → Colombo → Galle → Dubai',
      description:
        'Corporate itinerary for board meetings, site inspections, and partner dinners—executed via Gulfstream, armored convoy, and floating boardroom on superyacht.',
      services: ['Gulfstream intercontinental shuttle', 'Armored S-Class fleet', 'Yacht boardroom configuration', 'Security detail & customs fast-track']
    },
    {
      id: 'journey-4',
      title: 'Honeymoon Odyssey',
      duration: '10 days',
      route: 'Colombo → Galle → Maldives → Seychelles',
      description:
        'The ultimate romantic escape—private villa in Galle, superyacht to Maldives with underwater suite, seaplane to Seychelles private island with dedicated butler for two.',
      services: ['Oceanfront villa buyout', 'Superyacht with underwater suite', 'Seaplane island hopping', 'Private island finale with fireworks']
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
      'One message to summon the fleet. Share your travel window, party size, and lifestyle preferences. Your dedicated concierge returns within 12 minutes with asset options, flight plans, and provisional holds—ready for your command.',
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
  gallery: [
    {
      id: 'gal-1',
      image: 'https://images.unsplash.com/photo-1510070009289-b5bc34383727?auto=format&fit=crop&w=1200&q=80',
      caption: 'Private dinner on the high seas'
    },
    {
      id: 'gal-2',
      image: 'https://images.unsplash.com/photo-1498079022511-d15614cb1c02?auto=format&fit=crop&w=1200&q=80',
      caption: 'Gulfstream cabin with fresh orchids'
    },
    {
      id: 'gal-3',
      image: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
      caption: 'Night-vision heli to your villa'
    },
    {
      id: 'gal-4',
      image: 'https://images.unsplash.com/photo-1469478715127-6d347c4a32c7?auto=format&fit=crop&w=1200&q=80',
      caption: 'Dawn meditation on the sundeck'
    },
    {
      id: 'gal-5',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
      caption: 'Oceanfront villa infinity pool'
    },
    {
      id: 'gal-6',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      caption: 'Champagne sabrage at sunset'
    }
  ],
  testimonials: [
    {
      quote:
        'Recharge executed a Colombo-to-Maldives escape with 90 minutes notice. The Michelin chef, master sommelier, and pilot brief were flawless. This is how billionaires should travel.',
      author: 'Amara & Devan K. · Zurich'
    },
    {
      quote:
        'Boardroom on the Gulfstream, seaplane to the catamaran, IV therapy on deck, underwater dining in the Maldives—all in 48 hours. Unprecedented.',
      author: 'Charles W. · Venture Capital Partner'
    },
    {
      quote:
        'Night-vision helicopter into Yala, sunrise balloon over Sigiriya, yacht brunch by noon. No other concierge operates at this level.',
      author: 'Helena O. · Creative Director, Fortune 100'
    },
    {
      quote:
        'We needed a proposal setup on a private atoll with 6 hours notice. Recharge delivered fireworks, a string quartet, and a Michelin dinner. She said yes.',
      author: 'Anonymous UHNW Client'
    }
  ],
  partners: ['Benetti', 'Gulfstream', 'Airbus Corporate Jets', 'VistaJet', 'Aman Resorts', 'Four Seasons', 'Relais & Châteaux'],
  faqs: [
    {
      id: 'faq-1',
      question: 'How quickly can you dispatch an asset?',
      answer: 'Aviation and helicopter assets can launch within 45 minutes of contract signature. Superyachts require 12–24 hours for provisioning unless already crewed in position. For same-day requests, we maintain standby assets.'
    },
    {
      id: 'faq-2',
      question: 'Can you orchestrate multi-country journeys?',
      answer: 'Absolutely. We routinely clear customs for Maldives, Seychelles, Lakshadweep, Dubai, and Singapore. All permits, handlers, and concierge visas are managed seamlessly.'
    },
    {
      id: 'faq-3',
      question: 'What security and insurance do you provide?',
      answer: 'Every charter includes USD 50M liability coverage. We coordinate armored convoys, executive protection details, and secure communications as standard for UHNW clients.'
    },
    {
      id: 'faq-4',
      question: 'What information do you need to begin?',
      answer: 'Travel window, party size, passport nationalities, preferred experiences, dietary requirements, and any wellness or security preferences. Your concierge handles everything else.'
    },
    {
      id: 'faq-5',
      question: 'Do you accommodate special requests?',
      answer: 'From Michelin pop-ups to celebrity entertainment, rare wine acquisitions to emergency medical evacuations—if it can be done, we will make it happen.'
    }
  ],
  seo: {
    title: 'Billionaire Concierge Sri Lanka | Superyacht, Private Jet & Helicopter Charter',
    description:
      'The ultimate private concierge for UHNW travelers. Superyachts, Gulfstream jets, executive helicopters, and palatial villas—orchestrated by a single desk that answers only to you.',
    keywords: [
      'billionaire travel Sri Lanka',
      'UHNW concierge service',
      'private yacht charter Indian Ocean',
      'Gulfstream charter Sri Lanka',
      'luxury helicopter transfer',
      'ultra-luxury travel concierge',
      'private villa rental Sri Lanka'
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
