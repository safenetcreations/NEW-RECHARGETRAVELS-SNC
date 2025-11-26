
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FilterOptions } from '@/types/hotel'
import { useQuery } from '@tanstack/react-query'
import { dbService, authService, storageService } from '@/lib/firebase-services'

interface HotelFiltersProps {
  filters: FilterOptions
  onFilterChange: (filters: Partial<FilterOptions>) => void
}

const HotelFilters: React.FC<HotelFiltersProps> = ({ filters, onFilterChange }) => {
  const handleStarRatingChange = (rating: number, checked: boolean) => {
    const newRatings = checked 
      ? [...filters.starRating, rating]
      : filters.starRating.filter(r => r !== rating)
    onFilterChange({ starRating: newRatings })
  }

  const handleHotelTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked 
      ? [...filters.hotelType, type]
      : filters.hotelType.filter(t => t !== type)
    onFilterChange({ hotelType: newTypes })
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const newAmenities = checked 
      ? [...filters.amenities, amenity]
      : filters.amenities.filter(a => a !== amenity)
    onFilterChange({ amenities: newAmenities })
  }

  // Fetch cities for location filter
  const { data: cities } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cities')
        .select('id, name')
        .order('name')
      
      if (error) throw error
      return data || []
    }
  })

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['hotel-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hotel_categories')
        .select('id, name')
        .order('name')
      
      if (error) throw error
      return data || []
    }
  })

  const starRatings = [1, 2, 3, 4, 5]
  const hotelTypes = [
    { value: 'luxury_resort', label: 'Luxury Resort' },
    { value: 'boutique', label: 'Boutique' },
    { value: 'middle_range', label: 'Mid-Range' },
    { value: 'budget', label: 'Budget' },
    { value: 'cabana', label: 'Cabana' }
  ]

  const commonAmenities = [
    'Free WiFi', 'Swimming Pool', 'Fitness Center', 'Spa Services',
    'Restaurant', 'Room Service', 'Airport Shuttle', 'Parking'
  ]

  return (
    <div className="space-y-6">
      {/* Star Rating Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Star Rating</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {starRatings.map(rating => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`star-${rating}`}
                checked={filters.starRating.includes(rating)}
                onCheckedChange={(checked) => handleStarRatingChange(rating, checked as boolean)}
              />
              <Label htmlFor={`star-${rating}`} className="flex items-center space-x-1">
                <span>{rating}</span>
                <span className="text-yellow-400">★</span>
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Hotel Type Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Hotel Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {hotelTypes.map(type => (
            <div key={type.value} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type.value}`}
                checked={filters.hotelType.includes(type.value)}
                onCheckedChange={(checked) => handleHotelTypeChange(type.value, checked as boolean)}
              />
              <Label htmlFor={`type-${type.value}`}>
                {type.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Price Range (per night)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => onFilterChange({ priceRange: value as [number, number] })}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Location</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={filters.cityId} onValueChange={(value) => onFilterChange({ cityId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities?.map(city => (
                <SelectItem key={city.id} value={city.id}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Category Filter */}
      {categories && categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Category</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={filters.categoryId} onValueChange={(value) => onFilterChange({ categoryId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Amenities Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Amenities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {commonAmenities.map(amenity => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={`amenity-${amenity}`}
                checked={filters.amenities.includes(amenity)}
                onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
              />
              <Label htmlFor={`amenity-${amenity}`}>
                {amenity}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default HotelFilters
