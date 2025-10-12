
import React from 'react'
import { Star } from 'lucide-react'
import { FilterOptions } from '@/types/hotel'

interface StarRatingFilterProps {
  filters: FilterOptions
  toggleArrayFilter: (key: 'starRating' | 'hotelType' | 'amenities', value: any) => void
}

const StarRatingFilter: React.FC<StarRatingFilterProps> = ({ filters, toggleArrayFilter }) => (
  <div className="space-y-2">
    {[5, 4, 3, 2, 1].map(rating => (
      <label key={rating} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-all duration-150 hover:scale-[1.02]">
        <input
          type="checkbox"
          checked={filters.starRating.includes(rating)}
          onChange={() => toggleArrayFilter('starRating', rating)}
          className="mr-3 text-blue-600 focus:ring-blue-500 transition-colors"
        />
        <div className="flex items-center">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current transition-colors" />
          ))}
          {[...Array(5 - rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-gray-300 transition-colors" />
          ))}
          <span className="ml-2 text-sm text-gray-700">{rating} star{rating > 1 ? 's' : ''}</span>
        </div>
      </label>
    ))}
  </div>
)

export default StarRatingFilter
