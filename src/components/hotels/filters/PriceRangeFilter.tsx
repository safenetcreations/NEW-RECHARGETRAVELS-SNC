
import React from 'react'
import { FilterOptions } from '@/types/hotel'

interface PriceRangeFilterProps {
  filters: FilterOptions
  updateFilter: (key: keyof FilterOptions, value: any) => void
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({ filters, updateFilter }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between text-sm text-gray-600">
      <span>${filters.priceRange[0]}</span>
      <span>${filters.priceRange[1]}</span>
    </div>
    <div className="relative">
      <input
        type="range"
        min="0"
        max="1000"
        step="25"
        value={filters.priceRange[1]}
        onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider transition-all hover:bg-gray-300"
      />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div>
        <label className="block text-xs text-gray-600 mb-1">Min Price</label>
        <input
          type="number"
          value={filters.priceRange[0]}
          onChange={(e) => updateFilter('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="0"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-600 mb-1">Max Price</label>
        <input
          type="number"
          value={filters.priceRange[1]}
          onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 1000])}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="1000"
        />
      </div>
    </div>
  </div>
)

export default PriceRangeFilter
