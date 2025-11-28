import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION_NAME = 'pageContent';
const DOC_ID = 'hot-air-balloon-sigiriya';

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

export interface FlightPackage {
  id: string;
  name: string;
  duration: string;
  price: string;
  highlights: string[];
  included: string[];
  iconName: string;
  bestFor: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  description: string;
  advantages: string[];
  price: string;
}

export interface FlightPathStage {
  id: string;
  stage: string;
  description: string;
  duration: string;
}

export interface SafetyFeature {
  id: string;
  iconName: string;
  title: string;
  description: string;
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

export interface HotAirBalloonSigiriyaPageContent {
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
  flightPackages: FlightPackage[];
  timeSlots: TimeSlot[];
  flightPath: FlightPathStage[];
  safetyFeatures: SafetyFeature[];
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
const defaultContent: HotAirBalloonSigiriyaPageContent = {
  hero: {
    title: 'Hot Air Ballooning',
    subtitle: "Soar Above Sigiriya's Ancient Wonders at Sunrise",
    ctaText: 'Book Your Flight',
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop', caption: 'Hot Air Balloon over Sigiriya' },
      { id: '2', url: 'https://images.unsplash.com/photo-1569163139394-de4b5c4c4e3f?w=1920&h=1080&fit=crop', caption: 'Sunrise Balloon Flight' },
      { id: '3', url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&h=1080&fit=crop', caption: 'Aerial View of Ancient City' },
      { id: '4', url: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=1920&h=1080&fit=crop', caption: 'Floating Above the Clouds' }
    ]
  },
  overview: {
    title: "A Magical Journey Above Ancient Kingdoms",
    description: "Experience the breathtaking beauty of Sri Lanka's Cultural Triangle from a unique perspective. Float peacefully above the iconic Sigiriya Rock Fortress, ancient cities, and lush landscapes as the sun rises over the horizon. This once-in-a-lifetime adventure offers unparalleled views and unforgettable memories."
  },
  stats: [
    { id: '1', iconName: 'Navigation', label: 'Flight Altitude', value: '2,000ft' },
    { id: '2', iconName: 'Clock', label: 'Flight Duration', value: '60-90min' },
    { id: '3', iconName: 'Award', label: 'Safety Record', value: '100%' },
    { id: '4', iconName: 'Users', label: 'Happy Flyers', value: '15,000+' }
  ],
  flightPackages: [
    {
      id: '1',
      name: 'Classic Sunrise Flight',
      duration: '1 hour flight',
      price: '$210 per person',
      highlights: ['Sunrise views over Sigiriya', '360-degree panoramic views', 'Traditional champagne toast', 'Flight certificate'],
      included: ['Hotel pickup (5:00 AM)', 'Light refreshments', '1-hour balloon flight', 'Champagne celebration', 'Return transfer'],
      iconName: 'Sunrise',
      bestFor: 'First-time flyers'
    },
    {
      id: '2',
      name: 'Premium Photo Flight',
      duration: '1.5 hours flight',
      price: '$280 per person',
      highlights: ['Extended flight time', 'Professional photographer', 'Multiple altitude levels', 'Private basket section'],
      included: ['VIP hotel pickup', 'Breakfast box', '90-minute flight', 'Photo package (50+ images)', 'Luxury return transfer'],
      iconName: 'Camera',
      bestFor: 'Photography enthusiasts'
    },
    {
      id: '3',
      name: 'Romantic Couple Flight',
      duration: '1 hour flight',
      price: '$450 per couple',
      highlights: ['Private basket compartment', 'Romantic sunrise setting', 'Special champagne service', 'Commemorative gifts'],
      included: ['Private transfers', 'Exclusive basket area', 'Premium champagne', 'Professional photos', 'Romantic breakfast'],
      iconName: 'Heart',
      bestFor: 'Couples & anniversaries'
    },
    {
      id: '4',
      name: 'Family Adventure Flight',
      duration: '1 hour flight',
      price: '$180 per person (kids 50% off)',
      highlights: ['Family-friendly experience', 'Educational commentary', "Kids' activity pack", 'Group photos included'],
      included: ['Family vehicle pickup', 'Kid-friendly snacks', 'Safety briefing for children', 'Flight certificates for all', 'Comfortable transfers'],
      iconName: 'Users',
      bestFor: 'Families with children 7+'
    }
  ],
  timeSlots: [
    {
      id: '1',
      time: '5:30 AM - 7:00 AM',
      description: 'Early Morning Sunrise Flight',
      advantages: ['Spectacular sunrise views', 'Coolest temperatures', 'Calmest wind conditions', 'Best photography light'],
      price: 'Standard rates'
    },
    {
      id: '2',
      time: '6:00 AM - 7:30 AM',
      description: 'Prime Morning Flight',
      advantages: ['Golden hour lighting', 'Clear visibility', 'Optimal weather conditions', 'Wildlife activity below'],
      price: 'Standard rates'
    }
  ],
  flightPath: [
    { id: '1', stage: 'Launch Site', description: 'Begin at Kandalama or Dambulla launch field', duration: '20 minutes prep' },
    { id: '2', stage: 'Initial Ascent', description: 'Gentle rise to 500 feet for panoramic views', duration: '10 minutes' },
    { id: '3', stage: 'Sigiriya Approach', description: 'Float towards the iconic Lion Rock fortress', duration: '20 minutes' },
    { id: '4', stage: 'Maximum Altitude', description: 'Reach up to 2,000 feet for stunning vistas', duration: '15 minutes' },
    { id: '5', stage: 'Cultural Triangle Tour', description: 'Views of ancient cities and temples', duration: '15 minutes' },
    { id: '6', stage: 'Descent & Landing', description: 'Gentle descent to designated landing area', duration: '10 minutes' }
  ],
  safetyFeatures: [
    { id: '1', iconName: 'Shield', title: 'Certified Pilots', description: 'All pilots hold international commercial licenses with thousands of flight hours experience.' },
    { id: '2', iconName: 'Award', title: 'Premium Equipment', description: 'Modern balloons maintained to highest international aviation standards with regular inspections.' },
    { id: '3', iconName: 'Users', title: 'Insurance Coverage', description: 'Comprehensive insurance coverage for all passengers included in your flight package.' }
  ],
  faqs: [
    { id: '1', question: 'Is hot air ballooning safe?', answer: 'Yes, hot air ballooning is one of the safest forms of aviation. Our pilots are internationally certified with thousands of flight hours. All equipment is regularly inspected and maintained to international standards. We monitor weather conditions closely and only fly in safe conditions.' },
    { id: '2', question: 'What should I wear for the balloon flight?', answer: 'Dress in comfortable layers as mornings can be cool but warm up quickly. Wear flat, closed-toe shoes (no heels or sandals). Avoid loose scarves or hats that might blow away. Bring a light jacket and sunglasses. The temperature in the balloon is similar to ground level.' },
    { id: '3', question: 'Are there age or health restrictions?', answer: 'Children must be at least 7 years old and tall enough to see over the basket edge (about 4 feet). Pregnant women cannot fly for safety reasons. Passengers should be able to stand for the duration of the flight. Those with heart conditions or mobility issues should consult their doctor.' },
    { id: '4', question: 'What happens if the weather is bad?', answer: "Safety is our priority. If weather conditions are unsuitable, we'll reschedule your flight for the next available date. If rescheduling isn't possible, we provide a full refund. We make weather decisions by 10 PM the night before and will contact you immediately." },
    { id: '5', question: 'How high do the balloons fly?', answer: 'Typically between 500 to 2,000 feet, depending on wind conditions and air traffic regulations. This altitude provides the best views while maintaining safety. The pilot varies the altitude throughout the flight for different perspectives of the landscape.' },
    { id: '6', question: 'Can I bring a camera?', answer: 'Absolutely! We encourage photography. Ensure your camera has a strap. Drones are not permitted due to aviation regulations. Many passengers find phones adequate for photos, but professional cameras are welcome. Some packages include a professional photographer.' }
  ],
  gallery: [
    { id: '1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', alt: 'Hot air balloon at sunrise' },
    { id: '2', url: 'https://images.unsplash.com/photo-1569163139394-de4b5c4c4e3f?w=400&h=300&fit=crop', alt: 'Balloon flight over landscape' },
    { id: '3', url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop', alt: 'Aerial view from balloon' },
    { id: '4', url: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=300&fit=crop', alt: 'Multiple balloons in sky' },
    { id: '5', url: 'https://images.unsplash.com/photo-1514762263431-d3255330e167?w=400&h=300&fit=crop', alt: 'Colorful balloon basket' },
    { id: '6', url: 'https://images.unsplash.com/photo-1495546992359-fa0d45e1f588?w=400&h=300&fit=crop', alt: 'Balloon over mountains' },
    { id: '7', url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=400&h=300&fit=crop', alt: 'Forest view from balloon' },
    { id: '8', url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop', alt: 'Adventure balloon flight' }
  ],
  cta: {
    title: 'Ready to Touch the Sky?',
    description: 'Book your hot air balloon adventure over Sigiriya today. Create memories that will last a lifetime as you float above ancient wonders.',
    primaryButtonText: 'Book Your Flight',
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
    title: 'Hot Air Ballooning Sigiriya | Sunrise Flights Over Lion Rock | Recharge Travels',
    description: "Experience breathtaking hot air balloon rides over Sigiriya Rock Fortress. Sunrise flights with panoramic views of Sri Lanka's Cultural Triangle.",
    keywords: ['hot air balloon Sigiriya', 'balloon rides Sri Lanka', 'Sigiriya sunrise flight', 'aerial tours', 'Lion Rock balloon', 'adventure activities Sri Lanka'],
    ogImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=630&fit=crop'
  }
};

// Service class
class HotAirBalloonSigiriyaPageService {
  async getPageContent(): Promise<HotAirBalloonSigiriyaPageContent> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as HotAirBalloonSigiriyaPageContent;
      } else {
        // Initialize with default content if doesn't exist
        await this.updatePageContent(defaultContent);
        return defaultContent;
      }
    } catch (error) {
      console.error('Error fetching hot air balloon page content:', error);
      return defaultContent;
    }
  }

  async updatePageContent(content: Partial<HotAirBalloonSigiriyaPageContent>): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      await setDoc(docRef, {
        ...content,
        updatedAt: serverTimestamp()
      }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating hot air balloon page content:', error);
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
      console.error('Error resetting hot air balloon page content:', error);
      return false;
    }
  }

  getDefaultContent(): HotAirBalloonSigiriyaPageContent {
    return defaultContent;
  }
}

export const hotAirBalloonSigiriyaPageService = new HotAirBalloonSigiriyaPageService();
export default hotAirBalloonSigiriyaPageService;
