import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, MapPin, Car, Clock, Users, 
  Sun, Moon, AlertCircle, TrendingUp,
  DollarSign, Info
} from 'lucide-react';
import PlacesAutocompleteInput from '@/components/PlacesAutocompleteInput';
import { toast } from 'sonner';

interface PriceCalculation {
  basePrice: number;
  distanceSurcharge: number;
  vehicleSurcharge: number;
  nightSurcharge: number;
  peakSurcharge: number;
  totalPrice: number;
  distance?: number;
  duration?: number;
}

const TransferPricingCalculator = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [vehicleType, setVehicleType] = useState('sedan');
  const [pickupTime, setPickupTime] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [calculation, setCalculation] = useState<PriceCalculation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const vehicleTypes = [
    { id: 'sedan', name: 'Sedan', capacity: '1-3', multiplier: 1.0 },
    { id: 'suv', name: 'SUV', capacity: '1-6', multiplier: 1.3 },
    { id: 'minivan', name: 'Minivan', capacity: '1-8', multiplier: 1.5 },
    { id: 'minicoach', name: 'Mini Coach', capacity: '10-14', multiplier: 2.0 },
    { id: 'luxury', name: 'Luxury', capacity: '1-3', multiplier: 2.5 }
  ];

  const popularRoutes = [
    { origin: 'Colombo Airport (CMB)', destination: 'Kandy', price: 45 },
    { origin: 'Colombo Airport (CMB)', destination: 'Galle', price: 55 },
    { origin: 'Colombo', destination: 'Sigiriya', price: 75 },
    { origin: 'Kandy', destination: 'Ella', price: 65 }
  ];

  const calculatePrice = async () => {
    if (!origin || !destination) {
      toast.error('Please select both origin and destination');
      return;
    }

    setIsCalculating(true);
    
    try {
      // In a real implementation, this would call the /api/v1/route endpoint
      // For now, we'll simulate the calculation
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Base calculation logic
      const basePrice = 25; // Base fare
      const pricePerKm = 0.5;
      const estimatedDistance = Math.random() * 200 + 50; // Simulated distance
      const distanceSurcharge = estimatedDistance * pricePerKm;
      
      // Vehicle multiplier
      const vehicle = vehicleTypes.find(v => v.id === vehicleType);
      const vehicleMultiplier = vehicle?.multiplier || 1;
      const vehicleSurcharge = (basePrice + distanceSurcharge) * (vehicleMultiplier - 1);
      
      // Time-based surcharges
      let nightSurcharge = 0;
      let peakSurcharge = 0;
      
      if (pickupTime) {
        const hour = parseInt(pickupTime.split(':')[0]);
        const date = new Date();
        date.setHours(hour);
        
        // Night surcharge (10 PM - 6 AM): 20%
        if (hour >= 22 || hour < 6) {
          nightSurcharge = (basePrice + distanceSurcharge) * 0.2;
        }
        
        // Peak surcharge (7-9 AM, 5-8 PM on weekdays): 15%
        const isWeekday = date.getDay() >= 1 && date.getDay() <= 5;
        if (isWeekday && ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 20))) {
          peakSurcharge = (basePrice + distanceSurcharge) * 0.15;
        }
      }
      
      const totalPrice = basePrice + distanceSurcharge + vehicleSurcharge + nightSurcharge + peakSurcharge;
      
      setCalculation({
        basePrice,
        distanceSurcharge,
        vehicleSurcharge,
        nightSurcharge,
        peakSurcharge,
        totalPrice,
        distance: estimatedDistance,
        duration: Math.round(estimatedDistance / 40 * 60) // Estimate 40km/h average
      });
      
    } catch (error) {
      console.error('Calculation error:', error);
      toast.error('Failed to calculate price');
    } finally {
      setIsCalculating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const setPopularRoute = (route: typeof popularRoutes[0]) => {
    setOrigin(route.origin);
    setDestination(route.destination);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calculator Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Transfer Pricing Calculator
          </CardTitle>
          <p className="text-sm text-gray-600">
            Get instant quotes for your journey
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Popular Routes */}
          <div>
            <Label>Popular Routes</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {popularRoutes.map((route, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs justify-start"
                  onClick={() => setPopularRoute(route)}
                >
                  <MapPin className="w-3 h-3 mr-1" />
                  {route.origin.split(' ')[0]} → {route.destination}
                </Button>
              ))}
            </div>
          </div>

          {/* Origin */}
          <div>
            <Label htmlFor="origin">
              <MapPin className="w-4 h-4 inline mr-1" />
              Pickup Location
            </Label>
            <PlacesAutocompleteInput
              value={origin}
              onChange={setOrigin}
              placeholder="Enter pickup location"
              onBlur={() => {}}
              name="origin"
            />
          </div>

          {/* Destination */}
          <div>
            <Label htmlFor="destination">
              <MapPin className="w-4 h-4 inline mr-1" />
              Drop-off Location
            </Label>
            <PlacesAutocompleteInput
              value={destination}
              onChange={setDestination}
              placeholder="Enter destination"
              onBlur={() => {}}
              name="destination"
            />
          </div>

          {/* Vehicle Type */}
          <div>
            <Label htmlFor="vehicleType">
              <Car className="w-4 h-4 inline mr-1" />
              Vehicle Type
            </Label>
            <Select value={vehicleType} onValueChange={setVehicleType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {vehicleTypes.map(vehicle => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    <div className="flex justify-between w-full">
                      <span>{vehicle.name} ({vehicle.capacity})</span>
                      <Badge variant="secondary" className="ml-2">
                        {vehicle.multiplier}x
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pickup Time */}
          <div>
            <Label htmlFor="pickupTime">
              <Clock className="w-4 h-4 inline mr-1" />
              Pickup Time (Optional)
            </Label>
            <input
              type="time"
              id="pickupTime"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="w-full border rounded-md p-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Time affects pricing (night/peak surcharges)
            </p>
          </div>

          {/* Passengers */}
          <div>
            <Label htmlFor="passengers">
              <Users className="w-4 h-4 inline mr-1" />
              Number of Passengers
            </Label>
            <Select value={passengers} onValueChange={setPassengers}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'Passenger' : 'Passengers'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Calculate Button */}
          <Button 
            className="w-full" 
            onClick={calculatePrice}
            disabled={isCalculating}
          >
            {isCalculating ? 'Calculating...' : 'Calculate Price'}
          </Button>

          {/* Pricing Info */}
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4" />
              <span>Night surcharge (10 PM - 6 AM): +20%</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>Peak hours (7-9 AM, 5-8 PM weekdays): +15%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Price Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          {calculation ? (
            <div className="space-y-4">
              {/* Route Info */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{origin}</p>
                    <p className="text-sm text-gray-600">to</p>
                    <p className="font-semibold">{destination}</p>
                  </div>
                  {calculation.distance && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        ~{calculation.distance.toFixed(0)} km
                      </p>
                      <p className="text-sm text-gray-600">
                        ~{calculation.duration} min
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span>Base Fare</span>
                  <span>{formatCurrency(calculation.basePrice)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Distance Charge</span>
                  <span>{formatCurrency(calculation.distanceSurcharge)}</span>
                </div>
                {calculation.vehicleSurcharge > 0 && (
                  <div className="flex justify-between py-2 border-b">
                    <span>Vehicle Surcharge</span>
                    <span>{formatCurrency(calculation.vehicleSurcharge)}</span>
                  </div>
                )}
                {calculation.nightSurcharge > 0 && (
                  <div className="flex justify-between py-2 border-b text-orange-600">
                    <span className="flex items-center gap-1">
                      <Moon className="w-4 h-4" />
                      Night Surcharge
                    </span>
                    <span>+{formatCurrency(calculation.nightSurcharge)}</span>
                  </div>
                )}
                {calculation.peakSurcharge > 0 && (
                  <div className="flex justify-between py-2 border-b text-red-600">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      Peak Hour Surcharge
                    </span>
                    <span>+{formatCurrency(calculation.peakSurcharge)}</span>
                  </div>
                )}
                <div className="flex justify-between py-3 text-lg font-bold">
                  <span>Total Price</span>
                  <span className="text-green-600">
                    {formatCurrency(calculation.totalPrice)}
                  </span>
                </div>
              </div>

              {/* Booking CTA */}
              <div className="mt-6 space-y-3">
                <Button className="w-full" size="lg">
                  Book This Transfer
                </Button>
                <div className="flex items-center gap-2 text-sm text-gray-600 justify-center">
                  <AlertCircle className="w-4 h-4" />
                  <span>Price valid for next 30 minutes</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Enter route details to see pricing</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransferPricingCalculator;