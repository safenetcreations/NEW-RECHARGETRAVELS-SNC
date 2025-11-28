import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION_NAME = 'pageContent';
const DOC_ID = 'lagoon-safari';

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

export interface SafariPackage {
  id: string;
  name: string;
  duration: string;
  price: string;
  highlights: string[];
  included: string[];
  iconName: string;
  bestTime: string;
  level?: string;
}

export interface WildlifeSpotting {
  id: string;
  species: string;
  type: string;
  frequency: 'Very Common' | 'Common' | 'Regular' | 'Occasional' | 'Rare sighting';
  bestSpot: string;
  description: string;
}

export interface LagoonZone {
  id: string;
  zone: string;
  features: string[];
  wildlife: string[];
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

export interface LagoonSafariPageContent {
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
  safariPackages: SafariPackage[];
  wildlifeSpottings: WildlifeSpotting[];
  lagoonZones: LagoonZone[];
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
const defaultContent: LagoonSafariPageContent = {
  hero: {
    title: 'Lagoon Canoe Safari',
    subtitle: "Navigate Bentota's Enchanting Mangrove Waterways",
    ctaText: 'Book Safari Tour',
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1569163139394-de4b5c4c4e3f?w=1920&h=1080&fit=crop', caption: 'Bentota Lagoon Safari' },
      { id: '2', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&h=1080&fit=crop', caption: 'Mangrove Exploration' },
      { id: '3', url: 'https://images.unsplash.com/photo-1596706487638-7c924bf5883a?w=1920&h=1080&fit=crop', caption: 'River Wildlife' },
      { id: '4', url: 'https://images.unsplash.com/photo-1585016495481-91613a3ab1bc?w=1920&h=1080&fit=crop', caption: 'Peaceful Waters' }
    ]
  },
  overview: {
    title: "Discover Bentota's Hidden Ecosystem",
    description: "Embark on a tranquil journey through the Bentota Lagoon, where the river meets the sea. Glide silently through mysterious mangrove tunnels, spot exotic wildlife, and experience the rich biodiversity of this unique wetland ecosystem. Our expert naturalists guide you through this watery wonderland, sharing insights about the delicate balance of life here."
  },
  stats: [
    { id: '1', iconName: 'Droplets', label: 'Lagoon Area', value: '64 hectares' },
    { id: '2', iconName: 'Bird', label: 'Bird Species', value: '70+' },
    { id: '3', iconName: 'TreePine', label: 'Mangrove Types', value: '15' },
    { id: '4', iconName: 'Fish', label: 'Wildlife Species', value: '100+' }
  ],
  safariPackages: [
    {
      id: '1',
      name: 'Morning Lagoon Explorer',
      duration: '2 hours',
      price: '$30 per person',
      highlights: ['Early bird watching', 'Mangrove navigation', 'Crocodile spotting', 'Traditional fishing villages'],
      included: ['Canoe with guide', 'Life jackets', 'Binoculars', 'Light refreshments', 'Hotel transfers'],
      iconName: 'Sunrise',
      bestTime: '6:00 AM - 8:00 AM',
      level: 'Easy'
    },
    {
      id: '2',
      name: 'Sunset Wildlife Safari',
      duration: '2.5 hours',
      price: '$35 per person',
      highlights: ['Golden hour photography', 'Evening bird activity', 'Monitor lizard viewing', 'Sunset over lagoon'],
      included: ['Traditional boat', 'Expert naturalist', 'Photography tips', 'Evening snacks', 'Return transfers'],
      iconName: 'Bird',
      bestTime: '4:00 PM - 6:30 PM',
      level: 'Easy'
    },
    {
      id: '3',
      name: 'Full Day Lagoon Adventure',
      duration: '6 hours',
      price: '$75 per person',
      highlights: ['Complete lagoon circuit', 'Island temple visit', 'Fishing demonstration', 'Mangrove walk'],
      included: ['Private boat', 'Lunch on island', 'All activities', 'Professional guide', 'Water & refreshments'],
      iconName: 'Anchor',
      bestTime: '8:00 AM - 2:00 PM',
      level: 'Moderate'
    },
    {
      id: '4',
      name: 'Photography Special',
      duration: '3 hours',
      price: '$55 per person',
      highlights: ['Best photo locations', 'Wildlife close-ups', 'Dawn or dusk timing', 'Small group (max 4)'],
      included: ['Stable photo boat', 'Expert photo guide', 'Multiple stops', 'Tripod mounts', 'Digital tips guide'],
      iconName: 'Camera',
      bestTime: 'Flexible timing',
      level: 'Easy'
    }
  ],
  wildlifeSpottings: [
    { id: '1', species: 'Water Monitor', type: 'Reptile', frequency: 'Very Common', bestSpot: 'Mangrove edges', description: 'Large lizards often seen basking on riverbanks or swimming' },
    { id: '2', species: 'Mugger Crocodile', type: 'Reptile', frequency: 'Occasional', bestSpot: 'Deep water areas', description: 'Small population inhabits the lagoon, mostly shy of boats' },
    { id: '3', species: 'Purple Heron', type: 'Bird', frequency: 'Common', bestSpot: 'Shallow waters', description: 'Beautiful wading bird often hunting in the shallows' },
    { id: '4', species: 'White-bellied Sea Eagle', type: 'Bird', frequency: 'Regular', bestSpot: 'Open water', description: 'Magnificent raptor fishing over the lagoon' },
    { id: '5', species: 'Kingfishers (various)', type: 'Bird', frequency: 'Very Common', bestSpot: 'Throughout lagoon', description: 'Multiple species including Pied, Common, and White-throated' },
    { id: '6', species: 'Fruit Bats', type: 'Mammal', frequency: 'Common', bestSpot: 'Island colonies', description: 'Large colonies roost on lagoon islands' },
    { id: '7', species: 'Asian Water Snake', type: 'Reptile', frequency: 'Rare sighting', bestSpot: 'Mangrove roots', description: 'Non-venomous snake occasionally seen swimming' },
    { id: '8', species: 'Brahminy Kite', type: 'Bird', frequency: 'Common', bestSpot: 'Above water', description: 'Beautiful chestnut and white raptor' }
  ],
  lagoonZones: [
    { id: '1', zone: 'Main Lagoon', features: ['Open water', 'Island visits', 'Fishing boats', 'Best for sunset'], wildlife: ['Sea eagles', 'Herons', 'Cormorants'] },
    { id: '2', zone: 'Mangrove Tunnels', features: ['Natural canopy', 'Cool shade', 'Narrow passages', 'Unique ecosystem'], wildlife: ['Monitor lizards', 'Snakes', 'Mudskippers'] },
    { id: '3', zone: 'River Mouth', features: ['Tidal changes', 'Sand bars', 'Ocean connection', 'Dynamic environment'], wildlife: ['Crocodiles', 'Fish eagles', 'Terns'] },
    { id: '4', zone: 'Village Areas', features: ['Traditional life', 'Fishing methods', 'Local interaction', 'Cultural insights'], wildlife: ['Domestic birds', 'Village wildlife'] }
  ],
  faqs: [
    { id: '1', question: 'Is the lagoon safari safe for children?', answer: 'Yes, the lagoon safari is very safe for children. All boats are stable and equipped with life jackets in children\'s sizes. The water is calm, and our guides are experienced with family groups. Children usually love spotting wildlife and the boat ride itself.' },
    { id: '2', question: 'What\'s the best time of day for wildlife viewing?', answer: 'Early morning (6-8 AM) and late afternoon (4-6 PM) offer the best wildlife viewing. Birds are most active during these cooler hours, and you\'re more likely to see monitors and other reptiles. The lighting is also perfect for photography during these golden hours.' },
    { id: '3', question: 'Do I need to know how to swim?', answer: 'No swimming skills are required as you remain in the boat throughout the safari. Life jackets are provided and must be worn. The boats are very stable, and the lagoon waters are generally calm. Our guides are trained in water safety.' },
    { id: '4', question: 'What should I bring on the safari?', answer: 'Essentials include sunscreen, hat, sunglasses, camera, and binoculars (though we provide these too). Wear light, comfortable clothing and bring insect repellent. A light rain jacket during monsoon season is advisable. We provide water and snacks.' },
    { id: '5', question: 'How close do we get to wildlife?', answer: 'We maintain respectful distances from all wildlife for their safety and yours. However, many animals are habituated to boats and allow relatively close approach. With binoculars and zoom lenses, you\'ll get excellent views and photos. Kingfishers often perch very close to boats.' },
    { id: '6', question: 'What happens if it rains?', answer: 'Light rain doesn\'t affect the safari and can actually enhance the experience with more active wildlife. We provide rain ponchos if needed. For heavy storms, we may delay departure or offer rescheduling. The mangrove areas provide natural shelter from rain.' }
  ],
  gallery: [
    { id: '1', url: 'https://images.unsplash.com/photo-1569163139394-de4b5c4c4e3f?w=400&h=300&fit=crop', alt: 'Bentota Lagoon' },
    { id: '2', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop', alt: 'Mangrove exploration' },
    { id: '3', url: 'https://images.unsplash.com/photo-1596706487638-7c924bf5883a?w=400&h=300&fit=crop', alt: 'River wildlife' },
    { id: '4', url: 'https://images.unsplash.com/photo-1585016495481-91613a3ab1bc?w=400&h=300&fit=crop', alt: 'Peaceful waters' },
    { id: '5', url: 'https://images.unsplash.com/photo-1574263867128-a00c8b5e62f4?w=400&h=300&fit=crop', alt: 'Canoe safari' },
    { id: '6', url: 'https://images.unsplash.com/photo-1605713288610-00c1c630f6c6?w=400&h=300&fit=crop', alt: 'Bird watching' },
    { id: '7', url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop', alt: 'Mangrove tunnel' },
    { id: '8', url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop', alt: 'Sunset safari' }
  ],
  cta: {
    title: 'Ready to Explore the Lagoon?',
    description: "Embark on a peaceful journey through Bentota's magical waterways. Book your lagoon safari today and discover nature's hidden treasures.",
    primaryButtonText: 'Book Safari Tour',
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
    title: 'Bentota Lagoon Safari | Mangrove Boat Tours Sri Lanka | Recharge Travels',
    description: "Explore Bentota's rich lagoon ecosystem by traditional canoe. Spot crocodiles, monitor lizards, exotic birds, and navigate through mystical mangrove tunnels.",
    keywords: ['Bentota lagoon safari', 'mangrove boat tour', 'river safari Sri Lanka', 'bird watching Bentota', 'canoe safari', 'wildlife boat tour'],
    ogImage: 'https://images.unsplash.com/photo-1569163139394-de4b5c4c4e3f?w=1200&h=630&fit=crop'
  }
};

// Service class
class LagoonSafariPageService {
  async getPageContent(): Promise<LagoonSafariPageContent> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as LagoonSafariPageContent;
      } else {
        // Initialize with default content if doesn't exist
        await this.updatePageContent(defaultContent);
        return defaultContent;
      }
    } catch (error) {
      console.error('Error fetching lagoon safari page content:', error);
      return defaultContent;
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
    return defaultContent;
  }
}

export const lagoonSafariPageService = new LagoonSafariPageService();
export default lagoonSafariPageService;
