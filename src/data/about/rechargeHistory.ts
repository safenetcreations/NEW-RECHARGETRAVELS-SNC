export type TimelineEventType = 'success' | 'crisis' | 'milestone'

export interface TimelineEvent {
  id: string
  yearRange: string
  title: string
  description: string
  type: TimelineEventType
  highlights: string[]
  galleryPlaceholders: string[]
  location?: string
}

export interface CompanyStat {
  id: string
  label: string
  value: string
  supportingText?: string
}

export interface AchievementHighlight {
  id: string
  icon: string
  title: string
  description: string
}

export interface FleetVehicle {
  id: string
  name: string
  description: string
  imageLabel: string
  capacityNote?: string
}

export interface ReviewPlatform {
  id: string
  label: string
  icon: string
}

export interface CustomerReview {
  id: string
  rating: number
  quote: string
  author: string
  platform: string
}

export const heroStats: CompanyStat[] = [
  {
    id: 'years-of-service',
    label: 'Years of Service',
    value: '11+',
  },
  {
    id: 'vehicle-fleet',
    label: 'Vehicles',
    value: '50+',
  },
  {
    id: 'professional-drivers',
    label: 'Professional Drivers',
    value: '60+',
  },
  {
    id: 'travelers-served',
    label: 'Happy Travelers',
    value: '15,000+',
  },
]

export const timelineEvents: TimelineEvent[] = [
  {
    id: 'foundation-2014',
    yearRange: '2014',
    title: 'The Beginning',
    description:
      'Recharge Travels launches in Colombo with a vision to redefine Sri Lankan tourism through reliable transport services and curated travel experiences.',
    type: 'milestone',
    highlights: [
      'First operations hub opens in Colombo',
      'Focus on premium airport transfers and chauffeur services',
    ],
    galleryPlaceholders: ['First Office Photo', 'Founding Team'],
    location: 'Colombo, Sri Lanka',
  },
  {
    id: 'expansion-2015',
    yearRange: '2015',
    title: 'Expansion & Recognition',
    description:
      'Second office opens in Colombo Bambalapitiya and Recharge Travels earns official Sri Lanka Tourism Development Authority certification.',
    type: 'success',
    highlights: [
      'SLTDA certification secured',
      'Service network expands across Colombo',
    ],
    galleryPlaceholders: ['Tourism Board Certificate', 'Bambalapitiya Office'],
    location: 'Bambalapitiya, Colombo',
  },
  {
    id: 'katunayake-2018',
    yearRange: '2018',
    title: 'Major Milestone',
    description:
      'Flagship operations base opens on a 2-acre site near Bandaranaike International Airport, inaugurated by Tourism Minister John Amarathunga with MP Selvam Adaikalanathan.',
    type: 'success',
    highlights: [
      'Operations campus near CMB airport',
      'Fleet surpasses 50 vehicles',
      '60+ professional drivers onboarded',
    ],
    galleryPlaceholders: [
      'Grand Opening Ceremony',
      'Fleet at Katunayake',
      "Minister's Visit",
      'Operations Center',
    ],
    location: 'Katunayake, Sri Lanka',
  },
  {
    id: 'awards-2017-2019',
    yearRange: '2017-19',
    title: 'Excellence Recognized',
    description:
      'TripAdvisor Certificates of Excellence awarded three years running while Recharge Travels launches a northern hub in Jaffna and secures global platform partnerships.',
    type: 'success',
    highlights: [
      'TripAdvisor Certificates of Excellence (2017, 2018, 2019)',
      'Jaffna branch opens at Cargills Square',
      'Partnerships with GetTransfer and Booking.com',
    ],
    galleryPlaceholders: ['TripAdvisor Awards', 'Jaffna Branch'],
    location: 'Colombo & Jaffna',
  },
  {
    id: 'resilience-2019',
    yearRange: '2019',
    title: 'Crisis & Remarkable Recovery',
    description:
      'In the aftermath of the Easter Sunday attacks, Recharge Travels rebounds by supporting the Bohra Muslim community pilgrimage, mobilising 50 buses for 15,000 travellers.',
    type: 'crisis',
    highlights: [
      'Tourism demand collapses post-April attacks',
      'Rapid recovery through community support operations',
      'Logistics for 15,000 travellers delivered successfully',
    ],
    galleryPlaceholders: ['Bohra Event Fleet', 'Community Service'],
    location: 'Island-wide operations',
  },
  {
    id: 'pandemic-2020-2022',
    yearRange: '2020-22',
    title: 'Pandemic Challenges',
    description:
      'Extended airport closures halt tourism. Fleet losses and vandalism test the company, but the team perseveres and begins rebuilding as borders reopen in 2022.',
    type: 'crisis',
    highlights: [
      'Airport closed for an extended period',
      'Six months of curfew and asset losses',
      'Gradual relaunch as tourism restarts in 2022',
    ],
    galleryPlaceholders: ['Empty Airport', 'Team During Crisis'],
    location: 'Sri Lanka',
  },
  {
    id: 'economic-downturn-2022-2024',
    yearRange: '2022-24',
    title: 'Economic Challenges',
    description:
      "Sri Lanka's worst economic crisis pressures operations and fleet financing. Recharge Travels retains its core team and maintains customer commitments.",
    type: 'crisis',
    highlights: [
      'Economic instability increases operating costs',
      'Core operations protected despite pressure',
    ],
    galleryPlaceholders: ['Team Resilience', 'Adaptation Strategies'],
    location: 'Sri Lanka',
  },
  {
    id: 'comeback-2025',
    yearRange: '2025',
    title: 'The Phoenix Rises',
    description:
      'Recharge Travels returns to growth with renewed energy, repositioning as Sri Lanka’s premier tourist transport and experience operator.',
    type: 'success',
    highlights: [
      'Fleet revitalisation plan underway',
      'New concierge-driven guest experience',
    ],
    galleryPlaceholders: ['New Beginning', 'Future Vision'],
    location: 'Sri Lanka',
  },
]

