import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  addDoc,
  deleteDoc 
} from 'firebase/firestore';

// Types for Helicopter Charters
export interface HelicopterData {
  id: string;
  name: string;
  image: string;
  passengers: number;
  range: string;
  speed: string;
  maxAltitude?: string;
  engines?: string;
  cabinVolume?: string;
  baggageCapacity?: string;
  features: string[];
  pricePerHour: string;
  description: string;
  certifications?: string[];
  yearIntroduced?: number;
  isActive: boolean;
  sortOrder: number;
}

export interface HelicopterRoute {
  id: string;
  name: string;
  duration: string;
  description: string;
  price: string;
  isActive: boolean;
  sortOrder: number;
}

export interface HelicopterPageContent {
  heroImages: Array<{ url: string; title: string; subtitle: string }>;
  heroTitle: string;
  heroSubtitle: string;
  fleet: HelicopterData[];
  routes: HelicopterRoute[];
  contactPhone: string;
  contactWhatsApp: string;
  contactEmail: string;
  seoTitle: string;
  seoDescription: string;
}

// Types for Private Yachts
export interface YachtData {
  id: string;
  name: string;
  type: string;
  image: string;
  length: string;
  guests: number;
  cabins: number;
  crew: number;
  speed: string;
  cruisingSpeed: string;
  builder: string;
  yearBuilt: number;
  refit?: number | null;
  features: string[];
  amenities: string[];
  pricePerDay: string;
  pricePerWeek: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
}

export interface YachtDestination {
  id: string;
  name: string;
  duration: string;
  description: string;
  highlights: string[];
  bestSeason: string;
  isActive: boolean;
  sortOrder: number;
}

export interface YachtPageContent {
  heroImages: Array<{ url: string; title: string; subtitle: string }>;
  heroTitle: string;
  heroSubtitle: string;
  fleet: YachtData[];
  destinations: YachtDestination[];
  contactPhone: string;
  contactWhatsApp: string;
  contactEmail: string;
  seoTitle: string;
  seoDescription: string;
}

// Types for Private Jets
export interface JetData {
  id: string;
  name: string;
  type: string;
  image: string;
  passengers: number;
  range: string;
  speed: string;
  maxAltitude: string;
  cabinLength: string;
  cabinWidth: string;
  cabinHeight: string;
  baggageCapacity: string;
  features: string[];
  amenities: string[];
  pricePerHour: string;
  description: string;
  manufacturer: string;
  yearIntroduced: number;
  isActive: boolean;
  sortOrder: number;
}

export interface JetRoute {
  id: string;
  name: string;
  duration: string;
  distance: string;
  description: string;
  price: string;
  isActive: boolean;
  sortOrder: number;
}

// Types for Exclusive Villas
export interface VillaData {
  id: string;
  name: string;
  location: string;
  region: string;
  image: string;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  poolSize: string;
  landArea: string;
  style: string;
  features: string[];
  amenities: string[];
  activities: string[];
  pricePerNight: number;
  pricePerWeek?: number;
  description: string;
  highlights: string[];
  rating: number;
  reviews: number;
  isActive: boolean;
  sortOrder: number;
}

// Types for Luxury Vehicles
export interface VehicleData {
  id: string;
  name: string;
  category: string;
  image: string;
  passengers: number;
  luggage: number;
  transmission: string;
  engine: string;
  power: string;
  features: string[];
  amenities: string[];
  pricePerHour: number;
  pricePerDay: number;
  description: string;
  highlights: string[];
  rating: number;
  reviews: number;
  isActive: boolean;
  sortOrder: number;
}

// Generic contact info
export interface LuxuryContactInfo {
  phone: string;
  whatsApp: string;
  email: string;
  address?: string;
}

