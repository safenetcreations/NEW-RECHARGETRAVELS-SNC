/**
 * RECHARGE TRAVELS - PRICING DATA CONFIGURATION
 * ==============================================
 * All prices in USD (base currency)
 */

// ============================================
// TYPES
// ============================================
export interface Vehicle {
  id: string;
  name: string;
  maxPassengers: number;
  maxLuggage: number;
  pricePerDay: number;
  fuelCostPerKm: number;
  image: string;
  features: string[];
  recommended: string;
}

export interface AccommodationTier {
  id: string;
  name: string;
  description: string;
  pricePerNight: {
    single: number;
    double: number;
    triple: number;
    family: number;
  };
  includes: string[];
  sampleHotels: string[];
}

export interface Destination {
  id: string;
  name: string;
  region: string;
  distanceFromColombo: number;
  entranceFee: { adult: number; child: number };
  suggestedDuration: number;
  highlights: string[];
  icon: string;
}

export interface Activity {
  id: string;
  name: string;
  category: string;
  pricePerPerson: number | { firstClass: number; secondClass: number; thirdClass: number };
  duration: string;
  includes: string[];
  maxPerJeep?: number;
  destination?: string;
  seasonBest?: number[];
  note?: string;
  childPrice?: boolean;
}

export interface AdditionalService {
  id: string;
  name: string;
  price?: number;
  pricePerDay?: number;
  description: string;
  languages?: string[];
}

// ============================================
// CURRENCY RATES
// ============================================
export const CURRENCY_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  AUD: 1.53,
  LKR: 325,
};

// ============================================
// SEASONAL PRICING MULTIPLIERS
// ============================================
export const SEASONS = {
  peak: {
    months: [12, 1, 2, 7, 8],
    multiplier: 1.20,
    label: 'Peak Season',
  },
  shoulder: {
    months: [3, 4, 11],
    multiplier: 1.10,
    label: 'Shoulder Season',
  },
  low: {
    months: [5, 6, 9, 10],
    multiplier: 1.0,
    label: 'Green Season (Best Value)',
  },
};

// ============================================
// VEHICLE OPTIONS
// ============================================
export const VEHICLES: Record<string, Vehicle> = {
  sedan: {
    id: 'sedan',
    name: 'Sedan (Toyota Axio/Premio)',
    maxPassengers: 3,
    maxLuggage: 2,
    pricePerDay: 55,
    fuelCostPerKm: 0.08,
    image: '/images/vehicles/sedan.jpg',
    features: ['Air Conditioned', 'Comfortable Seating', 'Ideal for Couples'],
    recommended: 'couples',
  },
  suv: {
    id: 'suv',
    name: 'SUV (Toyota Prado/Fortuner)',
    maxPassengers: 5,
    maxLuggage: 4,
    pricePerDay: 85,
    fuelCostPerKm: 0.12,
    image: '/images/vehicles/suv.jpg',
    features: ['4WD Option', 'High Ground Clearance', 'Safari Ready'],
    recommended: 'families',
  },
  van: {
    id: 'van',
    name: 'Mini Van (Toyota KDH)',
    maxPassengers: 7,
    maxLuggage: 6,
    pricePerDay: 75,
    fuelCostPerKm: 0.10,
    image: '/images/vehicles/van.jpg',
    features: ['Spacious Interior', 'Ample Luggage Space', 'Family Friendly'],
    recommended: 'families',
  },
  luxury: {
    id: 'luxury',
    name: 'Luxury Van (Mercedes V-Class)',
    maxPassengers: 6,
    maxLuggage: 5,
    pricePerDay: 150,
    fuelCostPerKm: 0.15,
    image: '/images/vehicles/luxury.jpg',
    features: ['Premium Interior', 'WiFi Onboard', 'Refreshments Included'],
    recommended: 'luxury',
  },
  miniBus: {
    id: 'miniBus',
    name: 'Mini Bus (Toyota Coaster)',
    maxPassengers: 14,
    maxLuggage: 14,
    pricePerDay: 120,
    fuelCostPerKm: 0.14,
    image: '/images/vehicles/minibus.jpg',
    features: ['Group Travel', 'PA System', 'Large Windows'],
    recommended: 'groups',
  },
};

