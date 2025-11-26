
import React from 'react'
import { X } from 'lucide-react'
import { FilterOptions } from '@/types/hotel'
import { hotelTypes } from './constants'

interface ActiveFiltersSummaryProps {
  filters: FilterOptions
  activeFiltersCount: number
  toggleArrayFilter: (key: 'starRating' | 'hotelType' | 'amenities', value: any) => void
  updateFilter: (key: keyof FilterOptions, value: any) => void
}

const ActiveFiltersSummary: React.FC<ActiveFiltersSummaryProps> = ({
  filters,
  activeFiltersCount,
  toggleArrayFilter,
  updateFilter
}) => {
  if (activeFiltersCount === 0) return null

  return (
    <div className="mt-6 pt-6 border-t border-gray-200 animate-in slide-in-from-bottom-2 duration-300">
      <h4 className="text-sm font-medium text-gray-900 mb-3">Active Filters</h4>
      <div className="flex flex-wrap gap-2">
        {filters.starRating.map(rating => (
          <span key={`star-${rating}`} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 transition-all hover:scale-105">
            {rating} Star{rating > 1 ? 's' : ''}
            <button
              onClick={() => toggleArrayFilter('starRating', rating)}
              className="ml-1 text-yellow-600 hover:text-yellow-800 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        
        {filters.hotelType.map(type => (
          <span key={`type-${type}`} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 transition-all hover:scale-105">
            {hotelTypes.find(t => t.value === type)?.label}
            <button
              onClick={() => toggleArrayFilter('hotelType', type)}
              className="ml-1 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        
        {filters.amenities.slice(0, 3).map(amenity => (
          <span key={`amenity-${amenity}`} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 transition-all hover:scale-105">
            {amenity}
            <button
              onClick={() => toggleArrayFilter('amenities', amenity)}
              className="ml-1 text-green-600 hover:text-green-800 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        
        {filters.amenities.length > 3 && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 transition-all hover:scale-105">
            +{filters.amenities.length - 3} more amenities
          </span>
        )}

        {filters.searchQuery && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 transition-all hover:scale-105">
            Search: {filters.searchQuery.substring(0, 20)}{filters.searchQuery.length > 20 ? '...' : ''}
            <button
              onClick={() => updateFilter('searchQuery', '')}
              className="ml-1 text-purple-600 hover:text-purple-800 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}
      </div>
    </div>
  )
}

export default ActiveFiltersSummary