class LuxuryPagesService {
  private readonly COLLECTION = 'luxuryPages';
  private readonly HELICOPTERS_COLLECTION = 'helicopterFleet';
  private readonly HELICOPTER_ROUTES_COLLECTION = 'helicopterRoutes';
  private readonly YACHTS_COLLECTION = 'yachtFleet';
  private readonly YACHT_DESTINATIONS_COLLECTION = 'yachtDestinations';
  private readonly JETS_COLLECTION = 'jetFleet';
  private readonly JET_ROUTES_COLLECTION = 'jetRoutes';
  private readonly VILLAS_COLLECTION = 'villaCollection';
  private readonly VEHICLES_COLLECTION = 'vehicleFleet';
  private readonly INQUIRIES_COLLECTION = 'luxuryInquiries';

  // Default contact info
  private defaultContact: LuxuryContactInfo = {
    phone: '+94 777 721 999',
    whatsApp: '94777721999',
    email: 'luxury@rechargetravels.com'
  };

  // ============ HELICOPTER CHARTERS ============

  async getHelicopterPageContent(): Promise<HelicopterPageContent | null> {
    try {
      const docRef = doc(db, this.COLLECTION, 'helicopter-charters');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as HelicopterPageContent;
      }
      return null;
    } catch (error) {
      console.error('Error fetching helicopter page content:', error);
      return null;
    }
  }

  async updateHelicopterPageContent(content: Partial<HelicopterPageContent>): Promise<boolean> {
    try {
      const docRef = doc(db, this.COLLECTION, 'helicopter-charters');
      await setDoc(docRef, { ...content, updatedAt: new Date() }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating helicopter page content:', error);
      return false;
    }
  }

  async getHelicopterFleet(): Promise<HelicopterData[]> {
    try {
      const q = query(
        collection(db, this.HELICOPTERS_COLLECTION),
        where('isActive', '==', true),
        orderBy('sortOrder', 'asc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HelicopterData));
    } catch (error) {
      console.error('Error fetching helicopter fleet:', error);
      return [];
    }
  }

  async addHelicopter(helicopter: Omit<HelicopterData, 'id'>): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, this.HELICOPTERS_COLLECTION), {
        ...helicopter,
        createdAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding helicopter:', error);
      return null;
    }
  }

  async updateHelicopter(id: string, data: Partial<HelicopterData>): Promise<boolean> {
    try {
      const docRef = doc(db, this.HELICOPTERS_COLLECTION, id);
      await updateDoc(docRef, { ...data, updatedAt: new Date() });
      return true;
    } catch (error) {
      console.error('Error updating helicopter:', error);
      return false;
    }
  }

  async deleteHelicopter(id: string): Promise<boolean> {
    try {
      const docRef = doc(db, this.HELICOPTERS_COLLECTION, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting helicopter:', error);
      return false;
    }
  }

  async getHelicopterRoutes(): Promise<HelicopterRoute[]> {
    try {
      const q = query(
        collection(db, this.HELICOPTER_ROUTES_COLLECTION),
        where('isActive', '==', true),
        orderBy('sortOrder', 'asc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HelicopterRoute));
    } catch (error) {
      console.error('Error fetching helicopter routes:', error);
      return [];
    }
  }

  // ============ PRIVATE YACHTS ============

  async getYachtPageContent(): Promise<YachtPageContent | null> {
    try {
      const docRef = doc(db, this.COLLECTION, 'private-yachts');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as YachtPageContent;
      }
      return null;
    } catch (error) {
      console.error('Error fetching yacht page content:', error);
      return null;
    }
  }

  async updateYachtPageContent(content: Partial<YachtPageContent>): Promise<boolean> {
    try {
      const docRef = doc(db, this.COLLECTION, 'private-yachts');
      await setDoc(docRef, { ...content, updatedAt: new Date() }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating yacht page content:', error);
      return false;
    }
  }

  async getYachtFleet(): Promise<YachtData[]> {
    try {
      const q = query(
        collection(db, this.YACHTS_COLLECTION),
        where('isActive', '==', true),
        orderBy('sortOrder', 'asc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as YachtData));
    } catch (error) {
      console.error('Error fetching yacht fleet:', error);
      return [];
    }
  }

  async addYacht(yacht: Omit<YachtData, 'id'>): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, this.YACHTS_COLLECTION), {
        ...yacht,
        createdAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding yacht:', error);
      return null;
    }
  }

  async updateYacht(id: string, data: Partial<YachtData>): Promise<boolean> {
    try {
      const docRef = doc(db, this.YACHTS_COLLECTION, id);
      await updateDoc(docRef, { ...data, updatedAt: new Date() });
      return true;
    } catch (error) {
      console.error('Error updating yacht:', error);
      return false;
    }
  }

  async deleteYacht(id: string): Promise<boolean> {
    try {
      const docRef = doc(db, this.YACHTS_COLLECTION, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting yacht:', error);
      return false;
    }
  }

  async getYachtDestinations(): Promise<YachtDestination[]> {
    try {
      const q = query(
        collection(db, this.YACHT_DESTINATIONS_COLLECTION),
        where('isActive', '==', true),
        orderBy('sortOrder', 'asc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as YachtDestination));
    } catch (error) {
      console.error('Error fetching yacht destinations:', error);
      return [];
    }
  }

  // ============ PRIVATE JETS ============

  async getJetPageContent(): Promise<any> {
    try {
      const docRef = doc(db, this.COLLECTION, 'private-jets');
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error('Error fetching jet page content:', error);
      return null;
    }
  }

  async updateJetPageContent(content: any): Promise<boolean> {
    try {
      const docRef = doc(db, this.COLLECTION, 'private-jets');
      await setDoc(docRef, { ...content, updatedAt: new Date() }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating jet page content:', error);
      return false;
    }
  }

  async getJetFleet(): Promise<JetData[]> {
    try {
      const q = query(collection(db, this.JETS_COLLECTION), where('isActive', '==', true), orderBy('sortOrder', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JetData));
    } catch (error) {
      console.error('Error fetching jet fleet:', error);
      return [];
    }
  }

  async addJet(jet: Omit<JetData, 'id'>): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, this.JETS_COLLECTION), { ...jet, createdAt: new Date() });
      return docRef.id;
    } catch (error) {
      console.error('Error adding jet:', error);
      return null;
    }
  }

  async updateJet(id: string, data: Partial<JetData>): Promise<boolean> {
    try {
      const docRef = doc(db, this.JETS_COLLECTION, id);
      await updateDoc(docRef, { ...data, updatedAt: new Date() });
      return true;
    } catch (error) {
      console.error('Error updating jet:', error);
      return false;
    }
  }

  async deleteJet(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, this.JETS_COLLECTION, id));
      return true;
    } catch (error) {
      console.error('Error deleting jet:', error);
      return false;
    }
  }

  async getJetRoutes(): Promise<JetRoute[]> {
    try {
      const q = query(collection(db, this.JET_ROUTES_COLLECTION), where('isActive', '==', true), orderBy('sortOrder', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JetRoute));
    } catch (error) {
      console.error('Error fetching jet routes:', error);
      return [];
    }
  }

  // ============ EXCLUSIVE VILLAS ============

  async getVillaPageContent(): Promise<any> {
    try {
      const docRef = doc(db, this.COLLECTION, 'exclusive-villas');
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error('Error fetching villa page content:', error);
      return null;
    }
  }

  async updateVillaPageContent(content: any): Promise<boolean> {
    try {
      const docRef = doc(db, this.COLLECTION, 'exclusive-villas');
      await setDoc(docRef, { ...content, updatedAt: new Date() }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating villa page content:', error);
      return false;
    }
  }

  async getVillaCollection(): Promise<VillaData[]> {
    try {
      const q = query(collection(db, this.VILLAS_COLLECTION), where('isActive', '==', true), orderBy('sortOrder', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VillaData));
    } catch (error) {
      console.error('Error fetching villa collection:', error);
      return [];
    }
  }

  async addVilla(villa: Omit<VillaData, 'id'>): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, this.VILLAS_COLLECTION), { ...villa, createdAt: new Date() });
      return docRef.id;
    } catch (error) {
      console.error('Error adding villa:', error);
      return null;
    }
  }

  async updateVilla(id: string, data: Partial<VillaData>): Promise<boolean> {
    try {
      const docRef = doc(db, this.VILLAS_COLLECTION, id);
      await updateDoc(docRef, { ...data, updatedAt: new Date() });
      return true;
    } catch (error) {
      console.error('Error updating villa:', error);
      return false;
    }
  }

  async deleteVilla(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, this.VILLAS_COLLECTION, id));
      return true;
    } catch (error) {
      console.error('Error deleting villa:', error);
      return false;
    }
  }

  // ============ LUXURY VEHICLES ============

  async getVehiclePageContent(): Promise<any> {
    try {
      const docRef = doc(db, this.COLLECTION, 'luxury-vehicles');
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error('Error fetching vehicle page content:', error);
      return null;
    }
  }

  async updateVehiclePageContent(content: any): Promise<boolean> {
    try {
      const docRef = doc(db, this.COLLECTION, 'luxury-vehicles');
      await setDoc(docRef, { ...content, updatedAt: new Date() }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating vehicle page content:', error);
      return false;
    }
  }

  async getVehicleFleet(): Promise<VehicleData[]> {
    try {
      const q = query(collection(db, this.VEHICLES_COLLECTION), where('isActive', '==', true), orderBy('sortOrder', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VehicleData));
    } catch (error) {
      console.error('Error fetching vehicle fleet:', error);
      return [];
    }
  }

  async addVehicle(vehicle: Omit<VehicleData, 'id'>): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, this.VEHICLES_COLLECTION), { ...vehicle, createdAt: new Date() });
      return docRef.id;
    } catch (error) {
      console.error('Error adding vehicle:', error);
      return null;
    }
  }

  async updateVehicle(id: string, data: Partial<VehicleData>): Promise<boolean> {
    try {
      const docRef = doc(db, this.VEHICLES_COLLECTION, id);
      await updateDoc(docRef, { ...data, updatedAt: new Date() });
      return true;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      return false;
    }
  }

  async deleteVehicle(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, this.VEHICLES_COLLECTION, id));
      return true;
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      return false;
    }
  }

  // ============ INQUIRIES ============

  async submitInquiry(type: 'helicopter' | 'yacht' | 'jet' | 'villa' | 'vehicle', data: any): Promise<string | null> {
    try {
      const collectionName = type === 'helicopter' ? 'helicopterInquiries' 
        : type === 'yacht' ? 'yachtInquiries'
        : type === 'jet' ? 'jetInquiries'
        : type === 'vehicle' ? 'vehicleInquiries'
        : 'villaInquiries';
      
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        type,
        createdAt: new Date(),
        status: 'new',
        notificationSent: false
      });
      
      // Trigger email notification (via Firebase Function)
      this.sendNotificationEmail(type, docRef.id, data);
      
      return docRef.id;
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      return null;
    }
  }

  private async sendNotificationEmail(type: string, inquiryId: string, data: any) {
    try {
      const typeEmojis: Record<string, string> = {
        helicopter: '🚁',
        yacht: '⚓',
        jet: '✈️',
        villa: '🏛️',
        vehicle: '🚗'
      };
      
      await fetch('https://us-central1-recharge-travels-73e76.cloudfunctions.net/sendLuxuryInquiryEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'luxury@rechargetravels.com',
          subject: `${typeEmojis[type] || '✨'} New ${type.charAt(0).toUpperCase() + type.slice(1)} Charter Inquiry - ${data.name}`,
          inquiryId,
          ...data,
          type
        })
      });
    } catch (error) {
      console.log('Email notification will be sent via background job');
    }
  }

  // ============ CONTACT INFO ============

  async getContactInfo(): Promise<LuxuryContactInfo> {
    try {
      const docRef = doc(db, 'settings', 'luxuryContact');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as LuxuryContactInfo;
      }
      return this.defaultContact;
    } catch (error) {
      console.error('Error fetching contact info:', error);
      return this.defaultContact;
    }
  }

  async updateContactInfo(info: Partial<LuxuryContactInfo>): Promise<boolean> {
    try {
      const docRef = doc(db, 'settings', 'luxuryContact');
      await setDoc(docRef, { ...info, updatedAt: new Date() }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating contact info:', error);
      return false;
    }
  }

  // ============ HERO IMAGES ============

  async updateHeroImages(pageId: string, images: Array<{ url: string; title: string; subtitle: string }>): Promise<boolean> {
    try {
      const docRef = doc(db, this.COLLECTION, pageId);
      await setDoc(docRef, { heroImages: images, updatedAt: new Date() }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating hero images:', error);
      return false;
    }
  }

  // ============ DREAM JOURNEYS ============

  async getDreamJourneysPageContent(): Promise<any> {
    try {
      const docRef = doc(db, this.COLLECTION, 'dream-journeys');
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error('Error fetching dream journeys page content:', error);
      return null;
    }
  }

  async updateDreamJourneysPageContent(content: any): Promise<boolean> {
    try {
      const docRef = doc(db, this.COLLECTION, 'dream-journeys');
      await setDoc(docRef, { ...content, updatedAt: new Date() }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating dream journeys page content:', error);
      return false;
    }
  }

  // ============ VIP CONCIERGE ============

  async getVIPConciergePageContent(): Promise<any> {
    try {
      const docRef = doc(db, this.COLLECTION, 'vip-concierge');
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error('Error fetching VIP concierge page content:', error);
      return null;
    }
  }

  async updateVIPConciergePageContent(content: any): Promise<boolean> {
    try {
      const docRef = doc(db, this.COLLECTION, 'vip-concierge');
      await setDoc(docRef, { ...content, updatedAt: new Date() }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating VIP concierge page content:', error);
      return false;
    }
  }

  // ============ EXCLUSIVE ACCESS ============

  async getExclusiveAccessPageContent(): Promise<any> {
    try {
      const docRef = doc(db, this.COLLECTION, 'exclusive-access');
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error('Error fetching exclusive access page content:', error);
      return null;
    }
  }

  async updateExclusiveAccessPageContent(content: any): Promise<boolean> {
    try {
      const docRef = doc(db, this.COLLECTION, 'exclusive-access');
      await setDoc(docRef, { ...content, updatedAt: new Date() }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating exclusive access page content:', error);
      return false;
    }
  }

  // ============ SEED DEFAULT DATA ============

  async seedHelicopterData(): Promise<boolean> {
    try {
      const defaultHelicopters: Omit<HelicopterData, 'id'>[] = [
        {
          name: 'Airbus H160 VIP',
          image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
          passengers: 8,
          range: '850 km',
          speed: '325 km/h',
          maxAltitude: '6,096 m',
          engines: '2x Safran Arrano 1A',
          cabinVolume: '8.9 m³',
          baggageCapacity: '1.4 m³',
          features: ['Fenestron tail rotor', 'Blue Edge blades', 'VIP leather interior', 'Satellite phone', 'WiFi connectivity', 'Air conditioning', 'Sound-proofed cabin'],
          pricePerHour: 'USD 8,500',
          description: 'The most advanced medium helicopter in the world with whisper-quiet Blue Edge blades.',
          certifications: ['EASA', 'FAA', 'TCCA'],
          yearIntroduced: 2020,
          isActive: true,
          sortOrder: 1
        },
        {
          name: 'Leonardo AW139',
          image: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=800&q=80',
          passengers: 12,
          range: '1,060 km',
          speed: '306 km/h',
          maxAltitude: '6,096 m',
          engines: '2x Pratt & Whitney PT6C-67C',
          cabinVolume: '10.3 m³',
          baggageCapacity: '2.1 m³',
          features: ['Twin engine redundancy', 'All-weather IFR', 'Night vision compatible', 'Executive VIP cabin', 'Toilet facility option', 'Full galley', 'Entertainment system'],
          pricePerHour: 'USD 7,200',
          description: 'Premium twin-engine helicopter trusted by heads of state worldwide.',
          certifications: ['EASA', 'FAA', 'CAA'],
          yearIntroduced: 2003,
          isActive: true,
          sortOrder: 2
        }
      ];

      for (const heli of defaultHelicopters) {
        await this.addHelicopter(heli);
      }

      return true;
    } catch (error) {
      console.error('Error seeding helicopter data:', error);
      return false;
    }
  }
}

export const luxuryPagesService = new LuxuryPagesService();
