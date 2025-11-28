import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Car, 
  Filter, 
  MapPin, 
  Star, 
  Users, 
  Fuel,
  Settings2,
  Calendar,
  Check,
  X,
  ChevronDown,
  ArrowRight,
  Clock,
  Wifi,
  Snowflake,
  Navigation,
  BatteryCharging
} from 'lucide-react';
import type { Vehicle, VehicleType, VehicleSearchFilters, RentalPeriodType } from '@/types/vehicleRental';

// Mock data for demonstration
const mockVehicles: (Vehicle & { pricing: { dailyRate: number; hourlyRate: number } })[] = [
  {
    id: '1',
    ownerId: 'owner1',
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
    features: ['Fuel Efficient', 'Eco-Friendly'],
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
    photos: [{ id: '1', vehicleId: '1', url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=300&fit=crop', type: 'exterior_front', isPrimary: true, isAutoExtracted: false, uploadedAt: new Date() }],
    isOwnVehicle: true,
    status: 'active',
    condition: 'excellent',
    serviceAreas: ['Colombo', 'Gampaha', 'Kalutara'],
    pickupLocations: [{ address: 'Colombo Fort', city: 'Colombo' }],
    deliveryAvailable: true,
    deliveryFee: 5,
    rating: 4.9,
    reviewCount: 45,
    createdAt: new Date(),
    updatedAt: new Date(),
    pricing: { dailyRate: 28, hourlyRate: 4 }
  },
  {
    id: '2',
    ownerId: 'owner2',
    registrationNumber: 'WP-5678',
    make: 'Honda',
    model: 'Vezel',
    year: 2022,
    color: 'Black',
    vehicleType: 'suv',
    fuelType: 'hybrid',
    transmission: 'automatic',
    engineCapacity: 1500,
    mileage: 18,
    seatingCapacity: 5,
    luggageCapacity: 4,
    features: ['Spacious', 'Family Friendly'],
    amenities: {
      airConditioning: true,
      wifi: true,
      bluetooth: true,
      usbCharging: true,
      gps: true,
      childSeat: true,
      sunroof: true,
      backupCamera: true,
      parkingSensors: true,
      cruiseControl: true
    },
    photos: [{ id: '2', vehicleId: '2', url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=300&fit=crop', type: 'exterior_front', isPrimary: true, isAutoExtracted: false, uploadedAt: new Date() }],
    isOwnVehicle: true,
    status: 'active',
    condition: 'excellent',
    serviceAreas: ['Colombo', 'Kandy', 'Galle'],
    pickupLocations: [{ address: 'Nugegoda', city: 'Colombo' }],
    deliveryAvailable: true,
    deliveryFee: 7,
    rating: 4.8,
    reviewCount: 32,
    createdAt: new Date(),
    updatedAt: new Date(),
    pricing: { dailyRate: 40, hourlyRate: 6 }
  },
  {
    id: '3',
    ownerId: 'owner3',
    registrationNumber: 'NW-9012',
    make: 'Toyota',
    model: 'KDH Van',
    year: 2020,
    color: 'White',
    vehicleType: 'van',
    fuelType: 'diesel',
    transmission: 'manual',
    engineCapacity: 2500,
    mileage: 12,
    seatingCapacity: 12,
    luggageCapacity: 8,
    features: ['Group Travel', 'Luggage Space'],
    amenities: {
      airConditioning: true,
      wifi: false,
      bluetooth: true,
      usbCharging: true,
      gps: false,
      childSeat: false,
      sunroof: false,
      backupCamera: true,
      parkingSensors: false,
      cruiseControl: false
    },
    photos: [{ id: '3', vehicleId: '3', url: 'https://images.unsplash.com/photo-1559829604-f95e1c1e5cee?w=400&h=300&fit=crop', type: 'exterior_front', isPrimary: true, isAutoExtracted: false, uploadedAt: new Date() }],
    isOwnVehicle: true,
    status: 'active',
    condition: 'good',
    serviceAreas: ['Island Wide'],
    pickupLocations: [{ address: 'Negombo', city: 'Negombo' }],
    deliveryAvailable: true,
    deliveryFee: 8,
    rating: 4.7,
    reviewCount: 28,
    createdAt: new Date(),
    updatedAt: new Date(),
    pricing: { dailyRate: 60, hourlyRate: 8 }
  },
  {
    id: '4',
    ownerId: 'owner4',
    registrationNumber: 'CAA-3456',
    make: 'Mercedes-Benz',
    model: 'E-Class',
    year: 2023,
    color: 'Silver',
    vehicleType: 'luxury',
    fuelType: 'petrol',
    transmission: 'automatic',
    engineCapacity: 2000,
    mileage: 14,
    seatingCapacity: 5,
    luggageCapacity: 4,
    features: ['Premium Luxury', 'Executive Class'],
    amenities: {
      airConditioning: true,
      wifi: true,
      bluetooth: true,
      usbCharging: true,
      gps: true,
      childSeat: false,
      sunroof: true,
      backupCamera: true,
      parkingSensors: true,
      cruiseControl: true
    },
    photos: [{ id: '4', vehicleId: '4', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop', type: 'exterior_front', isPrimary: true, isAutoExtracted: false, uploadedAt: new Date() }],
    isOwnVehicle: true,
    status: 'active',
    condition: 'excellent',
    serviceAreas: ['Colombo'],
    pickupLocations: [{ address: 'Colombo 7', city: 'Colombo' }],
    deliveryAvailable: true,
    deliveryFee: 10,
    rating: 5.0,
    reviewCount: 18,
    createdAt: new Date(),
    updatedAt: new Date(),
    pricing: { dailyRate: 150, hourlyRate: 20 }
  },
  {
    id: '5',
    ownerId: 'owner5',
    registrationNumber: 'SP-7890',
    make: 'Suzuki',
    model: 'Alto',
    year: 2021,
    color: 'Red',
    vehicleType: 'hatchback',
    fuelType: 'petrol',
    transmission: 'automatic',
    engineCapacity: 660,
    mileage: 28,
    seatingCapacity: 4,
    luggageCapacity: 2,
    features: ['Budget Friendly', 'Easy Parking'],
    amenities: {
      airConditioning: true,
      wifi: false,
      bluetooth: true,
      usbCharging: true,
      gps: false,
      childSeat: false,
      sunroof: false,
      backupCamera: false,
      parkingSensors: false,
      cruiseControl: false
    },
    photos: [{ id: '5', vehicleId: '5', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop', type: 'exterior_front', isPrimary: true, isAutoExtracted: false, uploadedAt: new Date() }],
    isOwnVehicle: true,
    status: 'active',
    condition: 'good',
    serviceAreas: ['Colombo', 'Gampaha'],
    pickupLocations: [{ address: 'Maharagama', city: 'Colombo' }],
    deliveryAvailable: true,
    deliveryFee: 3,
    rating: 4.6,
    reviewCount: 52,
    createdAt: new Date(),
    updatedAt: new Date(),
    pricing: { dailyRate: 18, hourlyRate: 3 }
  },
  {
    id: '6',
    ownerId: 'owner6',
    registrationNumber: 'EP-4567',
    make: 'Toyota',
    model: 'Coaster',
    year: 2019,
    color: 'White',
    vehicleType: 'mini-coach',
    fuelType: 'diesel',
    transmission: 'manual',
    engineCapacity: 4000,
    mileage: 8,
    seatingCapacity: 27,
    luggageCapacity: 15,
    features: ['Large Group', 'Tour Ready'],
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
      cruiseControl: false
    },
    photos: [{ id: '6', vehicleId: '6', url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop', type: 'exterior_front', isPrimary: true, isAutoExtracted: false, uploadedAt: new Date() }],
    isOwnVehicle: true,
    status: 'active',
    condition: 'good',
    serviceAreas: ['Island Wide'],
    pickupLocations: [{ address: 'Colombo', city: 'Colombo' }],
    deliveryAvailable: true,
    deliveryFee: 17,
    rating: 4.8,
    reviewCount: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
    pricing: { dailyRate: 115, hourlyRate: 17 }
  }
];

const vehicleTypeOptions: { value: VehicleType | ''; label: string }[] = [
  { value: '', label: 'All Types' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'van', label: 'Van' },
  { value: 'mini-coach', label: 'Mini Coach' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'convertible', label: 'Convertible' },
  { value: 'pickup', label: 'Pickup' },
];

const rentalPeriodOptions: { value: RentalPeriodType; label: string }[] = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

const cityOptions = [
  'All Cities',
  'Colombo',
  'Kandy',
  'Galle',
  'Negombo',
  'Ella',
  'Nuwara Eliya',
  'Trincomalee',
  'Jaffna',
  'Anuradhapura',
];

const VehicleBrowse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [loading, setLoading] = useState(false);

  // Filters
  const [vehicleType, setVehicleType] = useState<VehicleType | ''>(
    (searchParams.get('type') as VehicleType) || ''
  );
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriodType>('daily');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [withDriver, setWithDriver] = useState(false);
  const [minSeats, setMinSeats] = useState(0);
  const [maxPrice, setMaxPrice] = useState(300);
  const [sortBy, setSortBy] = useState<'price_low' | 'price_high' | 'rating' | 'popular'>('popular');

  // Apply filters
  useEffect(() => {
    let filtered = [...mockVehicles];

    if (vehicleType) {
      filtered = filtered.filter(v => v.vehicleType === vehicleType);
    }

    if (city && city !== 'All Cities') {
      filtered = filtered.filter(v => v.serviceAreas.some(a => a.toLowerCase().includes(city.toLowerCase())));
    }

    if (minSeats > 0) {
      filtered = filtered.filter(v => v.seatingCapacity >= minSeats);
    }

    filtered = filtered.filter(v => v.pricing.dailyRate <= maxPrice);

    // Sort
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.pricing.dailyRate - b.pricing.dailyRate);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.pricing.dailyRate - a.pricing.dailyRate);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    setVehicles(filtered);
  }, [vehicleType, city, minSeats, maxPrice, sortBy]);

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi': return <Wifi className="w-3.5 h-3.5" />;
      case 'airConditioning': return <Snowflake className="w-3.5 h-3.5" />;
      case 'gps': return <Navigation className="w-3.5 h-3.5" />;
      case 'usbCharging': return <BatteryCharging className="w-3.5 h-3.5" />;
      default: return <Check className="w-3.5 h-3.5" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Browse Vehicles for Rent | Cars, SUVs, Vans | Recharge Travels</title>
        <meta name="description" content="Browse and book verified vehicles in Sri Lanka. Sedans, SUVs, vans, luxury cars. Hourly to monthly rentals available." />
      </Helmet>

      <Header />

      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Browse Vehicles</h1>
            <p className="text-gray-300">Find your perfect rental from 500+ verified vehicles</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar */}
            <div className={`lg:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-gray-900 flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                  </h2>
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Vehicle Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value as VehicleType | '')}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                    >
                      {vehicleTypeOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Rental Period */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rental Period</label>
                    <div className="flex flex-wrap gap-2">
                      {rentalPeriodOptions.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setRentalPeriod(opt.value)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            rentalPeriod === opt.value
                              ? 'bg-amber-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pickup City</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                    >
                      {cityOptions.map(c => (
                        <option key={c} value={c === 'All Cities' ? '' : c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Minimum Seats */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Seats</label>
                    <div className="flex gap-2">
                      {[0, 4, 5, 7, 12].map(num => (
                        <button
                          key={num}
                          onClick={() => setMinSeats(num)}
                          className={`flex-1 px-2 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            minSeats === num
                              ? 'bg-amber-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {num === 0 ? 'Any' : `${num}+`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Max Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Price/Day: ${maxPrice}
                    </label>
                    <input
                      type="range"
                      min="15"
                      max="300"
                      step="15"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>$15</span>
                      <span>$300</span>
                    </div>
                  </div>

                  {/* With Driver */}
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={withDriver}
                        onChange={(e) => setWithDriver(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-400/50"
                      />
                      <span className="text-sm text-gray-700">With Driver Only</span>
                    </label>
                  </div>

                  {/* Clear Filters */}
                  <button
                    onClick={() => {
                      setVehicleType('');
                      setRentalPeriod('daily');
                      setCity('');
                      setMinSeats(0);
                      setMaxPrice(300);
                      setWithDriver(false);
                    }}
                    className="w-full py-2 text-sm text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="flex-1">
              {/* Sort & Filter Toggle */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{vehicles.length}</span> vehicles found
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-medium text-gray-700"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                  </button>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-400/50"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Vehicle Grid */}
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {vehicles.map((vehicle) => (
                  <Link
                    key={vehicle.id}
                    to={`/vehicle-rental/vehicle/${vehicle.id}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={vehicle.photos[0]?.url || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop'}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 capitalize">
                          {vehicle.vehicleType}
                        </span>
                        {vehicle.condition === 'excellent' && (
                          <span className="px-2 py-1 bg-green-500 text-white rounded-full text-xs font-medium">
                            Excellent
                          </span>
                        )}
                      </div>
                      <div className="absolute top-3 right-3">
                        <div className="flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span>{vehicle.rating}</span>
                          <span className="text-gray-400">({vehicle.reviewCount})</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                            {vehicle.make} {vehicle.model}
                          </h3>
                          <p className="text-sm text-gray-500">{vehicle.year} • {vehicle.transmission}</p>
                        </div>
                      </div>

                      {/* Specs */}
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {vehicle.seatingCapacity}
                        </span>
                        <span className="flex items-center gap-1">
                          <Fuel className="w-4 h-4" />
                          {vehicle.fuelType}
                        </span>
                        <span className="flex items-center gap-1">
                          <Settings2 className="w-4 h-4" />
                          {vehicle.transmission === 'automatic' ? 'Auto' : 'Manual'}
                        </span>
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {vehicle.amenities.airConditioning && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                            <Snowflake className="w-3 h-3" /> AC
                          </span>
                        )}
                        {vehicle.amenities.wifi && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                            <Wifi className="w-3 h-3" /> WiFi
                          </span>
                        )}
                        {vehicle.amenities.gps && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                            <Navigation className="w-3 h-3" /> GPS
                          </span>
                        )}
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                        <MapPin className="w-4 h-4" />
                        {vehicle.serviceAreas.slice(0, 2).join(', ')}
                        {vehicle.serviceAreas.length > 2 && ` +${vehicle.serviceAreas.length - 2}`}
                      </div>

                      {/* Price & CTA */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div>
                          <div className="text-lg font-bold text-gray-900">
                            ${vehicle.pricing.dailyRate}
                            <span className="text-sm font-normal text-gray-500">/day</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            ${vehicle.pricing.hourlyRate}/hour
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 px-4 py-2 bg-amber-500 text-white rounded-full text-sm font-medium group-hover:bg-amber-600 transition-colors">
                          View
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Empty State */}
              {vehicles.length === 0 && (
                <div className="text-center py-16">
                  <Car className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No vehicles found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your filters to see more results</p>
                  <button
                    onClick={() => {
                      setVehicleType('');
                      setCity('');
                      setMinSeats(0);
                      setMaxPrice(300);
                    }}
                    className="px-6 py-2 bg-amber-500 text-white rounded-full font-medium hover:bg-amber-600 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default VehicleBrowse;
