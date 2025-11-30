// Private Tours Booking Service - Complete booking system with pricing
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
  getDoc,
  runTransaction
} from 'firebase/firestore';
import { customerCrmService } from './customerCrmService';

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface TourDestination {
  id: string;
  name: string;
  region: 'central' | 'southern' | 'northern' | 'eastern' | 'western' | 'north-western' | 'north-central' | 'uva' | 'sabaragamuwa';
  description: string;
  image: string;
  highlights: string[];
  durationHours: number; // Typical time to spend
  entranceFee?: number; // USD
  category: 'cultural' | 'wildlife' | 'beach' | 'nature' | 'adventure' | 'religious' | 'scenic';
  coordinates: { lat: number; lng: number };
  isPopular: boolean;
}

export interface TourVehicle {
  id: string;
  type: 'sedan' | 'suv' | 'van' | 'minibus' | 'luxury-sedan' | 'luxury-suv';
  name: string;
  description: string;
  image: string;
  maxPassengers: number;
  maxLuggage: number;
  features: string[];
  pricePerKm: number; // USD per km
  pricePerDay: number; // USD per day (8 hours)
  pricePerHalfDay: number; // USD per half day (4 hours)
  isAC: boolean;
  isLuxury: boolean;
}

export interface TourDriver {
  type: 'normal' | 'sltda-certified' | 'driver-guide';
  name: string;
  description: string;
  pricePerDay: number; // Additional cost per day
  features: string[];
  recommended: boolean;
}

export interface TourExtra {
  id: string;
  name: string;
  description: string;
  price: number;
  priceType: 'per-person' | 'per-booking' | 'per-day';
  icon: string;
  category: 'meal' | 'activity' | 'service' | 'entrance';
}

export interface TourPackage {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  image: string;
  gallery: string[];
  duration: string; // "1 Day", "2 Days / 1 Night", etc.
  durationDays: number;
  destinations: string[]; // Destination IDs
  highlights: string[];
  includes: string[];
  excludes: string[];
  startingPrice: number;
  category: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  bestTime: string[];
  maxGroupSize: number;
  isPopular: boolean;
  isFeatured: boolean;
}

export interface PrivateTourBooking {
  id?: string;
  bookingReference: string;
  customerId?: string;

  // Tour Details
  tourType: 'custom' | 'package';
  packageId?: string;
  packageName?: string;

  // Custom Tour Details
  selectedDestinations: {
    id: string;
    name: string;
    duration: number;
    entranceFee?: number;
  }[];

  // Schedule
  startDate: string;
  endDate: string;
  duration: {
    type: 'half-day' | 'full-day' | 'multi-day';
    days: number;
  };
  pickupTime: string;
  pickupLocation: string;
  dropoffLocation: string;

  // Vehicle
  vehicle: {
    type: string;
    name: string;
    price: number;
  };

  // Driver
  driver: {
    type: 'normal' | 'sltda-certified' | 'driver-guide';
    name: string;
    price: number;
  };

  // Passengers
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };

  // Extras
  extras: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];

  // Special Requests
  specialRequests?: string;
  dietaryRequirements?: string;
  mobilityRequirements?: string;

  // Customer Info
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    whatsapp?: string;
    nationality?: string;
    hotelName?: string;
    hotelAddress?: string;
  };

  // Pricing
  pricing: {
    vehicleCost: number;
    driverCost: number;
    entranceFees: number;
    extrasCost: number;
    subtotal: number;
    serviceFee: number;
    total: number;
    currency: string;
  };

  // Payment
  paymentMethod: 'card' | 'paypal' | 'bank-transfer' | 'cash';
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded';
  depositPaid?: number;

  // Booking Status
  status: 'pending' | 'confirmed' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  assignedDriverId?: string;
  assignedDriverName?: string;
  assignedVehicleId?: string;

  // Timestamps
  createdAt: any;
  updatedAt: any;
}

// ==========================================
// DESTINATIONS DATA
// ==========================================

