
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { firebaseTourService } from '@/services/firebaseTourService'
import { Tour, TourFilters } from '@/types/tour'
import { tripAdvisorTours } from '@/data/tripAdvisorTours'

// Convert TripAdvisor tours to match Tour interface
const staticTours: Tour[] = tripAdvisorTours.map((tour, index) => {
  // Parse duration to get days (e.g., "8 hours" -> 1 day, "2 days" -> 2)
  const durationMatch = tour.duration.match(/(\d+)\s*(day|hour)/i)
  let durationDays = 1
  if (durationMatch) {
    const num = parseInt(durationMatch[1])
    const unit = durationMatch[2].toLowerCase()
    durationDays = unit.includes('hour') ? 1 : num
  }

  // Map region to tour type
  const tourTypeMap: Record<string, Tour['tour_type']> = {
    north: 'cultural',
    south: 'adventure',
    east: 'adventure',
    west: 'luxury',
    central: 'cultural'
  }

  return {
    id: tour.id,
    title: tour.title,
    description: tour.description,
    destination: tour.location,
    tour_type: tourTypeMap[tour.region] || 'cultural',
    difficulty_level: 'moderate' as const,
    duration_days: durationDays,
    max_participants: 10,
    price_per_person: tour.priceUsd,
    images: [tour.image],
    is_active: true,
    ai_recommendation_score: tour.rating * 20,
    base_price: tour.priceUsd,
    currency: 'USD',
    min_participants: 1,
    category: tour.region,
    rating: tour.rating,
    reviews: tour.reviews
  } as Tour & { category: string; rating: number; reviews: number }
})

export const useTours = () => {
  const [filters, setFilters] = useState<TourFilters>({
    destination: '',
    tourType: '',
    difficulty: '',
    duration: '',
    priceRange: [0, 2000]
  })

  const { data: tours = [], isLoading, error } = useQuery({
    queryKey: ['tours'],
    queryFn: async () => {
      console.log('Fetching tours from Firebase...')
      const data = await firebaseTourService.getAllTours()
      console.log('Tours fetched:', data.length, 'tours')

      // Use static tours as fallback if Firebase returns empty
      if (!data || data.length === 0) {
        console.log('Using static TripAdvisor tours as fallback')
        return staticTours
      }
      return data
    }
  })

  const getFilteredTours = () => {
    let filtered = [...tours]

    if (filters.destination) {
      filtered = filtered.filter(tour => 
        tour.destination.toLowerCase().includes(filters.destination.toLowerCase())
      )
    }

    if (filters.tourType) {
      filtered = filtered.filter(tour => tour.category === filters.tourType)
    }

    if (filters.difficulty) {
      filtered = filtered.filter(tour => tour.difficulty_level === filters.difficulty)
    }

    if (filters.duration) {
      const [min, max] = filters.duration.split('-').map(Number)
      filtered = filtered.filter(tour => {
        if (max) {
          return tour.duration_days >= min && tour.duration_days <= max
        } else {
          return tour.duration_days >= min
        }
      })
    }

    filtered = filtered.filter(tour => 
      tour.price_per_person >= filters.priceRange[0] && 
      tour.price_per_person <= filters.priceRange[1]
    )

    return filtered
  }

  return {
    tours,
    filteredTours: getFilteredTours(),
    filters,
    setFilters,
    isLoading,
    error
  }
}
