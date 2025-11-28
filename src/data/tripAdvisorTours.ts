export const RECHARGE_TRIPADVISOR_URL =
  'https://www.tripadvisor.com/Attraction_Review-g293962-d10049587-Reviews-Recharge_Travels_And_Tours-Colombo_Western_Province.html'

export type TripAdvisorRegion = 'north' | 'south' | 'east' | 'west' | 'central'

export interface TripAdvisorTour {
  id: string
  title: string
  priceUsd: number
  rating: number
  reviews: number
  region: TripAdvisorRegion
  location: string
  duration: string
  description: string
  image: string
  tripAdvisorUrl: string
  operator: string
  operatorProfileUrl: string
  badge?: string
}

const rechargeProfile = {
  operator: 'Recharge Travels & Tours',
  operatorProfileUrl: RECHARGE_TRIPADVISOR_URL
}

const baseTours = [
  {
    id: 'round-island-8d',
    title: '8 Days Amazing Round Tour of Sri Lanka',
    priceUsd: 1200,
    rating: 4.8,
    reviews: 234,
    region: 'central',
    location: 'Kandy, Sigiriya, Ella',
    duration: '8 days',
    description: 'Private transport, UNESCO heritage sites, tea country sunsets, and curated stays across the island.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop',
    tripAdvisorUrl: 'https://www.tripadvisor.com/AttractionProductReview-g1500185-d19498592',
    badge: 'Top Seller'
  },
  {
    id: 'sigiriya-kandy-3d',
    title: 'Sigiriya & Kandy Cultural Triangle',
    priceUsd: 450,
    rating: 4.7,
    reviews: 189,
    region: 'central',
    location: 'Sigiriya & Kandy',
    duration: '3 days',
    description: 'Ancient rock fortress, Kandy temple, spice gardens, and lakeside evenings with heritage cuisine.',
    image: 'https://images.unsplash.com/photo-1584612691490-ce2a3b0dd4ff?w=1200&auto=format&fit=crop',
    tripAdvisorUrl: 'https://www.tripadvisor.com/Attraction_Review-g304138'
  },
  {
    id: 'south-coast-3d',
    title: 'South Coast Beach Paradise',
    priceUsd: 350,
    rating: 4.6,
    reviews: 156,
    region: 'south',
    location: 'Mirissa, Unawatuna & Galle',
    duration: '3 days',
    description: 'Sunrise whale watching, colonial Galle walks, surf breaks, and golden hour catamarans.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop',
    tripAdvisorUrl: 'https://www.tripadvisor.com/Tourism-g293962'
  },
  {
    id: 'ella-tea-2d',
    title: 'Tea Plantations & Ella',
    priceUsd: 380,
    rating: 4.9,
    reviews: 267,
    region: 'central',
    location: 'Nuwara Eliya & Ella',
    duration: '2 days',
    description: 'Scenic rail journeys, waterfalls, and intimate tea tastings in the highlands.',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ee9c470a0?w=1200&auto=format&fit=crop',
    tripAdvisorUrl: 'https://www.tripadvisor.com/Tourism-g317149',
    badge: 'Guest Favorite'
  },
  {
    id: 'jaffna-north-4d',
    title: 'Northern Highlights - Jaffna & Mullaitivu',
    priceUsd: 520,
    rating: 4.5,
    reviews: 98,
    region: 'north',
    location: 'Jaffna Peninsula',
    duration: '4 days',
    description: 'Local cuisine, Delft Island day trip, kovils, and sunrise lagoons on Sri Lanka’s northern edge.',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop',
    tripAdvisorUrl: 'https://www.tripadvisor.com/Tourism-g1268700'
  },
  {
    id: 'west-coast-2d',
    title: 'West Coast Kalpitiya & Negombo',
    priceUsd: 280,
    rating: 4.4,
    reviews: 142,
    region: 'west',
    location: 'Kalpitiya & Negombo',
    duration: '2 days',
    description: 'Dolphin watching, kite sessions, and sunset seafood feasts on the lagoon.',
    image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200&auto=format&fit=crop',
    tripAdvisorUrl: 'https://www.tripadvisor.com/Tourism-g1268701'
  },
  {
    id: 'yala-arugam-3d',
    title: 'Yala Safari & Arugam Bay',
    priceUsd: 620,
    rating: 4.8,
    reviews: 203,
    region: 'east',
    location: 'Yala & Arugam Bay',
    duration: '3 days',
    description: 'Leopard tracking with master rangers plus surf, sand, and laid-back cafes at Arugam Bay.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&auto=format&fit=crop',
    tripAdvisorUrl: 'https://www.tripadvisor.com/Tourism-g1268702',
    badge: 'Wildlife'
  },
  {
    id: 'adams-peak-3d',
    title: "Adam's Peak & Nuwara Eliya",
    priceUsd: 420,
    rating: 4.7,
    reviews: 178,
    region: 'central',
    location: 'Hatton & Nuwara Eliya',
    duration: '3 days',
    description: 'Pre-dawn summit, misty tea valleys, and colonial hill station charm.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop',
    tripAdvisorUrl: 'https://www.tripadvisor.com/Tourism-g1268703'
  },
  {
    id: 'colombo-day-1d',
    title: 'Colombo City Tour & Beach Escape',
    priceUsd: 199,
    rating: 4.3,
    reviews: 121,
    region: 'west',
    location: 'Colombo & Mount Lavinia',
    duration: '1 day',
    description: 'Modern skyline, heritage lanes, street food tastings, and a quick dip by sunset.',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&auto=format&fit=crop',
    tripAdvisorUrl: 'https://www.tripadvisor.com/Tourism-g293962-a_2'
  },
  {
    id: 'horton-plains-2d',
    title: "Horton Plains & World's End",
    priceUsd: 380,
    rating: 4.8,
    reviews: 245,
    region: 'central',
    location: 'Horton Plains',
    duration: '2 days',
    description: 'Cloud forests, dawn hikes, and cliff-edge vistas with expert naturalists.',
    image: 'https://images.unsplash.com/photo-1470114716159-e389f8712fda?w=1200&auto=format&fit=crop',
    tripAdvisorUrl: 'https://www.tripadvisor.com/Tourism-g1268704'
  },
  {
    id: 'whale-watching-2d',
    title: 'Whale Watching & Dondra Head',
    priceUsd: 550,
    rating: 4.6,
    reviews: 134,
    region: 'south',
    location: 'Mirissa & Dondra',
    duration: '2 days',
    description: 'Blue whale sightings with marine biologists plus lighthouse sunsets.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop',
    tripAdvisorUrl: 'https://www.tripadvisor.com/Tourism-g1268705',
    badge: 'Marine'
  },
  {
    id: 'batticaloa-trinco-3d',
    title: 'Batticaloa Lagoon & Trincomalee',
    priceUsd: 480,
    rating: 4.5,
    reviews: 89,
    region: 'east',
    location: 'Batticaloa & Trincomalee',
    duration: '3 days',
    description: 'Glass-bottom lagoon rides, forts, and ancient temples with coastal breezes.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop',
    tripAdvisorUrl: 'https://www.tripadvisor.com/Tourism-g1268706'
  }
] satisfies Omit<TripAdvisorTour, 'operator' | 'operatorProfileUrl'>[]

export const tripAdvisorTours: TripAdvisorTour[] = baseTours.map((tour) => ({
  ...tour,
  ...rechargeProfile
}))
