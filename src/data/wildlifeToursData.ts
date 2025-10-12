import { TourPackage } from '@/components/wildTours/TourPackageCard'

export interface NationalPark {
  id: string;
  name: string;
  slug: string;
  province: string;
  classification: 'National Park' | 'Forest Reserve' | 'Botanical Garden' | 'Sanctuary';
  description: string;
  detailedDescription: string;
  location: {
    lat: number;
    lng: number;
    nearestCity: string;
    distanceFromColombo: number;
  };
  attractions: string[];
  wildlife: string[];
  facilities: string[];
  fees: {
    entrance_fee: number;
    jeep_hire: number;
    guide_fee: number;
    camera_fee?: number;
  };
  operatingHours: string;
  peakSeason: string;
  bestTimeToVisit: string;
  images: string[];
  videoUrl?: string;
  liveFeatures: {
    googleMapsUrl: string;
    youtubePlaylist?: string;
    newsRssUrl?: string;
    trailcamUrl?: string;
  };
  bookingAvailable: boolean;
  featured: boolean;
}

export const sriLankanProvinces = [
  'All Provinces',
  'Central Province',
  'Southern Province', 
  'Northern Province',
  'Eastern Province',
  'Western Province',
  'North Western Province',
  'North Central Province',
  'Sabaragamuwa Province',
  'Uva Province'
];

