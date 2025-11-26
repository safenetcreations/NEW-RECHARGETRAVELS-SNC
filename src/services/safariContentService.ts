import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  getDocs,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface SafariPackage {
  id: string;
  title: string;
  description: string;
  details: string;
  features: string[];
  price: number;
  duration: string;
  image: string;
  category: 'wildlife' | 'lodge' | 'experience';
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SafariContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  aboutText: string;
  whyChooseUs: string[];
  testimonials: Array<{
    id: string;
    name: string;
    text: string;
    rating: number;
  }>;
}

class SafariContentService {
  private readonly PACKAGES_COLLECTION = 'safari_packages';
  private readonly CONTENT_COLLECTION = 'safari_content';
  private readonly CONTENT_DOC_ID = 'main_content';

  // Get all safari packages
  async getPackages(): Promise<SafariPackage[]> {
    try {
      const packagesQuery = query(
        collection(db, this.PACKAGES_COLLECTION),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(packagesQuery);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as SafariPackage));
    } catch (error) {
      console.error('Error fetching safari packages:', error);
      return [];
    }
  }

  // Get active safari packages only
  async getActivePackages(): Promise<SafariPackage[]> {
    const allPackages = await this.getPackages();
    return allPackages.filter(pkg => pkg.isActive);
  }

  // Get safari package by ID
  async getPackageById(id: string): Promise<SafariPackage | null> {
    try {
      const docRef = doc(db, this.PACKAGES_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as SafariPackage;
      }
      return null;
    } catch (error) {
      console.error('Error fetching safari package:', error);
      return null;
    }
  }

  // Create or update safari package
  async savePackage(packageData: Partial<SafariPackage>): Promise<string> {
    try {
      const now = Timestamp.now();
      
      if (packageData.id) {
        // Update existing package
        const docRef = doc(db, this.PACKAGES_COLLECTION, packageData.id);
        await updateDoc(docRef, {
          ...packageData,
          updatedAt: now
        });
        return packageData.id;
      } else {
        // Create new package
        const newId = doc(collection(db, this.PACKAGES_COLLECTION)).id;
        const docRef = doc(db, this.PACKAGES_COLLECTION, newId);
        await setDoc(docRef, {
          ...packageData,
          id: newId,
          createdAt: now,
          updatedAt: now,
          isActive: packageData.isActive ?? true
        });
        return newId;
      }
    } catch (error) {
      console.error('Error saving safari package:', error);
      throw error;
    }
  }

  // Delete safari package
  async deletePackage(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.PACKAGES_COLLECTION, id);
      await updateDoc(docRef, {
        isActive: false,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error deleting safari package:', error);
      throw error;
    }
  }

  // Get main safari page content
  async getMainContent(): Promise<SafariContent> {
    try {
      const docRef = doc(db, this.CONTENT_COLLECTION, this.CONTENT_DOC_ID);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as SafariContent;
      }
      
      // Return default content if none exists
      return this.getDefaultContent();
    } catch (error) {
      console.error('Error fetching safari content:', error);
      return this.getDefaultContent();
    }
  }

  // Update main safari page content
  async updateMainContent(content: Partial<SafariContent>): Promise<void> {
    try {
      const docRef = doc(db, this.CONTENT_COLLECTION, this.CONTENT_DOC_ID);
      await setDoc(docRef, {
        ...content,
        updatedAt: Timestamp.now()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating safari content:', error);
      throw error;
    }
  }


  // Get default content
  private getDefaultContent(): SafariContent {
    return {
      heroTitle: "Luxury Safari Expeditions",
      heroSubtitle: "Experience Sri Lanka's Wildlife in Unparalleled Comfort",
      heroImage: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920",
      aboutText: "Embark on extraordinary wildlife adventures in Sri Lanka's premier national parks. Our luxury safari experiences combine world-class accommodations with exclusive wildlife encounters, creating memories that last a lifetime.",
      whyChooseUs: [
        "Expert naturalist guides with decades of experience",
        "Exclusive access to prime wildlife viewing areas",
        "Luxury lodges with panoramic views",
        "Customized itineraries for your preferences",
        "Small group sizes for intimate experiences",
        "Conservation-focused sustainable tourism"
      ],
      testimonials: [
        {
          id: "1",
          name: "Sarah Johnson",
          text: "The leopard sighting at Yala was absolutely magical! Our guide's expertise made all the difference.",
          rating: 5
        },
        {
          id: "2",
          name: "Michael Chen",
          text: "Staying at the luxury tented camp was an experience beyond words. Five-star service in the wilderness!",
          rating: 5
        }
      ]
    };
  }
}

export const safariContentService = new SafariContentService();