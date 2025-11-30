// Recharge Travels Own Tours - Not TripAdvisor
// These are our exclusive tour packages

import { Tour } from '@/types/tour'

export interface RechargeTour extends Tour {
  category: string
  rating: number
  reviews: number
  highlights?: string[]
  included?: string[]
  destinations?: string[]
}

export const rechargeTours: RechargeTour[] = [
  // Cultural & Spiritual Tours
  {
    id: 'ramayana-trail-tour',
    title: 'Ramayana Trail - Mythological Journey',
    description: 'Follow the ancient Ramayana trail through Sri Lanka\'s sacred sites and temples. Experience the legendary footsteps of Lord Rama and discover the spiritual essence of this island nation.',
    destination: 'Colombo, Kandy, Nuwara Eliya, Ella',
    tour_type: 'cultural',
    difficulty_level: 'easy',
    duration_days: 8,
    max_participants: 12,
    price_per_person: 1650,
    images: [
      'https://images.unsplash.com/photo-1588598198321-9735fd0f5073?w=800',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
    ],
    is_active: true,
    ai_recommendation_score: 98,
    base_price: 1650,
    currency: 'USD',
    min_participants: 2,
    category: 'spiritual',
    rating: 4.9,
    reviews: 78,
    highlights: [
      'Visit Ramayana-related sacred sites',
      'Temple blessings and ceremonies',
      'Mythological storytelling by expert guides',
      'Spiritual experiences at ancient temples',
      'Ravana Falls and Cave exploration'
    ],
    included: [
      'Luxury accommodation (7 nights)',
      'All meals included',
      'Expert spiritual guide',
      'Temple entrance fees',
      'All transportation',
      'Airport transfers'
    ],
    destinations: ['Colombo', 'Kandy', 'Nuwara Eliya', 'Ella', 'Ravana Falls']
  },
  {
    id: 'ayurveda-wellness-tour',
    title: 'Ayurveda Wellness & Healing Retreat',
    description: 'Traditional Ayurvedic treatments and wellness experiences in serene Sri Lankan settings. Rejuvenate your body, mind, and soul with ancient healing practices.',
    destination: 'Colombo, Kandy, Bentota',
    tour_type: 'luxury',
    difficulty_level: 'easy',
    duration_days: 6,
    max_participants: 8,
    price_per_person: 1200,
    images: [
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
      'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800'
    ],
    is_active: true,
    ai_recommendation_score: 96,
    base_price: 1200,
    currency: 'USD',
    min_participants: 1,
    category: 'wellness',
    rating: 4.8,
    reviews: 92,
    highlights: [
      'Personalized Ayurvedic consultations',
      'Traditional spa treatments daily',
      'Yoga and meditation sessions',
      'Herbal medicine workshops',
      'Organic wellness cuisine'
    ],
    included: [
      'Ayurvedic resort accommodation',
      'Daily treatments and therapies',
      'All wellness meals',
      'Yoga sessions',
      'Expert consultation',
      'Herbal supplements to take home'
    ],
    destinations: ['Colombo', 'Kandy', 'Bentota']
  },
  {
    id: 'photography-expedition',
    title: 'Photography Expedition - Capture Sri Lanka',
    description: 'Professional photography tour capturing Sri Lanka\'s diverse landscapes, wildlife, and vibrant culture. Perfect for enthusiasts and professionals alike.',
    destination: 'Colombo, Sigiriya, Kandy, Ella, Galle, Mirissa',
    tour_type: 'adventure',
    difficulty_level: 'moderate',
    duration_days: 10,
    max_participants: 8,
    price_per_person: 2200,
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1621164448191-a834de719ee4?w=800'
    ],
    is_active: true,
    ai_recommendation_score: 95,
    base_price: 2200,
    currency: 'USD',
    min_participants: 2,
    category: 'photography',
    rating: 4.9,
    reviews: 45,
    highlights: [
      'Professional photographer guide',
      'Sunrise and sunset shoots',
      'Cultural portrait sessions',
      'Landscape photography masterclass',
      'Post-processing workshops'
    ],
    included: [
      'Professional photographer guide',
      'Equipment recommendations',
      'Exclusive photo locations',
      'Post-processing sessions',
      'Photo book creation',
      'All accommodation and meals'
    ],
    destinations: ['Colombo', 'Sigiriya', 'Kandy', 'Ella', 'Galle', 'Mirissa']
  },
  {
    id: 'adventure-sports-tour',
    title: 'Adventure Sports & Thrills',
    description: 'Thrilling adventure sports and outdoor activities across Sri Lanka. From white water rafting to surfing, experience the adrenaline rush!',
    destination: 'Colombo, Kitulgala, Ella, Arugam Bay',
    tour_type: 'adventure',
    difficulty_level: 'challenging',
    duration_days: 7,
    max_participants: 10,
    price_per_person: 1400,
    images: [
      'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=800',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800'
    ],
    is_active: true,
    ai_recommendation_score: 94,
    base_price: 1400,
    currency: 'USD',
    min_participants: 2,
    category: 'adventure',
    rating: 4.7,
    reviews: 67,
    highlights: [
      'White water rafting in Kitulgala',
      'Rock climbing and abseiling',
      'Surfing lessons at Arugam Bay',
      'Hiking and trekking',
      'Zip lining adventures'
    ],
    included: [
      'Adventure lodge accommodation',
      'All equipment rental',
      'Professional guides',
      'Safety equipment',
      'Adventure insurance',
      'Meals and snacks'
    ],
    destinations: ['Colombo', 'Kitulgala', 'Ella', 'Arugam Bay']
  },
  {
    id: 'culinary-journey-tour',
    title: 'Culinary Journey - Taste of Sri Lanka',
    description: 'Explore Sri Lanka\'s diverse cuisine through hands-on cooking classes, market tours, and authentic food experiences across the island.',
    destination: 'Colombo, Kandy, Galle',
    tour_type: 'cultural',
    difficulty_level: 'easy',
    duration_days: 5,
    max_participants: 8,
    price_per_person: 950,
    images: [
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'
    ],
    is_active: true,
    ai_recommendation_score: 92,
    base_price: 950,
    currency: 'USD',
    min_participants: 2,
    category: 'culinary',
    rating: 4.8,
    reviews: 83,
    highlights: [
      'Cooking classes with local chefs',
      'Spice garden visits',
      'Local market tours',
      'Traditional meal preparation',
      'Tea and wine pairing experiences'
    ],
    included: [
      'Boutique hotel accommodation',
      'All cooking classes',
      'Market tour guide',
      'Recipe book',
      'Spice pack to take home',
      'All meals included'
    ],
    destinations: ['Colombo', 'Kandy', 'Galle']
  },
  {
    id: 'family-adventure-tour',
    title: 'Family Adventure - Fun for All Ages',
    description: 'Perfect family vacation with activities suitable for all ages. Create unforgettable memories with your loved ones in paradise.',
    destination: 'Colombo, Pinnawala, Kandy, Bentota',
    tour_type: 'family',
    difficulty_level: 'easy',
    duration_days: 6,
    max_participants: 15,
    price_per_person: 1100,
    images: [
      'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800',
      'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=800'
    ],
    is_active: true,
    ai_recommendation_score: 98,
    base_price: 1100,
    currency: 'USD',
    min_participants: 2,
    category: 'family',
    rating: 4.9,
    reviews: 156,
    highlights: [
      'Pinnawala Elephant Orphanage visit',
      'Interactive cultural shows',
      'Beach activities for all ages',
      'Wildlife encounters',
      'Family-friendly accommodation'
    ],
    included: [
      'Family-friendly hotels',
      'Child-friendly activities',
      'Professional family guide',
      'All entrance fees',
      'Special children\'s meals',
      'Safety equipment'
    ],
    destinations: ['Colombo', 'Pinnawala', 'Kandy', 'Bentota']
  },
  // Wildlife Safari Tours
  {
    id: 'premium-elephant-safari',
    title: 'Premium Elephant Safari Experience',
    description: 'Witness magnificent elephant herds in their natural habitat at Udawalawe and Minneriya National Parks with expert naturalist guides.',
    destination: 'Udawalawe, Minneriya',
    tour_type: 'wildlife',
    difficulty_level: 'easy',
    duration_days: 2,
    max_participants: 6,
    price_per_person: 180,
    images: [
      'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800',
      'https://images.unsplash.com/photo-1551009175-15bdf9dcb580?w=800'
    ],
    is_active: true,
    ai_recommendation_score: 96,
    base_price: 180,
    currency: 'USD',
    min_participants: 2,
    category: 'wildlife',
    rating: 4.8,
    reviews: 127,
    highlights: [
      '300+ elephants in natural habitat',
      'Baby elephant sightings',
      'Expert photography guidance',
      'Visit Elephant Transit Home',
      'The Gathering at Minneriya'
    ],
    included: [
      'Private luxury jeep with A/C',
      'Expert naturalist guide',
      'Boutique eco-lodge stay',
      'All meals included',
      'Park permits',
      'Binoculars provided'
    ],
    destinations: ['Udawalawe', 'Minneriya']
  },
  {
    id: 'exclusive-leopard-tracking',
    title: 'Exclusive Leopard Tracking Safari',
    description: 'Track the elusive Sri Lankan leopard in Yala National Park - home to the world\'s highest leopard density. An unforgettable wildlife experience.',
    destination: 'Yala National Park',
    tour_type: 'wildlife',
    difficulty_level: 'moderate',
    duration_days: 3,
    max_participants: 4,
    price_per_person: 220,
    images: [
      'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800',
      'https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=800'
    ],
    is_active: true,
    ai_recommendation_score: 98,
    base_price: 220,
    currency: 'USD',
    min_participants: 2,
    category: 'wildlife',
    rating: 4.9,
    reviews: 156,
    highlights: [
      'World\'s highest leopard density',
      'Expert tracking specialist guide',
      'Early morning & evening drives',
      'Luxury tented camp stay',
      'Photography workshop included'
    ],
    included: [
      'Premium 4WD with tracker',
      'Leopard tracking specialist',
      'Luxury tented safari camp',
      'Gourmet bush meals',
      'Night vision equipment',
      'Professional camera tips'
    ],
    destinations: ['Yala National Park', 'Wilpattu']
  },
  {
    id: 'blue-whale-watching',
    title: 'Blue Whale Watching Adventure',
    description: 'Encounter the ocean\'s giants - blue whales and dolphins in Mirissa, one of the world\'s best whale watching destinations.',
    destination: 'Mirissa',
    tour_type: 'wildlife',
    difficulty_level: 'easy',
    duration_days: 2,
    max_participants: 8,
    price_per_person: 160,
    images: [
      'https://images.unsplash.com/photo-1518877593221-1f28583780b4?w=800',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'
    ],
    is_active: true,
    ai_recommendation_score: 95,
    base_price: 160,
    currency: 'USD',
    min_participants: 2,
    category: 'wildlife',
    rating: 4.7,
    reviews: 94,
    highlights: [
      'Blue whale encounters',
      'Dolphin sightings',
      'Marine biologist guide',
      'Hydrophone whale listening',
      'Beachfront luxury resort'
    ],
    included: [
      'Private whale watching boat',
      'Marine biologist guide',
      'Beachfront luxury resort',
      'Breakfast & seafood dinner',
      'Photography assistance'
    ],
    destinations: ['Mirissa', 'Trincomalee']
  },
  // Multi-day Tour Packages
  {
    id: 'sri-lanka-highlights-tour',
    title: 'Sri Lanka Highlights - Best of the Island',
    description: 'Experience the very best of Sri Lanka in one comprehensive tour. From ancient temples to pristine beaches, tea plantations to wildlife safaris.',
    destination: 'Colombo, Sigiriya, Kandy, Ella, Yala, Galle',
    tour_type: 'cultural',
    difficulty_level: 'moderate',
    duration_days: 10,
    max_participants: 12,
    price_per_person: 1850,
    images: [
      'https://images.unsplash.com/photo-1588001400947-6385aef4ab0e?w=800',
      'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=800'
    ],
    is_active: true,
    ai_recommendation_score: 99,
    base_price: 1850,
    currency: 'USD',
    min_participants: 2,
    category: 'highlights',
    rating: 4.9,
    reviews: 234,
    highlights: [
      'Sigiriya Rock Fortress climb',
      'Temple of the Sacred Tooth',
      'Scenic train to Ella',
      'Yala National Park safari',
      'Galle Fort exploration',
      'Tea plantation visit'
    ],
    included: [
      'Boutique hotel accommodation',
      'All meals included',
      'Expert English-speaking guide',
      'Private air-conditioned vehicle',
      'All entrance fees',
      'Train tickets (Kandy-Ella)'
    ],
    destinations: ['Colombo', 'Sigiriya', 'Kandy', 'Nuwara Eliya', 'Ella', 'Yala', 'Galle']
  },
  {
    id: 'cultural-triangle-tour',
    title: 'Cultural Triangle Discovery',
    description: 'Explore Sri Lanka\'s ancient civilization through UNESCO World Heritage sites including Sigiriya, Anuradhapura, and Polonnaruwa.',
    destination: 'Colombo, Dambulla, Sigiriya, Polonnaruwa, Anuradhapura',
    tour_type: 'cultural',
    difficulty_level: 'moderate',
    duration_days: 5,
    max_participants: 10,
    price_per_person: 890,
    images: [
      'https://images.unsplash.com/photo-1588001400947-6385aef4ab0e?w=800',
      'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800'
    ],
    is_active: true,
    ai_recommendation_score: 94,
    base_price: 890,
    currency: 'USD',
    min_participants: 2,
    category: 'cultural',
    rating: 4.8,
    reviews: 112,
    highlights: [
      'Sigiriya Lion Rock Fortress',
      'Dambulla Cave Temple',
      'Ancient city of Polonnaruwa',
      'Sacred city of Anuradhapura',
      'Minneriya elephant safari'
    ],
    included: [
      'Heritage hotel accommodation',
      'All meals',
      'Expert cultural guide',
      'Private transport',
      'All UNESCO site entrance fees'
    ],
    destinations: ['Colombo', 'Dambulla', 'Sigiriya', 'Polonnaruwa', 'Anuradhapura']
  },
  {
    id: 'beach-and-wildlife-tour',
    title: 'Beach & Wildlife Paradise',
    description: 'Combine pristine southern beaches with thrilling wildlife safaris. Perfect for nature lovers seeking sun, sand, and wildlife.',
    destination: 'Colombo, Yala, Mirissa, Galle, Bentota',
    tour_type: 'adventure',
    difficulty_level: 'easy',
    duration_days: 7,
    max_participants: 10,
    price_per_person: 1250,
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800'
    ],
    is_active: true,
    ai_recommendation_score: 96,
    base_price: 1250,
    currency: 'USD',
    min_participants: 2,
    category: 'beach',
    rating: 4.8,
    reviews: 89,
    highlights: [
      'Yala leopard safari',
      'Whale watching in Mirissa',
      'Galle Fort sunset walk',
      'Beach relaxation',
      'Turtle hatchery visit'
    ],
    included: [
      'Beach resort accommodation',
      'All meals',
      'Safari jeep and guide',
      'Whale watching boat',
      'All entrance fees'
    ],
    destinations: ['Colombo', 'Yala', 'Mirissa', 'Galle', 'Bentota']
  },
  {
    id: 'tea-trails-experience',
    title: 'Tea Trails - Hill Country Explorer',
    description: 'Journey through Sri Lanka\'s stunning hill country, visiting tea plantations, colonial towns, and misty mountain landscapes.',
    destination: 'Kandy, Nuwara Eliya, Ella',
    tour_type: 'cultural',
    difficulty_level: 'easy',
    duration_days: 4,
    max_participants: 8,
    price_per_person: 680,
    images: [
      'https://images.unsplash.com/photo-1621164448191-a834de719ee4?w=800',
      'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=800'
    ],
    is_active: true,
    ai_recommendation_score: 93,
    base_price: 680,
    currency: 'USD',
    min_participants: 2,
    category: 'tea',
    rating: 4.7,
    reviews: 76,
    highlights: [
      'Tea factory tour and tasting',
      'Scenic train journey',
      'Nine Arch Bridge visit',
      'Horton Plains & World\'s End',
      'Colonial heritage sites'
    ],
    included: [
      'Tea estate bungalow stay',
      'All meals',
      'Train tickets',
      'Tea factory entrance',
      'Private transport',
      'Expert guide'
    ],
    destinations: ['Kandy', 'Nuwara Eliya', 'Ella']
  },
  {
    id: 'honeymoon-romantic-tour',
    title: 'Romantic Sri Lanka - Honeymoon Special',
    description: 'The perfect romantic getaway featuring luxury accommodations, private experiences, and Sri Lanka\'s most romantic destinations.',
    destination: 'Colombo, Kandy, Ella, Bentota',
    tour_type: 'luxury',
    difficulty_level: 'easy',
    duration_days: 8,
    max_participants: 2,
    price_per_person: 2400,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'
    ],
    is_active: true,
    ai_recommendation_score: 97,
    base_price: 2400,
    currency: 'USD',
    min_participants: 2,
    category: 'honeymoon',
    rating: 5.0,
    reviews: 48,
    highlights: [
      'Luxury suite accommodations',
      'Private candlelit dinners',
      'Couples spa treatments',
      'Private scenic train cabin',
      'Sunset cruise',
      'Champagne breakfast'
    ],
    included: [
      '5-star luxury hotels',
      'All gourmet meals',
      'Private chauffeur',
      'Couples spa session',
      'Romantic dinners',
      'Champagne & flowers'
    ],
    destinations: ['Colombo', 'Kandy', 'Ella', 'Bentota']
  },
  {
    id: 'budget-backpacker-tour',
    title: 'Budget Backpacker - Sri Lanka Explorer',
    description: 'Experience the best of Sri Lanka on a budget. Perfect for solo travelers and backpackers seeking authentic local experiences.',
    destination: 'Colombo, Kandy, Ella, Mirissa',
    tour_type: 'budget',
    difficulty_level: 'moderate',
    duration_days: 7,
    max_participants: 12,
    price_per_person: 450,
    images: [
      'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=800',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'
    ],
    is_active: true,
    ai_recommendation_score: 90,
    base_price: 450,
    currency: 'USD',
    min_participants: 1,
    category: 'budget',
    rating: 4.6,
    reviews: 203,
    highlights: [
      'Local guesthouse stays',
      'Public transport experiences',
      'Street food tours',
      'Free walking tours',
      'Beach time in Mirissa',
      'Ella hiking'
    ],
    included: [
      'Clean guesthouse accommodation',
      'Breakfast daily',
      'Train tickets',
      'Group activities',
      'Local guide',
      'Some entrance fees'
    ],
    destinations: ['Colombo', 'Kandy', 'Ella', 'Mirissa']
  }
]

// Get tours by category
export const getToursByCategory = (category: string): RechargeTour[] => {
  return rechargeTours.filter(tour => tour.category === category)
}

// Get featured tours
export const getFeaturedTours = (): RechargeTour[] => {
  return rechargeTours.filter(tour => tour.ai_recommendation_score && tour.ai_recommendation_score >= 95)
}

// Get tours by tour type
export const getToursByType = (type: Tour['tour_type']): RechargeTour[] => {
  return rechargeTours.filter(tour => tour.tour_type === type)
}

export default rechargeTours
