import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION = 'waterSportsBookingContent';
const DOC_ID = 'kalpitiya-kitesurfing';

export interface AdminKalpitiyaHeroSlide {
  image: string;
  caption: string;
  tag?: string;
}

export interface AdminKalpitiyaBadge {
  label: string;
  value: string;
  iconName: string;
}

export interface AdminKalpitiyaHighlight {
  label: string;
  description: string;
}

export interface AdminKalpitiyaExperience {
  id: string;
  name: string;
  summary: string;
  duration: string;
  priceLabel: string;
  level: string;
  includes: string[];
  iconName: string;
  image?: string;
}

export interface AdminKalpitiyaCombo {
  id: string;
  name: string;
  badge: string;
  duration: string;
  priceLabel: string;
  highlights: string[];
  includes: string[];
  iconName: string;
}

export interface AdminKalpitiyaLogistics {
  meetingPoint: string;
  sessionTimes: string[];
  baseLocation: string;
  transferNote: string;
  gearProvided: string[];
  bringList: string[];
  weatherPolicy: string;
}

export interface AdminKalpitiyaBookingContent {
  hero: {
    title: string;
    subtitle: string;
    badge: string;
    gallery: AdminKalpitiyaHeroSlide[];
  };
  overview: {
    summary: string;
    badges: AdminKalpitiyaBadge[];
    highlights: AdminKalpitiyaHighlight[];
  };
  experiences: AdminKalpitiyaExperience[];
  combos: AdminKalpitiyaCombo[];
  logistics: AdminKalpitiyaLogistics;
  safety: string[];
  faqs: Array<{ id: string; question: string; answer: string }>;
  gallery: Array<{ id: string; image: string; caption: string }>;
  booking: {
    contactPhone: string;
    whatsapp: string;
    email: string;
    responseTime: string;
    conciergeNote: string;
  };
  pricing: {
    currency: string;
    startingPrice: number;
    depositNote: string;
    refundPolicy: string;
    extrasNote: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
}

export const defaultKalpitiyaAdminContent: AdminKalpitiyaBookingContent = {
  hero: {
    title: 'Kalpitiya Kitesurfing Concierge',
    subtitle: 'Ride the Indian Ocean trade winds with IKO-certified guides, premium gear, and concierge-planned downwinders.',
    badge: 'Trade Wind Capital',
    gallery: [
      {
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=2000&q=80',
        caption: 'Lagoon coaching laps at sunrise',
        tag: 'Flat water'
      },
      {
        image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=2000&q=80',
        caption: 'Downwinder to Vella Island',
        tag: 'Downwinders'
      },
      {
        image: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?auto=format&fit=crop&w=2000&q=80',
        caption: 'Sunset freestyle jam',
        tag: 'Freestyle'
      },
      {
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2000&q=80',
        caption: 'Golden-hour foil sessions',
        tag: 'Foil'
      }
    ]
  },
  overview: {
    summary:
      'Kalpitiya delivers 200+ wind days a year, butter-flat lagoons, and wave spots within boat reach. Our concierge crew handles permits, transport, and session planning so riders can focus on progression.',
    badges: [
      { label: 'Wind Days', value: '200+', iconName: 'Wind' },
      { label: 'Kite Spots', value: '8+', iconName: 'Map' },
      { label: 'IKO Pros', value: '100%', iconName: 'Shield' },
      { label: 'Students Certified', value: '5,000+', iconName: 'Users' }
    ],
    highlights: [
      {
        label: 'Dual monsoon seasons',
        description: 'May–Oct trade winds and Dec–Mar light-wind freestyle keep Kalpitiya rideable almost year round.'
      },
      {
        label: 'Concierge downwinders',
        description: 'Private boats shadow your ride with cold-pressed juices, drone clips, and rescue coverage.'
      },
      {
        label: 'Boutique kite village',
        description: 'Lagoon-front lockers, freshwater showers, gear tuning bay, and mezze bar open sunrise to sunset.'
      }
    ]
  },
  experiences: [
    {
      id: 'beginner-discovery',
      name: 'Beginner Discovery (IKO Level 1-2)',
      summary: 'From first kite handling through your inaugural water starts with radio helmets and rescue boat shadow.',
      duration: '3 days • 12 hours',
      priceLabel: 'USD 299 per rider',
      level: 'Beginner',
      includes: ['All 2024 Cabrinha kites + boards', 'IKO-certified bilingual coach', 'Impact vest & helmet', 'Daily progress cards', 'Rescue boat + GoPro clip'],
      iconName: 'GraduationCap',
      image: 'https://images.unsplash.com/photo-1505533321630-975218a5f66f?auto=format&fit=crop&w=1400&q=80'
    },
    {
      id: 'intermediate-progression',
      name: 'Intermediate Progression Lab',
      summary: 'Dial in upwind angles, transitions, basic jumps, and foil intros with video feedback in butter-flat water.',
      duration: '2 days • 8 hours',
      priceLabel: 'USD 199 per rider',
      level: 'Intermediate',
      includes: ['Premium freeride quiver', 'Video analysis + debriefs', 'Hydration + snacks', 'Radio coaching', 'Foil add-on optional'],
      iconName: 'TrendingUp',
      image: 'https://images.unsplash.com/photo-1534180477871-5d6cc81f3920?auto=format&fit=crop&w=1400&q=80'
    },
    {
      id: 'wave-master',
      name: 'Strapless Wave Master Class',
      summary: 'Boat-supported strike missions to Donkey Point with pro coaches covering carving, aerials, and safety.',
      duration: '3 days • 9 hours',
      priceLabel: 'USD 449 per rider',
      level: 'Advanced',
      includes: ['Directional quiver', 'Personal spot guide', 'Surf safety briefing', 'Photo pack + edits', 'Boat support & fuel'],
      iconName: 'Waves',
      image: 'https://images.unsplash.com/photo-1473893604213-66bd3e39263a?auto=format&fit=crop&w=1400&q=80'
    },
    {
      id: 'kite-safari',
      name: 'Island Hopper Kite Safari',
      summary: 'Five-day lagoon + ocean itinerary featuring Vella, Dream Spot, and private sandbars with glamping.',
      duration: '5 days',
      priceLabel: 'USD 899 per guest',
      level: 'All Levels',
      includes: ['Luxury tented camps', 'Chef + mixologist', 'Boat logistics + fuel', 'Massage + recovery ice baths', 'Pro media team'],
      iconName: 'Map',
      image: 'https://images.unsplash.com/photo-1529257414771-1960b7bea4eb?auto=format&fit=crop&w=1400&q=80'
    }
  ],
  combos: [
    {
      id: 'foil-dawn-patrol',
      name: 'Foil Dawn Patrol + Yoga',
      badge: 'Sunrise',
      duration: '4 hours',
      priceLabel: 'USD 125 per guest',
      highlights: ['Tow-assisted foil coaching', 'Sunrise mobility flow', 'Cold brew & açai bowls', 'Drone slow-mo footage'],
      includes: ['Armstrong foil sets', 'Radio helmets', 'Private coach', 'Post-session stretch therapist'],
      iconName: 'Sun'
    },
    {
      id: 'family-lagoon-pass',
      name: 'Family Lagoon Pass',
      badge: 'Families',
      duration: 'Half day',
      priceLabel: 'USD 320 (family of four)',
      highlights: ['Kid-friendly trainer kites', 'SUP & clear kayaks', 'Beach picnic with mocktails', 'Mini-photo shoot'],
      includes: ['Child-size safety gear', 'Shade cabana + fans', 'Concierge host', 'Digital gallery delivery'],
      iconName: 'Users'
    },
    {
      id: 'twilight-downwinder',
      name: 'Twilight Sandbar Downwinder',
      badge: 'Signature',
      duration: '6 hours',
      priceLabel: 'USD 275 per guest',
      highlights: ['Dream Spot to Kalpitiya cruise', 'Support catamaran with tapas', 'Live DJ + bonfire finale', 'Night drone light show'],
      includes: ['GPS trackers + VHF radios', 'Chef-styled tapas + champagne', 'Transport back to base', 'Photo & video edits'],
      iconName: 'Sparkles'
    }
  ],
  logistics: {
    meetingPoint: 'Recharge Lagoon Basecamp, Kalpitiya Peninsula',
    sessionTimes: ['Sunrise Thermal • 6:00 AM', 'Trade Wind Peak • 11:30 AM', 'Golden Hour Glass • 4:30 PM'],
    baseLocation: 'Lagoon-front HQ with lockers, repair bay, freshwater showers, mezze bar, and nap pods.',
    transferNote: 'Complimentary tuk transfer within 5 km. Chauffeur vans or seaplane add-ons available from Colombo/Negombo.',
    gearProvided: ['2024 Cabrinha + Duotone quiver', 'Armstrong foil fleet', 'Mystic harnesses in all sizes', 'Impact vests & helmets', 'Radio comm headsets'],
    bringList: ['Swimwear + rash guard', 'High SPF reef-safe sunscreen', 'Sunglasses with strap', 'Any medications', 'Waterproof phone pouch'],
    weatherPolicy: '95% wind reliability in main season. If wind drops below safe minimums we reschedule or refund.'
  },
  safety: [
    'IKO Level 2+ instructors with rescue + first aid certifications',
    'Dedicated rescue RIB on standby during every session',
    'Daily gear inspections and logbook sign-offs',
    'Live weather + gust radar monitored from basecamp'
  ],
  faqs: [
    {
      id: 'faq-1',
      question: 'Do I need prior kite experience?',
      answer: 'No. Our discovery course covers safety, kite handling, body dragging, and water starts over three days. Basic swimming ability is the only prerequisite.'
    },
    {
      id: 'faq-2',
      question: 'When is the best season for Kalpitiya?',
      answer: 'Peak winds blow May–October (15–25 knots). December–March offers lighter 12–18 knot sessions perfect for freestyle, foiling, and first-timers.'
    },
    {
      id: 'faq-3',
      question: 'Can non-kiters join?',
      answer: 'Yes—partners can book dolphin cruises, SUP safaris, spa rituals, or simply enjoy our lagoon lounge while you ride.'
    },
    {
      id: 'faq-4',
      question: 'What happens if there is no wind?',
      answer: 'We pivot to foil lessons behind a boat, SUP mangrove tours, or reschedule. If wind fails entirely, guests receive a 100% refund for that session.'
    }
  ],
  gallery: [
    { id: 'gallery-1', image: 'https://images.unsplash.com/photo-1530870110042-98b2cb110834?auto=format&fit=crop&w=1000&q=80', caption: 'Coach-led lagoon progression sets' },
    { id: 'gallery-2', image: 'https://images.unsplash.com/photo-1529257414771-1960b7bea4eb?auto=format&fit=crop&w=1000&q=80', caption: 'Downwind convoy to Vella Island' },
    { id: 'gallery-3', image: 'https://images.unsplash.com/photo-1473893604213-66bd3e39263a?auto=format&fit=crop&w=1000&q=80', caption: 'Donkey Point wave playground' },
    { id: 'gallery-4', image: 'https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=1000&q=80', caption: 'Twilight foil missions' }
  ],
  booking: {
    contactPhone: '+94 777 721 999',
    whatsapp: 'https://wa.me/94777721999',
    email: 'concierge@rechargetravels.com',
    responseTime: 'WhatsApp + email replies in under 15 minutes (06:00 – 22:00 GMT+5:30)',
    conciergeNote: 'Tell us your wind window, riding level, and desired vibe—our lagoon hosts craft the rest.'
  },
  pricing: {
    currency: 'USD',
    startingPrice: 299,
    depositNote: 'Secure your slot with a 30% deposit; balance due after day one once wind delivers.',
    refundPolicy: 'Weather cancellations receive 100% refunds or transferable credits. Date changes free up to 24 hours prior.',
    extrasNote: 'Drone media crews, seaplane transfers, private chefs, and tented glamping upgrades available.'
  },
  seo: {
    title: 'Kalpitiya Kitesurfing | Concierge Kite Lessons & Safaris | Recharge Travels',
    description:
      'Book IKO-certified kite lessons, foil coaching, and concierge-planned downwinders in Kalpitiya. Dual monsoon seasons, premium gear, and lagoonfront basecamp.',
    keywords: ['Kalpitiya kitesurfing', 'Sri Lanka kite lessons', 'Kalpitiya kite safari', 'IKO certified Sri Lanka'],
    ogImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1200&h=630&q=80'
  }
};

class KalpitiyaKitesurfingAdminService {
  async getContent(): Promise<AdminKalpitiyaBookingContent> {
    const docRef = doc(db, COLLECTION, DOC_ID);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      await setDoc(docRef, defaultKalpitiyaAdminContent);
      return defaultKalpitiyaAdminContent;
    }

    const data = snapshot.data() as Partial<AdminKalpitiyaBookingContent>;

    return {
      ...defaultKalpitiyaAdminContent,
      ...data,
      hero: {
        ...defaultKalpitiyaAdminContent.hero,
        ...(data.hero || {}),
        gallery:
          data.hero?.gallery && data.hero.gallery.length > 0
            ? data.hero.gallery
            : defaultKalpitiyaAdminContent.hero.gallery
      },
      overview: {
        ...defaultKalpitiyaAdminContent.overview,
        ...(data.overview || {}),
        badges:
          data.overview?.badges && data.overview.badges.length > 0
            ? data.overview.badges
            : defaultKalpitiyaAdminContent.overview.badges,
        highlights:
          data.overview?.highlights && data.overview.highlights.length > 0
            ? data.overview.highlights
            : defaultKalpitiyaAdminContent.overview.highlights
      },
      experiences: data.experiences && data.experiences.length > 0 ? data.experiences : defaultKalpitiyaAdminContent.experiences,
      combos: data.combos && data.combos.length > 0 ? data.combos : defaultKalpitiyaAdminContent.combos,
      logistics: { ...defaultKalpitiyaAdminContent.logistics, ...(data.logistics || {}) },
      safety: data.safety && data.safety.length > 0 ? data.safety : defaultKalpitiyaAdminContent.safety,
      faqs: data.faqs && data.faqs.length > 0 ? data.faqs : defaultKalpitiyaAdminContent.faqs,
      gallery: data.gallery && data.gallery.length > 0 ? data.gallery : defaultKalpitiyaAdminContent.gallery,
      booking: { ...defaultKalpitiyaAdminContent.booking, ...(data.booking || {}) },
      pricing: { ...defaultKalpitiyaAdminContent.pricing, ...(data.pricing || {}) },
      seo: { ...defaultKalpitiyaAdminContent.seo, ...(data.seo || {}) }
    };
  }

  async saveContent(content: Partial<AdminKalpitiyaBookingContent>) {
    const docRef = doc(db, COLLECTION, DOC_ID);
    await setDoc(docRef, content, { merge: true });
  }

  getDefaultContent() {
    return defaultKalpitiyaAdminContent;
  }
}

export const kalpitiyaKitesurfingAdminService = new KalpitiyaKitesurfingAdminService();
export default kalpitiyaKitesurfingAdminService;