export const TOUR_DESTINATIONS: TourDestination[] = [
  // Cultural Triangle
  {
    id: 'sigiriya',
    name: 'Sigiriya Rock Fortress',
    region: 'central',
    description: 'UNESCO World Heritage Site, ancient rock fortress with stunning frescoes',
    image: 'https://images.unsplash.com/photo-1586613835341-25f4d7b8a8b8?w=800',
    highlights: ['Lion Rock climb', 'Ancient frescoes', 'Mirror Wall', 'Water gardens'],
    durationHours: 3,
    entranceFee: 30,
    category: 'cultural',
    coordinates: { lat: 7.9570, lng: 80.7603 },
    isPopular: true
  },
  {
    id: 'dambulla',
    name: 'Dambulla Cave Temple',
    region: 'central',
    description: 'Ancient Buddhist cave temple with impressive Buddha statues',
    image: 'https://images.unsplash.com/photo-1588598198321-9735c5ca29d6?w=800',
    highlights: ['5 sacred caves', '150+ Buddha statues', 'Ancient murals', 'Golden Temple'],
    durationHours: 2,
    entranceFee: 15,
    category: 'religious',
    coordinates: { lat: 7.8675, lng: 80.6518 },
    isPopular: true
  },
  {
    id: 'kandy',
    name: 'Kandy - Temple of the Tooth',
    region: 'central',
    description: 'Sacred Buddhist temple housing the tooth relic of Buddha',
    image: 'https://images.unsplash.com/photo-1580181712-3b0e75d7f0e4?w=800',
    highlights: ['Sacred Tooth Relic', 'Kandyan dancing', 'Kandy Lake', 'Royal Palace'],
    durationHours: 3,
    entranceFee: 15,
    category: 'religious',
    coordinates: { lat: 7.2936, lng: 80.6413 },
    isPopular: true
  },
  {
    id: 'polonnaruwa',
    name: 'Polonnaruwa Ancient City',
    region: 'north-central',
    description: 'Medieval capital with well-preserved ruins',
    image: 'https://images.unsplash.com/photo-1590123674887-9f8a0fe47e50?w=800',
    highlights: ['Gal Vihara Buddha statues', 'Royal Palace', 'Lotus Pond', 'Ancient irrigation'],
    durationHours: 4,
    entranceFee: 25,
    category: 'cultural',
    coordinates: { lat: 7.9403, lng: 81.0188 },
    isPopular: true
  },
  {
    id: 'anuradhapura',
    name: 'Anuradhapura Sacred City',
    region: 'north-central',
    description: 'Ancient capital and Buddhist pilgrimage site',
    image: 'https://images.unsplash.com/photo-1625736379746-0d3c00e37c94?w=800',
    highlights: ['Sri Maha Bodhi', 'Ruwanwelisaya', 'Jetavanaramaya', 'Isurumuniya'],
    durationHours: 5,
    entranceFee: 25,
    category: 'religious',
    coordinates: { lat: 8.3114, lng: 80.4037 },
    isPopular: true
  },
  // Hill Country
  {
    id: 'nuwara-eliya',
    name: 'Nuwara Eliya',
    region: 'central',
    description: 'Little England - cool climate tea country',
    image: 'https://images.unsplash.com/photo-1586807480838-c8e1d4e9a9c1?w=800',
    highlights: ['Tea plantations', 'Gregory Lake', 'Victoria Park', 'Strawberry farms'],
    durationHours: 4,
    entranceFee: 0,
    category: 'scenic',
    coordinates: { lat: 6.9497, lng: 80.7891 },
    isPopular: true
  },
  {
    id: 'ella',
    name: 'Ella',
    region: 'uva',
    description: 'Picturesque hill town with stunning views',
    image: 'https://images.unsplash.com/photo-1586804223333-2f3a3a5aafb8?w=800',
    highlights: ['Nine Arch Bridge', 'Ella Rock', 'Little Adam\'s Peak', 'Ravana Falls'],
    durationHours: 5,
    entranceFee: 0,
    category: 'nature',
    coordinates: { lat: 6.8667, lng: 81.0466 },
    isPopular: true
  },
  {
    id: 'horton-plains',
    name: 'Horton Plains & World\'s End',
    region: 'central',
    description: 'Stunning plateau with dramatic cliff viewpoint',
    image: 'https://images.unsplash.com/photo-1590123674887-9f8a0fe47e50?w=800',
    highlights: ['World\'s End cliff', 'Baker\'s Falls', 'Cloud forest', 'Endemic wildlife'],
    durationHours: 4,
    entranceFee: 20,
    category: 'nature',
    coordinates: { lat: 6.8095, lng: 80.8017 },
    isPopular: true
  },
  {
    id: 'adams-peak',
    name: 'Adam\'s Peak (Sri Pada)',
    region: 'sabaragamuwa',
    description: 'Sacred mountain pilgrimage site',
    image: 'https://images.unsplash.com/photo-1590123674887-9f8a0fe47e50?w=800',
    highlights: ['Sacred footprint', 'Sunrise views', 'Pilgrimage trail', 'Spiritual experience'],
    durationHours: 8,
    entranceFee: 0,
    category: 'religious',
    coordinates: { lat: 6.8096, lng: 80.4994 },
    isPopular: true
  },
  // Wildlife
  {
    id: 'yala',
    name: 'Yala National Park',
    region: 'southern',
    description: 'Premier wildlife destination with highest leopard density',
    image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800',
    highlights: ['Leopards', 'Elephants', 'Sloth bears', 'Bird watching'],
    durationHours: 6,
    entranceFee: 40,
    category: 'wildlife',
    coordinates: { lat: 6.3728, lng: 81.5178 },
    isPopular: true
  },
  {
    id: 'udawalawe',
    name: 'Udawalawe National Park',
    region: 'sabaragamuwa',
    description: 'Best place to see wild elephants',
    image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800',
    highlights: ['Wild elephants', 'Elephant Transit Home', 'Bird sanctuary', 'Safari experience'],
    durationHours: 4,
    entranceFee: 30,
    category: 'wildlife',
    coordinates: { lat: 6.4389, lng: 80.8986 },
    isPopular: true
  },
  {
    id: 'minneriya',
    name: 'Minneriya National Park',
    region: 'north-central',
    description: 'Famous for "The Gathering" - largest elephant congregation',
    image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800',
    highlights: ['The Gathering', 'Wild elephants', 'Bird watching', 'Scenic reservoir'],
    durationHours: 4,
    entranceFee: 30,
    category: 'wildlife',
    coordinates: { lat: 8.0343, lng: 80.8961 },
    isPopular: true
  },
  {
    id: 'wilpattu',
    name: 'Wilpattu National Park',
    region: 'north-western',
    description: 'Oldest and largest national park with natural lakes',
    image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800',
    highlights: ['Leopards', 'Sloth bears', 'Natural lakes (villus)', 'Less crowded safaris'],
    durationHours: 6,
    entranceFee: 30,
    category: 'wildlife',
    coordinates: { lat: 8.4731, lng: 80.0192 },
    isPopular: false
  },
  // Beaches
  {
    id: 'mirissa',
    name: 'Mirissa',
    region: 'southern',
    description: 'Beautiful beach town, whale watching hub',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    highlights: ['Whale watching', 'Beach relaxation', 'Coconut Tree Hill', 'Seafood'],
    durationHours: 4,
    entranceFee: 0,
    category: 'beach',
    coordinates: { lat: 5.9485, lng: 80.4718 },
    isPopular: true
  },
  {
    id: 'unawatuna',
    name: 'Unawatuna Beach',
    region: 'southern',
    description: 'Crescent-shaped beach with calm waters',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    highlights: ['Swimming', 'Snorkeling', 'Japanese Peace Pagoda', 'Beach bars'],
    durationHours: 3,
    entranceFee: 0,
    category: 'beach',
    coordinates: { lat: 6.0087, lng: 80.2497 },
    isPopular: true
  },
  {
    id: 'galle',
    name: 'Galle Fort',
    region: 'southern',
    description: 'UNESCO Dutch colonial fort with charming streets',
    image: 'https://images.unsplash.com/photo-1580181712-3b0e75d7f0e4?w=800',
    highlights: ['Dutch Fort', 'Lighthouse', 'Colonial architecture', 'Boutique shopping'],
    durationHours: 3,
    entranceFee: 0,
    category: 'cultural',
    coordinates: { lat: 6.0269, lng: 80.2170 },
    isPopular: true
  },
  {
    id: 'bentota',
    name: 'Bentota',
    region: 'western',
    description: 'Water sports paradise and luxury resort area',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    highlights: ['Water sports', 'River safari', 'Turtle hatchery', 'Brief Garden'],
    durationHours: 4,
    entranceFee: 0,
    category: 'beach',
    coordinates: { lat: 6.4256, lng: 79.9983 },
    isPopular: true
  },
  {
    id: 'trincomalee',
    name: 'Trincomalee',
    region: 'eastern',
    description: 'Natural harbor with pristine beaches',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    highlights: ['Nilaveli Beach', 'Pigeon Island', 'Koneswaram Temple', 'Whale watching'],
    durationHours: 5,
    entranceFee: 0,
    category: 'beach',
    coordinates: { lat: 8.5874, lng: 81.2152 },
    isPopular: false
  },
  // Adventure
  {
    id: 'kitulgala',
    name: 'Kitulgala',
    region: 'sabaragamuwa',
    description: 'Adventure capital - white water rafting',
    image: 'https://images.unsplash.com/photo-1530866495561-507c9faab1f0?w=800',
    highlights: ['White water rafting', 'Waterfall abseiling', 'Jungle trekking', 'Canyoning'],
    durationHours: 5,
    entranceFee: 0,
    category: 'adventure',
    coordinates: { lat: 6.9894, lng: 80.4108 },
    isPopular: true
  },
  {
    id: 'sinharaja',
    name: 'Sinharaja Rainforest',
    region: 'sabaragamuwa',
    description: 'UNESCO World Heritage rainforest',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
    highlights: ['Endemic species', 'Bird watching', 'Nature walks', 'Biodiversity'],
    durationHours: 5,
    entranceFee: 20,
    category: 'nature',
    coordinates: { lat: 6.4000, lng: 80.4667 },
    isPopular: false
  },
  // Tea Country
  {
    id: 'tea-factory',
    name: 'Tea Factory Visit',
    region: 'central',
    description: 'Experience Ceylon tea production',
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800',
    highlights: ['Tea picking', 'Factory tour', 'Tea tasting', 'Scenic plantations'],
    durationHours: 2,
    entranceFee: 5,
    category: 'cultural',
    coordinates: { lat: 6.9700, lng: 80.7800 },
    isPopular: true
  },
  // Colombo
  {
    id: 'colombo',
    name: 'Colombo City Tour',
    region: 'western',
    description: 'Capital city exploration',
    image: 'https://images.unsplash.com/photo-1580181712-3b0e75d7f0e4?w=800',
    highlights: ['Gangaramaya Temple', 'Galle Face Green', 'Independence Square', 'Pettah Market'],
    durationHours: 4,
    entranceFee: 0,
    category: 'cultural',
    coordinates: { lat: 6.9271, lng: 79.8612 },
    isPopular: true
  }
];

