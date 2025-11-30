import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION_NAME = 'pageContent';
const DOC_ID = 'hot-air-balloon-sigiriya';

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

export interface AdminBalloonPackage {
  id: string;
  name: string;
  duration: string;
  priceLabel: string;
  bestFor: string;
  iconName: string;
  image: string;
  highlights: string[];
  included: string[];
}

export interface AdminJourneyStage {
  id: string;
  title: string;
  duration: string;
  description: string;
}

export interface AdminOperatorInfo {
  name: string;
  description: string;
  rating: number;
  reviews: number;
  licenses: string[];
  assurances: string[];
  contactPhone: string;
  contactEmail: string;
  supportHours: string;
}

export interface AdminLogisticsInfo {
  meetingPoint: string;
  pickupWindows: string[];
  flightSeason: string;
  duration: string;
  dressCode: string;
  gearProvided: string[];
  bringAlong: string[];
  weatherPolicy: string;
}

export interface AdminBookingInfo {
  conciergeNote: string;
  contactPhone: string;
  whatsapp: string;
  email: string;
  responseTime: string;
  depositNote: string;
  seatHoldPolicy: string;
}

export interface AdminPricingInfo {
  currency: string;
  startingPrice: number;
  privateCharterPrice: number;
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

export interface AdminHotAirBalloonContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaText: string;
    images: AdminHeroSlide[];
  };
  overview: {
    summary: string;
    highlights: AdminOverviewHighlight[];
  };
  stats: AdminStatChip[];
  packages: AdminBalloonPackage[];
  journey: AdminJourneyStage[];
  operator: AdminOperatorInfo;
  logistics: AdminLogisticsInfo;
  booking: AdminBookingInfo;
  pricing: AdminPricingInfo;
  gallery: AdminGalleryImage[];
  faqs: AdminFAQEntry[];
  cta: {
    title: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
}

