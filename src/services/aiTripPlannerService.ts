// AI Trip Planner Service - Generate personalized Sri Lanka itineraries

export interface TripPreferences {
  startDate: Date | null;
  endDate: Date | null;
  travelers: {
    adults: number;
    children: number;
  };
  interests: string[];
  budget: 'budget' | 'mid-range' | 'luxury' | 'ultra-luxury';
  pace: 'relaxed' | 'moderate' | 'active';
}

export interface DayItinerary {
  day: number;
  date: string;
  location: string;
  activities: {
    time: string;
    activity: string;
    description: string;
    duration: string;
    cost?: number;
  }[];
  accommodation: {
    name: string;
    type: string;
    rating: number;
    price: number;
  };
  meals: string[];
  tips: string[];
}

export interface GeneratedItinerary {
  title: string;
  summary: string;
  duration: number;
  highlights: string[];
  days: DayItinerary[];
  totalCost: {
    accommodation: number;
    activities: number;
    transport: number;
    meals: number;
    total: number;
  };
}

// Sri Lanka Destinations Database
const DESTINATIONS = {
  cultural: [
    { name: 'Sigiriya', description: 'Ancient Lion Rock Fortress', minDays: 1 },
    { name: 'Kandy', description: 'Temple of the Tooth & Cultural Capital', minDays: 1 },
    { name: 'Polonnaruwa', description: 'Ancient Kingdom Ruins', minDays: 0.5 },
    { name: 'Anuradhapura', description: 'Sacred Buddhist City', minDays: 0.5 },
    { name: 'Dambulla', description: 'Cave Temple Complex', minDays: 0.5 },
    { name: 'Galle', description: 'Historic Dutch Fort', minDays: 1 },
  ],
  wildlife: [
    { name: 'Yala National Park', description: 'Best Leopard Spotting', minDays: 1 },
    { name: 'Udawalawe', description: 'Elephant Paradise', minDays: 1 },
    { name: 'Minneriya', description: 'Elephant Gathering', minDays: 0.5 },
    { name: 'Wilpattu', description: 'Largest National Park', minDays: 1 },
    { name: 'Sinharaja', description: 'UNESCO Rainforest', minDays: 1 },
  ],
  beach: [
    { name: 'Mirissa', description: 'Whale Watching Paradise', minDays: 2 },
    { name: 'Unawatuna', description: 'Best Beach in Sri Lanka', minDays: 2 },
    { name: 'Bentota', description: 'Water Sports Haven', minDays: 2 },
    { name: 'Arugam Bay', description: 'Surfer\'s Paradise', minDays: 2 },
    { name: 'Trincomalee', description: 'East Coast Gem', minDays: 2 },
    { name: 'Tangalle', description: 'Secluded Beach Paradise', minDays: 2 },
  ],
  adventure: [
    { name: 'Ella', description: 'Hiking & Train Rides', minDays: 2 },
    { name: 'Adam\'s Peak', description: 'Sacred Sunrise Pilgrimage', minDays: 1 },
    { name: 'Kitulgala', description: 'White Water Rafting', minDays: 1 },
    { name: 'Knuckles Range', description: 'Mountain Trekking', minDays: 1 },
  ],
  nature: [
    { name: 'Nuwara Eliya', description: 'Tea Country & Cool Climate', minDays: 2 },
    { name: 'Horton Plains', description: 'World\'s End Viewpoint', minDays: 0.5 },
    { name: 'Haputale', description: 'Scenic Hill Station', minDays: 1 },
  ],
  train: [
    { name: 'Kandy to Ella', description: 'Most Scenic Train Journey', minDays: 0.5 },
    { name: 'Colombo to Galle', description: 'Coastal Railway', minDays: 0.5 },
  ],
};

// Budget multipliers
const BUDGET_MULTIPLIERS = {
  'budget': { accommodation: 30, meals: 15, activities: 0.8 },
  'mid-range': { accommodation: 80, meals: 30, activities: 1.0 },
  'luxury': { accommodation: 200, meals: 60, activities: 1.3 },
  'ultra-luxury': { accommodation: 500, meals: 100, activities: 1.5 },
};

