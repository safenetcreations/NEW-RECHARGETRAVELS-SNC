import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Car,
  MapPin,
  Calendar,
  Clock,
  Users,
  Briefcase,
  Wifi,
  Wind,
  Baby,
  ChevronDown,
  ChevronUp,
  Info,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import driverPricingService, {
  VehicleType,
  TripType,
  DriverTier,
  PriceBreakdown
} from '@/services/driverPricingService';

interface PricingCalculatorProps {
  driverId?: string;
  driverTier?: DriverTier;
  vehicleType?: VehicleType;
  onPriceCalculated?: (breakdown: PriceBreakdown) => void;
  compact?: boolean;
}

const VEHICLE_OPTIONS: { value: VehicleType; label: string; icon: string; seats: string }[] = [
  { value: 'sedan', label: 'Sedan', icon: '🚗', seats: '3-4' },
  { value: 'suv', label: 'SUV', icon: '🚙', seats: '5-6' },
  { value: 'van', label: 'Van', icon: '🚐', seats: '7-12' },
  { value: 'mini_coach', label: 'Mini Coach', icon: '🚌', seats: '15-25' },
  { value: 'luxury', label: 'Luxury', icon: '✨', seats: '2-4' }
];

const TRIP_OPTIONS: { value: TripType; label: string; description: string }[] = [
  { value: 'airport_transfer', label: 'Airport Transfer', description: 'One-way airport pickup/drop' },
  { value: 'day_tour', label: 'Day Tour', description: 'Full day sightseeing' },
  { value: 'multi_day', label: 'Multi-Day Tour', description: '2+ days with driver' },
  { value: 'hourly', label: 'Hourly Hire', description: 'Flexible hourly booking' },
  { value: 'custom', label: 'Custom Trip', description: 'Custom requirements' }
];

const TIER_OPTIONS: { value: DriverTier; label: string; description: string }[] = [
  { value: 'freelance_driver', label: 'Standard Driver', description: 'Point-to-point transfers' },
  { value: 'tourist_driver', label: 'Tourist Driver', description: 'SLITHM trained' },
  { value: 'national_guide', label: 'National Guide', description: 'Licensed guide + driver' },
  { value: 'chauffeur_guide', label: 'Chauffeur Guide', description: 'Premium experience' }
];

