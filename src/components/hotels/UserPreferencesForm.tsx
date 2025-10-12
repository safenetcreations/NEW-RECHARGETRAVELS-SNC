
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserPreferences } from '@/types/aiRecommendation'
import { Heart, DollarSign, Star, Home, MapPin } from 'lucide-react'

interface UserPreferencesFormProps {
  onPreferencesChange: (preferences: UserPreferences) => void
  onClose: () => void
  guests: { adults: number; children: number }
}

const UserPreferencesForm: React.FC<UserPreferencesFormProps> = ({
  onPreferencesChange,
  onClose,
  guests
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    budget_range: [100, 300],
    preferred_star_rating: [4],
    preferred_hotel_types: ['middle_range'],
    preferred_amenities: ['wifi', 'parking'],
    travel_style: 'family',
    group_size: guests.adults + guests.children,
    trip_duration: 3,
    location_preferences: []
  })

  const hotelTypes = [
    { value: 'luxury_resort', label: 'Luxury Resort', icon: '🏖️' },
    { value: 'cabana', label: 'Beach Cabana', icon: '🏕️' },
    { value: 'budget', label: 'Budget Hotel', icon: '🏨' },
    { value: 'middle_range', label: 'Mid-Range Hotel', icon: '🏩' },
    { value: 'boutique', label: 'Boutique Hotel', icon: '🏛️' }
  ]

  const amenities = [
    'WiFi', 'Swimming Pool', 'Spa', 'Gym', 'Restaurant', 
    'Bar', 'Parking', 'Business Center', 'Concierge', 'Pet Friendly'
  ]

  const travelStyles = [
    { value: 'luxury', label: 'Luxury', description: 'Premium experience, high-end amenities' },
    { value: 'budget', label: 'Budget', description: 'Cost-effective, essential amenities' },
    { value: 'family', label: 'Family', description: 'Family-friendly facilities' },
    { value: 'business', label: 'Business', description: 'Work-focused amenities' },
    { value: 'adventure', label: 'Adventure', description: 'Outdoor activities, unique experiences' }
  ]

  const handleStarRatingChange = (rating: number, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      preferred_star_rating: checked
        ? [...prev.preferred_star_rating, rating]
        : prev.preferred_star_rating.filter(r => r !== rating)
    }))
  }

  const handleHotelTypeChange = (type: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      preferred_hotel_types: checked
        ? [...prev.preferred_hotel_types, type]
        : prev.preferred_hotel_types.filter(t => t !== type)
    }))
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      preferred_amenities: checked
        ? [...prev.preferred_amenities, amenity]
        : prev.preferred_amenities.filter(a => a !== amenity)
    }))
  }

  const handleSubmit = () => {
    onPreferencesChange(preferences)
    onClose()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          Tell us your preferences
        </CardTitle>
        <p className="text-sm text-gray-600">
          Help our AI find the perfect hotel for your stay
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Budget Range */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Budget Range: ${preferences.budget_range[0]} - ${preferences.budget_range[1]} per night
          </Label>
          <Slider
            value={preferences.budget_range}
            onValueChange={(value) => setPreferences(prev => ({ ...prev, budget_range: value as [number, number] }))}
            max={1000}
            min={50}
            step={25}
            className="w-full"
          />
        </div>

        {/* Star Rating */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Preferred Star Rating
          </Label>
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((rating) => (
              <label key={rating} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={preferences.preferred_star_rating.includes(rating)}
                  onCheckedChange={(checked) => handleStarRatingChange(rating, checked as boolean)}
                />
                <div className="flex">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Travel Style */}
        <div className="space-y-3">
          <Label>Travel Style</Label>
          <Select 
            value={preferences.travel_style} 
            onValueChange={(value: any) => setPreferences(prev => ({ ...prev, travel_style: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your travel style" />
            </SelectTrigger>
            <SelectContent>
              {travelStyles.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  <div>
                    <div className="font-medium">{style.label}</div>
                    <div className="text-xs text-gray-500">{style.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Hotel Types */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Preferred Hotel Types
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {hotelTypes.map((type) => (
              <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={preferences.preferred_hotel_types.includes(type.value)}
                  onCheckedChange={(checked) => handleHotelTypeChange(type.value, checked as boolean)}
                />
                <span className="text-lg">{type.icon}</span>
                <span className="text-sm">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-3">
          <Label>Important Amenities</Label>
          <div className="grid grid-cols-2 gap-2">
            {amenities.map((amenity) => (
              <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={preferences.preferred_amenities.includes(amenity)}
                  onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                />
                <span className="text-sm">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Trip Duration */}
        <div className="space-y-3">
          <Label>Trip Duration: {preferences.trip_duration} nights</Label>
          <Slider
            value={[preferences.trip_duration]}
            onValueChange={(value) => setPreferences(prev => ({ ...prev, trip_duration: value[0] }))}
            max={14}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button onClick={handleSubmit} className="flex-1">
            Save Preferences
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default UserPreferencesForm
