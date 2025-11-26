
import React from 'react'
import { FilterOptions } from '@/types/hotel'
import { AmenityConfig } from './types'

interface AmenitiesFilterProps {
  filters: FilterOptions
  amenitiesConfig: AmenityConfig[]
  toggleArrayFilter: (key: 'starRating' | 'hotelType' | 'amenities', value: any) => void
}

const AmenitiesFilter: React.FC<AmenitiesFilterProps> = ({ 
  filters, 
  amenitiesConfig, 
  toggleArrayFilter 
}) => {
  const categories = [...new Set(amenitiesConfig.map(a => a.category))]
  
  return (
    <div className="space-y-4">
      {categories.map(category => (
        <div key={category}>
          <h4 className="text-sm font-medium text-gray-900 mb-2 capitalize">{category}</h4>
          <div className="grid grid-cols-1 gap-1">
            {amenitiesConfig
              .filter(amenity => amenity.category === category)
              .map(amenity => {
                const IconComponent = amenity.icon
                return (
                  <label key={amenity.value} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-all duration-150 hover:scale-[1.01]">
                    <input
                      type="checkbox"
                      checked={filters.amenities.includes(amenity.value)}
                      onChange={() => toggleArrayFilter('amenities', amenity.value)}
                      className="mr-3 text-blue-600 focus:ring-blue-500 transition-colors"
                    />
                    <IconComponent className="w-4 h-4 mr-2 text-gray-600 transition-colors" />
                    <span className="text-sm text-gray-700">{amenity.label}</span>
                  </label>
                )
              })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AmenitiesFilter
