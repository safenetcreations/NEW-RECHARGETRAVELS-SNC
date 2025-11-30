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
  images?: string[]
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
    images: [],
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
    images: [],
  },
  {
    id: 'growth-2016',
    yearRange: '2016',
    title: 'Growing Reputation',
    description:
      'Building a strong reputation across Sri Lanka with consistent quality service and expanding customer base.',
    type: 'success',
    highlights: [
      'Customer base grows significantly',
      'Positive reviews across platforms',
      'Team expansion',
    ],
    galleryPlaceholders: ['Team Photo', 'Happy Customers'],
    location: 'Colombo, Sri Lanka',
    images: [],
  },
  {
    id: 'awards-2017',
    yearRange: '2017',
    title: 'Award-Winning Service',
    description:
      'TripAdvisor Certificate of Excellence awarded, recognizing consistent high-quality service and customer satisfaction.',
    type: 'success',
    highlights: [
      'First TripAdvisor Certificate of Excellence',
      'Growing international clientele',
      'Enhanced fleet quality',
    ],
    galleryPlaceholders: ['TripAdvisor Award', 'Fleet Upgrade'],
    location: 'Colombo, Sri Lanka',
    images: [],
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
    images: [],
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
      'Jaffna branch opens at Cargills Square',
    ],
    galleryPlaceholders: ['Bohra Event Fleet', 'Community Service'],
    location: 'Island-wide operations',
    images: [],
  },
  {
    id: 'pandemic-2020',
    yearRange: '2020',
    title: 'Pandemic Begins',
    description:
      'COVID-19 pandemic hits Sri Lanka. Airport closures halt tourism operations but the team remains committed.',
    type: 'crisis',
    highlights: [
      'Airport closed for extended period',
      'Tourism industry shutdown',
      'Team remains committed through uncertainty',
    ],
    galleryPlaceholders: ['Empty Airport', 'Team Unity'],
    location: 'Sri Lanka',
    images: [],
  },
  {
    id: 'perseverance-2021',
    yearRange: '2021',
    title: 'Perseverance Through Crisis',
    description:
      'Extended lockdowns and curfews test the company. Fleet faces challenges but the core team perseveres.',
    type: 'crisis',
    highlights: [
      'Six months of curfew',
      'Maintaining fleet during closures',
      'Planning for recovery',
    ],
    galleryPlaceholders: ['Team During Crisis', 'Hope for Future'],
    location: 'Sri Lanka',
    images: [],
  },
  {
    id: 'restart-2022',
    yearRange: '2022',
    title: 'Economic Challenges & Restart',
    description:
      'Sri Lanka faces its worst economic crisis. As borders reopen, Recharge Travels begins rebuilding operations.',
    type: 'crisis',
    highlights: [
      'Economic instability increases operating costs',
      'Borders reopen for tourism',
      'Gradual relaunch of services',
    ],
    galleryPlaceholders: ['Reopening', 'Recovery Begins'],
    location: 'Sri Lanka',
    images: [],
  },
  {
    id: 'rebuilding-2023',
    yearRange: '2023',
    title: 'Rebuilding Momentum',
    description:
      'Tourism slowly returns to Sri Lanka. Recharge Travels retains its core team and maintains customer commitments.',
    type: 'milestone',
    highlights: [
      'Core operations protected',
      'Customer trust maintained',
      'Partnerships renewed',
    ],
    galleryPlaceholders: ['Team Resilience', 'Customer Service'],
    location: 'Sri Lanka',
    images: [],
  },
  {
    id: 'strengthening-2024',
    yearRange: '2024',
    title: 'Strengthening Position',
    description:
      'Recovery continues with renewed focus on quality service and customer experience excellence.',
    type: 'success',
    highlights: [
      'Fleet modernization begins',
      'Enhanced customer service',
      'Digital booking improvements',
    ],
    galleryPlaceholders: ['New Fleet', 'Digital Transformation'],
    location: 'Sri Lanka',
    images: [],
  },
  {
    id: 'comeback-2025',
    yearRange: '2025',
    title: 'The Phoenix Rises',
    description:
      "Recharge Travels returns to growth with renewed energy, repositioning as Sri Lanka's premier tourist transport and experience operator.",
    type: 'success',
    highlights: [
      'Fleet revitalisation plan underway',
      'New concierge-driven guest experience',
      'Expanded luxury services',
    ],
    galleryPlaceholders: ['New Beginning', 'Future Vision'],
    location: 'Sri Lanka',
    images: [],
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
