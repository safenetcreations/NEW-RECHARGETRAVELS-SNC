// Global Tour Booking Form Component
// Reusable booking form for all tour types

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import {
  Calendar,
  Users,
  MapPin,
  Phone,
  Mail,
  User,
  Globe,
  Plane,
  MessageCircle,
  CheckCircle2,
  Loader2,
  DollarSign,
  Clock,
  Shield
} from 'lucide-react';
import { GlobalTour, TourBookingFormData } from '@/types/global-tour';
import { createTourBooking } from '@/services/globalTourService';

// Validation schema
const bookingSchema = z.object({
  tourId: z.string().min(1, 'Tour is required'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(8, 'Please enter a valid phone number'),
  whatsappNumber: z.string().optional(),
  nationality: z.string().min(2, 'Please select your nationality'),
  adults: z.number().min(1, 'At least 1 adult is required').max(20),
  children: z.number().min(0).max(10),
  infants: z.number().min(0).max(5),
  travelDate: z.string().min(1, 'Please select a travel date'),
  pickupLocation: z.string().min(2, 'Pickup location is required'),
  dropoffLocation: z.string().optional(),
  flightDetails: z.string().optional(),
  additionalNotes: z.string().optional(),
  specialRequirements: z.string().optional(),
  howDidYouHear: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to terms'),
  subscribeNewsletter: z.boolean().optional()
});

interface GlobalTourBookingFormProps {
  tour: GlobalTour;
  variant?: 'sidebar' | 'modal' | 'full';
  onSuccess?: (bookingId: string, bookingReference: string) => void;
  onClose?: () => void;
}

// Country list for nationality
const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France',
  'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Italy', 'Spain',
  'India', 'China', 'Japan', 'South Korea', 'Singapore', 'Malaysia',
  'Thailand', 'Indonesia', 'Philippines', 'Vietnam', 'New Zealand',
  'South Africa', 'Brazil', 'Mexico', 'Russia', 'UAE', 'Saudi Arabia',
  'Sri Lanka', 'Other'
].sort();

