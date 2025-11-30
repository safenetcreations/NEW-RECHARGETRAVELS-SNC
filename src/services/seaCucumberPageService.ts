import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION_NAME = 'pageContent';
const DOC_ID = 'sea-cucumber-farming';

export interface SeaCucumberHeroSlide {
  id: string;
  image: string;
  caption: string;
  tag?: string;
}

export interface SeaCucumberHighlight {
  id: string;
  label: string;
  description: string;
}

export interface SeaCucumberStat {
  id: string;
  label: string;
  value: string;
  iconName: string;
}

export interface SeaCucumberFarm {
  id: string;
  name: string;
  region: string;
  badge: string;
  description: string;
  duration: string;
  capacity: string;
  focus: string;
  highlights: string[];
  logistics: {
    meetingPoint: string;
    bestSeason: string;
    transferNote: string;
    gear: string[];
  };
  image: string;
}

export interface SeaCucumberExperience {
  id: string;
  name: string;
  summary: string;
  duration: string;
  priceLabel: string;
  level: string;
  iconName: string;
  image: string;
  highlights: string[];
  included: string[];
}

export interface ResearchTrack {
  id: string;
  title: string;
  badge: string;
  description: string;
  bullets: string[];
}

export interface BookingInfo {
  conciergeNote: string;
  contactPhone: string;
  whatsapp: string;
  email: string;
  responseTime: string;
  depositNote: string;
  groupSuitability: string;
  addOns: string[];
}

export interface PricingInfo {
  currency: string;
  dayRate: number;
  labAddon: number;
  privateCharter: number;
  familyBundle: number;
  extras: string[];
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

export interface SeaCucumberPageContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaText: string;
    images: SeaCucumberHeroSlide[];
  };
  overview: {
    summary: string;
    highlights: SeaCucumberHighlight[];
  };
  stats: SeaCucumberStat[];
  farms: SeaCucumberFarm[];
  experiences: SeaCucumberExperience[];
  researchTracks: ResearchTrack[];
  booking: BookingInfo;
  pricing: PricingInfo;
  gallery: GalleryImage[];
  faqs: FAQEntry[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
}

const defaultContent: SeaCucumberPageContent = {
  hero: {
    badge: 'Marine Lab Access',
    title: 'Sea Cucumber Aquaculture Concierge',
    subtitle:
      'Walk the hatcheries of Mannar, snorkel Kalpitiya pens, and meet the biologists powering Sri Lanka\'s blue economy.',
    ctaText: 'Plan my field visit',
    images: [
      {
        id: 'hero-1',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=2000&q=80',
        caption: 'Juvenile sea cucumbers in nursery tanks',
        tag: 'Hatchery lab'
      },
      {
        id: 'hero-2',
        image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=2000&q=80',
        caption: 'Shallow sea pens along the Mannar coast',
        tag: 'Sea pens'
      },
      {
        id: 'hero-3',
        image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&w=2000&q=80',
        caption: 'Research teams monitoring water quality',
        tag: 'Field notes'
      },
      {
        id: 'hero-4',
        image: 'https://images.unsplash.com/photo-1682687220777-2c60708d6889?auto=format&fit=crop&w=2000&q=80',
        caption: 'Sunset over Kalpitiya lagoons',
        tag: 'Blue hour'
      }
    ]
  },
  overview: {
    summary:
      'Our field team curates farm immersions for investors, students, and eco-travellers. You will visit hatcheries, kayak to offshore pens, and learn how Sri Lanka became South Asia\'s sea cucumber capital.',
    highlights: [
      {
        id: 'hl-1',
        label: '15+ partner farms',
        description: 'From Mannar research bases to Kalpitiya lagoons and Batticaloa export hubs.'
      },
      {
        id: 'hl-2',
        label: 'Hands-on labs',
        description: 'Microscope work, juvenile tagging, and night-time bioluminescence surveys.'
      },
      {
        id: 'hl-3',
        label: 'Conservation impact',
        description: 'Every visit supports coastal cooperatives and reef restoration programs.'
      }
    ]
  },
  stats: [
    { id: 'stat-1', label: 'Farm network', value: '15+', iconName: 'Shell' },
    { id: 'stat-2', label: 'Species profiled', value: '8', iconName: 'Fish' },
    { id: 'stat-3', label: 'Annual output', value: '500+ tons', iconName: 'TrendingUp' },
    { id: 'stat-4', label: 'Local jobs', value: '2,000+', iconName: 'Users' }
  ],
  farms: [
    {
      id: 'farm-1',
      name: 'Mannar Hatchery & Research Dock',
      region: 'Northwest coast',
      badge: 'R&D',
      description:
        'Sri Lanka\'s flagship hatchery with live labs, broodstock pens, and drone-supported monitoring.',
      duration: '3.5 hrs door-to-door',
      capacity: 'Max 12 guests',
      focus: 'Juvenile rearing & genetics',
      highlights: ['Blue carbon talk with scientists', 'Plankton microscopy workshop', 'Kayak to sea pens'],
      logistics: {
        meetingPoint: 'Mannar jetty or private SUV pickup from Anuradhapura / Wilpattu',
        bestSeason: 'Dec – Apr for calm seas',
        transferNote: 'Optional seaplane or helicopter landing adjacent to the dock.',
        gear: ['Dry bags', 'Reef-safe boots', 'Sun ponchos']
      },
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80'
    },
    {
      id: 'farm-2',
      name: 'Kalpitiya Lagoon Co-op',
      region: 'West coast',
      badge: 'Community',
      description:
        'Snorkel above sand pens, meet the women-led cooperative, and taste sea lettuce ceviche on a floating deck.',
      duration: 'Half-day (4 hrs)',
      capacity: 'Max 10 guests',
      focus: 'Sustainable sea pens & tourism',
      highlights: ['Snorkel with guide & GoPro footage', 'Sea-to-table tasting menu', 'Mangrove restoration walk'],
      logistics: {
        meetingPoint: 'Kalpitiya lagoon pier or resort pickup',
        bestSeason: 'Nov – Mar & Jun – Aug',
        transferNote: 'Boat transfer included; kite-surf combo available in season.',
        gear: ['Mask & snorkel', 'Rash guards', 'Towels']
      },
      image: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?auto=format&fit=crop&w=1600&q=80'
    },
    {
      id: 'farm-3',
      name: 'Batticaloa Export Hub',
      region: 'East coast',
      badge: 'Commercial',
      description:
        'Walk production lines, learn about grading, and sit in on export negotiations with processors and buyers.',
      duration: '2.5 hrs',
      capacity: 'Max 8 guests',
      focus: 'Processing & trade',
      highlights: ['Quality-control lab tour', 'Investor Q&A with founders', 'Packaging & cold-chain demo'],
      logistics: {
        meetingPoint: 'Batticaloa city hotels or private helipad transfer',
        bestSeason: 'May – Sep for dry weather',
        transferNote: 'Optional charter flight from Colombo (90 mins).',
        gear: ['Closed shoes', 'Protective lab coats (provided)']
      },
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80'
    }
  ],
  experiences: [
    {
      id: 'exp-edu',
      name: 'Educational Field Immersion',
      summary: 'University-style module with lectures, hatchery walkthroughs, and practical sampling.',
      duration: 'Full day',
      priceLabel: 'USD 95 per participant',
      level: 'All levels',
      iconName: 'Microscope',
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
      highlights: ['Lab safety & microscopy basics', 'Juvenile tagging workshop', 'Data collection with scientists'],
      included: ['Transport from nearest city', 'Lunch & refreshments', 'Field workbook', 'Digital photo set']
    },
    {
      id: 'exp-investor',
      name: 'Investor Scouting Circuit',
      summary: 'Multi-stop tour across three provinces with business deep dives and financial modelling support.',
      duration: '2 days / 1 night',
      priceLabel: 'USD 680 per delegate',
      level: 'Business focus',
      iconName: 'TrendingUp',
      image: 'https://images.unsplash.com/photo-1542838686-73e5371e7f6b?auto=format&fit=crop&w=1400&q=80',
      highlights: ['Boardroom sessions with CEOs', 'Export market briefing', 'Site audits with agronomists'],
      included: ['Chauffeured transport', 'Boutique lagoon lodge stay', 'All meals & tastings', 'Investment deck & data room access']
    },
    {
      id: 'exp-family',
      name: 'Family Discovery Morning',
      summary: 'Play-based learning, touch pools, and conservation crafts for young ocean lovers.',
      duration: '3 hours',
      priceLabel: 'USD 45 per adult · 25 per child',
      level: 'Family friendly',
      iconName: 'Users',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
      highlights: ['Touch tank with marine guides', 'DIY mini sea pen activity', 'Kid-friendly tasting table'],
      included: ['Family host & educator', 'Snacks + coconut water', 'Activity kits', 'Photo gallery access']
    }
  ],
  researchTracks: [
    {
      id: 'rt-1',
      title: 'Blue Carbon & Ecology',
      badge: 'Sustainability',
      description: 'Measure sediment health, deploy sensors, and learn how holothurians supercharge reef recovery.',
      bullets: ['Bioturbation experiments', 'Carbon capture modelling', 'Community-led mangrove nurseries']
    },
    {
      id: 'rt-2',
      title: 'Value Chain & Exports',
      badge: 'Business',
      description: 'Understand pricing, compliance, and traceability from farm gate to premium Asian markets.',
      bullets: ['Processing standards tour', 'Quality grading workshop', 'Meet export consortiums']
    },
    {
      id: 'rt-3',
      title: 'Innovation & Tech',
      badge: 'R&D',
      description: 'See IoT water-quality rigs, drone mapping, and AI yield forecasts in live deployment.',
      bullets: ['Sensor calibration lab', 'Drone mapping mission', 'Data viz crash course']
    }
  ],
  booking: {
    conciergeNote:
      'Tell us your learning goals, group size, and travel window. We reserve farm access permits within 12 hours and arrange transfers, translators, and insurance.',
    contactPhone: '+94 77 772 1999',
    whatsapp: 'https://wa.me/94777721999',
    email: 'concierge@rechargetravels.com',
    responseTime: 'Replies within 30 minutes · 06:00 – 22:00 GMT+5:30',
    depositNote: '30% deposit secures permits and boats. Balance due after successful visit.',
    groupSuitability: 'Ideal for 2–30 guests · student cohorts, impact investors, documentary crews.',
    addOns: ['Professional photo/video crew', 'Simultaneous translation (EN/CN/JP)', 'Helicopter / seaplane transfers', 'CSR & press coordination']
  },
  pricing: {
    currency: 'USD',
    dayRate: 180,
    labAddon: 60,
    privateCharter: 950,
    familyBundle: 320,
    extras: ['Drone footage + editing', 'Chef-curated sea-to-table lunch', 'Extended Kalpitiya kite session', 'CSR donation matching']
  },
  gallery: [
    {
      id: 'gal-1',
      image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=1400&q=80',
      caption: 'Mannar juvenile nursery'
    },
    {
      id: 'gal-2',
      image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&w=1400&q=80',
      caption: 'Tidal pens at dusk'
    },
    {
      id: 'gal-3',
      image: 'https://images.unsplash.com/photo-1682687981630-cefe9cd73072?auto=format&fit=crop&w=1400&q=80',
      caption: 'Research divers tagging broodstock'
    },
    {
      id: 'gal-4',
      image: 'https://images.unsplash.com/photo-1574263867128-a3d06eb5a883?auto=format&fit=crop&w=1400&q=80',
      caption: 'Community tasting table'
    }
  ],
  faqs: [
    {
      id: 'faq-1',
      question: 'Can we combine multiple regions in one trip?',
      answer: 'Yes. We routinely build 2–4 day circuits covering Mannar, Kalpitiya, and Batticaloa with charter flights or chauffeured SUVs.'
    },
    {
      id: 'faq-2',
      question: 'Is snorkeling experience required?',
      answer: 'No. Walkways and boats allow dry observations; optional shallow-water snorkels are guided with flotation aids and lifeguards.'
    },
    {
      id: 'faq-3',
      question: 'Do you support corporate CSR visits?',
      answer: 'Absolutely—our team arranges volunteer hours, donation matching, media coverage, and impact reporting for CSR teams.'
    },
    {
      id: 'faq-4',
      question: 'What should we wear?',
      answer: 'Lightweight sun-protective clothing, reef-safe footwear, and hats. We provide dry bags, ponchos, and lab coats where needed.'
    }
  ],
  seo: {
    title: 'Sea Cucumber Farm Tours | Sri Lanka Marine Aquaculture Experiences',
    description:
      'Book concierge-curated sea cucumber farm tours across Mannar, Kalpitiya, and Batticaloa with scientists, investors, and coastal cooperatives.',
    keywords: [
      'sea cucumber farming tour',
      'Sri Lanka aquaculture experience',
      'Mannar hatchery visit',
      'Kalpitiya sea pen tour',
      'marine biology field trip'
    ],
    ogImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1200&h=630&q=80'
  }
};

class SeaCucumberPageService {
  async getContent(): Promise<SeaCucumberPageContent> {
    try {
      const ref = doc(db, COLLECTION_NAME, DOC_ID);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        return snap.data() as SeaCucumberPageContent;
      }
      await this.saveContent(defaultContent);
      return defaultContent;
    } catch (error) {
      console.error('Error fetching sea cucumber content', error);
      return defaultContent;
    }
  }

  async saveContent(content: SeaCucumberPageContent): Promise<void> {
    const ref = doc(db, COLLECTION_NAME, DOC_ID);
    await setDoc(ref, { ...content, updatedAt: serverTimestamp() });
  }

  getDefaultContent(): SeaCucumberPageContent {
    return defaultContent;
  }
}

export const seaCucumberPageService = new SeaCucumberPageService();
