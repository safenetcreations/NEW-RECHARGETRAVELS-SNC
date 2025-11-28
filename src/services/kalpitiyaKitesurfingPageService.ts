import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION_NAME = 'pageContent';
const DOC_ID = 'kalpitiya-kitesurfing';

// Interfaces
export interface HeroImage {
  id: string;
  url: string;
  caption: string;
}

export interface Stat {
  id: string;
  iconName: string;
  label: string;
  value: string;
}

export interface KitePackage {
  id: string;
  name: string;
  duration: string;
  price: string;
  level: string;
  highlights: string[];
  included: string[];
  iconName: string;
}

export interface WindCondition {
  id: string;
  season: string;
  months: string;
  windSpeed: string;
  direction: string;
  conditions: string;
  recommended: string;
}

export interface KitingSpot {
  id: string;
  name: string;
  description: string;
  conditions: string;
  bestFor: string;
  features: string[];
  waterDepth: string;
}

export interface PreparationItem {
  id: string;
  iconName: string;
  title: string;
  items: string[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
}

export interface KalpitiyaKitesurfingPageContent {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    images: HeroImage[];
  };
  overview: {
    title: string;
    description: string;
  };
  stats: Stat[];
  kitePackages: KitePackage[];
  windConditions: WindCondition[];
  kitingSpots: KitingSpot[];
  preparation: PreparationItem[];
  faqs: FAQ[];
  gallery: GalleryImage[];
  cta: {
    title: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
  };
  contact: {
    phone: string;
    phoneNote: string;
    email: string;
    emailNote: string;
    website: string;
    websiteNote: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
  updatedAt?: any;
}

// Default content
const defaultContent: KalpitiyaKitesurfingPageContent = {
  hero: {
    title: 'Kalpitiya Kitesurfing',
    subtitle: "Ride the Wind at Sri Lanka's Premier Kite Destination",
    ctaText: 'Book Kite Session',
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=1080&fit=crop', caption: 'Kitesurfing in Kalpitiya' },
      { id: '2', url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1920&h=1080&fit=crop', caption: 'Perfect Wind Conditions' },
      { id: '3', url: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=1920&h=1080&fit=crop', caption: 'Lagoon Kitesurfing' },
      { id: '4', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&h=1080&fit=crop', caption: 'Sunset Kite Sessions' }
    ]
  },
  overview: {
    title: "Sri Lanka's Kitesurfing Paradise",
    description: "Kalpitiya is renowned as one of Asia's best kitesurfing destinations, offering consistent winds, warm waters, and stunning lagoon conditions. Whether you're a beginner looking to learn or an experienced rider seeking perfect conditions, Kalpitiya delivers an unforgettable kitesurfing experience with its flat-water lagoons and wave spots."
  },
  stats: [
    { id: '1', iconName: 'Wind', label: 'Wind Days/Year', value: '200+' },
    { id: '2', iconName: 'Compass', label: 'Kite Spots', value: '8+' },
    { id: '3', iconName: 'Users', label: 'Students Trained', value: '5,000+' },
    { id: '4', iconName: 'Award', label: 'IKO Certified', value: '100%' }
  ],
  kitePackages: [
    {
      id: '1',
      name: 'Beginner Discovery',
      duration: '3 Days',
      price: '$299',
      level: 'Beginner',
      highlights: ['Safety & theory', 'Kite control', 'Body dragging', 'Water start intro'],
      included: ['All equipment', 'IKO certified instructor', 'Safety gear', 'Boat rescue support', 'Certificate'],
      iconName: 'GraduationCap'
    },
    {
      id: '2',
      name: 'Intermediate Progression',
      duration: '2 Days',
      price: '$199',
      level: 'Intermediate',
      highlights: ['Upwind riding', 'Transitions', 'Jump basics', 'Speed control'],
      included: ['Premium equipment', 'Personal coaching', 'Video analysis', 'Theory session', 'Progress card'],
      iconName: 'TrendingUp'
    },
    {
      id: '3',
      name: 'Wave Riding Master Class',
      duration: '3 Days',
      price: '$449',
      level: 'Advanced',
      highlights: ['Wave selection', 'Strapless riding', 'Bottom turns', 'Aerial maneuvers'],
      included: ['Directional boards', 'Expert instructor', 'Spot guiding', 'All equipment', 'Video coaching'],
      iconName: 'Waves'
    },
    {
      id: '4',
      name: 'Kite Safari',
      duration: '5 Days',
      price: '$899',
      level: 'All Levels',
      highlights: ['Multiple spots', 'Downwinders', 'Island exploration', 'Cultural visits'],
      included: ['All transfers', 'Accommodation', 'Equipment', 'Meals', 'Guide', 'Support boat'],
      iconName: 'Map'
    }
  ],
  windConditions: [
    {
      id: '1',
      season: 'Peak Season',
      months: 'May - October',
      windSpeed: '15-25 knots',
      direction: 'Southwest',
      conditions: 'Consistent strong winds, perfect for all levels',
      recommended: 'Best time for beginners and advanced riders'
    },
    {
      id: '2',
      season: 'Secondary Season',
      months: 'December - March',
      windSpeed: '12-20 knots',
      direction: 'Northeast',
      conditions: 'Lighter winds, ideal for learning and freestyle',
      recommended: 'Great for beginners and light wind sessions'
    },
    {
      id: '3',
      season: 'Transition Period',
      months: 'April & November',
      windSpeed: 'Variable',
      direction: 'Variable',
      conditions: 'Changing conditions between monsoons',
      recommended: 'Suitable for flexible travelers'
    },
    {
      id: '4',
      season: 'Off Season',
      months: 'Late October - November',
      windSpeed: 'Light',
      direction: 'Variable',
      conditions: 'Unpredictable winds, some rain',
      recommended: 'Not recommended for kitesurfing'
    }
  ],
  kitingSpots: [
    {
      id: '1',
      name: 'Kalpitiya Lagoon',
      description: 'The main kitesurfing spot with flat water conditions perfect for beginners and freestyle.',
      conditions: 'Flat water, shallow, consistent wind',
      bestFor: 'Beginners, Freestyle, Learning',
      features: ['Waist-deep water', 'No obstacles', 'Rescue boat access', 'Schools nearby'],
      waterDepth: 'Waist to chest deep'
    },
    {
      id: '2',
      name: 'Vella Island',
      description: 'Pristine island spot offering both flat water and small waves for progression.',
      conditions: 'Mixed conditions, less crowded',
      bestFor: 'Intermediate, Exploration',
      features: ['Remote location', 'Clean water', 'Natural beauty', 'Camping possible'],
      waterDepth: 'Variable depths'
    },
    {
      id: '3',
      name: 'Dream Spot',
      description: 'Famous downwinder destination with beautiful scenery and excellent conditions.',
      conditions: 'Open water, stronger winds',
      bestFor: 'Downwinders, Advanced riders',
      features: ['Scenic route', 'Strong consistent wind', 'Clear water', 'Dolphin sightings'],
      waterDepth: 'Deep water'
    },
    {
      id: '4',
      name: 'Donkey Point',
      description: 'Wave spot for experienced riders seeking more challenging conditions.',
      conditions: 'Waves, stronger currents',
      bestFor: 'Wave riding, Advanced',
      features: ['Wave riding', 'Less crowded', 'Challenging conditions', 'Reef breaks'],
      waterDepth: 'Variable with reef'
    }
  ],
  preparation: [
    {
      id: '1',
      iconName: 'Shirt',
      title: 'What to Bring',
      items: ['Swimwear', 'Sunscreen SPF 50+', 'Sunglasses with strap', 'Rash guard', 'Water shoes', 'Towel']
    },
    {
      id: '2',
      iconName: 'Shield',
      title: 'Safety Gear Provided',
      items: ['Impact vest', 'Helmet (beginners)', 'Safety leash', 'Harness', 'Radio communication']
    },
    {
      id: '3',
      iconName: 'CheckCircle',
      title: 'Before Your Session',
      items: ['Eat light meal 2h before', 'Stay hydrated', 'Apply sunscreen', 'Listen to briefing', 'Warm up properly']
    }
  ],
  faqs: [
    { id: '1', question: 'Do I need prior experience to learn kitesurfing?', answer: 'No prior experience is needed! Our beginner courses start from scratch, teaching you everything from kite control to your first water starts. Basic swimming ability is the only requirement. Most students are riding independently within 3-4 days of lessons.' },
    { id: '2', question: 'What is the best time of year for kitesurfing in Kalpitiya?', answer: 'The peak season runs from May to October when the southwest monsoon brings consistent 15-25 knot winds. A secondary season from December to March offers lighter northeast winds (12-20 knots), ideal for beginners and freestyle. We recommend avoiding late October to November.' },
    { id: '3', question: 'What equipment do I need to bring?', answer: 'We provide all kitesurfing equipment including kites, boards, harnesses, and safety gear. You should bring swimwear, high SPF sunscreen, sunglasses with a strap, and optionally reef shoes and a rash guard. We also have equipment available for rent if you prefer using your own.' },
    { id: '4', question: 'Is kitesurfing safe for beginners?', answer: "Yes, when learned properly with qualified instructors. All our instructors are IKO certified with extensive experience. We use modern safety systems, provide thorough briefings, and maintain rescue boat support. The Kalpitiya lagoon's shallow, flat water makes it one of the safest places to learn." },
    { id: '5', question: 'Can I bring my own equipment?', answer: 'You can bring your own equipment. We recommend kites suitable for the expected wind conditions (9-12m for peak season, 12-15m for secondary season). Storage facilities are available, and our team can advise on the best setup for current conditions.' },
    { id: '6', question: 'What happens if there is no wind?', answer: "Wind days in season are highly reliable (95%+ in peak season). If conditions are unsuitable, we'll reschedule your session to the next available slot or offer alternative activities like SUP, snorkeling, or dolphin watching. Multi-day packages include flexible scheduling." }
  ],
  gallery: [
    { id: '1', url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop', alt: 'Kitesurfing action' },
    { id: '2', url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=300&fit=crop', alt: 'Kite on beach' },
    { id: '3', url: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=300&fit=crop', alt: 'Lagoon view' },
    { id: '4', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop', alt: 'Sunset session' },
    { id: '5', url: 'https://images.unsplash.com/photo-1530870110042-98b2cb110834?w=400&h=300&fit=crop', alt: 'Kite jumping' },
    { id: '6', url: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=400&h=300&fit=crop', alt: 'Beach setup' },
    { id: '7', url: 'https://images.unsplash.com/photo-1537519646099-335112f03225?w=400&h=300&fit=crop', alt: 'Group lesson' },
    { id: '8', url: 'https://images.unsplash.com/photo-1527004760346-e47d0e5e62f4?w=400&h=300&fit=crop', alt: 'Aerial view' }
  ],
  cta: {
    title: 'Ready to Ride the Wind?',
    description: 'Book your kitesurfing adventure in Kalpitiya today. Perfect conditions, expert instruction, and unforgettable experiences await!',
    primaryButtonText: 'Book Kite Session',
    secondaryButtonText: 'Call for Details'
  },
  contact: {
    phone: '+94 76 505 9595',
    phoneNote: 'Available 24/7',
    email: 'info@rechargetravels.com',
    emailNote: 'Quick response',
    website: 'www.rechargetravels.com',
    websiteNote: 'More experiences'
  },
  seo: {
    title: 'Kalpitiya Kitesurfing | Learn to Kitesurf Sri Lanka | Recharge Travels',
    description: "Experience world-class kitesurfing in Kalpitiya, Sri Lanka. IKO certified lessons, equipment rental, and kite safaris. Perfect wind conditions from May to October.",
    keywords: ['Kalpitiya kitesurfing', 'learn to kitesurf Sri Lanka', 'kite lessons Kalpitiya', 'kiteboarding Sri Lanka', 'IKO certified', 'kite safari'],
    ogImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=630&fit=crop'
  }
};

// Service class
class KalpitiyaKitesurfingPageService {
  async getPageContent(): Promise<KalpitiyaKitesurfingPageContent> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as KalpitiyaKitesurfingPageContent;
      } else {
        await this.updatePageContent(defaultContent);
        return defaultContent;
      }
    } catch (error) {
      console.error('Error fetching Kalpitiya kitesurfing page content:', error);
      return defaultContent;
    }
  }

  async updatePageContent(content: Partial<KalpitiyaKitesurfingPageContent>): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      await setDoc(docRef, {
        ...content,
        updatedAt: serverTimestamp()
      }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating Kalpitiya kitesurfing page content:', error);
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
      console.error('Error resetting Kalpitiya kitesurfing page content:', error);
      return false;
    }
  }

  getDefaultContent(): KalpitiyaKitesurfingPageContent {
    return defaultContent;
  }
}

export const kalpitiyaKitesurfingPageService = new KalpitiyaKitesurfingPageService();
export default kalpitiyaKitesurfingPageService;
