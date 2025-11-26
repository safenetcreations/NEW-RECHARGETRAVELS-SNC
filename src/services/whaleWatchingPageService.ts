import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface HeroImage {
  id: string;
  url: string;
  caption: string;
}

export interface WhaleLocation {
  id: string;
  name: string;
  description: string;
  bestMonths: string;
  distance: string;
  species: string[];
  successRate: string;
  otherWildlife: string[];
  tourDuration: string;
}

export interface WhaleSpecies {
  id: string;
  name: string;
  scientificName: string;
  size: string;
  weight: string;
  characteristics: string;
  bestSpots: string;
}

export interface WhaleTour {
  id: string;
  name: string;
  duration: string;
  price: string;
  highlights: string[];
  included: string[];
  iconName: string;
  departures: string;
}

export interface Guideline {
  id: string;
  text: string;
  type: 'best-practice' | 'avoid';
}

export interface PreparationTip {
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

export interface WhaleWatchingPageContent {
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
  locations: WhaleLocation[];
  species: WhaleSpecies[];
  tours: WhaleTour[];
  guidelines: {
    bestPractices: Guideline[];
    thingsToAvoid: Guideline[];
  };
  preparationTips: PreparationTip[];
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

const COLLECTION_NAME = 'whaleWatchingPage';
const DOC_ID = 'content';

const defaultContent: WhaleWatchingPageContent = {
  hero: {
    title: "Whale Watching Adventures",
    subtitle: "Encounter Blue Whales & Dolphins in Their Natural Habitat",
    ctaText: "Book Whale Tour",
    images: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=1920&h=1080&fit=crop',
        caption: 'Blue Whale Breach'
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1596414086775-3e321ab08f36?w=1920&h=1080&fit=crop',
        caption: 'Sperm Whale Encounter'
      },
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1544551763-92b13f5a8f89?w=1920&h=1080&fit=crop',
        caption: 'Dolphin Pod Swimming'
      },
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1618075253632-c4a6a901a744?w=1920&h=1080&fit=crop',
        caption: 'Whale Tail Sunset'
      }
    ]
  },
  overview: {
    title: "World-Class Whale Watching in Sri Lanka",
    description: "Sri Lanka is one of the best places in the world to see blue whales, the largest animals ever known to have lived on Earth. Our warm tropical waters attract these magnificent creatures year-round, along with sperm whales, dolphins, and other marine life. Join expert guides for responsible, unforgettable encounters."
  },
  stats: [
    { id: '1', label: "Whale Species", value: "26", iconName: "Fish" },
    { id: '2', label: "Success Rate", value: "90%+", iconName: "Eye" },
    { id: '3', label: "Season Length", value: "6 Months", iconName: "Calendar" },
    { id: '4', label: "Annual Visitors", value: "50,000+", iconName: "Users" }
  ],
  locations: [
    {
      id: '1',
      name: "Mirissa",
      description: "The most popular whale watching destination with the highest success rates for blue whale sightings.",
      bestMonths: "November to April",
      distance: "6-10km offshore",
      species: ["Blue Whales", "Sperm Whales", "Fin Whales", "Dolphins"],
      successRate: "90-95%",
      otherWildlife: ["Sea Turtles", "Flying Fish", "Manta Rays"],
      tourDuration: "4-5 hours"
    },
    {
      id: '2',
      name: "Trincomalee",
      description: "Less crowded alternative offering excellent whale watching, especially for sperm whales.",
      bestMonths: "March to August",
      distance: "8-15km offshore",
      species: ["Sperm Whales", "Blue Whales", "Bryde's Whales", "Spinner Dolphins"],
      successRate: "85-90%",
      otherWildlife: ["Pilot Whales", "Sea Birds", "Turtles"],
      tourDuration: "4-6 hours"
    },
    {
      id: '3',
      name: "Kalpitiya",
      description: "Famous for large pods of dolphins and seasonal whale migrations, plus Bar Reef access.",
      bestMonths: "November to March",
      distance: "3-8km offshore",
      species: ["Spinner Dolphins", "Sperm Whales", "Pilot Whales", "Bottlenose Dolphins"],
      successRate: "95% (dolphins), 70% (whales)",
      otherWildlife: ["Dugongs", "Sea Turtles", "Reef Fish"],
      tourDuration: "3-4 hours"
    },
    {
      id: '4',
      name: "Dondra Point",
      description: "The southernmost point of Sri Lanka where deep ocean currents bring whales close to shore.",
      bestMonths: "December to April",
      distance: "5-12km offshore",
      species: ["Blue Whales", "Sperm Whales", "Killer Whales", "Dolphins"],
      successRate: "85-90%",
      otherWildlife: ["Whale Sharks", "Sea Eagles", "Tuna"],
      tourDuration: "4-5 hours"
    }
  ],
  species: [
    {
      id: '1',
      name: "Blue Whale",
      scientificName: "Balaenoptera musculus",
      size: "Up to 30 meters",
      weight: "Up to 200 tons",
      characteristics: "Largest animal ever known, distinctive blue-gray coloring",
      bestSpots: "Mirissa, Dondra Point"
    },
    {
      id: '2',
      name: "Sperm Whale",
      scientificName: "Physeter macrocephalus",
      size: "Up to 20 meters",
      weight: "Up to 50 tons",
      characteristics: "Massive square head, deep diving ability",
      bestSpots: "Trincomalee, Kalpitiya"
    },
    {
      id: '3',
      name: "Spinner Dolphin",
      scientificName: "Stenella longirostris",
      size: "Up to 2 meters",
      weight: "Up to 80 kg",
      characteristics: "Acrobatic spinning jumps, large pods",
      bestSpots: "Kalpitiya, All locations"
    },
    {
      id: '4',
      name: "Bryde's Whale",
      scientificName: "Balaenoptera edeni",
      size: "Up to 15 meters",
      weight: "Up to 25 tons",
      characteristics: "Year-round residents, surface feeders",
      bestSpots: "Trincomalee"
    }
  ],
  tours: [
    {
      id: '1',
      name: "Premium Blue Whale Safari",
      duration: "Half Day",
      price: "$65",
      highlights: [
        "Early morning departure",
        "Marine biologist guide",
        "Guaranteed second trip if no sightings",
        "Maximum 15 passengers"
      ],
      included: [
        "Hotel pickup/drop",
        "Breakfast on board",
        "Life jackets",
        "Binoculars",
        "Refreshments"
      ],
      iconName: "Ship",
      departures: "5:30 AM"
    },
    {
      id: '2',
      name: "Whale & Dolphin Combo",
      duration: "Full Day",
      price: "$85",
      highlights: [
        "Extended ocean time",
        "Multiple species search",
        "Snorkeling opportunity",
        "Lunch included"
      ],
      included: [
        "All transfers",
        "Meals & drinks",
        "Snorkeling gear",
        "Photography tips",
        "Certificate"
      ],
      iconName: "Fish",
      departures: "6:00 AM"
    },
    {
      id: '3',
      name: "Private Yacht Experience",
      duration: "Half Day",
      price: "$450 (up to 6 people)",
      highlights: [
        "Private luxury yacht",
        "Flexible timing",
        "Personalized route",
        "Champagne service"
      ],
      included: [
        "Private yacht charter",
        "Captain & crew",
        "Gourmet breakfast",
        "All equipment",
        "Photographer available"
      ],
      iconName: "Anchor",
      departures: "Flexible"
    },
    {
      id: '4',
      name: "Research Vessel Tour",
      duration: "6 Hours",
      price: "$95",
      highlights: [
        "Join marine researchers",
        "Hydrophone listening",
        "Data collection participation",
        "Educational presentation"
      ],
      included: [
        "Research boat access",
        "Expert scientists",
        "Equipment use",
        "Lunch",
        "Research certificate"
      ],
      iconName: "Binoculars",
      departures: "6:30 AM"
    }
  ],
  guidelines: {
    bestPractices: [
      {
        id: '1',
        text: "Choose operators certified by responsible whale watching organizations",
        type: 'best-practice'
      },
      {
        id: '2',
        text: "Maintain respectful distance (minimum 100m from whales)",
        type: 'best-practice'
      },
      {
        id: '3',
        text: "Limit viewing time to 30 minutes per whale encounter",
        type: 'best-practice'
      },
      {
        id: '4',
        text: "Support conservation through eco-friendly tour operators",
        type: 'best-practice'
      }
    ],
    thingsToAvoid: [
      {
        id: '1',
        text: "Never touch, feed, or swim with whales",
        type: 'avoid'
      },
      {
        id: '2',
        text: "Avoid loud noises or sudden movements on boats",
        type: 'avoid'
      },
      {
        id: '3',
        text: "Don't throw anything overboard, including food",
        type: 'avoid'
      },
      {
        id: '4',
        text: "Never chase or harass marine animals",
        type: 'avoid'
      }
    ]
  },
  preparationTips: [
    {
      id: '1',
      category: "Photography",
      iconName: "Camera",
      items: [
        "Zoom lens (200mm+) recommended",
        "Waterproof camera protection",
        "Extra batteries and memory cards",
        "Avoid flash photography"
      ]
    },
    {
      id: '2',
      category: "Sun Protection",
      iconName: "Sun",
      items: [
        "High SPF sunscreen",
        "Wide-brimmed hat",
        "UV-protective clothing",
        "Polarized sunglasses"
      ]
    },
    {
      id: '3',
      category: "Comfort Items",
      iconName: "Wind",
      items: [
        "Motion sickness medication",
        "Light windbreaker",
        "Non-slip shoes",
        "Small dry bag for valuables"
      ]
    }
  ],
  photoGallery: [
    "https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1596414086775-3e321ab08f36?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1544551763-92b13f5a8f89?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1618075253632-c4a6a901a744?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1580017601223-0a88a5142d5f?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1604202234978-df739b9c6783?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1517584704925-10a5edf06e2f?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1518399104871-600557593095?w=400&h=300&fit=crop"
  ],
  faqs: [
    {
      id: '1',
      question: "What is the best time of year for whale watching in Sri Lanka?",
      answer: "The best time varies by location. For the south coast (Mirissa, Dondra), November to April is ideal. For the east coast (Trincomalee), March to August is best. The calmest seas and highest success rates are typically from December to March on the south coast."
    },
    {
      id: '2',
      question: "What are the chances of seeing whales?",
      answer: "Success rates are very high in Sri Lanka, typically 85-95% for whale sightings during the season. Blue whales are most commonly seen from December to March. Even if whales aren't spotted, dolphins are almost always encountered."
    },
    {
      id: '3',
      question: "Is whale watching safe for pregnant women and children?",
      answer: "While tours are generally safe, pregnant women should consult their doctor first. Children are welcome but must be supervised at all times and wear life jackets. Some operators have minimum age requirements (usually 5 years). Sea conditions can be rough, so consider motion sickness medication."
    },
    {
      id: '4',
      question: "What should I bring on a whale watching tour?",
      answer: "Essential items include sunscreen, sunglasses, hat, camera with zoom lens, motion sickness medication (if needed), light jacket, and water. Binoculars are usually provided. Wear comfortable, non-slip shoes and avoid loose items that could blow away."
    },
    {
      id: '5',
      question: "How close do boats get to the whales?",
      answer: "Responsible operators follow strict guidelines, maintaining at least 100 meters distance from whales. The whales sometimes approach boats out of curiosity. All reputable operators follow international whale watching regulations to ensure animal welfare."
    },
    {
      id: '6',
      question: "What if we don't see any whales?",
      answer: "Most reputable operators offer a second trip free of charge or a partial refund if no whales or dolphins are sighted. Always confirm the operator's policy before booking. Remember that wildlife sightings can never be 100% guaranteed."
    }
  ],
  cta: {
    title: "Ready to Meet the Giants of the Ocean?",
    description: "Join us for an unforgettable whale watching adventure. Experience these magnificent creatures in their natural habitat.",
    primaryButtonText: "Book Whale Tour",
    secondaryButtonText: "Call for Details"
  },
  contact: {
    phone: "+94 76 505 9595",
    email: "info@rechargetravels.com",
    website: "www.rechargetravels.com"
  },
  seo: {
    title: "Whale Watching Sri Lanka | Blue Whale Tours Mirissa | Recharge Travels",
    description: "Experience world-class whale watching in Sri Lanka. See blue whales, sperm whales, and dolphins in Mirissa, Trincomalee, and Kalpitiya with expert guides.",
    keywords: ["whale watching Sri Lanka", "Mirissa whale watching", "blue whale tours", "dolphin watching", "Trincomalee whales", "marine wildlife tours"],
    ogImage: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=1200&h=630&fit=crop"
  }
};

class WhaleWatchingPageService {
  async getPageContent(): Promise<WhaleWatchingPageContent> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as WhaleWatchingPageContent;
      } else {
        // Initialize with default content
        await this.updatePageContent(defaultContent);
        return defaultContent;
      }
    } catch (error) {
      console.error('Error fetching whale watching page content:', error);
      return defaultContent;
    }
  }

  async updatePageContent(content: Partial<WhaleWatchingPageContent>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      const currentContent = await this.getPageContent();
      const updatedContent = { ...currentContent, ...content };

      await setDoc(docRef, updatedContent);
      console.log('Whale watching page content updated successfully');
    } catch (error) {
      console.error('Error updating whale watching page content:', error);
      throw error;
    }
  }

  async resetToDefault(): Promise<void> {
    await this.updatePageContent(defaultContent);
  }
}

export const whaleWatchingPageService = new WhaleWatchingPageService();
