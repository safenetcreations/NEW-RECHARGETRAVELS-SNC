import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Car,
  Shield,
  Clock,
  MapPin,
  Users,
  Star,
  CheckCircle2,
  ArrowRight,
  Calendar,
  CreditCard,
  FileCheck,
  Smartphone,
  Zap,
  Leaf,
  Battery,
  Gauge,
  Globe,
  MessageCircle,
} from 'lucide-react';

const vehicleTypes = [
  { type: 'Economy', slug: 'economy', image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=250&fit=crop', count: '40+', priceFrom: 35 },
  { type: 'Compact', slug: 'compact', image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=250&fit=crop', count: '60+', priceFrom: 45 },
  { type: 'Sedans', slug: 'sedan', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop', count: '50+', priceFrom: 55 },
  { type: 'SUVs', slug: 'suv', image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=250&fit=crop', count: '35+', priceFrom: 75 },
  { type: 'Vans', slug: 'van', image: 'https://images.unsplash.com/photo-1559829604-f95e1c1e5cee?w=400&h=250&fit=crop', count: '25+', priceFrom: 85 },
  { type: 'Mini Coaches', slug: 'mini-coach', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250&fit=crop', count: '15+', priceFrom: 150 },
  { type: 'Luxury Coaches', slug: 'luxury-coach', image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=250&fit=crop', count: '10+', priceFrom: 280 },
  { type: 'Luxury', slug: 'luxury', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop', count: '20+', priceFrom: 175 },
];

// Eco E-Scooters - Available exclusively in Jaffna
const eScooters = [
  {
    model: 'Yadea T9',
    brand: 'Yadea',
    image: '/yadea t9 for website .jpeg',
    price: 25,
    range: '70+ km',
    maxRange: '100+ km',
    maxSpeed: '60 km/h',
    motor: '2000W Hub Motor',
    motorType: 'Hub Motor',
    battery: '72V 38Ah',
    batteryType: 'Graphene Battery',
    chargingCycles: '800-1000',
    originalPrice: 'LKR 599,950',
    featured: true,
    seating: '2 Seats',
    dimensions: '1860 x 715 x 1070 mm',
    tires: 'F: 90/90-12 | R: 100/80-12',
    brakes: 'Disc/Disc',
    shockAbsorption: 'Hydraulic',
    dashboard: 'Digital Tube',
    headlight: 'LED Adjustable',
    specialFeatures: [
      'Sleek & Compact Design',
      'Graphene Double Battery',
      'TTFAR Technology',
      '18 Mosfets 40A Controller',
      'Hydraulic Shock Absorber'
    ],
    description: 'Premium electric scooter featuring cutting-edge Graphene battery technology with double battery setup. Sleek design with hydraulic shock absorbers and TTFAR technology for maximum efficiency.'
  },
  {
    model: 'Yadea T5',
    brand: 'Yadea',
    image: '/t5 for website .jpeg',
    price: 20,
    range: '60+ km',
    maxRange: '80+ km',
    maxSpeed: '45 km/h+',
    motor: '1200W Wheel Hub',
    motorType: 'Wheel Hub Motor',
    battery: '72V 25Ah',
    batteryType: 'Graphene Battery',
    charger: '72V 4A',
    chargingTime: '8 hours',
    chargingCycles: '800-1000',
    originalPrice: 'LKR 459,950',
    featured: false,
    seating: '2 Seats',
    seatHeight: '700mm',
    saddleLength: '740mm',
    dimensions: '1780 x 670 x 1095 mm',
    tires: 'F&R: 3.00-10',
    brakes: 'F: Disc | R: Drum',
    shockAbsorption: 'Hydraulic Shock',
    dashboard: 'LED Digital Tube',
    headlight: '100% LED',
    specialFeatures: [
      'Hydraulic Shock Absorber',
      'TTFAR Technology',
      'LED Multicolor Dashboard',
      '100% LED Lighting',
      'Mid-Engine System'
    ],
    description: 'The Yadea T5 seamlessly blends top-notch efficiency with sleek, modern design. Perfect for eco-conscious urban commuters with its powerful motor, long-lasting Graphene battery, and agile handling.'
  }
];

const features = [
  {
    icon: Shield,
    title: 'Tourist-Only Service',
    description: 'Exclusively designed for international tourists visiting Sri Lanka. Valid passport required for booking',
    color: 'from-emerald-500 to-green-500'
  },
  {
    icon: Clock,
    title: 'Flexible Rentals',
    description: 'Rent by the hour, day, week, or month. Perfect for any travel itinerary',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Users,
    title: 'With or Without Driver',
    description: 'Choose self-drive for freedom or add a professional English-speaking driver',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    icon: MapPin,
    title: 'Island-Wide Coverage',
    description: 'Pick up and drop off anywhere in Sri Lanka. Airport delivery included',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'Pay only after availability is confirmed. Full refund on cancellations up to 48hrs',
    color: 'from-pink-500 to-rose-500'
  },
  {
    icon: Star,
    title: 'Verified & Insured',
    description: 'All vehicles are verified, insured, and maintained to international standards',
    color: 'from-amber-500 to-yellow-500'
  },
];

const howItWorks = [
  { step: 1, title: 'Select Your Vehicle', description: 'Browse vehicles, choose with or without driver, select dates and pickup location', icon: Car },
  { step: 2, title: 'Enter Your Details', description: 'Fill in your passport details, contact info, and special requirements', icon: Calendar },
  { step: 3, title: 'Request Availability', description: 'Click "Check Availability" - Our team receives your request instantly via email & WhatsApp', icon: CheckCircle2 },
  { step: 4, title: 'Get Confirmation', description: 'Within 2 hours, we confirm availability or suggest alternatives. You can modify if needed', icon: MessageCircle },
  { step: 5, title: 'Make Payment', description: 'Once confirmed, proceed to secure payment. Receive your booking voucher instantly', icon: CreditCard },
];

const stats = [
  { value: '500+', label: 'Verified Vehicles' },
  { value: '200+', label: 'Active Owners' },
  { value: '10,000+', label: 'Happy Renters' },
  { value: '4.8', label: 'Average Rating' },
];

const VehicleRental = () => {
  const navigate = useNavigate();
  const [vehicleType, setVehicleType] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pickupCity, setPickupCity] = useState('bandaranaike-airport');
  const [withDriver, setWithDriver] = useState(false);
  const [delivery, setDelivery] = useState(false);

  const handleQuickSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();

    if (vehicleType) params.set('type', vehicleType);
    if (pickupCity) params.set('city', pickupCity);
    if (pickupDate) params.set('start', pickupDate);
    if (returnDate) params.set('end', returnDate);
    if (withDriver) params.set('withDriver', 'true');
    if (delivery) params.set('delivery', 'true');

    navigate(`/vehicle-rental/browse${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <>
      <Helmet>
        <title>Vehicle Rental Sri Lanka | Cars, SUVs, Vans & Luxury | Recharge Travels</title>
        <meta name="description" content="Rent verified cars, SUVs, vans & luxury vehicles in Sri Lanka. Hourly to monthly rentals. With or without driver. Island-wide pickup & delivery." />
        <meta property="og:title" content="Vehicle Rental Sri Lanka | Recharge Travels" />
        <meta property="og:description" content="500+ verified vehicles for rent. Flexible hourly to yearly options. Self-drive or with driver." />
        <link rel="canonical" href="https://www.rechargetravels.com/vehicle-rental" />
      </Helmet>

      <Header />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 pb-20">
          <div className="pointer-events-none absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&h=800&fit=crop')] bg-cover bg-center opacity-20"></div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 px-4 py-2 text-sm text-blue-300 mb-6">
                  <Globe className="w-4 h-4" />
                  <span className="font-semibold">Exclusive Service for International Tourists</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Premium Vehicle
                  <span className="block mt-2 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                    Rental for Tourists
                  </span>
                </h1>

                <p className="text-lg text-gray-300 mb-8 max-w-lg">
                  Self-drive or with professional English-speaking driver.
                  Availability confirmed before payment. Island-wide pickup & delivery.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/vehicle-rental/browse"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-amber-500/30 transition-all hover:-translate-y-1"
                  >
                    Check Availability
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="#how-it-works"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all"
                  >
                    How It Works
                  </Link>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Search Card */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-6">Quick Search</h2>

                <form className="space-y-4" onSubmit={handleQuickSearch}>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Vehicle Type</label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-white/30 text-slate-900 focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                    >
                      <option value="">All Types</option>
                      <option value="economy">Economy</option>
                      <option value="compact">Compact</option>
                      <option value="sedan">Sedan</option>
                      <option value="suv">SUV</option>
                      <option value="van">Van</option>
                      <option value="mini-coach">Mini Coach</option>
                      <option value="luxury-coach">Luxury Coach</option>
                      <option value="luxury">Luxury</option>
                      <option value="e-scooter">🛵 E-Scooter (Jaffna Only)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Pickup Date</label>
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-white/30 text-slate-900 focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Return Date</label>
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-white/30 text-slate-900 focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Pickup Location</label>
                    <select
                      value={pickupCity}
                      onChange={(e) => setPickupCity(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-white/30 text-slate-900 focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                    >
                      <option value="">Select Location</option>
                      <option value="bandaranaike-airport">Bandaranaike Airport (CMB)</option>
                      <option value="jaffna-airport">Jaffna Airport (JAF)</option>
                      <option value="colombo">Colombo</option>
                      <option value="jaffna">Jaffna</option>
                      <option value="vavuniya">Vavuniya</option>
                      <option value="negombo">Negombo</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={withDriver}
                        onChange={(e) => setWithDriver(e.target.checked)}
                        className="w-4 h-4 rounded border-white/20 bg-white/10 text-amber-500 focus:ring-amber-400/50"
                      />
                      With Driver
                    </label>
                    <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={delivery}
                        onChange={(e) => setDelivery(e.target.checked)}
                        className="w-4 h-4 rounded border-white/20 bg-white/10 text-amber-500 focus:ring-amber-400/50"
                      />
                      Delivery
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                  >
                    Search Vehicles
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Vehicle Types */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Vehicle Type</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                From compact sedans to luxury SUVs and spacious vans, find the perfect vehicle for your journey
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {vehicleTypes.map((vehicle, idx) => (
                <Link
                  key={idx}
                  to={`/vehicle-rental/${vehicle.slug}`}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={vehicle.image}
                      alt={vehicle.type}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900">{vehicle.type}</h3>
                    <p className="text-sm text-gray-500">{vehicle.count} vehicles</p>
                    <p className="text-sm font-semibold text-amber-600 mt-1">From ${vehicle.priceFrom}/day</p>
                  </div>
                  <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    View Details →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Eco E-Scooters Section - Jaffna Exclusive */}
        <section className="py-16 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 px-4 py-2 text-sm text-emerald-700 mb-4">
                <Leaf className="w-4 h-4" />
                <span className="font-semibold">Eco-Friendly • Self-Drive Only • Jaffna Exclusive</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Eco E-Scooters</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore Jaffna the sustainable way! 100% electric scooters powered by Yadea -
                Sri Lanka's leading e-mobility brand. Zero emissions, maximum adventure.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {eScooters.map((scooter, idx) => (
                <div
                  key={idx}
                  className={`relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border-2 ${scooter.featured ? 'border-emerald-400' : 'border-transparent'
                    }`}
                >
                  {scooter.featured && (
                    <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      RECOMMENDED
                    </div>
                  )}

                  {/* Image */}
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-emerald-100 to-green-100">
                    <img
                      src={scooter.image}
                      alt={scooter.model}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <p className="text-white font-bold text-lg">{scooter.brand}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{scooter.model}</h3>
                        <p className="text-sm text-gray-500">Value: {scooter.originalPrice}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-emerald-600">${scooter.price}</p>
                        <p className="text-sm text-gray-500">per day</p>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">{scooter.description}</p>

                    {/* Key Specs Row */}
                    <div className="flex items-center justify-between bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl p-3 mb-4">
                      <div className="text-center">
                        <p className="text-xs opacity-80">Max Speed</p>
                        <p className="font-bold">{scooter.maxSpeed}</p>
                      </div>
                      <div className="text-center border-l border-white/30 pl-4">
                        <p className="text-xs opacity-80">Max Range</p>
                        <p className="font-bold">{scooter.maxRange}</p>
                      </div>
                      <div className="text-center border-l border-white/30 pl-4">
                        <p className="text-xs opacity-80">Seating + Top Speed</p>
                        <p className="font-bold">{scooter.seating}</p>
                      </div>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="flex items-center gap-2 bg-emerald-50 rounded-xl p-2.5">
                        <Zap className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-gray-500">Motor</p>
                          <p className="text-xs font-semibold text-gray-900">{scooter.motor}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-emerald-50 rounded-xl p-2.5">
                        <Battery className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-gray-500">{scooter.batteryType}</p>
                          <p className="text-xs font-semibold text-gray-900">{scooter.battery}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-emerald-50 rounded-xl p-2.5">
                        <Gauge className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-gray-500">Daily Range</p>
                          <p className="text-xs font-semibold text-gray-900">{scooter.range}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-emerald-50 rounded-xl p-2.5">
                        <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-gray-500">Brakes</p>
                          <p className="text-xs font-semibold text-gray-900">{scooter.brakes}</p>
                        </div>
                      </div>
                    </div>

                    {/* Extended Specs */}
                    <div className="bg-gray-50 rounded-xl p-3 mb-4 text-xs">
                      <div className="grid grid-cols-2 gap-y-2">
                        <div><span className="text-gray-500">Dimensions:</span> <span className="font-medium">{scooter.dimensions}</span></div>
                        <div><span className="text-gray-500">Tires:</span> <span className="font-medium">{scooter.tires}</span></div>
                        <div><span className="text-gray-500">Suspension:</span> <span className="font-medium">{scooter.shockAbsorption}</span></div>
                        <div><span className="text-gray-500">Dashboard:</span> <span className="font-medium">{scooter.dashboard}</span></div>
                        <div><span className="text-gray-500">Headlight:</span> <span className="font-medium">{scooter.headlight}</span></div>
                        <div><span className="text-gray-500">Cycles:</span> <span className="font-medium">{scooter.chargingCycles}</span></div>
                      </div>
                    </div>

                    {/* Special Features */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {scooter.specialFeatures.map((feature, fidx) => (
                        <span key={fidx} className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> {feature}
                        </span>
                      ))}
                    </div>

                    {/* Location Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        <Leaf className="w-3 h-3" /> Zero Emissions
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        <MapPin className="w-3 h-3" /> Jaffna Only
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                        <Users className="w-3 h-3" /> Self-Drive
                      </span>
                    </div>

                    {/* CTA */}
                    <Link
                      to={`/vehicle-rental/browse?type=e-scooter&model=${scooter.model.toLowerCase().replace(' ', '-')}&city=jaffna`}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                    >
                      Book Now - ${scooter.price}/day
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Info Banner */}
            <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200 max-w-3xl mx-auto">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Why Choose E-Scooters in Jaffna?</h4>
                  <p className="text-sm text-gray-600">
                    Jaffna's flat terrain and scenic routes make it perfect for electric scooters.
                    Visit the iconic Nallur Temple, explore Jaffna Fort, discover Point Pedro, and cruise along
                    the beautiful coastline - all while being eco-friendly. Charging stations available at pickup location.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                The most trusted vehicle rental platform in Sri Lanka with verified vehicles and reliable owners
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works - 5 Step Booking Process */}
        <section id="how-it-works" className="py-16 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 px-4 py-2 text-sm text-blue-700 mb-4">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-semibold">Availability Confirmed Before Payment</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Simple 5-step booking with availability confirmation. You only pay after we confirm the vehicle is available.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {howItWorks.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all h-full border-2 border-transparent hover:border-amber-200">
                    <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center mb-4">
                      <step.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                      {step.step}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-center">{step.title}</h3>
                    <p className="text-gray-600 text-xs text-center">{step.description}</p>
                  </div>
                  {idx < howItWorks.length - 1 && (
                    <div className="hidden md:flex absolute top-1/2 -right-2 w-4 h-4 text-amber-400 -translate-y-1/2 z-10">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Availability Process Info Box */}
            <div className="mt-10 grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">If Vehicle is Available</h4>
                    <p className="text-sm text-gray-600">
                      We'll confirm your booking within 2 hours via email and WhatsApp.
                      You can then proceed to secure payment and receive your voucher instantly.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">If Alternative Needed</h4>
                    <p className="text-sm text-gray-600">
                      We'll suggest similar vehicles or different dates. You can modify your request
                      as many times as needed until you're happy with your choice.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rental Periods - Tourist Focus */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 px-4 py-2 text-sm text-amber-700 mb-4">
                <Globe className="w-4 h-4" />
                <span className="font-semibold">For International Tourists Only</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Flexible Rental Periods</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choose the perfect rental duration for your Sri Lanka adventure
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { period: 'Daily', icon: Calendar, desc: 'Day trips & short stays', example: '1-6 days exploration', popular: true },
                { period: 'Weekly', icon: Calendar, desc: 'Extended island tours', example: '7-14 day island adventure', popular: true },
                { period: 'Monthly', icon: Calendar, desc: 'Long-term travel', example: '30+ days deep exploration', popular: false },
              ].map((option, idx) => (
                <div key={idx} className={`relative bg-white rounded-2xl p-6 shadow-md border-2 hover:shadow-lg transition-all text-center ${option.popular ? 'border-amber-400' : 'border-gray-100 hover:border-amber-200'
                  }`}>
                  {option.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </div>
                  )}
                  <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 flex items-center justify-center mb-4">
                    <option.icon className="w-7 h-7 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{option.period}</h3>
                  <p className="text-sm text-gray-600 mb-3">{option.desc}</p>
                  <p className="text-xs text-amber-600 font-medium">{option.example}</p>
                </div>
              ))}
            </div>

            {/* Tourist Notice */}
            <div className="mt-10 space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Important: Tourist Service Only</h4>
                    <p className="text-sm text-gray-600">
                      This vehicle rental service is exclusively designed for international tourists visiting Sri Lanka.
                      You will need to provide your valid passport and visa details during the booking process.
                      All prices are in USD and include comprehensive insurance coverage for foreign visitors.
                    </p>
                  </div>
                </div>
              </div>

              {/* Self-Drive Licence Notice */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <FileCheck className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Self-Drive: Temporary Licence Required</h4>
                    <p className="text-sm text-gray-600">
                      International tourists choosing self-drive must obtain a <strong>Sri Lanka-issued Temporary Driving Licence</strong> to legally drive in the country.
                      We can assist you with the application process. Alternatively, choose our "With Driver" option for a hassle-free experience
                      with professional English-speaking drivers who know the roads.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
              {[
                { icon: Shield, text: 'Verified Vehicles' },
                { icon: FileCheck, text: 'Document Checked' },
                { icon: Star, text: '4.8+ Ratings' },
                { icon: CheckCircle2, text: 'Insurance Included' },
                { icon: Smartphone, text: '24/7 Support' },
              ].map((badge, idx) => (
                <div key={idx} className="flex items-center gap-2 text-gray-700">
                  <badge.icon className="w-5 h-5 text-green-600" />
                  <span className="font-medium">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Hit the Road?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Explore Sri Lanka on your terms. Browse our collection of verified vehicles
              and book your perfect ride today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/vehicle-rental/browse"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-amber-500/30 transition-all hover:-translate-y-1"
              >
                Browse All Vehicles
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default VehicleRental;
