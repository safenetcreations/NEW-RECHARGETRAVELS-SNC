import { useState } from 'react'
import { Calendar, Users, Zap, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { PhotographyTour } from '@/hooks/usePhotographyTours'

interface PhotographyBookingWidgetProps {
  tour: PhotographyTour
}

const PhotographyBookingWidget = ({ tour }: PhotographyBookingWidgetProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [packageType, setPackageType] = useState<'standard' | 'pro'>('standard')
  const [groupSize, setGroupSize] = useState(1)
  const [gearRentals, setGearRentals] = useState<string[]>([])

  const currentPrice = packageType === 'pro' ? tour.price_pro || tour.price_standard : tour.price_standard
  const gearRentalCost = gearRentals.reduce((total, gearId) => {
    if (tour.gear_options && Array.isArray(tour.gear_options)) {
      const gear = tour.gear_options.find(g => g.item === gearId)
      return total + (gear?.price || 0)
    }
    return total
  }, 0)
  const totalPrice = (currentPrice * groupSize) + gearRentalCost

  const handleGearRentalToggle = (gearItem: string) => {
    setGearRentals(prev => 
      prev.includes(gearItem) 
        ? prev.filter(g => g !== gearItem)
        : [...prev, gearItem]
    )
  }

  const handleBooking = () => {
    // Implement booking logic here
    console.log('Booking:', {
      tour: tour.slug,
      date: selectedDate,
      packageType,
      groupSize,
      gearRentals,
      totalPrice
    })
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Book This Photography Tour
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Package Selection */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Select Package
          </label>
          <div className="grid grid-cols-1 gap-3">
            <div 
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                packageType === 'standard' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setPackageType('standard')}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-foreground">Standard Package</h4>
                  <p className="text-sm text-muted-foreground">Basic photography experience</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-foreground">${tour.price_standard}</div>
                  <div className="text-xs text-muted-foreground">per person</div>
                </div>
              </div>
            </div>
            
            {tour.price_pro && (
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  packageType === 'pro' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setPackageType('pro')}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">Pro Package</h4>
                      <Badge className="bg-primary text-primary-foreground">
                        <Zap className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Advanced equipment & post-processing</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground">${tour.price_pro}</div>
                    <div className="text-xs text-muted-foreground">per person</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Date Selection */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Select Date
          </label>
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < new Date()}
            className="rounded-md border"
          />
        </div>

        {/* Group Size */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Group Size
          </label>
          <Select value={groupSize.toString()} onValueChange={(value) => setGroupSize(parseInt(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: tour.max_participants || 8 }, (_, i) => i + 1)
                .filter(n => n >= (tour.min_participants || 1))
                .map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {size} {size === 1 ? 'person' : 'people'}
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Gear Rental */}
        {tour.gear_rental_available && tour.gear_options && Array.isArray(tour.gear_options) && (
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Optional Gear Rental
            </label>
            <div className="space-y-2">
              {tour.gear_options.map((gear, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`gear-${index}`}
                      checked={gearRentals.includes(gear.item)}
                      onChange={() => handleGearRentalToggle(gear.item)}
                      className="rounded border-border"
                    />
                    <label htmlFor={`gear-${index}`} className="text-sm font-medium text-foreground">
                      {gear.item}
                    </label>
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    +${gear.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price Summary */}
        <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {packageType === 'pro' ? 'Pro Package' : 'Standard Package'} × {groupSize}
            </span>
            <span className="text-sm font-medium">${currentPrice * groupSize}</span>
          </div>
          
          {gearRentalCost > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Gear rental</span>
              <span className="text-sm font-medium">${gearRentalCost}</span>
            </div>
          )}
          
          <div className="pt-2 border-t border-border">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-xl font-bold text-foreground">${totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Book Now Button */}
        <Button 
          onClick={handleBooking}
          disabled={!selectedDate}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          size="lg"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Book Now - ${totalPrice}
        </Button>

        {/* Contact Info */}
        <div className="text-center pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-2">Need help booking?</p>
          <p className="text-sm font-medium text-foreground">Call +94 77 123 4567</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default PhotographyBookingWidget