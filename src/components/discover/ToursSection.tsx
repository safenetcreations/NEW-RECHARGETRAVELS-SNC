import React, { useState, useEffect } from 'react';
import { Star, MapPin, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/LoadingSpinner';
import { dbService, authService, storageService } from '@/lib/firebase-services';

interface Tour {
  id: string;
  title: string;
  description: string;
  price_per_person: number;
  tour_type: string;
  ai_recommendation_score: number;
  duration_days: number;
  max_participants: number;
  destination: string;
}


interface ToursSectionProps {
  activeFilter?: string;
  searchQuery?: string;
  onFilterChange?: (filter: string) => void;
}

const ToursSection: React.FC<ToursSectionProps> = ({ activeFilter = 'all', searchQuery = '', onFilterChange }) => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  const filters = [
    { id: 'all', name: 'All Tours' },
    { id: 'beaches', name: 'Beaches' },
    { id: 'temples', name: 'Temples' },
    { id: 'wildlife', name: 'Wildlife' },
    { id: 'hill-country', name: 'Hill Country' },
    { id: 'cultural', name: 'Cultural' },
    { id: 'adventure', name: 'Adventure' }
  ];

  // Fetch tours from database
  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('tours')
          .select('*')
          .eq('is_active', true);

        // Filter by tour type if not 'all'
        if (activeFilter !== 'all') {
          // Map categories to tour types
          const categoryToType: { [key: string]: string } = {
            'beaches': 'luxury',
            'temples': 'cultural',
            'wildlife': 'wildlife',
            'hill-country': 'cultural',
            'cultural': 'cultural',
            'adventure': 'adventure'
          };
          
          if (categoryToType[activeFilter]) {
            query = query.eq('tour_type', categoryToType[activeFilter]);
          }
        }

        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching tours:', error);
          setTours([]);
        } else {
          setTours(data || []);
        }
      } catch (error) {
        console.error('Error fetching tours:', error);
        setTours([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [activeFilter]);

  const getCategoryColor = (tourType: string) => {
    const colors: { [key: string]: string } = {
      luxury: 'bg-blue-100 text-blue-800',
      cultural: 'bg-orange-100 text-orange-800',
      wildlife: 'bg-green-100 text-green-800',
      adventure: 'bg-teal-100 text-teal-800'
    };
    return colors[tourType] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryGradient = (tourType: string) => {
    const gradients: { [key: string]: string } = {
      luxury: 'from-blue-300 to-blue-500',
      cultural: 'from-orange-300 to-red-500',
      wildlife: 'from-green-300 to-green-500',
      adventure: 'from-teal-300 to-teal-500'
    };
    return gradients[tourType] || 'from-gray-300 to-gray-500';
  };

  const getCategoryButtonColor = (tourType: string) => {
    const colors: { [key: string]: string } = {
      luxury: 'bg-blue-600 hover:bg-blue-700',
      cultural: 'bg-orange-600 hover:bg-orange-700',
      wildlife: 'bg-green-600 hover:bg-green-700',
      adventure: 'bg-teal-600 hover:bg-teal-700'
    };
    return colors[tourType] || 'bg-gray-600 hover:bg-gray-700';
  };

  const filteredTours = tours.filter(tour => {
    const matchesSearch = !searchQuery || 
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  return (
    <section id="tours" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Tours</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Carefully curated experiences for every traveler
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center mb-12 gap-4 fade-in-up">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              onClick={() => onFilterChange?.(filter.id)}
              variant={activeFilter === filter.id ? "default" : "outline"}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 hover:scale-105'
              }`}
            >
              {filter.name}
            </Button>
          ))}
        </div>

        {/* Tour Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTours.map((tour, index) => (
            <div
              key={tour.id}
              className={`tour-card bg-white rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl fade-in-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Tour Image Placeholder */}
              <div className={`h-48 bg-gradient-to-br ${getCategoryGradient(tour.tour_type)} flex items-center justify-center relative`}>
                <MapPin className="h-16 w-16 text-white/80" />
                <div className="absolute top-4 right-4">
                  <Badge className={getCategoryColor(tour.tour_type)}>
                    {tour.tour_type.charAt(0).toUpperCase() + tour.tour_type.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(tour.ai_recommendation_score) ? 'fill-current' : ''}`}
                      />
                    ))}
                    <span className="ml-1 text-sm text-gray-600">({tour.ai_recommendation_score})</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2 text-gray-800">{tour.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{tour.description}</p>

                {/* Tour Details */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {tour.duration_days} day{tour.duration_days > 1 ? 's' : ''}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Max {tour.max_participants}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-gray-800">
                    ${tour.price_per_person}
                    <span className="text-sm font-normal text-gray-500">/person</span>
                  </div>
                  <Button
                    onClick={() => setSelectedTour(tour)}
                    className={`${getCategoryButtonColor(tour.tour_type)} text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105`}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTours.length === 0 && (
          <div className="text-center py-12 fade-in-up">
            <div className="text-gray-400 mb-4">
              <MapPin className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No tours found</h3>
            <p className="text-gray-500">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ToursSection;