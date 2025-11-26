export interface DestinationData {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  longDescription: string;
  heroImage: string;
  heroVideo?: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    province: string;
    district: string;
  };
  pricing: {
    localAdult: number;
    foreignAdult: number;
    localChild: number;
    foreignChild: number;
    currency: string;
  };
  hours: {
    open: string;
    close: string;
    days: string;
  };
  rating: number;
  reviews: number;
  highlights: string[];
  activities: Array<{
    id: string;
    name: string;
    description: string;
    duration: string;
    price: string;
    image: string;
    difficulty: 'Easy' | 'Moderate' | 'Challenging';
  }>;
  nearbyAttractions: Array<{
    id: string;
    name: string;
    distance: string;
    type: string;
    image: string;
  }>;
  accommodation: Array<{
    id: string;
    name: string;
    type: string;
    rating: number;
    price: string;
    image: string;
    distance: string;
  }>;
  dining: Array<{
    id: string;
    name: string;
    cuisine: string;
    rating: number;
    price: string;
    image: string;
    distance: string;
  }>;
  transportation: {
    fromColombo: string;
    fromKandy: string;
    fromNegombo: string;
    localTransport: string[];
  };
  bestTimeToVisit: {
    months: string;
    weather: string;
    crowdLevel: string;
  };
  tips: string[];
  gallery: string[];
  youtubeVideos: Array<{
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    views: string;
  }>;
  history: {
    period: string;
    significance: string;
    architecture: string;
    discovery: string;
  };
  conservation: {
    status: string;
    threats: string;
    efforts: string;
  };
}

export const destinationData: Record<string, DestinationData> = {
  'sigiriya-lion-rock': {
    id: 'sigiriya',
    name: 'Sigiriya Lion Rock',
    subtitle: 'The Eighth Wonder of the World',
    description: 'Ancient rock fortress and palace ruins surrounded by extensive gardens, reservoirs, and urban planning.',
    longDescription: 'Sigiriya, also known as Lion Rock, is an ancient rock fortress located in the central Matale District of Sri Lanka. Built during the reign of King Kasyapa (477-495 AD), this UNESCO World Heritage Site is considered one of the best preserved examples of ancient urban planning in Asia. The site consists of massive column of rock approximately 180 meters high, topped by palace ruins and surrounded by extensive gardens, reservoirs, and other structures.',
    heroImage: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=1920&h=1080&fit=crop',
    heroVideo: 'dQw4w9WgXcQ',
    location: {
      lat: 7.9570,
      lng: 80.7603,
      address: 'Sigiriya, Matale District',
      province: 'Central Province',
      district: 'Matale'
    },
    pricing: {
      localAdult: 50,
      foreignAdult: 3570,
      localChild: 25,
      foreignChild: 1785,
      currency: 'LKR'
    },
    hours: {
      open: '05:00',
      close: '17:00',
      days: 'Monday - Sunday'
    },
    rating: 4.8,
    reviews: 15420,
    highlights: [
      'Ancient frescoes of celestial maidens',
      '5th-century palace ruins',
      'Mirror Wall with ancient graffiti',
      'Water gardens and fountains',
      'Panoramic views from summit',
      'UNESCO World Heritage Site'
    ],
    activities: [
      {
        id: 'climb',
        name: 'Lion Rock Climb',
        description: 'Climb to the summit of Sigiriya Rock and explore ancient palace ruins',
        duration: '3-4 hours',
        price: 'LKR 3,570',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        difficulty: 'Moderate'
      },
      {
        id: 'sunrise',
        name: 'Sunrise Tour',
        description: 'Experience the magical sunrise from the top of Lion Rock',
        duration: '4-5 hours',
        price: 'LKR 5,000',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        difficulty: 'Moderate'
      },
      {
        id: 'gardens',
        name: 'Garden Walk',
        description: 'Explore the ancient water gardens and landscaping',
        duration: '1-2 hours',
        price: 'Free with entry',
        image: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c58?w=400&h=300&fit=crop',
        difficulty: 'Easy'
      }
    ],
    nearbyAttractions: [
      {
        id: 'pidurangala',
        name: 'Pidurangala Rock',
        distance: '2 km',
        type: 'Ancient Temple',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
      },
      {
        id: 'dambulla',
        name: 'Dambulla Cave Temple',
        distance: '19 km',
        type: 'Cave Temple',
        image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400&h=300&fit=crop'
      }
    ],
    accommodation: [
      {
        id: 'hotel1',
        name: 'Hotel Sigiriya',
        type: 'Luxury Hotel',
        rating: 4.5,
        price: '$180/night',
        image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop',
        distance: '1 km'
      }
    ],
    dining: [
      {
        id: 'restaurant1',
        name: 'Lion Rock Restaurant',
        cuisine: 'Sri Lankan',
        rating: 4.3,
        price: '$15-25',
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
        distance: '500m'
      }
    ],
    transportation: {
      fromColombo: '4.5 hours by car (160km)',
      fromKandy: '2.5 hours by car (85km)',
      fromNegombo: '4 hours by car (140km)',
      localTransport: ['Tuk-tuk', 'Taxi', 'Private Car', 'Tour Bus']
    },
    bestTimeToVisit: {
      months: 'January to September',
      weather: 'Dry season, less rainfall',
      crowdLevel: 'Moderate to high'
    },
    tips: [
      'Start early morning (5-6 AM) to avoid crowds and heat',
      'Wear comfortable climbing shoes with good grip',
      'Bring water and sun protection',
      'Camera is allowed but flash photography prohibited',
      'Allow 3-4 hours for complete visit'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
    ],
    youtubeVideos: [
      {
        id: 'dQw4w9WgXcQ',
        title: 'Sigiriya Lion Rock - Complete Guide',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        duration: '12:45',
        views: '2.1M'
      },
      {
        id: 'dQw4w9WgXcQ',
        title: 'Climbing Sigiriya at Sunrise - Epic Adventure',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        duration: '8:22',
        views: '856K'
      },
      {
        id: 'dQw4w9WgXcQ',
        title: 'Sigiriya Frescoes - Ancient Art Masterpieces',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        duration: '6:15',
        views: '425K'
      }
    ],
    history: {
      period: '5th Century AD (477-495 AD)',
      significance: 'Royal citadel of King Kasyapa',
      architecture: 'Unique blend of natural rock formation and human engineering',
      discovery: 'Rediscovered by British archaeologist H.C.P. Bell in 1898'
    },
    conservation: {
      status: 'UNESCO World Heritage Site since 1982',
      threats: 'Weather erosion, tourist impact, vegetation growth',
      efforts: 'Ongoing conservation by Central Cultural Fund of Sri Lanka'
    }
  },

  'temple-of-the-sacred-tooth-relic': {
    id: 'kandy-temple',
    name: 'Temple of the Sacred Tooth Relic',
    subtitle: 'Sri Dalada Maligawa - Sacred Buddhist Temple',
    description: 'One of the most sacred Buddhist temples in the world, housing the tooth relic of Lord Buddha.',
    longDescription: 'The Temple of the Sacred Tooth Relic (Sri Dalada Maligawa) is a Buddhist temple in Kandy, Sri Lanka. It is located in the royal palace complex of the former Kingdom of Kandy, which houses the relic of the tooth of the Buddha. Since ancient times, the relic has played an important role in local politics because it is believed that whoever holds the relic holds the governance of the country.',
    heroImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop',
    heroVideo: 'dQw4w9WgXcQ',
    location: {
      lat: 7.2935,
      lng: 80.6407,
      address: 'Kandy, Central Province',
      province: 'Central Province',
      district: 'Kandy'
    },
    pricing: {
      localAdult: 25,
      foreignAdult: 1000,
      localChild: 10,
      foreignChild: 500,
      currency: 'LKR'
    },
    hours: {
      open: '05:30',
      close: '20:00',
      days: 'Monday - Sunday'
    },
    rating: 4.7,
    reviews: 8920,
    highlights: [
      'Sacred tooth relic of Buddha',
      'Traditional Kandyan architecture',
      'Daily ritual ceremonies (Puja)',
      'UNESCO World Heritage Site',
      'Royal Palace Museum',
      'Beautiful golden roof'
    ],
    activities: [
      {
        id: 'puja',
        name: 'Puja Ceremony',
        description: 'Witness the traditional Buddhist ceremony held three times daily',
        duration: '30-45 minutes',
        price: 'Free with entry',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        difficulty: 'Easy'
      },
      {
        id: 'museum',
        name: 'Royal Palace Museum',
        description: 'Explore the royal artifacts and historical collections',
        duration: '1-2 hours',
        price: 'LKR 500',
        image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400&h=300&fit=crop',
        difficulty: 'Easy'
      }
    ],
    nearbyAttractions: [
      {
        id: 'kandy-lake',
        name: 'Kandy Lake',
        distance: '200m',
        type: 'Scenic Lake',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
      }
    ],
    accommodation: [
      {
        id: 'queens-hotel',
        name: 'Queens Hotel Kandy',
        type: 'Heritage Hotel',
        rating: 4.2,
        price: '$120/night',
        image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop',
        distance: '500m'
      }
    ],
    dining: [
      {
        id: 'white-house',
        name: 'The White House Restaurant',
        cuisine: 'Sri Lankan & International',
        rating: 4.4,
        price: '$12-20',
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
        distance: '300m'
      }
    ],
    transportation: {
      fromColombo: '3 hours by car (115km)',
      fromKandy: 'In city center',
      fromNegombo: '3.5 hours by car (130km)',
      localTransport: ['Tuk-tuk', 'City Bus', 'Walking', 'Taxi']
    },
    bestTimeToVisit: {
      months: 'December to April',
      weather: 'Cooler and less humid',
      crowdLevel: 'High during Esala Perahera (July/August)'
    },
    tips: [
      'Dress modestly - cover shoulders and knees',
      'Remove shoes before entering the temple',
      'Best time for Puja ceremonies: 5:30 AM, 9:30 AM, 6:30 PM',
      'Photography inside the temple is restricted',
      'Visit during Esala Perahera for the grand festival (July/August)'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&h=600&fit=crop'
    ],
    youtubeVideos: [
      {
        id: 'dQw4w9WgXcQ',
        title: 'Sacred Tooth Relic Temple - Complete Tour',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        duration: '15:30',
        views: '1.8M'
      },
      {
        id: 'dQw4w9WgXcQ',
        title: 'Esala Perahera Festival - Grand Procession',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        duration: '22:45',
        views: '3.2M'
      }
    ],
    history: {
      period: '16th Century AD',
      significance: 'Houses the sacred tooth relic of Buddha',
      architecture: 'Traditional Kandyan architectural style',
      discovery: 'Built during the Kingdom of Kandy period'
    },
    conservation: {
      status: 'UNESCO World Heritage Site since 1988',
      threats: 'Environmental factors, visitor impact',
      efforts: 'Regular restoration by Department of Archaeology'
    }
  }
};

// Helper function to get destination by slug
export const getDestinationBySlug = (slug: string): DestinationData | null => {
  // Handle direct matches
  if (destinationData[slug]) {
    return destinationData[slug];
  }
  
  // Handle common slug variations
  const slugMappings: Record<string, string> = {
    'sigiriya': 'sigiriya-lion-rock',
    'sigiriya-rock': 'sigiriya-lion-rock',
    'lion-rock': 'sigiriya-lion-rock',
    'kandy': 'temple-of-the-sacred-tooth-relic',
    'kandy-temple': 'temple-of-the-sacred-tooth-relic',
    'tooth-temple': 'temple-of-the-sacred-tooth-relic',
    'dalada-maligawa': 'temple-of-the-sacred-tooth-relic'
  };
  
  const mappedSlug = slugMappings[slug];
  return mappedSlug ? destinationData[mappedSlug] : null;
};