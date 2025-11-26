import { useState } from 'react'
import { Calendar, Users, CreditCard, Leaf } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { EcoTour, EcoAccommodation } from '@/hooks/useEcoTours'
import { format } from 'date-fns'

interface EcoBookingWidgetProps {
  tour: EcoTour
  accommodations?: EcoAccommodation[]
}

const EcoBookingWidget = ({ tour, accommodations }: EcoBookingWidgetProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [groupSize, setGroupSize] = useState(2)
  const [selectedAccommodation, setSelectedAccommodation] = useState('')
  const [selectedTier, setSelectedTier] = useState('standard')
  const selectedAccommodationDetails = accommodations?.find(
    (acc) => acc.id === selectedAccommodation
  )

  const calculateTotalPrice = () => {
    let basePrice = tour.price_per_person * groupSize
    
    // Apply tier pricing if available
    if (tour.pricing_tiers.length > 0) {
      const tierPricing = tour.pricing_tiers.find(tier => tier.tier === selectedTier)
      if (tierPricing) {
        basePrice = tierPricing.price * groupSize
      }
    }

    // Add accommodation if selected
    if (selectedAccommodation && accommodations) {
      const accommodation = accommodations.find(acc => acc.id === selectedAccommodation)
      if (accommodation) {
        basePrice += accommodation.price_per_night * tour.duration_days * groupSize
      }
    }

    return basePrice
  }

  const carbonOffset = tour.carbon_offset_kg * groupSize
  const treesPlanted = tour.trees_planted_per_booking * groupSize
  const communityDonation = (calculateTotalPrice() * tour.community_fund_percentage) / 100

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Leaf className="w-5 h-5 mr-2 text-green-600" />
          Book This Eco Tour
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                <Calendar className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Group Size */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Group Size</label>
          <Select value={groupSize.toString()} onValueChange={(value) => setGroupSize(parseInt(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: tour.group_size_max - tour.group_size_min + 1 }, (_, i) => (
                <SelectItem key={i} value={(tour.group_size_min + i).toString()}>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    {tour.group_size_min + i} {tour.group_size_min + i === 1 ? 'person' : 'people'}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Pricing Tiers */}
        {tour.pricing_tiers.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Experience Level</label>
            <Select value={selectedTier} onValueChange={setSelectedTier}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tour.pricing_tiers.map((tier) => (
                  <SelectItem key={tier.tier} value={tier.tier}>
                    <div className="flex flex-col">
                      <div className="font-medium capitalize">{tier.tier} Experience</div>
                      <div className="text-sm text-muted-foreground">
                        ${tier.price} per person
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Accommodation Selection */}
        {accommodations && accommodations.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Accommodation (Optional)</label>
            <Select value={selectedAccommodation} onValueChange={setSelectedAccommodation}>
              <SelectTrigger>
                <SelectValue placeholder="Select accommodation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No accommodation needed</SelectItem>
                {accommodations.map((accommodation) => (
                  <SelectItem key={accommodation.id} value={accommodation.id}>
                    <div className="flex flex-col">
                      <div className="font-medium">{accommodation.name}</div>
                      <div className="text-sm text-muted-foreground">
                        ${accommodation.price_per_night}/night • {accommodation.type.replace('_', ' ')}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Environmental Impact Preview */}
        <div className="p-3 bg-green-50 rounded-lg space-y-2">
          <div className="text-sm font-medium text-green-800">Your Environmental Impact</div>
          <div className="grid grid-cols-1 gap-1 text-xs text-green-700">
            {carbonOffset > 0 && (
              <div className="flex justify-between">
                <span>Carbon Offset:</span>
                <span className="font-medium">{carbonOffset}kg CO₂</span>
              </div>
            )}
            {treesPlanted > 0 && (
              <div className="flex justify-between">
                <span>Trees Planted:</span>
                <span className="font-medium">{treesPlanted} trees</span>
              </div>
            )}
            {communityDonation > 0 && (
              <div className="flex justify-between">
                <span>Community Fund:</span>
                <span className="font-medium">${communityDonation.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Price Summary */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Tour Price ({groupSize} people)</span>
            <span>${(tour.price_per_person * groupSize).toFixed(2)}</span>
          </div>
          
          {selectedAccommodationDetails && (
            <div className="flex justify-between text-sm">
              <span>Accommodation ({tour.duration_days} nights)</span>
              <span>
                ${(selectedAccommodationDetails.price_per_night * tour.duration_days * groupSize).toFixed(2)}
              </span>
            </div>
          )}
          
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>
            <span className="text-primary">${calculateTotalPrice().toFixed(2)}</span>
          </div>
        </div>

        {/* Booking Button */}
        <Button 
          className="w-full" 
          size="lg"
          disabled={!selectedDate}
        >
          <CreditCard className="w-4 h-4 mr-2" />
          {selectedDate ? 'Book Now' : 'Select Date to Book'}
        </Button>

        <div className="text-xs text-center text-muted-foreground">
          Free cancellation up to 48 hours before the tour
        </div>
      </CardContent>
    </Card>
  )
}

export default EcoBookingWidget
