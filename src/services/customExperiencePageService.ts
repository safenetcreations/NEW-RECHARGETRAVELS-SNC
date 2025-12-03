import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  Timestamp,
  arrayUnion
} from 'firebase/firestore';

// ============================================
// HERO & CONTENT INTERFACES
// ============================================

export interface CustomHeroSlide {
  image: string;
  caption: string;
  tag?: string;
}

export interface CustomBadge {
  label: string;
  value: string;
  iconName: string;
}

export interface CustomHighlight {
  label: string;
  description: string;
}

export interface CustomExperienceType {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface CustomBenefit {
  id: string;
  title: string;
  description: string;
  image: string;
  icon?: string;
}

export interface CustomTestimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  avatar: string;
  tripType?: string;
}

export interface CustomBookingInfo {
  contactPhone: string;
  whatsapp: string;
  email: string;
  responseTime: string;
  conciergeNote: string;
}

export interface CustomExperiencePageContent {
  hero: {
    title: string;
    subtitle: string;
    badge: string;
    gallery: CustomHeroSlide[];
  };
  overview: {
    summary: string;
    badges: CustomBadge[];
    highlights: CustomHighlight[];
  };
  experienceTypes: CustomExperienceType[];
  benefits: CustomBenefit[];
  testimonials: CustomTestimonial[];
  formConfig: {
    enabledFields: string[];
    customQuestions: Array<{
      id: string;
      question: string;
      type: 'text' | 'textarea' | 'select' | 'multiselect';
      options?: string[];
      required: boolean;
    }>;
  };
  booking: CustomBookingInfo;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
}

// ============================================
// SUBMISSION INTERFACE
// ============================================

