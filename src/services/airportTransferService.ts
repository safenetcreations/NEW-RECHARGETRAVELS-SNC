import { dbService } from '@/lib/firebase-services';
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Sri Lanka Airports Only
export const SRI_LANKA_AIRPORTS = [
  {
    code: 'CMB',
    name: 'Bandaranaike International Airport',
    city: 'Colombo',
    country: 'Sri Lanka',
    description: 'Main international airport serving Colombo',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400'
  },
  {
    code: 'JAF',
    name: 'Jaffna International Airport',
    city: 'Jaffna',
    country: 'Sri Lanka',
    description: 'International airport in Northern Sri Lanka',
    image: 'https://images.unsplash.com/photo-1540339832862-474599807836?w=400'
  },
  {
    code: 'HRI',
    name: 'Mattala Rajapaksa International Airport',
    city: 'Hambantota',
    country: 'Sri Lanka',
    description: 'Second international airport in Southern Sri Lanka',
    image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=400'
  },
  {
    code: 'RML',
    name: 'Ratmalana Airport',
    city: 'Colombo',
    country: 'Sri Lanka',
    description: 'Domestic airport near Colombo',
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400'
  },
  {
    code: 'BTC',
    name: 'Batticaloa Airport',
    city: 'Batticaloa',
    country: 'Sri Lanka',
    description: 'Domestic airport in Eastern Sri Lanka',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400'
  },
  {
    code: 'TRR',
    name: 'China Bay Airport',
    city: 'Trincomalee',
    country: 'Sri Lanka',
    description: 'Airport serving Trincomalee',
    image: 'https://images.unsplash.com/photo-1540339832862-474599807836?w=400'
  },
];

// Keep WORLDWIDE_AIRPORTS as alias for compatibility
export const WORLDWIDE_AIRPORTS = SRI_LANKA_AIRPORTS;

// Sri Lanka Destinations
export const SRI_LANKA_DESTINATIONS = [
  { name: 'Colombo City Center', area: 'Colombo', type: 'city' },
  { name: 'Colombo Fort', area: 'Colombo', type: 'city' },
  { name: 'Negombo Beach', area: 'Negombo', type: 'beach' },
  { name: 'Negombo City', area: 'Negombo', type: 'city' },
  { name: 'Kandy City', area: 'Kandy', type: 'city' },
  { name: 'Temple of the Tooth', area: 'Kandy', type: 'attraction' },
  { name: 'Galle Fort', area: 'Galle', type: 'attraction' },
  { name: 'Unawatuna Beach', area: 'Galle', type: 'beach' },
  { name: 'Bentota Beach', area: 'Bentota', type: 'beach' },
  { name: 'Hikkaduwa Beach', area: 'Hikkaduwa', type: 'beach' },
  { name: 'Mirissa Beach', area: 'Mirissa', type: 'beach' },
  { name: 'Tangalle Beach', area: 'Tangalle', type: 'beach' },
  { name: 'Ella Town', area: 'Ella', type: 'hill-country' },
  { name: 'Nine Arch Bridge', area: 'Ella', type: 'attraction' },
  { name: 'Nuwara Eliya', area: 'Nuwara Eliya', type: 'hill-country' },
  { name: 'Sigiriya Rock Fortress', area: 'Sigiriya', type: 'attraction' },
  { name: 'Dambulla Cave Temple', area: 'Dambulla', type: 'attraction' },
  { name: 'Polonnaruwa Ancient City', area: 'Polonnaruwa', type: 'attraction' },
  { name: 'Anuradhapura Ancient City', area: 'Anuradhapura', type: 'attraction' },
  { name: 'Yala National Park', area: 'Yala', type: 'wildlife' },
  { name: 'Udawalawe National Park', area: 'Udawalawe', type: 'wildlife' },
  { name: 'Wilpattu National Park', area: 'Wilpattu', type: 'wildlife' },
  { name: 'Arugam Bay', area: 'Arugam Bay', type: 'beach' },
  { name: 'Trincomalee', area: 'Trincomalee', type: 'beach' },
  { name: 'Jaffna City', area: 'Jaffna', type: 'city' },
  { name: 'Adams Peak', area: 'Ratnapura', type: 'attraction' },
  { name: 'Horton Plains', area: 'Nuwara Eliya', type: 'nature' },
  { name: 'Pinnawala Elephant Orphanage', area: 'Kegalle', type: 'wildlife' },
  { name: 'Kalpitiya', area: 'Kalpitiya', type: 'beach' },
  { name: 'Pasikuda Beach', area: 'Batticaloa', type: 'beach' },
  { name: 'Hambantota', area: 'Hambantota', type: 'city' },
  { name: 'Katunayake', area: 'Katunayake', type: 'city' },
  { name: 'Mount Lavinia', area: 'Mount Lavinia', type: 'beach' },
  { name: 'Wadduwa Beach', area: 'Wadduwa', type: 'beach' },
  { name: 'Kalutara', area: 'Kalutara', type: 'city' },
];

