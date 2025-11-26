
import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { useHotelData } from './hooks/useHotelData'
import { Hotel } from '@/types/hotel'
import type { FiltersState } from './types/filterTypes'
import HotelSearchResults from './HotelSearchResults'
import HotelFilters from './HotelFilters'

interface HotelSearchProps {
  initialSearchQuery?: string
  cityId?: string
}

const HotelSearch: React.FC<HotelSearchProps> = ({
  initialSearchQuery = '',
  cityId
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [filters, setFilters] = useState<FiltersState>({
    starRating: [],
    hotelType: [],
    priceRange: [0, 1000],
    amenities: [],
    location: ''
  })

  const { hotels, loading, usingGoogleAPI, refetch } = useHotelData(searchQuery, filters)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    refetch()
  }

  const handleFilterChange = (newFilters: FiltersState) => {
    setFilters(newFilters)
  }

  // Convert FiltersState to FilterOptions for HotelFilters component
  const filterOptions = {
    starRating: filters.starRating,
    hotelType: filters.hotelType,
    priceRange: filters.priceRange,
    amenities: filters.amenities,
    cityId: cityId || '',
    searchQuery: searchQuery
  }

  const handleFilterOptionsChange = (newFilterOptions: any) => {
    setFilters({
      starRating: newFilterOptions.starRating || [],
      hotelType: newFilterOptions.hotelType || [],
      priceRange: newFilterOptions.priceRange || [0, 1000],
      amenities: newFilterOptions.amenities || [],
      location: newFilterOptions.location || ''
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Hotels in Sri Lanka</h1>
        
        <form onSubmit={handleSearch} className="flex gap-4 mb-6">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search hotels, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12"
            />
          </div>
          <Button type="submit" className="h-12 px-6">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <HotelFilters filters={filterOptions} onFilterChange={handleFilterOptionsChange} />
        </div>
        
        <div className="lg:col-span-3">
          <HotelSearchResults
            hotels={hotels}
            loading={loading}
            searchQuery={searchQuery}
            usingGoogleAPI={usingGoogleAPI}
          />
        </div>
      </div>
    </div>
  )
}

export default HotelSearch