// ============================================
// ACCOMMODATION TIERS
// ============================================
export const ACCOMMODATION_TIERS: Record<string, AccommodationTier> = {
  budget: {
    id: 'budget',
    name: 'Budget (2-3 Star)',
    description: 'Clean, comfortable guesthouses & budget hotels',
    pricePerNight: {
      single: 25,
      double: 35,
      triple: 45,
      family: 55,
    },
    includes: ['Breakfast', 'AC Room', 'WiFi'],
    sampleHotels: ['Local Guesthouses', 'Budget Hotels'],
  },
  standard: {
    id: 'standard',
    name: 'Standard (3-4 Star)',
    description: 'Quality hotels with good amenities',
    pricePerNight: {
      single: 50,
      double: 65,
      triple: 80,
      family: 95,
    },
    includes: ['Breakfast', 'AC Room', 'WiFi', 'Pool Access'],
    sampleHotels: ['Cinnamon Hotels', 'Jetwing', 'Amaya'],
  },
  superior: {
    id: 'superior',
    name: 'Superior (4-5 Star)',
    description: 'Premium hotels & boutique properties',
    pricePerNight: {
      single: 100,
      double: 130,
      triple: 160,
      family: 180,
    },
    includes: ['Breakfast', 'AC Room', 'WiFi', 'Pool', 'Gym', 'Spa Access'],
    sampleHotels: ['Heritance', 'Shangri-La', 'Anantara'],
  },
  luxury: {
    id: 'luxury',
    name: 'Luxury (5 Star Deluxe)',
    description: 'Ultra-luxury resorts & villas',
    pricePerNight: {
      single: 200,
      double: 280,
      triple: 350,
      family: 400,
    },
    includes: ['All Meals Option', 'Butler Service', 'Airport Lounge', 'Private Pool'],
    sampleHotels: ['Aman Resorts', 'Wild Coast Tented Lodge', 'Cape Weligama'],
  },
};

