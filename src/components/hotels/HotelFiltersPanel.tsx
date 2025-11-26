
import React from 'react'
import StarRating from './StarRating'

interface FiltersState {
  starRating: number[]
  hotelType: string[]
  priceRange: [number, number]
  amenities: string[]
  location: string
}

interface HotelFiltersPanelProps {
  filters: FiltersState
  onFiltersChange: (filters: FiltersState) => void
  showFilters: boolean
}

const HotelFiltersPanel: React.FC<HotelFiltersPanelProps> = ({
  filters,
  onFiltersChange,
  showFilters
}) => {
  const hotelTypes = [
    { value: 'luxury_resort', label: 'Luxury Resort', icon: '🏖️' },
    { value: 'cabana', label: 'Cabana', icon: '🏕️' },
    { value: 'budget', label: 'Budget Hotel', icon: '🏨' },
    { value: 'middle_range', label: 'Mid-Range Hotel', icon: '🏩' },
    { value: 'boutique', label: 'Boutique Hotel', icon: '🏛️' }
  ]

  const amenitiesList = [
    'WiFi', 'Swimming Pool', 'Spa', 'Gym', 'Restaurant', 
    'Bar', 'Parking', 'Pet Friendly', 'Business Center', 'Concierge'
  ]

  const handleStarRatingChange = (rating: number, checked: boolean) => {
    const newStarRating = checked
      ? [...filters.starRating, rating]
      : filters.starRating.filter(r => r !== rating)
    
    onFiltersChange({ ...filters, starRating: newStarRating })
  }

  const handleHotelTypeChange = (type: string, checked: boolean) => {
    const newHotelType = checked
      ? [...filters.hotelType, type]
      : filters.hotelType.filter(t => t !== type)
    
    onFiltersChange({ ...filters, hotelType: newHotelType })
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const newAmenities = checked
      ? [...filters.amenities, amenity]
      : filters.amenities.filter(a => a !== amenity)
    
    onFiltersChange({ ...filters, amenities: newAmenities })
  }

  const clearFilters = () => {
    onFiltersChange({
      starRating: [],
      hotelType: [],
      priceRange: [0, 1000],
      amenities: [],
      location: ''
    })
  }

  if (!showFilters) return null

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4">Filter Hotels</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Star Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Star Rating</label>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <label key={rating} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.starRating.includes(rating)}
                  onChange={(e) => handleStarRatingChange(rating, e.target.checked)}
                  className="mr-2"
                />
                <StarRating rating={rating} />
              </label>
            ))}
          </div>
        </div>

        {/* Hotel Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Type</label>
          <div className="space-y-2">
            {hotelTypes.map((type) => (
              <label key={type.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.hotelType.includes(type.value)}
                  onChange={(e) => handleHotelTypeChange(type.value, e.target.checked)}
                  className="mr-2"
                />
                <span className="mr-2">{type.icon}</span>
                <span className="text-sm">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
          </label>
          <input
            type="range"
            min="0"
            max="1000"
            step="50"
            value={filters.priceRange[1]}
            onChange={(e) => onFiltersChange({
              ...filters, 
              priceRange: [filters.priceRange[0], parseInt(e.target.value)]
            })}
            className="w-full"
          />
        </div>

        {/* Amenities Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {amenitiesList.map((amenity) => (
              <label key={amenity} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.amenities.includes(amenity)}
                  onChange={(e) => handleAmenityChange(amenity, e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">{amenity}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex gap-4">
        <button
          onClick={clearFilters}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
}

export default HotelFiltersPanel
