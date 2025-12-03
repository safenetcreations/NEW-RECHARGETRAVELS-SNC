import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION_NAME = 'pageContent';
const DOC_ID = 'lagoon-safari';

export interface LagoonHeroSlide {
  image: string;
  caption: string;
  tag?: string;
}

export interface LagoonBadge {
  label: string;
  value: string;
  iconName: string;
}

export interface LagoonHighlight {
  label: string;
  description: string;
}

export interface LagoonExperience {
  id: string;
  name: string;
  summary: string;
  duration: string;
  priceLabel: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  includes: string[];
  image?: string;
  iconName: string;
}

export interface LagoonComboPackage {
  id: string;
  name: string;
  badge: string;
  duration: string;
  priceLabel: string;
  highlights: string[];
  includes: string[];
  iconName: string;
}

export interface LagoonLogistics {
  meetingPoint: string;
  sessionTimes: string[];
  launchPoints: string[];
  transferOptions: string;
  gearProvided: string[];
  bringList: string[];
  weatherPolicy: string;
  sustainabilityNote: string;
}

export interface LagoonFaq {
  id: string;
  question: string;
  answer: string;
}

export interface LagoonGalleryImage {
  id: string;
  image: string;
  caption: string;
}

export interface LagoonBookingInfo {
  contactPhone: string;
  whatsapp: string;
  email: string;
  responseTime: string;
  conciergeNote: string;
  deskHours: string;
}

export interface LagoonPricing {
  currency: string;
  startingPrice: number;
  depositNote: string;
  refundPolicy: string;
  privateUpgrade: string;
}

export interface LagoonSafariPageContent {
  hero: {
    title: string;
    subtitle: string;
    badge: string;
    gallery: LagoonHeroSlide[];
  };
  overview: {
    summary: string;
    badges: LagoonBadge[];
    highlights: LagoonHighlight[];
  };
  experiences: LagoonExperience[];
  combos: LagoonComboPackage[];
  logistics: LagoonLogistics;
  safety: string[];
  faqs: LagoonFaq[];
  gallery: LagoonGalleryImage[];
  booking: LagoonBookingInfo;
  pricing: LagoonPricing;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
  updatedAt?: any;
}

const defaultContent: LagoonSafariPageContent = {
  hero: {
    title: 'Bentota Lagoon Concierge',
    subtitle: 'Slow cruises through cinnamon islands, mangrove tunnels, and crocodile territory with naturalist skippers.',
    badge: 'Mangrove Naturalist Led',
    gallery: [
      {
        image: 'https://images.unsplash.com/photo-1544551763-77932436c73d?auto=format&fit=crop&w=2000&q=80',
        caption: 'Sunrise mist around Dedduwa lagoon',
        tag: 'Sunrise Drift'
      },
      {
        image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=2000&q=80',
        caption: 'Mangrove cathedral channels',
        tag: 'Mangrove Labyrinth'
      },
      {
        image: 'https://images.unsplash.com/photo-1596706487638-7c924bf5883a?auto=format&fit=crop&w=2000&q=80',
        caption: 'Water monitors and birdlife',
        tag: 'Wildlife Watch'
      },
      {
        image: 'https://images.unsplash.com/photo-1585016495481-91613a3ab1bc?auto=format&fit=crop&w=2000&q=80',
        caption: 'Golden hour over Bentota river mouth',
        tag: 'Sunset Cruise'
      }
    ]
  },
  overview: {
    summary:
      'The Recharge lagoon desk choreographs every circuit from cinnamon islands to hidden fish spas. We brief guests with our naturalist team, hold sunrise & sunset slots, and coordinate transfers plus gourmet add-ons so your only job is to drift.',
    badges: [
      { label: 'Private zones', value: '4 circuits', iconName: 'MapPin' },
      { label: 'Wildlife sightings', value: '18+ avg', iconName: 'Binoculars' },
      { label: 'Mangrove species', value: '15 identified', iconName: 'TreePine' },
      { label: 'Guest rating', value: '4.93/5', iconName: 'Star' }
    ],
    highlights: [
      {
        label: 'Concierge planning',
        description: 'Single WhatsApp thread for scheduling, transfers, and weather calls across Bentota, Madu, and Negombo.'
      },
      {
        label: 'Pro naturalists',
        description: 'Field biologists and lagoon skippers trained on wildlife etiquette, photography cues, and safety.'
      },
      {
        label: 'Flexible craft',
        description: 'Stilted canoes, canopy boats, or luxury pontoons based on party size with full insurance and life jackets.'
      }
    ]
  },
  experiences: [
    {
      id: 'sunrise-mangrove',
      name: 'Sunrise Mangrove Drift',
      summary: 'Launch before dawn for misty tunnels, kingfisher activity, and cinnamon island breakfast stops.',
      duration: '120 mins',
      priceLabel: 'USD 35 per guest',
      level: 'All Levels',
      includes: ['Private naturalist skipper', 'Cinnamon island tea stop', 'Binoculars & field guide', 'Hotel pickup (Bentota)'],
      iconName: 'Sunrise',
      image: 'https://images.unsplash.com/photo-1574263867128-a00c8b5e62f4?auto=format&fit=crop&w=1400&q=80'
    },
    {
      id: 'golden-hour',
      name: 'Golden Hour Wildlife Safari',
      summary: 'Birding-focused afternoon run covering crocodile spots, bat colonies, and photo-led pauses.',
      duration: '150 mins',
      priceLabel: 'USD 45 per guest',
      level: 'All Levels',
      includes: ['Stabilized canopy boat', 'Photography host', 'Refreshments on island', 'Return transfers'],
      iconName: 'Camera',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1400&q=80'
    },
    {
      id: 'full-lagoon',
      name: 'Full Lagoon Immersion',
      summary: 'Half-day circuit with island temple, cinnamon peeling, and natural fish spa with curated lunch.',
      duration: '5 hours',
      priceLabel: 'USD 85 per guest',
      level: 'All Levels',
      includes: ['Private craft + skipper', 'Island lunch & tastings', 'Temple donation & guide', 'Fish spa experience'],
      iconName: 'Anchor',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80'
    },
    {
      id: 'canoe-kayak',
      name: 'Canoe & Kayak Explorer',
      summary: 'Active paddling session along narrow tributaries with GoPro footage and support boat.',
      duration: '150 mins',
      priceLabel: 'USD 55 per guest',
      level: 'All Levels',
      includes: ['Stable double canoes', 'Safety escort boat', 'Dry bags + GoPro clips', 'Cold pressed juices'],
      iconName: 'Waves',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80'
    }
  ],
  combos: [
    {
      id: 'temple-combo',
      name: 'Mangrove & Temple Circuit',
      badge: 'Cultural Combo',
      duration: '4.5 hours',
      priceLabel: 'USD 75 for 2 guests',
      highlights: ['Island monastery blessing', 'Cinnamon peeling workshop', 'Hidden mangrove tunnels', 'Local lunch'],
      includes: ['Private canopy boat', 'Temple caretaker donation', 'Cinnamon family host', 'Transfers Bentota/Sri Villa'],
      iconName: 'Globe'
    },
    {
      id: 'island-brunch',
      name: 'Island Brunch & Fish Spa',
      badge: 'Family Favorite',
      duration: '3.5 hours',
      priceLabel: 'USD 65 for 2 adults + child',
      highlights: ['Floating brunch platter', 'Natural fish spa stop', 'Village visit & toddy tasting', 'Birding deck'],
      includes: ['Dedicated crew + chef', 'Fresh juices & king coconut', 'Child life jackets', 'Complimentary drone clip'],
      iconName: 'Users'
    },
    {
      id: 'sunset-private',
      name: 'Private Sunset Charter',
      badge: 'Luxury',
      duration: '2.5 hours',
      priceLabel: 'USD 140 up to 6 guests',
      highlights: ['Champagne sundowners', 'Live sax or ambient playlist', 'Croc & bat colony viewing', 'Concierge transfers'],
      includes: ['Luxury pontoon boat', 'Premium beverage program', 'On-board host & captain', 'Priority weather hold'],
      iconName: 'Star'
    }
  ],
  logistics: {
    meetingPoint: 'Bentota Lagoon Jetty (Old Bentota Bridge side) or hotel pier pick-up on request',
    sessionTimes: ['05:45 – Sunrise drift', '08:30 – Cinnamon & temples', '16:00 – Golden hour wildlife'],
    launchPoints: ['Bentota / Dedduwa lagoon', 'Madu river (Balapitiya)', 'Negombo lagoon (by request)'],
    transferOptions: 'Private car/van transfers from Colombo, Galle, or Kalutara zones with chilled towels and cool boxes.',
    gearProvided: ['Life jackets all sizes', 'Binocular sets', 'Insect repellent & ponchos', 'GoPro / DSLR mount'],
    bringList: ['Light layers + hat', 'Eco sunscreen', 'Camera / telephoto lens', 'Slip-on footwear'],
    weatherPolicy: 'We monitor tide + storm cells hourly. If heavy rain or lightning is forecast we reschedule or fully refund.',
    sustainabilityNote: 'Portions of every booking fund mangrove restoration and temple caretaker stipends through Recharge Foundation.'
  },
  safety: [
    'All craft carry GPS, VHF, and certified skippers with first-aid credentials.',
    'Insurance coverage for guests + equipment plus floating child vests in all sizes.',
    'Wildlife interaction briefings before launch and no single-use plastics onboard.',
    'Real-time concierge channel for weather advisories or schedule adjustments.'
  ],
  faqs: [
    {
      id: 'children',
      question: 'Is the lagoon safari safe for children or grandparents?',
      answer:
        'Yes. Boats are wide and low to the water, fitted with life jackets for infants to XXL adults. Boarding steps and handrails are provided at every jetty and our skippers move at comfortable speeds.'
    },
    {
      id: 'wildlife',
      question: 'What wildlife do we usually encounter?',
      answer:
        'Expect water monitors, crocodiles (from a distance), purple herons, brahminy kites, kingfishers, fruit bats, and mangrove crabs. Dawn/late-afternoon sessions offer the most activity.'
    },
    {
      id: 'swimming',
      question: 'Can we swim during the safari?',
      answer:
        'Swimming is generally not recommended due to currents and wildlife. However, our fish-spa stop lets guests dip feet into netted shallows under guide supervision.'
    },
    {
      id: 'bring',
      question: 'What should we bring?',
      answer:
        'Wear breathable clothing, bring eco sunscreen, sunglasses, and insect repellent. Cameras with zoom lenses are ideal though we provide binoculars + shared DSLR for photos.'
    },
    {
      id: 'rain',
      question: 'What happens if it rains?',
      answer:
        'Light rain creates beautiful misty conditions and we continue with ponchos provided. For heavy storms we hold departures, shift to another slot the same day, or fully refund.'
    }
  ],
  gallery: [
    {
      id: 'gallery-1',
      image: 'https://images.unsplash.com/photo-1569163139394-de4b5c4c4e3f?auto=format&fit=crop&w=900&q=80',
      caption: 'Cinnamon island walk-through'
    },
    {
      id: 'gallery-2',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80',
      caption: 'Mangrove cathedral tunnels'
    },
    {
      id: 'gallery-3',
      image: 'https://images.unsplash.com/photo-1596706487638-7c924bf5883a?auto=format&fit=crop&w=900&q=80',
      caption: 'Water monitors basking near Dedduwa'
    },
    {
      id: 'gallery-4',
      image: 'https://images.unsplash.com/photo-1585016495481-91613a3ab1bc?auto=format&fit=crop&w=900&q=80',
      caption: 'Golden hour from the pontoon bow'
    },
    {
      id: 'gallery-5',
      image: 'https://images.unsplash.com/photo-1574263867128-a00c8b5e62f4?auto=format&fit=crop&w=900&q=80',
      caption: 'Island brunch set-up under palms'
    },
    {
      id: 'gallery-6',
      image: 'https://images.unsplash.com/photo-1605713288610-00c1c630f6c6?auto=format&fit=crop&w=900&q=80',
      caption: 'Kingfishers along quiet tributaries'
    }
  ],
  booking: {
    contactPhone: '+94 77 772 1999',
    whatsapp: 'https://wa.me/94777721999',
    email: 'concierge@rechargetravels.com',
    responseTime: 'Replies within 15 minutes, 6 AM – 10 PM (GMT+5:30)',
    conciergeNote: 'Share preferred slots, pickup hotel, and party mix. Our lagoon concierge holds the craft, confirms transfers, and dispatches a detailed brief.',
    deskHours: 'Daily lagoon desk online 05:00 – 22:00'
  },
  pricing: {
    currency: 'USD',
    startingPrice: 35,
    depositNote: 'Lock your craft with a USD 20 deposit. Balance settled via link or cash on arrival.',
    refundPolicy: '100% refundable up to 12 hours before departure or if weather cancels launches.',
    privateUpgrade: 'Private pontoon upgrades start at USD 120 for up to six guests including beverages.'
  },
  seo: {
    title: 'Bentota Lagoon Safari | Mangrove Boat Tours Sri Lanka | Recharge Travels',
    description:
      'Book concierge-led Bentota lagoon safaris with naturalist skippers, cinnamon island visits, fish spas, and private charter upgrades. Sunrise & sunset slots confirmed via WhatsApp.',
    keywords: [
      'Bentota lagoon safari',
      'mangrove boat tour Sri Lanka',
      'Madu river safari',
      'cinnamon island tour',
      'sunset lagoon cruise'
    ],
    ogImage: 'https://images.unsplash.com/photo-1569163139394-de4b5c4c4e3f?auto=format&fit=crop&w=1200&q=80'
  }
};

