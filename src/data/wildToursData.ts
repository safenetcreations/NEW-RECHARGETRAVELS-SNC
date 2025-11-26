
import { TourPackage } from '@/components/wildTours/TourPackageCard'

export interface Itinerary {
  day: number
  title: string
  description: string
  activities: string[]
}

export interface FAQ {
  question: string
  answer: string
}

export interface EnhancedTourPackage extends TourPackage {
  itinerary?: Itinerary[]
  faq?: FAQ[]
  bestTime?: string
  difficulty?: string
  included?: string[]
  excluded?: string[]
  cancellationPolicy?: string
}

export const wildToursData: Record<string, EnhancedTourPackage[]> = {
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
      reviewCount: 127,
      itinerary: [
        {
          day: 1,
          title: 'Udawalawe National Park Safari',
          description: 'Begin your elephant adventure at Udawalawe, famous for its large elephant herds.',
          activities: [
            'Early morning pickup from hotel',
            'Private jeep safari through Udawalawe (3-4 hours)',
            'Visit Elephant Transit Home',
            'Lunch at eco-lodge',
            'Evening relaxation and gourmet dinner'
          ]
        },
        {
          day: 2,
          title: 'Minneriya Elephant Gathering',
          description: 'Experience "The Gathering" - one of the largest elephant congregations in Asia.',
          activities: [
            'Breakfast at lodge',
            'Travel to Minneriya National Park',
            'Afternoon safari to witness The Gathering',
            'Wildlife photography session',
            'Return transfer to hotel'
          ]
        }
      ],
      faq: [
        {
          question: 'What is the best time to see elephants?',
          answer: 'The best time for elephant viewing is early morning (6-9 AM) and late afternoon (3-6 PM) when elephants are most active. The dry season (May-September) offers the best viewing at Minneriya.'
        },
        {
          question: 'How many elephants can we expect to see?',
          answer: 'Udawalawe typically has 300-500 elephants year-round. During "The Gathering" at Minneriya (July-September), you can see 200-300 elephants in a single location.'
        },
        {
          question: 'Is this tour suitable for children?',
          answer: 'Yes, this tour is family-friendly and suitable for children of all ages. The private jeep ensures comfort and flexibility for families.'
        }
      ],
      bestTime: 'Year-round, with July-September best for Minneriya Gathering',
      difficulty: 'Easy',
      included: [
        'Private luxury 4WD safari jeep',
        'Expert naturalist guide',
        'All national park fees and permits',
        'Boutique eco-lodge accommodation',
        'All meals (breakfast, lunch, dinner)',
        'Bottled water and refreshments',
        'Binoculars and field guides',
        'Professional photography guidance'
      ],
      excluded: [
        'International flights',
        'Travel insurance',
        'Personal expenses',
        'Alcoholic beverages',
        'Tips and gratuities'
      ],
      cancellationPolicy: 'Free cancellation up to 48 hours before departure. 50% refund for cancellations within 24-48 hours. No refund for same-day cancellations.'
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