// ============================================
// DESTINATIONS
// ============================================
export const DESTINATIONS: Record<string, Destination> = {
  sigiriya: {
    id: 'sigiriya',
    name: 'Sigiriya (Lion Rock)',
    region: 'Cultural Triangle',
    distanceFromColombo: 170,
    entranceFee: { adult: 30, child: 15 },
    suggestedDuration: 0.5,
    highlights: ['Ancient Fortress', 'Frescoes', 'Mirror Wall'],
    icon: '🏔️',
  },
  dambulla: {
    id: 'dambulla',
    name: 'Dambulla Cave Temple',
    region: 'Cultural Triangle',
    distanceFromColombo: 150,
    entranceFee: { adult: 15, child: 8 },
    suggestedDuration: 0.25,
    highlights: ['Cave Paintings', 'Buddha Statues', 'UNESCO Site'],
    icon: '🛕',
  },
  polonnaruwa: {
    id: 'polonnaruwa',
    name: 'Polonnaruwa Ancient City',
    region: 'Cultural Triangle',
    distanceFromColombo: 215,
    entranceFee: { adult: 25, child: 12 },
    suggestedDuration: 0.5,
    highlights: ['Ancient Ruins', 'Gal Vihara', 'Royal Palace'],
    icon: '🏛️',
  },
  anuradhapura: {
    id: 'anuradhapura',
    name: 'Anuradhapura Sacred City',
    region: 'Cultural Triangle',
    distanceFromColombo: 200,
    entranceFee: { adult: 25, child: 12 },
    suggestedDuration: 0.5,
    highlights: ['Sri Maha Bodhi', 'Stupas', 'Ancient Monasteries'],
    icon: '🕌',
  },
  kandy: {
    id: 'kandy',
    name: 'Kandy',
    region: 'Hill Country',
    distanceFromColombo: 120,
    entranceFee: { adult: 15, child: 8 },
    suggestedDuration: 1,
    highlights: ['Temple of Tooth', 'Kandy Lake', 'Cultural Show'],
    icon: '🏔️',
  },
  nuwaraEliya: {
    id: 'nuwaraEliya',
    name: 'Nuwara Eliya',
    region: 'Hill Country',
    distanceFromColombo: 180,
    entranceFee: { adult: 0, child: 0 },
    suggestedDuration: 1,
    highlights: ['Tea Plantations', 'Cool Climate', 'Victoria Park'],
    icon: '🍵',
  },
  ella: {
    id: 'ella',
    name: 'Ella',
    region: 'Hill Country',
    distanceFromColombo: 200,
    entranceFee: { adult: 0, child: 0 },
    suggestedDuration: 1.5,
    highlights: ['Nine Arch Bridge', 'Little Adams Peak', 'Train Ride'],
    icon: '🚂',
  },
  yala: {
    id: 'yala',
    name: 'Yala National Park',
    region: 'South Coast',
    distanceFromColombo: 305,
    entranceFee: { adult: 0, child: 0 },
    suggestedDuration: 1,
    highlights: ['Leopards', 'Elephants', 'Safari Experience'],
    icon: '🐆',
  },
  udawalawe: {
    id: 'udawalawe',
    name: 'Udawalawe National Park',
    region: 'South',
    distanceFromColombo: 170,
    entranceFee: { adult: 0, child: 0 },
    suggestedDuration: 0.5,
    highlights: ['Elephant Herds', 'Bird Watching', 'Scenic Views'],
    icon: '🐘',
  },
  minneriya: {
    id: 'minneriya',
    name: 'Minneriya National Park',
    region: 'Cultural Triangle',
    distanceFromColombo: 180,
    entranceFee: { adult: 0, child: 0 },
    suggestedDuration: 0.5,
    highlights: ['Elephant Gathering', 'Bird Watching'],
    icon: '🐘',
  },
  wilpattu: {
    id: 'wilpattu',
    name: 'Wilpattu National Park',
    region: 'North West',
    distanceFromColombo: 180,
    entranceFee: { adult: 0, child: 0 },
    suggestedDuration: 1,
    highlights: ['Leopards', 'Lakes', 'Less Crowded'],
    icon: '🐆',
  },
  sinharaja: {
    id: 'sinharaja',
    name: 'Sinharaja Rainforest',
    region: 'South',
    distanceFromColombo: 150,
    entranceFee: { adult: 20, child: 10 },
    suggestedDuration: 1,
    highlights: ['Rainforest Trek', 'Endemic Birds', 'UNESCO Site'],
    icon: '🌴',
  },
  mirissa: {
    id: 'mirissa',
    name: 'Mirissa',
    region: 'South Coast',
    distanceFromColombo: 150,
    entranceFee: { adult: 0, child: 0 },
    suggestedDuration: 2,
    highlights: ['Beach', 'Whale Watching', 'Surfing'],
    icon: '🏖️',
  },
  unawatuna: {
    id: 'unawatuna',
    name: 'Unawatuna',
    region: 'South Coast',
    distanceFromColombo: 130,
    entranceFee: { adult: 0, child: 0 },
    suggestedDuration: 2,
    highlights: ['Beach', 'Snorkeling', 'Nightlife'],
    icon: '🏖️',
  },
  bentota: {
    id: 'bentota',
    name: 'Bentota',
    region: 'West Coast',
    distanceFromColombo: 65,
    entranceFee: { adult: 0, child: 0 },
    suggestedDuration: 2,
    highlights: ['Beach', 'Water Sports', 'River Safari'],
    icon: '🏖️',
  },
  arugamBay: {
    id: 'arugamBay',
    name: 'Arugam Bay',
    region: 'East Coast',
    distanceFromColombo: 320,
    entranceFee: { adult: 0, child: 0 },
    suggestedDuration: 3,
    highlights: ['Surfing', 'Lagoons', 'Beach Vibes'],
    icon: '🏄',
  },
  trincomalee: {
    id: 'trincomalee',
    name: 'Trincomalee',
    region: 'East Coast',
    distanceFromColombo: 260,
    entranceFee: { adult: 0, child: 0 },
    suggestedDuration: 2,
    highlights: ['Pigeon Island', 'Whale Watching', 'Beaches'],
    icon: '🐋',
  },
  galle: {
    id: 'galle',
    name: 'Galle Fort',
    region: 'South Coast',
    distanceFromColombo: 130,
    entranceFee: { adult: 0, child: 0 },
    suggestedDuration: 0.5,
    highlights: ['Dutch Fort', 'Colonial Architecture', 'Shopping'],
    icon: '🏰',
  },
  pinnawala: {
    id: 'pinnawala',
    name: 'Pinnawala Elephant Orphanage',
    region: 'Central',
    distanceFromColombo: 90,
    entranceFee: { adult: 25, child: 13 },
    suggestedDuration: 0.25,
    highlights: ['Elephant Bathing', 'Feeding Time'],
    icon: '🐘',
  },
  colombo: {
    id: 'colombo',
    name: 'Colombo City',
    region: 'Western',
    distanceFromColombo: 0,
    entranceFee: { adult: 0, child: 0 },
    suggestedDuration: 1,
    highlights: ['City Tour', 'Shopping', 'Restaurants'],
    icon: '🌆',
  },
  jaffna: {
    id: 'jaffna',
    name: 'Jaffna',
    region: 'Northern',
    distanceFromColombo: 400,
    entranceFee: { adult: 0, child: 0 },
    suggestedDuration: 2,
    highlights: ['Tamil Culture', 'Nallur Temple', 'Islands'],
    icon: '🛕',
  },
};