// Generate itinerary based on preferences
export const generateAIItinerary = async (preferences: TripPreferences): Promise<GeneratedItinerary> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const { startDate, endDate, travelers, interests, budget, pace } = preferences;

  // Calculate trip duration
  const start = startDate || new Date();
  const end = endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  // Select destinations based on interests
  const selectedDestinations: { name: string; description: string; minDays: number }[] = [];

  interests.forEach(interest => {
    const category = DESTINATIONS[interest as keyof typeof DESTINATIONS];
    if (category) {
      // Add top destinations from each interest category
      const toAdd = pace === 'relaxed' ? 1 : pace === 'moderate' ? 2 : 3;
      selectedDestinations.push(...category.slice(0, toAdd));
    }
  });

  // If no interests selected, add popular destinations
  if (selectedDestinations.length === 0) {
    selectedDestinations.push(
      DESTINATIONS.cultural[0], // Sigiriya
      DESTINATIONS.cultural[1], // Kandy
      DESTINATIONS.beach[0],    // Mirissa
    );
  }

  // Remove duplicates and limit to trip duration
  const uniqueDestinations = [...new Map(selectedDestinations.map(d => [d.name, d])).values()];

  // Generate day-by-day itinerary
  const days: DayItinerary[] = [];
  const budgetConfig = BUDGET_MULTIPLIERS[budget];

  let currentDestIndex = 0;
  for (let i = 0; i < duration; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(currentDate.getDate() + i);

    const destination = uniqueDestinations[currentDestIndex % uniqueDestinations.length];

    days.push({
      day: i + 1,
      date: currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      location: destination.name,
      activities: generateActivities(destination.name, pace, i === 0, i === duration - 1),
      accommodation: {
        name: getAccommodation(destination.name, budget),
        type: budget === 'ultra-luxury' ? '5-Star Resort' : budget === 'luxury' ? '4-Star Hotel' : budget === 'mid-range' ? '3-Star Hotel' : 'Guesthouse',
        rating: budget === 'ultra-luxury' ? 5 : budget === 'luxury' ? 4 : budget === 'mid-range' ? 3 : 2,
        price: budgetConfig.accommodation,
      },
      meals: ['Breakfast included', budget !== 'budget' ? 'Lunch' : 'Self-arranged', 'Dinner'],
      tips: getTipsForDestination(destination.name),
    });

    // Move to next destination based on pace
    if (pace === 'active' || (i + 1) % 2 === 0) {
      currentDestIndex++;
    }
  }

  // Calculate costs
  const totalPeople = travelers.adults + travelers.children * 0.5;
  const accommodationCost = duration * budgetConfig.accommodation;
  const activitiesCost = Math.round(duration * 50 * budgetConfig.activities * totalPeople);
  const transportCost = Math.round(duration * 40 * totalPeople);
  const mealsCost = duration * budgetConfig.meals * totalPeople;

  return {
    title: `${duration}-Day Sri Lanka ${interests.length > 0 ? interests.join(' & ') : 'Discovery'} Adventure`,
    summary: `A ${pace} paced journey through ${uniqueDestinations.slice(0, 3).map(d => d.name).join(', ')} and more. Perfect for ${travelers.adults} adult${travelers.adults > 1 ? 's' : ''}${travelers.children > 0 ? ` and ${travelers.children} child${travelers.children > 1 ? 'ren' : ''}` : ''}.`,
    duration,
    highlights: uniqueDestinations.slice(0, 5).map(d => d.description),
    days,
    totalCost: {
      accommodation: Math.round(accommodationCost),
      activities: activitiesCost,
      transport: transportCost,
      meals: Math.round(mealsCost),
      total: Math.round(accommodationCost + activitiesCost + transportCost + mealsCost),
    },
  };
};

// Helper functions
function generateActivities(location: string, pace: string, isFirstDay: boolean, isLastDay: boolean) {
  const activities = [];

  if (isFirstDay) {
    activities.push({
      time: '10:00 AM',
      activity: 'Airport Pickup & Transfer',
      description: 'Private transfer from Colombo Airport',
      duration: '3-4 hours',
      cost: 60,
    });
  }

  // Location-specific activities
  const locationActivities: Record<string, any[]> = {
    'Sigiriya': [
      { time: '07:00 AM', activity: 'Sigiriya Rock Climb', description: 'Climb the ancient Lion Rock Fortress', duration: '3 hours', cost: 30 },
      { time: '04:00 PM', activity: 'Pidurangala Rock', description: 'Sunset views of Sigiriya', duration: '2 hours', cost: 5 },
    ],
    'Kandy': [
      { time: '09:00 AM', activity: 'Temple of the Tooth', description: 'Visit the sacred Buddhist temple', duration: '2 hours', cost: 15 },
      { time: '02:00 PM', activity: 'Royal Botanical Gardens', description: 'Beautiful orchid collection', duration: '2 hours', cost: 10 },
      { time: '05:00 PM', activity: 'Kandyan Dance Show', description: 'Traditional cultural performance', duration: '1.5 hours', cost: 15 },
    ],
    'Ella': [
      { time: '06:00 AM', activity: 'Little Adam\'s Peak Hike', description: 'Stunning sunrise views', duration: '2 hours', cost: 0 },
      { time: '10:00 AM', activity: 'Nine Arch Bridge', description: 'Iconic colonial-era railway bridge', duration: '1 hour', cost: 0 },
      { time: '02:00 PM', activity: 'Ravana Falls', description: 'Beautiful waterfall visit', duration: '1 hour', cost: 0 },
    ],
    'Yala National Park': [
      { time: '05:30 AM', activity: 'Morning Safari', description: 'Spot leopards, elephants, and more', duration: '4 hours', cost: 60 },
      { time: '03:00 PM', activity: 'Afternoon Safari', description: 'Evening wildlife watching', duration: '3 hours', cost: 50 },
    ],
    'Mirissa': [
      { time: '06:00 AM', activity: 'Whale Watching Tour', description: 'See blue whales and dolphins', duration: '4 hours', cost: 45 },
      { time: '12:00 PM', activity: 'Beach Relaxation', description: 'Enjoy golden sands and swimming', duration: '4 hours', cost: 0 },
    ],
    'Nuwara Eliya': [
      { time: '09:00 AM', activity: 'Tea Factory Tour', description: 'Learn about Ceylon tea production', duration: '2 hours', cost: 5 },
      { time: '02:00 PM', activity: 'Gregory Lake', description: 'Boat rides and lakeside walks', duration: '2 hours', cost: 5 },
    ],
  };

  const locationActs = locationActivities[location] || [
    { time: '09:00 AM', activity: `Explore ${location}`, description: 'Discover local attractions', duration: '3 hours', cost: 20 },
    { time: '02:00 PM', activity: 'Local Experience', description: 'Immerse in local culture', duration: '2 hours', cost: 15 },
  ];

  // Add activities based on pace
  const numActivities = pace === 'relaxed' ? 1 : pace === 'moderate' ? 2 : 3;
  activities.push(...locationActs.slice(0, numActivities));

  if (isLastDay) {
    activities.push({
      time: '02:00 PM',
      activity: 'Airport Transfer',
      description: 'Private transfer to Colombo Airport',
      duration: '3-4 hours',
      cost: 60,
    });
  }

  return activities;
}