const ensureArray = <T>(value: T[] | undefined, fallback: T[]): T[] => (value && value.length ? value : fallback);

const mergeLagoonContent = (data?: Partial<LagoonSafariPageContent>): LagoonSafariPageContent => {
  const source = data ?? {};

  return {
    ...defaultContent,
    ...source,
    hero: {
      ...defaultContent.hero,
      ...source.hero,
      gallery: ensureArray(source.hero?.gallery, defaultContent.hero.gallery)
    },
    overview: {
      ...defaultContent.overview,
      ...source.overview,
      badges: ensureArray(source.overview?.badges, defaultContent.overview.badges),
      highlights: ensureArray(source.overview?.highlights, defaultContent.overview.highlights)
    },
    experiences: ensureArray(source.experiences, defaultContent.experiences),
    combos: ensureArray(source.combos, defaultContent.combos),
    logistics: {
      ...defaultContent.logistics,
      ...source.logistics,
      sessionTimes: ensureArray(source.logistics?.sessionTimes, defaultContent.logistics.sessionTimes),
      launchPoints: ensureArray(source.logistics?.launchPoints, defaultContent.logistics.launchPoints),
      gearProvided: ensureArray(source.logistics?.gearProvided, defaultContent.logistics.gearProvided),
      bringList: ensureArray(source.logistics?.bringList, defaultContent.logistics.bringList)
    },
    safety: ensureArray(source.safety, defaultContent.safety),
    faqs: ensureArray(source.faqs, defaultContent.faqs),
    gallery: ensureArray(source.gallery, defaultContent.gallery),
    booking: {
      ...defaultContent.booking,
      ...source.booking
    },
    pricing: {
      ...defaultContent.pricing,
      ...source.pricing
    },
    seo: {
      ...defaultContent.seo,
      ...source.seo
    },
    updatedAt: source.updatedAt ?? defaultContent.updatedAt
  };
};

// Service class
class LagoonSafariPageService {
  async getPageContent(): Promise<LagoonSafariPageContent> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as Partial<LagoonSafariPageContent>;
        return mergeLagoonContent(data);
      } else {
        // Initialize with default content if doesn't exist
        await this.updatePageContent(defaultContent);
        return mergeLagoonContent();
      }
    } catch (error) {
      console.error('Error fetching lagoon safari page content:', error);
      return mergeLagoonContent();
    }
  }

  async updatePageContent(content: Partial<LagoonSafariPageContent>): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      await setDoc(docRef, {
        ...content,
        updatedAt: serverTimestamp()
      }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating lagoon safari page content:', error);
      return false;
    }
  }

  async resetToDefault(): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      await setDoc(docRef, {
        ...defaultContent,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error resetting lagoon safari page content:', error);
      return false;
    }
  }

  getDefaultContent(): LagoonSafariPageContent {
    return mergeLagoonContent();
  }
}

export const lagoonSafariPageService = new LagoonSafariPageService();
export default lagoonSafariPageService;