// ============================================
// ACTIVITIES & EXPERIENCES
// ============================================
export const ACTIVITIES: Record<string, Activity> = {
  yalaSafari: {
    id: 'yalaSafari',
    name: 'Yala Safari (Half Day)',
    category: 'safari',
    pricePerPerson: 45,
    duration: '4-5 hours',
    includes: ['Jeep', 'Driver', 'Park Entry', 'Water'],
    maxPerJeep: 6,
    destination: 'yala',
  },
  yalaSafariFull: {
    id: 'yalaSafariFull',
    name: 'Yala Safari (Full Day)',
    category: 'safari',
    pricePerPerson: 75,
    duration: '8-10 hours',
    includes: ['Jeep', 'Driver', 'Park Entry', 'Lunch', 'Water'],
    maxPerJeep: 6,
    destination: 'yala',
  },
  udawalaweSafari: {
    id: 'udawalaweSafari',
    name: 'Udawalawe Safari',
    category: 'safari',
    pricePerPerson: 40,
    duration: '4 hours',
    includes: ['Jeep', 'Driver', 'Park Entry'],
    maxPerJeep: 6,
    destination: 'udawalawe',
  },
  minneriyaSafari: {
    id: 'minneriyaSafari',
    name: 'Minneriya Safari',
    category: 'safari',
    pricePerPerson: 40,
    duration: '4 hours',
    includes: ['Jeep', 'Driver', 'Park Entry'],
    maxPerJeep: 6,
    destination: 'minneriya',
  },
  wilpattuSafari: {
    id: 'wilpattuSafari',
    name: 'Wilpattu Safari (Full Day)',
    category: 'safari',
    pricePerPerson: 65,
    duration: '8 hours',
    includes: ['Jeep', 'Driver', 'Park Entry', 'Lunch'],
    maxPerJeep: 6,
    destination: 'wilpattu',
  },
  whaleWatchingMirissa: {
    id: 'whaleWatchingMirissa',
    name: 'Whale Watching (Mirissa)',
    category: 'water',
    pricePerPerson: 55,
    duration: '5-6 hours',
    includes: ['Boat Trip', 'Breakfast', 'Snacks'],
    seasonBest: [11, 12, 1, 2, 3, 4],
    destination: 'mirissa',
  },
  whaleWatchingTrinco: {
    id: 'whaleWatchingTrinco',
    name: 'Whale Watching (Trincomalee)',
    category: 'water',
    pricePerPerson: 50,
    duration: '5-6 hours',
    includes: ['Boat Trip', 'Snacks'],
    seasonBest: [5, 6, 7, 8, 9],
    destination: 'trincomalee',
  },
  snorkeling: {
    id: 'snorkeling',
    name: 'Snorkeling Trip',
    category: 'water',
    pricePerPerson: 25,
    duration: '2-3 hours',
    includes: ['Equipment', 'Boat', 'Guide'],
    destination: 'various',
  },
  divingCourse: {
    id: 'divingCourse',
    name: 'PADI Open Water Course',
    category: 'water',
    pricePerPerson: 350,
    duration: '3-4 days',
    includes: ['Certification', 'Equipment', 'Instructor'],
    destination: 'various',
  },
  surfingLesson: {
    id: 'surfingLesson',
    name: 'Surfing Lesson',
    category: 'water',
    pricePerPerson: 30,
    duration: '2 hours',
    includes: ['Board', 'Instructor'],
    destination: 'arugamBay',
  },
  whitewaterRafting: {
    id: 'whitewaterRafting',
    name: 'Whitewater Rafting (Kitulgala)',
    category: 'adventure',
    pricePerPerson: 40,
    duration: '3-4 hours',
    includes: ['Equipment', 'Guide', 'Safety Gear'],
  },
  hotAirBalloon: {
    id: 'hotAirBalloon',
    name: 'Hot Air Balloon (Sigiriya)',
    category: 'adventure',
    pricePerPerson: 220,
    duration: '1 hour flight',
    includes: ['Flight', 'Champagne Breakfast'],
    destination: 'sigiriya',
  },
  zipline: {
    id: 'zipline',
    name: 'Flying Ravana Zipline',
    category: 'adventure',
    pricePerPerson: 45,
    duration: '30 mins',
    includes: ['Equipment', 'Guide'],
    destination: 'ella',
  },
  cookingClass: {
    id: 'cookingClass',
    name: 'Sri Lankan Cooking Class',
    category: 'cultural',
    pricePerPerson: 35,
    duration: '3-4 hours',
    includes: ['Ingredients', 'Recipe Book', 'Meal'],
  },
  kandyDance: {
    id: 'kandyDance',
    name: 'Kandy Cultural Dance Show',
    category: 'cultural',
    pricePerPerson: 12,
    duration: '1 hour',
    includes: ['Show Entry'],
    destination: 'kandy',
  },
  teaFactory: {
    id: 'teaFactory',
    name: 'Tea Factory Visit',
    category: 'cultural',
    pricePerPerson: 8,
    duration: '1-2 hours',
    includes: ['Tour', 'Tea Tasting'],
    destination: 'nuwaraEliya',
  },
  ayurvedaSpa: {
    id: 'ayurvedaSpa',
    name: 'Ayurveda Spa Treatment',
    category: 'wellness',
    pricePerPerson: 60,
    duration: '2-3 hours',
    includes: ['Massage', 'Herbal Bath'],
  },
  ellaTrainRide: {
    id: 'ellaTrainRide',
    name: 'Scenic Train Ride (Kandy-Ella)',
    category: 'experience',
    pricePerPerson: {
      firstClass: 15,
      secondClass: 8,
      thirdClass: 3,
    },
    duration: '6-7 hours',
    includes: ['Train Ticket'],
    note: 'First class requires advance booking',
  },
  villageTour: {
    id: 'villageTour',
    name: 'Village Experience',
    category: 'cultural',
    pricePerPerson: 25,
    duration: '3-4 hours',
    includes: ['Ox Cart Ride', 'Catamaran', 'Village Lunch'],
  },
};

// ============================================
// ADDITIONAL SERVICES
// ============================================
export const ADDITIONAL_SERVICES: Record<string, AdditionalService> = {
  airportPickup: {
    id: 'airportPickup',
    name: 'Airport Pickup (Colombo)',
    price: 35,
    description: 'Meet & greet with name board, AC vehicle',
  },
  airportDropoff: {
    id: 'airportDropoff',
    name: 'Airport Drop-off (Colombo)',
    price: 35,
    description: 'Drop to airport with sufficient buffer time',
  },
  simCard: {
    id: 'simCard',
    name: 'Tourist SIM Card (Dialog/Mobitel)',
    price: 10,
    description: 'Activated SIM with data package',
  },
  guide: {
    id: 'guide',
    name: 'Licensed English Guide',
    pricePerDay: 45,
    description: 'Professional tour guide (other languages +$10/day)',
  },
  guideMultilingual: {
    id: 'guideMultilingual',
    name: 'Multilingual Guide',
    pricePerDay: 55,
    languages: ['German', 'French', 'Spanish', 'Italian', 'Japanese', 'Chinese'],
    description: 'Guide fluent in multiple languages',
  },
  photographer: {
    id: 'photographer',
    name: 'Professional Photographer',
    pricePerDay: 120,
    description: 'Edited photos delivered digitally',
  },
  dronePhotography: {
    id: 'dronePhotography',
    name: 'Drone Photography Package',
    price: 200,
    description: 'Aerial photos & video at key locations',
  },
  privateChef: {
    id: 'privateChef',
    name: 'Private Chef (Special Dietary)',
    pricePerDay: 80,
    description: 'For vegan, halal, kosher, or medical diets',
  },
  childSeat: {
    id: 'childSeat',
    name: 'Child Car Seat',
    price: 5,
    description: 'Per day rental',
  },
  wifi: {
    id: 'wifi',
    name: 'Portable WiFi Device',
    pricePerDay: 8,
    description: 'Unlimited 4G data, shareable',
  },
};

// ============================================
// DISCOUNTS
// ============================================
export const DISCOUNTS = {
  childAge: {
    free: 2,
    half: 12,
  },
  group: {
    6: 0.05,
    10: 0.08,
    15: 0.10,
  } as Record<number, number>,
  earlyBird: {
    daysInAdvance: 60,
    discount: 0.05,
  },
  returning: {
    discount: 0.05,
  },
  longStay: {
    daysMin: 14,
    discount: 0.05,
  },
};

// ============================================
// PAYMENT TERMS
// ============================================
export const PAYMENT_TERMS = {
  depositPercentage: 0.20,
  balanceDueDays: 30,
  cancellationPolicy: {
    fullRefund: 30,
    fiftyPercent: 14,
    noRefund: 7,
  },
};

// ============================================
// ROUTE DISTANCES (km between destinations)
// ============================================
export const ROUTE_DISTANCES: Record<string, number> = {
  colombo_sigiriya: 170,
  colombo_kandy: 120,
  colombo_galle: 130,
  colombo_yala: 305,
  colombo_ella: 200,
  colombo_trincomalee: 260,
  colombo_jaffna: 400,
  colombo_arugamBay: 320,
  colombo_nuwaraEliya: 180,
  colombo_bentota: 65,
  colombo_mirissa: 150,
  colombo_anuradhapura: 200,
  sigiriya_kandy: 85,
  sigiriya_polonnaruwa: 60,
  sigiriya_anuradhapura: 80,
  sigiriya_dambulla: 20,
  sigiriya_trincomalee: 110,
  kandy_nuwaraEliya: 80,
  kandy_ella: 140,
  kandy_sigiriya: 85,
  kandy_anuradhapura: 140,
  nuwaraEliya_ella: 65,
  nuwaraEliya_yala: 165,
  ella_yala: 100,
  ella_mirissa: 130,
  ella_arugamBay: 130,
  galle_mirissa: 25,
  galle_yala: 175,
  galle_colombo: 130,
  mirissa_yala: 150,
  yala_arugamBay: 140,
  anuradhapura_jaffna: 200,
  anuradhapura_trincomalee: 110,
  trincomalee_arugamBay: 180,
};

// Helper to get distance between two destinations
export const getDistance = (from: string, to: string): number => {
  const key1 = `${from}_${to}`;
  const key2 = `${to}_${from}`;
  return ROUTE_DISTANCES[key1] || ROUTE_DISTANCES[key2] || 0;
};