export const achievementHighlights: AchievementHighlight[] = [
  {
    id: 'tripadvisor',
    icon: '🏆',
    title: 'TripAdvisor Excellence',
    description: 'Certificate of Excellence winner for 3 consecutive years (2017-2019)',
  },
  {
    id: 'partnerships',
    icon: '🤝',
    title: 'Major Partnerships',
    description: 'Trusted partner of GetTransfer, Booking.com, and other global platforms',
  },
  {
    id: 'operations',
    icon: '🚌',
    title: 'Large Scale Operations',
    description: 'Successfully managed transport for 15,000+ people in a single event',
  },
  {
    id: 'satisfaction',
    icon: '⭐',
    title: 'Customer Satisfaction',
    description: 'Thousands of positive reviews across all major platforms',
  },
  {
    id: 'airport-specialists',
    icon: '✈️',
    title: 'Airport Specialists',
    description: '24/7 airport transfer services with strategic location near CMB',
  },
  {
    id: 'coverage',
    icon: '🌍',
    title: 'Island-Wide Coverage',
    description: 'Operations in Colombo, Katunayake, and Jaffna',
  },
]

export const fleetVehicles: FleetVehicle[] = [
  {
    id: 'luxury-sedans',
    name: 'Luxury Sedans',
    description: 'Premium vehicles for executive travel and private transfers.',
    imageLabel: 'Luxury Car Photo',
  },
  {
    id: 'suvs',
    name: 'SUVs',
    description: 'Spacious SUVs ideal for family itineraries and long-distance tours.',
    imageLabel: 'SUV Photo',
  },
  {
    id: 'tourist-vans',
    name: 'Tourist Vans',
    description: 'Comfortable vans with ample luggage space for small groups.',
    imageLabel: 'Van Photo',
  },
  {
    id: 'tourist-buses',
    name: 'Tourist Buses',
    description: 'Large capacity coaches for events, pilgrimages, and corporate delegations.',
    imageLabel: 'Bus Photo',
  },
]

export const reviewPlatforms: ReviewPlatform[] = [
  { id: 'tripadvisor', label: 'TripAdvisor', icon: 'T' },
  { id: 'google', label: 'Google Reviews', icon: 'G' },
  { id: 'facebook', label: 'Facebook', icon: 'F' },
]

export const customerReviews: CustomerReview[] = [
  {
    id: 'tripadvisor-john',
    rating: 5,
    quote:
      'Excellent service! Professional drivers and well-maintained vehicles. Highly recommended for airport transfers.',
    author: 'John D.',
    platform: 'TripAdvisor',
  },
  {
    id: 'google-sarah',
    rating: 5,
    quote:
      'Used Recharge Travels for our family vacation. They made our Sri Lanka tour unforgettable!',
    author: 'Sarah M.',
    platform: 'Google',
  },
  {
    id: 'facebook-lakshmi',
    rating: 5,
    quote:
      'Exceptional coordination and friendly staff. They handled our large group with ease and professionalism.',
    author: 'Lakshmi P.',
    platform: 'Facebook',
  },
]