// Vehicle types with pricing
export const VEHICLE_TYPES = [
  {
    id: 'economy',
    name: 'Economy Sedan',
    description: 'Toyota Axio, Honda Fit',
    passengers: 3,
    luggage: 2,
    pricePerKm: 80, // LKR
    basePrice: 3500,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400'
  },
  {
    id: 'sedan',
    name: 'Premium Sedan',
    description: 'Toyota Premio, Honda Grace',
    passengers: 3,
    luggage: 3,
    pricePerKm: 100,
    basePrice: 4500,
    image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400'
  },
  {
    id: 'suv',
    name: 'SUV',
    description: 'Toyota Prado, Mitsubishi Montero',
    passengers: 6,
    luggage: 4,
    pricePerKm: 150,
    basePrice: 7500,
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400'
  },
  {
    id: 'van',
    name: 'Mini Van',
    description: 'Toyota KDH, Nissan Caravan',
    passengers: 8,
    luggage: 6,
    pricePerKm: 130,
    basePrice: 6500,
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400'
  },
  {
    id: 'luxury',
    name: 'Luxury Vehicle',
    description: 'Mercedes E-Class, BMW 5 Series',
    passengers: 3,
    luggage: 3,
    pricePerKm: 250,
    basePrice: 15000,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400'
  },
  {
    id: 'luxury-suv',
    name: 'Luxury SUV',
    description: 'Land Cruiser V8, Range Rover',
    passengers: 6,
    luggage: 4,
    pricePerKm: 300,
    basePrice: 20000,
    image: 'https://images.unsplash.com/photo-1606611013016-969c19f86c7c?w=400'
  },
  {
    id: 'coach',
    name: 'Mini Coach',
    description: 'Toyota Coaster, Rosa Bus',
    passengers: 25,
    luggage: 25,
    pricePerKm: 200,
    basePrice: 12000,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400'
  }
];

// Route distances (from CMB airport)
export const ROUTE_DISTANCES: { [key: string]: number } = {
  'colombo': 35,
  'negombo': 10,
  'kandy': 120,
  'galle': 150,
  'bentota': 95,
  'hikkaduwa': 120,
  'mirissa': 165,
  'tangalle': 210,
  'ella': 250,
  'nuwara-eliya': 180,
  'sigiriya': 175,
  'dambulla': 155,
  'polonnaruwa': 200,
  'anuradhapura': 195,
  'yala': 280,
  'udawalawe': 195,
  'arugam-bay': 320,
  'trincomalee': 275,
  'jaffna': 400,
  'hambantota': 260,
  'kalpitiya': 130,
  'pasikuda': 310,
};

// Search airports (Sri Lanka only)
export const searchAirports = (query: string): typeof SRI_LANKA_AIRPORTS => {
  if (!query || query.length < 1) return SRI_LANKA_AIRPORTS; // Return all airports if no query
  const lowerQuery = query.toLowerCase();
  return SRI_LANKA_AIRPORTS.filter(
    airport =>
      airport.code.toLowerCase().includes(lowerQuery) ||
      airport.name.toLowerCase().includes(lowerQuery) ||
      airport.city.toLowerCase().includes(lowerQuery)
  );
};

