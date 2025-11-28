import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface FarmLocation {
  id: string;
  name: string;
  description: string;
  location: string;
  specialization: string;
  tourFeatures: string[];
  duration: string;
  groupSize: string;
  accessibility: string;
}

export interface TourPackage {
  id: string;
  name: string;
  duration: string;
  price: string;
  highlights: string[];
  included: string[];
  iconName: string;
  level: string;
}

export interface SeaCucumberFact {
  id: string;
  title: string;
  facts: string[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface SeaCucumberPageContent {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    images: Array<{ id: string; url: string; caption: string }>;
  };
  overview: {
    title: string;
    description: string;
  };
  stats: Array<{
    id: string;
    label: string;
    value: string;
    iconName: string;
  }>;
  farmLocations: FarmLocation[];
  tourPackages: TourPackage[];
  facts: SeaCucumberFact[];
  faqs: FAQ[];
  gallery: string[];
  cta: {
    title: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
}

const COLLECTION_NAME = 'seaCucumberPage';
const DOC_ID = 'content';

const defaultContent: SeaCucumberPageContent = {
  hero: {
    title: "Sea Cucumber Farm Tours",
    subtitle: "Discover Sustainable Marine Aquaculture in Sri Lanka",
    ctaText: "Book Farm Tour",
    images: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=1080&fit=crop',
        caption: 'Sea Cucumber Farming Facility'
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1920&h=1080&fit=crop',
        caption: 'Underwater Sea Gardens'
      },
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1920&h=1080&fit=crop',
        caption: 'Marine Aquaculture'
      },
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1682687981630-cefe9cd73072?w=1920&h=1080&fit=crop',
        caption: 'Sustainable Ocean Farming'
      }
    ]
  },
  overview: {
    title: "Explore the World of Sea Cucumber Farming",
    description: "Discover the fascinating world of sea cucumber aquaculture in Sri Lanka. Visit state-of-the-art farming facilities, learn about sustainable marine farming practices, and understand the ecological and economic importance of these remarkable creatures. Perfect for students, researchers, investors, and curious travelers."
  },
  stats: [
    { id: '1', label: "Farm Locations", value: "15+", iconName: "Shell" },
    { id: '2', label: "Species Farmed", value: "8", iconName: "Fish" },
    { id: '3', label: "Annual Production", value: "500+ tons", iconName: "TrendingUp" },
    { id: '4', label: "Jobs Created", value: "2,000+", iconName: "Users" }
  ],
  farmLocations: [
    {
      id: '1',
      name: "Mannar Sea Cucumber Research Center",
      description: "Leading facility for sea cucumber research and sustainable farming practices in Sri Lanka.",
      location: "Mannar District",
      specialization: "Research & Commercial Farming",
      tourFeatures: ["Research lab visit", "Breeding facility tour", "Underwater observation", "Expert presentations"],
      duration: "3 hours",
      groupSize: "Up to 15 people",
      accessibility: "Wheelchair accessible areas"
    },
    {
      id: '2',
      name: "Jaffna Peninsula Aquaculture Farms",
      description: "Traditional and modern sea cucumber farming techniques in the historic waters of Jaffna.",
      location: "Jaffna Peninsula",
      specialization: "Traditional Farming Methods",
      tourFeatures: ["Traditional harvesting demo", "Processing facility", "Local community interaction", "Market visit"],
      duration: "4 hours",
      groupSize: "Up to 20 people",
      accessibility: "Partial accessibility"
    },
    {
      id: '3',
      name: "Kalpitiya Sustainable Marine Farm",
      description: "Eco-friendly sea cucumber farming integrated with marine conservation efforts.",
      location: "Kalpitiya",
      specialization: "Sustainable Aquaculture",
      tourFeatures: ["Eco-farming methods", "Snorkeling with sea cucumbers", "Conservation workshop", "Coral reef integration"],
      duration: "Half day",
      groupSize: "Up to 12 people",
      accessibility: "Beach and boat access"
    },
    {
      id: '4',
      name: "Eastern Province Export Facility",
      description: "Commercial sea cucumber farming operation with focus on international export standards.",
      location: "Batticaloa",
      specialization: "Export Processing",
      tourFeatures: ["Commercial operations", "Quality control lab", "Export processing", "Business insights"],
      duration: "2.5 hours",
      groupSize: "Up to 10 people",
      accessibility: "Full facility access"
    }
  ],
  tourPackages: [
    {
      id: '1',
      name: "Educational Farm Visit",
      duration: "Half Day",
      price: "$45",
      highlights: ["Guided facility tour", "Expert presentations", "Hands-on activities", "Q&A session"],
      included: ["Transport from hotel", "Professional guide", "Refreshments", "Educational materials", "Certificate"],
      iconName: "Microscope",
      level: "All levels"
    },
    {
      id: '2',
      name: "Marine Biologist Experience",
      duration: "Full Day",
      price: "$120",
      highlights: ["Work with researchers", "Laboratory experience", "Underwater observation", "Data collection"],
      included: ["All equipment", "Lunch included", "Research participation", "Snorkeling gear", "Professional photos"],
      iconName: "Fish",
      level: "Intermediate"
    },
    {
      id: '3',
      name: "Investor's Tour",
      duration: "2 Days",
      price: "$350",
      highlights: ["Multiple farm visits", "Business presentations", "Market analysis", "Networking opportunities"],
      included: ["Accommodation", "All meals", "Business meetings", "Market tours", "Investment guide"],
      iconName: "TrendingUp",
      level: "Business focused"
    },
    {
      id: '4',
      name: "Family Discovery Tour",
      duration: "3 Hours",
      price: "$30 per person",
      highlights: ["Kid-friendly activities", "Touch pool experience", "Educational games", "Photo opportunities"],
      included: ["Family guide", "Children's activities", "Snacks and drinks", "Educational booklets", "Souvenir"],
      iconName: "Users",
      level: "Family friendly"
    }
  ],
  facts: [
    {
      id: '1',
      title: "Ecological Importance",
      facts: ["Recycle nutrients in marine ecosystems", "Clean ocean floor sediments", "Improve water quality", "Support coral reef health"]
    },
    {
      id: '2',
      title: "Economic Value",
      facts: ["High demand in Asian markets", "Medicinal properties", "Luxury food product", "Growing global market"]
    },
    {
      id: '3',
      title: "Farming Benefits",
      facts: ["Sustainable income source", "Low environmental impact", "Community employment", "Export opportunities"]
    }
  ],
  faqs: [
    {
      id: '1',
      question: "What exactly are sea cucumbers?",
      answer: "Sea cucumbers are marine animals that live on the ocean floor. Despite their name, they're not vegetables but echinoderms related to starfish and sea urchins. They play a crucial role in marine ecosystems and are considered a delicacy in many Asian cuisines."
    },
    {
      id: '2',
      question: "Is it safe to touch or handle sea cucumbers?",
      answer: "Yes, most farmed sea cucumber species are completely safe to touch. Our guides will show you the proper handling techniques. Some species can release sticky threads when stressed, but these are harmless. We provide gloves for those who prefer them."
    },
    {
      id: '3',
      question: "What should I wear for the farm tour?",
      answer: "Wear comfortable, water-resistant clothing and shoes that can get wet. Sun protection is essential. For tours involving snorkeling or water activities, bring swimwear. We provide any specialized equipment needed for the tours."
    },
    {
      id: '4',
      question: "Are the tours suitable for children?",
      answer: "Yes! Our Family Discovery Tours are designed specifically for children aged 5 and above. The educational content is adapted to be engaging and age-appropriate. Children must be supervised at all times, especially near water areas."
    },
    {
      id: '5',
      question: "Can I purchase sea cucumbers at the farms?",
      answer: "Some facilities have retail shops where you can purchase processed sea cucumber products. However, live specimens are not sold to tourists. We can arrange visits to local markets where dried sea cucumber products are available."
    },
    {
      id: '6',
      question: "What's the best time of year to visit?",
      answer: "Sea cucumber farms operate year-round, but the best visiting conditions are during the dry seasons (December to March for the west coast, May to September for the east coast). This ensures calmer seas for any water-based activities."
    }
  ],
  gallery: [
    "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1682687981630-cefe9cd73072?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1682687220777-2c60708d6889?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1584649054802-56f5e38a8e72?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1574263867128-a3d06eb5a883?w=400&h=300&fit=crop"
  ],
  cta: {
    title: "Ready to Explore Marine Aquaculture?",
    description: "Join us for an educational journey into sustainable sea cucumber farming. Perfect for students, researchers, and eco-conscious travelers.",
    primaryButtonText: "Book Farm Tour",
    secondaryButtonText: "Call for Details"
  },
  contact: {
    phone: "+94 76 505 9595",
    email: "info@rechargetravels.com",
    website: "www.rechargetravels.com"
  },
  seo: {
    title: "Sea Cucumber Farm Tours Sri Lanka | Marine Aquaculture Experience | Recharge Travels",
    description: "Visit sustainable sea cucumber farms in Sri Lanka. Educational tours showcasing marine aquaculture, conservation, and traditional farming methods.",
    keywords: ["sea cucumber farming Sri Lanka", "marine aquaculture tours", "sustainable farming", "educational tours", "Mannar sea cucumber", "aquaculture experience"],
    ogImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=630&fit=crop"
  }
};

class SeaCucumberPageService {
  async getPageContent(): Promise<SeaCucumberPageContent> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as SeaCucumberPageContent;
      } else {
        // Initialize with default content
        await this.updatePageContent(defaultContent);
        return defaultContent;
      }
    } catch (error) {
      console.error('Error fetching sea cucumber page content:', error);
      return defaultContent;
    }
  }

  async updatePageContent(content: Partial<SeaCucumberPageContent>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      const currentContent = await this.getPageContent();
      const updatedContent = { ...currentContent, ...content };

      await setDoc(docRef, updatedContent);
      console.log('Sea cucumber page content updated successfully');
    } catch (error) {
      console.error('Error updating sea cucumber page content:', error);
      throw error;
    }
  }

  async resetToDefault(): Promise<void> {
    await this.updatePageContent(defaultContent);
  }

  getDefaultContent(): SeaCucumberPageContent {
    return defaultContent;
  }
}

export const seaCucumberPageService = new SeaCucumberPageService();
