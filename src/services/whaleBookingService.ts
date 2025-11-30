import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface WhaleSeasonHighlight {
  id: string;
  title: string;
  months: string;
  description: string;
  successStat: string;
  pickupPoint: string;
  departure: string;
  highlights: string[];
}

export interface WhaleBookingOverview {
  summary: string;
  badges: string[];
  highlights: string[];
}

export interface WhaleBookingDetails {
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
}

export interface WhaleItineraryItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  location?: string;
}

export interface WhaleOperatorInfo {
  name: string;
  rating: number;
  reviewsCount: number;
  description: string;
  licenses: string[];
  contactPhone: string;
  contactEmail: string;
  supportHours: string;
  assurances: string[];
}

export interface WhaleReview {
  id: string;
  name: string;
  date: string;
  rating: number;
  title: string;
  comment: string;
  travelerType?: string;
}

export interface WhaleAboutSection {
  description: string;
  sustainabilityCommitments: string[];
  faqs: Array<{ question: string; answer: string }>;
}

export interface WhalePricingInfo {
  currency: string;
  adultPrice: number;
  childPrice: number;
  depositNote: string;
  disclaimer: string;
  lowestPriceGuarantee: string;
  refundPolicy: string;
}

export interface WhaleHeroGalleryItem {
  image: string;
  caption?: string;
}

export interface WhaleBookingContent {
  hero: {
    title: string;
    subtitle: string;
    badge: string;
    backgroundImage: string;
    gallery?: WhaleHeroGalleryItem[];
  };
  seasons: WhaleSeasonHighlight[];
  overview: WhaleBookingOverview;
  details: WhaleBookingDetails;
  itinerary: WhaleItineraryItem[];
  operator: WhaleOperatorInfo;
  reviews: WhaleReview[];
  about: WhaleAboutSection;
  pricing: WhalePricingInfo;
}

const COLLECTION = 'whaleBookingContent';
const DOC_ID = 'public';

export const defaultWhaleBookingContent: WhaleBookingContent = {
  hero: {
    title: 'Whale Watching Concierge Booking',
    subtitle: 'Licensed sunrise departures in Mirissa & Trincomalee with marine biologist hosts.',
    badge: 'World Cetacean Alliance aligned',
    backgroundImage: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=2000&q=80',
    gallery: [
      {
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80',
        caption: 'Indian Ocean dawn departures over Mirissa swells',
      },
      {
        image: 'https://images.unsplash.com/photo-1505764706515-aa95265c5abc?auto=format&fit=crop&w=2000&q=80',
        caption: 'Blue whale fluke emerging beyond Trincomalee',
      },
      {
        image: 'https://images.unsplash.com/photo-1470165525439-3cf9e6dccbad?auto=format&fit=crop&w=2000&q=80',
        caption: 'Research-grade vessels cutting through azure waters',
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
        'Blue whales, sperm whales, and spinner dolphins',
        'Gourmet breakfast & hydrophone listening',
        'SLTDA licensed crew + motion comfort amenities',
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
        'Sperm whales, pods of spinner dolphins, occasional orcas',
        'Luxury catamaran with shaded lounges',
        'Snorkel at Pigeon Island optional add-on',
      ],
    },
  ],
  overview: {
    summary:
      'Hold confirmed seats on our premium whale watching vessels without navigating hotel or car upsells. We focus exclusively on licensed Mirissa & Trincomalee departures with marine researchers on board.',
    badges: ['Non-refundable seat hold', 'Mobile ticket', 'Meets animal welfare guidelines', 'English live guide'],
    highlights: [
      'Private concierge support before/after sailing',
      'Guaranteed re-sail voucher if no whales are sighted (Nov–Apr)',
      'Hydrophone listening + onboard naturalist briefing',
    ],
  },
  details: {
    duration: '8 hours door-to-door (Mirissa) · 6 hours (Trincomalee)',
    pickupInfo: 'Complimentary pickup within Mirissa/Trinco towns. Colombo/Negombo transfers quoted separately.',
    languages: ['English (live guide)', 'Sinhala crew support'],
    ticketType: 'Mobile ticket • Display on arrival',
    cancellation: 'Non-refundable once seats are confirmed due to limited permits.',
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
      description: 'Concierge or driver meets you in Mirissa / Trincomalee and escorts you through harbour security.',
      duration: '45 mins',
      location: 'Hotel or harbour meeting point',
    },
    {
      id: 'stop-2',
      title: 'Sunrise Whale Watching Cruise',
      description:
        'Board the premium vessel with marine biologists. Track blue & sperm whales using historic sighting data and hydrophones.',
      duration: '4–5 hours',
      location: 'Indian Ocean (Mirissa / Trincomalee)',
    },
    {
      id: 'stop-3',
      title: 'Post-sail Debrief & Drop-off',
      description:
        'Return to harbour, review photos, and receive re-sail vouchers if whales were not sighted. Optional transfer to turtle sanctuary or Madu River add-on.',
      duration: '1.5–2 hours',
      location: 'Harbour lounge & hotel drop-off',
    },
  ],
  operator: {
    name: 'Recharge Travels Marine Experiences',
    rating: 4.97,
    reviewsCount: 214,
    description:
      'World Cetacean Alliance aligned operator with all vessels outfitted for research-grade whale watching. We adhere to Sri Lankan Department of Wildlife guidelines and cap passenger counts for comfort.',
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
      'Recharge Travels is a Sri Lankan-owned boutique operator focused on low-impact marine expeditions. We work with local researchers, limit passenger counts, and reinvest 5% of profits into ocean conservation.',
    sustainabilityCommitments: [
      'No chasing or encircling whales / dolphins',
      'Paperless ticketing & reusable service ware onboard',
      'Contributes to Ocean Alliance Sri Lanka research fund',
    ],
    faqs: [
      {
        question: 'What happens if the sailing is cancelled due to weather?',
        answer:
          'We reschedule you to the next available slot or issue a 100% refund if we cannot accommodate within your travel window.',
      },
      {
        question: 'Can we request a private boat?',
        answer: 'Yes, Mirissa and Trincomalee both have private charter yachts for up to 12 guests. Ask the concierge for pricing.',
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

export const whaleBookingService = {
  async getContent(): Promise<WhaleBookingContent> {
    const ref = doc(db, COLLECTION, DOC_ID);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, defaultWhaleBookingContent);
      return defaultWhaleBookingContent;
    }
    const data = snap.data() as Partial<WhaleBookingContent>;
    return {
      ...defaultWhaleBookingContent,
      ...data,
      hero: {
        ...defaultWhaleBookingContent.hero,
        ...(data?.hero || {}),
        gallery:
          data?.hero?.gallery && data.hero.gallery.length > 0
            ? data.hero.gallery
            : defaultWhaleBookingContent.hero.gallery,
      },
    };
  },

  async saveContent(content: WhaleBookingContent) {
    const ref = doc(db, COLLECTION, DOC_ID);
    await setDoc(ref, content, { merge: true });
  },
};

