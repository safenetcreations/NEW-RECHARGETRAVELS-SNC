import { doc, getDoc, setDoc, collection, addDoc, updateDoc, deleteDoc, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface HeroImage {
  id: string;
  url: string;
  caption: string;
}

export interface RouteInfo {
  id: string;
  name: string;
  description: string;
  duration: string;
  distance: string;
  highlights: string[];
  bestTime: string;
  price: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
}

export interface TrainClass {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  iconName: string;
}

export interface TourPackage {
  id: string;
  name: string;
  duration: string;
  price: string;
  highlights: string[];
  included: string[];
  iconName: string;
}

export interface BookingTip {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface JourneyHighlight {
  id: string;
  title: string;
  description: string;
  iconName: string;
  image: string;
}

export interface TrainJourneysPageContent {
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
  stats: Array<{
    id: string;
    label: string;
    value: string;
    iconName: string;
  }>;
  routes: RouteInfo[];
  trainClasses: TrainClass[];
  tourPackages: TourPackage[];
  bookingTips: BookingTip[];
  journeyHighlights: JourneyHighlight[];
  whatToBring: {
    essentials: string[];
    comfortItems: string[];
    photography: string[];
  };
  photoGallery: string[];
  faqs: FAQ[];
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

const COLLECTION_NAME = 'trainJourneysPage';
const DOC_ID = 'content';

const defaultContent: TrainJourneysPageContent = {
  hero: {
    title: "Ride the Rails of Paradise",
    subtitle: "Sri Lanka's Iconic Train Routes Through Misty Hills & Tea Plantations",
    ctaText: "Book Your Journey",
    images: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1564769610726-63c0b4b07b27?w=1920&h=1080&fit=crop',
        caption: 'Nine Arch Bridge - Ella'
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1589456506629-b2ea1a8576fb?w=1920&h=1080&fit=crop',
        caption: 'Tea Plantations Journey'
      },
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1609924211018-ba526e55e6e0?w=1920&h=1080&fit=crop',
        caption: 'Hill Country Rails'
      },
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1566396386016-244e66a09199?w=1920&h=1080&fit=crop',
        caption: 'Observation Car Views'
      }
    ]
  },
  overview: {
    title: "Experience One of the World's Most Beautiful Train Rides",
    description: "Experience one of the most beautiful train rides in the world, winding through misty hills, lush forests, and tea plantations. Sri Lanka's scenic train journeys are an unforgettable way to explore the island's spectacular highland scenery and colonial heritage."
  },
  stats: [
    { id: '1', label: "Active Routes", value: "10+", iconName: "Train" },
    { id: '2', label: "Iconic Bridges", value: "50+", iconName: "Mountain" },
    { id: '3', label: "Elevation", value: "1,900m", iconName: "Mountain" },
    { id: '4', label: "Photo Spots", value: "100+", iconName: "Camera" }
  ],
  routes: [
    {
      id: '1',
      name: "Kandy to Ella",
      description: "The most famous train journey in Sri Lanka, passing through misty mountains, tea plantations, and waterfalls.",
      duration: "6-7 hours",
      distance: "140 km",
      highlights: ["Nine Arch Bridge", "Demodara Loop", "Tea Estates", "Waterfalls"],
      bestTime: "Morning departure for best views",
      price: "From $3-$50",
      difficulty: "Easy"
    },
    {
      id: '2',
      name: "Colombo to Badulla",
      description: "The complete hill country railway experience, from coastal plains to the highest railway station.",
      duration: "9-10 hours",
      distance: "290 km",
      highlights: ["Complete Hill Country Route", "Diverse Landscapes", "Colonial Stations", "Local Life"],
      bestTime: "Early morning start",
      price: "From $5-$60",
      difficulty: "Moderate"
    },
    {
      id: '3',
      name: "Ella to Haputale",
      description: "Short but spectacular journey through tea country with stunning valley views.",
      duration: "2 hours",
      distance: "45 km",
      highlights: ["Ella Gap Views", "Tea Factory Tours", "Lipton's Seat Access", "Mountain Scenery"],
      bestTime: "Morning for clear views",
      price: "From $1-$15",
      difficulty: "Easy"
    },
    {
      id: '4',
      name: "Kandy to Nuwara Eliya",
      description: "Journey to Sri Lanka's 'Little England' through breathtaking highland scenery.",
      duration: "4 hours",
      distance: "80 km",
      highlights: ["Ramboda Falls View", "Tea Country", "Colonial Architecture", "Cool Climate"],
      bestTime: "Mid-morning departure",
      price: "From $2-$30",
      difficulty: "Easy"
    }
  ],
  trainClasses: [
    {
      id: '1',
      name: "Observation Car",
      description: "Premium glass-walled carriages with panoramic views and comfortable seating.",
      price: "$50-$60",
      features: ["Large windows", "Air conditioning", "Reserved seating", "Best photo opportunities"],
      iconName: "Eye"
    },
    {
      id: '2',
      name: "First Class",
      description: "Comfortable reserved seats with good views and fan cooling.",
      price: "$15-$25",
      features: ["Reserved seats", "Fan cooling", "Good legroom", "Window seats available"],
      iconName: "Star"
    },
    {
      id: '3',
      name: "Second Class",
      description: "Reserved seating with basic comfort and local atmosphere.",
      price: "$5-$10",
      features: ["Reserved seats", "Natural ventilation", "Local experience", "Budget-friendly"],
      iconName: "Users"
    },
    {
      id: '4',
      name: "Third Class",
      description: "Unreserved seating offering authentic local travel experience.",
      price: "$1-$3",
      features: ["Unreserved seats", "Most authentic", "Very affordable", "Flexible travel"],
      iconName: "Train"
    }
  ],
  tourPackages: [
    {
      id: '1',
      name: "Scenic Rail & Chauffeur Combo",
      duration: "2 Days",
      price: "$180",
      highlights: [
        "Train ride Kandy to Ella",
        "Private car pickup/drop-off",
        "Hotel arrangements",
        "Photo stops included"
      ],
      included: [
        "Observation car tickets",
        "Professional driver",
        "Hotel bookings",
        "Station transfers",
        "Refreshments"
      ],
      iconName: "Package"
    },
    {
      id: '2',
      name: "Luxury Rail Experience",
      duration: "1 Day",
      price: "$120",
      highlights: [
        "First-class reserved seats",
        "Gourmet packed lunch",
        "Station lounge access",
        "Photography guide"
      ],
      included: [
        "Premium train tickets",
        "Meals and beverages",
        "VIP lounge access",
        "Souvenir package",
        "Insurance"
      ],
      iconName: "Star"
    },
    {
      id: '3',
      name: "Hill Country Rail Adventure",
      duration: "3 Days",
      price: "$350",
      highlights: [
        "Multiple train journeys",
        "Tea factory visits",
        "Nine Arch Bridge tour",
        "Ella activities"
      ],
      included: [
        "All train tickets",
        "Accommodation",
        "Guided tours",
        "All meals",
        "Transfers"
      ],
      iconName: "Mountain"
    }
  ],
  bookingTips: [
    {
      id: '1',
      title: "Advance Booking",
      description: "Book observation car and first-class tickets at least 30 days in advance",
      iconName: "Calendar"
    },
    {
      id: '2',
      title: "Best Seats",
      description: "Right side seats offer better views on Kandy-Ella route",
      iconName: "Eye"
    },
    {
      id: '3',
      title: "Photography",
      description: "Keep camera ready - views change quickly around curves",
      iconName: "Camera"
    },
    {
      id: '4',
      title: "Comfort Items",
      description: "Bring snacks, water, and a light jacket for hill country",
      iconName: "Coffee"
    }
  ],
  journeyHighlights: [
    {
      id: '1',
      title: "Nine Arch Bridge",
      description: "Iconic colonial-era viaduct surrounded by lush jungle",
      iconName: "Navigation",
      image: "https://images.unsplash.com/photo-1564769610726-63c0b4b07b27?w=500&h=300&fit=crop"
    },
    {
      id: '2',
      title: "Tea Plantations",
      description: "Endless rolling hills covered in emerald tea bushes",
      iconName: "TreePine",
      image: "https://images.unsplash.com/photo-1606820846835-91e342c0e5a0?w=500&h=300&fit=crop"
    },
    {
      id: '3',
      title: "Ella Rock Views",
      description: "Dramatic cliff-edge vistas and morning mists",
      iconName: "Mountain",
      image: "https://images.unsplash.com/photo-1588584922681-745a2223f72a?w=500&h=300&fit=crop"
    },
    {
      id: '4',
      title: "Local Life",
      description: "Authentic glimpses of village life along the tracks",
      iconName: "Users",
      image: "https://images.unsplash.com/photo-1602216056096-3b40cc63dc26?w=500&h=300&fit=crop"
    }
  ],
  whatToBring: {
    essentials: [
      "Valid tickets/booking confirmation",
      "Passport/ID",
      "Cash in small bills",
      "Mobile phone charged"
    ],
    comfortItems: [
      "Light jacket/shawl",
      "Snacks and water",
      "Hand sanitizer",
      "Tissues/wet wipes"
    ],
    photography: [
      "Camera with extra battery",
      "Memory cards",
      "Lens cleaning cloth",
      "Protective bag"
    ]
  },
  photoGallery: [
    "https://images.unsplash.com/photo-1609924211018-ba526e55e6e0?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1566396386016-244e66a09199?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1589456506629-b2ea1a8576fb?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1588584922681-745a2223f72a?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1606820846835-91e342c0e5a0?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1602216056096-3b40cc63dc26?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1566489549387-a3bb095f7e62?w=400&h=300&fit=crop"
  ],
  faqs: [
    {
      id: '1',
      question: "How do I book train tickets in advance?",
      answer: "Tickets can be booked online through Sri Lanka Railways website, at railway stations, or through our tour packages. Observation car tickets must be booked 30-45 days in advance due to high demand."
    },
    {
      id: '2',
      question: "Which side of the train has better views?",
      answer: "On the Kandy to Ella route, the right side generally offers better views of tea plantations and valleys. However, both sides have spectacular scenery, and views alternate throughout the journey."
    },
    {
      id: '3',
      question: "Can I take photos from the train doors?",
      answer: "Yes, the train doors often remain open, allowing for dramatic photos. Exercise extreme caution, hold on firmly, and never lean too far out. This is at your own risk."
    },
    {
      id: '4',
      question: "What's the difference between train classes?",
      answer: "Observation cars have large windows and AC, First Class has reserved seats with fans, Second Class has reserved seats without fans, and Third Class is unreserved seating. All classes travel on the same scenic route."
    },
    {
      id: '5',
      question: "Are trains punctual?",
      answer: "Trains can experience delays, especially during peak season. Plan flexible schedules and don't book tight connections. Delays are part of the adventure!"
    },
    {
      id: '6',
      question: "What should I bring on the train journey?",
      answer: "Bring water, snacks, camera, power bank, light jacket (for hill country), hand sanitizer, and small bills for vendors. Pack light as storage space is limited."
    }
  ],
  cta: {
    title: "Ready to Embark on Your Rail Adventure?",
    description: "Don't miss out on one of the world's most scenic train journeys. Book your tickets now and create memories that last a lifetime.",
    primaryButtonText: "Book Train Tickets",
    secondaryButtonText: "Call for Assistance"
  },
  contact: {
    phone: "+94 76 505 9595",
    email: "info@rechargetravels.com",
    website: "www.rechargetravels.com"
  },
  seo: {
    title: "Scenic Train Rides Sri Lanka | Railway Tours & Tickets | Recharge Travels",
    description: "Discover Sri Lanka's most scenic train journeys, including the iconic Kandy to Ella route. Book rail experiences and tours with Recharge Travels.",
    keywords: ["scenic train rides Sri Lanka", "Kandy to Ella train", "Sri Lanka railway tours", "Nine Arch Bridge", "observation car tickets", "hill country train journey"],
    ogImage: "https://images.unsplash.com/photo-1564769610726-63c0b4b07b27?w=1200&h=630&fit=crop"
  }
};

class TrainJourneysPageService {
  async getPageContent(): Promise<TrainJourneysPageContent> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as TrainJourneysPageContent;
      } else {
        // Initialize with default content
        await this.updatePageContent(defaultContent);
        return defaultContent;
      }
    } catch (error) {
      console.error('Error fetching train journeys page content:', error);
      return defaultContent;
    }
  }

  async updatePageContent(content: Partial<TrainJourneysPageContent>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      const currentContent = await this.getPageContent();
      const updatedContent = { ...currentContent, ...content };

      await setDoc(docRef, updatedContent);
      console.log('Train journeys page content updated successfully');
    } catch (error) {
      console.error('Error updating train journeys page content:', error);
      throw error;
    }
  }

  async resetToDefault(): Promise<void> {
    await this.updatePageContent(defaultContent);
  }
}

export const trainJourneysPageService = new TrainJourneysPageService();
