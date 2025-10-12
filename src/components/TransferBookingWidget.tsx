import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Users, Car, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface TransferBookingWidgetProps {
  origin: string;
  destination: string;
  basePrice: number;
}

const TransferBookingWidget = ({ origin, destination, basePrice }: TransferBookingWidgetProps) => {
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    passengers: '1',
    vehicleType: 'sedan',
    pickupTime: '',
    flightNumber: '',
    hotelName: '',
    specialRequests: ''
  });

  const vehiclePrices = {
    sedan: basePrice,
    suv: Math.round(basePrice * 1.3),
    minivan: Math.round(basePrice * 1.5),
    luxury: Math.round(basePrice * 2.5)
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast.error('Please select a pickup date');
      return;
    }

    if (!formData.pickupTime) {
      toast.error('Please select a pickup time');
      return;
    }

    // In a real app, this would send to an API
    toast.success('Booking request sent! We\'ll confirm within 15 minutes.');
    
    // Log for demo
    console.log('Booking submitted:', {
      origin,
      destination,
      date: format(date, 'yyyy-MM-dd'),
      ...formData,
      price: vehiclePrices[formData.vehicleType as keyof typeof vehiclePrices]
    });
  };

  const currentPrice = vehiclePrices[formData.vehicleType as keyof typeof vehiclePrices];

  return (
    <Card className="shadow-xl border-2 border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardTitle className="text-xl">Book Your Transfer</CardTitle>
        <p className="text-blue-100 text-sm">
          {origin} → {destination}
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Date Selection */}
          <div>
            <Label>Pickup Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection */}
          <div>
            <Label htmlFor="pickupTime">
              <Clock className="w-4 h-4 inline mr-1" />
              Pickup Time
            </Label>
            <Input
              id="pickupTime"
              type="time"
              value={formData.pickupTime}
              onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
              required
            />
          </div>

          {/* Passengers */}
          <div>
            <Label htmlFor="passengers">
              <Users className="w-4 h-4 inline mr-1" />
              Number of Passengers
            </Label>
            <Select
              value={formData.passengers}
              onValueChange={(value) => setFormData({ ...formData, passengers: value })}
            >
              <SelectTrigger id="passengers">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'Passenger' : 'Passengers'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Vehicle Type */}
          <div>
            <Label htmlFor="vehicleType">
              <Car className="w-4 h-4 inline mr-1" />
              Vehicle Type
            </Label>
            <Select
              value={formData.vehicleType}
              onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
            >
              <SelectTrigger id="vehicleType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedan">
                  Sedan (1-3 passengers) - ${vehiclePrices.sedan}
                </SelectItem>
                <SelectItem value="suv">
                  SUV (1-6 passengers) - ${vehiclePrices.suv}
                </SelectItem>
                <SelectItem value="minivan">
                  Minivan (1-8 passengers) - ${vehiclePrices.minivan}
                </SelectItem>
                <SelectItem value="luxury">
                  Luxury Sedan (1-3 passengers) - ${vehiclePrices.luxury}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Flight Number (optional) */}
          {origin.includes('Airport') && (
            <div>
              <Label htmlFor="flightNumber">
                Flight Number (optional)
              </Label>
              <Input
                id="flightNumber"
                placeholder="e.g., UL123"
                value={formData.flightNumber}
                onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll track your flight for delays
              </p>
            </div>
          )}

          {/* Hotel/Pickup Location */}
          <div>
            <Label htmlFor="hotelName">
              {origin.includes('Airport') ? 'Drop-off Hotel/Address' : 'Pickup Hotel/Address'}
            </Label>
            <Input
              id="hotelName"
              placeholder="Hotel name or address"
              value={formData.hotelName}
              onChange={(e) => setFormData({ ...formData, hotelName: e.target.value })}
            />
          </div>

          {/* Special Requests */}
          <div>
            <Label htmlFor="specialRequests">
              Special Requests (optional)
            </Label>
            <textarea
              id="specialRequests"
              className="w-full border rounded-md p-2 text-sm"
              rows={2}
              placeholder="Child seats, extra stops, etc."
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
            />
          </div>

          {/* Price Display */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Price:</span>
              <span className="text-2xl font-bold text-blue-600">${currentPrice}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              All inclusive • No hidden fees
            </p>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            size="lg"
          >
            <Send className="w-4 h-4 mr-2" />
            Book Now - Instant Confirmation
          </Button>

          <p className="text-xs text-center text-gray-500">
            Free cancellation up to 24 hours before pickup
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransferBookingWidget;