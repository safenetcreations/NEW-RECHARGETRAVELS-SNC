/**
 * LOCAL ENTITY DATA - CORE 30 METHOD
 * 
 * Strategy 10: Write Detailed Content for Local Entity Relevance
 * 
 * This file defines the 30 core Sri Lanka locations and their service
 * offerings for comprehensive local AI visibility.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// LOCATION INTERFACE
// ═══════════════════════════════════════════════════════════════════════════════

export interface LocalEntity {
  id: string;
  name: string;
  slug: string;
  tier: 1 | 2 | 3;
  region: 'Western' | 'Central' | 'Southern' | 'Northern' | 'Eastern' | 'North Central' | 'Uva' | 'Sabaragamuwa' | 'North Western';
  coordinates: {
    latitude: number;
    longitude: number;
  };
  description: string;
  highlights: string[];
  bestFor: string[];
  bestTimeToVisit: string;
  averageStay: string;
  nearbyAttractions: string[];
  services: {
    tours: boolean;
    hotels: boolean;
    transport: boolean;
    experiences: boolean;
    restaurants: boolean;
  };
  transportConnections: {
    fromAirport: string;
    nearestAirport: string;
    trainStation?: string;
  };
  schema: {
    type: string;
    touristTypes: string[];
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// TIER 1 - MAJOR DESTINATIONS (10)
// ═══════════════════════════════════════════════════════════════════════════════

export const TIER_1_LOCATIONS: LocalEntity[] = [
  {
    id: "colombo",
    name: "Colombo",
    slug: "colombo",
    tier: 1,
    region: "Western",
    coordinates: { latitude: 6.9271, longitude: 79.8612 },
    description: "Sri Lanka's vibrant commercial capital, blending colonial heritage with modern urban energy. Home to shopping malls, colonial buildings, temples, and diverse cuisine.",
    highlights: [
      "Gangaramaya Temple",
      "Galle Face Green",
      "Independence Square",
      "Dutch Hospital Shopping Precinct",
      "Pettah Markets"
    ],
    bestFor: ["City exploration", "Shopping", "Dining", "Business travel", "Gateway city"],
    bestTimeToVisit: "Year-round, but November to April for best weather",
    averageStay: "1-2 days",
    nearbyAttractions: ["Negombo", "Mount Lavinia", "Kelaniya Temple"],
    services: { tours: true, hotels: true, transport: true, experiences: true, restaurants: true },
    transportConnections: {
      fromAirport: "30-40 minutes from BIA (35km)",
      nearestAirport: "Bandaranaike International Airport (CMB)"
    },
    schema: {
      type: "City",
      touristTypes: ["Business Traveler", "City Explorer", "Foodie"]
    }
  },
  {
    id: "kandy",
    name: "Kandy",
    slug: "kandy",
    tier: 1,
    region: "Central",
    coordinates: { latitude: 7.2906, longitude: 80.6337 },
    description: "The cultural capital of Sri Lanka and home to the sacred Temple of the Tooth Relic. A UNESCO World Heritage city surrounded by misty hills and the iconic Kandy Lake.",
    highlights: [
      "Temple of the Sacred Tooth Relic",
      "Kandy Lake",
      "Royal Botanical Gardens, Peradeniya",
      "Kandyan Dance Performances",
      "Bahiravokanda Buddha Statue"
    ],
    bestFor: ["Cultural heritage", "Buddhist pilgrimage", "Botanical interest", "Traditional arts"],
    bestTimeToVisit: "January to April, July to August",
    averageStay: "2-3 days",
    nearbyAttractions: ["Pinnawala Elephant Orphanage", "Dambulla", "Sigiriya"],
    services: { tours: true, hotels: true, transport: true, experiences: true, restaurants: true },
    transportConnections: {
      fromAirport: "3-4 hours from BIA (115km)",
      nearestAirport: "Bandaranaike International Airport (CMB)",
      trainStation: "Kandy Railway Station"
    },
    schema: {
      type: "TouristDestination",
      touristTypes: ["Cultural Tourist", "Pilgrim", "Nature Lover"]
    }
  },
  {
    id: "galle",
    name: "Galle",
    slug: "galle",
    tier: 1,
    region: "Southern",
    coordinates: { latitude: 6.0535, longitude: 80.2210 },
    description: "A UNESCO World Heritage coastal city famous for its well-preserved Dutch Fort. Galle blends colonial architecture with boutique shops, cafes, and stunning ocean views.",
    highlights: [
      "Galle Fort (UNESCO)",
      "Dutch Reformed Church",
      "Galle Lighthouse",
      "Maritime Museum",
      "Boutique shopping streets"
    ],
    bestFor: ["History", "Architecture", "Boutique shopping", "Sunset views", "Food scene"],
    bestTimeToVisit: "December to April",
    averageStay: "1-2 days",
    nearbyAttractions: ["Unawatuna", "Jungle Beach", "Mirissa", "Hikkaduwa"],
    services: { tours: true, hotels: true, transport: true, experiences: true, restaurants: true },
    transportConnections: {
      fromAirport: "2.5-3 hours from BIA (155km)",
      nearestAirport: "Mattala Rajapaksa Airport or BIA",
      trainStation: "Galle Railway Station"
    },
    schema: {
      type: "TouristDestination",
      touristTypes: ["History Buff", "Architecture Lover", "Beach Lover"]
    }
  },
  {
    id: "sigiriya",
    name: "Sigiriya",
    slug: "sigiriya",
    tier: 1,
    region: "North Central",
    coordinates: { latitude: 7.9570, longitude: 80.7603 },
    description: "The iconic Lion Rock fortress, a UNESCO World Heritage Site and ancient palace ruins. One of the best-preserved examples of ancient urban planning in Asia.",
    highlights: [
      "Sigiriya Rock Fortress",
      "Mirror Wall",
      "Ancient Frescoes",
      "Water Gardens",
      "Pidurangala Rock"
    ],
    bestFor: ["Ancient history", "Adventure climbing", "Photography", "Archaeology"],
    bestTimeToVisit: "January to April for dry weather",
    averageStay: "1-2 days",
    nearbyAttractions: ["Dambulla Cave Temple", "Polonnaruwa", "Minneriya National Park"],
    services: { tours: true, hotels: true, transport: true, experiences: true, restaurants: true },
    transportConnections: {
      fromAirport: "4-5 hours from BIA (170km)",
      nearestAirport: "Bandaranaike International Airport (CMB)"
    },
    schema: {
      type: "TouristDestination",
      touristTypes: ["History Buff", "Adventure Traveler", "Photographer"]
    }
  },
  {
    id: "ella",
    name: "Ella",
    slug: "ella",
    tier: 1,
    region: "Uva",
    coordinates: { latitude: 6.8667, longitude: 81.0466 },
    description: "A laid-back hill town famous for stunning mountain views, the Nine Arch Bridge, and some of Sri Lanka's best hiking. The endpoint of the famous scenic train journey.",
    highlights: [
      "Nine Arch Bridge",
      "Little Adam's Peak",
      "Ella Rock",
      "Ravana Falls",
      "Scenic Train Journey from Kandy"
    ],
    bestFor: ["Hiking", "Scenic views", "Backpacker culture", "Photography", "Train journey"],
    bestTimeToVisit: "January to March for clearest views",
    averageStay: "2-3 days",
    nearbyAttractions: ["Udawalawe National Park", "Badulla", "Haputale"],
    services: { tours: true, hotels: true, transport: true, experiences: true, restaurants: true },
    transportConnections: {
      fromAirport: "6-7 hours from BIA (230km)",
      nearestAirport: "Bandaranaike International Airport (CMB)",
      trainStation: "Ella Railway Station"
    },
    schema: {
      type: "TouristDestination",
      touristTypes: ["Backpacker", "Hiker", "Nature Lover"]
    }
  },
  {
    id: "nuwara-eliya",
    name: "Nuwara Eliya",
    slug: "nuwara-eliya",
    tier: 1,
    region: "Central",
    coordinates: { latitude: 6.9497, longitude: 80.7891 },
    description: "Known as 'Little England', this hill station offers cool climate, colonial architecture, tea plantations, and strawberry farms. The heart of Ceylon tea country.",
    highlights: [
      "Tea Factory Tours",
      "Gregory Lake",
      "Victoria Park",
      "Horton Plains Day Trip",
      "Hakgala Botanical Gardens"
    ],
    bestFor: ["Tea tourism", "Cool climate escape", "Colonial heritage", "Nature walks"],
    bestTimeToVisit: "January to April (avoid April crowds)",
    averageStay: "2-3 days",
    nearbyAttractions: ["Horton Plains", "World's End", "Ella", "Adam's Peak"],
    services: { tours: true, hotels: true, transport: true, experiences: true, restaurants: true },
    transportConnections: {
      fromAirport: "5-6 hours from BIA (180km)",
      nearestAirport: "Bandaranaike International Airport (CMB)",
      trainStation: "Nanu Oya Railway Station (8km away)"
    },
    schema: {
      type: "TouristDestination",
      touristTypes: ["Tea Enthusiast", "Nature Lover", "Romantic Traveler"]
    }
  },
  {
    id: "negombo",
    name: "Negombo",
    slug: "negombo",
    tier: 1,
    region: "Western",
    coordinates: { latitude: 7.2094, longitude: 79.8358 },
    description: "A laid-back beach town just 10 minutes from the airport. Famous for its fish market, Dutch canal, and long sandy beach. Perfect for first/last night stays.",
    highlights: [
      "Negombo Beach",
      "Dutch Canal",
      "Fish Market (Lellama)",
      "St. Mary's Church",
      "Lagoon boat trips"
    ],
    bestFor: ["Airport proximity", "Beach relaxation", "Seafood", "First/last night stay"],
    bestTimeToVisit: "November to April",
    averageStay: "1-2 days",
    nearbyAttractions: ["Colombo", "Kalpitiya", "Wilpattu National Park"],
    services: { tours: true, hotels: true, transport: true, experiences: true, restaurants: true },
    transportConnections: {
      fromAirport: "10-15 minutes from BIA (10km)",
      nearestAirport: "Bandaranaike International Airport (CMB)"
    },
    schema: {
      type: "TouristDestination",
      touristTypes: ["Beach Lover", "Transit Traveler", "Seafood Lover"]
    }
  },
  {
    id: "mirissa",
    name: "Mirissa",
    slug: "mirissa",
    tier: 1,
    region: "Southern",
    coordinates: { latitude: 5.9485, longitude: 80.4718 },
    description: "The whale watching capital of Sri Lanka and a beautiful beach destination. A palm-lined crescent beach with excellent surfing and laid-back vibes.",
    highlights: [
      "Blue Whale Watching",
      "Mirissa Beach",
      "Coconut Tree Hill",
      "Secret Beach",
      "Surfing"
    ],
    bestFor: ["Whale watching", "Beach holiday", "Surfing", "Backpacker scene"],
    bestTimeToVisit: "November to April (whale season)",
    averageStay: "2-4 days",
    nearbyAttractions: ["Galle", "Weligama", "Unawatuna", "Tangalle"],
    services: { tours: true, hotels: true, transport: true, experiences: true, restaurants: true },
    transportConnections: {
      fromAirport: "3-4 hours from BIA (175km)",
      nearestAirport: "Mattala Rajapaksa Airport (closer) or BIA"
    },
    schema: {
      type: "TouristDestination",
      touristTypes: ["Beach Lover", "Wildlife Enthusiast", "Surfer"]
    }
  },
  {
    id: "trincomalee",
    name: "Trincomalee",
    slug: "trincomalee",
    tier: 1,
    region: "Eastern",
    coordinates: { latitude: 8.5874, longitude: 81.2152 },
    description: "Sri Lanka's east coast gem with stunning beaches, whale watching, and Hindu temples. Features one of the world's finest natural harbors.",
    highlights: [
      "Nilaveli Beach",
      "Pigeon Island (snorkeling)",
      "Koneswaram Temple",
      "Whale Watching (May-Oct)",
      "Fort Frederick"
    ],
    bestFor: ["East coast beaches", "Snorkeling", "Hindu heritage", "Off-season whale watching"],
    bestTimeToVisit: "April to September (east coast dry season)",
    averageStay: "2-4 days",
    nearbyAttractions: ["Pasikudah", "Sigiriya", "Anuradhapura"],
    services: { tours: true, hotels: true, transport: true, experiences: true, restaurants: true },
    transportConnections: {
      fromAirport: "5-6 hours from BIA (260km)",
      nearestAirport: "Bandaranaike International Airport (CMB)"
    },
    schema: {
      type: "TouristDestination",
      touristTypes: ["Beach Lover", "Snorkeler", "Hindu Pilgrim"]
    }
  },
  {
    id: "jaffna",
    name: "Jaffna",
    slug: "jaffna",
    tier: 1,
    region: "Northern",
    coordinates: { latitude: 9.6615, longitude: 80.0255 },
    description: "The cultural capital of Tamil Sri Lanka, recently opened to tourism. Discover unique Hindu temples, palm-fringed islands, and distinct cuisine.",
    highlights: [
      "Jaffna Fort",
      "Nallur Kandaswamy Temple",
      "Jaffna Public Library",
      "Nagadeepa Island",
      "Casuarina Beach"
    ],
    bestFor: ["Tamil culture", "Hindu temples", "Off-the-beaten-path", "Unique cuisine"],
    bestTimeToVisit: "January to September (avoid October-December monsoon)",
    averageStay: "2-3 days",
    nearbyAttractions: ["Point Pedro", "Delft Island", "Keerimalai Springs"],
    services: { tours: true, hotels: true, transport: true, experiences: true, restaurants: true },
    transportConnections: {
      fromAirport: "1 hour from Palaly Airport, 7-8 hours from BIA",
      nearestAirport: "Jaffna International Airport (JAF/Palaly)"
    },
    schema: {
      type: "TouristDestination",
      touristTypes: ["Cultural Explorer", "Hindu Pilgrim", "Adventure Traveler"]
    }
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// TIER 2 - SECONDARY DESTINATIONS (10)
// ═══════════════════════════════════════════════════════════════════════════════

export const TIER_2_LOCATIONS: LocalEntity[] = [
  {
    id: "bentota",
    name: "Bentota",
    slug: "bentota",
    tier: 2,
    region: "Southern",
    coordinates: { latitude: 6.4210, longitude: 79.9977 },
    description: "A pristine beach resort town known for water sports, river safaris, and luxury hotels. The gateway to Sri Lanka's southern beaches.",
    highlights: ["Bentota Beach", "Madu River Safari", "Brief Garden", "Water Sports", "Turtle Hatchery"],
    bestFor: ["Beach resort", "Water sports", "Honeymoon", "River safari"],
    bestTimeToVisit: "November to April",
    averageStay: "2-4 days",
    nearbyAttractions: ["Hikkaduwa", "Galle", "Kosgoda Turtle Hatchery"],
    services: { tours: true, hotels: true, transport: true, experiences: true, restaurants: true },
    transportConnections: { fromAirport: "1.5-2 hours from BIA (90km)", nearestAirport: "BIA" },
    schema: { type: "TouristDestination", touristTypes: ["Beach Lover", "Honeymooner", "Water Sports Enthusiast"] }
  },
  {
    id: "hikkaduwa",
    name: "Hikkaduwa",
    slug: "hikkaduwa",
    tier: 2,
    region: "Southern",
    coordinates: { latitude: 6.1395, longitude: 80.1010 },
    description: "A lively beach town famous for surfing, snorkeling, and nightlife. Home to a coral sanctuary and vibrant beach scene.",
    highlights: ["Hikkaduwa Beach", "Coral Sanctuary", "Surfing", "Sea Turtles", "Beach Nightlife"],
    bestFor: ["Surfing", "Snorkeling", "Nightlife", "Budget beach holiday"],
    bestTimeToVisit: "November to April",
    averageStay: "2-4 days",
    nearbyAttractions: ["Galle", "Unawatuna", "Bentota"],
    services: { tours: true, hotels: true, transport: true, experiences: true, restaurants: true },
    transportConnections: { fromAirport: "2-2.5 hours from BIA (115km)", nearestAirport: "BIA" },
    schema: { type: "TouristDestination", touristTypes: ["Surfer", "Backpacker", "Snorkeler"] }
  },
  {
    id: "arugam-bay",
    name: "Arugam Bay",
    slug: "arugam-bay",
    tier: 2,
    region: "Eastern",
    coordinates: { latitude: 6.8406, longitude: 81.8369 },
    description: "World-famous surf destination on the east coast. A laid-back beach village with consistent waves and bohemian atmosphere.",
    highlights: ["Point Break Surfing", "Main Point", "Lagoon Safari", "Kumana National Park", "Beach Yoga"],
    bestFor: ["Surfing", "Backpacking", "Yoga retreats", "Wildlife"],
    bestTimeToVisit: "April to October (surf season)",
    averageStay: "3-7 days",
    nearbyAttractions: ["Kumana National Park", "Panama", "Pottuvil"],
    services: { tours: true, hotels: true, transport: true, experiences: true, restaurants: true },
    transportConnections: { fromAirport: "7-8 hours from BIA (320km)", nearestAirport: "BIA" },
    schema: { type: "TouristDestination", touristTypes: ["Surfer", "Backpacker", "Yoga Enthusiast"] }
  },
  {
    id: "dambulla",
    name: "Dambulla",
    slug: "dambulla",
    tier: 2,
    region: "Central",
    coordinates: { latitude: 7.8731, longitude: 80.6517 },
    description: "Home to the magnificent cave temple complex with ancient Buddhist murals and statues. A UNESCO World Heritage Site and gateway to the Cultural Triangle.",
    highlights: ["Cave Temple (UNESCO)", "Golden Temple", "Dambulla Museum", "Wholesale Vegetable Market", "Iron Wood Forest"],
    bestFor: ["Buddhist heritage", "Cave art", "Cultural Triangle base"],
    bestTimeToVisit: "January to April",
    averageStay: "Half day to 1 day",
    nearbyAttractions: ["Sigiriya", "Polonnaruwa", "Minneriya"],
    services: { tours: true, hotels: true, transport: true, experiences: true, restaurants: true },
    transportConnections: { fromAirport: "4 hours from BIA (150km)", nearestAirport: "BIA" },
    schema: { type: "TouristDestination", touristTypes: ["Buddhist Pilgrim", "History Buff", "Art Lover"] }
  },
  {
    id: "anuradhapura",
    name: "Anuradhapura",
    slug: "anuradhapura",
    tier: 2,
    region: "North Central",
    coordinates: { latitude: 8.3114, longitude: 80.4037 },
    description: "The ancient capital of Sri Lanka and a major Buddhist pilgrimage site. UNESCO World Heritage city with ruins spanning 1,000 years of civilization.",
    highlights: ["Sri Maha Bodhi", "Ruwanwelisaya Stupa", "Jetavanaramaya", "Isurumuniya", "Sacred City Ruins"],
    bestFor: ["Buddhist pilgrimage", "Ancient history", "Archaeological sites"],
    bestTimeToVisit: "February to September",
    averageStay: "1-2 days",
    nearbyAttractions: ["Mihintale", "Wilpattu", "Polonnaruwa"],
    services: { tours: true, hotels: true, transport: true, experiences: true, restaurants: true },
    transportConnections: { fromAirport: "4-5 hours from BIA (200km)", nearestAirport: "BIA" },
    schema: { type: "TouristDestination", touristTypes: ["Buddhist Pilgrim", "History Buff", "Archaeologist"] }
  },
  {
    id: "polonnaruwa",
    name: "Polonnaruwa",
    slug: "polonnaruwa",
    tier: 2,
    region: "North Central",
    coordinates: { latitude: 7.9403, longitude: 81.0188 },
    description: "The medieval capital of Sri Lanka with exceptionally well-preserved ruins. A UNESCO site best explored by bicycle.",
    highlights: ["Gal Vihara Buddha Statues", "Royal Palace", "Parakrama Samudra", "Quadrangle", "Lankathilaka"],
    bestFor: ["Cycling exploration", "Ancient ruins", "Buddhist art", "Photography"],
    bestTimeToVisit: "February to September",
    averageStay: "1 day",
    nearbyAttractions: ["Sigiriya", "Minneriya", "Kaudulla National Park"],
    services: { tours: true, hotels: true, transport: true, experiences: true, restaurants: true },
    transportConnections: { fromAirport: "5 hours from BIA (220km)", nearestAirport: "BIA" },
    schema: { type: "TouristDestination", touristTypes: ["History Buff", "Cyclist", "Photographer"] }
  },
  {
    id: "tangalle",
    name: "Tangalle",
    slug: "tangalle",
    tier: 2,
    region: "Southern",
    coordinates: { latitude: 6.0241, longitude: 80.7969 },
    description: "Unspoiled beach paradise with dramatic rocks, sea turtles, and fewer crowds. A quieter alternative to the western beaches.",
    highlights: ["Tangalle Beach", "Rekawa Turtle Watch", "Mulkirigala Rock Temple", "Hoo-maniya Blowhole", "Kalametiya Bird Sanctuary"],
    bestFor: ["Secluded beaches", "Turtle watching", "Peaceful retreat"],
    bestTimeToVisit: "November to April",
    averageStay: "2-4 days",
    nearbyAttractions: ["Mirissa", "Yala National Park", "Hambantota"],
    services: { tours: true, hotels: true, transport: true, experiences: true, restaurants: true },
    transportConnections: { fromAirport: "4 hours from BIA (200km)", nearestAirport: "Mattala Airport" },
    schema: { type: "TouristDestination", touristTypes: ["Beach Lover", "Nature Enthusiast", "Eco-Tourist"] }
  },
  {
    id: "unawatuna",
    name: "Unawatuna",
    slug: "unawatuna",
    tier: 2,
    region: "Southern",
    coordinates: { latitude: 6.0096, longitude: 80.2486 },
    description: "A horseshoe-shaped bay with calm waters, coral reef snorkeling, and a buzzing cafe scene. One of Sri Lanka's most popular beach destinations.",
    highlights: ["Unawatuna Beach", "Japanese Peace Pagoda", "Jungle Beach", "Snorkeling", "Beach Restaurants"],
    bestFor: ["Swimming", "Snorkeling", "Beach scene", "Day trips from Galle"],
    bestTimeToVisit: "November to April",
    averageStay: "2-4 days",
    nearbyAttractions: ["Galle Fort", "Mirissa", "Koggala"],
    services: { tours: true, hotels: true, transport: true, experiences: true, restaurants: true },
    transportConnections: { fromAirport: "2.5-3 hours from BIA (150km)", nearestAirport: "BIA" },
    schema: { type: "TouristDestination", touristTypes: ["Beach Lover", "Snorkeler", "Foodie"] }
  },
  {
    id: "weligama",
    name: "Weligama",
    slug: "weligama",
    tier: 2,
    region: "Southern",
    coordinates: { latitude: 5.9740, longitude: 80.4290 },
    description: "Famous for stilt fishermen and beginner-friendly surfing. A charming fishing town with consistent waves and authentic coastal life.",
    highlights: ["Stilt Fishermen", "Surfing Lessons", "Weligama Bay", "Taprobane Island", "Fish Market"],
    bestFor: ["Learn surfing", "Photography", "Authentic fishing culture"],
    bestTimeToVisit: "November to April (best surf November-March)",
    averageStay: "2-4 days",
    nearbyAttractions: ["Mirissa", "Galle", "Unawatuna"],
    services: { tours: true, hotels: true, transport: true, experiences: true, restaurants: true },
    transportConnections: { fromAirport: "3-3.5 hours from BIA (165km)", nearestAirport: "BIA" },
    schema: { type: "TouristDestination", touristTypes: ["Surfer", "Photographer", "Beach Lover"] }
  },
  {
    id: "habarana",
    name: "Habarana",
    slug: "habarana",
    tier: 2,
    region: "North Central",
    coordinates: { latitude: 8.0362, longitude: 80.7527 },
    description: "The perfect base for Cultural Triangle exploration and wildlife safaris. Central location with easy access to Sigiriya, Polonnaruwa, and national parks.",
    highlights: ["Elephant Rides", "Minneriya Safari", "Sigiriya Base", "Village Tours", "Lake Views"],
    bestFor: ["Safari base", "Cultural Triangle hub", "Village experiences"],
    bestTimeToVisit: "February to September",
    averageStay: "2-3 days",
    nearbyAttractions: ["Minneriya", "Sigiriya", "Dambulla", "Polonnaruwa"],
    services: { tours: true, hotels: true, transport: true, experiences: true, restaurants: true },
    transportConnections: { fromAirport: "4-5 hours from BIA (180km)", nearestAirport: "BIA" },
    schema: { type: "TouristDestination", touristTypes: ["Safari Enthusiast", "Cultural Tourist", "Family Traveler"] }
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// TIER 3 - EMERGING/NICHE DESTINATIONS (10)
// ═══════════════════════════════════════════════════════════════════════════════

export const TIER_3_LOCATIONS: LocalEntity[] = [
  {
    id: "adams-peak",
    name: "Adam's Peak (Sri Pada)",
    slug: "adams-peak",
    tier: 3,
    region: "Sabaragamuwa",
    coordinates: { latitude: 6.8095, longitude: 80.4994 },
    description: "Sacred mountain pilgrimage site revered by Buddhists, Hindus, Muslims, and Christians. Night climb to see the famous shadow at sunrise.",
    highlights: ["Sunrise from Summit", "Sacred Footprint", "Night Pilgrimage", "Staircase of 5,500 Steps"],
    bestFor: ["Pilgrimage", "Adventure hiking", "Spiritual experience", "Sunrise photography"],
    bestTimeToVisit: "December to May (pilgrimage season)",
    averageStay: "Overnight (night climb)",
    nearbyAttractions: ["Nuwara Eliya", "Ratnapura", "Horton Plains"],
    services: { tours: true, hotels: true, transport: true, experiences: false, restaurants: false },
    transportConnections: { fromAirport: "5 hours from BIA to Dalhousie (base)", nearestAirport: "BIA" },
    schema: { type: "TouristDestination", touristTypes: ["Pilgrim", "Hiker", "Adventure Seeker"] }
  },
  {
    id: "kalpitiya",
    name: "Kalpitiya",
    slug: "kalpitiya",
    tier: 3,
    region: "North Western",
    coordinates: { latitude: 8.2333, longitude: 79.7667 },
    description: "Premier kitesurfing destination with lagoons, dolphin watching, and pristine beaches. One of the best spots in Asia for water sports.",
    highlights: ["Kitesurfing", "Dolphin Watching", "Whale Watching (seasonal)", "Kalpitiya Lagoon", "Bar Reef"],
    bestFor: ["Kitesurfing", "Dolphin watching", "Off-the-beaten-path beaches"],
    bestTimeToVisit: "May to October (kite season), December to April (dolphins)",
    averageStay: "3-5 days",
    nearbyAttractions: ["Wilpattu National Park", "Puttalam Lagoon"],
    services: { tours: true, hotels: true, transport: true, experiences: true, restaurants: true },
    transportConnections: { fromAirport: "3-4 hours from BIA (165km)", nearestAirport: "BIA" },
    schema: { type: "TouristDestination", touristTypes: ["Kitesurfer", "Wildlife Enthusiast", "Adventure Traveler"] }
  },
  {
    id: "yala",
    name: "Yala National Park",
    slug: "yala",
    tier: 3,
    region: "Southern",
    coordinates: { latitude: 6.3698, longitude: 81.5046 },
    description: "Sri Lanka's most visited national park with the highest leopard density in the world. Diverse ecosystems from jungle to coastline.",
    highlights: ["Leopard Safari", "Elephants", "Bird Watching", "Coastal Scenery", "Ancient Ruins"],
    bestFor: ["Leopard spotting", "Wildlife photography", "Bird watching"],
    bestTimeToVisit: "February to July (dry season, park closes September-October)",
    averageStay: "1-2 days (safari)",
    nearbyAttractions: ["Tissamaharama", "Kataragama", "Tangalle"],
    services: { tours: true, hotels: true, transport: true, experiences: true, restaurants: false },
    transportConnections: { fromAirport: "5-6 hours from BIA (300km)", nearestAirport: "Mattala Airport" },
    schema: { type: "TouristDestination", touristTypes: ["Wildlife Enthusiast", "Photographer", "Safari Lover"] }
  },
  {
    id: "udawalawe",
    name: "Udawalawe National Park",
    slug: "udawalawe",
    tier: 3,
    region: "Sabaragamuwa",
    coordinates: { latitude: 6.4386, longitude: 80.8989 },
    description: "The best place in Sri Lanka to see wild elephants. Over 500 elephants roam freely, virtually guaranteeing sightings.",
    highlights: ["Elephant Safari", "Elephant Transit Home", "Reservoir Views", "Bird Watching"],
    bestFor: ["Elephant encounters", "Family safaris", "Year-round wildlife"],
    bestTimeToVisit: "Year-round (always good for elephants)",
    averageStay: "1 day (safari)",
    nearbyAttractions: ["Ella", "Yala", "Sinharaja Rainforest"],
    services: { tours: true, hotels: true, transport: true, experiences: true, restaurants: false },
    transportConnections: { fromAirport: "4-5 hours from BIA (180km)", nearestAirport: "BIA" },
    schema: { type: "TouristDestination", touristTypes: ["Wildlife Enthusiast", "Family Traveler", "Nature Lover"] }
  },
  {
    id: "wilpattu",
    name: "Wilpattu National Park",
    slug: "wilpattu",
    tier: 3,
    region: "North Western",
    coordinates: { latitude: 8.4500, longitude: 80.0167 },
    description: "Sri Lanka's largest national park, famous for its natural lakes (villus) and leopards. Less crowded alternative to Yala.",
    highlights: ["Leopard Safari", "Natural Lakes", "Sloth Bears", "Bird Watching", "Fewer Crowds"],
    bestFor: ["Off-the-beaten-path safari", "Leopards", "Less crowded wildlife viewing"],
    bestTimeToVisit: "February to October",
    averageStay: "1-2 days",
    nearbyAttractions: ["Anuradhapura", "Kalpitiya", "Mannar"],
    services: { tours: true, hotels: true, transport: true, experiences: true, restaurants: false },
    transportConnections: { fromAirport: "3-4 hours from BIA (175km)", nearestAirport: "BIA" },
    schema: { type: "TouristDestination", touristTypes: ["Wildlife Enthusiast", "Nature Lover", "Photographer"] }
  },
  {
    id: "horton-plains",
    name: "Horton Plains National Park",
    slug: "horton-plains",
    tier: 3,
    region: "Central",
    coordinates: { latitude: 6.8015, longitude: 80.8040 },
    description: "A unique highland plateau with cloud forests, endemic wildlife, and the dramatic World's End cliff drop. Best experienced at dawn.",
    highlights: ["World's End", "Baker's Falls", "Cloud Forest", "Endemic Wildlife", "Hiking Trails"],
    bestFor: ["Hiking", "Endemic species", "Dramatic scenery", "Cool climate"],
    bestTimeToVisit: "January to March (clearest views at World's End)",
    averageStay: "Half day (morning visit)",
    nearbyAttractions: ["Nuwara Eliya", "Ella", "Adam's Peak"],
    services: { tours: true, hotels: false, transport: true, experiences: true, restaurants: false },
    transportConnections: { fromAirport: "5-6 hours from BIA (200km)", nearestAirport: "BIA" },
    schema: { type: "TouristDestination", touristTypes: ["Hiker", "Nature Enthusiast", "Birdwatcher"] }
  },
  {
    id: "knuckles",
    name: "Knuckles Mountain Range",
    slug: "knuckles",
    tier: 3,
    region: "Central",
    coordinates: { latitude: 7.4333, longitude: 80.7833 },
    description: "A UNESCO World Heritage site with misty peaks, endemic species, and challenging treks. One of Sri Lanka's most biodiverse regions.",
    highlights: ["Trekking", "Waterfalls", "Endemic Flora", "Village Stays", "Mini World's End"],
    bestFor: ["Trekking", "Eco-tourism", "Adventure travel", "Endemic species"],
    bestTimeToVisit: "January to April, August to September",
    averageStay: "2-3 days",
    nearbyAttractions: ["Kandy", "Riverston", "Matale"],
    services: { tours: true, hotels: true, transport: true, experiences: true, restaurants: false },
    transportConnections: { fromAirport: "4-5 hours from BIA (150km to Kandy)", nearestAirport: "BIA" },
    schema: { type: "TouristDestination", touristTypes: ["Trekker", "Eco-Tourist", "Adventure Seeker"] }
  },
  {
    id: "batticaloa",
    name: "Batticaloa",
    slug: "batticaloa",
    tier: 3,
    region: "Eastern",
    coordinates: { latitude: 7.7310, longitude: 81.6747 },
    description: "An off-the-beaten-path east coast city famous for its singing fish phenomenon and lagoon. Authentic Tamil culture and pristine beaches.",
    highlights: ["Singing Fish", "Batticaloa Lagoon", "Kallady Beach", "Dutch Fort", "Pasikudah Beach"],
    bestFor: ["Off-the-beaten-path", "Tamil culture", "Uncrowded beaches"],
    bestTimeToVisit: "April to September",
    averageStay: "1-2 days",
    nearbyAttractions: ["Pasikudah", "Arugam Bay", "Polonnaruwa"],
    services: { tours: true, hotels: true, transport: true, experiences: true, restaurants: true },
    transportConnections: { fromAirport: "7 hours from BIA (315km)", nearestAirport: "BIA" },
    schema: { type: "TouristDestination", touristTypes: ["Cultural Explorer", "Beach Lover", "Adventure Traveler"] }
  },
  {
    id: "matara",
    name: "Matara",
    slug: "matara",
    tier: 3,
    region: "Southern",
    coordinates: { latitude: 5.9549, longitude: 80.5550 },
    description: "A historic southern city with Dutch fort ruins, beautiful beaches, and the famous Parevi Duwa island temple. Gateway to Dondra Head.",
    highlights: ["Dutch Star Fort", "Parevi Duwa Temple", "Polhena Beach", "Dondra Lighthouse", "Weherahena Temple"],
    bestFor: ["Dutch history", "Beach exploration", "Temple visits"],
    bestTimeToVisit: "November to April",
    averageStay: "1-2 days",
    nearbyAttractions: ["Mirissa", "Tangalle", "Dickwella"],
    services: { tours: true, hotels: true, transport: true, experiences: true, restaurants: true },
    transportConnections: { fromAirport: "3.5 hours from BIA (160km)", nearestAirport: "Mattala or BIA" },
    schema: { type: "TouristDestination", touristTypes: ["History Buff", "Beach Lover", "Temple Visitor"] }
  },
  {
    id: "pinnawala",
    name: "Pinnawala",
    slug: "pinnawala",
    tier: 3,
    region: "Sabaragamuwa",
    coordinates: { latitude: 7.3008, longitude: 80.3869 },
    description: "Home to the famous Elephant Orphanage where rescued elephants are cared for. Watch elephants bathe in the river and bottle-feed babies.",
    highlights: ["Elephant Orphanage", "River Bathing", "Baby Elephant Feeding", "Elephant Dung Paper Factory"],
    bestFor: ["Elephant experiences", "Family activities", "Easy day trip from Kandy"],
    bestTimeToVisit: "Year-round",
    averageStay: "Half day",
    nearbyAttractions: ["Kandy", "Dambulla", "Colombo"],
    services: { tours: true, hotels: true, transport: true, experiences: true, restaurants: true },
    transportConnections: { fromAirport: "2.5 hours from BIA (95km)", nearestAirport: "BIA" },
    schema: { type: "TouristDestination", touristTypes: ["Family Traveler", "Animal Lover", "Day Tripper"] }
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMBINED DATA
// ═══════════════════════════════════════════════════════════════════════════════

export const ALL_LOCAL_ENTITIES = [
  ...TIER_1_LOCATIONS,
  ...TIER_2_LOCATIONS,
  ...TIER_3_LOCATIONS
];

export const CORE_30_LOCATIONS = {
  tier1: TIER_1_LOCATIONS,
  tier2: TIER_2_LOCATIONS,
  tier3: TIER_3_LOCATIONS,
  all: ALL_LOCAL_ENTITIES,
  count: ALL_LOCAL_ENTITIES.length
};

// Helper functions
export function getLocationBySlug(slug: string): LocalEntity | undefined {
  return ALL_LOCAL_ENTITIES.find(loc => loc.slug === slug);
}

export function getLocationsByRegion(region: string): LocalEntity[] {
  return ALL_LOCAL_ENTITIES.filter(loc => loc.region === region);
}

export function getLocationsByTier(tier: 1 | 2 | 3): LocalEntity[] {
  return ALL_LOCAL_ENTITIES.filter(loc => loc.tier === tier);
}

export default CORE_30_LOCATIONS;

