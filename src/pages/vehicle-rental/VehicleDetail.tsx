import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
  Info
} from 'lucide-react';

// Mock vehicle data
const mockVehicle = {
  id: '1',
  ownerId: 'owner1',
  ownerName: 'Nuwan Perera',
  ownerPhone: '+94 77 123 4567',
  ownerRating: 4.9,
  ownerBookings: 145,
  registrationNumber: 'CAB-1234',
  make: 'Toyota',
  model: 'Prius',
  year: 2021,
  color: 'White',
  vehicleType: 'sedan',
  fuelType: 'hybrid',
  transmission: 'automatic',
  engineCapacity: 1800,
  mileage: 22,
  seatingCapacity: 5,
  luggageCapacity: 3,
  features: ['Fuel Efficient', 'Eco-Friendly', 'First Aid Kit', 'Fire Extinguisher'],
  amenities: {
    airConditioning: true,
    wifi: true,
    bluetooth: true,
    usbCharging: true,
    gps: true,
    childSeat: false,
    sunroof: false,
    backupCamera: true,
    parkingSensors: true,
    cruiseControl: true
  },
  photos: [
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop',
  ],
  condition: 'excellent',
  serviceAreas: ['Colombo', 'Gampaha', 'Kalutara', 'Kandy'],
  pickupAddress: 'No. 45, Galle Road, Colombo 03',
  deliveryAvailable: true,
  deliveryFee: 5,
  rating: 4.9,
  reviewCount: 45,
  pricing: {
    hourlyRate: 4,
    dailyRate: 28,
    weeklyRate: 180,
    monthlyRate: 600,
    withDriverHourlyRate: 7,
    withDriverDailyRate: 40,
    securityDeposit: 85,
    mileageLimit: 150,
    extraMileageCharge: 0.2,
  },
  description: 'Well-maintained Toyota Prius Hybrid, perfect for city driving and long tours. Excellent fuel economy with hybrid technology. Clean interior, regularly serviced, and comfortable for family trips.',
  rules: [
    'No smoking inside the vehicle',
    'Pets allowed with prior approval',
    'Return with same fuel level',
    'Clean the vehicle before return',
  ]
};

const mockReviews = [
  {
    id: '1',
    customerName: 'Kamal Silva',
    rating: 5,
    date: '2024-01-10',
    comment: 'Excellent vehicle! Very clean and well-maintained. The owner was very helpful and punctual. Would definitely rent again.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: '2',
    customerName: 'Priya Fernando',
    rating: 5,
    date: '2024-01-05',
    comment: 'Great experience! The car was in perfect condition and fuel efficient as described. Smooth pickup and drop-off.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: '3',
    customerName: 'Ruwan Jayasinghe',
    rating: 4,
    date: '2023-12-28',
    comment: 'Good car for the price. AC was very cold, comfortable seats. Minor delay in pickup but overall satisfied.',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
  }
];

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [withDriver, setWithDriver] = useState(false);
  const [rentalPeriod, setRentalPeriod] = useState<'hourly' | 'daily' | 'weekly' | 'monthly'>('daily');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  const vehicle = mockVehicle;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % vehicle.photos.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + vehicle.photos.length) % vehicle.photos.length);
  };

  const getPrice = () => {
    const baseRates = withDriver 
      ? { hourly: vehicle.pricing.withDriverHourlyRate, daily: vehicle.pricing.withDriverDailyRate }
      : { hourly: vehicle.pricing.hourlyRate, daily: vehicle.pricing.dailyRate };
    
    switch (rentalPeriod) {
      case 'hourly': return baseRates.hourly;
      case 'daily': return baseRates.daily;
      case 'weekly': return withDriver ? vehicle.pricing.withDriverDailyRate * 7 * 0.9 : vehicle.pricing.weeklyRate;
      case 'monthly': return withDriver ? vehicle.pricing.withDriverDailyRate * 30 * 0.8 : vehicle.pricing.monthlyRate;
      default: return baseRates.daily;
    }
  };

  const handleBookNow = () => {
    navigate(`/vehicle-rental/booking/${vehicle.id}?withDriver=${withDriver}&period=${rentalPeriod}&start=${startDate}&end=${endDate}`);
  };

  return (
    <>
      <Helmet>
        <title>{vehicle.make} {vehicle.model} {vehicle.year} for Rent | Recharge Travels</title>
        <meta name="description" content={`Rent ${vehicle.make} ${vehicle.model} ${vehicle.year} in Sri Lanka. ${vehicle.seatingCapacity} seats, ${vehicle.fuelType}, ${vehicle.transmission}. From $${vehicle.pricing.dailyRate}/day.`} />
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
                    src={vehicle.photos[currentImageIndex]}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Navigation Arrows */}
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

                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm">
                    {currentImageIndex + 1} / {vehicle.photos.length}
                  </div>

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
                <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide">
                  {vehicle.photos.map((photo, index) => (
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
                    <span className="font-semibold text-gray-900">{vehicle.rating}</span>
                    <span className="text-gray-500">({vehicle.reviewCount})</span>
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

                {/* Description */}
                <div className="mb-6">
                  <h2 className="font-bold text-gray-900 mb-2">About This Vehicle</h2>
                  <p className="text-gray-600">{vehicle.description}</p>
                </div>

                {/* Amenities */}
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
                        <span className="text-sm">{amenityLabels[key]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Features */}
                {vehicle.features.length > 0 && (
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
                <div className="mb-6">
                  <h2 className="font-bold text-gray-900 mb-3">Pickup Location</h2>
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">{vehicle.pickupAddress}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        Service Areas: {vehicle.serviceAreas.join(', ')}
                      </div>
                      {vehicle.deliveryAvailable && (
                        <div className="text-sm text-green-600 mt-1">
                          ✓ Delivery available (${vehicle.deliveryFee})
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rental Rules */}
                <div>
                  <h2 className="font-bold text-gray-900 mb-3">Rental Rules</h2>
                  <div className="space-y-2">
                    {vehicle.rules.map((rule, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-600">
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                        {rule}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Owner Info */}
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <h2 className="font-bold text-gray-900 mb-4">Vehicle Owner</h2>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {vehicle.ownerName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">{vehicle.ownerName}</div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        {vehicle.ownerRating}
                      </span>
                      <span>{vehicle.ownerBookings} rentals</span>
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

              {/* Reviews */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900">Reviews ({mockReviews.length})</h2>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-gray-900">{vehicle.rating}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {mockReviews.map(review => (
                    <div key={review.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <img src={review.avatar} alt="" className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{review.customerName}</div>
                          <div className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
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
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:w-96">
              <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-3xl font-bold text-gray-900">
                      ${getPrice()}
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
                      <div className="text-xs text-gray-500">${vehicle.pricing.dailyRate}/day</div>
                    </button>
                    <button
                      onClick={() => setWithDriver(true)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        withDriver ? 'border-amber-500 bg-amber-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="font-medium text-gray-900">With Driver</div>
                      <div className="text-xs text-gray-500">${vehicle.pricing.withDriverDailyRate}/day</div>
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
                      <span className="font-medium">${getPrice()}</span>
                    </div>
                    {vehicle.deliveryAvailable && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Fee</span>
                        <span className="font-medium">${vehicle.deliveryFee}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-600">
                      <span>Security Deposit</span>
                      <span>${vehicle.pricing.securityDeposit}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between text-base font-bold">
                      <span>Total</span>
                      <span className="text-amber-600">${getPrice() + vehicle.pricing.securityDeposit}</span>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Info className="w-4 h-4" />
                  <span>Mileage limit: {vehicle.pricing.mileageLimit} km/day (${vehicle.pricing.extraMileageCharge}/extra km)</span>
                </div>

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