export const defaultHotAirBalloonAdminContent: AdminHotAirBalloonContent = {
  hero: {
    badge: 'Sunrise Flight Concierge',
    title: 'Hot Air Ballooning Sigiriya',
    subtitle: 'Lift off over Lion Rock with champagne service, IAA-certified pilots, and concierge transfers.',
    ctaText: 'Reserve flight',
    images: [
      {
        id: 'hero-1',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=2000&q=80',
        caption: 'Golden hour over Lion Rock',
        tag: 'Sunrise'
      },
      {
        id: 'hero-2',
        image: 'https://images.unsplash.com/photo-1569163139394-de4b5c4c4e3f?auto=format&fit=crop&w=2000&q=80',
        caption: 'Glide above the Cultural Triangle',
        tag: 'Cultural Triangle'
      },
      {
        id: 'hero-3',
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2000&q=80',
        caption: 'Private charter arrivals',
        tag: 'Private charters'
      }
    ]
  },
  overview: {
    summary:
      'We hold dawn launch slots across Dambulla, Kandalama, and Sigiriya allowing you to float 2,000 ft above UNESCO jungle. Our pilots narrate history while the concierge team handles transfers, seat holds, and photo deliveries.',
    highlights: [
      {
        id: 'oh-1',
        label: 'Prime launch slots',
        description: 'We block sunrise windows November–April for the calmest winds and crispest views.'
      },
      {
        id: 'oh-2',
        label: 'Champagne landing ritual',
        description: 'Traditional toast, artisanal breakfast boards, and flight certificates delivered at landing.'
      },
      {
        id: 'oh-3',
        label: 'Concierge transfers',
        description: 'Private SUV pickups from Sigiriya, Dambulla, Habarana, or custom launch points.'
      }
    ]
  },
  stats: [
    { id: 'stat-1', iconName: 'Navigation', label: 'Max altitude', value: '2,000 ft' },
    { id: 'stat-2', iconName: 'Clock', label: 'Flight time', value: '60–90 min' },
    { id: 'stat-3', iconName: 'Award', label: 'Safety record', value: '100%' },
    { id: 'stat-4', iconName: 'Users', label: 'Guests flown', value: '15,000+' }
  ],
  packages: [
    {
      id: 'pkg-classic',
      name: 'Classic Sunrise Flight',
      duration: '60 min',
      priceLabel: 'USD 210 per guest',
      bestFor: 'First timers',
      iconName: 'Sunrise',
      image: 'https://images.unsplash.com/photo-1474496517593-015d8c59cd3e?auto=format&fit=crop&w=1400&q=80',
      highlights: ['Priority sunrise launch', 'Live pilot narration', '360º panoramic pass of Lion Rock'],
      included: ['Hotel pickup 5:00 AM', 'Pilot briefing + insurance', 'Champagne landing ritual', 'Flight certificate']
    },
    {
      id: 'pkg-photo',
      name: 'Premium Photo Flight',
      duration: '90 min',
      priceLabel: 'USD 280 per guest',
      bestFor: 'Photographers',
      iconName: 'Camera',
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
      highlights: ['Extended airtime for multiple altitudes', 'Onboard photographer + gallery delivery', 'Private basket zone'],
      included: ['VIP transfer + breakfast box', '90-min flight plan', '50+ edited photos delivered', 'Luxury return transfer']
    },
    {
      id: 'pkg-romance',
      name: 'Romantic Charter',
      duration: '75 min',
      priceLabel: 'USD 950 per couple',
      bestFor: 'Proposals & anniversaries',
      iconName: 'Heart',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80',
      highlights: ['Private basket compartment', 'Premium champagne & chocolate pairing', 'Personal photographer'],
      included: ['Private SUV + concierge host', 'Exclusive pilot + crew', 'Bespoke bouquet + message banner', 'Romantic breakfast picnic']
    }
  ],
  journey: [
    {
      id: 'journey-1',
      title: 'Launch prep & safety',
      duration: '30 min',
      description: 'Arrive before dawn, watch the balloon inflation, meet your pilot, and cover the safety briefing.'
    },
    {
      id: 'journey-2',
      title: 'Lift-off over lakes',
      duration: '15 min',
      description: 'Gentle ascent over Kandalama Lake with first light spilling across rice paddies and jungle canopy.'
    },
    {
      id: 'journey-3',
      title: 'Lion Rock pass',
      duration: '20 min',
      description: 'Glide alongside Sigiriya and Pidurangala at varying altitudes for photography and narration.'
    },
    {
      id: 'journey-4',
      title: 'Cultural Triangle sweep',
      duration: '20 min',
      description: 'Drift toward Dambulla cave temples and Minneriya reservoirs while spotting wildlife and stupas.'
    },
    {
      id: 'journey-5',
      title: 'Champagne landing',
      duration: '15 min',
      description: 'Touch down on selected fields, celebrate with champagne + breakfast boards, and receive your certificate.'
    }
  ],
  operator: {
    name: 'Sigiriya Balloon Co.',
    description: 'Sri Lanka’s longest running balloon operator with IAA oversight, dual pilots per flight, and 24/7 weather desk.',
    rating: 4.9,
    reviews: 1800,
    licenses: ['IAA Certified', 'Commercial Pilot License', 'Civil Aviation SL'],
    assurances: ['Full passenger insurance', 'Daily equipment inspections', 'Trackers on every basket'],
    contactPhone: '+94 77 772 1999',
    contactEmail: 'concierge@rechargetravels.com',
    supportHours: 'Response in 15 mins · 05:00 – 22:00 IST'
  },
  logistics: {
    meetingPoint: 'Hotel pickup in Sigiriya / Dambulla / Habarana or meet at Kandalama launch field.',
    pickupWindows: ['Sigiriya hotels · 05:00', 'Dambulla hotels · 04:45', 'Custom transfers on request'],
    flightSeason: 'Primary season November – April · Shoulder flights May – August (weather dependent)',
    duration: 'Door-to-door 3.5 hours',
    dressCode: 'Layered clothing, closed shoes, hat or cap',
    gearProvided: ['Flight helmet (on request)', 'Gloves during cool months', 'Champagne & breakfast', 'Flight certificate'],
    bringAlong: ['Camera/phone with strap', 'ID/passport', 'Light jacket', 'Sunscreen & sunglasses'],
    weatherPolicy:
      'Flights operate with wind speeds under 12 knots. Weather confirmation sent by 9 PM the evening before; reschedule or full refund if cancelled.'
  },
  booking: {
    conciergeNote:
      'Share your hotel, preferred date, and number of seats—our dawn desk holds launch slots and arranges transfers within 15 minutes.',
    contactPhone: '+94 77 772 1999',
    whatsapp: 'https://wa.me/94777721999',
    email: 'concierge@rechargetravels.com',
    responseTime: 'Replies within 15 minutes · 05:00 – 22:00',
    depositNote: '30% deposit to secure seats; balance charged after successful flight.',
    seatHoldPolicy: 'Seat holds expire in 60 minutes if deposit is not received.'
  },
  pricing: {
    currency: 'USD',
    startingPrice: 210,
    privateCharterPrice: 950,
    addOns: [
      'Professional photo/videography crew',
      'Sunrise picnic upgrade',
      'Proposal signage + bouquet',
      'Helicopter transfer from Colombo'
    ]
  },
  gallery: [
    {
      id: 'gal-1',
      image: 'https://images.unsplash.com/photo-1495546992359-fa0d45e1f588?auto=format&fit=crop&w=1200&q=80',
      caption: 'Golden hour lift-off'
    },
    {
      id: 'gal-2',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      caption: 'Hovering over Lion Rock'
    },
    {
      id: 'gal-3',
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      caption: 'Champagne landing ritual'
    },
    {
      id: 'gal-4',
      image: 'https://images.unsplash.com/photo-1514517220010-dad498cc03ef?auto=format&fit=crop&w=1200&q=80',
      caption: 'Cultural Triangle vistas'
    }
  ],
  faqs: [
    {
      id: 'faq-1',
      question: 'What happens if the weather cancels the flight?',
      answer:
        'Safety first. We monitor weather until 9 PM the night prior. If winds exceed limits, we reschedule to the next available slot or issue a full refund.'
    },
    {
      id: 'faq-2',
      question: 'Is there an age or health requirement?',
      answer:
        'Children must be 7+ and at least 120 cm tall. We cannot fly pregnant guests. Passengers should stand unaided for 60 minutes.'
    },
    {
      id: 'faq-3',
      question: 'How early should we book?',
      answer:
        'Peak season sunrise seats sell out 5–7 days in advance. Contact us with your travel window and we will hold the earliest launch slot.'
    },
    {
      id: 'faq-4',
      question: 'Can we charter a private balloon?',
      answer:
        'Yes—romantic proposals or VIP groups can reserve dedicated baskets, custom onboard service, and photographer coverage.'
    }
  ],
  cta: {
    title: 'Ready to float over Lion Rock?',
    description: 'Lock in your sunrise launch with concierge transfers, champagne landings, and photo coverage.',
    primaryButtonText: 'Hold my seats',
    secondaryButtonText: 'WhatsApp concierge'
  },
  seo: {
    title: 'Hot Air Ballooning Sigiriya | Sunrise Flights over Lion Rock',
    description:
      'Book private or shared hot air balloon rides above Sigiriya with concierge transfers, champagne landings, and certified pilots.',
    keywords: [
      'hot air balloon Sigiriya',
      'Sigiriya sunrise flight',
      'Sri Lanka balloon ride',
      'Sigiriya proposal balloon',
      'Lion Rock aerial tour'
    ],
    ogImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=630'
  }
};

export const hotAirBalloonSigiriyaAdminService = {
  async getContent(): Promise<AdminHotAirBalloonContent> {
    const ref = doc(db, COLLECTION_NAME, DOC_ID);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, defaultHotAirBalloonAdminContent);
      return defaultHotAirBalloonAdminContent;
    }
    return snap.data() as AdminHotAirBalloonContent;
  },

  async saveContent(content: AdminHotAirBalloonContent): Promise<void> {
    const ref = doc(db, COLLECTION_NAME, DOC_ID);
    await setDoc(ref, { ...content, updatedAt: new Date().toISOString() });
  }
};

export default hotAirBalloonSigiriyaAdminService;