export const DriverPricingCalculator: React.FC<PricingCalculatorProps> = ({
  driverId,
  driverTier: initialTier = 'freelance_driver',
  vehicleType: initialVehicle = 'sedan',
  onPriceCalculated,
  compact = false
}) => {
  const [loading, setLoading] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [breakdown, setBreakdown] = useState<PriceBreakdown | null>(null);

  // Form state
  const [tripType, setTripType] = useState<TripType>('day_tour');
  const [vehicleType, setVehicleType] = useState<VehicleType>(initialVehicle);
  const [driverTier, setDriverTier] = useState<DriverTier>(initialTier);
  const [estimatedKm, setEstimatedKm] = useState(100);
  const [estimatedDays, setEstimatedDays] = useState(1);
  const [pickupDate, setPickupDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [pickupTime, setPickupTime] = useState('08:00');
  const [withAc, setWithAc] = useState(true);
  const [withWifi, setWithWifi] = useState(false);
  const [childSeats, setChildSeats] = useState(0);
  const [extraLuggage, setExtraLuggage] = useState(0);

  useEffect(() => {
    calculatePrice();
  }, [tripType, vehicleType, driverTier, estimatedKm, estimatedDays, pickupDate, pickupTime, withAc, withWifi, childSeats, extraLuggage]);

  const calculatePrice = async () => {
    setLoading(true);
    try {
      const result = await driverPricingService.calculatePrice({
        trip_type: tripType,
        vehicle_type: vehicleType,
        driver_tier: driverTier,
        estimated_km: estimatedKm,
        estimated_days: estimatedDays,
        pickup_date: pickupDate,
        pickup_time: pickupTime,
        with_ac: withAc,
        with_wifi: withWifi,
        child_seats: childSeats,
        extra_luggage: extraLuggage
      });
      setBreakdown(result);
      onPriceCalculated?.(result);
    } catch (error) {
      console.error('Error calculating price:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amount: number) => {
    return driverPricingService.formatPrice(amount);
  };

  if (compact) {
    return (
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Estimated Price</span>
            </div>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span className="text-xl font-bold text-primary">
                {breakdown ? formatPrice(breakdown.total) : '-'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <Label className="text-xs">Distance</Label>
              <Input
                type="number"
                value={estimatedKm}
                onChange={(e) => setEstimatedKm(parseInt(e.target.value) || 0)}
                className="h-8"
              />
            </div>
            <div>
              <Label className="text-xs">Days</Label>
              <Input
                type="number"
                value={estimatedDays}
                onChange={(e) => setEstimatedDays(parseInt(e.target.value) || 1)}
                min={1}
                className="h-8"
              />
            </div>
          </div>

          {breakdown && (
            <button
              className="text-xs text-primary mt-2 flex items-center gap-1"
              onClick={() => setShowBreakdown(!showBreakdown)}
            >
              {showBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {showBreakdown ? 'Hide' : 'Show'} breakdown
            </button>
          )}

          {showBreakdown && breakdown && (
            <div className="mt-2 pt-2 border-t text-xs space-y-1">
              <div className="flex justify-between">
                <span>Base fare</span>
                <span>{formatPrice(breakdown.base_fare)}</span>
              </div>
              <div className="flex justify-between">
                <span>Distance ({estimatedKm}km)</span>
                <span>{formatPrice(breakdown.distance_fare)}</span>
              </div>
              {breakdown.extras_total > 0 && (
                <div className="flex justify-between">
                  <span>Extras</span>
                  <span>{formatPrice(breakdown.extras_total)}</span>
                </div>
              )}
              <div className="flex justify-between font-medium pt-1 border-t">
                <span>Total</span>
                <span>{formatPrice(breakdown.total)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Trip Price Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Trip Type */}
        <div className="space-y-2">
          <Label>Trip Type</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TRIP_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTripType(option.value)}
                className={`
                  p-3 rounded-lg border text-left transition-colors
                  ${tripType === option.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                  }
                `}
              >
                <p className="font-medium text-sm">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle Type */}
        <div className="space-y-2">
          <Label>Vehicle Type</Label>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {VEHICLE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setVehicleType(option.value)}
                className={`
                  flex-shrink-0 p-3 rounded-lg border text-center min-w-[80px] transition-colors
                  ${vehicleType === option.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                  }
                `}
              >
                <span className="text-2xl">{option.icon}</span>
                <p className="text-xs font-medium mt-1">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.seats} pax</p>
              </button>
            ))}
          </div>
        </div>

        {/* Driver Tier */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            Driver Type
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3 h-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Higher tier drivers provide additional services like guided tours and cultural insights
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Select value={driverTier} onValueChange={(v) => setDriverTier(v as DriverTier)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div>
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {option.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Distance and Duration */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Distance (km)
            </Label>
            <Input
              type="number"
              value={estimatedKm}
              onChange={(e) => setEstimatedKm(parseInt(e.target.value) || 0)}
              min={0}
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Days
            </Label>
            <Input
              type="number"
              value={estimatedDays}
              onChange={(e) => setEstimatedDays(parseInt(e.target.value) || 1)}
              min={1}
              max={30}
            />
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Pickup Date</Label>
            <Input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Pickup Time
            </Label>
            <Input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
            />
          </div>
        </div>

        {/* Extras */}
        <div className="space-y-3">
          <Label>Extras & Options</Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Air Conditioning</span>
              </div>
              <Switch checked={withAc} onCheckedChange={setWithAc} />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">WiFi</span>
              </div>
              <Switch checked={withWifi} onCheckedChange={setWithWifi} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Baby className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Child Seats</span>
              </div>
              <Input
                type="number"
                value={childSeats}
                onChange={(e) => setChildSeats(parseInt(e.target.value) || 0)}
                min={0}
                max={3}
                className="h-8"
              />
            </div>
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Extra Luggage</span>
              </div>
              <Input
                type="number"
                value={extraLuggage}
                onChange={(e) => setExtraLuggage(parseInt(e.target.value) || 0)}
                min={0}
                max={10}
                className="h-8"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Price Breakdown */}
        {breakdown && (
          <div className="space-y-3">
            <button
              className="flex items-center justify-between w-full"
              onClick={() => setShowBreakdown(!showBreakdown)}
            >
              <span className="font-medium">Price Breakdown</span>
              {showBreakdown ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {showBreakdown && (
              <div className="space-y-2 text-sm bg-muted/50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span>Base fare ({estimatedDays} day{estimatedDays > 1 ? 's' : ''})</span>
                  <span>{formatPrice(breakdown.base_fare)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Distance ({estimatedKm} km)</span>
                  <span>{formatPrice(breakdown.distance_fare)}</span>
                </div>
                {breakdown.tier_adjustment !== 0 && (
                  <div className="flex justify-between">
                    <span>Driver tier adjustment</span>
                    <span className={breakdown.tier_adjustment > 0 ? 'text-amber-600' : 'text-green-600'}>
                      {breakdown.tier_adjustment > 0 ? '+' : ''}{formatPrice(breakdown.tier_adjustment)}
                    </span>
                  </div>
                )}
                {breakdown.trip_type_adjustment !== 0 && (
                  <div className="flex justify-between">
                    <span>Trip type adjustment</span>
                    <span className={breakdown.trip_type_adjustment > 0 ? 'text-amber-600' : 'text-green-600'}>
                      {breakdown.trip_type_adjustment > 0 ? '+' : ''}{formatPrice(breakdown.trip_type_adjustment)}
                    </span>
                  </div>
                )}
                {breakdown.time_surcharge > 0 && (
                  <div className="flex justify-between">
                    <span>Time surcharge</span>
                    <span className="text-amber-600">+{formatPrice(breakdown.time_surcharge)}</span>
                  </div>
                )}
                {breakdown.extras_total > 0 && (
                  <div className="flex justify-between">
                    <span>Extras</span>
                    <span>+{formatPrice(breakdown.extras_total)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(breakdown.subtotal)}</span>
                </div>
                {breakdown.discount && (
                  <div className="flex justify-between text-green-600">
                    <span>{breakdown.discount.type} (-{breakdown.discount.percent}%)</span>
                    <span>-{formatPrice(breakdown.discount.amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Platform fee</span>
                  <span>{formatPrice(breakdown.platform_fee)}</span>
                </div>
              </div>
            )}

            {/* Total */}
            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
              <div>
                <p className="font-semibold text-lg">Total Price</p>
                <p className="text-xs text-muted-foreground">
                  Driver earns: {formatPrice(breakdown.driver_earnings)}
                </p>
              </div>
              <div className="text-right">
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(breakdown.total)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DriverPricingCalculator;
