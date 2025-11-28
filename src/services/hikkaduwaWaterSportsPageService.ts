import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION_NAME = 'pageContent';
const DOC_ID = 'hikkaduwa-water-sports';

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

export interface WaterSport {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  includes: string[];
  requirements: string[];
  bestTime: string;
}

export interface SportPackage {
  id: string;
  name: string;
  duration: string;
  price: string;
  highlights: string[];
  included: string[];
  iconName: string;
  savings: string;
}

export interface SafetyGuideline {
  id: string;
  title: string;
  guidelines: string[];
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

export interface HikkaduwaWaterSportsPageContent {
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
  waterSports: WaterSport[];
  sportPackages: SportPackage[];
  safetyGuidelines: SafetyGuideline[];
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
const defaultContent: HikkaduwaWaterSportsPageContent = {
  hero: {
    title: 'Hikkaduwa Water Sports',
    subtitle: "Dive Into Adventure at Sri Lanka's Premier Beach Destination",
    ctaText: 'Book Water Sports',
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1530870110042-98b2cb110834?w=1920&h=1080&fit=crop', caption: 'Surfing in Hikkaduwa' },
      { id: '2', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&h=1080&fit=crop', caption: 'Snorkeling Paradise' },
      { id: '3', url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=1080&fit=crop', caption: 'Jet Ski Adventures' },
      { id: '4', url: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=1920&h=1080&fit=crop', caption: 'Stand-up Paddleboarding' }
    ]
  },
  overview: {
    title: 'Your Ultimate Water Sports Playground',
    description: "Hikkaduwa Beach offers the perfect combination of consistent waves, crystal-clear waters, and vibrant marine life. Whether you're a thrill-seeker looking for adrenaline-pumping activities or a beginner wanting to try something new, our certified instructors and top-quality equipment ensure safe and unforgettable experiences."
  },
  stats: [
    { id: '1', iconName: 'Activity', label: 'Activities', value: '15+' },
    { id: '2', iconName: 'Shield', label: 'Safety Record', value: '100%' },
    { id: '3', iconName: 'Users', label: 'Happy Guests', value: '10,000+' },
    { id: '4', iconName: 'Star', label: 'Google Rating', value: '4.9/5' }
  ],
  waterSports: [
    {
      id: '1',
      name: 'Surfing Lessons',
      description: "Learn to ride the waves at one of Sri Lanka's best surf spots with certified instructors.",
      duration: '2 hours',
      price: '$30',
      difficulty: 'All Levels',
      includes: ['Surfboard rental', 'Professional instruction', 'Safety equipment', 'Beach facilities'],
      requirements: ['Basic swimming ability', 'Age 10+'],
      bestTime: 'November to April'
    },
    {
      id: '2',
      name: 'Snorkeling Tours',
      description: 'Explore vibrant coral reefs and tropical fish in the crystal-clear waters of Hikkaduwa Marine Sanctuary.',
      duration: '2-3 hours',
      price: '$25',
      difficulty: 'Beginner',
      includes: ['Snorkeling gear', 'Boat ride', 'Guide', 'Life jacket'],
      requirements: ['Basic swimming', 'Age 8+'],
      bestTime: 'December to April'
    },
    {
      id: '3',
      name: 'Scuba Diving',
      description: 'Discover underwater wonders including shipwrecks, coral gardens, and diverse marine life.',
      duration: '3-4 hours',
      price: '$65',
      difficulty: 'All Levels',
      includes: ['Full equipment', 'Certified instructor', 'Boat transfer', 'Refreshments'],
      requirements: ['Good health', 'Age 12+', 'Medical clearance'],
      bestTime: 'November to April'
    },
    {
      id: '4',
      name: 'Jet Skiing',
      description: 'Feel the adrenaline rush as you speed across the Indian Ocean on a powerful jet ski.',
      duration: '30 minutes',
      price: '$40',
      difficulty: 'Intermediate',
      includes: ['Jet ski rental', 'Safety briefing', 'Life jacket', 'Fuel'],
      requirements: ['Age 16+', 'Swimming ability'],
      bestTime: 'Calm sea days'
    },
    {
      id: '5',
      name: 'Stand-up Paddleboarding',
      description: 'Enjoy a peaceful paddle along the coast while getting a full-body workout.',
      duration: '1.5 hours',
      price: '$20',
      difficulty: 'Beginner',
      includes: ['SUP board', 'Paddle', 'Basic instruction', 'Life jacket'],
      requirements: ['Balance', 'Age 10+'],
      bestTime: 'Early morning'
    },
    {
      id: '6',
      name: 'Banana Boat Rides',
      description: 'Fun group activity perfect for families and friends - hold on tight for a thrilling ride!',
      duration: '15 minutes',
      price: '$15 per person',
      difficulty: 'Beginner',
      includes: ['Banana boat ride', 'Life jackets', 'Safety briefing'],
      requirements: ['Age 6+', 'Swimming ability'],
      bestTime: 'Throughout the day'
    },
    {
      id: '7',
      name: 'Kayaking',
      description: 'Paddle through calm waters and explore hidden coves along the Hikkaduwa coastline.',
      duration: '2 hours',
      price: '$25',
      difficulty: 'Beginner',
      includes: ['Kayak rental', 'Paddle', 'Life jacket', 'Waterproof bag'],
      requirements: ['Basic fitness', 'Age 8+'],
      bestTime: 'Morning or late afternoon'
    },
    {
      id: '8',
      name: 'Glass Bottom Boat Tours',
      description: 'Perfect for non-swimmers to view coral reefs and marine life without getting wet.',
      duration: '1 hour',
      price: '$20',
      difficulty: 'All Levels',
      includes: ['Boat tour', 'Marine guide', 'Commentary'],
      requirements: ['None'],
      bestTime: 'Calm weather days'
    }
  ],
  sportPackages: [
    {
      id: '1',
      name: 'Ultimate Water Sports Day',
      duration: 'Full Day',
      price: '$120',
      highlights: ['4 different activities', 'Lunch included', 'Professional photos', 'Private instructor'],
      included: ['Surfing lesson', 'Snorkeling tour', 'Jet ski session', 'SUP boarding', 'All equipment'],
      iconName: 'Zap',
      savings: 'Save $35'
    },
    {
      id: '2',
      name: 'Family Fun Package',
      duration: 'Half Day',
      price: '$80 (family of 4)',
      highlights: ['Family-friendly activities', 'Professional supervision', 'Snacks included', 'Group photos'],
      included: ['Glass bottom boat', 'Banana boat rides', 'Basic snorkeling', 'Beach games', 'Refreshments'],
      iconName: 'Heart',
      savings: 'Save $20'
    },
    {
      id: '3',
      name: 'Adrenaline Seeker',
      duration: '3 Hours',
      price: '$95',
      highlights: ['High-energy activities', 'Extended sessions', 'GoPro footage', 'Energy drinks'],
      included: ['Extended jet skiing', 'Advanced surfing', 'Speed boat ride', 'Wakeboarding intro', 'Video package'],
      iconName: 'Activity',
      savings: 'Save $25'
    },
    {
      id: '4',
      name: 'Underwater Explorer',
      duration: 'Half Day',
      price: '$110',
      highlights: ['Marine focused', 'Small groups', 'Marine biologist guide', 'Underwater camera'],
      included: ['2 dive sites', 'Snorkeling tour', 'Marine life briefing', 'Photography', 'Certificate'],
      iconName: 'Fish',
      savings: 'Save $30'
    }
  ],
  safetyGuidelines: [
    {
      id: '1',
      title: 'Pre-Activity Safety',
      guidelines: ['Always wear provided safety equipment', 'Listen carefully to all instructions', 'Declare any medical conditions', 'Check weather conditions']
    },
    {
      id: '2',
      title: 'During Activities',
      guidelines: ['Stay within designated areas', 'Follow instructor signals', 'Never go alone', 'Stay hydrated']
    },
    {
      id: '3',
      title: 'Emergency Procedures',
      guidelines: ['Know emergency signals', 'Stay calm if in trouble', 'Wave for help', 'Follow rescue instructions']
    }
  ],
  faqs: [
    { id: '1', question: 'Do I need to know how to swim for water sports?', answer: "Swimming ability is required for most water sports, but the level varies. Surfing, jet skiing, and snorkeling require basic swimming skills. For non-swimmers, we offer glass-bottom boat tours and can provide extra flotation devices. All activities include life jackets for safety." },
    { id: '2', question: "What's the best time of year for water sports in Hikkaduwa?", answer: 'The best time is from November to April when the seas are calmer and visibility is excellent. December to March offers the most consistent conditions. The southwest monsoon (May to October) brings rougher seas, making some activities unavailable.' },
    { id: '3', question: 'What should I bring for water sports activities?', answer: "Bring swimwear, towel, sunscreen (reef-safe preferred), water bottle, and a change of clothes. We provide all necessary equipment. Bring an underwater camera if you have one, though some packages include photography. Leave valuables in your hotel safe." },
    { id: '4', question: 'Are water sports safe for children?', answer: 'Yes, many activities are suitable for children with proper supervision. Minimum age requirements vary: glass-bottom boats (all ages), snorkeling (8+), surfing (10+), and jet skiing (16+). We provide child-sized equipment and experienced instructors for young participants.' },
    { id: '5', question: 'Can I book multiple activities in one day?', answer: "Absolutely! Our combo packages offer multiple activities at discounted rates. We recommend spacing activities to avoid fatigue. A typical day might include morning surfing, midday break, then afternoon snorkeling. Our staff will help plan your schedule." },
    { id: '6', question: 'What if weather conditions are bad?', answer: "Safety is our priority. If conditions are unsafe, we'll reschedule or offer alternative activities. For pre-booked activities, we provide full refunds for weather cancellations. We monitor conditions closely and inform you of any changes in advance." }
  ],
  gallery: [
    { id: '1', url: 'https://images.unsplash.com/photo-1530870110042-98b2cb110834?w=400&h=300&fit=crop', alt: 'Surfing in Hikkaduwa' },
    { id: '2', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop', alt: 'Snorkeling adventure' },
    { id: '3', url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop', alt: 'Jet ski fun' },
    { id: '4', url: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=300&fit=crop', alt: 'Paddleboarding' },
    { id: '5', url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=300&fit=crop', alt: 'Beach waves' },
    { id: '6', url: 'https://images.unsplash.com/photo-1544551763-92b13f5a8f89?w=400&h=300&fit=crop', alt: 'Underwater diving' },
    { id: '7', url: 'https://images.unsplash.com/photo-1537519646099-335112f03225?w=400&h=300&fit=crop', alt: 'Beach sports' },
    { id: '8', url: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?w=400&h=300&fit=crop', alt: 'Water activities' }
  ],
  cta: {
    title: 'Ready to Make a Splash?',
    description: 'Join us for unforgettable water sports adventures in Hikkaduwa. Professional instruction, quality equipment, and endless fun await!',
    primaryButtonText: 'Book Activities Now',
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
    title: 'Hikkaduwa Water Sports | Surfing, Diving & Beach Activities | Recharge Travels',
    description: 'Experience thrilling water sports in Hikkaduwa - surfing lessons, scuba diving, snorkeling, jet skiing, and more. Book your beach adventure with Recharge Travels.',
    keywords: ['Hikkaduwa water sports', 'surfing Sri Lanka', 'scuba diving Hikkaduwa', 'snorkeling tours', 'jet ski rental', 'beach activities'],
    ogImage: 'https://images.unsplash.com/photo-1530870110042-98b2cb110834?w=1200&h=630&fit=crop'
  }
};

// Service class
class HikkaduwaWaterSportsPageService {
  async getPageContent(): Promise<HikkaduwaWaterSportsPageContent> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as HikkaduwaWaterSportsPageContent;
      } else {
        await this.updatePageContent(defaultContent);
        return defaultContent;
      }
    } catch (error) {
      console.error('Error fetching Hikkaduwa water sports page content:', error);
      return defaultContent;
    }
  }

  async updatePageContent(content: Partial<HikkaduwaWaterSportsPageContent>): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      await setDoc(docRef, {
        ...content,
        updatedAt: serverTimestamp()
      }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating Hikkaduwa water sports page content:', error);
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
      console.error('Error resetting Hikkaduwa water sports page content:', error);
      return false;
    }
  }

  getDefaultContent(): HikkaduwaWaterSportsPageContent {
    return defaultContent;
  }
}

export const hikkaduwaWaterSportsPageService = new HikkaduwaWaterSportsPageService();
export default hikkaduwaWaterSportsPageService;
