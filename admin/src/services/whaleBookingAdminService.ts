import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface AdminWhaleSeason {
  id: string;
  title: string;
  months: string;
  description: string;
  successStat: string;
  pickupPoint: string;
  departure: string;
  highlights: string[];
}

export interface AdminWhaleBookingContent {
  hero: {
    title: string;
    subtitle: string;
    badge: string;
    backgroundImage: string;
    gallery?: { image: string; caption?: string }[];
  };
  seasons: AdminWhaleSeason[];
  overview: {
    summary: string;
    badges: string[];
    highlights: string[];
  };
  details: {
    duration: string;
    pickupInfo: string;
    languages: string[];
    ticketType: string;
    cancellation: string;
    accessibility: string;
    ageRange: string;
    includes: string[];
    excludes: string[];
    importantNotes: string[];
  };
  itinerary: Array<{
    id: string;
    title: string;
    description: string;
    duration: string;
    location?: string;
  }>;
  operator: {
    name: string;
    rating: number;
    reviewsCount: number;
    description: string;
    licenses: string[];
    contactPhone: string;
    contactEmail: string;
    supportHours: string;
    assurances: string[];
  };
  reviews: Array<{
    id: string;
    name: string;
    date: string;
    rating: number;
    title: string;
    comment: string;
    travelerType?: string;
  }>;
  about: {
    description: string;
    sustainabilityCommitments: string[];
    faqs: Array<{ question: string; answer: string }>;
  };
  pricing: {
    currency: string;
    adultPrice: number;
    childPrice: number;
    depositNote: string;
    disclaimer: string;
    lowestPriceGuarantee: string;
    refundPolicy: string;
  };
}

const COLLECTION = 'whaleBookingContent';
const DOC_ID = 'public';

