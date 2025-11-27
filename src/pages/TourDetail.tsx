
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { dbService, authService, storageService } from '@/lib/firebase-services';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Users, Star, Calendar, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const TourDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: tour, isLoading, error } = useQuery({
    queryKey: ['tour', id],
    queryFn: async () => {
      if (!id) throw new Error('Tour ID is required');
      
      const tours = await dbService.list('tours', [
        { field: 'id', operator: '==', value: id },
        { field: 'is_active', operator: '==', value: true }
      ]);
      
      if (!tours || tours.length === 0) {
        throw new Error('Tour not found');
      }
      
      return tours[0] as any;
    },
    enabled: !!id
  });

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading tour details..." />;
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour Not Found</h2>
          <p className="text-gray-600 mb-6">The tour you're looking for doesn't exist or is no longer available.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>{tour.title} - Recharge Travels</title>
        <meta name="description" content={tour.description} />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        {/* Hero Section */}
        <div className="relative h-96 bg-gray-900">
          <img 
                            src={tour.images?.[0] || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'} 
            alt={tour.title}
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{tour.title}</h1>
              <div className="flex items-center justify-center space-x-6 text-lg">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>{tour.destination}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>{tour.duration_days} days</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Max {tour.max_participants}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>About This Tour</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{tour.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-6">
                    <Badge variant="outline">{tour.tour_type}</Badge>
                    <Badge variant="outline">{tour.difficulty_level}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Tour Images */}
              {tour.images && tour.images.length > 1 && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Gallery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {tour.images.slice(1).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${tour.title} - Image ${index + 2}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Book This Tour</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        ${tour.price_per_person}
                      </div>
                      <div className="text-sm text-gray-500">per person</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span>{tour.duration_days} days</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Max Participants:</span>
                      <span>{tour.max_participants}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Difficulty:</span>
                      <span className="capitalize">{tour.difficulty_level}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Type:</span>
                      <span className="capitalize">{tour.tour_type}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 space-y-3">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Book Now
                    </Button>
                    <Button variant="outline" className="w-full">
                      Contact Us
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TourDetail;
