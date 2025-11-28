import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION_NAME = 'pageContent';
const DOC_ID = 'jungle-camping';

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

export interface CampingPackage {
  id: string;
  name: string;
  duration: string;
  price: string;
  highlights: string[];
  included: string[];
  iconName: string;
  difficulty: string;
}

export interface WildlifeSpotting {
  id: string;
  animal: string;
  bestTime: string;
  frequency: 'Very Common' | 'Common' | 'Regular' | 'Occasional' | 'Rare';
  description: string;
}

export interface CampingEssentialCategory {
  id: string;
  category: string;
  iconName: string;
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

export interface JungleCampingPageContent {
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
  campingPackages: CampingPackage[];
  wildlifeSpottings: WildlifeSpotting[];
  campingEssentials: CampingEssentialCategory[];
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
const defaultContent: JungleCampingPageContent = {
  hero: {
    title: 'Jungle Camping Experience',
    subtitle: 'Immerse Yourself in the Wild Heart of Sri Lanka',
    ctaText: 'Book Camping Trip',
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920&h=1080&fit=crop', caption: 'Wilderness Camping' },
      { id: '2', url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=1920&h=1080&fit=crop', caption: 'Safari Camp' },
      { id: '3', url: 'https://images.unsplash.com/photo-1533873984035-25970ab07461?w=1920&h=1080&fit=crop', caption: 'Night Under Stars' },
      { id: '4', url: 'https://images.unsplash.com/photo-1517823382935-51bfcb0ec6bc?w=1920&h=1080&fit=crop', caption: 'Campfire Experience' }
    ]
  },
  overview: {
    title: "Experience the Untamed Wilderness",
    description: "Escape the ordinary and embrace the extraordinary with our curated jungle camping experiences in Sri Lanka's most pristine wilderness areas. From the leopard-prowled forests of Yala to the elephant corridors of Udawalawe, our expertly guided camping adventures offer a rare opportunity to connect with nature at its most authentic. Fall asleep to the symphony of the jungle and wake up to stunning wilderness views."
  },
  stats: [
    { id: '1', iconName: 'Mountain', label: 'Park Area', value: '1,317 km²' },
    { id: '2', iconName: 'Leaf', label: 'Wildlife Species', value: '200+' },
    { id: '3', iconName: 'Star', label: 'Clear Night Sky', value: '90%' },
    { id: '4', iconName: 'Shield', label: 'Safety Record', value: '100%' }
  ],
  campingPackages: [
    {
      id: '1',
      name: 'Basic Wilderness Camp',
      duration: '2 Days / 1 Night',
      price: '$150 per person',
      highlights: ['Traditional tent camping', 'Guided nature walks', 'Campfire dinner', 'Bird watching session'],
      included: ['All meals', 'Camping equipment', 'Expert guide', 'Safari vehicle', 'Park fees'],
      iconName: 'Tent',
      difficulty: 'Beginner'
    },
    {
      id: '2',
      name: 'Adventure Safari Camp',
      duration: '3 Days / 2 Nights',
      price: '$350 per person',
      highlights: ['Multiple game drives', 'Night safari experience', 'Jungle trekking', 'Wildlife photography'],
      included: ['Premium camping gear', 'All meals & snacks', 'Photography guide', 'Night vision equipment', 'All park fees'],
      iconName: 'Compass',
      difficulty: 'Intermediate'
    },
    {
      id: '3',
      name: 'Luxury Glamping',
      duration: '2 Days / 1 Night',
      price: '$400 per person',
      highlights: ['Luxury safari tent', 'Private game drives', 'Gourmet dining', 'Spa treatments'],
      included: ['King-size bed', 'Private bathroom', 'Butler service', 'Premium beverages', 'Airport transfers'],
      iconName: 'Crown',
      difficulty: 'Easy'
    },
    {
      id: '4',
      name: 'Family Adventure',
      duration: '2 Days / 1 Night',
      price: '$120 per person',
      highlights: ['Child-friendly activities', 'Educational programs', 'Safe camping zones', 'Fun wildlife quizzes'],
      included: ['Family tent', 'Kids activity pack', 'Child-friendly meals', 'Safety equipment', 'Family guide'],
      iconName: 'Users',
      difficulty: 'Family Friendly'
    }
  ],
  wildlifeSpottings: [
    { id: '1', animal: 'Sri Lankan Leopard', bestTime: 'Dawn & Dusk', frequency: 'Regular', description: 'The elusive big cat of Yala, best spotted during early morning or late evening safaris.' },
    { id: '2', animal: 'Sloth Bear', bestTime: 'Early Morning', frequency: 'Occasional', description: 'These shy creatures are often seen foraging for termites in the dry season.' },
    { id: '3', animal: 'Asian Elephant', bestTime: 'Throughout Day', frequency: 'Very Common', description: 'Herds of elephants are a common sight, especially near water sources.' },
    { id: '4', animal: 'Spotted Deer', bestTime: 'Morning', frequency: 'Very Common', description: 'Large herds graze in the open grasslands, often alert to predators.' },
    { id: '5', animal: 'Wild Water Buffalo', bestTime: 'Evening', frequency: 'Common', description: 'Often seen wallowing in water holes during the warmer parts of the day.' },
    { id: '6', animal: 'Indian Peafowl', bestTime: 'Dawn', frequency: 'Very Common', description: 'The colorful national bird, males display their magnificent plumage at dawn.' }
  ],
  campingEssentials: [
    {
      id: '1',
      category: 'What to Bring',
      iconName: 'Backpack',
      items: ['Comfortable hiking shoes', 'Light, neutral-colored clothing', 'Sun hat and sunglasses', 'Personal medications', 'Camera with zoom lens', 'Insect repellent']
    },
    {
      id: '2',
      category: 'We Provide',
      iconName: 'Package',
      items: ['Quality camping tents', 'Sleeping bags & mattresses', 'Camp chairs & tables', 'All cooking equipment', 'First aid kit', 'Torch/flashlights']
    },
    {
      id: '3',
      category: 'Safety Measures',
      iconName: 'Shield',
      items: ['24/7 armed rangers', 'Emergency radio contact', 'First aid trained guides', 'Wildlife-safe perimeters', 'Emergency evacuation plan', 'Fire safety equipment']
    },
    {
      id: '4',
      category: 'Camp Amenities',
      iconName: 'Home',
      items: ['Clean toilet facilities', 'Hot water for washing', 'Charging stations', 'Dining area with views', 'Bonfire pit', 'Stargazing deck']
    }
  ],
  faqs: [
    { id: '1', question: 'Is jungle camping safe?', answer: 'Absolutely! Safety is our top priority. All camps are established in designated safe zones with 24/7 armed ranger protection. Our guides are highly trained in wildlife behavior and emergency procedures. We maintain strict protocols and safety perimeters at all times.' },
    { id: '2', question: 'What is the best time to go jungle camping?', answer: 'The dry season from May to September offers the best wildlife viewing as animals gather around water sources. However, the wet season (October to January) brings lush greenery and excellent bird watching. February to April can be hot but offers great leopard sighting opportunities.' },
    { id: '3', question: 'Do I need prior camping experience?', answer: 'No prior experience needed! Our guides handle all camp setup and cooking. We provide comprehensive briefings and all necessary equipment. Even our basic package is designed to be comfortable for first-time campers while still offering an authentic wilderness experience.' },
    { id: '4', question: 'What about bathroom facilities?', answer: 'We provide clean, private toilet tents with eco-friendly portable toilets. Hot water is available for washing. Our luxury glamping option includes private ensuite bathrooms with flush toilets and hot showers. All facilities are maintained to high hygiene standards.' },
    { id: '5', question: 'Is it suitable for children?', answer: 'Yes! Our Family Adventure package is specifically designed for families with children aged 6 and above. We provide child-friendly activities, educational programs, and ensure extra safety measures. Kids absolutely love the experience of sleeping under the stars and spotting wildlife.' },
    { id: '6', question: 'What happens if it rains?', answer: 'Our tents are waterproof and designed for all weather conditions. We have covered dining and communal areas. In case of severe weather, we have backup plans including nearby eco-lodges. Your safety and comfort are always ensured regardless of weather conditions.' }
  ],
  gallery: [
    { id: '1', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop', alt: 'Jungle camping tent' },
    { id: '2', url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=400&h=300&fit=crop', alt: 'Safari camp setup' },
    { id: '3', url: 'https://images.unsplash.com/photo-1533873984035-25970ab07461?w=400&h=300&fit=crop', alt: 'Night camping' },
    { id: '4', url: 'https://images.unsplash.com/photo-1517823382935-51bfcb0ec6bc?w=400&h=300&fit=crop', alt: 'Campfire experience' },
    { id: '5', url: 'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?w=400&h=300&fit=crop', alt: 'Wildlife safari' },
    { id: '6', url: 'https://images.unsplash.com/photo-1493225255756-d9584f8906d4?w=400&h=300&fit=crop', alt: 'Elephant sighting' },
    { id: '7', url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop', alt: 'Leopard in wild' },
    { id: '8', url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop', alt: 'Sunrise over jungle' }
  ],
  cta: {
    title: 'Ready for a Wild Adventure?',
    description: "Experience the thrill of sleeping under the stars in Sri Lanka's most spectacular wilderness. Book your jungle camping adventure today and create memories that will last a lifetime.",
    primaryButtonText: 'Book Camping Trip',
    secondaryButtonText: 'Call for Info'
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
    title: 'Jungle Camping Sri Lanka | Safari Camp Experience | Recharge Travels',
    description: "Experience authentic jungle camping in Sri Lanka's national parks. Sleep under the stars, spot leopards and elephants, and connect with nature on our guided wilderness adventures.",
    keywords: ['jungle camping Sri Lanka', 'safari camping Yala', 'wilderness camping', 'glamping Sri Lanka', 'wildlife camping experience', 'Yala camping tours'],
    ogImage: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&h=630&fit=crop'
  }
};

// Service class
class JungleCampingPageService {
  async getPageContent(): Promise<JungleCampingPageContent> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as JungleCampingPageContent;
      } else {
        // Initialize with default content if doesn't exist
        await this.updatePageContent(defaultContent);
        return defaultContent;
      }
    } catch (error) {
      console.error('Error fetching jungle camping page content:', error);
      return defaultContent;
    }
  }

  async updatePageContent(content: Partial<JungleCampingPageContent>): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      await setDoc(docRef, {
        ...content,
        updatedAt: serverTimestamp()
      }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating jungle camping page content:', error);
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
      console.error('Error resetting jungle camping page content:', error);
      return false;
    }
  }

  getDefaultContent(): JungleCampingPageContent {
    return defaultContent;
  }
}

export const jungleCampingPageService = new JungleCampingPageService();
export default jungleCampingPageService;
