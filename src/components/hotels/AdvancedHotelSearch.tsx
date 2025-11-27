import React, { useState, useEffect } from 'react'
import { Calendar, Users, MapPin, Search, Filter, X, Star, Wifi, Car, Utensils, Dumbbell, Waves } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns'

interface HotelSearchFilters {
  location: string
  checkIn: Date | undefined
  checkOut: Date | undefined
  guests: {
    adults: number
    children: number
    rooms: number
  }
  priceRange: [number, number]
  starRating: number[]
  amenities: string[]
  hotelType: string[]
  sortBy: string
}

interface AdvancedHotelSearchProps {
  onSearch: (filters: HotelSearchFilters) => void
  initialFilters?: Partial<HotelSearchFilters>
  className?: string
}

const AdvancedHotelSearch: React.FC<AdvancedHotelSearchProps> = ({
  onSearch,
  initialFilters,
  className = ''
}) => {
  const [filters, setFilters] = useState<HotelSearchFilters>({
    location: initialFilters?.location || '',
    checkIn: initialFilters?.checkIn,
    checkOut: initialFilters?.checkOut,
    guests: initialFilters?.guests || { adults: 2, children: 0, rooms: 1 },
    priceRange: initialFilters?.priceRange || [0, 1000],
    starRating: initialFilters?.starRating || [],
    amenities: initialFilters?.amenities || [],
    hotelType: initialFilters?.hotelType || [],
    sortBy: initialFilters?.sortBy || 'recommended'
  })

  const [showPriceAlert, setShowPriceAlert] = useState(false)
  const [priceAlertEmail, setPriceAlertEmail] = useState('')
  const [searchRadius, setSearchRadius] = useState(50) // km
  const [propertyType, setPropertyType] = useState<string[]>([])
  const [bedroomCount, setBedroomCount] = useState<number[]>([])
  const [showMapSearch, setShowMapSearch] = useState(false)

  const amenities = [
    { id: 'wifi', label: 'Free WiFi', icon: Wifi },
    { id: 'parking', label: 'Free Parking', icon: Car },
    { id: 'restaurant', label: 'Restaurant', icon: Utensils },
    { id: 'gym', label: 'Fitness Center', icon: Dumbbell },
    { id: 'pool', label: 'Swimming Pool', icon: Waves },
    { id: 'spa', label: 'Spa & Wellness', icon: '🧖' },
    { id: 'beach', label: 'Beach Access', icon: '🏖️' },
    { id: 'pets', label: 'Pet Friendly', icon: '🐕' },
    { id: 'bar', label: 'Bar/Lounge', icon: '🍸' },
    { id: 'room_service', label: 'Room Service', icon: '🛎️' },
    { id: 'concierge', label: 'Concierge', icon: '👨‍💼' },
    { id: 'laundry', label: 'Laundry Service', icon: '👔' },
    { id: 'business', label: 'Business Center', icon: '💼' },
    { id: 'airport', label: 'Airport Shuttle', icon: '✈️' },
    { id: 'breakfast', label: 'Free Breakfast', icon: '🥐' }
  ]

  const propertyTypes = [
    { id: 'hotel', label: 'Hotel' },
    { id: 'resort', label: 'Resort' },
    { id: 'villa', label: 'Villa' },
    { id: 'apartment', label: 'Apartment' },
    { id: 'guesthouse', label: 'Guesthouse' },
    { id: 'bungalow', label: 'Bungalow' },
    { id: 'lodge', label: 'Lodge' },
    { id: 'hostel', label: 'Hostel' }
  ]

  const bedroomOptions = [
    { id: 1, label: '1 Bedroom' },
    { id: 2, label: '2 Bedrooms' },
    { id: 3, label: '3 Bedrooms' },
    { id: 4, label: '4+ Bedrooms' }
  ]

  const hotelTypes = [
    { id: 'luxury_resort', label: 'Luxury Resort' },
    { id: 'boutique', label: 'Boutique Hotel' },
    { id: 'business', label: 'Business Hotel' },
    { id: 'budget', label: 'Budget Hotel' },
    { id: 'apartment', label: 'Serviced Apartment' },
    { id: 'villa', label: 'Private Villa' },
    { id: 'cabana', label: 'Beach Cabana/Bungalow' },
    { id: 'guesthouse', label: 'Guesthouse' },
    { id: 'eco_lodge', label: 'Eco Lodge' },
    { id: 'middle_range', label: 'Mid-Range Hotel' }
  ]

  const sortOptions = [
    { value: 'recommended', label: 'Recommended' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'distance', label: 'Distance' },
    { value: 'popularity', label: 'Most Popular' }
  ]

  const handleSearch = () => {
    onSearch(filters)
  }

  const updateFilter = (key: keyof HotelSearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const toggleAmenity = (amenityId: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }))
  }

  const toggleHotelType = (typeId: string) => {
    setFilters(prev => ({
      ...prev,
      hotelType: prev.hotelType.includes(typeId)
        ? prev.hotelType.filter(id => id !== typeId)
        : [...prev.hotelType, typeId]
    }))
  }

  const toggleStarRating = (rating: number) => {
    setFilters(prev => ({
      ...prev,
      starRating: prev.starRating.includes(rating)
        ? prev.starRating.filter(r => r !== rating)
        : [...prev.starRating, rating]
    }))
  }

  const GuestSelector = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-12 px-4 justify-start text-left font-normal">
          <Users className="mr-2 h-4 w-4" />
          {filters.guests.adults + filters.guests.children} guests, {filters.guests.rooms} room
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Adults</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateFilter('guests', { ...filters.guests, adults: Math.max(1, filters.guests.adults - 1) })}
              >
                -
              </Button>
              <span className="w-8 text-center">{filters.guests.adults}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateFilter('guests', { ...filters.guests, adults: filters.guests.adults + 1 })}
              >
                +
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>Children</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateFilter('guests', { ...filters.guests, children: Math.max(0, filters.guests.children - 1) })}
              >
                -
              </Button>
              <span className="w-8 text-center">{filters.guests.children}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateFilter('guests', { ...filters.guests, children: filters.guests.children + 1 })}
              >
                +
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>Rooms</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateFilter('guests', { ...filters.guests, rooms: Math.max(1, filters.guests.rooms - 1) })}
              >
                -
              </Button>
              <span className="w-8 text-center">{filters.guests.rooms}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateFilter('guests', { ...filters.guests, rooms: filters.guests.rooms + 1 })}
              >
                +
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )

  return (
    <div className={`bg-white rounded-xl shadow-lg border p-6 ${className}`}>
      {/* Main Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Location */}
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Where are you going?"
            value={filters.location}
            onChange={(e) => updateFilter('location', e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Check-in */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-12 px-4 justify-start text-left font-normal">
              <Calendar className="mr-2 h-4 w-4" />
              {filters.checkIn ? format(filters.checkIn, 'MMM dd') : 'Check-in'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent
              mode="single"
              selected={filters.checkIn}
              onSelect={(date) => updateFilter('checkIn', date)}
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>

        {/* Check-out */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-12 px-4 justify-start text-left font-normal">
              <Calendar className="mr-2 h-4 w-4" />
              {filters.checkOut ? format(filters.checkOut, 'MMM dd') : 'Check-out'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent
              mode="single"
              selected={filters.checkOut}
              onSelect={(date) => updateFilter('checkOut', date)}
              disabled={(date) => date < (filters.checkIn || new Date())}
            />
          </PopoverContent>
        </Popover>

        {/* Guests */}
        <GuestSelector />
      </div>

      {/* Search Button and Advanced Filters Toggle */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Advanced Filters</span>
          {(filters.starRating.length > 0 || filters.amenities.length > 0 || filters.hotelType.length > 0) && (
            <Badge variant="secondary" className="ml-2">
              {filters.starRating.length + filters.amenities.length + filters.hotelType.length}
            </Badge>
          )}
        </Button>

        <Button onClick={handleSearch} size="lg" className="px-8">
          <Search className="mr-2 h-4 w-4" />
          Search Hotels
        </Button>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="mt-6 pt-6 border-t space-y-6">
          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Property Type</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {propertyTypes.map((type) => (
                <label key={type.id} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={propertyType.includes(type.id)}
                    onCheckedChange={() => {
                      setPropertyType(prev =>
                        prev.includes(type.id)
                          ? prev.filter(id => id !== type.id)
                          : [...prev, type.id]
                      )
                    }}
                  />
                  <span className="text-sm">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Bedrooms (for villas/apartments) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Bedrooms</label>
            <div className="flex flex-wrap gap-2">
              {bedroomOptions.map((option) => (
                <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={bedroomCount.includes(option.id)}
                    onCheckedChange={() => {
                      setBedroomCount(prev =>
                        prev.includes(option.id)
                          ? prev.filter(id => id !== option.id)
                          : [...prev, option.id]
                      )
                    }}
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]} per night
            </label>
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilter('priceRange', value)}
              max={2000}
              min={0}
              step={50}
              className="w-full"
            />
          </div>

          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Star Rating</label>
            <div className="flex flex-wrap gap-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => toggleStarRating(rating)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg border transition-colors ${
                    filters.starRating.includes(rating)
                      ? 'bg-yellow-100 border-yellow-300 text-yellow-800'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                  <span className="text-sm font-medium">{rating}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hotel Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Accommodation Type</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {hotelTypes.map((type) => (
                <label key={type.id} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={filters.hotelType.includes(type.id)}
                    onCheckedChange={() => toggleHotelType(type.id)}
                  />
                  <span className="text-sm">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Amenities</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {amenities.map((amenity) => (
                <label key={amenity.id} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={filters.amenities.includes(amenity.id)}
                    onCheckedChange={() => toggleAmenity(amenity.id)}
                  />
                  <span className="text-sm flex items-center">
                    {typeof amenity.icon === 'string' ? amenity.icon : <amenity.icon className="h-4 w-4 mr-1" />}
                    {amenity.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Search Radius */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Search Radius: {searchRadius} km
            </label>
            <Slider
              value={[searchRadius]}
              onValueChange={(value) => setSearchRadius(value[0])}
              max={500}
              min={1}
              step={10}
              className="w-full"
            />
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Sort By</label>
            <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Alert */}
          <div className="border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setShowPriceAlert(!showPriceAlert)}
              className="w-full mb-3"
            >
              🔔 Set Price Alert
            </Button>
            {showPriceAlert && (
              <div className="space-y-3">
                <Input
                  placeholder="Enter your email"
                  value={priceAlertEmail}
                  onChange={(e) => setPriceAlertEmail(e.target.value)}
                  type="email"
                />
                <Button
                  onClick={() => {
                    alert(`Price alert set for ${priceAlertEmail}! We'll notify you when prices drop.`)
                    setShowPriceAlert(false)
                    setPriceAlertEmail('')
                  }}
                  disabled={!priceAlertEmail}
                  className="w-full"
                >
                  Set Alert
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdvancedHotelSearch