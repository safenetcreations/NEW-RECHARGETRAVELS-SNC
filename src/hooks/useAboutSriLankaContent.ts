import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * ABOUT SRI LANKA CONTENT HOOK
 * 
 * Custom hook to fetch and manage About Sri Lanka page content from Firebase Firestore
 * 
 * Features:
 * - Fetches content from Firestore
 * - Falls back to default content if not found
 * - Handles loading and error states
 * - Type-safe content structure
 */

interface StatItem {
  value: string;
  label: string;
  desc: string;
}

interface Destination {
  name: string;
  description: string;
  image: string;
  region?: string;
}

interface Experience {
  title: string;
  description: string;
  image: string;
  icon?: string;
}

interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  badge?: string;
}

interface GalleryImage {
  url: string;
  caption?: string;
}

interface Testimonial {
  name: string;
  location: string;
  text: string;
  avatar?: string;
  rating?: number;
}

interface VideoTour {
  title: string;
  url: string;
  thumbnail: string;
  duration?: string;
}

interface AboutSriLankaContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroSlides?: HeroSlide[];
  mainDescription: string;
  secondaryDescription: string;
  stats: {
    area: StatItem;
    population: StatItem;
    species: StatItem;
    unesco: StatItem;
  };
  highlights: string[];
  culturalInfo: string;
  naturalInfo: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  
  // New sections
  destinations?: Destination[];
  experiences?: Experience[];
  gallery?: GalleryImage[];
  testimonials?: Testimonial[];
  videoTours?: VideoTour[];
}

const defaultContent: AboutSriLankaContent = {
  heroTitle: "The Pearl of the Indian Ocean",
  heroSubtitle: "Discover Sri Lanka's Rich Heritage and Natural Beauty",
  heroImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&q=80",
  heroSlides: [
    {
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&q=80",
      title: "The Pearl of the Indian Ocean",
      subtitle: "Discover Sri Lanka's Rich Heritage and Natural Beauty",
      badge: "Discover Paradise"
    },
    {
      image: "https://images.unsplash.com/photo-1588258524675-55d656396b8a?q=80&w=1920",
      title: "Ancient Kingdoms Await",
      subtitle: "Walk through 2,500 years of fascinating history at Sigiriya Rock Fortress",
      badge: "UNESCO Heritage"
    },
    {
      image: "https://images.unsplash.com/photo-1546708773-e52953324f83?q=80&w=1920",
      title: "Misty Mountain Paradise",
      subtitle: "Experience the legendary tea plantations and cool climate of Hill Country",
      badge: "Hill Country"
    }
  ],
  mainDescription: "Sri Lanka, a teardrop-shaped island in the Indian Ocean, offers an incredible diversity of experiences within its compact borders. From misty mountains and lush rainforests to golden beaches and ancient ruins, this tropical paradise has captivated travelers for centuries.",
  secondaryDescription: "With a history spanning over 2,500 years, Sri Lanka boasts eight UNESCO World Heritage Sites, a rich cultural tapestry influenced by Buddhism, Hinduism, and colonial heritage, and some of the world's finest tea, spices, and gemstones.",
  stats: {
    area: { value: "65,610", label: "Square Kilometers", desc: "Compact island paradise" },
    population: { value: "22M", label: "Population", desc: "Warm & welcoming people" },
    species: { value: "3,000+", label: "Endemic Species", desc: "Biodiversity hotspot" },
    unesco: { value: "8", label: "UNESCO Sites", desc: "World heritage treasures" }
  },
  highlights: [
    "Ancient Buddhist temples and stupas",
    "Pristine beaches and coral reefs",
    "Misty tea plantations",
    "Wildlife safaris in national parks",
    "Spice gardens and plantations",
    "Colonial architecture",
    "Traditional Ayurvedic treatments",
    "Adventure sports and activities"
  ],
  culturalInfo: "Sri Lanka's cultural heritage is a fascinating blend of indigenous traditions and foreign influences. The island has been a crossroads of trade routes for centuries, resulting in a unique cultural mosaic that includes Buddhist temples, Hindu kovils, Islamic mosques, and Christian churches.",
  naturalInfo: "From the central highlands with their cool climate and tea estates to the coastal plains with palm-fringed beaches, Sri Lanka's diverse geography supports an incredible variety of ecosystems. The island is home to numerous national parks and wildlife sanctuaries.",
  seoTitle: "About Sri Lanka - The Pearl of the Indian Ocean | Recharge Travels",
  seoDescription: "Discover Sri Lanka's rich history, diverse culture, and stunning natural beauty. Learn about the island's UNESCO World Heritage Sites, wildlife, and unique experiences.",
  seoKeywords: "Sri Lanka, travel, tourism, culture, history, UNESCO, wildlife, beaches, temples, tea plantations",
  
  // Default data for new sections
  destinations: [
    {
      name: "Sigiriya Rock Fortress",
      description: "Ancient 5th-century fortress with stunning frescoes and panoramic views",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      region: "Cultural Triangle"
    },
    {
      name: "Ella",
      description: "Charming hill country town surrounded by tea plantations and waterfalls",
      image: "https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800&q=80",
      region: "Hill Country"
    },
    {
      name: "Galle Fort",
      description: "Historic Dutch colonial fort with cobblestone streets and ocean views",
      image: "https://images.unsplash.com/photo-1608532835465-224608a6c0e0?w=800&q=80",
      region: "Southern Coast"
    },
    {
      name: "Yala National Park",
      description: "Premier wildlife destination with highest leopard density in the world",
      image: "https://images.unsplash.com/photo-1535338623859-51e6e6f8d9da?w=800&q=80",
      region: "Southeast"
    },
    {
      name: "Kandy",
      description: "Cultural capital home to the sacred Temple of the Tooth Relic",
      image: "https://images.unsplash.com/photo-1594408452005-5c3f1e98ed19?w=800&q=80",
      region: "Central Province"
    },
    {
      name: "Mirissa",
      description: "Beautiful beach town famous for whale watching and surfing",
      image: "https://images.unsplash.com/photo-1583797000246-cfaa0f5ebb6d?w=800&q=80",
      region: "Southern Coast"
    }
  ],
  
  experiences: [
    {
      title: "Wildlife Safari",
      description: "Encounter elephants, leopards, and exotic birds in their natural habitat",
      image: "https://images.unsplash.com/photo-1535338623859-51e6e6f8d9da?w=600&q=80",
      icon: "🦁"
    },
    {
      title: "Tea Plantation Tour",
      description: "Visit lush tea estates and learn about Ceylon tea production",
      image: "https://images.unsplash.com/photo-1587159209150-60e8ea6c1ffe?w=600&q=80",
      icon: "🍵"
    },
    {
      title: "Cultural Heritage",
      description: "Explore ancient temples, ruins, and UNESCO World Heritage Sites",
      image: "https://images.unsplash.com/photo-1552309953-2bdf7b21eac8?w=600&q=80",
      icon: "🏛️"
    },
    {
      title: "Beach Paradise",
      description: "Relax on pristine beaches with crystal-clear waters",
      image: "https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=600&q=80",
      icon: "🏖️"
    }
  ],
  
  gallery: [
    {
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      caption: "Sigiriya Rock Fortress at sunrise"
    },
    {
      url: "https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800&q=80",
      caption: "Nine Arch Bridge in Ella"
    },
    {
      url: "https://images.unsplash.com/photo-1552309953-2bdf7b21eac8?w=800&q=80",
      caption: "Temple of the Sacred Tooth Relic"
    },
    {
      url: "https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=800&q=80",
      caption: "Pristine beach in Mirissa"
    },
    {
      url: "https://images.unsplash.com/photo-1587159209150-60e8ea6c1ffe?w=800&q=80",
      caption: "Tea plantations in Nuwara Eliya"
    },
    {
      url: "https://images.unsplash.com/photo-1535338623859-51e6e6f8d9da?w=800&q=80",
      caption: "Leopard in Yala National Park"
    },
    {
      url: "https://images.unsplash.com/photo-1594408452005-5c3f1e98ed19?w=800&q=80",
      caption: "Kandy Lake at sunset"
    },
    {
      url: "https://images.unsplash.com/photo-1608532835465-224608a6c0e0?w=800&q=80",
      caption: "Galle Fort lighthouse"
    }
  ],
  
  testimonials: [
    {
      name: "Sarah Johnson",
      location: "New York, USA",
      text: "Sri Lanka exceeded all our expectations! The combination of ancient culture, stunning landscapes, and warm hospitality made it the trip of a lifetime. Recharge Travels took care of every detail.",
      avatar: "https://i.pravatar.cc/150?img=1",
      rating: 5
    },
    {
      name: "James Wilson",
      location: "London, UK",
      text: "From the tea plantations to the wildlife safaris, every moment was magical. Our guide was incredibly knowledgeable and the accommodations were top-notch. Can't wait to return!",
      avatar: "https://i.pravatar.cc/150?img=12",
      rating: 5
    },
    {
      name: "Emma Schmidt",
      location: "Berlin, Germany",
      text: "The diversity of experiences in such a compact country is amazing. We went from beaches to mountains, temples to tea estates, all in two weeks. Perfectly organized by Recharge Travels!",
      avatar: "https://i.pravatar.cc/150?img=5",
      rating: 5
    },
    {
      name: "Michael Chen",
      location: "Singapore",
      text: "As someone who travels extensively, Sri Lanka stands out as one of the most beautiful and culturally rich destinations I've visited. The food, the people, the landscapes - everything was perfect!",
      avatar: "https://i.pravatar.cc/150?img=13",
      rating: 5
    }
  ],
  
  videoTours: [
    {
      title: "Aerial View of Sri Lanka",
      url: "https://www.youtube.com/embed/7gV3g9LCvPc",
      thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
      duration: "3:45"
    },
    {
      title: "Cultural Heritage Sites",
      url: "https://www.youtube.com/embed/gKHp8Ks0q0Y",
      thumbnail: "https://images.unsplash.com/photo-1552309953-2bdf7b21eac8?w=600&q=80",
      duration: "5:20"
    },
    {
      title: "Wildlife Safari Experience",
      url: "https://www.youtube.com/embed/TszOvPEskIE",
      thumbnail: "https://images.unsplash.com/photo-1535338623859-51e6e6f8d9da?w=600&q=80",
      duration: "4:15"
    }
  ]
};

export const useAboutSriLankaContent = () => {
  const [content, setContent] = useState<AboutSriLankaContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        
        // Check if Firebase is initialized
        if (!db) {
          console.warn('Firebase not initialized, using default content');
          setContent(defaultContent);
          setError(null);
          setLoading(false);
          return;
        }
        
        const docRef = doc(db, 'page-content', 'about-sri-lanka');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as AboutSriLankaContent;
          // Merge with default content to ensure all fields exist
          setContent({ ...defaultContent, ...data });
          console.log('Successfully loaded About Sri Lanka content from Firebase');
        } else {
          console.log('No content found in Firebase, using default content');
          // Use default content if document doesn't exist
          setContent(defaultContent);
        }
        setError(null);
      } catch (err) {
        console.error('Error loading About Sri Lanka content:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load content';
        console.warn(`Using default content due to error: ${errorMessage}`);
        // Still use default content on error - don't show error to user
        setContent(defaultContent);
        setError(null); // Don't show error since we have fallback content
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  return { content, loading, error };
};

export type { AboutSriLankaContent, Destination, Experience, GalleryImage, Testimonial, VideoTour, HeroSlide };