function getAccommodation(location: string, budget: string) {
  const accommodations: Record<string, Record<string, string>> = {
    'Sigiriya': {
      'ultra-luxury': 'Water Garden Sigiriya',
      'luxury': 'Aliya Resort & Spa',
      'mid-range': 'Sigiriya Village Hotel',
      'budget': 'Sigiriya Guesthouse',
    },
    'Kandy': {
      'ultra-luxury': 'Earl\'s Regency Hotel',
      'luxury': 'Cinnamon Citadel',
      'mid-range': 'Thilanka Resort & Spa',
      'budget': 'McLeod Inn',
    },
    'Ella': {
      'ultra-luxury': '98 Acres Resort & Spa',
      'luxury': 'Ella Flower Garden Resort',
      'mid-range': 'Ella Jungle Resort',
      'budget': 'Ella Rock View Inn',
    },
    'Mirissa': {
      'ultra-luxury': 'Mandara Resort',
      'luxury': 'Paradise Beach Club',
      'mid-range': 'Crystal Beach Inn',
      'budget': 'Mirissa Beach House',
    },
  };

  return accommodations[location]?.[budget] || `${location} ${budget === 'ultra-luxury' ? 'Luxury Resort' : budget === 'luxury' ? 'Premium Hotel' : budget === 'mid-range' ? 'Comfortable Hotel' : 'Guesthouse'}`;
}

function getTipsForDestination(location: string) {
  const tips: Record<string, string[]> = {
    'Sigiriya': ['Start early to avoid crowds and heat', 'Bring plenty of water', 'Wear comfortable shoes'],
    'Kandy': ['Dress modestly for temple visits', 'Evening puja ceremony at 6:30 PM', 'Try local Kandyan cuisine'],
    'Ella': ['Book train tickets in advance', 'Best views from observation car', 'Carry rain gear'],
    'Yala National Park': ['Early morning safaris have best wildlife sightings', 'Bring binoculars', 'Wear neutral colors'],
    'Mirissa': ['Whale watching season: November to April', 'Book ahead for best boats', 'Carry sunscreen'],
  };

  return tips[location] || ['Carry local currency', 'Stay hydrated', 'Respect local customs'];
}

// Calculate trip duration in days
export const calculateTripDuration = (startDate: Date | null, endDate: Date | null): number => {
  if (!startDate || !endDate) return 7;
  return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
};

// Interest options
export const INTEREST_OPTIONS = [
  { id: 'cultural', label: 'Cultural & Heritage', icon: '🏛️', color: 'bg-amber-100 text-amber-700' },
  { id: 'wildlife', label: 'Wildlife & Safari', icon: '🐆', color: 'bg-orange-100 text-orange-700' },
  { id: 'beach', label: 'Beach & Relaxation', icon: '🏖️', color: 'bg-blue-100 text-blue-700' },
  { id: 'adventure', label: 'Adventure & Hiking', icon: '🥾', color: 'bg-green-100 text-green-700' },
  { id: 'nature', label: 'Nature & Tea Country', icon: '🍃', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'train', label: 'Scenic Train Rides', icon: '🚂', color: 'bg-purple-100 text-purple-700' },
];

// Budget options
export const BUDGET_OPTIONS = [
  { id: 'budget', label: 'Budget', description: 'Guesthouses & local transport', priceRange: '$50-80/day' },
  { id: 'mid-range', label: 'Mid-Range', description: '3-star hotels & private transport', priceRange: '$100-150/day' },
  { id: 'luxury', label: 'Luxury', description: '4-star hotels & premium experiences', priceRange: '$200-350/day' },
  { id: 'ultra-luxury', label: 'Ultra Luxury', description: '5-star resorts & exclusive experiences', priceRange: '$400+/day' },
];
