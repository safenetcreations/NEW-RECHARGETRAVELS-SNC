import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  vehicleService,
  vehiclePricingService,
  vehicleOwnerService,
  vehicleReviewService
} from '@/services/vehicleRentalService';
import type { Vehicle, VehiclePricing, VehicleOwner, VehicleReview } from '@/types/vehicleRental';
import {
  Car,
  ArrowLeft,
  Star,
  Users,
  Fuel,
  Settings2,
  MapPin,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Snowflake,
  Navigation,
  BatteryCharging,
  Shield,
  Clock,
  Phone,
  MessageCircle,
  Heart,
  Share2,
  AlertCircle,
  Info,
  Loader2
} from 'lucide-react';

const amenityLabels: Record<string, string> = {
  airConditioning: 'Air Conditioning',
  wifi: 'WiFi',
  bluetooth: 'Bluetooth',
  usbCharging: 'USB Charging',
  gps: 'GPS Navigation',
  childSeat: 'Child Seat',
  sunroof: 'Sunroof',
  backupCamera: 'Backup Camera',
  parkingSensors: 'Parking Sensors',
  cruiseControl: 'Cruise Control'
};

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [pricing, setPricing] = useState<VehiclePricing | null>(null);
  const [owner, setOwner] = useState<VehicleOwner | null>(null);
  const [reviews, setReviews] = useState<VehicleReview[]>([]);

  // UI states
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [withDriver, setWithDriver] = useState(false);
  const [rentalPeriod, setRentalPeriod] = useState<'hourly' | 'daily' | 'weekly' | 'monthly'>('daily');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch vehicle data
  useEffect(() => {
    const fetchVehicleData = async () => {
      if (!id) {
        setError('Vehicle ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch vehicle details
        const vehicleData = await vehicleService.getById(id);
        if (!vehicleData) {
          setError('Vehicle not found');
          setLoading(false);
          return;
        }
        setVehicle(vehicleData);

        // Fetch pricing
        const pricingData = await vehiclePricingService.getByVehicle(id);
        setPricing(pricingData);

        // Fetch owner info
        if (vehicleData.ownerId) {
          const ownerData = await vehicleOwnerService.getById(vehicleData.ownerId);
          setOwner(ownerData);
        }

        // Fetch reviews
        const reviewsData = await vehicleReviewService.getByVehicle(id);
        setReviews(reviewsData);

      } catch (err) {
        console.error('Error fetching vehicle data:', err);
        setError('Failed to load vehicle details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleData();
  }, [id]);

  const photos = vehicle?.photos?.map(p => p.url) || [
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop'
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % photos.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const getPrice = () => {
    if (!pricing) return 0;

    const baseRates = withDriver
      ? { hourly: (pricing.hourlyRate || 0) + (pricing.driverCostPerDay || 0) / 8, daily: (pricing.dailyRate || 0) + (pricing.driverCostPerDay || 0) }
      : { hourly: pricing.hourlyRate || 0, daily: pricing.dailyRate || 0 };

    switch (rentalPeriod) {
      case 'hourly': return baseRates.hourly;
      case 'daily': return baseRates.daily;
      case 'weekly': return pricing.weeklyRate || baseRates.daily * 7 * 0.9;
      case 'monthly': return pricing.monthlyRate || baseRates.daily * 30 * 0.8;
      default: return baseRates.daily;
    }
  };

  const handleBookNow = () => {
    if (!vehicle) return;
    navigate(`/vehicle-rental/booking/${vehicle.id}?withDriver=${withDriver}&period=${rentalPeriod}&start=${startDate}&end=${endDate}`);
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading Vehicle | Recharge Travels</title>
        </Helmet>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-amber-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading vehicle details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Error state
  if (error || !vehicle) {
    return (
      <>
        <Helmet>
          <title>Vehicle Not Found | Recharge Travels</title>
        </Helmet>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Vehicle Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'This vehicle is no longer available.'}</p>
            <Link
              to="/vehicle-rental/browse"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-full font-medium hover:bg-amber-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Browse Vehicles
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const defaultPricing = {
    hourlyRate: pricing?.hourlyRate || 0,
    dailyRate: pricing?.dailyRate || 0,
    weeklyRate: pricing?.weeklyRate || 0,
    monthlyRate: pricing?.monthlyRate || 0,
    securityDeposit: pricing?.securityDeposit || 0,
    mileageLimit: pricing?.mileageLimitPerDay || 150,
    extraMileageCharge: pricing?.extraMileageCharge || 0.2,
    driverCostPerDay: pricing?.driverCostPerDay || 0
  };

  return (
    <>
      <Helmet>
        <title>{vehicle.make} {vehicle.model} {vehicle.year} for Rent | Recharge Travels</title>
        <meta name="description" content={`Rent ${vehicle.make} ${vehicle.model} ${vehicle.year} in Sri Lanka. ${vehicle.seatingCapacity} seats, ${vehicle.fuelType}, ${vehicle.transmission}. From $${defaultPricing.dailyRate}/day.`} />
      </Helmet>

      <Header />

      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-sm">
              <Link to="/vehicle-rental" className="text-gray-500 hover:text-amber-600">Vehicle Rental</Link>
              <span className="text-gray-300">/</span>
              <Link to="/vehicle-rental/browse" className="text-gray-500 hover:text-amber-600">Browse</Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900">{vehicle.make} {vehicle.model}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Content */}
            <div className="flex-1">
              {/* Image Gallery */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-6">
                <div className="relative aspect-[16/10]">
                  <img
                    src={photos[currentImageIndex]}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Navigation Arrows */}
                  {photos.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {photos.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm">
                      {currentImageIndex + 1} / {photos.length}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                    </button>
                    <button className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                      <Share2 className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 capitalize">
                      {vehicle.vehicleType}
                    </span>
                    {vehicle.condition === 'excellent' && (
                      <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
                        Excellent Condition
                      </span>
                    )}
                  </div>
                </div>

                {/* Thumbnails */}
                {photos.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide">
                    {photos.map((photo, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden transition-all ${
                          index === currentImageIndex ? 'ring-2 ring-amber-500' : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={photo} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Vehicle Info */}
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {vehicle.make} {vehicle.model}
                    </h1>
                    <p className="text-gray-500">{vehicle.year} • {vehicle.color} • {vehicle.registrationNumber}</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-full">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span className="font-semibold text-gray-900">{vehicle.rating || 'New'}</span>
                    {vehicle.reviewCount > 0 && (
                      <span className="text-gray-500">({vehicle.reviewCount})</span>
                    )}
                  </div>
                </div>

                {/* Quick Specs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Users className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium text-gray-900">{vehicle.seatingCapacity} Seats</div>
                      <div className="text-xs text-gray-500">Capacity</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Fuel className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium text-gray-900 capitalize">{vehicle.fuelType}</div>
                      <div className="text-xs text-gray-500">{vehicle.mileage} km/l</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Settings2 className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium text-gray-900 capitalize">{vehicle.transmission}</div>
                      <div className="text-xs text-gray-500">Transmission</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Car className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium text-gray-900">{vehicle.luggageCapacity} Bags</div>
                      <div className="text-xs text-gray-500">Luggage</div>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                {vehicle.amenities && (
                  <div className="mb-6">
                    <h2 className="font-bold text-gray-900 mb-3">Amenities & Features</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {Object.entries(vehicle.amenities).map(([key, value]) => (
                        <div
                          key={key}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                            value ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400 line-through'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                          <span className="text-sm">{amenityLabels[key] || key}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Features */}
                {vehicle.features && vehicle.features.length > 0 && (
                  <div className="mb-6">
                    <h2 className="font-bold text-gray-900 mb-3">Additional Features</h2>
                    <div className="flex flex-wrap gap-2">
                      {vehicle.features.map((feature, index) => (
                        <span key={index} className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-medium">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location */}
                {vehicle.serviceAreas && vehicle.serviceAreas.length > 0 && (
                  <div className="mb-6">
                    <h2 className="font-bold text-gray-900 mb-3">Pickup Location</h2>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                      <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {vehicle.pickupLocations?.[0]?.address || 'Contact owner for pickup location'}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Service Areas: {vehicle.serviceAreas.join(', ')}
                        </div>
                        {vehicle.deliveryAvailable && (
                          <div className="text-sm text-green-600 mt-1">
                            Delivery available (${vehicle.deliveryFee || 0})
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Owner Info */}
              {owner && (
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                  <h2 className="font-bold text-gray-900 mb-4">Vehicle Owner</h2>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {owner.fullName?.charAt(0) || 'O'}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">{owner.fullName}</div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          {owner.rating || 'New'}
                        </span>
                        <span>{owner.totalBookings || 0} rentals</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                        <Phone className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                        <MessageCircle className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900">Reviews ({reviews.length})</h2>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-gray-900">{vehicle.rating || 'New'}</span>
                  </div>
                </div>

                {reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No reviews yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map(review => (
                      <div key={review.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
                            {review.customerName?.charAt(0) || 'U'}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{review.customerName || 'Customer'}</div>
                            <div className="text-xs text-gray-500">
                              {review.createdAt instanceof Date
                                ? review.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                                : new Date(review.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                              }
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:w-96">
              <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-3xl font-bold text-gray-900">
                      ${Math.round(getPrice())}
                    </div>
                    <div className="text-gray-500">per {rentalPeriod.replace('ly', '')}</div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
                    <Shield className="w-4 h-4" />
                    Verified
                  </div>
                </div>

                {/* Rental Type */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rental Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setWithDriver(false)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        !withDriver ? 'border-amber-500 bg-amber-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="font-medium text-gray-900">Self Drive</div>
                      <div className="text-xs text-gray-500">${defaultPricing.dailyRate}/day</div>
                    </button>
                    <button
                      onClick={() => setWithDriver(true)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        withDriver ? 'border-amber-500 bg-amber-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="font-medium text-gray-900">With Driver</div>
                      <div className="text-xs text-gray-500">${defaultPricing.dailyRate + defaultPricing.driverCostPerDay}/day</div>
                    </button>
                  </div>
                </div>

                {/* Rental Period */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rental Period</label>
                  <div className="flex flex-wrap gap-2">
                    {(['hourly', 'daily', 'weekly', 'monthly'] as const).map(period => (
                      <button
                        key={period}
                        onClick={() => setRentalPeriod(period)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          rentalPeriod === period
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Rate</span>
                      <span className="font-medium">${Math.round(getPrice())}</span>
                    </div>
                    {vehicle.deliveryAvailable && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Fee</span>
                        <span className="font-medium">${vehicle.deliveryFee || 0}</span>
                      </div>
                    )}
                    {defaultPricing.securityDeposit > 0 && (
                      <div className="flex justify-between text-gray-600">
                        <span>Security Deposit</span>
                        <span>${defaultPricing.securityDeposit}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between text-base font-bold">
                      <span>Total</span>
                      <span className="text-amber-600">${Math.round(getPrice()) + defaultPricing.securityDeposit}</span>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                {defaultPricing.mileageLimit > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Info className="w-4 h-4" />
                    <span>Mileage limit: {defaultPricing.mileageLimit} km/day (${defaultPricing.extraMileageCharge}/extra km)</span>
                  </div>
                )}

                {/* Book Button */}
                <button
                  onClick={handleBookNow}
                  disabled={!startDate || !endDate}
                  className={`w-full py-3 rounded-xl font-medium transition-all ${
                    startDate && endDate
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Book Now
                </button>

                {/* Contact Buttons */}
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
                    <Phone className="w-4 h-4" />
                    Call
                  </button>
                  <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default VehicleDetail;