export interface CustomExperienceSubmission {
  id?: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  startDate: string;
  endDate: string;
  flexibleDates: boolean;
  groupSize: number;
  budget: {
    amount: number;
    currency: string;
    perPerson: boolean;
  };
  interests: string[];
  experienceTypes: string[];
  accommodationPreference: string;
  mealPreferences: string[];
  specialRequests: string;
  customAnswers?: Record<string, any>;
  previousVisits: boolean;
  mobilityRequirements: string;
  medicalConditions: string;
  travelStyle?: string;
  travelPace?: 'relaxed' | 'balanced' | 'fast';
  celebration?: string;
  preferredDestinations?: string[];
  communicationPreference?: 'email' | 'whatsapp' | 'phone';
  channel?: 'web' | 'whatsapp' | 'phone';
  assignedConcierge?: string;
  internalNotes?: string;
  status: 'new' | 'contacted' | 'quoted' | 'confirmed' | 'completed';
  statusHistory?: Array<{
    status: CustomExperienceSubmission['status'];
    note?: string;
    agent?: string;
    timestamp: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// DEFAULT CONTENT
// ============================================

const defaultContent: CustomExperiencePageContent = {
  hero: {
    title: 'Design Your Dream Sri Lanka',
    subtitle: 'Concierge-crafted itineraries blending wildlife, culture, tea trails, and oceanside bliss. Every trip hand-built around your style.',
    badge: 'Bespoke Travel Concierge',
    gallery: [
      {
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2000&q=80',
        caption: 'Your journey awaits',
        tag: 'Personalized'
      },
      {
        image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=80',
        caption: 'Pristine landscapes',
        tag: 'Adventure'
      },
      {
        image: 'https://images.unsplash.com/photo-1501117716987-c8e1ecb210cc?auto=format&fit=crop&w=2000&q=80',
        caption: 'Luxury retreats',
        tag: 'Relaxation'
      },
      {
        image: 'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=2000&q=80',
        caption: 'Cultural immersion',
        tag: 'Discovery'
      }
    ]
  },
  overview: {
    summary:
      "Share your travel dreams, and our Sri Lanka-based concierge team will design every day of your journey—handpicking guides, stays, transfers, and hidden experiences. We remain on WhatsApp throughout your trip for anything you need.",
    badges: [
      { label: 'Trips Designed', value: '500+', iconName: 'Compass' },
      { label: 'Guest Rating', value: '4.97/5', iconName: 'Star' },
      { label: 'Response Time', value: '<12h', iconName: 'Clock' },
      { label: 'Destinations', value: '50+', iconName: 'MapPin' }
    ],
    highlights: [
      {
        label: 'Dedicated travel designer',
        description: 'One expert planner handles your entire trip—from first message to farewell dinner.'
      },
      {
        label: 'Handpicked experiences',
        description: "Private safaris, chef's tables, helicopter transfers, and off-the-map spots only locals know."
      },
      {
        label: '24/7 WhatsApp support',
        description: 'Your concierge stays on call throughout your journey for real-time adjustments.'
      }
    ]
  },
  experienceTypes: [
    { id: '1', icon: '🦁', title: 'Wildlife Safaris', description: 'Private jeeps in Yala, Wilpattu & Minneriya' },
    { id: '2', icon: '🏛️', title: 'Culture & Heritage', description: 'UNESCO cities, local artisans & rituals' },
    { id: '3', icon: '🏖️', title: 'Beach Escapades', description: 'Whale watching, surfing & sunsets' },
    { id: '4', icon: '🍵', title: 'Tea Country', description: 'Tea tastings, scenic train rides & hikes' },
    { id: '5', icon: '🧘', title: 'Wellness', description: 'Ayurveda retreats & sunrise yoga' },
    { id: '6', icon: '🚁', title: 'Luxury Touches', description: 'Heli transfers, villa buyouts & butlers' },
    { id: '7', icon: '🍽️', title: 'Culinary', description: 'Cooking classes, market tours & private chefs' },
    { id: '8', icon: '🏔️', title: 'Adventure', description: 'Hiking, cycling, rafting & rock climbing' }
  ],
  benefits: [
    {
      id: '1',
      title: 'Dedicated concierge',
      description: 'Sri Lanka based experts craft every day and stay on WhatsApp 24/7.',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
      icon: '✨'
    },
    {
      id: '2',
      title: 'Handpicked stays',
      description: 'Tea bungalows, boutique villas and luxe beach properties matched to your vibe.',
      image: 'https://images.unsplash.com/photo-1501117716987-c8e1ecb210cc?auto=format&fit=crop&w=800&q=80',
      icon: '🏨'
    },
    {
      id: '3',
      title: 'Signature experiences',
      description: 'Sunrise hikes, leopard trackers, private chefs and helicopter transfers.',
      image: 'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=800&q=80',
      icon: '💎'
    }
  ],
  testimonials: [
    {
      id: '1',
      name: 'Nisha & Devin',
      location: 'Toronto, Canada',
      text: 'Recharge built a 12-day honeymoon across tea country and the south coast—concierge stayed on WhatsApp every day. Absolutely perfect.',
      rating: 5,
      avatar: 'https://i.pravatar.cc/120?img=45',
      tripType: 'Honeymoon'
    },
    {
      id: '2',
      name: 'Lena G.',
      location: 'Berlin, Germany',
      text: 'Every transfer, guide and restaurant felt curated. The surprise leopard safari upgrade was unforgettable.',
      rating: 5,
      avatar: 'https://i.pravatar.cc/120?img=15',
      tripType: 'Solo Adventure'
    },
    {
      id: '3',
      name: 'The Martinez Family',
      location: 'Miami, USA',
      text: 'Traveling with kids can be stressful, but Recharge handled everything. The driver knew exactly what our kids needed.',
      rating: 5,
      avatar: 'https://i.pravatar.cc/120?img=33',
      tripType: 'Family Trip'
    }
  ],
  formConfig: {
    enabledFields: ['all'],
    customQuestions: []
  },
  booking: {
    contactPhone: '+94 777 721 999',
    whatsapp: 'https://wa.me/94777721999',
    email: 'concierge@rechargetravels.com',
    responseTime: 'Replies within 12 hours (usually much faster)',
    conciergeNote: "Share your travel dates, group size, budget, and dream experiences. We'll design a trip you'll never forget."
  },
  seo: {
    title: 'Custom Sri Lanka Travel | Bespoke Itineraries | Recharge Travels',
    description:
      'Design your perfect Sri Lanka trip with our dedicated travel concierge. Personalized itineraries, handpicked stays, and 24/7 WhatsApp support.',
    keywords: [
      'custom Sri Lanka tour',
      'bespoke travel Sri Lanka',
      'personalized Sri Lanka itinerary',
      'luxury Sri Lanka trip planner',
      'Recharge Travels'
    ],
    ogImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&h=630&q=80'
  }
};

// ============================================
// SERVICE CLASS
// ============================================

class CustomExperiencePageService {
  private contentCollection = 'customExperiencePage';
  private submissionsCollection = 'customExperienceSubmissions';

  // Get page content
  async getPageContent(): Promise<CustomExperiencePageContent> {
    try {
      const docRef = doc(db, this.contentCollection, 'content');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as Partial<CustomExperiencePageContent>;

        return {
          ...defaultContent,
          ...data,
          hero: {
            ...defaultContent.hero,
            ...(data.hero || {}),
            gallery:
              data.hero?.gallery && data.hero.gallery.length > 0
                ? data.hero.gallery
                : defaultContent.hero.gallery
          },
          overview: {
            ...defaultContent.overview,
            ...(data.overview || {}),
            badges:
              data.overview?.badges && data.overview.badges.length > 0
                ? data.overview.badges
                : defaultContent.overview.badges,
            highlights:
              data.overview?.highlights && data.overview.highlights.length > 0
                ? data.overview.highlights
                : defaultContent.overview.highlights
          },
          experienceTypes:
            data.experienceTypes && data.experienceTypes.length > 0
              ? data.experienceTypes
              : defaultContent.experienceTypes,
          benefits:
            data.benefits && data.benefits.length > 0
              ? data.benefits
              : defaultContent.benefits,
          testimonials:
            data.testimonials && data.testimonials.length > 0
              ? data.testimonials
              : defaultContent.testimonials,
          formConfig: { ...defaultContent.formConfig, ...(data.formConfig || {}) },
          booking: { ...defaultContent.booking, ...(data.booking || {}) },
          seo: { ...defaultContent.seo, ...(data.seo || {}) }
        };
      }

      // Initialize with default content
      await setDoc(docRef, defaultContent);
      return defaultContent;
    } catch (error) {
      console.error('Error fetching custom experience page content:', error);
      return defaultContent;
    }
  }

  // Save page content
  async saveContent(content: Partial<CustomExperiencePageContent>): Promise<boolean> {
    try {
      const docRef = doc(db, this.contentCollection, 'content');
      await setDoc(docRef, content, { merge: true });
      return true;
    } catch (error) {
      console.error('Error saving custom experience page content:', error);
      return false;
    }
  }

  // Submit custom experience request
  async submitRequest(
    data: Omit<CustomExperienceSubmission, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'statusHistory'>
  ): Promise<string> {
    try {
      const timestamp = Timestamp.now();
      const submissionData = {
        ...data,
        status: 'new',
        createdAt: timestamp,
        updatedAt: timestamp,
        statusHistory: [
          {
            status: 'new',
            note: data.channel === 'web' ? 'Submitted via custom experience form' : 'Submission created',
            timestamp
          }
        ]
      };

      const docRef = await addDoc(collection(db, this.submissionsCollection), submissionData);
      return docRef.id;
    } catch (error) {
      console.error('Error submitting custom experience request:', error);
      throw error;
    }
  }

  // Get all submissions (for admin)
  async getAllSubmissions(): Promise<CustomExperienceSubmission[]> {
    try {
      const q = query(
        collection(db, this.submissionsCollection),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          statusHistory: data.statusHistory?.map((entry: any) => ({
            ...entry,
            timestamp: entry?.timestamp?.toDate ? entry.timestamp.toDate() : entry?.timestamp
          })),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        };
      }) as CustomExperienceSubmission[];
    } catch (error) {
      console.error('Error fetching submissions:', error);
      throw error;
    }
  }

  // Update submission status
  async updateSubmissionStatus(
    id: string,
    status: CustomExperienceSubmission['status'],
    options?: { note?: string; agent?: string }
  ): Promise<void> {
    try {
      const docRef = doc(db, this.submissionsCollection, id);
      await updateDoc(docRef, {
        status,
        updatedAt: Timestamp.now(),
        statusHistory: arrayUnion({
          status,
          note: options?.note,
          agent: options?.agent,
          timestamp: Timestamp.now()
        })
      });
    } catch (error) {
      console.error('Error updating submission status:', error);
      throw error;
    }
  }

  // Delete submission
  async deleteSubmission(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.submissionsCollection, id));
    } catch (error) {
      console.error('Error deleting submission:', error);
      throw error;
    }
  }

  async updateSubmissionDetails(id: string, updates: Partial<CustomExperienceSubmission>): Promise<void> {
    try {
      const docRef = doc(db, this.submissionsCollection, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating submission details:', error);
      throw error;
    }
  }

  // Get default content
  getDefaultContent(): CustomExperiencePageContent {
    return defaultContent;
  }
}

export const customExperiencePageService = new CustomExperiencePageService();
export default customExperiencePageService;
