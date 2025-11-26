
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { firebaseTourService } from '@/services/firebaseTourService'
import { TourFilters } from '@/types/tour'

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
      console.log('Tours fetched:', data)
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