// Search destinations
export const searchDestinations = (query: string): typeof SRI_LANKA_DESTINATIONS => {
  if (!query || query.length < 2) return SRI_LANKA_DESTINATIONS.slice(0, 10);
  const lowerQuery = query.toLowerCase();
  return SRI_LANKA_DESTINATIONS.filter(
    dest =>
      dest.name.toLowerCase().includes(lowerQuery) ||
      dest.area.toLowerCase().includes(lowerQuery)
  ).slice(0, 10);
};

// Calculate price
export const calculateTransferPrice = (
  distance: number,
  vehicleType: string,
  isReturn: boolean = false
): { price: number; currency: string; breakdown: any } => {
  const vehicle = VEHICLE_TYPES.find(v => v.id === vehicleType) || VEHICLE_TYPES[0];
  const distancePrice = distance * vehicle.pricePerKm;
  let totalPrice = vehicle.basePrice + distancePrice;

  if (isReturn) {
    totalPrice = totalPrice * 1.8; // 10% discount for return trips
  }

  // Convert to USD (approximate)
  const usdPrice = Math.round(totalPrice / 320);

  return {
    price: usdPrice,
    currency: 'USD',
    breakdown: {
      basePrice: Math.round(vehicle.basePrice / 320),
      distancePrice: Math.round(distancePrice / 320),
      totalLKR: totalPrice,
      distance: distance,
      vehicleType: vehicle.name,
      isReturn
    }
  };
};

// Airport Transfer Booking Interface
export interface AirportTransferBooking {
  id?: string;
  bookingReference: string;
  // Transfer details
  transferType: 'arrival' | 'departure' | 'round-trip';
  pickupAirport: {
    code: string;
    name: string;
    city: string;
    country: string;
  };
  dropoffLocation: {
    name: string;
    area: string;
    address?: string;
  };
  // Flight details
  flightNumber?: string;
  flightArrivalTime?: string;
  flightDepartureTime?: string;
  airline?: string;
  // Journey details
  pickupDate: string;
  pickupTime: string;
  returnDate?: string;
  returnTime?: string;
  // Passengers
  adults: number;
  children: number;
  infants: number;
  luggage: number;
  // Vehicle
  vehicleType: string;
  vehicleName: string;
  // Customer details
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
  };
  // Pricing
  pricing: {
    basePrice: number;
    distance: number;
    totalPrice: number;
    currency: string;
  };
  // Special requests
  specialRequests?: string;
  childSeats?: number;
  meetAndGreet: boolean;
  flightTracking: boolean;
  // Status
  status: 'pending' | 'confirmed' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  // Assignment
  assignedDriverId?: string;
  assignedDriverName?: string;
  assignedVehicleId?: string;
  driverPhone?: string;
  // Timestamps
  createdAt?: any;
  updatedAt?: any;
}

