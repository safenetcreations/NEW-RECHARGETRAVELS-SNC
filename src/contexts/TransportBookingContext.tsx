import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Types
export interface Vehicle {
  id: string;
  name: string;
  type: string;
  passengers: number;
  luggage: number;
  image?: string;
  features?: string[];
  basePrice?: number;
  hourlyRate?: number;
  dailyRate?: number;
  perKmRate?: number;
  tourAvailable?: boolean;
  tourSurcharge?: number;
  isActive: boolean;
}

export interface Driver {
  id: string;
  name: string;
  photo?: string;
  rating?: number;
  trips?: number;
  languages?: string[];
  hourlyRate: number;
  dailyRate?: number;
  isActive: boolean;
}

export interface Tour {
  id: string;
  name: string;
  description: string;
  image?: string;
  duration: string;
  pricePerPerson: number;
  highlights?: string[];
  includes?: string[];
  itinerary?: string;
  pickupLocation?: string;
  rating?: number;
  reviews?: number;
  popular?: boolean;
  isActive: boolean;
}

export interface TrailService {
  id: string;
  name: string;
  description: string;
  fullDescription?: string;
  image?: string;
  duration?: string;
  distance?: string;
  elevation?: string;
  difficulty: 'easy' | 'moderate' | 'challenging' | 'expert';
  basePrice: number;
  perPersonRate?: number;
  perHourRate?: number;
  guideFee?: number;
  equipmentRentalFee?: number;
  bestTime?: string;
  whatToExpect?: string;
  rating?: number;
  isActive: boolean;
}

export interface Airport {
  id: string;
  name: string;
  code: string;
}

export interface Location {
  id: string;
  name: string;
  region?: string;
}

export interface Pricing {
  airportTransfers?: {
    baseRate: number;
    defaultDistance: number;
    routes: Array<{
      from: string;
      to: string;
      basePrice: number;
      prices?: Record<string, number>;
    }>;
  };
}

interface TransportBookingContextType {
  vehicles: Vehicle[];
  drivers: Driver[];
  tours: Tour[];
  trailServices: TrailService[];
  airports: Airport[];
  locations: Location[];
  pricing: Pricing;
  loading: boolean;
  fetchAllData: () => Promise<void>;
  calculateAirportTransferPrice: (vehicleId: string, fromLocation: string, toLocation: string) => number;
  calculateDriverPrice: (driverId: string, vehicleId: string, hours: number, days: number) => number;
  calculateTourPrice: (tourId: string, participants: number, vehicleId?: string) => number;
  calculateTrailPrice: (serviceId: string, duration: number, participants: number) => number;
}

const TransportBookingContext = createContext<TransportBookingContextType | undefined>(undefined);

export const useTransportBooking = () => {
  const context = useContext(TransportBookingContext);
  if (!context) {
    throw new Error('useTransportBooking must be used within a TransportBookingProvider');
  }
  return context;
};

interface TransportBookingProviderProps {
  children: ReactNode;
}

export const TransportBookingProvider = ({ children }: TransportBookingProviderProps) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [trailServices, setTrailServices] = useState<TrailService[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [pricing, setPricing] = useState<Pricing>({});
  const [loading, setLoading] = useState(true);

  // Fetch all data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchVehicles(),
        fetchDrivers(),
        fetchTours(),
        fetchTrailServices(),
        fetchAirports(),
        fetchLocations(),
        fetchPricing(),
      ]);
    } catch (error) {
      console.error('Error fetching transport data:', error);
      // Load default data if Firebase fails
      loadDefaultData();
    } finally {
      setLoading(false);
    }
  };

  const loadDefaultData = () => {
    // Default vehicles
    setVehicles([
      {
        id: 'economy',
        name: 'Economy Car',
        type: 'Sedan',
        passengers: 3,
        luggage: 2,
        features: ['AC', 'WiFi'],
        basePrice: 45,
        hourlyRate: 15,
        dailyRate: 80,
        perKmRate: 0.5,
        tourAvailable: true,
        isActive: true
      },
      {
        id: 'comfort',
        name: 'Comfort Sedan',
        type: 'Sedan',
        passengers: 4,
        luggage: 3,
        features: ['AC', 'WiFi', 'Water'],
        basePrice: 65,
        hourlyRate: 20,
        dailyRate: 100,
        perKmRate: 0.6,
        tourAvailable: true,
        isActive: true
      },
      {
        id: 'suv',
        name: 'SUV',
        type: 'SUV',
        passengers: 6,
        luggage: 5,
        features: ['AC', 'WiFi', 'Water', 'Snacks'],
        basePrice: 85,
        hourlyRate: 28,
        dailyRate: 150,
        perKmRate: 0.8,
        tourAvailable: true,
        tourSurcharge: 30,
        isActive: true
      },
      {
        id: 'van',
        name: 'Mini Van',
        type: 'Van',
        passengers: 8,
        luggage: 8,
        features: ['AC', 'WiFi', 'Water', 'Snacks', 'Entertainment'],
        basePrice: 120,
        hourlyRate: 35,
        dailyRate: 200,
        perKmRate: 1.0,
        tourAvailable: true,
        tourSurcharge: 50,
        isActive: true
      },
      {
        id: 'luxury',
        name: 'Luxury Mercedes',
        type: 'Luxury',
        passengers: 4,
        luggage: 3,
        features: ['AC', 'WiFi', 'Water', 'Champagne', 'Leather Seats'],
        basePrice: 180,
        hourlyRate: 60,
        dailyRate: 350,
        perKmRate: 1.5,
        tourAvailable: true,
        tourSurcharge: 100,
        isActive: true
      }
    ]);

    // Default airports
    setAirports([
      { id: 'CMB', name: 'Bandaranaike International Airport', code: 'CMB' },
      { id: 'HRI', name: 'Mattala Rajapaksa International Airport', code: 'HRI' },
      { id: 'RML', name: 'Ratmalana Airport', code: 'RML' },
      { id: 'JAF', name: 'Jaffna International Airport', code: 'JAF' }
    ]);

    // Default locations
    setLocations([
      { id: 'colombo', name: 'Colombo', region: 'Western' },
      { id: 'kandy', name: 'Kandy', region: 'Central' },
      { id: 'galle', name: 'Galle', region: 'Southern' },
      { id: 'sigiriya', name: 'Sigiriya', region: 'North Central' },
      { id: 'ella', name: 'Ella', region: 'Uva' },
      { id: 'nuwara-eliya', name: 'Nuwara Eliya', region: 'Central' },
      { id: 'negombo', name: 'Negombo', region: 'Western' },
      { id: 'bentota', name: 'Bentota', region: 'Southern' },
      { id: 'mirissa', name: 'Mirissa', region: 'Southern' },
      { id: 'arugam-bay', name: 'Arugam Bay', region: 'Eastern' },
      { id: 'trincomalee', name: 'Trincomalee', region: 'Eastern' },
      { id: 'jaffna', name: 'Jaffna', region: 'Northern' },
      { id: 'anuradhapura', name: 'Anuradhapura', region: 'North Central' },
      { id: 'polonnaruwa', name: 'Polonnaruwa', region: 'North Central' },
      { id: 'dambulla', name: 'Dambulla', region: 'Central' }
    ]);

    // Default drivers
    setDrivers([
      {
        id: 'driver1',
        name: 'Kamal Perera',
        rating: 4.9,
        trips: 1250,
        languages: ['English', 'Sinhala', 'Tamil'],
        hourlyRate: 12,
        dailyRate: 80,
        isActive: true
      },
      {
        id: 'driver2',
        name: 'Sunil Fernando',
        rating: 4.8,
        trips: 890,
        languages: ['English', 'Sinhala'],
        hourlyRate: 10,
        dailyRate: 70,
        isActive: true
      },
      {
        id: 'driver3',
        name: 'Rajesh Kumar',
        rating: 4.7,
        trips: 650,
        languages: ['English', 'Tamil', 'Hindi'],
        hourlyRate: 11,
        dailyRate: 75,
        isActive: true
      }
    ]);

    // Default tours
    setTours([
      {
        id: 'cultural-triangle',
        name: 'Cultural Triangle Tour',
        description: 'Explore ancient kingdoms of Anuradhapura, Polonnaruwa, and Sigiriya',
        duration: '3 days',
        pricePerPerson: 150,
        highlights: ['Sigiriya Rock', 'Dambulla Cave Temple', 'Ancient Ruins'],
        includes: ['Guide', 'Transport', 'Entry Fees'],
        rating: 4.9,
        reviews: 245,
        popular: true,
        isActive: true
      },
      {
        id: 'southern-coast',
        name: 'Southern Coast Explorer',
        description: 'Beach hopping from Bentota to Mirissa with whale watching',
        duration: '2 days',
        pricePerPerson: 95,
        highlights: ['Galle Fort', 'Whale Watching', 'Beaches'],
        includes: ['Guide', 'Transport'],
        rating: 4.8,
        reviews: 189,
        popular: true,
        isActive: true
      },
      {
        id: 'hill-country',
        name: 'Hill Country Adventure',
        description: 'Tea plantations, waterfalls, and scenic train rides',
        duration: '2 days',
        pricePerPerson: 120,
        highlights: ['Tea Plantations', 'Ella Rock', 'Nine Arch Bridge'],
        includes: ['Guide', 'Transport', 'Train Tickets'],
        rating: 4.9,
        reviews: 312,
        popular: true,
        isActive: true
      }
    ]);

    // Default trail services
    setTrailServices([
      {
        id: 'adams-peak',
        name: "Adam's Peak Sunrise Trek",
        description: 'Sacred pilgrimage to Sri Pada with breathtaking sunrise views',
        difficulty: 'challenging',
        duration: '6-8 hours',
        distance: '7 km',
        elevation: '2,243m',
        basePrice: 75,
        perPersonRate: 15,
        perHourRate: 8,
        guideFee: 50,
        equipmentRentalFee: 15,
        bestTime: 'December - May',
        rating: 4.9,
        isActive: true
      },
      {
        id: 'horton-plains',
        name: 'Horton Plains & World\'s End',
        description: 'Stunning plateau with dramatic cliff drop at World\'s End',
        difficulty: 'moderate',
        duration: '4-5 hours',
        distance: '9 km',
        elevation: '2,100m',
        basePrice: 60,
        perPersonRate: 12,
        perHourRate: 6,
        guideFee: 40,
        equipmentRentalFee: 10,
        bestTime: 'Year round (morning)',
        rating: 4.8,
        isActive: true
      },
      {
        id: 'knuckles',
        name: 'Knuckles Mountain Range',
        description: 'Remote wilderness with endemic species and cloud forests',
        difficulty: 'challenging',
        duration: '6-8 hours',
        distance: '12 km',
        elevation: '1,863m',
        basePrice: 80,
        perPersonRate: 18,
        perHourRate: 10,
        guideFee: 60,
        equipmentRentalFee: 20,
        bestTime: 'February - April',
        rating: 4.7,
        isActive: true
      }
    ]);

    // Default pricing
    setPricing({
      airportTransfers: {
        baseRate: 40,
        defaultDistance: 50,
        routes: [
          { from: 'CMB', to: 'colombo', basePrice: 35 },
          { from: 'CMB', to: 'negombo', basePrice: 25 },
          { from: 'CMB', to: 'kandy', basePrice: 85 },
          { from: 'CMB', to: 'galle', basePrice: 95 },
          { from: 'CMB', to: 'sigiriya', basePrice: 110 },
          { from: 'CMB', to: 'ella', basePrice: 150 },
          { from: 'CMB', to: 'nuwara-eliya', basePrice: 120 },
          { from: 'CMB', to: 'bentota', basePrice: 75 },
          { from: 'CMB', to: 'mirissa', basePrice: 110 },
        ]
      }
    });
  };

  const fetchVehicles = async () => {
    try {
      const snapshot = await getDocs(
        query(collection(db, 'vehicles'), where('isActive', '==', true), orderBy('name'))
      );
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vehicle));
      if (data.length > 0) setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const fetchDrivers = async () => {
    try {
      const snapshot = await getDocs(
        query(collection(db, 'drivers'), where('isActive', '==', true), orderBy('name'))
      );
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Driver));
      if (data.length > 0) setDrivers(data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const fetchTours = async () => {
    try {
      const snapshot = await getDocs(
        query(collection(db, 'tours'), where('isActive', '==', true), orderBy('name'))
      );
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tour));
      if (data.length > 0) setTours(data);
    } catch (error) {
      console.error('Error fetching tours:', error);
    }
  };

  const fetchTrailServices = async () => {
    try {
      const snapshot = await getDocs(
        query(collection(db, 'trailServices'), where('isActive', '==', true), orderBy('name'))
      );
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TrailService));
      if (data.length > 0) setTrailServices(data);
    } catch (error) {
      console.error('Error fetching trail services:', error);
    }
  };

  const fetchAirports = async () => {
    try {
      const snapshot = await getDocs(
        query(collection(db, 'airports'), orderBy('name'))
      );
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Airport));
      if (data.length > 0) setAirports(data);
    } catch (error) {
      console.error('Error fetching airports:', error);
    }
  };

  const fetchLocations = async () => {
    try {
      const snapshot = await getDocs(
        query(collection(db, 'locations'), orderBy('name'))
      );
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Location));
      if (data.length > 0) setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const fetchPricing = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'pricing'));
      const data: Pricing = {};
      snapshot.docs.forEach(doc => {
        (data as any)[doc.id] = doc.data();
      });
      if (Object.keys(data).length > 0) setPricing(data);
    } catch (error) {
      console.error('Error fetching pricing:', error);
    }
  };

  // Calculate price for airport transfer
  const calculateAirportTransferPrice = (vehicleId: string, fromLocation: string, toLocation: string): number => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return 0;

    const route = pricing.airportTransfers?.routes?.find(
      r => (r.from === fromLocation && r.to === toLocation) ||
           (r.from === toLocation && r.to === fromLocation)
    );

    if (route) {
      const vehiclePrice = route.prices?.[vehicleId] || route.basePrice;
      // Apply vehicle multiplier based on type
      const multiplier = vehicle.type === 'Luxury' ? 2.5 :
                         vehicle.type === 'SUV' ? 1.5 :
                         vehicle.type === 'Van' ? 1.8 : 1;
      return Math.round(vehiclePrice * multiplier);
    }

    // Fallback to distance-based pricing
    const baseRate = pricing.airportTransfers?.baseRate || 50;
    const perKmRate = vehicle.perKmRate || 0.5;
    const estimatedDistance = pricing.airportTransfers?.defaultDistance || 50;

    return Math.round(baseRate + (estimatedDistance * perKmRate));
  };

  // Calculate price for personal driver
  const calculateDriverPrice = (driverId: string, vehicleId: string, hours: number, days: number): number => {
    const driver = drivers.find(d => d.id === driverId);
    const vehicle = vehicles.find(v => v.id === vehicleId);

    if (!driver || !vehicle) return 0;

    const driverRate = driver.hourlyRate || 10;
    const vehicleRate = vehicle.hourlyRate || 20;

    if (days > 0) {
      const driverDailyRate = driver.dailyRate || driverRate * 8;
      const vehicleDailyRate = vehicle.dailyRate || vehicleRate * 8;
      return Math.round((driverDailyRate + vehicleDailyRate) * days);
    }

    return Math.round((driverRate + vehicleRate) * hours);
  };

  // Calculate tour price
  const calculateTourPrice = (tourId: string, participants: number, vehicleId?: string): number => {
    const tour = tours.find(t => t.id === tourId);
    if (!tour) return 0;

    let basePrice = tour.pricePerPerson * participants;

    if (vehicleId) {
      const vehicle = vehicles.find(v => v.id === vehicleId);
      if (vehicle?.tourSurcharge) {
        basePrice += vehicle.tourSurcharge;
      }
    }

    // Apply group discounts
    if (participants >= 10) {
      basePrice *= 0.85; // 15% discount
    } else if (participants >= 5) {
      basePrice *= 0.9; // 10% discount
    }

    return Math.round(basePrice);
  };

  // Calculate trail service price
  const calculateTrailPrice = (serviceId: string, duration: number, participants: number): number => {
    const service = trailServices.find(s => s.id === serviceId);
    if (!service) return 0;

    const basePrice = service.basePrice || 100;
    const perPersonRate = service.perPersonRate || 20;
    const perHourRate = service.perHourRate || 15;

    return Math.round(basePrice + (perPersonRate * participants) + (perHourRate * duration));
  };

  const value: TransportBookingContextType = {
    vehicles,
    drivers,
    tours,
    trailServices,
    airports,
    locations,
    pricing,
    loading,
    fetchAllData,
    calculateAirportTransferPrice,
    calculateDriverPrice,
    calculateTourPrice,
    calculateTrailPrice,
  };

  return (
    <TransportBookingContext.Provider value={value}>
      {children}
    </TransportBookingContext.Provider>
  );
};
