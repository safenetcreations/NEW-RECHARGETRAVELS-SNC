import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Users, MapPin, Clock } from 'lucide-react'

interface City {
  id: string
  name: string
  country: string
  latitude: number
  longitude: number
}

interface CityBookingWidgetProps {
  city: City
}

const CityBookingWidget: React.FC<CityBookingWidgetProps> = ({ city }) => {
  const [selectedDate, setSelectedDate] = useState('')
  const [partySize, setPartySize] = useState('2')
  const [category, setCategory] = useState('')
  const [timeSlot, setTimeSlot] = useState('')

  const handleBooking = () => {
    // For now, just show an alert
    alert('Booking functionality will be implemented soon!')
  }

  return (
    <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-xl text-gray-900">
          Book Your {city.name} Experience
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Find and book the best experiences in {city.name}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Selection */}
        <div className="space-y-2">
          <Label htmlFor="date" className="flex items-center text-sm font-medium">
            <Calendar className="h-4 w-4 mr-2" />
            Select Date
          </Label>
          <Input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full"
          />
        </div>

        {/* Party Size */}
        <div className="space-y-2">
          <Label htmlFor="party-size" className="flex items-center text-sm font-medium">
            <Users className="h-4 w-4 mr-2" />
            Party Size
          </Label>
          <Select value={partySize} onValueChange={setPartySize}>
            <SelectTrigger>
              <SelectValue placeholder="Select party size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Person</SelectItem>
              <SelectItem value="2">2 People</SelectItem>
              <SelectItem value="3">3 People</SelectItem>
              <SelectItem value="4">4 People</SelectItem>
              <SelectItem value="5">5 People</SelectItem>
              <SelectItem value="6">6+ People</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Selection */}
        <div className="space-y-2">
          <Label htmlFor="category" className="flex items-center text-sm font-medium">
            <MapPin className="h-4 w-4 mr-2" />
            Experience Type
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="restaurant">Restaurant</SelectItem>
              <SelectItem value="activity">Activity</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
              <SelectItem value="accommodation">Hotel</SelectItem>
              <SelectItem value="transport">Transport</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Time Slot */}
        <div className="space-y-2">
          <Label htmlFor="time-slot" className="flex items-center text-sm font-medium">
            <Clock className="h-4 w-4 mr-2" />
            Preferred Time
          </Label>
          <Select value={timeSlot} onValueChange={setTimeSlot}>
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Morning (6AM - 12PM)</SelectItem>
              <SelectItem value="afternoon">Afternoon (12PM - 6PM)</SelectItem>
              <SelectItem value="evening">Evening (6PM - 10PM)</SelectItem>
              <SelectItem value="night">Night (10PM+)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <Button 
          onClick={handleBooking}
          className="w-full bg-primary hover:bg-primary/90 text-white"
          size="lg"
        >
          Search Available Options
        </Button>

        {/* Quick Stats */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-sm text-gray-900">Quick Info</h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-gray-500">Local Time</div>
              <div className="font-medium">{new Date().toLocaleTimeString()}</div>
            </div>
            <div>
              <div className="text-gray-500">Weather</div>
              <div className="font-medium">28°C Sunny</div>
            </div>
            <div>
              <div className="text-gray-500">Currency</div>
              <div className="font-medium">LKR (Sri Lankan Rupee)</div>
            </div>
            <div>
              <div className="text-gray-500">Language</div>
              <div className="font-medium">Sinhala, Tamil, English</div>
            </div>
          </div>
        </div>

        {/* Distance Calculator */}
        <div className="border-t pt-4">
          <Label className="text-sm font-medium mb-2 block">Distance Calculator</Label>
          <div className="space-y-2">
            <Input 
              placeholder="Enter your location" 
              className="text-sm"
            />
            <Button variant="outline" size="sm" className="w-full">
              Calculate Distance & Travel Time
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CityBookingWidget