export const nationalParks: NationalPark[] = [
  {
    id: 'yala-np',
    name: 'Yala National Park',
    slug: 'yala-national-park',
    province: 'Southern Province',
    classification: 'National Park',
    description: 'Sri Lanka\'s most visited national park, famous for having the highest density of leopards in the world.',
    detailedDescription: 'Yala National Park, established in 1938, spans 979 square kilometers and is renowned for its incredible biodiversity. Home to 44 mammal species and 215 bird species, the park\'s semi-arid scrubland provides the perfect habitat for the elusive Sri Lankan leopard. The park is divided into five blocks, with Block 1 being the most popular among visitors.',
    location: {
      lat: 6.3725,
      lng: 81.5185,
      nearestCity: 'Tissamaharama',
      distanceFromColombo: 305
    },
    attractions: ['leopards', 'elephants', 'sloth bears', 'crocodiles', 'peacocks'],
    wildlife: ['Sri Lankan Leopard', 'Asian Elephant', 'Sloth Bear', 'Spotted Deer', 'Wild Boar', 'Mugger Crocodile'],
    facilities: ['Safari Jeeps', 'Park Bungalows', 'Camping Sites', 'Visitor Information Center'],
    fees: {
      entrance_fee: 60,
      jeep_hire: 120,
      guide_fee: 25,
      camera_fee: 10
    },
    operatingHours: '6:00 AM - 6:00 PM',
    peakSeason: 'February to July',
    bestTimeToVisit: 'February to July (dry season)',
    images: [
      'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=800&h=600',
      'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&h=600'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=example-yala',
    liveFeatures: {
      googleMapsUrl: 'https://maps.google.com/maps?q=Yala+National+Park',
      youtubePlaylist: 'https://youtube.com/playlist?list=example-yala',
      newsRssUrl: 'https://example.com/yala-news.rss',
      trailcamUrl: 'https://example.com/yala-trailcam'
    },
    bookingAvailable: true,
    featured: true
  },
  {
    id: 'udawalawe-np',
    name: 'Udawalawe National Park',
    slug: 'udawalawe-national-park',
    province: 'Sabaragamuwa Province',
    classification: 'National Park',
    description: 'Famous for its large herds of elephants and the Udawalawe Elephant Transit Home.',
    detailedDescription: 'Created in 1972, Udawalawe National Park covers 30,821 hectares and was established to provide a sanctuary for wild animals displaced by the construction of the Udawalawe Reservoir. The park is home to around 400 elephants and serves as an important habitat for many endemic species.',
    location: {
      lat: 6.4375,
      lng: 80.8892,
      nearestCity: 'Embilipitiya',
      distanceFromColombo: 200
    },
    attractions: ['elephants', 'water buffalo', 'sambar deer', 'spotted deer', 'peacocks'],
    wildlife: ['Asian Elephant', 'Water Buffalo', 'Sambar Deer', 'Spotted Deer', 'Wild Boar'],
    facilities: ['Safari Jeeps', 'Elephant Transit Home', 'Visitor Center', 'Accommodation'],
    fees: {
      entrance_fee: 45,
      jeep_hire: 100,
      guide_fee: 20
    },
    operatingHours: '6:00 AM - 6:00 PM',
    peakSeason: 'May to September',
    bestTimeToVisit: 'May to September (dry season)',
    images: [
      'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&h=600'
    ],
    liveFeatures: {
      googleMapsUrl: 'https://maps.google.com/maps?q=Udawalawe+National+Park',
      youtubePlaylist: 'https://youtube.com/playlist?list=example-udawalawe'
    },
    bookingAvailable: true,
    featured: true
  },
  {
    id: 'sinharaja-fr',
    name: 'Sinharaja Forest Reserve',
    slug: 'sinharaja-forest-reserve',
    province: 'Sabaragamuwa Province',
    classification: 'Forest Reserve',
    description: 'UNESCO World Heritage rainforest with incredible biodiversity and endemic species.',
    detailedDescription: 'Sinharaja Forest Reserve is Sri Lanka\'s last viable area of primary tropical rainforest. This UNESCO World Heritage Site is home to over half of Sri Lanka\'s endemic trees, insects, amphibians, reptiles, birds, and mammals. The reserve spans 8,864 hectares of pristine rainforest.',
    location: {
      lat: 6.4047,
      lng: 80.4122,
      nearestCity: 'Deniyaya',
      distanceFromColombo: 132
    },
    attractions: ['endemic birds', 'reptiles', 'butterflies', 'medicinal plants', 'waterfalls'],
    wildlife: ['Purple-faced Langur', 'Sri Lanka Blue Magpie', 'Red-faced Malkoha', 'Green Pit Viper'],
    facilities: ['Nature Trails', 'Research Station', 'Field Study Center', 'Basic Accommodation'],
    fees: {
      entrance_fee: 35,
      jeep_hire: 80,
      guide_fee: 30
    },
    operatingHours: '6:00 AM - 5:00 PM',
    peakSeason: 'December to March',
    bestTimeToVisit: 'December to March (less rainfall)',
    images: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600'
    ],
    liveFeatures: {
      googleMapsUrl: 'https://maps.google.com/maps?q=Sinharaja+Forest+Reserve'
    },
    bookingAvailable: true,
    featured: true
  },
  {
    id: 'horton-plains-np',
    name: 'Horton Plains National Park',
    slug: 'horton-plains-national-park',
    province: 'Central Province',
    classification: 'National Park',
    description: 'High-altitude plateau featuring World\'s End cliff and Baker\'s Falls.',
    detailedDescription: 'Located at an altitude of 2,100-2,300 meters above sea level, Horton Plains is a unique montane grassland ecosystem. The park is famous for World\'s End, a sheer precipice with a drop of about 870 meters, and Baker\'s Falls, a beautiful waterfall named after Sir Samuel Baker.',
    location: {
      lat: 6.8047,
      lng: 80.8122,
      nearestCity: 'Nuwara Eliya',
      distanceFromColombo: 180
    },
    attractions: ['worlds end', 'bakers falls', 'endemic flora', 'montane grasslands', 'sambar deer'],
    wildlife: ['Sambar Deer', 'Wild Boar', 'Purple-faced Langur', 'Kelaart\'s Long-clawed Shrew'],
    facilities: ['Walking Trails', 'Visitor Center', 'Rest Points', 'Parking'],
    fees: {
      entrance_fee: 50,
      jeep_hire: 0,
      guide_fee: 25
    },
    operatingHours: '6:30 AM - 6:00 PM',
    peakSeason: 'January to March',
    bestTimeToVisit: 'January to March (clear weather)',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600'
    ],
    liveFeatures: {
      googleMapsUrl: 'https://maps.google.com/maps?q=Horton+Plains+National+Park'
    },
    bookingAvailable: true,
    featured: true
  },
  {
    id: 'minneriya-np',
    name: 'Minneriya National Park',
    slug: 'minneriya-national-park',
    province: 'North Central Province',
    classification: 'National Park',
    description: 'Famous for "The Gathering" - the largest elephant congregation in Asia.',
    detailedDescription: 'Minneriya National Park, established in 1997, encompasses 8,889 hectares centered around the ancient Minneriya Tank built in 3rd century AD by King Mahasena. The park is renowned for "The Gathering," where 200-300 elephants congregate during the dry season.',
    location: {
      lat: 7.9831,
      lng: 80.8956,
      nearestCity: 'Habarana',
      distanceFromColombo: 182
    },
    attractions: ['elephant gathering', 'ancient tank', 'water birds', 'leopards', 'sloth bears'],
    wildlife: ['Asian Elephant', 'Sri Lankan Leopard', 'Sloth Bear', 'Purple-faced Langur', 'Spotted Deer'],
    facilities: ['Safari Jeeps', 'Bird Watching Towers', 'Picnic Areas', 'Visitor Information'],
    fees: {
      entrance_fee: 40,
      jeep_hire: 110,
      guide_fee: 20
    },
    operatingHours: '6:00 AM - 6:00 PM',
    peakSeason: 'May to October',
    bestTimeToVisit: 'May to October (The Gathering season)',
    images: [
      'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&h=600'
    ],
    liveFeatures: {
      googleMapsUrl: 'https://maps.google.com/maps?q=Minneriya+National+Park'
    },
    bookingAvailable: true,
    featured: true
  },
  {
    id: 'royal-botanic-gardens',
    name: 'Royal Botanic Gardens Peradeniya',
    slug: 'royal-botanic-gardens-peradeniya',
    province: 'Central Province',
    classification: 'Botanical Garden',
    description: 'Historic botanical garden with over 4,000 species of plants.',
    detailedDescription: 'Established in 1843, the Royal Botanic Gardens Peradeniya spans 147 acres and houses over 4,000 species of plants. Originally a pleasure garden of the Kandyan kings, it\'s now one of the most beautiful botanical gardens in Asia with notable collections of orchids, spices, and medicinal plants.',
    location: {
      lat: 7.2707,
      lng: 80.5957,
      nearestCity: 'Kandy',
      distanceFromColombo: 116
    },
    attractions: ['orchid house', 'spice garden', 'giant bamboo', 'palm avenue', 'medicinal plants'],
    wildlife: ['Flying Foxes', 'Various Bird Species', 'Butterflies', 'Monkeys'],
    facilities: ['Guided Tours', 'Plant House', 'Cafeteria', 'Gift Shop', 'Parking'],
    fees: {
      entrance_fee: 15,
      jeep_hire: 0,
      guide_fee: 20
    },
    operatingHours: '7:30 AM - 5:00 PM',
    peakSeason: 'December to April',
    bestTimeToVisit: 'December to April (flowering season)',
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600'
    ],
    liveFeatures: {
      googleMapsUrl: 'https://maps.google.com/maps?q=Royal+Botanic+Gardens+Peradeniya'
    },
    bookingAvailable: true,
    featured: false
  }
];

