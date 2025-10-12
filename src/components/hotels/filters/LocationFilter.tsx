
import React from 'react'
import { MapPin } from 'lucide-react'
import { FilterOptions } from '@/types/hotel'

interface LocationFilterProps {
  filters: FilterOptions
  updateFilter: (key: keyof FilterOptions, value: any) => void
  cities?: Array<{ id: string; name: string }>
}

const LocationFilter: React.FC<LocationFilterProps> = ({ filters, updateFilter, cities = [] }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    console.log('Location search changed:', value)
    updateFilter('searchQuery', value)
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Search Sri Lankan Hotels</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400 transition-colors" />
          <input
            type="text"
            placeholder="Search hotels by name, location, or description..."
            value={filters.searchQuery || ''}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>
      
      {cities.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sri Lankan Cities</label>
          <select
            value={filters.cityId || ''}
            onChange={(e) => updateFilter('cityId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="">All Cities in Sri Lanka</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}

export default LocationFilter
