// Global Tours Listing Page
// Browse all available tours

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Star,
  Users,
  DollarSign,
  Globe,
  ChevronDown,
  X,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getGlobalTours, getFeaturedTours } from '@/services/globalTourService';
import { GlobalTour, TourFilters, TourRegion, TourCategory } from '@/types/global-tour';
import Header from '@/components/Header';
import RechargeFooter from '@/components/ui/RechargeFooter';

const regionLabels: Record<TourRegion, string> = {
  'sri-lanka': 'Sri Lanka',
  'maldives': 'Maldives',
  'india': 'India',
  'southeast-asia': 'Southeast Asia',
  'worldwide': 'Worldwide'
};

const categoryLabels: Record<TourCategory, string> = {
  'wildlife': 'Wildlife Safari',
  'cultural': 'Cultural Heritage',
  'beach': 'Beach & Relaxation',
  'adventure': 'Adventure',
  'wellness': 'Wellness & Spa',
  'heritage': 'Heritage Sites',
  'pilgrimage': 'Pilgrimage',
  'honeymoon': 'Honeymoon',
  'family': 'Family Friendly',
  'luxury': 'Luxury'
};

const GlobalToursListing = () => {
  const [tours, setTours] = useState<GlobalTour[]>([]);
  const [featuredTours, setFeaturedTours] = useState<GlobalTour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<TourFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({});
  const [durationRange, setDurationRange] = useState<{ min?: number; max?: number }>({});

  useEffect(() => {
    const fetchTours = async () => {
      setIsLoading(true);
      try {
        const [allTours, featured] = await Promise.all([
          getGlobalTours(filters),
          getFeaturedTours(4)
        ]);
        setTours(allTours.tours);
        setFeaturedTours(featured);
      } catch (error) {
        console.error('Error fetching tours:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTours();
  }, [filters]);

  const handleSearch = () => {
    setFilters({
      ...filters,
      searchQuery,
      region: selectedRegion as TourRegion || undefined,
      category: selectedCategory as TourCategory || undefined,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      minDuration: durationRange.min,
      maxDuration: durationRange.max
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRegion('');
    setSelectedCategory('');
    setPriceRange({});
    setDurationRange({});
    setFilters({});
  };

  const filteredTours = tours.filter(tour => {
    if (searchQuery && !tour.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !tour.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !tour.location.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedRegion && tour.region !== selectedRegion) return false;
    if (selectedCategory && tour.category !== selectedCategory) return false;
    if (priceRange.min && tour.priceUSD < priceRange.min) return false;
    if (priceRange.max && tour.priceUSD > priceRange.max) return false;
    if (durationRange.min && tour.duration.days < durationRange.min) return false;
    if (durationRange.max && tour.duration.days > durationRange.max) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Tour Packages | Explore Sri Lanka & Beyond | Recharge Travels</title>
        <meta name="description" content="Discover our curated tour packages to Sri Lanka, Maldives, India and beyond. Wildlife safaris, cultural heritage tours, beach getaways and more." />
      </Helmet>

      <Header />

      {/* Hero Section */}
      <div className="relative h-[50vh] bg-gradient-to-r from-emerald-600 to-teal-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1588598198321-9735fd52dc37?w=1600')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Explore Amazing Tours
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Discover handcrafted travel experiences across Sri Lanka, Maldives, India and beyond
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search tours, destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="h-12"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
              <Button
                onClick={handleSearch}
                className="h-12 bg-emerald-600 hover:bg-emerald-700"
              >
                Search Tours
              </Button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Region</label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="">All Regions</option>
                    {Object.entries(regionLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="">All Categories</option>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Price Range (USD)</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min || ''}
                      onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || undefined })}
                      className="text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max || ''}
                      onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || undefined })}
                      className="text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Duration (Days)</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={durationRange.min || ''}
                      onChange={(e) => setDurationRange({ ...durationRange, min: parseInt(e.target.value) || undefined })}
                      className="text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={durationRange.max || ''}
                      onChange={(e) => setDurationRange({ ...durationRange, max: parseInt(e.target.value) || undefined })}
                      className="text-sm"
                    />
                  </div>
                </div>
                <div className="col-span-2 md:col-span-4 flex justify-end">
                  <Button variant="ghost" onClick={clearFilters} className="text-gray-600">
                    <X className="w-4 h-4 mr-2" /> Clear All Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Tours */}
      {featuredTours.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Tours</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTours.map((tour) => (
              <Link key={tour.id} to={`/tours/${tour.slug}`} className="group">
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all h-full">
                  <div className="relative h-48">
                    <img
                      src={tour.heroImage}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-yellow-500 text-black">
                        <Star className="w-3 h-3 mr-1 fill-current" /> Featured
                      </Badge>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <p className="text-2xl font-bold text-white">
                        ${tour.pricePerPersonUSD || tour.priceUSD}
                        <span className="text-sm font-normal opacity-80">/person</span>
                      </p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {tour.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {tour.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {tour.duration.days}D/{tour.duration.nights}N
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* All Tours */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            All Tours
            {filteredTours.length > 0 && (
              <span className="text-lg font-normal text-gray-500 ml-2">
                ({filteredTours.length} tours)
              </span>
            )}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
          </div>
        ) : filteredTours.length === 0 ? (
          <div className="text-center py-20">
            <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tours Found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((tour) => (
              <Link key={tour.id} to={`/tours/${tour.slug}`} className="group">
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all h-full">
                  <div className="relative h-56">
                    <img
                      src={tour.heroImage}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className="bg-white/90 text-gray-800 capitalize">
                        {tour.region.replace('-', ' ')}
                      </Badge>
                      {tour.isPopular && (
                        <Badge className="bg-red-500 text-white">Popular</Badge>
                      )}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-3xl font-bold text-white">
                            ${tour.pricePerPersonUSD || tour.priceUSD}
                          </p>
                          <p className="text-white/80 text-sm">per person</p>
                        </div>
                        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-white font-medium">{tour.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {tour.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {tour.shortDescription || tour.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        {tour.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-emerald-600" />
                        {tour.duration.days}D/{tour.duration.nights}N
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-emerald-600" />
                        {tour.minGroupSize}-{tour.maxGroupSize}
                      </span>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <Badge className="bg-emerald-100 text-emerald-800 capitalize">
                        {tour.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <RechargeFooter />
    </div>
  );
};

export default GlobalToursListing;
