
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Users, DollarSign } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface BookingWidgetProps {
  onBookingSubmit: (bookingData: BookingFormData) => void
}

export interface BookingFormData {
  tourType: string
  preferredTier: 'semi-luxury' | 'budget'
  date: Date | undefined
  adults: number
  children: number
  vehicleType?: string
  guideType?: string
  accommodationType?: string
}

const tourTypes = [
  { value: 'elephant', label: 'Elephant Safari Tours' },
  { value: 'leopard', label: 'Leopard Watching Safaris' },
  { value: 'whale', label: 'Blue Whale Watching' },
  { value: 'dolphin', label: 'Kalpitiya Dolphin Tours' },
  { value: 'birds', label: 'Birdwatching Expeditions' },
  { value: 'underwater', label: 'Snorkel/Dive Tours' }
]

const BookingWidget = ({ onBookingSubmit }: BookingWidgetProps) => {
  const [formData, setFormData] = useState<BookingFormData>({
    tourType: '',
    preferredTier: 'semi-luxury',
    date: undefined,
    adults: 2,
    children: 0
  })

  const [estimatedPrice, setEstimatedPrice] = useState(0)

  const handleInputChange = (field: keyof BookingFormData, value: any) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    calculatePrice(newData)
  }

  const calculatePrice = (data: BookingFormData) => {
    if (!data.tourType || !data.preferredTier) return

    const basePrices = {
      elephant: { 'semi-luxury': 180, 'budget': 65 },
      leopard: { 'semi-luxury': 220, 'budget': 85 },
      whale: { 'semi-luxury': 160, 'budget': 45 },
      dolphin: { 'semi-luxury': 140, 'budget': 35 },
      birds: { 'semi-luxury': 120, 'budget': 40 },
      underwater: { 'semi-luxury': 110, 'budget': 30 }
    }

    const basePrice = basePrices[data.tourType as keyof typeof basePrices]?.[data.preferredTier] || 0
    const totalPrice = basePrice * data.adults + (basePrice * 0.7 * data.children)
    setEstimatedPrice(Math.round(totalPrice))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onBookingSubmit(formData)
  }

  return (
    <Card className="sticky top-4 shadow-xl border-2 border-amber-200">
      <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
        <CardTitle className="flex items-center gap-2 font-playfair">
          <Users className="w-5 h-5" />
          Book Your Wild Adventure
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tour Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="tour-type" className="font-montserrat font-semibold">
              Select Tour Type
            </Label>
            <Select onValueChange={(value) => handleInputChange('tourType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your adventure..." />
              </SelectTrigger>
              <SelectContent>
                {tourTypes.map((tour) => (
                  <SelectItem key={tour.value} value={tour.value}>
                    {tour.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tier Selection */}
          <div className="space-y-2">
            <Label className="font-montserrat font-semibold">Preferred Tier</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={formData.preferredTier === 'semi-luxury' ? 'default' : 'outline'}
                onClick={() => handleInputChange('preferredTier', 'semi-luxury')}
                className={formData.preferredTier === 'semi-luxury' ? 'bg-amber-500 hover:bg-amber-600' : ''}
              >
                Semi-Luxury
              </Button>
              <Button
                type="button"
                variant={formData.preferredTier === 'budget' ? 'default' : 'outline'}
                onClick={() => handleInputChange('preferredTier', 'budget')}
                className={formData.preferredTier === 'budget' ? 'bg-green-500 hover:bg-green-600' : ''}
              >
                Budget-Friendly
              </Button>
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label className="font-montserrat font-semibold">Travel Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => handleInputChange('date', date)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Party Size */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="adults" className="font-montserrat font-semibold">
                Adults
              </Label>
              <Input
                id="adults"
                type="number"
                min="1"
                max="20"
                value={formData.adults}
                onChange={(e) => handleInputChange('adults', parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="children" className="font-montserrat font-semibold">
                Children
              </Label>
              <Input
                id="children"
                type="number"
                min="0"
                max="10"
                value={formData.children}
                onChange={(e) => handleInputChange('children', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Price Display */}
          {estimatedPrice > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <span className="font-montserrat font-semibold text-gray-700">
                  Estimated Total:
                </span>
                <div className="flex items-center gap-1 text-2xl font-bold text-green-600 font-playfair">
                  <DollarSign className="w-5 h-5" />
                  {estimatedPrice}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1 font-montserrat">
                Final price may vary based on specific selections
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105"
            disabled={!formData.tourType || !formData.date}
          >
            Find Available Tours
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default BookingWidget