// ==========================================
// VEHICLES DATA
// ==========================================

export const TOUR_VEHICLES: TourVehicle[] = [
  {
    id: 'economy-sedan',
    type: 'sedan',
    name: 'Economy Sedan',
    description: 'Comfortable sedan for couples or small groups',
    image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=400',
    maxPassengers: 3,
    maxLuggage: 2,
    features: ['Air Conditioning', 'Comfortable seats', 'Bottled water'],
    pricePerKm: 0.35,
    pricePerDay: 60,
    pricePerHalfDay: 35,
    isAC: true,
    isLuxury: false
  },
  {
    id: 'standard-suv',
    type: 'suv',
    name: 'Standard SUV',
    description: 'Spacious SUV ideal for families',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400',
    maxPassengers: 5,
    maxLuggage: 4,
    features: ['Air Conditioning', 'Spacious interior', 'USB charging', 'Bottled water', 'Cool box'],
    pricePerKm: 0.45,
    pricePerDay: 85,
    pricePerHalfDay: 50,
    isAC: true,
    isLuxury: false
  },
  {
    id: 'premium-van',
    type: 'van',
    name: 'Premium Van (KDH)',
    description: 'Comfortable van for groups up to 8',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    maxPassengers: 8,
    maxLuggage: 8,
    features: ['Air Conditioning', 'Reclining seats', 'USB charging', 'WiFi', 'Cool box', 'Entertainment system'],
    pricePerKm: 0.55,
    pricePerDay: 110,
    pricePerHalfDay: 65,
    isAC: true,
    isLuxury: false
  },
  {
    id: 'minibus',
    type: 'minibus',
    name: 'Mini Coach',
    description: 'Perfect for larger groups',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400',
    maxPassengers: 14,
    maxLuggage: 14,
    features: ['Air Conditioning', 'Comfortable seats', 'PA system', 'Cool box', 'Large luggage space'],
    pricePerKm: 0.75,
    pricePerDay: 150,
    pricePerHalfDay: 90,
    isAC: true,
    isLuxury: false
  },
  {
    id: 'luxury-sedan',
    type: 'luxury-sedan',
    name: 'Luxury Sedan (Mercedes/BMW)',
    description: 'Premium comfort for discerning travelers',
    image: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=400',
    maxPassengers: 3,
    maxLuggage: 3,
    features: ['Premium AC', 'Leather seats', 'WiFi', 'Complimentary refreshments', 'Privacy glass', 'Executive comfort'],
    pricePerKm: 0.85,
    pricePerDay: 180,
    pricePerHalfDay: 110,
    isAC: true,
    isLuxury: true
  },
  {
    id: 'luxury-suv',
    type: 'luxury-suv',
    name: 'Luxury SUV (Land Cruiser/Prado)',
    description: 'Ultimate safari experience with luxury',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400',
    maxPassengers: 5,
    maxLuggage: 5,
    features: ['Premium AC', 'Leather seats', 'WiFi', 'Safari-ready', 'Roof hatch', 'Premium amenities'],
    pricePerKm: 0.95,
    pricePerDay: 220,
    pricePerHalfDay: 130,
    isAC: true,
    isLuxury: true
  }
];

