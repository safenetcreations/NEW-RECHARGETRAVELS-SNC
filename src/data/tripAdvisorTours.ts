import { rawTripAdvisorTours } from './tripAdvisorToursRaw'
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

const getRegionFromString = (value: string): TripAdvisorRegion => {
  const v = value.toLowerCase()
  if (v.includes('jaffna') || v.includes('north')) return 'north'
  if (v.includes('east') || v.includes('batticaloa') || v.includes('trincomalee')) return 'east'
  if (v.includes('negombo') || v.includes('colombo') || v.includes('west')) return 'west'
  if (v.includes('south') || v.includes('mirissa')) return 'south'
  return 'central'
}

const fallbackImages: Record<TripAdvisorRegion, string> = {
  north: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop',
  south: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop',
  east: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&auto=format&fit=crop',
  west: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&auto=format&fit=crop',
  central: 'https://images.unsplash.com/photo-1501785888041-af3ee9c470a0?w=1200&auto=format&fit=crop'
}

const baseTours: Omit<TripAdvisorTour, 'operator' | 'operatorProfileUrl'>[] = rawTripAdvisorTours.map((tour, index) => {
  const region = getRegionFromString(tour.region)
  const priceUsd = tour.priceUSD ?? 0
  const rating = tour.rating ?? 0
  const image = tour.imageUrl || fallbackImages[region]

  return {
    id: `ta-${index}`,
    title: tour.title,
    priceUsd,
    rating,
    reviews: tour.reviews,
    region,
    location: tour.location,
    duration: tour.duration,
    description: tour.description,
    image,
    tripAdvisorUrl: tour.tripAdvisorUrl
  }
})

export const tripAdvisorTours: TripAdvisorTour[] = baseTours.map((tour) => ({
  ...tour,
  ...rechargeProfile
}))
