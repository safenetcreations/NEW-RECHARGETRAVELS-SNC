import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign,
  Clock,
  Star,
  Sparkles
} from 'lucide-react';
import { dbService, authService, storageService } from '@/lib/firebase-services';
import { toast } from 'sonner';

interface SearchFilters {
  query: string;
  location: string;
  dateRange: { from: Date | null; to: Date | null };
  guests: number;
  priceRange: [number, number];
  duration: string;
  category: string;
  rating: number;
  tags: string[];
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  rating: number;
  duration: string;
  image: string;
  category: string;
  tags: string[];
  availability: boolean;
}

export const SmartSearch: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    dateRange: { from: null, to: null },
    guests: 1,
    priceRange: [0, 1000],
    duration: '',
    category: '',
    rating: 0,
    tags: []
  });

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const popularSearches = [
    'Cultural tours Kandy',
    'Tea plantation visits',
    'Wildlife safari Yala',
    'Beach hotels Mirissa',
    'Adventure activities Ella'
  ];

  const availableLocations = [
    'Kandy', 'Colombo', 'Galle', 'Nuwara Eliya', 'Ella', 
    'Sigiriya', 'Anuradhapura', 'Mirissa', 'Yala', 'Bentota'
  ];

  const categories = [
    'Cultural Tours', 'Adventure', 'Wildlife', 'Beach', 
    'Hill Country', 'City Tours', 'Food & Culinary'
  ];

  const popularTags = [
    'UNESCO World Heritage', 'Temple Visits', 'Tea Plantations',
    'Wildlife Safari', 'Beach Activities', 'Train Rides',
    'Ayurveda & Spa', 'Local Cuisine', 'Photography'
  ];

  useEffect(() => {
    if (filters.query.length > 2) {
      searchContent();
    }
  }, [filters.query]);

  const searchContent = async () => {
    setLoading(true);
    try {
      const { data: tours } = await supabase
        .from('tours')
        .select('*')
        .eq('is_active', true)
        .ilike('title', `%${filters.query}%`);

      const { data: activities } = await supabase
        .from('activities')
        .select('*')
        .eq('is_active', true)
        .ilike('name', `%${filters.query}%`);

      const { data: hotels } = await supabase
        .from('hotels')
        .select('*')
        .eq('is_active', true)
        .ilike('name', `%${filters.query}%`);

      // Combine and format results
      const combinedResults: SearchResult[] = [
        ...(tours || []).map(tour => ({
          id: tour.id,
          title: tour.title,
          description: tour.description || '',
          location: tour.destination || '',
          price: tour.base_price || 0,
          rating: 4.5,
          duration: `${tour.duration_days} days`,
          image: '/placeholder.svg',
          category: 'Tours',
          tags: Array.isArray(tour.includes) ? tour.includes.filter((item): item is string => typeof item === 'string').slice(0, 3) : [],
          availability: true
        })),
        ...(activities || []).map(activity => ({
          id: activity.id,
          title: activity.name,
          description: activity.description || '',
          location: 'Various Locations',
          price: activity.price || 0,
          rating: activity.average_rating || 4.0,
          duration: `${activity.duration} hours`,
          image: '/placeholder.svg',
          category: 'Activities',
          tags: Array.isArray(activity.what_included) ? activity.what_included.filter((item): item is string => typeof item === 'string').slice(0, 3) : [],
          availability: true
        })),
        ...(hotels || []).map(hotel => ({
          id: hotel.id,
          title: hotel.name,
          description: hotel.description || '',
          location: hotel.address || '',
          price: hotel.base_price_per_night || 0,
          rating: 4.3,
          duration: 'Per night',
          image: '/placeholder.svg',
          category: 'Accommodation',
          tags: Array.isArray(hotel.amenities) ? hotel.amenities.slice(0, 3) : [],
          availability: true
        }))
      ];

      setResults(combinedResults);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = useMemo(() => {
    return results.filter(result => {
      if (filters.location && !result.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      if (filters.category && result.category !== filters.category) {
        return false;
      }
      if (result.price < filters.priceRange[0] || result.price > filters.priceRange[1]) {
        return false;
      }
      if (filters.rating > 0 && result.rating < filters.rating) {
        return false;
      }
      if (filters.tags.length > 0 && !filters.tags.some(tag => result.tags.includes(tag))) {
        return false;
      }
      return true;
    });
  }, [results, filters]);

  const handleTagToggle = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search destinations, tours, activities..."
                value={filters.query}
                onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                className="pl-10"
              />
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-background border rounded-md mt-1 z-10">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-muted cursor-pointer"
                      onClick={() => setFilters(prev => ({ ...prev, query: suggestion }))}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {showFilters && <Badge className="ml-2">Open</Badge>}
            </Button>
            
            <Button onClick={searchContent} disabled={loading}>
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Smart Search
            </Button>
          </div>

          {/* Popular Searches */}
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">Popular searches:</p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => setFilters(prev => ({ ...prev, query: search }))}
                >
                  {search}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Location Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </label>
                <Select
                  value={filters.location || 'any_location'}
                  onValueChange={(value) =>
                    setFilters(prev => ({
                      ...prev,
                      location: value === 'any_location' ? '' : value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any_location">Any location</SelectItem>
                    {availableLocations.map(location => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={filters.category || 'any_category'}
                  onValueChange={(value) =>
                    setFilters(prev => ({
                      ...prev,
                      category: value === 'any_category' ? '' : value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any_category">Any category</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Guests */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Guests
                </label>
                <Select value={filters.guests.toString()} onValueChange={(value) => 
                  setFilters(prev => ({ ...prev, guests: parseInt(value) }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,7,8].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
                  max={1000}
                  step={50}
                  className="w-full"
                />
              </div>

              {/* Minimum Rating */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Minimum Rating
                </label>
                <Select value={filters.rating.toString()} onValueChange={(value) => 
                  setFilters(prev => ({ ...prev, rating: parseFloat(value) }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any rating</SelectItem>
                    <SelectItem value="3">3+ stars</SelectItem>
                    <SelectItem value="4">4+ stars</SelectItem>
                    <SelectItem value="4.5">4.5+ stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags Filter */}
            <div className="mt-6 space-y-2">
              <label className="text-sm font-medium">Experience Tags</label>
              <div className="flex flex-wrap gap-2">
                {popularTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={filters.tags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredResults.map(result => (
          <Card key={result.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={result.image} 
                alt={result.title}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-2 right-2">
                {result.category}
              </Badge>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{result.title}</h3>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {result.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  {result.location}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  {result.duration}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-yellow-500" />
                  {result.rating} rating
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">
                  ${result.price}
                </span>
                <Button size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && filteredResults.length === 0 && filters.query && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No results found for "{filters.query}"
            </p>
            <Button variant="outline" onClick={() => setFilters(prev => ({ ...prev, query: '' }))}>
              Clear Search
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};