// ==========================================
// DRIVER TYPES
// ==========================================

export const DRIVER_TYPES: TourDriver[] = [
  {
    type: 'normal',
    name: 'Professional Driver',
    description: 'Experienced, courteous driver with excellent knowledge of roads and routes',
    pricePerDay: 0, // Included in vehicle price
    features: [
      'Experienced & professional',
      'Knowledge of routes',
      'Safe driving',
      'English communication',
      'Flexible with schedules'
    ],
    recommended: false
  },
  {
    type: 'sltda-certified',
    name: 'SLTDA Certified Driver',
    description: 'Government certified chauffeur with tourism training',
    pricePerDay: 25,
    features: [
      'SLTDA (Sri Lanka Tourism) certified',
      'Tourism industry training',
      'Professional uniform',
      'Better English proficiency',
      'Tourism etiquette trained',
      'Background verified'
    ],
    recommended: true
  },
  {
    type: 'driver-guide',
    name: 'Driver Guide',
    description: 'Licensed guide who drives - your tour narrator and driver in one!',
    pricePerDay: 50,
    features: [
      'Licensed tour guide + driver',
      'Expert local knowledge',
      'Historical & cultural insights',
      'Multi-language available',
      'Photography tips',
      'Hidden gems knowledge',
      'Personalized commentary'
    ],
    recommended: false
  }
];