const GlobalTourBookingForm = ({
  tour,
  variant = 'sidebar',
  onSuccess,
  onClose
}: GlobalTourBookingFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<TourBookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      tourId: tour.id,
      adults: 2,
      children: 0,
      infants: 0,
      agreeToTerms: false,
      subscribeNewsletter: true
    }
  });

  const adults = watch('adults');
  const children = watch('children');

  // Calculate total price
  useEffect(() => {
    const basePrice = tour.pricePerPersonUSD || tour.priceUSD;
    const adultsCost = basePrice * (adults || 0);
    const childrenCost = basePrice * (children || 0) * 0.5;
    setTotalPrice(adultsCost + childrenCost);
  }, [adults, children, tour]);

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const onSubmit = async (data: TourBookingFormData) => {
    setIsSubmitting(true);

    try {
      const result = await createTourBooking(data, tour);

      if (result.success) {
        toast({
          title: 'Booking Submitted!',
          description: `Your booking reference is ${result.bookingReference}. We'll contact you shortly.`,
          duration: 5000
        });

        if (onSuccess) {
          onSuccess(result.bookingId, result.bookingReference);
        } else {
          navigate(`/booking/tour-confirmation/${result.bookingId}`);
        }
      } else {
        toast({
          title: 'Booking Failed',
          description: result.message,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSidebar = variant === 'sidebar';

  return (
    <Card className={`${isSidebar ? 'sticky top-4' : ''} shadow-xl border-0`}>
      <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Book This Tour
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-emerald-100 mt-2">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {tour.duration.days}D/{tour.duration.nights}N
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {tour.location}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Price Display */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Starting from</p>
              <p className="text-3xl font-bold text-emerald-600">
                ${tour.pricePerPersonUSD || tour.priceUSD}
                <span className="text-sm font-normal text-gray-500">/person</span>
              </p>
            </div>
            {totalPrice > 0 && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Estimated Total</p>
                <p className="text-2xl font-bold text-emerald-700">
                  ${totalPrice.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Travel Date */}
          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Travel Date *
            </Label>
            <Input
              type="date"
              min={getMinDate()}
              {...register('travelDate')}
              className={errors.travelDate ? 'border-red-500' : ''}
            />
            {errors.travelDate && (
              <p className="text-red-500 text-sm mt-1">{errors.travelDate.message}</p>
            )}
          </div>

          {/* Travelers */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-sm">Adults *</Label>
              <Select
                defaultValue="2"
                onValueChange={(val) => setValue('adults', parseInt(val))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm">Children</Label>
              <Select
                defaultValue="0"
                onValueChange={(val) => setValue('children', parseInt(val))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4, 5].map(n => (
                    <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm">Infants</Label>
              <Select
                defaultValue="0"
                onValueChange={(val) => setValue('infants', parseInt(val))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3].map(n => (
                    <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-emerald-600" />
                First Name *
              </Label>
              <Input
                {...register('firstName')}
                placeholder="John"
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <Label className="mb-2">Last Name *</Label>
              <Input
                {...register('lastName')}
                placeholder="Doe"
                className={errors.lastName ? 'border-red-500' : ''}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-emerald-600" />
              Email Address *
            </Label>
            <Input
              type="email"
              {...register('email')}
              placeholder="john@example.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Phone className="w-4 h-4 text-emerald-600" />
              Phone / WhatsApp *
            </Label>
            <Input
              {...register('phone')}
              placeholder="+1 234 567 8900"
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              Nationality *
            </Label>
            <Select onValueChange={(val) => setValue('nationality', val)}>
              <SelectTrigger className={errors.nationality ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map(country => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.nationality && (
              <p className="text-red-500 text-xs mt-1">{errors.nationality.message}</p>
            )}
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Pickup Location *
            </Label>
            <Input
              {...register('pickupLocation')}
              placeholder="e.g., Colombo Airport, Hotel Name"
              className={errors.pickupLocation ? 'border-red-500' : ''}
            />
            {errors.pickupLocation && (
              <p className="text-red-500 text-xs mt-1">{errors.pickupLocation.message}</p>
            )}
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Plane className="w-4 h-4 text-emerald-600" />
              Flight Details (Optional)
            </Label>
            <Input
              {...register('flightDetails')}
              placeholder="e.g., UL123 arriving 10:30 AM"
            />
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              Special Requests
            </Label>
            <Textarea
              {...register('additionalNotes')}
              placeholder="Any dietary requirements, special occasions, preferences..."
              rows={3}
            />
          </div>

          {/* Terms */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                onCheckedChange={(checked) => setValue('agreeToTerms', checked as boolean)}
              />
              <label htmlFor="terms" className="text-sm text-gray-600 leading-tight">
                I agree to the{' '}
                <a href="/terms" className="text-emerald-600 hover:underline">Terms & Conditions</a>
                {' '}and{' '}
                <a href="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</a>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-red-500 text-xs">{errors.agreeToTerms.message}</p>
            )}

            <div className="flex items-start gap-2">
              <Checkbox
                id="newsletter"
                defaultChecked
                onCheckedChange={(checked) => setValue('subscribeNewsletter', checked as boolean)}
              />
              <label htmlFor="newsletter" className="text-sm text-gray-600">
                Subscribe to our newsletter for exclusive offers
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-6 text-lg font-semibold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Submit Booking Request
              </>
            )}
          </Button>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-4 pt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-emerald-600" />
              Secure Booking
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Best Price Guarantee
            </span>
          </div>

          {/* WhatsApp CTA */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">Need help? Chat with us</p>
            <a
              href="https://wa.me/94777721999?text=Hi, I'm interested in booking the ${encodeURIComponent(tour.title)} tour"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp: +94 77 772 1999
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default GlobalTourBookingForm;
