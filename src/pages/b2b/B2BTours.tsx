import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Search,
  Filter,
  MapPin,
  Clock,
  Users,
  Percent,
  ArrowLeft,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { useB2BAuth } from '@/contexts/B2BAuthContext';
import { useB2BApi } from '@/hooks/useB2BApi';
import { B2BTour } from '@/types/b2b';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'cultural', label: 'Cultural Tours' },
  { value: 'wildlife', label: 'Wildlife Safari' },
  { value: 'beach', label: 'Beach Tours' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'wellness', label: 'Wellness & Ayurveda' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'honeymoon', label: 'Honeymoon' }
];

const B2BTours = () => {
  const { isAuthenticated, isLoading: authLoading } = useB2BAuth();
  const { getTours, calculatePrice, loading } = useB2BApi();
  
  const [tours, setTours] = useState<B2BTour[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchTours = async () => {
      const result = await getTours({
        category: selectedCategory || undefined,
        limit: 50
      });
      if (result.success && result.data) {
        setTours(result.data);
      }
    };

    if (isAuthenticated) {
      fetchTours();
    }
  }, [isAuthenticated, selectedCategory, getTours]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/about/partners/b2b/login" replace />;
  }

  const filteredTours = tours.filter(tour =>
    tour.tourName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tour.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Browse Tours | B2B Portal | Recharge Travels</title>
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-slate-100 via-emerald-50/30 to-teal-50/30 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/about/partners/b2b/dashboard"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Browse Tours</h1>
            <p className="text-slate-600">All tours include automatic 10% B2B discount</p>
          </div>

          {/* Search & Filters */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tours by name or description..."
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full md:w-48 pl-4 pr-10 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Tours Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
          ) : filteredTours.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTours.map((tour) => {
                const pricing = calculatePrice(tour.priceUSD, 1);
                return (
                  <div
                    key={tour.id}
                    className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden hover:shadow-xl transition-all group"
                  >
                    {/* Image */}
                    <div className="relative h-48 bg-gradient-to-br from-emerald-400 to-teal-500">
                      {tour.images?.[0] && (
                        <img
                          src={tour.images[0]}
                          alt={tour.tourName}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {/* Discount Badge */}
                      <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                        <Percent className="w-3 h-3" />
                        10% OFF
                      </div>
                      {/* Category Badge */}
                      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium capitalize">
                        {tour.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                        {tour.tourName}
                      </h3>
                      <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                        {tour.description}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {tour.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          Max {tour.maxCapacity}
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-end justify-between pt-4 border-t border-slate-100">
                        <div>
                          <p className="text-xs text-slate-500 line-through">${tour.priceUSD}/person</p>
                          <p className="text-2xl font-bold text-emerald-600">${pricing.finalPrice}</p>
                          <p className="text-xs text-slate-500">per person (with B2B discount)</p>
                        </div>
                        <Link
                          to={`/about/partners/b2b/book/${tour.id}`}
                          className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-600 transition-all"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <MapPin className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No tours found</h3>
              <p className="text-slate-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default B2BTours;