// ==========================================
// EXTRAS
// ==========================================

export const TOUR_EXTRAS: TourExtra[] = [
  {
    id: 'breakfast',
    name: 'Breakfast',
    description: 'Traditional Sri Lankan or Western breakfast',
    price: 8,
    priceType: 'per-person',
    icon: 'Coffee',
    category: 'meal'
  },
  {
    id: 'lunch',
    name: 'Lunch Package',
    description: 'Local restaurant lunch with authentic cuisine',
    price: 12,
    priceType: 'per-person',
    icon: 'Utensils',
    category: 'meal'
  },
  {
    id: 'dinner',
    name: 'Dinner Package',
    description: 'Quality dinner at selected restaurant',
    price: 15,
    priceType: 'per-person',
    icon: 'Utensils',
    category: 'meal'
  },
  {
    id: 'child-seat',
    name: 'Child Seat',
    description: 'Safety seat for children under 4',
    price: 10,
    priceType: 'per-booking',
    icon: 'Baby',
    category: 'service'
  },
  {
    id: 'wifi-hotspot',
    name: 'WiFi Hotspot Device',
    description: 'Portable WiFi for the journey',
    price: 8,
    priceType: 'per-day',
    icon: 'Wifi',
    category: 'service'
  },
  {
    id: 'photography',
    name: 'Photography Service',
    description: 'Professional photographer for your tour',
    price: 100,
    priceType: 'per-day',
    icon: 'Camera',
    category: 'service'
  },
  {
    id: 'drone-filming',
    name: 'Drone Video',
    description: 'Aerial footage of your journey',
    price: 150,
    priceType: 'per-day',
    icon: 'Video',
    category: 'service'
  },
  {
    id: 'picnic-basket',
    name: 'Picnic Basket',
    description: 'Gourmet picnic lunch in scenic location',
    price: 35,
    priceType: 'per-booking',
    icon: 'Package',
    category: 'meal'
  }
];

// ==========================================
// POPULAR TOUR PACKAGES
// ==========================================

export const TOUR_PACKAGES: TourPackage[] = [
  {
    id: 'cultural-triangle',
    name: 'Cultural Triangle Explorer',
    slug: 'cultural-triangle-explorer',
    description: 'Discover the ancient wonders of Sri Lanka\'s Cultural Triangle. Visit the iconic Sigiriya Rock Fortress, the sacred cave temples of Dambulla, and the ancient city of Polonnaruwa.',
    shortDescription: 'Explore UNESCO heritage sites including Sigiriya, Dambulla & Polonnaruwa',
    image: 'https://images.unsplash.com/photo-1586613835341-25f4d7b8a8b8?w=800',
    gallery: [],
    duration: '1 Day',
    durationDays: 1,
    destinations: ['sigiriya', 'dambulla', 'polonnaruwa'],
    highlights: ['Climb Sigiriya Rock Fortress', 'Ancient frescoes & Mirror Wall', 'Dambulla Cave Temple', 'Polonnaruwa ruins'],
    includes: ['Private vehicle', 'Professional driver', 'Fuel & tolls', 'Bottled water', 'Hotel pickup & drop'],
    excludes: ['Entrance fees', 'Meals', 'Personal expenses', 'Tips'],
    startingPrice: 95,
    category: 'cultural',
    difficulty: 'moderate',
    bestTime: ['January', 'February', 'March', 'April', 'July', 'August'],
    maxGroupSize: 8,
    isPopular: true,
    isFeatured: true
  },
  {
    id: 'kandy-day-tour',
    name: 'Kandy Day Tour',
    slug: 'kandy-day-tour',
    description: 'Experience the cultural capital of Sri Lanka. Visit the sacred Temple of the Tooth, explore the Royal Botanical Gardens, and enjoy Kandyan dance performance.',
    shortDescription: 'Temple of the Tooth, Botanical Gardens & Kandyan culture',
    image: 'https://images.unsplash.com/photo-1580181712-3b0e75d7f0e4?w=800',
    gallery: [],
    duration: '1 Day',
    durationDays: 1,
    destinations: ['kandy', 'tea-factory'],
    highlights: ['Temple of the Tooth Relic', 'Peradeniya Botanical Gardens', 'Tea factory visit', 'Kandyan dance show', 'Scenic train views'],
    includes: ['Private vehicle', 'Professional driver', 'Fuel & tolls', 'Bottled water', 'Hotel pickup & drop'],
    excludes: ['Entrance fees', 'Meals', 'Dance show tickets', 'Tips'],
    startingPrice: 75,
    category: 'cultural',
    difficulty: 'easy',
    bestTime: ['All year'],
    maxGroupSize: 8,
    isPopular: true,
    isFeatured: true
  },
  {
    id: 'yala-safari',
    name: 'Yala Safari Adventure',
    slug: 'yala-safari-adventure',
    description: 'Embark on an exciting wildlife safari in Yala National Park, home to the world\'s highest density of leopards. Spot elephants, sloth bears, and exotic birds.',
    shortDescription: 'Leopard safari in Sri Lanka\'s premier wildlife park',
    image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800',
    gallery: [],
    duration: '1 Day',
    durationDays: 1,
    destinations: ['yala'],
    highlights: ['Morning & afternoon safaris', 'Leopard spotting', 'Elephant herds', 'Bird watching', 'Professional naturalist guide'],
    includes: ['Safari jeep', 'Naturalist guide', 'Park entrance', 'Packed breakfast', 'Bottled water'],
    excludes: ['Lunch', 'Personal expenses', 'Tips'],
    startingPrice: 120,
    category: 'wildlife',
    difficulty: 'easy',
    bestTime: ['February', 'March', 'April', 'May', 'June', 'July'],
    maxGroupSize: 6,
    isPopular: true,
    isFeatured: true
  },
  {
    id: 'galle-southern-coast',
    name: 'Galle & Southern Coast',
    slug: 'galle-southern-coast',
    description: 'Explore the charming Dutch colonial Galle Fort, relax on pristine beaches, and visit a turtle hatchery on this scenic coastal tour.',
    shortDescription: 'Colonial Galle Fort, beaches & turtle conservation',
    image: 'https://images.unsplash.com/photo-1580181712-3b0e75d7f0e4?w=800',
    gallery: [],
    duration: '1 Day',
    durationDays: 1,
    destinations: ['galle', 'unawatuna', 'bentota'],
    highlights: ['Galle Fort UNESCO site', 'Dutch colonial architecture', 'Turtle hatchery', 'Beach time', 'Seafood lunch option'],
    includes: ['Private vehicle', 'Professional driver', 'Fuel & tolls', 'Bottled water', 'Hotel pickup & drop'],
    excludes: ['Entrance fees', 'Meals', 'Personal expenses', 'Tips'],
    startingPrice: 85,
    category: 'beach',
    difficulty: 'easy',
    bestTime: ['November', 'December', 'January', 'February', 'March', 'April'],
    maxGroupSize: 8,
    isPopular: true,
    isFeatured: true
  },
  {
    id: 'tea-country-ella',
    name: 'Tea Country & Ella',
    slug: 'tea-country-ella',
    description: 'Journey through misty tea plantations, visit a working tea factory, and discover the charm of Ella with its stunning viewpoints.',
    shortDescription: 'Tea plantations, Nine Arch Bridge & mountain views',
    image: 'https://images.unsplash.com/photo-1586804223333-2f3a3a5aafb8?w=800',
    gallery: [],
    duration: '1 Day',
    durationDays: 1,
    destinations: ['nuwara-eliya', 'ella', 'tea-factory'],
    highlights: ['Tea factory tour & tasting', 'Nine Arch Bridge', 'Little Adam\'s Peak', 'Ravana Falls', 'Scenic mountain views'],
    includes: ['Private vehicle', 'Professional driver', 'Fuel & tolls', 'Tea factory entrance', 'Bottled water'],
    excludes: ['Meals', 'Personal expenses', 'Tips'],
    startingPrice: 90,
    category: 'nature',
    difficulty: 'moderate',
    bestTime: ['January', 'February', 'March', 'April', 'August', 'September'],
    maxGroupSize: 6,
    isPopular: true,
    isFeatured: true
  },
  {
    id: 'colombo-city-tour',
    name: 'Colombo City Discovery',
    slug: 'colombo-city-tour',
    description: 'Discover the vibrant capital city with its mix of colonial heritage, modern architecture, temples, and bustling markets.',
    shortDescription: 'Capital city highlights, temples & local markets',
    image: 'https://images.unsplash.com/photo-1580181712-3b0e75d7f0e4?w=800',
    gallery: [],
    duration: 'Half Day',
    durationDays: 0.5,
    destinations: ['colombo'],
    highlights: ['Gangaramaya Temple', 'Independence Square', 'Galle Face Green', 'Pettah Market', 'Red Mosque'],
    includes: ['Private vehicle', 'Professional driver', 'Fuel & tolls', 'Bottled water', 'Hotel pickup & drop'],
    excludes: ['Entrance fees', 'Meals', 'Shopping expenses', 'Tips'],
    startingPrice: 45,
    category: 'cultural',
    difficulty: 'easy',
    bestTime: ['All year'],
    maxGroupSize: 8,
    isPopular: true,
    isFeatured: false
  }
];

// ==========================================
// PRICING CALCULATOR
// ==========================================

export const calculateTourPrice = (params: {
  duration: { type: 'half-day' | 'full-day' | 'multi-day'; days: number };
  vehicle: TourVehicle;
  driver: TourDriver;
  passengers: { adults: number; children: number };
  selectedDestinations: { entranceFee?: number }[];
  extras: { price: number; priceType: string; quantity: number }[];
}): {
  vehicleCost: number;
  driverCost: number;
  entranceFees: number;
  extrasCost: number;
  subtotal: number;
  serviceFee: number;
  total: number;
} => {
  const { duration, vehicle, driver, passengers, selectedDestinations, extras } = params;

  // Vehicle cost
  let vehicleCost = 0;
  if (duration.type === 'half-day') {
    vehicleCost = vehicle.pricePerHalfDay;
  } else if (duration.type === 'full-day') {
    vehicleCost = vehicle.pricePerDay;
  } else {
    vehicleCost = vehicle.pricePerDay * duration.days;
  }

  // Driver cost
  let driverCost = driver.pricePerDay;
  if (duration.type === 'multi-day') {
    driverCost = driver.pricePerDay * duration.days;
  } else if (duration.type === 'half-day') {
    driverCost = driver.pricePerDay * 0.5;
  }

  // Entrance fees
  const totalPassengers = passengers.adults + passengers.children;
  const entranceFees = selectedDestinations.reduce((sum, dest) => {
    return sum + (dest.entranceFee || 0) * totalPassengers;
  }, 0);

  // Extras cost
  const extrasCost = extras.reduce((sum, extra) => {
    if (extra.priceType === 'per-person') {
      return sum + extra.price * totalPassengers * extra.quantity;
    } else if (extra.priceType === 'per-day') {
      return sum + extra.price * duration.days * extra.quantity;
    }
    return sum + extra.price * extra.quantity;
  }, 0);

  const subtotal = vehicleCost + driverCost + entranceFees + extrasCost;
  const serviceFee = Math.round(subtotal * 0.05); // 5% service fee
  const total = subtotal + serviceFee;

  return {
    vehicleCost: Math.round(vehicleCost),
    driverCost: Math.round(driverCost),
    entranceFees: Math.round(entranceFees),
    extrasCost: Math.round(extrasCost),
    subtotal: Math.round(subtotal),
    serviceFee,
    total: Math.round(total)
  };
};

