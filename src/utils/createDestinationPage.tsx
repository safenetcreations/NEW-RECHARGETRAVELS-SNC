import React from 'react';

interface DestinationConfig {
  id: string;
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  heroImages: {
    image: string;
    title: string;
    subtitle: string;
  }[];
  attractions: {
    name: string;
    description: string;
    image: string;
    category: string;
    rating: number;
    duration: string;
    price: string;
  }[];
  activities: {
    name: string;
    description: string;
    icon: string;
    price: string;
    duration: string;
    popular?: boolean;
  }[];
  destinationInfo: {
    population: string;
    area: string;
    elevation: string;
    bestTime: string;
    language: string;
    currency: string;
  };
  weatherInfo: {
    temperature: string;
    season: string;
    rainfall: string;
  };
  accommodations: {
    name: string;
    type: string;
    price: string;
    features: string[];
  }[];
  restaurants: {
    name: string;
    cuisine: string;
    specialty: string;
    priceRange: string;
  }[];
  transportInfo: {
    fromColombo: string;
    fromAirport: string;
    localTransport: string;
  };
  tips: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const destinationConfigs: Record<string, DestinationConfig> = {
  weligama: {
    id: 'weligama',
    name: 'Weligama',
    tagline: "Beginner's Surfing Heaven",
    description: 'Weligama is a coastal town famous for beginner-friendly surfing, relaxed beaches, and stilt fishing traditions.',
    highlights: ['Surf Schools', 'Taprobane Island', 'Beach Bars', 'Local Markets', 'Stilt Fishing', 'Snake Island'],
    heroImages: [
      {
        image: "https://images.unsplash.com/photo-1539979611693-e7d7db50e4e6?auto=format&fit=crop&q=80",
        title: "Welcome to Weligama",
        subtitle: "Surf Paradise & Beach Bliss"
      },
      {
        image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80",
        title: "Perfect Waves for Beginners",
        subtitle: "Learn to Surf in Paradise"
      },
      {
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80",
        title: "Stilt Fishing Heritage",
        subtitle: "Traditional Fishing Culture"
      }
    ],
    attractions: [
      {
        name: "Weligama Bay",
        description: "Famous surf bay with consistent beginner-friendly waves and multiple surf schools",
        image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80",
        category: "Beaches",
        rating: 4.8,
        duration: "Full day",
        price: "Free"
      },
      {
        name: "Taprobane Island",
        description: "Private island with luxury villa, accessible by wading through shallow water",
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80",
        category: "Landmarks",
        rating: 4.6,
        duration: "1-2 hours",
        price: "View from beach"
      },
      {
        name: "Stilt Fishermen",
        description: "Traditional fishing method unique to Sri Lanka's southern coast",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80",
        category: "Cultural",
        rating: 4.7,
        duration: "1 hour",
        price: "Photo fee: $5"
      },
      {
        name: "Coconut Tree Hill",
        description: "Instagram-famous viewpoint with palm trees and ocean views",
        image: "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&q=80",
        category: "Viewpoints",
        rating: 4.5,
        duration: "1 hour",
        price: "Free"
      },
      {
        name: "Snake Island",
        description: "Small island accessible during low tide, great for exploration",
        image: "https://images.unsplash.com/photo-1527004760551-13e8a5e0e6c4?auto=format&fit=crop&q=80",
        category: "Nature",
        rating: 4.4,
        duration: "2 hours",
        price: "Free"
      },
      {
        name: "Mirissa Beach",
        description: "Nearby beach town, perfect for day trips and whale watching",
        image: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?auto=format&fit=crop&q=80",
        category: "Beaches",
        rating: 4.8,
        duration: "Half day",
        price: "Transport: $10"
      }
    ],
    activities: [
      {
        name: "Beginner Surf Lessons",
        description: "Professional instructors, equipment included",
        icon: "Waves",
        price: "From $25",
        duration: "2 hours",
        popular: true
      },
      {
        name: "Stilt Fishing Experience",
        description: "Try traditional fishing with local fishermen",
        icon: "Fish",
        price: "From $30",
        duration: "3 hours",
        popular: true
      },
      {
        name: "Coconut Tree Hill Sunrise",
        description: "Early morning photography tour",
        icon: "Sunrise",
        price: "From $20",
        duration: "2 hours"
      },
      {
        name: "Beach Yoga Sessions",
        description: "Morning yoga on the beach",
        icon: "Heart",
        price: "From $15",
        duration: "1.5 hours"
      },
      {
        name: "Local Market Tour",
        description: "Explore fish market and local produce",
        icon: "ShoppingBag",
        price: "From $10",
        duration: "2 hours"
      },
      {
        name: "Taprobane Island Boat Trip",
        description: "Boat tour around the private island",
        icon: "Anchor",
        price: "From $35",
        duration: "1 hour"
      }
    ],
    destinationInfo: {
      population: "22,000",
      area: "18.5 km²",
      elevation: "Sea level",
      bestTime: "November to March",
      language: "Sinhala, English",
      currency: "Sri Lankan Rupee (LKR)"
    },
    weatherInfo: {
      temperature: "27-32°C",
      season: "Dry: Nov-Mar",
      rainfall: "Low during surf season"
    },
    accommodations: [
      {
        name: "Cape Weligama",
        type: "Luxury Resort",
        price: "$400-800",
        features: ["Clifftop Location", "Infinity Pool", "Spa", "Fine Dining"]
      },
      {
        name: "Weligama Bay Resort",
        type: "Beach Resort",
        price: "$100-200",
        features: ["Beachfront", "Pool", "Restaurant", "Surf School"]
      },
      {
        name: "Soul Surf Camp",
        type: "Surf Camp",
        price: "$30-60",
        features: ["Dorms & Privates", "Surf Lessons", "Social Vibe"]
      },
      {
        name: "Ceylon Sliders",
        type: "Backpackers",
        price: "$15-40",
        features: ["Budget Friendly", "Surf Storage", "Common Kitchen"]
      }
    ],
    restaurants: [
      {
        name: "Nomad Restaurant",
        cuisine: "International & Seafood",
        specialty: "Fresh catches and smoothie bowls",
        priceRange: "$$"
      },
      {
        name: "Soul Surf Kitchen",
        cuisine: "Healthy & Fusion",
        specialty: "Post-surf fuel and vegan options",
        priceRange: "$$"
      },
      {
        name: "Mirissa Eye",
        cuisine: "Sri Lankan & Western",
        specialty: "Beachfront dining with local flavors",
        priceRange: "$"
      },
      {
        name: "Hangten Rooftop",
        cuisine: "Asian Fusion",
        specialty: "Sunset views and tapas",
        priceRange: "$$$"
      }
    ],
    transportInfo: {
      fromColombo: "Train: 3-4 hours | Car: 2.5 hours | Bus: 3.5 hours",
      fromAirport: "Car: 2.5 hours | Bus: 4 hours",
      localTransport: "Tuk-tuks, bicycles, walking"
    },
    tips: [
      "Best surf conditions early morning (6-9 AM)",
      "Coconut Tree Hill is crowded at sunset - go early",
      "Negotiate tuk-tuk prices before the ride",
      "Low tide best for Snake Island visit",
      "Many surf schools offer weekly packages",
      "Beach bars come alive after sunset",
      "Try local kottu at night markets"
    ],
    faqs: [
      {
        question: "Is Weligama good for beginner surfers?",
        answer: "Yes! Weligama Bay is one of the best places in Sri Lanka to learn surfing with gentle, consistent waves and many surf schools."
      },
      {
        question: "When is the best time to visit Weligama?",
        answer: "November to March offers the best weather and surf conditions. April to October can be rainy but still surfable."
      },
      {
        question: "How far is Weligama from Mirissa?",
        answer: "Only 6km (10 minutes by tuk-tuk). Many visitors stay in Weligama and visit Mirissa for whale watching."
      },
      {
        question: "Can I see stilt fishermen every day?",
        answer: "Stilt fishermen usually fish during early morning and late afternoon when the sea is calm. Some now pose for tourist photos for a fee."
      }
    ]
  },
  
  bentota: {
    id: 'bentota',
    name: 'Bentota',
    tagline: "Luxury Meets Nature",
    description: 'Bentota offers luxury resorts, river safaris, water sports, and serene beaches – perfect for romantic getaways and family vacations.',
    highlights: ['Madu River Safari', 'Bentota Beach', 'Brief Garden', 'Water Sports', 'Turtle Hatchery', 'Luxury Resorts'],
    heroImages: [
      {
        image: "https://images.unsplash.com/photo-1585409677983-0f6c41ca1c4b?auto=format&fit=crop&q=80",
        title: "Welcome to Bentota",
        subtitle: "Where Luxury Meets Paradise"
      },
      {
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80",
        title: "Pristine Beaches",
        subtitle: "Golden Sands & Turquoise Waters"
      },
      {
        image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80",
        title: "River & Ocean Adventures",
        subtitle: "Nature at Its Best"
      }
    ],
    attractions: [
      {
        name: "Madu River Safari",
        description: "Boat safari through mangroves, visiting cinnamon island and fish therapy spots",
        image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&q=80",
        category: "Nature",
        rating: 4.8,
        duration: "2-3 hours",
        price: "$25-40"
      },
      {
        name: "Bentota Beach",
        description: "Long stretch of golden sand perfect for swimming, sunbathing, and water sports",
        image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80",
        category: "Beaches",
        rating: 4.7,
        duration: "Full day",
        price: "Free"
      },
      {
        name: "Brief Garden",
        description: "Enchanting garden estate created by landscape architect Bevis Bawa",
        image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80",
        category: "Gardens",
        rating: 4.6,
        duration: "2 hours",
        price: "$10"
      },
      {
        name: "Kosgoda Turtle Hatchery",
        description: "Conservation center protecting sea turtles with educational tours",
        image: "https://images.unsplash.com/photo-1591025207163-942350e47db2?auto=format&fit=crop&q=80",
        category: "Wildlife",
        rating: 4.5,
        duration: "1 hour",
        price: "$5"
      },
      {
        name: "Lunuganga Estate",
        description: "Geoffrey Bawa's country home with stunning architecture and gardens",
        image: "https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?auto=format&fit=crop&q=80",
        category: "Heritage",
        rating: 4.7,
        duration: "1.5 hours",
        price: "$15"
      },
      {
        name: "Water Sports Center",
        description: "Jet skiing, windsurfing, banana boat rides on the Bentota River",
        image: "https://images.unsplash.com/photo-1554290712-e640351074bd?auto=format&fit=crop&q=80",
        category: "Activities",
        rating: 4.6,
        duration: "2-3 hours",
        price: "$30-100"
      }
    ],
    activities: [
      {
        name: "River Safari Adventure",
        description: "Explore mangroves and wildlife",
        icon: "Anchor",
        price: "From $35",
        duration: "3 hours",
        popular: true
      },
      {
        name: "Jet Ski Experience",
        description: "Thrilling rides on Bentota River",
        icon: "Zap",
        price: "From $50",
        duration: "30 mins",
        popular: true
      },
      {
        name: "Romantic Beach Dinner",
        description: "Private dining on the beach",
        icon: "Heart",
        price: "From $100",
        duration: "2 hours"
      },
      {
        name: "Ayurveda Spa Treatment",
        description: "Traditional wellness therapies",
        icon: "Flower2",
        price: "From $60",
        duration: "2 hours"
      },
      {
        name: "Deep Sea Fishing",
        description: "Charter boat fishing trips",
        icon: "Fish",
        price: "From $150",
        duration: "4 hours"
      },
      {
        name: "Cycling Tour",
        description: "Village and countryside exploration",
        icon: "Bike",
        price: "From $25",
        duration: "3 hours"
      }
    ],
    destinationInfo: {
      population: "25,000",
      area: "21.5 km²",
      elevation: "3 m",
      bestTime: "November to April",
      language: "Sinhala, English",
      currency: "Sri Lankan Rupee (LKR)"
    },
    weatherInfo: {
      temperature: "26-32°C",
      season: "Tropical year-round",
      rainfall: "Low: Dec-Mar"
    },
    accommodations: [
      {
        name: "Taj Bentota Resort",
        type: "5-Star Luxury",
        price: "$250-500",
        features: ["Beachfront", "Multiple Pools", "Spa", "5 Restaurants"]
      },
      {
        name: "Vivanta by Taj",
        type: "Luxury Resort",
        price: "$200-400",
        features: ["Geoffrey Bawa Design", "Spa", "Water Sports"]
      },
      {
        name: "Cinnamon Bey",
        type: "Beach Resort",
        price: "$150-300",
        features: ["Large Property", "Kids Club", "Multiple Dining"]
      },
      {
        name: "Bentota Beach Hotel",
        type: "Heritage Hotel",
        price: "$80-150",
        features: ["Historic Property", "Garden", "Pool"]
      }
    ],
    restaurants: [
      {
        name: "The Palms",
        cuisine: "International Fine Dining",
        specialty: "Beachfront luxury dining experience",
        priceRange: "$$$"
      },
      {
        name: "Diya Sisila",
        cuisine: "Sri Lankan Authentic",
        specialty: "Traditional rice and curry by the river",
        priceRange: "$$"
      },
      {
        name: "Golden Grill",
        cuisine: "Seafood & Grill",
        specialty: "Fresh catches and BBQ",
        priceRange: "$$"
      },
      {
        name: "Susantha's Garden",
        cuisine: "Local Home Cooking",
        specialty: "Family recipes in garden setting",
        priceRange: "$"
      }
    ],
    transportInfo: {
      fromColombo: "Train: 2 hours | Car: 1.5 hours | Bus: 2.5 hours",
      fromAirport: "Car: 2 hours | Train: 3 hours",
      localTransport: "Tuk-tuks, hotel shuttles, boats"
    },
    tips: [
      "Book river safari early morning for wildlife",
      "Many hotels offer complimentary water sports",
      "Visit Brief Garden in the morning to avoid heat",
      "Bentota beach less crowded on weekdays",
      "Try fresh seafood at beachside restaurants",
      "Ayurveda treatments best booked in advance",
      "Combine Madu River with fish therapy"
    ],
    faqs: [
      {
        question: "Is Bentota suitable for families?",
        answer: "Yes! Bentota is perfect for families with calm beaches, child-friendly resorts, and activities like turtle hatcheries and boat rides."
      },
      {
        question: "What water sports are available?",
        answer: "Jet skiing, banana boat rides, windsurfing, kayaking, water skiing, and wakeboarding on the Bentota River."
      },
      {
        question: "How is Bentota different from other beach towns?",
        answer: "Bentota offers more luxury resorts and organized water sports compared to other beaches, making it ideal for upscale travelers."
      },
      {
        question: "Can we swim in the ocean?",
        answer: "Yes, Bentota Beach has relatively calm waters, but always check conditions. The river lagoon is calmer for children."
      }
    ]
  },

  nuwaraeliya: {
    id: 'nuwaraeliya',
    name: 'Nuwara Eliya',
    tagline: "Sri Lanka's Little England",
    description: 'With colonial charm, tea estates, and cool weather, Nuwara Eliya is perfect for nature lovers and honeymooners.',
    highlights: ['Gregory Lake', 'Tea Factories', 'Strawberry Farms', 'Victoria Park', 'Colonial Architecture', 'Golf Course'],
    heroImages: [
      {
        image: "https://images.unsplash.com/photo-1570210775642-9ca3e66a08f7?auto=format&fit=crop&q=80",
        title: "Welcome to Nuwara Eliya",
        subtitle: "Sri Lanka's Little England"
      },
      {
        image: "https://images.unsplash.com/photo-1584467735815-f04249e61c67?auto=format&fit=crop&q=80",
        title: "Tea Country Paradise",
        subtitle: "Endless Emerald Plantations"
      },
      {
        image: "https://images.unsplash.com/photo-1609921141835-ed42426faa5f?auto=format&fit=crop&q=80",
        title: "Colonial Heritage",
        subtitle: "Where History Meets Nature"
      }
    ],
    attractions: [
      {
        name: "Gregory Lake",
        description: "Scenic lake offering boat rides, jet skiing, and lakeside walks",
        image: "https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?auto=format&fit=crop&q=80",
        category: "Nature",
        rating: 4.6,
        duration: "2-3 hours",
        price: "Entry: $2"
      },
      {
        name: "Horton Plains National Park",
        description: "High-altitude park with World's End cliff and Baker's Falls",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80",
        category: "Nature",
        rating: 4.8,
        duration: "Half day",
        price: "$25"
      },
      {
        name: "Pedro Tea Estate",
        description: "Working tea factory with tours showing tea production process",
        image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&q=80",
        category: "Cultural",
        rating: 4.5,
        duration: "2 hours",
        price: "$10"
      },
      {
        name: "Victoria Park",
        description: "Well-maintained park with exotic plants and bird watching",
        image: "https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?auto=format&fit=crop&q=80",
        category: "Parks",
        rating: 4.4,
        duration: "1-2 hours",
        price: "$2"
      },
      {
        name: "Strawberry Farms",
        description: "Pick your own strawberries and enjoy fresh strawberry products",
        image: "https://images.unsplash.com/photo-1563746098251-d35aef196e83?auto=format&fit=crop&q=80",
        category: "Experience",
        rating: 4.3,
        duration: "1 hour",
        price: "$5"
      },
      {
        name: "Lover's Leap Waterfall",
        description: "Romantic waterfall with legendary love story",
        image: "https://images.unsplash.com/photo-1526080676457-4f8e0d5e8b4a?auto=format&fit=crop&q=80",
        category: "Nature",
        rating: 4.5,
        duration: "1 hour",
        price: "Free"
      }
    ],
    activities: [
      {
        name: "Gregory Lake Boat Ride",
        description: "Swan boats and speed boats on the lake",
        icon: "Anchor",
        price: "From $10",
        duration: "30 mins",
        popular: true
      },
      {
        name: "Tea Factory Tour",
        description: "Learn about Ceylon tea production",
        icon: "Coffee",
        price: "From $15",
        duration: "2 hours",
        popular: true
      },
      {
        name: "Horton Plains Hike",
        description: "Trek to World's End viewpoint",
        icon: "Navigation",
        price: "From $50",
        duration: "5 hours"
      },
      {
        name: "Golf at Nuwara Eliya Golf Club",
        description: "Play at one of Asia's oldest golf clubs",
        icon: "Activity",
        price: "From $60",
        duration: "4 hours"
      },
      {
        name: "Strawberry Picking",
        description: "Pick fresh strawberries at local farms",
        icon: "Heart",
        price: "From $10",
        duration: "1 hour"
      },
      {
        name: "Colonial Architecture Walk",
        description: "Guided tour of British colonial buildings",
        icon: "Building",
        price: "From $20",
        duration: "2 hours"
      }
    ],
    destinationInfo: {
      population: "27,000",
      area: "12.8 km²",
      elevation: "1,868 m",
      bestTime: "February to April",
      language: "Sinhala, Tamil, English",
      currency: "Sri Lankan Rupee (LKR)"
    },
    weatherInfo: {
      temperature: "10-20°C",
      season: "Cool year-round",
      rainfall: "High: Oct-Dec"
    },
    accommodations: [
      {
        name: "Grand Hotel",
        type: "Heritage Luxury",
        price: "$150-300",
        features: ["Colonial Building", "Garden", "High Tea", "Spa"]
      },
      {
        name: "Heritance Tea Factory",
        type: "Unique Luxury",
        price: "$200-400",
        features: ["Converted Tea Factory", "Mountain Views", "Museum"]
      },
      {
        name: "The Hill Club",
        type: "Colonial Club",
        price: "$100-200",
        features: ["British Heritage", "Fireplace", "Library", "Billiards"]
      },
      {
        name: "Araliya Green Hills",
        type: "Modern Hotel",
        price: "$80-150",
        features: ["Lake View", "Restaurant", "Spa", "Modern Amenities"]
      }
    ],
    restaurants: [
      {
        name: "Grand Thai",
        cuisine: "Thai & International",
        specialty: "Authentic Thai in colonial setting",
        priceRange: "$$$"
      },
      {
        name: "Hill Club Restaurant",
        cuisine: "British Colonial",
        specialty: "Traditional English meals with dress code",
        priceRange: "$$$"
      },
      {
        name: "Themparadu",
        cuisine: "Sri Lankan Traditional",
        specialty: "Local dishes with mountain herbs",
        priceRange: "$$"
      },
      {
        name: "Milano Restaurant",
        cuisine: "Italian",
        specialty: "Wood-fired pizzas in cool climate",
        priceRange: "$$"
      }
    ],
    transportInfo: {
      fromColombo: "Train: 4-5 hours | Car: 4 hours | Bus: 5 hours",
      fromAirport: "Car: 5 hours | Train: 6 hours",
      localTransport: "Tuk-tuks, walking, hotel transfers"
    },
    tips: [
      "Bring warm clothes - temperatures drop at night",
      "Book Horton Plains early morning for clear views",
      "Try fresh strawberries and cream",
      "High tea at Grand Hotel is a must",
      "Visit tea factories in the morning",
      "Golf club has dress code",
      "April is best for flowers"
    ],
    faqs: [
      {
        question: "Why is it called Little England?",
        answer: "Nuwara Eliya was a favorite hill station for British colonials who built it to resemble an English countryside town with Tudor-style buildings, golf courses, and gardens."
      },
      {
        question: "How cold does it get?",
        answer: "Temperatures can drop to 5-10°C at night, especially December to February. Days are pleasant at 15-20°C. Always bring warm clothes."
      },
      {
        question: "Is the train ride worth it?",
        answer: "Yes! The train from Kandy to Nuwara Eliya is one of the world's most scenic journeys through tea plantations and mountains."
      },
      {
        question: "What's special about the tea here?",
        answer: "Nuwara Eliya produces Ceylon's finest high-grown tea with a delicate flavor due to the cool climate and high altitude."
      }
    ]
  },

  dambulla: {
    id: 'dambulla',
    name: 'Dambulla',
    tagline: "Cave Temples & Golden Buddha",
    description: 'Dambulla offers the iconic cave temples with Buddhist murals and statues, part of the cultural triangle.',
    highlights: ['Cave Temples', 'Golden Buddha', 'Market Town', 'Rose Quartz Mountain', 'Cultural Heritage', 'Ancient Art'],
    heroImages: [
      {
        image: "https://images.unsplash.com/photo-1609921141835-ed42426faa5f?auto=format&fit=crop&q=80",
        title: "Dambulla Cave Temples",
        subtitle: "2000 Years of Buddhist Heritage"
      },
      {
        image: "https://images.unsplash.com/photo-1580974852861-bd4e94ef4b5f?auto=format&fit=crop&q=80",
        title: "Golden Temple Complex",
        subtitle: "UNESCO World Heritage Site"
      },
      {
        image: "https://images.unsplash.com/photo-1552424193-e08d8fce9eb6?auto=format&fit=crop&q=80",
        title: "Sacred Art & History",
        subtitle: "Ancient Murals and Statues"
      }
    ],
    attractions: [
      {
        name: "Dambulla Cave Temple",
        description: "Five caves with over 150 Buddha statues and ancient murals dating back to 1st century BC",
        image: "https://images.unsplash.com/photo-1609921141835-ed42426faa5f?auto=format&fit=crop&q=80",
        category: "Religious Sites",
        rating: 4.8,
        duration: "2-3 hours",
        price: "$10"
      },
      {
        name: "Golden Buddha Statue",
        description: "30-meter tall golden Buddha statue at the entrance of the temple complex",
        image: "https://images.unsplash.com/photo-1580974852861-bd4e94ef4b5f?auto=format&fit=crop&q=80",
        category: "Monuments",
        rating: 4.5,
        duration: "30 minutes",
        price: "Included"
      },
      {
        name: "Ibbankatuwa Megalithic Tombs",
        description: "Prehistoric burial site with ancient tombs and artifacts",
        image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&q=80",
        category: "Archaeological",
        rating: 4.3,
        duration: "1 hour",
        price: "$3"
      },
      {
        name: "Rose Quartz Mountain",
        description: "Unique pink quartz mountain range visible from distance",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80",
        category: "Natural",
        rating: 4.4,
        duration: "2 hours",
        price: "Free"
      },
      {
        name: "Dambulla Economic Center",
        description: "Largest vegetable market in Sri Lanka",
        image: "https://images.unsplash.com/photo-1555529771-835f59fc5efe?auto=format&fit=crop&q=80",
        category: "Markets",
        rating: 4.2,
        duration: "1 hour",
        price: "Free"
      },
      {
        name: "Popham's Arboretum",
        description: "Private arboretum with dry zone flora and walking trails",
        image: "https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?auto=format&fit=crop&q=80",
        category: "Nature",
        rating: 4.3,
        duration: "1.5 hours",
        price: "$5"
      }
    ],
    activities: [
      {
        name: "Cave Temple Tour",
        description: "Guided tour of all five caves",
        icon: "Navigation",
        price: "From $20",
        duration: "2 hours",
        popular: true
      },
      {
        name: "Sunrise at Temple",
        description: "Early morning visit for best light",
        icon: "Sunrise",
        price: "From $30",
        duration: "3 hours",
        popular: true
      },
      {
        name: "Village Cycling Tour",
        description: "Explore rural villages and paddy fields",
        icon: "Bike",
        price: "From $25",
        duration: "3 hours"
      },
      {
        name: "Cooking Class",
        description: "Learn traditional Sri Lankan cooking",
        icon: "Utensils",
        price: "From $35",
        duration: "3 hours"
      },
      {
        name: "Market Food Tour",
        description: "Taste local produce and street food",
        icon: "ShoppingBag",
        price: "From $15",
        duration: "2 hours"
      },
      {
        name: "Photography Tour",
        description: "Capture temples and landscapes",
        icon: "Camera",
        price: "From $40",
        duration: "4 hours"
      }
    ],
    destinationInfo: {
      population: "75,000",
      area: "21.5 km²",
      elevation: "100 m",
      bestTime: "January to April",
      language: "Sinhala, Tamil",
      currency: "Sri Lankan Rupee (LKR)"
    },
    weatherInfo: {
      temperature: "25-32°C",
      season: "Dry zone climate",
      rainfall: "Low except Oct-Dec"
    },
    accommodations: [
      {
        name: "Heritance Kandalama",
        type: "Eco Luxury",
        price: "$150-300",
        features: ["Lakeside", "Award-winning Design", "Spa", "Wildlife"]
      },
      {
        name: "Amaya Lake",
        type: "Lake Resort",
        price: "$100-200",
        features: ["Cultural Shows", "Lake View", "Nature Walks"]
      },
      {
        name: "Sundaras Resort",
        type: "Boutique Hotel",
        price: "$80-150",
        features: ["Pool", "Garden", "Restaurant", "Spa"]
      },
      {
        name: "Nice Place Hotel",
        type: "Budget Hotel",
        price: "$30-60",
        features: ["Clean Rooms", "Restaurant", "Tour Desk"]
      }
    ],
    restaurants: [
      {
        name: "Gimanhala",
        cuisine: "Traditional Sri Lankan",
        specialty: "Authentic village-style curry",
        priceRange: "$$"
      },
      {
        name: "Mango Mango",
        cuisine: "International & Local",
        specialty: "Fresh juices and fusion dishes",
        priceRange: "$$"
      },
      {
        name: "Heritage Restaurant",
        cuisine: "Multi-cuisine",
        specialty: "Buffet with cultural show",
        priceRange: "$$$"
      },
      {
        name: "Sakura Restaurant",
        cuisine: "Asian",
        specialty: "Chinese and Thai dishes",
        priceRange: "$"
      }
    ],
    transportInfo: {
      fromColombo: "Car: 3 hours | Bus: 4 hours",
      fromAirport: "Car: 3.5 hours | Bus: 5 hours",
      localTransport: "Tuk-tuks, bicycles"
    },
    tips: [
      "Remove shoes and hats before entering temples",
      "Dress modestly - cover shoulders and knees",
      "Visit early morning or late afternoon to avoid heat",
      "Combine with Sigiriya for a day trip",
      "Photography allowed but no flash on murals",
      "Climb is steep - take water",
      "Guide recommended for historical context"
    ],
    faqs: [
      {
        question: "Can I visit Dambulla and Sigiriya in one day?",
        answer: "Yes, they're only 20km apart. Start early with Sigiriya, then visit Dambulla Cave Temple in the afternoon when it's cooler."
      },
      {
        question: "Is climbing to the caves difficult?",
        answer: "There are about 300 steps to climb. It's moderate difficulty but there are resting points. Early morning or late afternoon is easier."
      },
      {
        question: "What should I wear to the temple?",
        answer: "Dress modestly covering shoulders and knees. Remove shoes and hats. White clothing is respectful but not required."
      },
      {
        question: "Are the caves natural or man-made?",
        answer: "The caves are natural but have been modified over 2000 years. The drip ledges were carved to prevent water entering."
      }
    ]
  },

  hikkaduwa: {
    id: 'hikkaduwa',
    name: 'Hikkaduwa',
    tagline: "Tropical Coral Paradise",
    description: 'Hikkaduwa is famous for coral reefs, surfing, vibrant nightlife, and turtle hatcheries.',
    highlights: ['Snorkeling', 'Coral Sanctuary', 'Beach Bars', 'Turtle Hatchery', 'Surfing', 'Nightlife'],
    heroImages: [
      {
        image: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?auto=format&fit=crop&q=80",
        title: "Welcome to Hikkaduwa",
        subtitle: "Coral Reefs & Beach Life"
      },
      {
        image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80",
        title: "Underwater Paradise",
        subtitle: "Snorkel with Tropical Fish"
      },
      {
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80",
        title: "Surf & Party Central",
        subtitle: "Where Adventure Never Ends"
      }
    ],
    attractions: [
      {
        name: "Hikkaduwa Coral Sanctuary",
        description: "Protected coral reef area perfect for snorkeling with colorful fish and sea turtles",
        image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80",
        category: "Marine",
        rating: 4.6,
        duration: "2-3 hours",
        price: "Snorkel rental: $10"
      },
      {
        name: "Hikkaduwa Beach",
        description: "Long stretch of golden sand with surf breaks, restaurants, and water sports",
        image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80",
        category: "Beaches",
        rating: 4.5,
        duration: "Full day",
        price: "Free"
      },
      {
        name: "Turtle Hatchery",
        description: "Conservation center where you can see baby turtles and learn about protection efforts",
        image: "https://images.unsplash.com/photo-1591025207163-942350e47db2?auto=format&fit=crop&q=80",
        category: "Wildlife",
        rating: 4.4,
        duration: "1 hour",
        price: "$5"
      },
      {
        name: "Seenigama Temple",
        description: "Small island temple accessible by boat, popular for blessings",
        image: "https://images.unsplash.com/photo-1609921141835-ed42426faa5f?auto=format&fit=crop&q=80",
        category: "Religious",
        rating: 4.3,
        duration: "1 hour",
        price: "Donation"
      },
      {
        name: "Hikkaduwa Lake",
        description: "Scenic lake for boat safaris to see birds and monitor lizards",
        image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&q=80",
        category: "Nature",
        rating: 4.4,
        duration: "2 hours",
        price: "$20"
      },
      {
        name: "Tsunami Museum",
        description: "Memorial and educational center about the 2004 tsunami",
        image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&q=80",
        category: "Museums",
        rating: 4.2,
        duration: "1 hour",
        price: "$2"
      }
    ],
    activities: [
      {
        name: "Glass Bottom Boat Tour",
        description: "See coral reefs without getting wet",
        icon: "Anchor",
        price: "From $15",
        duration: "1 hour",
        popular: true
      },
      {
        name: "Scuba Diving",
        description: "Explore deeper reefs and wrecks",
        icon: "Fish",
        price: "From $60",
        duration: "3 hours",
        popular: true
      },
      {
        name: "Surf Lessons",
        description: "Learn at beginner-friendly breaks",
        icon: "Waves",
        price: "From $25",
        duration: "2 hours"
      },
      {
        name: "Lake Safari",
        description: "Bird watching and nature boat tour",
        icon: "Binoculars",
        price: "From $20",
        duration: "2 hours"
      },
      {
        name: "Beach Party Tours",
        description: "Guided nightlife experience",
        icon: "Music",
        price: "From $30",
        duration: "4 hours"
      },
      {
        name: "Cooking Class",
        description: "Learn seafood specialties",
        icon: "Utensils",
        price: "From $35",
        duration: "3 hours"
      }
    ],
    destinationInfo: {
      population: "18,000",
      area: "8.5 km²",
      elevation: "Sea level",
      bestTime: "November to April",
      language: "Sinhala, English",
      currency: "Sri Lankan Rupee (LKR)"
    },
    weatherInfo: {
      temperature: "27-32°C",
      season: "Tropical beach climate",
      rainfall: "Low: Dec-Mar"
    },
    accommodations: [
      {
        name: "Coral Sands Hotel",
        type: "Beach Resort",
        price: "$80-150",
        features: ["Beachfront", "Pool", "Spa", "Dive Center"]
      },
      {
        name: "Hikka Tranz by Cinnamon",
        type: "Modern Hotel",
        price: "$100-200",
        features: ["Contemporary Design", "Rooftop Bar", "Beach Club"]
      },
      {
        name: "Refresh Hotel",
        type: "Boutique Hotel",
        price: "$60-120",
        features: ["Adults Only", "Pool", "Beach Access"]
      },
      {
        name: "Funky Fish",
        type: "Backpackers",
        price: "$15-40",
        features: ["Social Atmosphere", "Bar", "Surf Storage"]
      }
    ],
    restaurants: [
      {
        name: "Salty Snapper",
        cuisine: "Seafood & International",
        specialty: "Fresh catches and sunset views",
        priceRange: "$$"
      },
      {
        name: "Cool Spot",
        cuisine: "Sri Lankan & Western",
        specialty: "Beachfront dining for decades",
        priceRange: "$"
      },
      {
        name: "Nordic House",
        cuisine: "Scandinavian & Seafood",
        specialty: "European comfort food",
        priceRange: "$$"
      },
      {
        name: "Vibration Hotel Restaurant",
        cuisine: "Fusion",
        specialty: "Creative cocktails and tapas",
        priceRange: "$$$"
      }
    ],
    transportInfo: {
      fromColombo: "Train: 2 hours | Car: 1.5 hours | Bus: 2.5 hours",
      fromAirport: "Car: 2 hours | Train: 3 hours",
      localTransport: "Tuk-tuks, bicycles, walking"
    },
    tips: [
      "Best snorkeling at high tide in the morning",
      "Coral sanctuary has strong currents - use fins",
      "Beach bars get loud at night - choose accommodation accordingly",
      "Negotiate glass bottom boat prices",
      "Don't touch or stand on coral",
      "Try fresh seafood at beachside restaurants",
      "Full moon parties are popular"
    ],
    faqs: [
      {
        question: "Is the coral still worth seeing?",
        answer: "While some coral was damaged by bleaching, the sanctuary still has colorful fish, turtles, and recovering coral. Best visibility is November to April."
      },
      {
        question: "Can beginners surf here?",
        answer: "Yes! The beach break near the train station is perfect for beginners. More experienced surfers head to Benny's break."
      },
      {
        question: "Is Hikkaduwa too touristy?",
        answer: "It's one of the more developed beach towns but still has local charm. For quieter beaches, try nearby Dodanduwa or Kahawa."
      },
      {
        question: "When do turtles come to the beach?",
        answer: "Sea turtles can be seen year-round while snorkeling. Nesting season is April to May, but protected beaches are off-limits."
      }
    ]
  },
  
  // Add more destination configurations here...
};

export default destinationConfigs;