import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION_NAME = 'pageContent';
const DOC_ID = 'island-getaways';

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

export interface Island {
  id: string;
  name: string;
  description: string;
  location: string;
  accessibility: string;
  highlights: string[];
  bestTime: string;
  activities: string[];
  uniqueFeature: string;
}

export interface IslandActivity {
  id: string;
  activity: string;
  description: string;
  locations: string[];
  equipment: string;
  difficulty: string;
}

export interface IslandPackage {
  id: string;
  name: string;
  duration: string;
  price: string;
  highlights: string[];
  included: string[];
  iconName: string;
  islands: string[];
}

export interface TravelTip {
  id: string;
  iconName: string;
  title: string;
  tips: string[];
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

export interface IslandGetawaysPageContent {
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
  islands: Island[];
  islandActivities: IslandActivity[];
  islandPackages: IslandPackage[];
  travelTips: TravelTip[];
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
const defaultContent: IslandGetawaysPageContent = {
  hero: {
    title: 'Island Escapes',
    subtitle: 'Discover Pristine Islands & Hidden Paradise Beaches',
    ctaText: 'Explore Islands',
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=1080&fit=crop', caption: 'Pigeon Island Paradise' },
      { id: '2', url: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=1920&h=1080&fit=crop', caption: 'Tropical Island Beach' },
      { id: '3', url: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=1920&h=1080&fit=crop', caption: 'Coral Reef Snorkeling' },
      { id: '4', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&h=1080&fit=crop', caption: 'Island Sunset Views' }
    ]
  },
  overview: {
    title: "Escape to Sri Lanka's Hidden Islands",
    description: "Discover a world of pristine beaches, vibrant coral reefs, and unique island cultures. From the marine paradise of Pigeon Island to the wild horses of Delft, each island offers its own adventure. Experience untouched nature, crystal-clear waters, and the warm hospitality of island communities."
  },
  stats: [
    { id: '1', iconName: 'Anchor', label: 'Islands', value: '40+' },
    { id: '2', iconName: 'Fish', label: 'Marine Species', value: '300+' },
    { id: '3', iconName: 'Shell', label: 'Coral Varieties', value: '170+' },
    { id: '4', iconName: 'Palmtree', label: 'Beach Miles', value: '1,000+' }
  ],
  islands: [
    {
      id: '1',
      name: 'Pigeon Island',
      description: "One of Sri Lanka's two marine national parks with pristine coral reefs and abundant marine life.",
      location: 'Off Nilaveli, Trincomalee',
      accessibility: '15-minute boat ride',
      highlights: ['Coral Gardens', 'Blacktip Sharks', 'Sea Turtles', 'Rock Pigeon Colony'],
      bestTime: 'May to September',
      activities: ['Snorkeling', 'Diving', 'Beach relaxation', 'Wildlife watching'],
      uniqueFeature: 'Best coral reef diving in Sri Lanka'
    },
    {
      id: '2',
      name: 'Delft Island',
      description: 'Remote island with wild horses, baobab trees, and ancient ruins in the Jaffna Peninsula.',
      location: 'Jaffna Peninsula',
      accessibility: '1-hour ferry ride',
      highlights: ['Wild Horses', 'Baobab Tree', 'Growing Stone', 'Dutch Fort Ruins'],
      bestTime: 'March to September',
      activities: ['Cultural exploration', 'Photography', 'Beach walks', 'Historical tours'],
      uniqueFeature: 'Only place with wild horses in Sri Lanka'
    },
    {
      id: '3',
      name: 'Mannar Island',
      description: 'Historic island known for pearl diving, bird sanctuaries, and the ancient Baobab tree.',
      location: 'Northwest coast',
      accessibility: 'Connected by causeway',
      highlights: ["Adam's Bridge", 'Baobab Tree', 'Bird Sanctuary', 'Pearl Banks'],
      bestTime: 'December to March',
      activities: ['Bird watching', 'Kite surfing', 'Cultural tours', 'Beach activities'],
      uniqueFeature: 'Ancient pearl diving center'
    },
    {
      id: '4',
      name: 'Great & Little Basses',
      description: 'Twin reef formations famous for wreck diving and seasonal gatherings of marine life.',
      location: 'Off Kirinda, South coast',
      accessibility: 'Boat dive only',
      highlights: ['Shipwrecks', 'Reef Sharks', 'Manta Rays', 'Napoleon Wrasse'],
      bestTime: 'March to April',
      activities: ['Wreck diving', 'Deep diving', 'Photography', 'Marine research'],
      uniqueFeature: 'Best wreck diving sites'
    },
    {
      id: '5',
      name: 'Kayts Island',
      description: 'Tranquil island in Jaffna with pristine beaches, fishing villages, and colonial heritage.',
      location: 'Jaffna Peninsula',
      accessibility: 'Causeway connection',
      highlights: ['Hammenhiel Fort', 'Chatty Beach', 'Fishing Villages', 'Casuarina Beach'],
      bestTime: 'May to September',
      activities: ['Beach relaxation', 'Fort visits', 'Village tours', 'Seafood dining'],
      uniqueFeature: 'Untouched beaches and local life'
    },
    {
      id: '6',
      name: 'Crow Island',
      description: 'Small sanctuary island important for migratory birds and marine biodiversity.',
      location: 'Off Colombo coast',
      accessibility: 'Special permits required',
      highlights: ['Bird Sanctuary', 'Marine Life', 'Research Station', 'Coral Formations'],
      bestTime: 'November to March',
      activities: ['Bird watching', 'Research visits', 'Snorkeling', 'Educational tours'],
      uniqueFeature: 'Important bird migration stopover'
    }
  ],
  islandActivities: [
    {
      id: '1',
      activity: 'Snorkeling & Diving',
      description: 'Explore vibrant coral reefs and encounter tropical marine life',
      locations: ['Pigeon Island', 'Great Basses', 'Bar Reef'],
      equipment: 'Provided or rental available',
      difficulty: 'Beginner to Advanced'
    },
    {
      id: '2',
      activity: 'Island Hopping',
      description: 'Visit multiple islands to experience diverse landscapes and cultures',
      locations: ['Jaffna Islands', 'East Coast Islands'],
      equipment: 'Boat transfers arranged',
      difficulty: 'Easy'
    },
    {
      id: '3',
      activity: 'Bird Watching',
      description: 'Observe resident and migratory birds in island sanctuaries',
      locations: ['Mannar', 'Crow Island', 'Delft'],
      equipment: 'Binoculars recommended',
      difficulty: 'Easy'
    },
    {
      id: '4',
      activity: 'Cultural Exploration',
      description: 'Discover unique island cultures, traditions, and historical sites',
      locations: ['Delft', 'Mannar', 'Jaffna Islands'],
      equipment: 'Comfortable walking shoes',
      difficulty: 'Easy'
    }
  ],
  islandPackages: [
    {
      id: '1',
      name: 'Northern Islands Explorer',
      duration: '4 Days / 3 Nights',
      price: '$549',
      highlights: ['Delft Island wild horses', 'Kayts beaches', 'Jaffna cultural sites', 'Island hopping adventure'],
      included: ['Island transportation', 'Accommodation', 'Local guide', 'All meals', 'Ferry tickets'],
      iconName: 'Compass',
      islands: ['Delft', 'Kayts', 'Nainativu']
    },
    {
      id: '2',
      name: 'Marine Paradise Package',
      duration: '3 Days / 2 Nights',
      price: '$399',
      highlights: ['Pigeon Island snorkeling', 'Coral reef exploration', 'Beach resort stay', 'Marine life encounters'],
      included: ['Beach resort', 'Snorkeling equipment', 'Boat transfers', 'Marine guide', 'Meals'],
      iconName: 'Fish',
      islands: ['Pigeon Island']
    },
    {
      id: '3',
      name: 'Island Hopping Adventure',
      duration: '6 Days / 5 Nights',
      price: '$899',
      highlights: ['Multiple island visits', 'Diverse experiences', 'Cultural immersion', 'Beach and nature'],
      included: ['All island transfers', 'Mixed accommodation', 'Professional guide', 'Activities', 'Full board'],
      iconName: 'Ship',
      islands: ['Mannar', 'Delft', 'Pigeon', 'Kayts']
    },
    {
      id: '4',
      name: 'Diving Expedition',
      duration: '5 Days / 4 Nights',
      price: '$1,299',
      highlights: ['Great Basses wreck dives', 'Pigeon Island reefs', 'PADI certification', 'Underwater photography'],
      included: ['Dive resort stay', 'All diving equipment', 'Certified instructors', 'Boat dives', 'Dive insurance'],
      iconName: 'Anchor',
      islands: ['Pigeon', 'Great Basses']
    }
  ],
  travelTips: [
    {
      id: '1',
      iconName: 'Sun',
      title: 'Sun Protection',
      tips: ['High SPF sunscreen essential', 'Reapply after swimming', 'Protective clothing recommended', 'Stay hydrated always']
    },
    {
      id: '2',
      iconName: 'Waves',
      title: 'Ocean Safety',
      tips: ['Check current conditions', 'Swim in designated areas', 'Use life jackets when needed', 'Respect marine life']
    },
    {
      id: '3',
      iconName: 'Package',
      title: 'What to Pack',
      tips: ['Waterproof bag for electronics', 'Reef-safe sunscreen', 'Quick-dry clothing', 'Basic first aid kit']
    }
  ],
  faqs: [
    { id: '1', question: 'Do I need special permits to visit these islands?', answer: 'Most islands are freely accessible, but some like Crow Island require special permits for conservation reasons. Pigeon Island requires a national park entry ticket. We handle all permits and tickets as part of our packages.' },
    { id: '2', question: "What's the best time for island hopping in Sri Lanka?", answer: 'The best time varies by location. East coast islands (like Pigeon Island) are best from May to September, while west and south coast islands are ideal from December to March. Northern islands can be visited most of the year except during monsoons.' },
    { id: '3', question: 'Are the islands suitable for non-swimmers?', answer: 'Yes! While snorkeling and diving are popular, islands offer many activities like beach walks, cultural tours, bird watching, and photography. Life jackets are always provided for boat rides and water activities.' },
    { id: '4', question: 'What should I bring for an island visit?', answer: 'Essential items include sunscreen, hat, sunglasses, swimwear, light clothing, camera, water bottle, and any personal medications. Snorkeling equipment can be rented at most locations. Bring cash as ATMs are rare on islands.' },
    { id: '5', question: 'How developed are the island facilities?', answer: 'Development varies greatly. Pigeon Island is uninhabited with basic facilities. Islands like Mannar and Kayts have towns with accommodation and restaurants. Remote islands may have limited facilities, so we plan accordingly.' },
    { id: '6', question: 'Can we camp on the islands?', answer: 'Camping is restricted on most islands for conservation reasons. However, some islands near the coast offer beach camping experiences with proper permits. Ask about our special camping packages for approved locations.' }
  ],
  gallery: [
    { id: '1', url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop', alt: 'Pigeon Island beach' },
    { id: '2', url: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=400&h=300&fit=crop', alt: 'Coral reef snorkeling' },
    { id: '3', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop', alt: 'Island sunset' },
    { id: '4', url: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400&h=300&fit=crop', alt: 'Tropical beach' },
    { id: '5', url: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=400&h=300&fit=crop', alt: 'Paradise island' },
    { id: '6', url: 'https://images.unsplash.com/photo-1527004760346-e47d0e5e62f4?w=400&h=300&fit=crop', alt: 'Crystal clear water' },
    { id: '7', url: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400&h=300&fit=crop', alt: 'Island palm trees' },
    { id: '8', url: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=400&h=300&fit=crop', alt: 'Beach coastline' }
  ],
  cta: {
    title: 'Ready for Your Island Adventure?',
    description: "Escape to pristine beaches, explore vibrant coral reefs, and discover the unique charm of Sri Lanka's islands.",
    primaryButtonText: 'Book Island Tour',
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
    title: 'Sri Lanka Island Escapes | Island Hopping Tours | Recharge Travels',
    description: "Explore Sri Lanka's pristine islands including Pigeon Island, Delft Island, and more. Book island hopping tours and marine adventures with Recharge Travels.",
    keywords: ['Sri Lanka islands', 'Pigeon Island snorkeling', 'Delft Island', 'island hopping tours', 'marine national park', 'coral reef diving'],
    ogImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=630&fit=crop'
  }
};

// Service class
class IslandGetawaysPageService {
  async getPageContent(): Promise<IslandGetawaysPageContent> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as IslandGetawaysPageContent;
      } else {
        await this.updatePageContent(defaultContent);
        return defaultContent;
      }
    } catch (error) {
      console.error('Error fetching island getaways page content:', error);
      return defaultContent;
    }
  }

  async updatePageContent(content: Partial<IslandGetawaysPageContent>): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      await setDoc(docRef, {
        ...content,
        updatedAt: serverTimestamp()
      }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating island getaways page content:', error);
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
      console.error('Error resetting island getaways page content:', error);
      return false;
    }
  }

  getDefaultContent(): IslandGetawaysPageContent {
    return defaultContent;
  }
}

export const islandGetawaysPageService = new IslandGetawaysPageService();
export default islandGetawaysPageService;