export const defaultAdminWhaleBookingContent: AdminWhaleBookingContent = {
  hero: {
    title: 'Whale Watching Concierge Booking',
    subtitle: 'Licensed sunrise departures in Mirissa & Trincomalee with marine biologist hosts.',
    badge: 'World Cetacean Alliance aligned',
    backgroundImage:
      'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=2000&q=80',
    gallery: [
      {
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80',
        caption: 'Mirissa sunrise departures',
      },
      {
        image: 'https://images.unsplash.com/photo-1470165525439-3cf9e6dccbad?auto=format&fit=crop&w=2000&q=80',
        caption: 'Research vessels with marine biologists',
      },
      {
        image: 'https://images.unsplash.com/photo-1505764706515-aa95265c5abc?auto=format&fit=crop&w=2000&q=80',
        caption: 'Trincomalee blue whale sightings',
      },
    ],
  },
  seasons: [
    {
      id: 'mirissa',
      title: 'Mirissa • November–April',
      months: 'Nov – Apr',
      description: 'Highest blue whale success rates plus calm seas at sunrise. Departures from Mirissa Harbour.',
      successStat: '95% whale sightings • 45+ marine biologists on rotation',
      pickupPoint: 'Mirissa Harbour Jetty 03',
      departure: 'Daily 05:30 AM (weather permitting)',
      highlights: [
        'Blue & sperm whales within 6–10 km',
        'Marine biologist narration + hydrophones',
        'Gourmet breakfast & comfort amenities',
      ],
    },
    {
      id: 'trinco',
      title: 'Trincomalee • May–September',
      months: 'May – Sep',
      description: 'East coast sailings with sperm whales, dolphin mega pods, and snorkel add-ons.',
      successStat: '88% whale sightings • Dolphin mega pods most mornings',
      pickupPoint: 'Trincomalee Dutch Bay Pier',
      departure: 'Daily 06:00 AM (weather permitting)',
      highlights: [
        'Sperm whales & spinner dolphins',
        'Luxury catamaran with shaded lounges',
        'Snorkel at Pigeon Island optional add-on',
      ],
    },
  ],
  overview: {
    summary:
      'Hold confirmed seats on our premium whale watching vessels without navigating hotel or car upsells.',
    badges: ['Non-refundable seat hold', 'Mobile ticket', 'Meets animal welfare guidelines', 'English live guide'],
    highlights: [
      'Private concierge support before/after sailing',
      'Guaranteed re-sail voucher if no whales are sighted (Mirissa season)',
      'Hydrophone listening + onboard naturalist briefing',
    ],
  },
  details: {
    duration: '8 hours door-to-door (Mirissa) · 6 hours (Trincomalee)',
    pickupInfo: 'Complimentary pickup within Mirissa/Trinco towns. Colombo/Negombo transfers quoted separately.',
    languages: ['English (live guide)', 'Sinhala crew support'],
    ticketType: 'Mobile ticket • Display on arrival',
    cancellation: 'Non-refundable once seats are confirmed due to limited whale permits.',
    accessibility: 'Not wheelchair accessible • Infants must sit on laps.',
    ageRange: 'Ages 3 – 99 (children under 3 travel free on parent lap).',
    includes: [
      'SLTDA licensed boat & crew',
      'Marine biologist / naturalist narrator',
      'Hydrophone whale audio',
      'Breakfast & refreshments (Mirissa) / snacks (Trincomalee)',
      'Life jackets & safety briefing',
    ],
    excludes: [
      'Hotel / airport transfers outside standard pickup zone',
      'Meals beyond what is stated',
      'Crew gratuities',
      'Optional snorkel stop permits',
    ],
    importantNotes: [
      'Passport or NIC required to clear harbour security gates.',
      'Arrive 20 minutes prior to departure for safety briefing.',
      'Tours sail in most weather but may be delayed for guest safety.',
    ],
  },
  itinerary: [
    {
      id: 'stop-1',
      title: 'Pickup & Harbour Check-in',
      description: 'Concierge or driver meets you and escorts you through harbour security.',
      duration: '45 mins',
      location: 'Hotel or harbour meeting point',
    },
    {
      id: 'stop-2',
      title: 'Sunrise Whale Watching Cruise',
      description: 'Board with marine biologists, track whales using sighting data and hydrophones.',
      duration: '4–5 hours',
      location: 'Indian Ocean (Mirissa / Trincomalee)',
    },
    {
      id: 'stop-3',
      title: 'Post-sail Debrief & Drop-off',
      description:
        'Review photos, receive re-sail vouchers if whales were not sighted, optional add-ons before drop-off.',
      duration: '1.5–2 hours',
      location: 'Harbour lounge & hotel drop-off',
    },
  ],
  operator: {
    name: 'Recharge Travels Marine Experiences',
    rating: 4.97,
    reviewsCount: 214,
    description:
      'World Cetacean Alliance aligned operator with research-grade whale watching vessels and capped passenger counts.',
    licenses: ['SLTDA/WW-8891', 'WCA Responsible Whale Watching Partner'],
    contactPhone: '+94 7777 21 999',
    contactEmail: 'concierge@rechargetravels.com',
    supportHours: '24/7 WhatsApp & phone support',
    assurances: [
      'Hydrophones & GPS tracking on every sailing',
      'Re-sail voucher if whales are not sighted (Mirissa season)',
      'Emergency medical kit & comfort amenities on board',
    ],
  },
  reviews: [
    {
      id: 'r1',
      name: 'Emma L.',
      date: 'January 2025',
      rating: 5,
      title: 'Six blue whales before breakfast',
      comment:
        'The marine biologist team and hydrophone audio made it unforgettable. Concierge kept us updated the entire morning.',
      travelerType: 'Couple',
    },
    {
      id: 'r2',
      name: 'Carlos M.',
      date: 'July 2024',
      rating: 5,
      title: 'Trinco dolphins + sperm whales',
      comment:
        'Sunrise catamaran was comfortable and the crew respected every whale-watching guideline. Kids loved the briefing.',
      travelerType: 'Family',
    },
  ],
  about: {
    description:
      'Recharge Travels is a Sri Lankan-owned boutique operator focused on low-impact marine expeditions.',
    sustainabilityCommitments: [
      'No chasing or encircling whales / dolphins',
      'Paperless ticketing & reusable service ware onboard',
      'Contributes to ocean conservation funds',
    ],
    faqs: [
      {
        question: 'What happens if the sailing is cancelled due to weather?',
        answer:
          'We reschedule you to the next available slot or issue a 100% refund if we cannot accommodate within your travel window.',
      },
      {
        question: 'Can we request a private boat?',
        answer: 'Yes, Mirissa and Trincomalee both have private charter yachts for up to 12 guests.',
      },
    ],
  },
  pricing: {
    currency: 'USD',
    adultPrice: 200,
    childPrice: 67,
    depositNote: 'Full amount charged at confirmation. Non-refundable due to limited whale permits.',
    disclaimer: 'Prices include harbour taxes and booking fees. Transfers from Colombo/Negombo are additional.',
    lowestPriceGuarantee: 'Found a lower price online? Send the quote and we refund the difference.',
    refundPolicy: 'Non-refundable once whale permits are issued.',
  },
};

export const whaleBookingAdminService = {
  async getContent(): Promise<AdminWhaleBookingContent> {
    const ref = doc(db, COLLECTION, DOC_ID);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, defaultAdminWhaleBookingContent);
      return defaultAdminWhaleBookingContent;
    }
    const data = snap.data() as Partial<AdminWhaleBookingContent>;
    return {
      ...defaultAdminWhaleBookingContent,
      ...data,
      hero: {
        ...defaultAdminWhaleBookingContent.hero,
        ...(data?.hero || {}),
        gallery:
          data?.hero?.gallery && data.hero.gallery.length > 0
            ? data.hero.gallery
            : defaultAdminWhaleBookingContent.hero.gallery,
      },
    };
  },

  async saveContent(content: AdminWhaleBookingContent) {
    const ref = doc(db, COLLECTION, DOC_ID);
    await setDoc(ref, content, { merge: true });
  },
};

