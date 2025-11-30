import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import RechargeFooter from '@/components/ui/RechargeFooter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Bus,
  Users,
  MapPin,
  Clock,
  Star,
  Shield,
  Headphones,
  Check,
  Loader2,
  CheckCircle2,
  User,
  Phone,
  Mail,
  CreditCard,
  FileText,
  AlertCircle,
  Plus,
  Minus,
  Calculator,
  Award,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const bookingSchema = z.object({
  vehicleId: z.string().min(1, 'Please select a vehicle'),
  tripType: z.enum(['one-way', 'round-trip', 'multi-day']),
  pickupLocation: z.string().min(1, 'Pickup location is required'),
  pickupDate: z.string().min(1, 'Pickup date is required'),
  pickupTime: z.string().min(1, 'Pickup time is required'),
  dropoffLocation: z.string().min(1, 'Destination is required'),
  returnDate: z.string().optional(),
  returnTime: z.string().optional(),
  passengers: z.number().min(1, 'At least 1 passenger required'),
  driverType: z.enum(['standard', 'english-speaking', 'tour-guide']),
  customerName: z.string().min(1, 'Name is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().min(1, 'Phone is required'),
  specialRequests: z.string().optional(),
  occasion: z.string().optional()
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface Vehicle {
  id: string;
  name: string;
  type: string;
  capacity: number;
  features: string[];
  image: string;
  pricePerDay: number;
  pricePerKm: number;
  hourlyRate: number;
  minimumHours: number;
  popular?: boolean;
}

const defaultVehicles: Vehicle[] = [
  {
    id: '1',
    name: 'Premium Van',
    type: 'van',
    capacity: 10,
    features: ['Air Conditioning', 'Comfortable Seats', 'Luggage Space', 'USB Charging'],
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80',
    pricePerDay: 80,
    pricePerKm: 1.5,
    minimumHours: 4,
    hourlyRate: 15,
    popular: true
  },
  {
    id: '2',
    name: 'Mini Coach',
    type: 'minibus',
    capacity: 20,
    features: ['Reclining Seats', 'Entertainment System', 'Cool Box', 'WiFi'],
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80',
    pricePerDay: 150,
    pricePerKm: 2.5,
    minimumHours: 4,
    hourlyRate: 25
  },
  {
    id: '3',
    name: 'Luxury Coach',
    type: 'coach',
    capacity: 35,
    features: ['Premium Seats', 'AC', 'Toilet', 'Entertainment', 'WiFi'],
    image: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&q=80',
    pricePerDay: 250,
    pricePerKm: 3.5,
    minimumHours: 6,
    hourlyRate: 40,
    popular: true
  },
  {
    id: '4',
    name: 'Large Coach',
    type: 'luxury-coach',
    capacity: 55,
    features: ['Spacious Interior', 'Luggage Compartment', 'PA System', 'Toilet'],
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&q=80',
    pricePerDay: 350,
    pricePerKm: 4.5,
    minimumHours: 6,
    hourlyRate: 55
  }
];

const driverRates = {
  standard: 30,
  'english-speaking': 45,
  'tour-guide': 65
};

const GroupTransportNew = () => {
  const [vehicles] = useState<Vehicle[]>(defaultVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const [days, setDays] = useState(1);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      tripType: 'one-way',
      passengers: 10,
      driverType: 'standard'
    }
  });

  const tripType = form.watch('tripType');
  const vehicleId = form.watch('vehicleId');
  const driverType = form.watch('driverType');

  useEffect(() => {
    if (vehicleId) {
      const vehicle = vehicles.find(v => v.id === vehicleId);
      setSelectedVehicle(vehicle || null);
    }
  }, [vehicleId, vehicles]);

  const calculatePrice = () => {
    if (!selectedVehicle) return { vehiclePrice: 0, driverCharge: 0, total: 0, deposit: 0 };

    const multiplier = tripType === 'round-trip' ? 2 : tripType === 'multi-day' ? days : 1;
    const vehiclePrice = selectedVehicle.pricePerDay * multiplier;
    const driverCharge = driverRates[driverType] * multiplier;
    const total = vehiclePrice + driverCharge;
    const deposit = Math.round(total * 0.3);

    return { vehiclePrice, driverCharge, total, deposit };
  };

  const estimatedPrice = calculatePrice();

  const onSubmit = async (data: BookingFormData) => {
    if (!selectedVehicle) {
      toast.error('Please select a vehicle');
      return;
    }

    setIsSubmitting(true);
    try {
      // Generate booking reference
      const ref = 'GT' + Date.now().toString().slice(-6);
      setBookingReference(ref);
      setBookingSuccess(true);
      toast.success('Booking submitted successfully!');
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookingSuccess) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center bg-white rounded-3xl shadow-xl p-12">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
              <p className="text-gray-600 mb-6">Your group transport booking has been received.</p>
              <div className="bg-emerald-50 rounded-xl p-6 mb-8">
                <p className="text-sm text-emerald-700 mb-2">Booking Reference</p>
                <p className="text-3xl font-mono font-bold text-emerald-800">{bookingReference}</p>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                A confirmation email has been sent. Our team will contact you within 2 hours.
              </p>
              <Button
                type="button"
                onClick={() => {
                  setBookingSuccess(false);
                  form.reset();
                }}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Book Another Transport
              </Button>
            </div>
          </div>
        </div>
        <RechargeFooter />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Group Transport Sri Lanka | Recharge Travels</title>
        <meta name="description" content="Premium group transportation for families, corporate events, and tours." />
      </Helmet>

      <Header />

      <main>
        {/* Hero Section - Clean Background */}
        <section className="relative min-h-[300px] bg-gray-900">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80)' }}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Hero Title Only */}
          <div className="relative z-10 pt-32 pb-16 text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Group Transport Sri Lanka</h1>
            <p className="text-xl text-white/80">Premium Coaches, Vans & Buses for Every Group Size</p>
          </div>
        </section>

        {/* Booking Form Section - WHITE BACKGROUND */}
        <section className="bg-gray-100 py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Form Header - Green */}
              <div className="bg-emerald-600 p-6 text-white">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Bus className="w-6 h-6" />
                        Book Group Transport
                      </h2>
                      <p className="text-emerald-100">Professional drivers | Modern fleet | Best rates</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>4.8/5</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="w-4 h-4" />
                        <span>Insured</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Content */}
                <form onSubmit={form.handleSubmit(onSubmit)} className="p-6">
                  <Tabs defaultValue="trip" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="trip">Trip Details</TabsTrigger>
                      <TabsTrigger value="contact">Contact & Confirm</TabsTrigger>
                    </TabsList>

                    <TabsContent value="trip" className="space-y-6">
                      {/* Vehicle Selection */}
                      <div>
                        <Label className="text-lg font-semibold mb-4 block">Select Vehicle</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {vehicles.map((vehicle) => (
                            <div
                              key={vehicle.id}
                              onClick={() => form.setValue('vehicleId', vehicle.id)}
                              className={`relative rounded-xl overflow-hidden cursor-pointer transition-all border-2 ${
                                vehicleId === vehicle.id
                                  ? 'border-emerald-500 ring-2 ring-emerald-200'
                                  : 'border-gray-200 hover:border-emerald-300'
                              }`}
                            >
                              <div className="h-24 relative">
                                <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                {vehicle.popular && (
                                  <Badge className="absolute top-2 right-2 bg-amber-500 text-xs">Popular</Badge>
                                )}
                              </div>
                              <div className="p-3 bg-white">
                                <p className="font-semibold text-sm">{vehicle.name}</p>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <Users className="w-3 h-3" /> {vehicle.capacity} seats
                                </p>
                                <p className="text-emerald-600 font-bold text-sm mt-1">
                                  ${vehicle.pricePerDay}/day
                                </p>
                              </div>
                              {vehicleId === vehicle.id && (
                                <div className="absolute top-2 left-2">
                                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white" />
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Trip Type */}
                      <div>
                        <Label className="text-sm font-medium mb-3 block">Trip Type</Label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { value: 'one-way', label: 'One Way', desc: 'Single trip' },
                            { value: 'round-trip', label: 'Round Trip', desc: 'Return included' },
                            { value: 'multi-day', label: 'Multi-Day', desc: 'Extended hire' }
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => form.setValue('tripType', opt.value as any)}
                              className={`p-3 rounded-xl border-2 text-left transition-all ${
                                tripType === opt.value
                                  ? 'border-emerald-500 bg-emerald-50'
                                  : 'border-gray-200 hover:border-emerald-300'
                              }`}
                            >
                              <p className="font-semibold text-sm">{opt.label}</p>
                              <p className="text-xs text-gray-500">{opt.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Multi-day selector */}
                      {tripType === 'multi-day' && (
                        <div>
                          <Label className="text-sm font-medium mb-3 block">Number of Days</Label>
                          <div className="flex items-center gap-4">
                            <button
                              type="button"
                              onClick={() => setDays(Math.max(1, days - 1))}
                              className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center hover:bg-emerald-200"
                            >
                              <Minus className="w-5 h-5 text-emerald-700" />
                            </button>
                            <span className="text-2xl font-bold w-12 text-center">{days}</span>
                            <button
                              type="button"
                              onClick={() => setDays(days + 1)}
                              className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center hover:bg-emerald-200"
                            >
                              <Plus className="w-5 h-5 text-emerald-700" />
                            </button>
                            <span className="text-gray-500">days</span>
                          </div>
                        </div>
                      )}

                      {/* Route Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Pickup Location</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <Input
                              {...form.register('pickupLocation')}
                              placeholder="e.g., Colombo Airport"
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Destination</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <Input
                              {...form.register('dropoffLocation')}
                              placeholder="e.g., Kandy"
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Pickup Date</Label>
                          <Input type="date" {...form.register('pickupDate')} />
                        </div>
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Pickup Time</Label>
                          <Input type="time" {...form.register('pickupTime')} />
                        </div>
                        {tripType !== 'one-way' && (
                          <>
                            <div>
                              <Label className="text-sm font-medium mb-2 block">Return Date</Label>
                              <Input type="date" {...form.register('returnDate')} />
                            </div>
                            <div>
                              <Label className="text-sm font-medium mb-2 block">Return Time</Label>
                              <Input type="time" {...form.register('returnTime')} />
                            </div>
                          </>
                        )}
                      </div>

                      {/* Passengers */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Number of Passengers</Label>
                        <Input
                          type="number"
                          {...form.register('passengers', { valueAsNumber: true })}
                          placeholder="Enter passenger count"
                          className="max-w-xs"
                        />
                      </div>

                      {/* Driver Type */}
                      <div>
                        <Label className="text-sm font-medium mb-3 block">Driver Type</Label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { value: 'standard', label: 'Standard', price: driverRates.standard, desc: 'Local driver' },
                            { value: 'english-speaking', label: 'English Speaking', price: driverRates['english-speaking'], desc: 'Fluent English' },
                            { value: 'tour-guide', label: 'Tour Guide', price: driverRates['tour-guide'], desc: 'Licensed guide' }
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => form.setValue('driverType', opt.value as any)}
                              className={`p-3 rounded-xl border-2 text-left transition-all ${
                                driverType === opt.value
                                  ? 'border-emerald-500 bg-emerald-50'
                                  : 'border-gray-200 hover:border-emerald-300'
                              }`}
                            >
                              <p className="font-semibold text-sm">{opt.label}</p>
                              <p className="text-xs text-gray-500">{opt.desc}</p>
                              <p className="text-emerald-600 font-bold text-sm mt-1">${opt.price}/day</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Price Summary */}
                      {selectedVehicle && (
                        <div className="bg-emerald-50 rounded-xl p-4">
                          <h4 className="font-semibold mb-3">Estimated Price</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Vehicle ({selectedVehicle.name})</span>
                              <span>${estimatedPrice.vehiclePrice}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Driver Charges</span>
                              <span>${estimatedPrice.driverCharge}</span>
                            </div>
                            <hr className="my-2" />
                            <div className="flex justify-between font-bold text-lg">
                              <span>Total</span>
                              <span className="text-emerald-600">${estimatedPrice.total}</span>
                            </div>
                            <div className="flex justify-between text-emerald-700">
                              <span>Deposit (30%)</span>
                              <span>${estimatedPrice.deposit}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="contact" className="space-y-6">
                      {/* Contact Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Full Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <Input
                              {...form.register('customerName')}
                              placeholder="Your full name"
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <Input
                              {...form.register('customerEmail')}
                              type="email"
                              placeholder="email@example.com"
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Phone</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <Input
                              {...form.register('customerPhone')}
                              placeholder="+94 XX XXX XXXX"
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Occasion (Optional)</Label>
                          <Input
                            {...form.register('occasion')}
                            placeholder="e.g., Wedding, Corporate Event"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">Special Requests (Optional)</Label>
                        <Textarea
                          {...form.register('specialRequests')}
                          placeholder="Any special requirements..."
                          rows={3}
                        />
                      </div>

                      {/* Summary */}
                      {selectedVehicle && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h4 className="font-semibold mb-3">Booking Summary</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Vehicle</p>
                              <p className="font-medium">{selectedVehicle.name}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Trip Type</p>
                              <p className="font-medium capitalize">{tripType.replace('-', ' ')}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Driver</p>
                              <p className="font-medium capitalize">{driverType.replace('-', ' ')}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Total Price</p>
                              <p className="font-bold text-emerald-600">${estimatedPrice.total}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Terms */}
                      <div className="flex items-start gap-3">
                        <input type="checkbox" required className="mt-1" />
                        <p className="text-sm text-gray-600">
                          I agree to the terms and conditions and cancellation policy
                        </p>
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isSubmitting || !selectedVehicle}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 py-6 text-lg"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Bus className="w-5 h-5 mr-2" />
                            Confirm Booking - ${estimatedPrice.total}
                          </>
                        )}
                      </Button>
                    </TabsContent>
                  </Tabs>
                </form>
              </div>
            </div>
        </section>

        {/* Fleet & Rate Card Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Our Fleet & Rate Card</h2>
              <p className="text-xl text-gray-600">Transparent pricing for every group size</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {vehicles.map((vehicle) => (
                <Card key={vehicle.id} className={`bg-white hover:shadow-xl transition-all ${vehicle.popular ? 'ring-2 ring-emerald-500' : ''}`}>
                  {vehicle.popular && (
                    <div className="bg-emerald-500 text-white text-center py-2 text-sm font-semibold">
                      MOST POPULAR
                    </div>
                  )}
                  <div className="h-48 relative">
                    <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
                  </div>
                  <CardHeader className="bg-white">
                    <CardTitle className="flex items-center justify-between text-gray-900">
                      {vehicle.name}
                      <Badge variant="outline" className="flex items-center gap-1 text-gray-700 border-gray-300">
                        <Users className="w-3 h-3" /> {vehicle.capacity}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="bg-white">
                    <ul className="space-y-2 mb-4">
                      {vehicle.features.slice(0, 4).map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                          <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 mb-4">
                      <p className="text-xs text-emerald-700 mb-2 font-semibold uppercase">Rate Card</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between text-gray-800">
                          <span>Per Day</span>
                          <span className="font-bold text-emerald-700">${vehicle.pricePerDay}</span>
                        </div>
                        <div className="flex justify-between text-gray-800">
                          <span>Per KM</span>
                          <span className="font-bold text-emerald-700">${vehicle.pricePerKm}</span>
                        </div>
                        <div className="flex justify-between text-gray-800">
                          <span>Hourly Rate</span>
                          <span className="font-bold text-emerald-700">${vehicle.hourlyRate}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="button"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => {
                        form.setValue('vehicleId', vehicle.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      Book This Vehicle
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Driver Charges Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Driver Charges</h2>
              <p className="text-xl text-gray-600">Choose the right driver for your needs</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  type: 'Standard Driver',
                  price: driverRates.standard,
                  features: ['Professional & courteous', 'Good road knowledge', 'Basic English', 'Safe driving record'],
                  icon: User
                },
                {
                  type: 'English Speaking',
                  price: driverRates['english-speaking'],
                  features: ['Fluent in English', 'Communication skills', 'Tourist friendly', 'Route suggestions'],
                  icon: Users,
                  popular: true
                },
                {
                  type: 'Tour Guide Driver',
                  price: driverRates['tour-guide'],
                  features: ['Licensed tour guide', 'In-depth knowledge', 'Historical insights', 'Photo recommendations'],
                  icon: Award
                }
              ].map((driver, idx) => (
                <Card key={idx} className={`relative bg-white ${driver.popular ? 'ring-2 ring-emerald-500' : ''}`}>
                  {driver.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white">
                      Recommended
                    </Badge>
                  )}
                  <CardHeader className="text-center bg-white">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <driver.icon className="w-8 h-8 text-emerald-600" />
                    </div>
                    <CardTitle className="text-gray-900">{driver.type}</CardTitle>
                    <p className="text-3xl font-bold text-emerald-600">${driver.price}<span className="text-sm font-normal text-gray-500">/day</span></p>
                  </CardHeader>
                  <CardContent className="bg-white">
                    <ul className="space-y-3">
                      {driver.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                          <Check className="w-4 h-4 text-emerald-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How to Book Section */}
        <section className="py-16 bg-emerald-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">How to Book</h2>
              <p className="text-xl text-gray-600">Simple 4-step booking process</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[
                { step: 1, title: 'Select Vehicle', description: 'Choose the right vehicle for your group size', icon: Bus },
                { step: 2, title: 'Enter Details', description: 'Provide pickup location, date, and destination', icon: MapPin },
                { step: 3, title: 'Get Instant Quote', description: 'See transparent pricing with all costs included', icon: Calculator },
                { step: 4, title: 'Confirm Booking', description: 'Pay 30% deposit and receive confirmation', icon: CheckCircle2 }
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center">
                      <item.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Terms Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Terms & Conditions</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-white">
                  <CardHeader className="bg-white">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <CreditCard className="w-5 h-5 text-emerald-600" />
                      Pricing & Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="bg-white">
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                        30% deposit required at booking
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                        Full payment 48 hours before departure
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                        Fuel, tolls, and parking included
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardHeader className="bg-white">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      Cancellation Policy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="bg-white">
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                        <span><strong className="text-gray-900">72+ hours:</strong> Full refund</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                        <span><strong className="text-gray-900">24-72 hours:</strong> 50% refund</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                        <span><strong className="text-gray-900">Under 24 hours:</strong> No refund</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600">
          <div className="container mx-auto px-4 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Book?</h2>
            <p className="text-xl text-emerald-100 mb-8">Get the best rates for your group travel</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                type="button"
                size="lg"
                className="bg-white text-emerald-600 hover:bg-gray-100"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <Bus className="w-5 h-5 mr-2" />
                Book Now
              </Button>
              <Button type="button" size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Headphones className="w-5 h-5 mr-2" />
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </main>

      <RechargeFooter />
    </>
  );
};

export default GroupTransportNew;