export const wildToursData: Record<string, TourPackage[]> = {
  elephant: [
    {
      id: 'elephant-semi-luxury',
      title: 'Premium Elephant Safari',
      location: 'Udawalawe & Minneriya',
      description: [
        'Private luxury jeep with expert naturalist guide',
        'Visit two premier elephant sanctuaries in comfort',
        'Boutique eco-lodge accommodation with gourmet meals'
      ],
      image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600',
      tier: 'semi-luxury',
      price: 180,
      originalPrice: 220,
      duration: '2 Days, 1 Night',
      inclusions: {
        vehicle: 'Private luxury jeep with A/C',
        guide: 'Expert naturalist guide',
        accommodation: 'Boutique eco-lodge',
        meals: 'All meals included',
        extras: ['Park permits', 'Binoculars', 'Photography tips']
      },
      highlights: ['300+ elephants', 'Baby elephant sightings', 'Luxury comfort', 'Expert photography guidance'],
      maxParticipants: 6,
      rating: 4.8,
      reviewCount: 127
    },
    {
      id: 'elephant-budget',
      title: 'Essential Elephant Safari',
      location: 'Udawalawe National Park',
      description: [
        'Shared jeep safari with experienced local guide',
        'Focus on Udawalawe\'s famous elephant herds',
        'Comfortable guesthouse stay with local cuisine'
      ],
      image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600',
      tier: 'budget',
      price: 65,
      duration: '1 Day',
      inclusions: {
        vehicle: 'Shared safari jeep',
        guide: 'Experienced local guide',
        accommodation: 'Family-run guesthouse',
        meals: 'Traditional lunch included'
      },
      highlights: ['Large elephant herds', 'Authentic experience', 'Local insights', 'Great value'],
      maxParticipants: 8,
      rating: 4.5,
      reviewCount: 89
    }
  ],
  leopard: [
    {
      id: 'leopard-semi-luxury',
      title: 'Exclusive Leopard Tracking',
      location: 'Yala & Wilpattu National Parks',
      description: [
        'Private tracking expedition with leopard specialist',
        'Early morning and evening game drives for best sightings',
        'Luxury tented camp with fine dining experience'
      ],
      image: 'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=600',
      tier: 'semi-luxury',
      price: 220,
      originalPrice: 280,
      duration: '3 Days, 2 Nights',
      inclusions: {
        vehicle: 'Premium 4WD with tracker',
        guide: 'Leopard tracking specialist',
        accommodation: 'Luxury tented safari camp',
        meals: 'Gourmet bush meals',
        extras: ['Night vision equipment', 'Professional camera tips', 'Conservation talk']
      },
      highlights: ['High leopard density', 'Expert tracking', 'Luxury camping', 'Photography workshop'],
      maxParticipants: 4,
      rating: 4.9,
      reviewCount: 156
    },
    {
      id: 'leopard-budget',
      title: 'Leopard Safari Adventure',
      location: 'Yala National Park',
      description: [
        'Shared safari jeep with knowledgeable guide',
        'Full day in Yala\'s leopard territory',
        'Comfortable lodge accommodation with local hospitality'
      ],
      image: 'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=600',
      tier: 'budget',
      price: 85,
      duration: '1 Day',
      inclusions: {
        vehicle: 'Shared safari jeep',
        guide: 'Wildlife tracking guide',
        accommodation: 'Safari lodge',
        meals: 'Packed lunch & dinner'
      },
      highlights: ['World\'s highest leopard density', 'Multiple game drives', 'Affordable adventure', 'Great photo opportunities'],
      maxParticipants: 8,
      rating: 4.3,
      reviewCount: 203
    }
  ],
  whale: [
    {
      id: 'whale-semi-luxury',
      title: 'Private Blue Whale Experience',
      location: 'Mirissa & Trincomalee',
      description: [
        'Private whale watching boat with marine biologist',
        'Two locations for optimal seasonal whale encounters',
        'Beachfront luxury resort with ocean view suites'
      ],
      image: 'https://images.unsplash.com/photo-1518877593221-1f28583780b4?w=600',
      tier: 'semi-luxury',
      price: 160,
      duration: '2 Days, 1 Night',
      inclusions: {
        vehicle: 'Private whale watching boat',
        guide: 'Marine biologist guide',
        accommodation: 'Beachfront luxury resort',
        meals: 'Breakfast & seafood dinner',
        extras: ['Hydrophone listening', 'Whale behavior briefing', 'Photography assistance']
      },
      highlights: ['Blue whale encounters', 'Marine expertise', 'Luxury beachfront', 'Seasonal flexibility'],
      maxParticipants: 8,
      rating: 4.7,
      reviewCount: 94
    },
    {
      id: 'whale-budget',
      title: 'Blue Whale Watching Tour',
      location: 'Mirissa',
      description: [
        'Shared boat tour with experienced captain',
        'Early morning departure for best whale spotting',
        'Comfortable beachside guesthouse accommodation'
      ],
      image: 'https://images.unsplash.com/photo-1518877593221-1f28583780b4?w=600',
      tier: 'budget',
      price: 45,
      duration: '4 Hours',
      inclusions: {
        vehicle: 'Shared whale watching boat',
        guide: 'Experienced boat captain',
        accommodation: 'Beachside guesthouse',
        meals: 'Light breakfast included'
      },
      highlights: ['World\'s largest mammals', 'Early morning adventure', 'Affordable pricing', 'Authentic experience'],
      maxParticipants: 20,
      rating: 4.4,
      reviewCount: 167
    }
  ],
  dolphin: [
    {
      id: 'dolphin-semi-luxury',
      title: 'Premium Dolphin Encounter',
      location: 'Kalpitiya Lagoon',
      description: [
        'Private catamaran with underwater viewing windows',
        'Spinner dolphin pods and seasonal sperm whales',
        'Beachfront resort with water sports activities'
      ],
      image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600',
      tier: 'semi-luxury',
      price: 140,
      duration: '2 Days, 1 Night',
      inclusions: {
        vehicle: 'Private catamaran with viewing deck',
        guide: 'Marine wildlife specialist',
        accommodation: 'Beachfront resort',
        meals: 'Seafood lunch & dinner',
        extras: ['Snorkeling gear', 'Dolphin behavior talk', 'Sunset cruise']
      },
      highlights: ['Spinner dolphins', 'Private boat', 'Resort amenities', 'Multiple marine encounters'],
      maxParticipants: 6,
      rating: 4.6,
      reviewCount: 78
    },
    {
      id: 'dolphin-budget',
      title: 'Dolphin Watching Safari',
      location: 'Kalpitiya',
      description: [
        'Shared speedboat tour with local fishermen guides',
        'Large pods of playful spinner dolphins',
        'Beachside budget accommodation with local charm'
      ],
      image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600',
      tier: 'budget',
      price: 35,
      duration: '3 Hours',
      inclusions: {
        vehicle: 'Shared speedboat',
        guide: 'Local fishermen guide',
        accommodation: 'Beach hostel',
        meals: 'Local snacks provided'
      },
      highlights: ['Playful dolphins', 'Local guides', 'Budget adventure', 'Authentic fishing village'],
      maxParticipants: 12,
      rating: 4.2,
      reviewCount: 134
    }
  ],
  birds: [
    {
      id: 'birds-semi-luxury',
      title: 'Expert Birdwatching Expedition',
      location: 'Sinharaja & Kithulgala',
      description: [
        'Private tour with professional ornithologist',
        'UNESCO rainforest and wetland ecosystems',
        'Boutique eco-lodge with birding tower'
      ],
      image: 'https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=600',
      tier: 'semi-luxury',
      price: 120,
      duration: '2 Days, 1 Night',
      inclusions: {
        vehicle: 'Private 4WD vehicle',
        guide: 'Professional ornithologist',
        accommodation: 'Eco-lodge with birding tower',
        meals: 'Organic meals included',
        extras: ['Premium binoculars', 'Bird identification book', 'Photography workshop']
      },
      highlights: ['Endemic species', 'Expert guidance', 'UNESCO rainforest', 'Premium equipment'],
      maxParticipants: 6,
      rating: 4.8,
      reviewCount: 65
    },
    {
      id: 'birds-budget',
      title: 'Rainforest Bird Safari',
      location: 'Sinharaja Forest',
      description: [
        'Guided trek with local bird expert',
        'Focus on endemic Sri Lankan species',
        'Authentic forest lodge accommodation'
      ],
      image: 'https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=600',
      tier: 'budget',
      price: 40,
      duration: '1 Day',
      inclusions: {
        vehicle: 'Shared transport',
        guide: 'Local bird expert',
        accommodation: 'Forest lodge',
        meals: 'Traditional packed lunch'
      },
      highlights: ['Endemic birds', 'Rainforest trekking', 'Local expertise', 'Affordable nature experience'],
      maxParticipants: 10,
      rating: 4.3,
      reviewCount: 91
    }
  ],
  underwater: [
    {
      id: 'underwater-semi-luxury',
      title: 'Premium Diving Experience',
      location: 'Hikkaduwa & Pigeon Island',
      description: [
        'Private diving with PADI instructor',
        'Premium equipment and underwater photography',
        'Beachfront resort with diving facilities'
      ],
      image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600',
      tier: 'semi-luxury',
      price: 110,
      duration: '2 Days, 1 Night',
      inclusions: {
        vehicle: 'Private dive boat',
        guide: 'PADI certified instructor',
        accommodation: 'Beachfront dive resort',
        meals: 'All meals included',
        extras: ['Premium diving gear', 'Underwater camera', 'Dive certification available']
      },
      highlights: ['Coral reefs', 'Marine turtles', 'Premium equipment', 'Professional instruction'],
      maxParticipants: 6,
      rating: 4.7,
      reviewCount: 88
    },
    {
      id: 'underwater-budget',
      title: 'Snorkeling Adventure',
      location: 'Hikkaduwa',
      description: [
        'Guided snorkeling with local dive master',
        'Coral gardens and tropical fish encounters',
        'Beach hostel accommodation with diving atmosphere'
      ],
      image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600',
      tier: 'budget',
      price: 30,
      duration: '4 Hours',
      inclusions: {
        vehicle: 'Shared snorkel boat',
        guide: 'Local dive master',
        accommodation: 'Beach hostel',
        meals: 'Light refreshments'
      },
      highlights: ['Coral gardens', 'Tropical fish', 'Budget-friendly', 'Great for beginners'],
      maxParticipants: 15,
      rating: 4.1,
      reviewCount: 145
    }
  ]
}

export const getCategoryTitle = (category: string): string => {
  const titles = {
    elephant: 'Elephant Safari Tours',
    leopard: 'Leopard Watching Safaris',
    whale: 'Blue Whale Watching',
    dolphin: 'Kalpitiya Dolphin Tours',
    birds: 'Birdwatching Expeditions',
    underwater: 'Underwater Snorkel/Dive Tours'
  }
  return titles[category as keyof typeof titles] || category
}

export const getCategoryDescription = (category: string): string => {
  const descriptions = {
    elephant: 'Witness magnificent elephant herds in their natural habitat across Sri Lanka\'s premier national parks.',
    leopard: 'Experience the thrill of tracking the elusive Sri Lankan leopard in the world\'s highest density leopard territories.',
    whale: 'Encounter the ocean\'s giants - blue whales, sperm whales, and dolphins in Sri Lanka\'s rich marine waters.',
    dolphin: 'Join playful spinner dolphins in the pristine waters of Kalpitiya lagoon and coastal areas.',
    birds: 'Discover Sri Lanka\'s incredible avian diversity with endemic species in pristine rainforest and wetland habitats.',
    underwater: 'Explore vibrant coral reefs and marine life through snorkeling and diving adventures in crystal-clear waters.'
  }
  return descriptions[category as keyof typeof descriptions] || ''
}
