
import React from 'react'
import { FilterOptions } from '@/types/hotel'
import { accessibilityOptions, propertyFeatures } from './constants'

interface AdvancedFiltersSectionProps {
  filters: FilterOptions
  toggleArrayFilter: (key: 'starRating' | 'hotelType' | 'amenities', value: any) => void
}

const AdvancedFiltersSection: React.FC<AdvancedFiltersSectionProps> = ({ 
  filters, 
  toggleArrayFilter 
}) => (
  <div className="space-y-6">
    {/* Property Features */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Property Features</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {propertyFeatures.map(feature => (
          <label key={feature} className="flex items-center text-sm transition-all hover:scale-[1.01]">
            <input
              type="checkbox"
              checked={filters.amenities.includes(feature)}
              onChange={() => toggleArrayFilter('amenities', feature)}
              className="mr-2 text-blue-600 focus:ring-blue-500 transition-colors"
            />
            {feature}
          </label>
        ))}
      </div>
    </div>

    {/* Accessibility */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Accessibility</label>
      <div className="space-y-2">
        {accessibilityOptions.map(option => (
          <label key={option} className="flex items-center text-sm transition-all hover:scale-[1.01]">
            <input
              type="checkbox"
              checked={filters.amenities.includes(option)}
              onChange={() => toggleArrayFilter('amenities', option)}
              className="mr-2 text-blue-600 focus:ring-blue-500 transition-colors"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  </div>
)

export default AdvancedFiltersSection
