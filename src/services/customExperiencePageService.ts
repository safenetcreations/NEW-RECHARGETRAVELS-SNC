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
  Timestamp
} from 'firebase/firestore';

export interface CustomExperiencePageContent {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    ctaText: string;
  };
  features: Array<{
    id: string;
    icon: string;
    title: string;
    description: string;
  }>;
  benefits: Array<{
    id: string;
    title: string;
    description: string;
    image: string;
  }>;
  testimonials: Array<{
    id: string;
    name: string;
    location: string;
    text: string;
    rating: number;
    avatar: string;
  }>;
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
  contact: {
    phone: string;
    email: string;
    whatsapp: string;
    availability: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

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
  status: 'new' | 'contacted' | 'quoted' | 'confirmed' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

class CustomExperiencePageService {
  private contentCollection = 'customExperiencePage';
  private submissionsCollection = 'customExperienceSubmissions';

  // Get page content
  async getPageContent(): Promise<CustomExperiencePageContent> {
    try {
      const docRef = doc(db, this.contentCollection, 'content');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as CustomExperiencePageContent;
      }

      // Return default content if not found
      return this.getDefaultContent();
    } catch (error) {
      console.error('Error fetching custom experience page content:', error);
      return this.getDefaultContent();
    }
  }

  // Update page content
  async updatePageContent(content: Partial<CustomExperiencePageContent>): Promise<void> {
    try {
      const docRef = doc(db, this.contentCollection, 'content');
      await setDoc(docRef, content, { merge: true });
    } catch (error) {
      console.error('Error updating custom experience page content:', error);
      throw error;
    }
  }

  // Submit custom experience request
  async submitRequest(data: Omit<CustomExperienceSubmission, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const submissionData = {
        ...data,
        status: 'new',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
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
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as CustomExperienceSubmission[];
    } catch (error) {
      console.error('Error fetching submissions:', error);
      throw error;
    }
  }

  // Update submission status
  async updateSubmissionStatus(id: string, status: CustomExperienceSubmission['status']): Promise<void> {
    try {
      const docRef = doc(db, this.submissionsCollection, id);
      await updateDoc(docRef, {
        status,
        updatedAt: Timestamp.now()
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

  // Get default content
  private getDefaultContent(): CustomExperiencePageContent {
    return {
      hero: {
        title: 'Design Your Dream Sri Lankan Adventure',
        subtitle: 'Let our expert travel designers create a bespoke journey tailored exclusively to your desires, interests, and dreams.',
        backgroundImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920',
        ctaText: 'Start Planning'
      },
      features: [
        {
          id: '1',
          icon: '✨',
          title: '100% Personalized',
          description: 'Every detail crafted around your preferences and interests'
        },
        {
          id: '2',
          icon: '🎯',
          title: 'Expert Guidance',
          description: 'Work directly with our experienced travel designers'
        },
        {
          id: '3',
          icon: '💎',
          title: 'Luxury Experiences',
          description: 'Access to exclusive locations and premium services'
        },
        {
          id: '4',
          icon: '🌟',
          title: 'Flexible Planning',
          description: 'Adjust your itinerary anytime before your trip'
        }
      ],
      benefits: [
        {
          id: '1',
          title: 'Private Wildlife Safaris',
          description: 'Exclusive access to national parks with expert naturalists',
          image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800'
        },
        {
          id: '2',
          title: 'Cultural Immersions',
          description: 'Authentic experiences with local communities and traditions',
          image: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=800'
        },
        {
          id: '3',
          title: 'Luxury Accommodations',
          description: 'Handpicked boutique hotels and private villas',
          image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'
        }
      ],
      testimonials: [
        {
          id: '1',
          name: 'Sarah & Michael',
          location: 'New York, USA',
          text: 'Recharge Travels created the perfect honeymoon for us. Every detail was thoughtfully planned and exceeded our expectations.',
          rating: 5,
          avatar: 'https://i.pravatar.cc/150?img=1'
        },
        {
          id: '2',
          name: 'The Johnson Family',
          location: 'London, UK',
          text: 'Our custom family tour was absolutely magical. The kids loved every moment, and we discovered places we never knew existed.',
          rating: 5,
          avatar: 'https://i.pravatar.cc/150?img=2'
        }
      ],
      formConfig: {
        enabledFields: ['all'],
        customQuestions: []
      },
      contact: {
        phone: '+94 7777 21 999',
        email: 'custom@rechargetravels.com',
        whatsapp: '+94777721999',
        availability: 'Available 24/7'
      },
      seo: {
        title: 'Custom Sri Lanka Travel Experiences | Recharge Travels',
        description: 'Design your perfect Sri Lankan adventure with our bespoke travel planning service. Expert guidance, luxury experiences, and complete customization.',
        keywords: ['custom sri lanka tours', 'bespoke travel sri lanka', 'personalized sri lanka vacation', 'luxury sri lanka travel']
      }
    };
  }
}

export const customExperiencePageService = new CustomExperiencePageService();