// ==========================================
// BOOKING SERVICE
// ==========================================

// Generate sequential booking reference (PT01001, PT01002, etc.)
const generateTourBookingReference = async (): Promise<string> => {
  const counterRef = doc(db, 'counters', 'privateTourBookings');

  try {
    const newNumber = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);

      let currentNumber: number;
      if (!counterDoc.exists()) {
        currentNumber = 1000;
      } else {
        currentNumber = counterDoc.data().lastNumber || 1000;
      }

      const nextNumber = currentNumber + 1;

      transaction.set(counterRef, {
        lastNumber: nextNumber,
        updatedAt: new Date()
      });

      return nextNumber;
    });

    return `PT${newNumber.toString().padStart(5, '0')}`;
  } catch (error) {
    console.error('Error generating booking reference:', error);
    const timestamp = Date.now().toString(36).toUpperCase();
    return `PT${timestamp}`;
  }
};

export const privateToursBookingService = {
  collection: 'privateTourBookings',

  // Create booking
  async createBooking(data: Omit<PrivateTourBooking, 'id' | 'bookingReference' | 'createdAt' | 'updatedAt'>): Promise<PrivateTourBooking & { customerId?: string }> {
    const bookingReference = await generateTourBookingReference();

    const booking = {
      ...data,
      bookingReference,
      status: data.status || 'pending',
      paymentStatus: data.paymentStatus || 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, this.collection), booking);

    // Create/update customer profile in CRM
    let customerId: string | undefined;
    try {
      if (data.customerInfo?.email) {
        const customer = await customerCrmService.createOrUpdateFromBooking({
          firstName: data.customerInfo.firstName || '',
          lastName: data.customerInfo.lastName || '',
          email: data.customerInfo.email,
          phone: data.customerInfo.phone || '',
          whatsapp: data.customerInfo.whatsapp,
          bookingReference: bookingReference,
          bookingAmount: data.pricing.total || 0,
          specialRequests: data.specialRequests
        });
        customerId = customer.customerId;
      }
    } catch (crmError) {
      console.error('CRM update failed:', crmError);
    }

    return {
      id: docRef.id,
      ...booking,
      bookingReference,
      customerId
    } as PrivateTourBooking & { customerId?: string };
  },

  // Get booking by reference
  async getBookingByReference(reference: string): Promise<PrivateTourBooking | null> {
    const q = query(
      collection(db, this.collection),
      where('bookingReference', '==', reference)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as PrivateTourBooking;
  },

  // Get all bookings
  async getAllBookings(filters?: { status?: string }): Promise<PrivateTourBooking[]> {
    let q = query(collection(db, this.collection), orderBy('createdAt', 'desc'));

    if (filters?.status) {
      q = query(
        collection(db, this.collection),
        where('status', '==', filters.status),
        orderBy('createdAt', 'desc')
      );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PrivateTourBooking[];
  },

  // Update booking status
  async updateBookingStatus(id: string, status: PrivateTourBooking['status']): Promise<void> {
    const docRef = doc(db, this.collection, id);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp()
    });
  },

  // Get destinations data
  getDestinations: () => TOUR_DESTINATIONS,

  // Get vehicles data
  getVehicles: () => TOUR_VEHICLES,

  // Get driver types
  getDriverTypes: () => DRIVER_TYPES,

  // Get extras
  getExtras: () => TOUR_EXTRAS,

  // Get packages
  getPackages: () => TOUR_PACKAGES,

  // Calculate price
  calculatePrice: calculateTourPrice
};

export default privateToursBookingService;
