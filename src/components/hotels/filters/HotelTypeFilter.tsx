
import React from 'react'
import { FilterOptions } from '@/types/hotel'
import { hotelTypes } from './constants'

interface HotelTypeFilterProps {
  filters: FilterOptions
  toggleArrayFilter: (key: 'starRating' | 'hotelType' | 'amenities', value: any) => void
}

const HotelTypeFilter: React.FC<HotelTypeFilterProps> = ({ filters, toggleArrayFilter }) => (
  <div className="grid grid-cols-1 gap-2">
    {hotelTypes.map(type => (
      <label key={type.value} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-all duration-150 hover:scale-[1.01]">
        <input
          type="checkbox"
          checked={filters.hotelType.includes(type.value)}
          onChange={() => toggleArrayFilter('hotelType', type.value)}
          className="mr-3 text-blue-600 focus:ring-blue-500 transition-colors"
        />
        <span className="mr-2 text-lg">{type.icon}</span>
        <span className="text-sm text-gray-700 flex-1">{type.label}</span>
        <span className={`px-2 py-1 rounded-full text-xs transition-all ${type.color}`}>
          {type.label.split(' ')[0]}
        </span>
      </label>
    ))}
  </div>
)

export default HotelTypeFilter
