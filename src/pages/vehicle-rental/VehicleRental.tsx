import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
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
  TrendingUp,
  HeartHandshake
} from 'lucide-react';

const vehicleTypes = [
  { type: 'Sedans', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop', count: '50+', priceFrom: 25 },
  { type: 'SUVs', image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=250&fit=crop', count: '35+', priceFrom: 40 },
  { type: 'Vans', image: 'https://images.unsplash.com/photo-1559829604-f95e1c1e5cee?w=400&h=250&fit=crop', count: '25+', priceFrom: 50 },
  { type: 'Mini Coaches', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250&fit=crop', count: '15+', priceFrom: 85 },
  { type: 'Luxury', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop', count: '20+', priceFrom: 120 },
  { type: 'Convertibles', image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=250&fit=crop', count: '10+', priceFrom: 100 },
];

const features = [
  {
    icon: Shield,
    title: 'Verified Vehicles',
    description: 'All vehicles undergo thorough document verification including registration, insurance & roadworthiness checks',
    color: 'from-emerald-500 to-green-500'
  },
  {
    icon: Clock,
    title: 'Flexible Rentals',
    description: 'Rent by the hour, day, week, month or even yearly. Perfect for any travel need',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Users,
    title: 'With or Without Driver',
    description: 'Choose self-drive for freedom or add a professional driver for convenience',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    icon: MapPin,
    title: 'Island-Wide Coverage',
    description: 'Pick up and drop off anywhere in Sri Lanka. Delivery available to your hotel',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'Pay securely online or in cash. Full refund on cancellations up to 48hrs before',
    color: 'from-pink-500 to-rose-500'
  },
  {
    icon: Star,
    title: 'Top-Rated Owners',
    description: 'Read real reviews from travelers. Book with confidence from 4.5+ rated owners',
    color: 'from-amber-500 to-yellow-500'
  },
];

const howItWorks = [
  { step: 1, title: 'Search & Compare', description: 'Browse 500+ verified vehicles. Filter by type, price, amenities & availability', icon: Car },
  { step: 2, title: 'Choose Your Rental', description: 'Select hourly, daily, weekly or monthly. Add driver if needed', icon: Calendar },
  { step: 3, title: 'Book & Pay Securely', description: 'Instant confirmation. Pay online or choose cash on delivery', icon: CreditCard },
  { step: 4, title: 'Pick Up & Drive', description: 'Collect from owner or get delivered to your location', icon: MapPin },
];

const ownerBenefits = [
  { icon: TrendingUp, title: 'Earn Extra Income', description: 'Turn your idle vehicle into a money-making asset' },
  { icon: Calendar, title: 'Flexible Availability', description: 'Set your own schedule. Rent when you want' },
  { icon: Shield, title: 'Protected Rentals', description: 'Insurance coverage and verified customers' },
  { icon: Smartphone, title: 'Easy Management', description: 'Manage bookings, earnings & calendar from your phone' },
];

const stats = [
  { value: '500+', label: 'Verified Vehicles' },
  { value: '200+', label: 'Active Owners' },
  { value: '10,000+', label: 'Happy Renters' },
  { value: '4.8', label: 'Average Rating' },
];

const VehicleRental = () => {
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
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&h=800&fit=crop')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 px-4 py-2 text-sm text-amber-300 mb-6">
                  <Car className="w-4 h-4" />
                  <span>Sri Lanka's Premier Vehicle Rental Platform</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Rent Your Perfect
                  <span className="block mt-2 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                    Vehicle in Sri Lanka
                  </span>
                </h1>
                
                <p className="text-lg text-gray-300 mb-8 max-w-lg">
                  500+ verified vehicles from trusted owners. Hourly to yearly rentals. 
                  Self-drive or with professional driver. Island-wide service.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/vehicle-rental/browse"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-amber-500/30 transition-all hover:-translate-y-1"
                  >
                    Browse Vehicles
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/vehicle-rental/owner/register"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all"
                  >
                    List Your Vehicle
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
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Vehicle Type</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-amber-400/50">
                      <option value="">All Types</option>
                      <option value="sedan">Sedan</option>
                      <option value="suv">SUV</option>
                      <option value="van">Van</option>
                      <option value="luxury">Luxury</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Pickup Date</label>
                      <input 
                        type="date" 
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-amber-400/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Return Date</label>
                      <input 
                        type="date" 
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-amber-400/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Pickup Location</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-amber-400/50">
                      <option value="">Select City</option>
                      <option value="colombo">Colombo</option>
                      <option value="kandy">Kandy</option>
                      <option value="galle">Galle</option>
                      <option value="negombo">Negombo</option>
                      <option value="airport">Bandaranaike Airport</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/10 text-amber-500 focus:ring-amber-400/50" />
                      With Driver
                    </label>
                    <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/10 text-amber-500 focus:ring-amber-400/50" />
                      Delivery
                    </label>
                  </div>

                  <Link
                    to="/vehicle-rental/browse"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                  >
                    Search Vehicles
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
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

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {vehicleTypes.map((vehicle, idx) => (
                <Link
                  key={idx}
                  to={`/vehicle-rental/browse?type=${vehicle.type.toLowerCase()}`}
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
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-gray-500">{vehicle.count} vehicles</span>
                      <span className="text-sm font-semibold text-amber-600">From ${vehicle.priceFrom}/day</span>
                    </div>
                  </div>
                </Link>
              ))}
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

        {/* How It Works */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Rent a vehicle in 4 simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {howItWorks.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="bg-white rounded-2xl p-6 shadow-md text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center mb-4">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </div>
                  {idx < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 text-gray-300">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* For Vehicle Owners */}
        <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 border border-amber-500/30 px-4 py-2 text-sm text-amber-300 mb-6">
                  <HeartHandshake className="w-4 h-4" />
                  <span>Become a Vehicle Owner</span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                  Turn Your Vehicle Into
                  <span className="block text-amber-400">A Profitable Asset</span>
                </h2>
                
                <p className="text-gray-300 mb-8">
                  Join 200+ vehicle owners earning extra income on our platform. 
                  List your car, van, or SUV and start earning when it's not in use.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {ownerBenefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{benefit.title}</h4>
                        <p className="text-sm text-gray-400">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/vehicle-rental/owner/register"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-amber-500/30 transition-all"
                  >
                    Register as Owner
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/vehicle-rental/owner/login"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all"
                  >
                    Owner Login
                  </Link>
                </div>
              </div>

              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop"
                  alt="Vehicle Owner"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">$280</div>
                      <div className="text-sm text-gray-500">Avg. Monthly Earnings</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rental Periods */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Flexible Rental Options</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choose the rental period that suits your needs
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { period: 'Hourly', icon: Clock, desc: 'Perfect for quick trips', example: 'Airport transfers, city tours' },
                { period: 'Daily', icon: Calendar, desc: 'Day trips & short stays', example: 'Weekend getaways' },
                { period: 'Weekly', icon: Calendar, desc: 'Extended travel', example: '7+ days island tour' },
                { period: 'Monthly', icon: Calendar, desc: 'Long-term needs', example: 'Business, relocations' },
                { period: 'Yearly', icon: Calendar, desc: 'Maximum savings', example: 'Expats, long stays' },
              ].map((option, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:border-amber-200 hover:shadow-lg transition-all text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 flex items-center justify-center mb-4">
                    <option.icon className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{option.period}</h3>
                  <p className="text-sm text-gray-600 mb-2">{option.desc}</p>
                  <p className="text-xs text-amber-600">{option.example}</p>
                </div>
              ))}
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