// Page content interface
export interface AirportTransferPageContent {
  heroSlides: {
    id: string;
    image: string;
    title: string;
    subtitle: string;
    description: string;
  }[];
  trustIndicators: {
    rating: string;
    totalReviews: string;
    transfersCompleted: string;
    support: string;
  };
  features: {
    icon: string;
    title: string;
    description: string;
    highlight: string;
  }[];
  popularRoutes: {
    destination: string;
    price: number;
    duration: string;
    distance: number;
  }[];
  testimonials: {
    name: string;
    country: string;
    rating: number;
    text: string;
    date: string;
  }[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
}

// Generate booking reference
const generateBookingReference = (): string => {
  const prefix = 'AT';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

class AirportTransferService {
  private bookingsCollection = 'airportTransferBookings';
  private contentCollection = 'page-content';
  private contentDocId = 'airport-transfers';

  // Search airports
  searchAirports(query: string) {
    return searchAirports(query);
  }

  // Search destinations
  searchDestinations(query: string) {
    return searchDestinations(query);
  }

  // Get vehicle types
  getVehicleTypes() {
    return VEHICLE_TYPES;
  }

  // Calculate price
  calculatePrice(destination: string, vehicleType: string, isReturn: boolean = false) {
    const normalizedDest = destination.toLowerCase().replace(/\s+/g, '-').split('-')[0];
    const distance = ROUTE_DISTANCES[normalizedDest] || 100; // Default 100km if not found
    return calculateTransferPrice(distance, vehicleType, isReturn);
  }

  // Create booking
  async createBooking(data: Omit<AirportTransferBooking, 'id' | 'bookingReference' | 'createdAt' | 'updatedAt'>): Promise<AirportTransferBooking> {
    const bookingReference = generateBookingReference();

    const booking = {
      ...data,
      bookingReference,
      status: data.status || 'pending',
      paymentStatus: data.paymentStatus || 'pending',
      meetAndGreet: data.meetAndGreet ?? true,
      flightTracking: data.flightTracking ?? true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, this.bookingsCollection), booking);

    return {
      id: docRef.id,
      ...booking,
      bookingReference
    } as AirportTransferBooking;
  }

  // Get booking by reference
  async getBookingByReference(reference: string): Promise<AirportTransferBooking | null> {
    const q = query(
      collection(db, this.bookingsCollection),
      where('bookingReference', '==', reference)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as AirportTransferBooking;
  }

  // Get bookings by email
  async getBookingsByEmail(email: string): Promise<AirportTransferBooking[]> {
    const q = query(
      collection(db, this.bookingsCollection),
      where('customerInfo.email', '==', email),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as AirportTransferBooking[];
  }

  // Get all bookings (admin)
  async getAllBookings(filters?: { status?: string; date?: string }): Promise<AirportTransferBooking[]> {
    let q = query(collection(db, this.bookingsCollection), orderBy('createdAt', 'desc'));

    if (filters?.status) {
      q = query(
        collection(db, this.bookingsCollection),
        where('status', '==', filters.status),
        orderBy('createdAt', 'desc')
      );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as AirportTransferBooking[];
  }

  // Update booking status
  async updateBookingStatus(id: string, status: AirportTransferBooking['status'], notes?: string): Promise<void> {
    const docRef = doc(db, this.bookingsCollection, id);
    await updateDoc(docRef, {
      status,
      statusNotes: notes || '',
      updatedAt: serverTimestamp()
    });
  }

  // Assign driver
  async assignDriver(bookingId: string, driverId: string, driverName: string, driverPhone: string, vehicleId: string): Promise<void> {
    const docRef = doc(db, this.bookingsCollection, bookingId);
    await updateDoc(docRef, {
      assignedDriverId: driverId,
      assignedDriverName: driverName,
      driverPhone,
      assignedVehicleId: vehicleId,
      status: 'assigned',
      updatedAt: serverTimestamp()
    });
  }

  // Get page content
  async getPageContent(): Promise<AirportTransferPageContent> {
    try {
      const docRef = doc(db, this.contentCollection, this.contentDocId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as AirportTransferPageContent;
      }
    } catch (error) {
      console.error('Error loading page content:', error);
    }

    // Return default content
    return this.getDefaultPageContent();
  }

  // Update page content (admin)
  async updatePageContent(content: Partial<AirportTransferPageContent>): Promise<void> {
    const docRef = doc(db, this.contentCollection, this.contentDocId);
    await setDoc(docRef, content, { merge: true });
  }

  // Default page content
  private getDefaultPageContent(): AirportTransferPageContent {
    return {
      heroSlides: [
        {
          id: '1',
          image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80',
          title: 'Worldwide Airport Transfers',
          subtitle: 'Seamless Travel from Anywhere',
          description: 'Book airport transfers to and from any destination in Sri Lanka. Professional drivers, luxury vehicles, and 24/7 service.'
        },
        {
          id: '2',
          image: 'https://images.unsplash.com/photo-1540339832862-474599807836?auto=format&fit=crop&q=80',
          title: 'Meet & Greet Service',
          subtitle: 'VIP Treatment on Arrival',
          description: 'Your driver awaits with a name board, assists with luggage, and ensures a smooth start to your Sri Lankan adventure.'
        },
        {
          id: '3',
          image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80',
          title: 'Premium Fleet',
          subtitle: 'Luxury & Comfort',
          description: 'Choose from economy sedans to luxury SUVs and coaches. All vehicles are air-conditioned and professionally maintained.'
        }
      ],
      trustIndicators: {
        rating: '4.9/5',
        totalReviews: '5,847',
        transfersCompleted: '25,000+',
        support: '24/7 Support'
      },
      features: [
        {
          icon: 'Plane',
          title: 'Flight Tracking',
          description: 'We monitor your flight and adjust pickup time automatically',
          highlight: 'No extra charge for delays'
        },
        {
          icon: 'Users',
          title: 'Meet & Greet',
          description: 'Driver waits at arrivals with your name board',
          highlight: '60 min free waiting time'
        },
        {
          icon: 'Clock',
          title: '24/7 Service',
          description: 'Available round the clock for all flight times',
          highlight: 'Night transfers available'
        },
        {
          icon: 'Shield',
          title: 'Fixed Pricing',
          description: 'No hidden charges or surge pricing ever',
          highlight: 'Price lock guarantee'
        },
        {
          icon: 'Car',
          title: 'Premium Vehicles',
          description: 'Modern fleet with professional drivers',
          highlight: 'GPS tracked for safety'
        },
        {
          icon: 'CreditCard',
          title: 'Easy Payment',
          description: 'Pay online or on arrival - your choice',
          highlight: 'Free cancellation 24h'
        }
      ],
      popularRoutes: [
        { destination: 'Colombo City', price: 35, duration: '45 mins', distance: 35 },
        { destination: 'Negombo', price: 20, duration: '20 mins', distance: 10 },
        { destination: 'Kandy', price: 85, duration: '3 hours', distance: 120 },
        { destination: 'Galle', price: 95, duration: '2.5 hours', distance: 150 },
        { destination: 'Bentota', price: 65, duration: '2 hours', distance: 95 },
        { destination: 'Sigiriya', price: 110, duration: '4 hours', distance: 175 },
        { destination: 'Ella', price: 135, duration: '5 hours', distance: 250 },
        { destination: 'Mirissa', price: 105, duration: '3 hours', distance: 165 }
      ],
      testimonials: [
        {
          name: 'James Wilson',
          country: 'United Kingdom',
          rating: 5,
          text: 'Excellent service! Driver was waiting at arrivals with my name board. Very comfortable Mercedes and smooth ride to Galle.',
          date: '2024-11-15'
        },
        {
          name: 'Maria Garcia',
          country: 'Spain',
          rating: 5,
          text: 'Our flight was delayed by 3 hours and they tracked it automatically. Driver was there when we finally arrived. Amazing!',
          date: '2024-11-10'
        },
        {
          name: 'Hans Mueller',
          country: 'Germany',
          rating: 5,
          text: 'Booked a luxury SUV for our family trip. The vehicle was immaculate and driver very professional. Highly recommend!',
          date: '2024-11-05'
        }
      ],
      seoTitle: 'Airport Transfers Sri Lanka | 24/7 Worldwide Service | Recharge Travels',
      seoDescription: 'Book reliable airport transfers in Sri Lanka. Professional drivers, flight tracking, meet & greet service. Fixed prices from Colombo Airport to all destinations.',
      seoKeywords: ['airport transfer sri lanka', 'colombo airport taxi', 'sri lanka airport pickup', 'CMB airport transfer', 'bandaranaike airport transfer']
    };
  }
}

export const airportTransferService = new AirportTransferService();
